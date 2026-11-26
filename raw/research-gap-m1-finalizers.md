# Research dossier: gap cluster m1-finalizers

Research date: 2026-11-26

## Overview

This pass read primary sources for five finalizer gaps: Argo CD's Application deletion finalizers, the Flux Kustomization finalizer, Crossplane issue 7801, the finalizer names used by ACK, Config Connector and kro, and Cluster API issue 1514. Sources were raw GitHub files (docs and Go source on each project's default branch, fetched 2026-11-26), `gh` issue and PR metadata, and the issue threads. "main/master" below means the default branch as read on that date, not a tagged release. Latest releases seen on that date: Argo CD v3.6.3 (2026-11-24), Flux kustomize-controller v1.10.2 (2026-11-20), Crossplane v2.5.0 (2026-11-24), ACK runtime v0.68.0 (2026-11-09), kro v0.10.0 (2026-11-10), Config Connector v1.162.0 (2026-11-23), Cluster API v1.14.4 (2026-11-03). The source on the default branch may be ahead of those tags.

Four of the five gaps are answerable from source code and docs. Argo CD has three propagation finalizers (plain, `/foreground`, `/background`), plus separate pre-delete and post-delete hook finalizers, and a non-cascading delete is done by removing the finalizer. Flux uses `finalizers.fluxcd.io` and the four `deletionPolicy` values are in the API types and the controller's finalize function. ACK, Config Connector and kro each use distinct finalizer names that are visible in source. Cluster API issue 1514 was closed in favor of a CAEP, and the implemented proposal chose annotations rather than finalizers.

Crossplane issue 7801 is the exception: it is still open with no maintainer reply and no linked fix as of the read date. Only the related work (ProviderConfig protection, crossplane-runtime PR 1113 and one-pager PR 7594) has merged. The Secret-protection question is unresolved.

Which finalizer or hook mechanism a platform should prefer is a user decision; this dossier lists what each source says and does not recommend.

## Gap: Argo CD finalizer variants and non-cascading deletes

The Argo CD App Deletion page (master) lists the finalizer as `resources-finalizer.argocd.argoproj.io` and says its default is foreground cascading deletion. An alternative `resources-finalizer.argocd.argoproj.io/background` selects background cascading deletion. The source constants add a third spelling, `.../foreground`, which is the explicit foreground form; the docs page shows only the bare name as default and the `/background` variant. The controller treats all three names as "cascading delete" finalizers (`isPropagationPolicyFinalizer`), and its delete loop uses background propagation only if the finalizer is exactly the `/background` one; otherwise foreground. The delete loop returns early (waits) while any live object it lists still has a deletionTimestamp; the code comment says "before proceeding with next sync wave". [corrected in verification: the earlier claim that the loop processes sync waves in reverse is not supported by appcontroller.go or app_deletion.md and was removed.]

Two other finalizers exist in source: `pre-delete-finalizer.argocd.argoproj.io` and `post-delete-finalizer.argocd.argoproj.io` (PreDelete and PostDelete hook execution), with an optional `/stage` suffix. These are separate from the resource-cascade finalizers.

Non-cascading deletes: `argocd app delete APP --cascade=false`; or with kubectl, patch `finalizers` to null and then delete the app. In the UI the three choices are Foreground (default), Background and Non-Cascading (Orphan); the Non-Cascading choice removes the resources finalizer and deletes only the Application. From Argo CD 3.2 the UI deletion from the resource tree uses the same Application deletion API. `--propagation-policy` is available on the CLI with `--cascade`. The sync option `PrunePropagationPolicy` (background, foreground, orphan) is documented under Sync Options and governs pruning during sync, not Application deletion. The wiki's earlier note already mentioned ApplicationSet `preserveResourcesOnDeletion`; this page's options are the additional ones. Not settled: whether the Application controller treats the `/foreground` spelling differently from the bare name (source shows foreground as the fall-through default, so no behavioral difference was found in the code read).

