# Research dossier: Server-Side Apply and Field Ownership

Research date: 2026-11-25

## Overview

Server-side apply (SSA) moves the "apply" half of `kubectl apply` out of the client and into the API server. A client sends a partial object that states only the fields it has an opinion about (the Kubernetes docs call this a "fully specified intent"), identifies itself with a `fieldManager` name, and the API server merges that intent into the live object. The server records which manager owns which field in `metadata.managedFields`. This replaces the older client-side approach, where `kubectl` computed a three-way merge between the new manifest, the `kubectl.kubernetes.io/last-applied-configuration` annotation, and the live object. KEP-555 describes the motivation: client-side apply depended on client version, on an ad-hoc strategic merge patch format, and produced surprising results when several actors touched the same object. SSA reached GA in Kubernetes 1.22 (August 2021).

The central mechanic is field ownership. When two managers set a field to different values, the second apply gets a conflict error instead of silently overwriting. The applier has three choices: force the write and become sole owner, drop the field from its request and give up the claim, or set the same value and become a co-owner. If two managers set the same value they share ownership, and a later change by either one conflicts with the other. Removing a field from your manifest deletes it from the live object only if nobody else owns it, which is why SSA can prune safely in a multi-writer environment. Merge behavior inside lists and maps depends on schema markers (`listType`, `listMapKey`, `mapType`, `structType`); custom resources without these markers are treated as unstructured with atomic lists, which is a frequent source of surprise.

The sources frame SSA for two audiences. Controller authors are told to apply with a stable field manager name and to force conflicts, because a controller usually cannot resolve a disagreement about fields it owns. The Kubebuilder book and client-go "apply configuration" types support that pattern. CI/CD and GitOps tools are told the opposite: they behave more like users than controllers, they can touch any field, and so they must pay attention to conflicts (the HPA versus Git `replicas` example is the canonical case). In practice GitOps tools resolve this by choosing a blanket force (Argo CD runs `--force-conflicts`, Flux force-applies with its own manager), then providing escape hatches: Flux ignore rules and annotations, Argo CD `ignoreDifferences` and Server-Side Diff, Kluctl per-field force annotations.

Most real problems show up at boundaries. Migrating from client-side to server-side apply leaves legacy managers (`kubectl` with operation `Update`, `before-first-apply`) co-owning fields, which blocks pruning. Fields removed from Git then stay in the cluster (Flux issue 486). Crossplane has had to clear managed fields as a one-time migration step when moving to composition functions. Diffing is a separate operation from applying, so a sync can succeed while the tool still reports drift because of server defaults (Argo CD OutOfSync, fixed by Server-Side Diff). Tutorials should teach the mental model first (managers, operations Apply vs Update, conflicts, shared ownership), then the per-tool behavior, then the migration and debugging recipes.

Coverage caveat: sources on kro, ACK, Config Connector, and Helm 4 SSA could not be read in this session (kro docs returned empty content; searches for Helm 4 returned no usable primary page). Those are listed under Open questions.

## Sources

### 1. Server-Side Apply (Kubernetes reference docs)
- URL: https://kubernetes.io/docs/reference/using-api/server-side-apply/
- Title: Server-Side Apply
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: The canonical reference. It defines fully specified intent, field management via `managedFields`, the `Apply` versus `Update` operation values, conflicts and the three resolution options, shared ownership, how the field manager is chosen (required for apply, inferred from User-Agent otherwise, `kubectl` by default), and the merge strategy markers for lists, maps, and structs. It covers custom resources (treated as unstructured with atomic lists unless the CRD schema carries the markers), the ownership transfer recipe (both managers set the same value, then one drops it), the comparison with client-side apply, and the migration path with `kubectl apply --server-side`, including the warning that fields changed outside client-side apply (for example `kubectl scale`) create conflicts. It also recommends that controllers always force conflicts on objects they own. Essential first read for every tutorial in this topic.
- Quote: "It is strongly recommended for controllers to always force conflicts on objects that they own and manage"

