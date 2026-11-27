---
title: "Research dossier: finalizer gaps (m1-finalizers)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [finalizers, argo-cd, flux, crossplane, ack, config-connector, kro, cluster-api, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: finalizer gaps (m1-finalizers)

> [!NOTE]
> **Raw file:** `raw/research-gap-m1-finalizers.md` (sha256 prefix 014549e333b6)<br>
> **Kind:** Verified research dossier for gap cluster m1-finalizers, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the finalizer pages<br>
> **Caveat:** All evidence came from raw files on each project's default branch (read 2026-11-26, not tagged releases), `gh` metadata, and issue threads. Latest releases seen were Argo CD v3.6.3, Flux kustomize-controller v1.10.2, Crossplane v2.5.0, ACK runtime v0.68.0, kro v0.10.0, Config Connector v1.162.0, and Cluster API v1.14.4, and the default branch may be ahead of them.

## Summary

The dossier answers four of five finalizer gaps from source code and documentation. Argo CD has three cascade finalizer names plus separate pre-delete and post-delete hook finalizers, and a non-cascading delete removes the finalizer. Flux uses `finalizers.fluxcd.io` and removes it even when a `WaitForTermination` wait times out. ACK, Config Connector, and kro use distinct, source-visible finalizer names. Cluster API issue 1514 was closed in favor of a proposal that chose annotation hooks over finalizers.

Crossplane issue 7801 is the exception. It is still open with no maintainer reply and no linked fix on 2026-11-26. Only the neighboring work on ProviderConfig protection has merged. Which finalizer or hook mechanism a platform should prefer is left to the reader, and the dossier recommends nothing.

## Key claims

### Argo CD

- The bare finalizer name is `resources-finalizer.argocd.argoproj.io`, and `.../foreground` and `.../background` variants exist as constants. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/pkg/apis/application/v1alpha1/application_defaults.go
- The docs say the default cascading delete is foreground, and the `/background` finalizer selects background. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/docs/user-guide/app_deletion.md
- The controller uses background propagation only for the exact `/background` finalizer and otherwise foreground, and all three names count as cascading-delete finalizers. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/controller/appcontroller.go and https://raw.githubusercontent.com/argoproj/argo-cd/master/pkg/apis/application/v1alpha1/types.go
- `pre-delete-finalizer.argocd.argoproj.io` and `post-delete-finalizer.argocd.argoproj.io` exist for PreDelete and PostDelete hooks, separate from the cascade finalizers. VERIFIED. application_defaults.go URL above.
- A non-cascading delete is `argocd app delete APPNAME --cascade=false`, or unsetting the finalizer and then deleting with kubectl, or the UI choice Non-Cascading (Orphan). VERIFIED. app_deletion.md URL above.
- The sync option `PrunePropagationPolicy` supports background, foreground, and orphan and governs pruning during sync, not Application deletion. VERIFIED. https://raw.githubusercontent.com/argoproj/argo-cd/master/docs/user-guide/sync-options.md
- The delete loop waits for objects with a deletionTimestamp before the next sync wave; reverse-order wave processing was not found in source and was removed in the dossier's own verification. VERIFIED. appcontroller.go URL above.

### Flux

- The Kustomization finalizer is `finalizers.fluxcd.io`, and `deletionPolicy` takes MirrorPrune (default), Delete, WaitForTermination, or Orphan. VERIFIED. https://raw.githubusercontent.com/fluxcd/kustomize-controller/main/api/v1/kustomization_types.go
- The reconciler adds the finalizer first to avoid a race with deletion. VERIFIED. https://raw.githubusercontent.com/fluxcd/kustomize-controller/main/internal/controller/kustomization_controller.go
- A suspended Kustomization or one with an empty inventory deletes nothing, MirrorPrune follows `spec.prune`, Delete and WaitForTermination always delete, and Orphan never does. VERIFIED. Same controller file.
- WaitForTermination polls every 2 seconds up to the Kustomization's timeout, and on failure it logs an error and the finalizer is still removed. VERIFIED. Same controller file.
- If the impersonated service account is gone, Flux logs the stale objects and continues finalization. VERIFIED. Same controller file.
- The docs say WaitForTermination waits for removal from etcd by the garbage collector, bounded by `.spec.timeout`. VERIFIED. https://raw.githubusercontent.com/fluxcd/kustomize-controller/main/docs/spec/v1/kustomizations.md

### Crossplane issue 7801