Claims:
- Bare finalizer name is `resources-finalizer.argocd.argoproj.io`. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/pkg/apis/application/v1alpha1/application_defaults.go (master, read 2026-11-26). Quote: `ResourcesFinalizerName string = "resources-finalizer.argocd.argoproj.io"`
- Explicit variants `.../foreground` and `.../background` exist as constants. VERIFIED. Same URL. Quote: `BackgroundPropagationPolicyFinalizer = "resources-finalizer.argocd.argoproj.io/background"`
- Docs say default is foreground cascading deletion and `/background` gives background deletion. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/docs/user-guide/app_deletion.md (master). Quote: "The default propagation policy for cascading deletion is foreground cascading deletion."
- Controller picks background only for the `/background` finalizer, else foreground. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/controller/appcontroller.go (master). Quote: `if app.GetPropagationPolicy() == appv1.BackgroundPropagationPolicyFinalizer {`
- All three names count as cascading-delete finalizers. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/pkg/apis/application/v1alpha1/types.go (master). Quote: `case ResourcesFinalizerName, ForegroundPropagationPolicyFinalizer, BackgroundPropagationPolicyFinalizer:`
- Pre-delete and post-delete hook finalizers exist with these names. VERIFIED. application_defaults.go URL above. Quote: `PreDeleteFinalizerName string = "pre-delete-finalizer.argocd.argoproj.io"`
- Non-cascade delete via CLI is `--cascade=false`. VERIFIED. app_deletion.md URL above. Quote: "argocd app delete APPNAME --cascade=false"
- Non-cascade delete via kubectl is unsetting the finalizer then deleting. VERIFIED. Same URL. Quote: "make sure the finalizer is unset and then delete the app"
- UI offers Foreground (default), Background and Non-Cascading (Orphan); Non-Cascading keeps all managed resources and removes the finalizer. VERIFIED. Same URL (docs mention Argo CD 3.2 consistency change). Quote: "Delete only the Application resource"
- `PrunePropagationPolicy` sync option supports background, foreground, orphan (applies to pruning). VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/docs/user-guide/sync-options.md (master). Quote: "Supported policies are background, foreground, and orphan."
- Delete loop waits for objects with a deletionTimestamp before proceeding (code comment mentions next sync wave; reverse-order processing was not found in source). VERIFIED (re-checked in verification). appcontroller.go URL. Quote: "Wait for objects pending deletion to complete before proceeding with next sync wave"

## Gap: Flux Kustomization finalizer name and behavior

The kustomize-controller API types define `KustomizationFinalizer = "finalizers.fluxcd.io"`. The reconciler adds it first, before any other work, and the code comment explains this avoids a race since finalizers can only be added when no deletionTimestamp is set. On deletion, `finalize` prunes the inventory only if `finalizerShouldDeleteResources` is true: never when the Kustomization is suspended or its inventory is empty; for `MirrorPrune` (the default) only when `spec.prune` is true; for `Delete` and `WaitForTermination` always; for `Orphan` never. With `WaitForTermination` the controller waits for the changeset to terminate, with interval 2 seconds and timeout set to the Kustomization's timeout (`obj.GetTimeout()`); if the wait fails it logs and emits an error event, and the finalizer is still removed. If the impersonated service account is gone, it logs the stale objects and also continues to remove the finalizer. Waiting is on the child objects' termination (so on their own finalizers via the garbage collector), but a timeout does not hold the Kustomization.

The docs (spec/v1) state the four values and that `WaitForTermination` waits for removal from etcd by the garbage collector. Flux uses inventory-based deletion (status inventory entries), not owner references; the source read shows deletion by inventory list. Not settled: how the older beta API versions behaved; only the v1 type and current controller were read.