### 2. KEP-555: Server-side Apply (kubernetes/enhancements)
- URL: https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/555-server-side-apply/README.md
- Title: Apply (KEP-555)
- Publisher: Kubernetes SIG API Machinery
- Kind: KEP / design document
- Summary: The design record. The motivation section lists the surprises of client-side apply (POST then apply, apply then `kubectl edit` then apply, GET-edit-apply, two users applying in turn). Goals include robustness to other writers and mutating webhooks, no dependence on prior CI/CD steps, and usability from non-Go clients via plain HTTP PATCH with a special content type. The proposal replaces the last-applied annotation with per-field manager tracking, formalizes the schema in structured-merge-diff, adds server-side dry-run, and defines the upgrade and downgrade strategy between kubectl client-side and server-side apply. It also covers "status wiping" (resetting fields that a given endpoint must not set) and the production readiness questionnaire. Useful for explaining why the design looks as it does, but parts are marked TODO and some sections predate the final implementation.
- Quote: "Instead of using a `kubectl.kubernetes.io/last-applied-configuration` annotation, the control plane will track a \"manager\" for every field."

### 3. Kubernetes 1.22: Server Side Apply moves to GA
- URL: https://kubernetes.io/blog/2021/08/06/server-side-apply-ga/
- Title: Kubernetes 1.22: Server Side Apply moves to GA
- Publisher: Kubernetes blog; authors Jeffrey Ying and Joe Betz (Google)
- Kind: Official release blog
- Summary: Announces GA and explains what changed since beta: subresource support (`status`, `scale`) and first-class client support in client-go and Kubebuilder. It introduces the generated "apply configuration" types, where every field is a pointer so a request can express exactly the fields a controller cares about, and shows `Apply` calls with `ApplyOptions{FieldManager, Force}`. Good bridge material from the conceptual model to controller code.
- Quote: "Server-side Apply is a new merging algorithm, as well as tracking of field ownership, running on the Kubernetes api-server."

### 4. Server Side Apply Is Great And You Should Be Using It
- URL: https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/
- Title: Server Side Apply Is Great And You Should Be Using It
- Publisher: Kubernetes blog; author Daniel Smith (Google, SIG API Machinery)
- Kind: Official blog / design rationale from a core maintainer
- Summary: Compares SSA with client-side apply, hand-rolled patches, shelling out to kubectl, and GET-modify-PUT (including the optimistic-concurrency retry cost when many actors update at once). It splits controller authors into two groups: "extract and re-apply" for existing controllers, and "reconstructive" controllers that rebuild their desired fields from scratch each time, which the author recommends for new controllers. The CI/CD section is the most valuable part: CD systems are controllers that act like users, must surface conflicts to humans, and the post lists human responses (reject the hotfix by force-applying, accept the hotfix, accept then reject). It uses the HPA versus Git `replicas` example and notes a future where tools parse `managedFields` to decide which conflicts to ignore.
- Quote: "CI/CD systems are literally controllers, but for the purpose of apply, they are more like users"

### 5. Live and let live with Kluctl and Server Side Apply
- URL: https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/
- Title: Live and let live with Kluctl and Server Side Apply
- Publisher: Kubernetes blog; author Alexander Block (Kluctl)
- Kind: Engineering blog from a tool author, hosted on kubernetes.io
- Summary: A deployment-tool author describes moving from shelling out to `kubectl` (client-side apply, annotation size limits on large CRDs, no per-field control) to calling SSA directly. Because `kubectl --server-side` can only force everything or nothing, Kluctl implements field-level conflict decisions: it treats changes from known interactive managers (kubectl, k9s) as temporary and overwrites them, and exposes `--force-apply`, `kluctl.io/force-apply`, and `kluctl.io/force-apply-field` (JSON path) for known-misbehaving operators such as ECK touching `nodeSets`. An admin can run `kubectl --field-manager=admin-override` to make a change Kluctl will respect. A strong real-world example of a GitOps-style tool designing around ownership.
- Quote: "Kluctl will not overwrite any fields that it lost ownership of, unless you explicitly tell it to do so."