- Issue 7801, "Protect ProviderConfig credentials until managed resources finish deleting", was opened 2026-09-02, is open on 2026-11-26, and carries the label `enhancement`. VERIFIED. https://github.com/crossplane/crossplane/issues/7801
- The body lists three directions, "none of them decided": a Usage-style or generic dependency-protection controller, provider-side credential caching, and ordered namespace teardown. VERIFIED. Same URL.
- The body says the credentials Secret has no finalizer and that design pull request 7594 keeps it out of scope. VERIFIED. Same URL.
- crossplane-runtime pull request 1113 ("Protect ProviderConfigs while managed resources terminate"), Crossplane pull request 7594 (a one-pager), and issue 4661 were all merged or closed on 2026-09-08. VERIFIED. https://github.com/crossplane/crossplane-runtime/pull/1113, https://github.com/crossplane/crossplane/pull/7594, https://github.com/crossplane/crossplane/issues/4661
- A comment of 2026-10-14 reports that a Secret finalizer fixed the commenter's runs, that provider-side caching worked 9 of 9 times in a prototype but failed after a restart, and asks "Is (1) still the plan?" SECONDARY-ONLY, a third-party measurement. https://github.com/crossplane/crossplane/issues/7801
- The thread has two comments, neither from a maintainer, and no linked fix pull request. VERIFIED for the thread as read. Same URL.
- Downstream provider-gitlab issue 429, "namespace deletion hangs and leaks GitLab resources", is open. VERIFIED. https://github.com/crossplane-contrib/provider-gitlab/issues/429

### ACK, Config Connector, and kro

- ACK names the finalizer from a code-generator template, `finalizers.<apiGroup>/<Kind>`, and the runtime removes it only after the AWS resource is cleaned up. VERIFIED for the template form. https://raw.githubusercontent.com/aws-controllers-k8s/code-generator/main/templates/pkg/resource/descriptor.go.tpl and https://raw.githubusercontent.com/aws-controllers-k8s/runtime/main/pkg/runtime/reconciler.go
- ACK asynchronous deletes should return a requeue so the finalizer stays until the deletion completes. VERIFIED. reconciler.go URL above.
- Config Connector defines `cnrm.cloud.google.com/finalizer` and `cnrm.cloud.google.com/deletion-defender`. VERIFIED. https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/k8s/constants.go
- The Config Connector deletion defender removes only its own finalizer on a deleting resource, and on CRD uninstall removes both and sets the resource to abandon. VERIFIED. https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/controller/deletiondefender/controller.go
- Config Connector `HandleDeleted` removes the controller finalizer. VERIFIED. https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/controller/lifecyclehandler/handler.go
- kro's instance finalizer is `kro.run/finalizer`, also used on ResourceGraphDefinition and GraphRevision objects, and `kro.run/graph-finalizer` exists for Graph objects. VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/kro/main/pkg/metadata/finalizers.go
- kro deletes the highest apply-order wave first, requeues, and removes the finalizer with a merge patch only when no candidates remain. VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/kro/main/pkg/controller/instance/deletion.go
- kro releases orphan-policy resources only when the `DeletionPolicy` feature gate is on. VERIFIED. Same file.

### Cluster API issue 1514

- Issue 1514, "machine-controller: block deletion with finalizer/annotation", was opened 2019-10-10 and closed 2020-04-27. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/issues/1514
- The original proposal was a finalizer with a known name, probably running before drain. A maintainer suggested a `Dependencies` list of object references instead, and another commenter argued for annotations. VERIFIED. Same URL.
- A maintainer closed the issue and deferred to a CAEP, the project's proposal process. VERIFIED. Same URL.
- The Machine Deletion Phase Hooks proposal (created 2020-06-02, status implemented) chose annotations and rejects finalizers because "A misbehaving controller that accidentally removes finalizers could have undesirable effects." VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/docs/proposals/20200602-machine-deletion-phase-hooks.md
- The current constants are the prefixes `pre-drain.delete.hook.machine.cluster.x-k8s.io` and `pre-terminate.delete.hook.machine.cluster.x-k8s.io`, and the control plane provider adds its own pre-terminate hook to Machines it controls. VERIFIED. https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/api/core/v1beta2/machine_types.go

## Open questions

- Whether Argo CD treats the `.../foreground` spelling differently from the bare finalizer name is not settled. Source shows foreground as the fall-through default and no distinct branch.
- The literal rendered ACK finalizer string for a specific service controller was not read, only the template.
- Where Config Connector adds the deletion-defender finalizer was not found. Only the removal side was read, and the direct controllers were not read individually.
- How older Flux Kustomization API versions behaved on deletion was not read.
- The Cluster API book page on machine deletion hooks could not be read, so the proposal and API source stand in for it.
- Which direction Crossplane will take for Secret protection is unanswered, and no maintainer has said.

## Related pages

[concepts/finalizers](../concepts/finalizers.md), [comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api](../comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api.md), [entities/argo-cd](../entities/argo-cd.md), [entities/flux](../entities/flux.md), [entities/ack](../entities/ack.md), [entities/config-connector](../entities/config-connector.md), [entities/kro](../entities/kro.md), [entities/cluster-api](../entities/cluster-api.md), [entities/crossplane](../entities/crossplane.md)