Claims:
- Finalizer name is `finalizers.fluxcd.io`. VERIFIED. https://raw.githubusercontent.com/fluxcd/kustomize-controller/main/api/v1/kustomization_types.go (main, read 2026-11-26). Quote: `KustomizationFinalizer    = "finalizers.fluxcd.io"`
- Deletion policy values are MirrorPrune, Delete, WaitForTermination, Orphan; default MirrorPrune. VERIFIED. Same URL. Quote: "Valid values are ('MirrorPrune', 'Delete', 'WaitForTermination', 'Orphan')."
- Finalizer is added first to avoid a race. VERIFIED. https://raw.githubusercontent.com/fluxcd/kustomize-controller/main/internal/controller/kustomization_controller.go (main). Quote: "Add finalizer first if it doesn't exist to avoid the race condition"
- Resources are not deleted when suspended or when inventory is empty. VERIFIED. Same URL. Quote: "A suspended Kustomization or one without an inventory will not delete resources."
- Per-policy decision: MirrorPrune returns `obj.Spec.Prune`; Delete and WaitForTermination true; others false. VERIFIED. Same URL. Quote: `return obj.Spec.Prune`
- WaitForTermination wait uses 2s interval and the object timeout; timeout logs an error and finalizer is removed. VERIFIED. Same URL. Quote: "while waiting for resources to be terminated, an error is logged and the finalizer is removed."
- Missing impersonation account: logs stale objects, continues finalization. VERIFIED. Same URL. Quote: "the account to impersonate is gone, log the stale objects and continue with the finalization"
- Docs: WaitForTermination waits for removal from etcd by the garbage collector, bounded by `.spec.timeout`. VERIFIED. https://raw.githubusercontent.com/fluxcd/kustomize-controller/main/docs/spec/v1/kustomizations.md (main). Quote: "allow the Kustomization to be deleted."

## Gap: Resolution of Crossplane issue 7801 on credential protection

Issue crossplane/crossplane#7801, "Protect ProviderConfig credentials until managed resources finish deleting", was opened 2026-09-02 and is OPEN as of 2026-11-26, label `enhancement`. The body lists three undecided directions: keep the Secret alive via `Usage` machinery or a generic dependency-protection controller; have providers cache credentials for the deletion; or order namespace teardown so ProviderConfigs and Secrets finalize after managed resources. It states the Secret has no finalizer and that design PR 7594 listed this as an explicit out-of-scope limitation.

The thread has two comments, no maintainer reply. On 2026-10-14 a commenter reported live measurements from provider-gitlab (issue 429) and listed three options: protect the Secret with a finalizer (said to have fixed it in their runs), cache credentials in the provider (9/9 in prototype but fails after restart), or document deleting MRs before the namespace. They ask "Is (1) still the plan?" On 2026-10-28 another user offered to contribute and asked which approach is preferred. No answer is recorded. Related items: crossplane-runtime PR 1113 ("Protect ProviderConfigs while managed resources terminate") merged 2026-09-08; Crossplane PR 7594 (one-pager on ProviderConfig deletion protection) merged 2026-09-08; issue 4661 closed 2026-09-08. The timeline showed no linked PR to 7801 itself. The decision on Secret finalizers, caching or ordered teardown therefore stays open; the wiki's finding and decision page can record the measured data from the comment (note that it is a third-party measurement on a specific build, not a Crossplane maintainer result).