### 6. KEP-555 Reading Notes: The Design Principles and Context of Server Side Apply
- URL: https://blog.yangjerry.tw/en/posts/k8s-ssa-design/
- Title: KEP-555 Reading Notes: The Design Principles and Context of Server Side Apply
- Publisher / author: ChengHao Yang (SRE, CNCF Ambassador), personal blog, dated 2026-06-27
- Kind: Tutorial explainer / source walkthrough
- Summary: A readable walkthrough of KEP-555 with diagrams. It explains client-side three-way merge (desired config, last-applied annotation, live object), why that approach is fragile (merge logic depends on client version, strategic merge patch grew organically, results are unpredictable), then covers FieldManager, status wiping, and the Go IDL. It also gives an adoption timeline: SSA GA in 1.22, Argo CD v2.5.0 support in October 2022, and a claim that Helm 4.0.0 (November 2025) enables SSA by default for new releases (not independently verified here; see Open questions). Good ramp-up reading before the KEP itself.
- Quote: "CSA performs a Three-Way Merge Patch on the client side, then produces a Strategic Merge Patch to send to the apiserver."

### 7. Flux Kustomization API documentation
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization | Flux
- Publisher: Flux project (CNCF)
- Kind: Official documentation
- Summary: Describes how kustomize-controller applies manifests with server-side apply and runs a server-side dry-run on each interval to detect and correct drift. Key ownership controls: per-resource annotations `kustomize.toolkit.fluxcd.io/ssa` (Override, Merge, IfNotPresent, Ignore), `.../force` (recreate on immutable-field changes, for example Jobs), and `.../prune`; and `.spec.ignore` rules (JSON Pointer paths) for fields other tools should own. The ignore rules are described in SSA terms: "Strip" the field from the apply payload when another Apply-type manager owns it, "Adopt" the live value when Flux is the sole Apply-type owner so Update-type edits (kubectl patch/edit) are not reverted. It documents the `flux-client-side-apply` manager name for preserving kubectl edits, and that atomic lists such as `.spec.tolerations` cannot be shared between managers under the `Merge` policy.
- Quote: "The `IfNotPresent` policy instructs the controller to only apply the Kubernetes resources if they are not present on the cluster."

### 8. Flux kustomize-controller issue 486: Migrating from client-side apply to server-side prevents field deletion
- URL: https://github.com/fluxcd/kustomize-controller/issues/486
- Title: Migrating from client-side apply to server-side prevents field deletion #486
- Publisher: Flux maintainers and users (GitHub); opened by Stefan Prodan, Nov 2021
- Kind: Issue thread / failure-mode record
- Summary: Documents what happened when Flux moved from kubectl client-side apply (Flux 0.17) to SSA (0.18): fields removed from Git stayed in the cluster, because the old manager still co-owned them and force cannot take ownership of fields that no longer appear in the applied object. The same problem hits users who adopt manually applied resources into Flux. The maintainer's workaround was to delete the offending entry in `metadata.managedFields` so the controller takes full ownership on the next reconcile; one commenter reported that deleting managedFields alone did not fix a removed env var and recreated the Deployment with `--cascade=orphan` instead. The issue is labeled blocked/upstream (a Kubernetes issue) and closed via a later fix PR.
- Quote: "you can't force ownerships for non existing fields."

### 9. Flux kustomize-controller issue 1722: support taking over field managers before dry-run
- URL: https://github.com/fluxcd/kustomize-controller/issues/1722
- Title: ssa: support taking over field managers before dry-run #1722
- Publisher: Flux maintainers (GitHub); opened Aug 2026, closed Oct 2026
- Kind: Issue thread / recent design discussion
- Summary: A modern edge case. An operator disables Flux, patches a workload with a legacy controller using Update operations, then re-enables Flux. A stale manager now co-owns a container entry's key but not its required `image` field; when a later commit removes the container, SSA drops the field Flux solely owned and leaves an invalid half-removed container, so the dry-run fails every reconcile before the normal post-dry-run manager cleanup (`--override-manager`) can run. The proposed fix is an opt-in flag, `--override-manager-before-dry-run=<manager>`, kept separate from the default so that a failed dry-run does not mutate ownership. The maintainers agreed to document that this is dangerous and intended only for targeted migrations from legacy controllers to Flux. Excellent illustration of why ownership of list entries matters and why Flux reclaims known managers only after a successful dry-run.
- Quote: "doing operations before dry-run is dangerous and can have unintended consequences."

### 10. Argo CD Sync Options (Server-Side Apply section)
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/
- Title: Sync Options - Argo CD
- Publisher: Argo project (CNCF)
- Kind: Official documentation
- Summary: Argo CD defaults to client-side `kubectl apply`. Setting `ServerSideApply=true` (per Application or per resource via annotation) makes it run `kubectl apply --server-side --force-conflicts`. Listed reasons: resources too large for the 262144-byte last-applied annotation (large CRDs), patching resources not fully managed by Argo CD, and a field-management model. It documents `Replace=true` taking precedence over SSA, a client-side apply migration feature that moves managedFields from the client-side manager to Argo CD's manager (`argocd-controller`) and deletes the old entry, and a warning that adopting a namespace with `managedNamespaceMetadata` needs a prior upgrade to server-side apply or labels may be removed.
- Quote: "Argo CD will use the `kubectl apply --server-side --force-conflicts` command to apply changes."

### 11. Argo CD proposal: Server-Side Apply support for ArgoCD
- URL: https://argo-cd.readthedocs.io/en/stable/proposals/server-side-apply/
- Title: Server-Side Apply support for ArgoCD
- Publisher: Argo CD maintainers
- Kind: Design proposal
- Summary: Explains why Argo CD adopted SSA: better interoperability with admission controllers (the server always runs them, even when the client sees no diff), better conflict identification via managedFields, and no dependence on the annotation size limit for CRDs. Goals include enabling SSA at controller, Application, and resource level, strategic merge patch during diffing, and registering a fixed field manager (`argocd-controller`) instead of relying on kubectl defaults. Risks listed: a supported-version check (fall back to client-side below Kubernetes 1.18) and alternating server-side and client-side syncs, which depends on the user-agent and manager name behavior from KEP-555. Useful as a template for how a GitOps tool reasons about adopting SSA.
- Quote: "ArgoCD must register itself with a pre-defined manager"

### 12. Argo CD stuck OutOfSync with Server-Side Apply: when the diff isn't drift
- URL: https://blog.danielepetrollo.com/en/argocd-outofsync-server-side-diff
- Title: Argo CD stuck OutOfSync with Server-Side Apply: when the diff isn't drift
- Publisher / author: Daniele Petrollo, personal engineering blog, 2026-10-21 (author notes the draft was written with AI assistance and revised)
- Kind: Practitioner troubleshooting article
- Summary: Separates applying from comparing. With `ServerSideApply=true` the API server merges and tracks ownership, but Argo CD's default diff compares Git-rendered manifests against live state in-process, so API-server defaults (for example `volumeMode` and `status.phase` in StatefulSet `volumeClaimTemplates`) look like drift. The author recommends proving it with `kubectl diff --server-side`, then enabling `ServerSideDiff=true` (annotation per Application, or `controller.diff.server.side` globally), which sends a dry-run apply per resource and compares results. Caveats: mutating-webhook changes are excluded unless `IncludeMutationWebhook=true`, and resources being created fall back to the normal diff. Prefers this over `ignoreDifferences`, which also hides real drift.
- Quote: "Server-Side Diff hides nothing."

### 13. Crossplane: Server-Side Apply (v1.20 docs)
- URL: https://docs.crossplane.io/v1.20/concepts/server-side-apply/
- Title: Server-Side Apply - Crossplane v1.20
- Publisher: Crossplane project (CNCF)
- Kind: Official documentation (alpha feature page in this version)
- Summary: Crossplane uses SSA to sync claims to composite resources (XRs) via the `--enable-ssa-claims` flag, and to sync XRs to composed resources when composition functions are used. End to end, `metadata` and `spec` flow forward from claim to XR to composed resource, and `status` flows back. Stated benefits: fields deleted from a claim's spec are deleted downstream, labels and annotations propagate correctly, and complex fields can be merged, but only for resources whose CRD schemas carry the SSA merge-strategy markers; otherwise users should ask the provider maintainer to add them. Shows how a platform abstraction layer depends on correct merge markers.
- Quote: "When Crossplane uses server-side apply, the Kubernetes API server helps sync resources."