Claims:
- Issue 7801 is open, created 2026-09-02, no closedAt. VERIFIED. https://github.com/crossplane/crossplane/issues/7801 (read via gh 2026-11-26). Quote: "Protect ProviderConfig credentials until managed resources finish deleting"
- Body lists three possible directions, "none of them decided". VERIFIED. Same URL. Quote: "Possible directions, none of them decided"
- Body says the Secret is not protected while the ProviderConfig is. VERIFIED. Same URL. Quote: "the `Secret` those credentials come from is not."
- PR 7594 treats Secret protection as an out-of-scope limitation. VERIFIED (as quoted in the issue body). Same URL. Quote: "keeps it out of scope"
- crossplane-runtime PR 1113 merged 2026-09-08. VERIFIED. https://github.com/crossplane/crossplane-runtime/pull/1113 (gh pr view). Quote: "Protect ProviderConfigs while managed resources terminate"
- Crossplane PR 7594 merged 2026-09-08. VERIFIED. https://github.com/crossplane/crossplane/pull/7594. Quote: "Add one-pager for `ProviderConfig` deletion protection under foreground deletion"
- Issue 4661 closed 2026-09-08. VERIFIED. https://github.com/crossplane/crossplane/issues/4661. Quote: "ProviderConfigUsage does not work when deletion policy is set to Foreground"
- Comment of 2026-10-14 reports a Secret finalizer fixed their runs and caching prototype failed after restart. SECONDARY-ONLY (third-party measurement). https://github.com/crossplane/crossplane/issues/7801. Quote: "holding the Secret with a finalizer fixed it in our runs."
- No maintainer response in the thread (two comments, neither from a maintainer-labeled author; both author_association none). VERIFIED for the thread as read. Same URL. Quote: "Is (1) still the plan? Happy to test a branch."
- Downstream provider-gitlab issue 429 is open. VERIFIED. https://github.com/crossplane-contrib/provider-gitlab/issues/429. Quote: "namespace deletion hangs and leaks GitLab resources"

## Gap: How ACK, Config Connector, and kro name and remove their finalizers

ACK: the code generator template defines `FinalizerString = "finalizers.{{ .APIGroup }}/{{ .CRD.Kind }}"`, so the name is per API group and kind (for example, a service's group plus the kind). `MarkManaged` adds it, `MarkUnmanaged` removes it. In the runtime reconciler, `setResourceManaged` adds it when the resource is reconciled, and on delete the reconciler first cleans up the AWS resource (a requeue is returned for asynchronous deletes) and only then calls `setResourceUnmanaged`, whose comment says it allows the API server to delete the CR. The literal rendered string for a particular service (such as the s3 group) was not read from a generated controller; the template form is what was verified.

Config Connector: `pkg/k8s/constants.go` defines `cnrm.cloud.google.com/finalizer` (ControllerFinalizerName) and `cnrm.cloud.google.com/deletion-defender` (DeletionDefenderFinalizerName). The lifecycle handler's `HandleDeleted` removes the controller finalizer after recording the Deleted condition and status. A separate deletion-defender controller removes only the deletion-defender finalizer when the resource is being deleted, so the main controller then deletes the GCP resource; if the CRD is being uninstalled it removes both finalizers and sets the deletion-policy annotation to abandon. Not settled: when the deletion-defender finalizer is added (which resources, which versions); only the removal side was read. The direct controllers (many files under `pkg/controller/direct`) were not read individually.

kro: instance finalizer is `kro.run/finalizer` (`KRODomainName + "/finalizer"`); the same name is used on ResourceGraphDefinition and GraphRevision objects, and a separate `kro.run/graph-finalizer` exists for Graph objects. The instance deletion path rebuilds the inventory from ApplySet metadata, releases resources whose deletion policy is orphan (when the DeletionPolicy feature gate is on), deletes the highest remaining wave, requeues, and when no candidates remain releases patch contributions and removes the finalizer with a JSON merge patch with retry on conflict.

Claims:
- ACK finalizer string template. VERIFIED. https://raw.githubusercontent.com/aws-controllers-k8s/code-generator/main/templates/pkg/resource/descriptor.go.tpl (main, 2026-11-26). Quote: `FinalizerString = "finalizers.{{ .APIGroup }}/{{ .CRD.Kind }}"`
- ACK MarkManaged adds and MarkUnmanaged removes it. VERIFIED. Same URL. Quote: `k8sctrlutil.RemoveFinalizer(obj, FinalizerString)`
- ACK removes finalizer after AWS cleanup. VERIFIED. https://raw.githubusercontent.com/aws-controllers-k8s/runtime/main/pkg/runtime/reconciler.go (main; latest release v0.68.0). Quote: "we remove the finalizer representing the CR is managed by ACK"
- ACK async deletes should requeue. VERIFIED. Same URL. Quote: "Delete() implementations that have asynchronously-completing deletions should return a RequeueNeededAfter."
- Config Connector finalizer names. VERIFIED. https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/k8s/constants.go (master; latest release v1.162.0). Quote: `ControllerFinalizerName              = "cnrm.cloud.google.com/finalizer"`
- Deletion-defender finalizer name. VERIFIED. Same URL. Quote: `DeletionDefenderFinalizerName        = "cnrm.cloud.google.com/deletion-defender"`
- Controller finalizer removed in HandleDeleted. VERIFIED. https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/controller/lifecyclehandler/handler.go (master). Quote: `k8s.RemoveFinalizer(resource, k8s.ControllerFinalizerName)`
- Deletion defender removes its finalizer, and on CRD uninstall both plus sets abandon. VERIFIED. https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/controller/deletiondefender/controller.go (master). Quote: "remove both KCC finalizers and set the resource to abandon"
- kro instance finalizer is `kro.run/finalizer`. VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/kro/main/pkg/metadata/finalizers.go (main; latest release v0.10.0) and https://raw.githubusercontent.com/kubernetes-sigs/kro/main/api/v1alpha1/groupversion_info.go. Quote: `const kroFinalizer = v1alpha1.KRODomainName + "/finalizer"` and `KRODomainName = "kro.run"`
- kro also has `kro.run/graph-finalizer`. VERIFIED. Same finalizers.go. Quote: `const GraphFinalizer = v1alpha1.KRODomainName + "/graph-finalizer"`
- kro removes the finalizer only after no candidates remain. VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/kro/main/pkg/controller/instance/deletion.go (main). Quote: `if len(candidates) == 0 { return c.removeFinalizer(dcx) }`
- kro deletes in waves, highest first, and requeues. VERIFIED. Same URL. Quote: "deleting apply-order wave %d"
- kro uses merge patch with retry to remove the finalizer. VERIFIED. Same URL. Quote: "Uses merge patch (not SSA) to avoid field manager ownership blocking finalizer removal."
- kro orphan release depends on a DeletionPolicy feature gate. VERIFIED. Same URL. Quote: `if !features.FeatureGate.Enabled(features.DeletionPolicy) {`

## Gap: Cluster API issue 1514 on blocking deletion with a finalizer or annotation

Issue kubernetes-sigs/cluster-api#1514, "machine-controller: block deletion with finalizer/annotation", was opened 2019-10-10 and closed 2020-04-27 (state COMPLETED, closed by the bot on a `/close` from a maintainer). The original proposal was a new finalizer with a known name, possibly a comma-separated list such as `machines-delete-hooks: "myfinalizer1,myfinalizer2"`, running before drain. The thread debated alternatives: one finalizer per hook; a `Dependencies` list of object references in spec (vincepri); a hook-registration CRD (ncdc); and in the end annotations (michaelgugino, 2020-04-17 onward), because status or CR-based hooks would require write permissions on the Machine anyway. The maintainer closed it on 2020-04-27 asking contributors to move to a CAEP (Google Doc) per the project's proposal process.

The result is the Machine Deletion Phase Hooks proposal (`20200602-machine-deletion-phase-hooks.md`, authored by michaelgugino, created 2020-06-02, last updated 2020-08-07, status implemented). It chose annotations, and its alternatives section rejects finalizers: "A misbehaving controller that accidentally removes finalizers could have undesirable effects." The current API in `machine_types.go` (main; latest release v1.14.4) defines `pre-drain.delete.hook.machine.cluster.x-k8s.io` and `pre-terminate.delete.hook.machine.cluster.x-k8s.io` prefixes, with the pre-terminate hook pausing removal of the instance from the infrastructure provider. The control plane provider (KCP) adds its own pre-terminate hook to Machines it manages, per the code comment. Caveat: the proposal doc and machine_types.go are the current-source evidence of the outcome; the issue itself does not record the final choice, and the book page on the hooks was not readable (see Unreadable sources). The annotation key prefixes in the proposal examples (`.cluster-api.x-k8s.io`) differ from the implemented constants (`.cluster.x-k8s.io`); the constants are authoritative for the current API.

Claims:
- Issue 1514 opened 2019-10-10, closed 2020-04-27, state COMPLETED. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/issues/1514 (gh). Quote: "machine-controller: block deletion with finalizer/annotation"
- Original proposal: a new finalizer with a known name, possibly a list. VERIFIED. Same URL. Quote: "Support a new finalizer. Finalizer should have a known-name"
- Original proposal: probably before drain, with second finalizer possible later. VERIFIED. Same URL. Quote: "just having the finalizer work before drain is going to cover most of what someone would want"
- A maintainer suggested a `Dependencies` object-reference list in spec instead of more finalizers. VERIFIED. Same URL (comment by vincepri). Quote: "Instead of adding more finalizers to the Machine"
- Annotation design with `predrain.hook.machine.cluster-api.x-k8s.io/<name>: <owner>` example in thread. VERIFIED. Same URL (comment by michaelgugino, 2020-04-21). Quote: "my-controller-1 might not know anything about my-controller-2"
- Closed in favor of the CAEP process. VERIFIED. Same URL (comment 2020-04-27). Quote: "I'll go ahead and close this issue for now and defer to contributors"
- Implemented proposal exists, status implemented, created 2020-06-02. VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/docs/proposals/20200602-machine-deletion-phase-hooks.md (main). Quote: "status: implemented"
- Proposal rejects finalizers as an alternative. VERIFIED. Same URL. Quote: "A misbehaving controller that accidentally removes finalizers could have undesirable effects."
- Proposal says annotations pause reconciliation until hooks are removed. VERIFIED. Same URL. Quote: "pause reconciliation of a machine object until all hooks are resolved for that lifecycle point"
- Current API constants for pre-drain and pre-terminate. VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/api/core/v1beta2/machine_types.go (main; latest release v1.14.4). Quote: `PreTerminateDeleteHookAnnotationPrefix = "pre-terminate.delete.hook.machine.cluster.x-k8s.io"`
- Pre-terminate hooks prevent removal of the instance from the infrastructure provider; KCP adds its own pre-terminate hook. VERIFIED. Same URL. Quote: "KCP adds its own pre-terminate hook on all Machines it controls."

## Unreadable sources

- https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/docs/book/src/tasks/automated-machine-management/machine-deletion-phase-hooks.md : web_scrape returned an empty body (guessed path; the tree listing showed no such file, so it may not exist on main). The book page on deletion hooks was therefore not read; the proposal and API source were used instead.
- GitHub code search API (`gh api search/code`) returned 404 for all repos tried; file paths were located via git tree listings instead.

## Not found

- A maintainer reply, linked fix PR, or closing commit for Crossplane issue 7801 (read thread, timeline and related PRs; found nothing beyond PR 7594, PR 1113 and issue 4661 as context).
- The literal rendered ACK finalizer string for a specific service controller (searched code-generator templates and runtime; only the template form `finalizers.<apiGroup>/<Kind>` was found).
- Where Config Connector adds `cnrm.cloud.google.com/deletion-defender` (searched constants, lifecyclehandler and deletiondefender controller; only the removal side was read).
- Any behavioral difference between Argo CD's `.../foreground` finalizer and the bare finalizer (searched appcontroller.go and types.go; no distinct branch for foreground).
- A web-published Argo CD or Flux page at a stated release version: all docs were read from default-branch raw files, not versioned docs sites.

## Removed in verification

- Argo CD claim that the delete loop processes sync waves in reverse: not present in appcontroller.go or app_deletion.md; removed (waiting-on-deletionTimestamp behavior retained).