### 14. Crossplane issue 5639: Clear SSA field managers when migrating to composition functions
- URL: https://github.com/crossplane/crossplane/issues/5639
- Title: Clear SSA field managers when migrating to composition functions #5639
- Publisher: Crossplane maintainers/contributors (GitHub), April 2024
- Kind: Issue with source-code walkthrough
- Summary: Describes a four-step migration in code comments. Before: all fields owned by manager `crossplane` with operation `Update` (client-side style). Step 2: delete all field managers. Step 3: the controller server-side applies its intent under a manager with prefix `apiextensions.crossplane.io/composed/`, and everything it did not specify ends up owned by `before-first-apply` (operation `Update`). Step 4: delete the `before-first-apply` entry. Without this, composed resources end up with shared ownership and field removals do not sync. A concrete, reusable recipe for any controller moving from Update-style writes to Apply.
- Quote: "Without this managedFields upgrade, the composed resources ends up having shared ownership of fields and field removals won't sync properly."

### 15. Crossplane issue 7453: Composite resource controller clears managedFields on every reconcile
- URL: https://github.com/crossplane/crossplane/issues/7453
- Title: Composite resource controller clears managedFields on every reconcile, breaking SSA field ownership by external controllers #7453
- Publisher: Crossplane (GitHub), reported May 2026 against v2.3.1
- Kind: Issue thread (unresolved, marked stale at time of reading)
- Summary: A reporter claims that a spec field applied to an XR by an external controller with `ForceOwnership` disappears within one reconcile and that `managedFields` appears empty. A maintainer could not reproduce on v2.3.1 and suggested the reporter's `kubectl get -o yaml` was hiding `managedFields`, which is the default behavior without `--show-managed-fields`. The thread is a good teaching example of two things: how to verify ownership (always show managed fields) and how multi-controller composition (an XR with an external writer) is an unsettled area. The claim is unconfirmed.
- Quote: "`kubectl get -o yaml` hides `managedFields` unless you pass `--show-managed-fields`"

### 16. Kubebuilder Book: Server-Side Apply (alpha scaffolding)
- URL: https://master.book.kubebuilder.io/reference/server-side-apply.html
- Title: (Alpha) Server-Side Apply - The Kubebuilder Book
- Publisher: Kubernetes SIGs (kubebuilder)
- Kind: Official framework documentation
- Summary: Shows how to scaffold APIs with `--ssa` so controllers get generated ApplyConfiguration types, then apply status with `client.FieldOwner("controller-name")` and `client.ForceOwnership`. Explains when to use SSA (multiple controllers or users managing one resource, users customizing CRs with labels or spec fields the controller should not overwrite, other operators importing your apply types) versus plain `Update()` for sole-owner controllers. Best-practice list: always set a field owner, force ownership of fields the controller manages, and only specify fields you manage.
- Quote: "For controllers that are the sole owner of a resource and manage the entire object, traditional `Update()` is simpler and sufficient."

### 17. Cluster API PR 6495: Add Server Side Apply helper to the topology controller
- URL: https://github.com/kubernetes-sigs/cluster-api/pull/6495
- Title: Add Server Side Apply helper to the topology controller #6495
- Publisher: Cluster API maintainers (kubernetes-sigs), merged June 2022
- Kind: Pull request (only the description and file list were readable; thin source)
- Summary: The PR makes the ClusterClass topology controller use SSA so the API server mediates multiple controllers co-authoring one object (for example, the topology controller and infrastructure or control-plane controllers writing to the same Cluster API objects). The changed files include a structured-merge dry-run and patch helper under the topology controller. Only the stated motivation was verified; the full implementation discussion was not read.
- Quote: "leverage on the API server for handling controllers co-authoring the same object"

## Real-world use cases

Large CRDs in GitOps: Argo CD documents that resources exceeding the 262144-byte annotation limit (large CRDs such as the Prometheus operator CRDs) are a primary reason to enable `ServerSideApply=true` (https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/). The Kluctl author reports the same annotation-size problem with Prometheus operator CRDs as a driver for moving away from client-side apply (https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/).

Autoscaler versus Git: the Kubernetes maintainers' example of an HPA setting `replicas` to 10 while a repository says 3 is the standard illustration of why CD tools must see conflicts rather than blindly override (https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/). Argo CD's practitioner guidance keeps `ignoreDifferences` for fields a controller rewrites on purpose, such as `replicas` under an autoscaler (https://blog.danielepetrollo.com/en/argocd-outofsync-server-side-diff).

Coexisting with other controllers and operators: Flux's `Merge` and `IfNotPresent` policies exist for resources whose fields are later mutated by other controllers, with cert-manager-managed Secrets and ValidatingWebhookConfigurations named as the use case (https://fluxcd.io/flux/components/kustomize/kustomizations/). Kluctl's per-field force annotations exist because the ECK operator claims `nodeSets` fields erroneously (https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/).

Platform abstraction layers: Crossplane uses SSA to propagate claim to composite resource to composed resources, so field deletions and label changes flow downstream correctly (https://docs.crossplane.io/v1.20/concepts/server-side-apply/). Cluster API's topology controller adopted SSA so several controllers can co-author the same objects (https://github.com/kubernetes-sigs/cluster-api/pull/6495).

Migrating from legacy controllers or manual operations: Flux's targeted pre-dry-run takeover flag is aimed at moving workloads from a legacy controller to Flux (https://github.com/fluxcd/kustomize-controller/issues/1722). Flux 0.17 to 0.18 and adopting hand-applied resources both hit the stuck-field problem (https://github.com/fluxcd/kustomize-controller/issues/486). Argo CD ships a built-in client-side apply migration for the same situation.

Operator and controller development: Kubebuilder scaffolds apply types so controllers can write status with a named field owner and force ownership, and other operators can import those apply types to manage instances of your CRs (https://master.book.kubebuilder.io/reference/server-side-apply.html).

## Pitfalls and how tools address them

Client-side to server-side migration leaves stale co-owners. The `kubectl` manager with operation `Update` (and `before-first-apply`) keeps co-owning fields, so removals do not prune. Kubernetes documents `kubectl apply --server-side` as the supported upgrade path and warns to keep the last-applied annotation current, since fields changed outside client-side apply (`kubectl scale`) then conflict (https://kubernetes.io/docs/reference/using-api/server-side-apply/). Flux's workaround was removing the managedFields entry (https://github.com/fluxcd/kustomize-controller/issues/486) and later an `--override-manager` flag that reclaims named managers after a successful dry-run. Argo CD automates the move to `argocd-controller` (sync options page). Crossplane clears managed fields in two steps and removes `before-first-apply` (https://github.com/crossplane/crossplane/issues/5639).

Force-everything versus fail-everything. `kubectl apply --server-side` offers only error or `--force-conflicts`. Argo CD chooses force; Flux force-applies its own intent but offers Merge, IfNotPresent, Ignore, and ignore rules with strip/adopt semantics; Kluctl decides per field with known-manager heuristics and annotations. The Kubernetes maintainer blog argues plain controllers should force and CD systems should surface conflicts to humans, a tension the GitOps tools resolve differently (sources 4, 5, 7, 10).

Atomic lists and unmarked CRDs. Lists marked or defaulting to atomic can have only one manager, so changes from others are reverted (Flux documents this for `.spec.tolerations`). CRDs without merge-strategy markers are treated as unstructured with atomic lists, so cross-manager merging fails; Crossplane tells users to ask provider maintainers to add markers (https://docs.crossplane.io/v1.20/concepts/server-side-apply/, https://kubernetes.io/docs/reference/using-api/server-side-apply/).

Ownership of list entries and partial removals. Flux issue 1722 shows a stale Update manager co-owning a list entry key but not its required field, so pruning removes the sole-owned field and leaves an invalid object that fails dry-run every reconcile. Flux's design deliberately reclaims managers only after a successful dry-run so a failed apply does not reassign ownership; the opt-in pre-dry-run flag is flagged as dangerous (https://github.com/fluxcd/kustomize-controller/issues/1722).

Diff is not apply. Argo CD may show OutOfSync after a successful SSA sync because default diffing ignores server defaults. Server-Side Diff (dry-run apply per resource) fixes it; `kubectl diff --server-side` verifies. It excludes mutating webhook changes by default and cannot dry-run resources being created (https://blog.danielepetrollo.com/en/argocd-outofsync-server-side-diff). Argo CD's proposal also notes SSA syncs always exercise admission controllers (https://argo-cd.readthedocs.io/en/stable/proposals/server-side-apply/).

Interference with other patch modes. Argo CD gives `Replace=true` precedence over SSA, and `Force=true` is ignored under SSA because `kubectl apply --server-side` does not support `--force` (sync options page). Flux's `force` annotation recreates resources on immutable-field changes (for example Jobs), a different mechanism from field-conflict forcing (Flux Kustomization docs).

Controller anti-patterns. Applying a whole object read back from the server makes the controller claim every field; the server notices and rejects it. The recommended approaches are extract-modify-apply or constructing desired fields from scratch (sources 3, 4). Writing `managedFields` by hand is discouraged by the API docs and is only a recovery tool.

Visibility. `kubectl get` hides `managedFields` unless `--show-managed-fields` is passed. A report of "empty managedFields" in Crossplane may have been this (https://github.com/crossplane/crossplane/issues/7453).

Rollbacks and version skew. Argo CD's proposal calls out a Kubernetes version check (below 1.18 falls back to client-side) and the risk of alternating client-side and server-side syncs, which depends on the user-agent and field manager name handling documented in KEP-555.

## Tutorial and explainer links

- https://kubernetes.io/docs/reference/using-api/server-side-apply/ : The authoritative walkthrough of managers, conflicts, merge markers, and migration; start here.
- https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/ : Best conceptual guide for controller authors and CD tool builders, from a core maintainer.
- https://kubernetes.io/blog/2021/08/06/server-side-apply-ga/ : Short bridge from concept to client-go apply configurations.
- https://blog.yangjerry.tw/en/posts/k8s-ssa-design/ : Diagrammed reading of KEP-555 explaining why client-side apply was replaced.
- https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/ : A concrete design story of field-level conflict policy in a deployment tool.
- https://fluxcd.io/flux/components/kustomize/kustomizations/ : How Flux exposes SSA through annotations, force, and ignore rules.
- https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/ : How to turn on SSA in Argo CD and what migration does.
- https://blog.danielepetrollo.com/en/argocd-outofsync-server-side-diff : Practical diagnosis checklist for OutOfSync with SSA.
- https://master.book.kubebuilder.io/reference/server-side-apply.html : Hands-on controller code pattern with FieldOwner and ForceOwnership.
- https://docs.crossplane.io/v1.20/concepts/server-side-apply/ : Shows SSA used across an abstraction chain (claim, XR, composed resources).

## Open questions

- Helm 4 and SSA: one source (Yang, 2026) states Helm 4.0.0 enables SSA by default for new releases. I could not read a primary Helm page to confirm the default, the field manager name, or how Helm handles upgrades of releases created with client-side apply.
- kro, ACK, and Config Connector: no readable primary source on how these tools set field managers, force conflicts, or reconcile fields owned by other controllers. The kro docs page returned empty content. Writers should not assert behavior for these tools without further research.
- Cluster API: the topology controller adopted SSA, but only the PR description was read; the detailed rules for which fields CAPI owns versus infrastructure providers were not verified.
- Crossplane versions: the SSA concept page read is for v1.20 (alpha, behind `--enable-ssa-claims`); Crossplane v2 behavior may differ, and issue 7453 (v2.3.1) is unresolved and may be a visibility misunderstanding.
- Flux flag naming: issue 1722 was closed as completed through a PR (kustomize-controller 1747), but I did not read the shipped docs, so the final flag semantics should be checked against the current Flux documentation before publishing.
- Argo CD Server-Side Diff stability: the Petrollo article states it is stable since 3.1.0 citing Argo docs; I did not independently read the diff-strategies page.
- Conflict between recommendations: Kubernetes maintainers say controllers should force conflicts while CD tools should surface them, yet Argo CD and Flux both force by default. Sources do not settle what the best default is for platform teams that run both GitOps and in-cluster controllers on the same objects.
- Kubernetes 1.18 versus 1.22 and the optional kubectl default switch: the maintainers' blog says they hope to make server-side the kubectl default; I did not verify whether that has happened.
