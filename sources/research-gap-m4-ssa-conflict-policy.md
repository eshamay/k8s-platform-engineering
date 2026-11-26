---
title: "Research dossier: server-side apply and conflict policy gaps (m4-ssa-conflict-policy)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [server-side-apply, conflict-policy, kro, ack, config-connector, helm, cluster-api, argo-cd, flux, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: server-side apply and conflict policy gaps (m4-ssa-conflict-policy)

> [!NOTE]
> **Raw file:** `raw/research-gap-m4-ssa-conflict-policy.md` (sha256 prefix 28e595eae3e0)<br>
> **Kind:** Verified research dossier for gap cluster m4-ssa-conflict-policy, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the server-side apply, field ownership, and conflict policy pages<br>
> **Caveat:** Source code was read at named commits (kro a2ac57b, Helm 3b82b52, ACK runtime b1f8861, Config Connector 793f18c, Cluster API f11b064, helm-controller 072b907, kustomize-controller 9ed68b7). Helm behavior is read from main, not from the v4.0.0 tag. The Config Connector public docs page could not be read.

## Summary

The dossier answers five open gaps from source code and primary documentation. The four tools in the first gap behave very differently. kro applies template resources with server-side apply and force, applies "patch" contributions without force, and has an opt-in mode that refuses to take a field from another kro Graph. The ACK runtime does not use server-side apply at all and sends merge patches. Config Connector uses Update calls under a named manager and reads other managers' `managedFields` to decide which spec fields a user owns. Helm 4 uses server-side apply by default for new installs on main, with `--force-conflicts` as an opt-in on the command line, while helm-controller always forces.

For Cluster API, the topology controller applies under the manager `capi-topology` with force, and the book says this lets other controllers co-author objects, while also documenting that co-authored list slices can reconcile forever. Argo CD's documentation calls Server-Side Diff stable since v3.1.0, but the issue tracker holds many open Server-Side Diff bugs, so "stable" is a documentation label and not a statement that the problems are closed.

For helm-controller, source shows that the `--override-manager` takeover runs before the dry-run diff. That is the opposite order from kustomize-controller's default flag. kustomize-controller documents `--override-manager-before-dry-run` as the recovery switch, and no helm-controller equivalent was found. The two evidence-only gaps, the best default conflict policy and force versus strip-or-adopt, are answered with sources grouped by position and no recommendation. No named adopter policy and no head-to-head experiment was found.

## Key claims

- kro applies template nodes with `client.Apply` and, when force is set, `client.ForceOwnership`. Patch nodes contribute without force. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/main/pkg/graphengine/executor/simple.go
- kro's `ConflictDetection` option, enabled only for the standalone Graph controller, refuses to steal a field owned by another Graph's template manager and still reclaims external drift by a forced re-apply. VERIFIED. Same file.
- kro's manager names are `kro.run/applyset` on the shared path and `kro-instance-status` for instance status. The latest kro release read was v0.10.0, published 2026-11-10. VERIFIED.
- The ACK runtime reconciler writes with `client.MergeFrom` patches, and no `ForceOwnership`, `FieldOwner`, or `client.Apply` call was found outside a mock. VERIFIED by absence at runtime commit b1f8861. Individual service controllers were not read. https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/reconciler.go
- Config Connector writes with `Update` and `Status().Update` under the field owner `cnrm-controller-manager`, skips its own manager when it computes user-owned fields, and creates `managedFields` metadata with a small server-side apply patch under the manager `supports-ssa`. VERIFIED. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/k8s/managedfields.go
- Config Connector issue 11689 is a collaborator proposal saying server-side apply must be enabled in an Argo CD Application because the CRD bundle exceeds the 262144-byte annotation limit. VERIFIED as the text of a proposal, not official documentation. The issue was closed on 2026-10-04. The dossier text first said open and was corrected in verification. https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/11689
- Helm v4.0.0 (2025-11-12) release notes list "Server side apply is now supported". On main, `helm install --server-side` defaults to true, `helm upgrade --server-side` defaults to "auto", and `--force-conflicts` defaults to false on install, upgrade, and rollback. VERIFIED on main at commit 3b82b52. https://github.com/helm/helm/blob/main/pkg/cmd/install.go
- Helm's field manager is the base name of `os.Args[0]` (so `helm`) unless `ManagedFieldsManager` is set, and a client-side to server-side upgrade also upgrades the client-side field manager. VERIFIED. https://github.com/helm/helm/blob/main/pkg/kube/client.go
- helm-controller sets `ForceConflicts = ServerSideApply` and the comment says "We always force conflicts on server-side apply." VERIFIED. https://github.com/fluxcd/helm-controller/blob/main/internal/action/install.go
- Helm issue 32706 is titled "Helm 4: install fails on an existing CRD previously installed client-side", open on 2026-11-26. VERIFIED for the title and state only. https://github.com/helm/helm/issues/32706
- Whether the v4.0.0 tag itself defaulted install to server-side apply is UNVERIFIED, because only main was read.
- The Cluster API topology controller applies with `TopologyManagerName = "capi-topology"` and force ownership. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/main/core/reconcilers/topology/cluster/structuredmerge/serversidepatchhelper.go
- The Cluster API book says server-side apply "allows other controllers to co-author the generated objects", and the troubleshooting page says a slice co-authored by templates and an infrastructure controller "can lead to infinite reconcile" and that atomic-to-map list transitions can leave server-side apply unable to remove list items, where client-side apply or "continuous" server-side apply with GitOps tools works. VERIFIED. https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/user/guide/troubleshooting.md
- A per-field table of fields owned by the topology controller versus providers was not found. UNVERIFIED.
- The Argo CD diff-strategies page says Server-Side Diff is "Stable (Since v3.1.0)", is used automatically for Applications that enable the Server-Side Apply sync option, and replaces the discontinued Structured-Merge Diff. VERIFIED. https://argo-cd.readthedocs.io/en/latest/user-guide/diff-strategies/
- The Argo CD tracker holds 20 or more open issues that mention ServerSideDiff, including 28861 (2026-07-22), 27625 (2026-04-30), 27237 (2026-04-08), 25533 (2025-12-05), and 17717 (2024-04-03). VERIFIED for 28861, 25533, and 17717 (titles and quotes). The other two were read by title only. No maintainer statement reconciling "stable" with the open bugs was found. UNVERIFIED.
- Kubernetes issue 130292 (filed 2025-02-19, open, last comment 2026-09-14) shows a forced server-side apply by a controller being rejected when a Service port entry was edited. VERIFIED. https://github.com/kubernetes/kubernetes/issues/130292
- helm-controller registers `--override-manager` as a repeatable flag ("List of field managers to override during drift detection"), added in 1.5.0 (2026-02-20), and its changelog says drift correction is "completely unrelated to Helm v4's server-side apply support". VERIFIED.
- In helm-controller, `action.Diff` patches `managedFields` to remove disallowed managers on the live objects before the dry-run client computes the diff, so takeover precedes the dry-run. VERIFIED by source order, with function bodies partly read. https://github.com/fluxcd/helm-controller/blob/main/internal/action/diff.go
- helm-controller's `AGENTS.md` says charts that mutate their own objects "loop forever unless their field managers are added to `--override-manager`". VERIFIED as maintainer-written repository guidance, not user documentation.
- kustomize-controller `--override-manager` acts "only after a successful server-side apply dry-run", and `--override-manager-before-dry-run` is documented as recovery with two risks (it transfers all fields of the named managers and the change is not reverted if the apply fails). VERIFIED. https://github.com/fluxcd/kustomize-controller/blob/main/docs/README.md
- A helm-controller counterpart to the before-dry-run flag, and any documented recovery for a HelmRelease stuck at the dry-run, were not found. UNVERIFIED.
- The Kubernetes documentation says "It is strongly recommended for controllers to always force conflicts on objects that they own and manage", lists three resolution options, describes the HPA handover, says force "removes the field from all other managers' entries", and says an update write's conflict "never provokes failure of the operation". VERIFIED. https://github.com/kubernetes/website/blob/main/content/en/docs/reference/using-api/server-side-apply.md
- Argo CD with `ServerSideApply=true` runs `kubectl apply --server-side --force-conflicts`, ignores `Force=true`, and supports ignoring differences by manager through `managedFieldsManagers`. VERIFIED. https://argo-cd.readthedocs.io/en/latest/user-guide/sync-options/
- Argo CD enables client-side apply migration by default. The default manager name `argocd-controller` is not stated explicitly on that page. VERIFIED, with that correction made in verification.
- Flux Strip removes the field from the apply payload and so gives up the controller's ownership, Adopt "preserves the current value without reverting changes made by Update-type operations", and "Changes to ignored fields alone do not trigger a reconciliation." VERIFIED. https://github.com/fluxcd/kustomize-controller/blob/main/docs/spec/v1/kustomizations.md
- A practitioner blog says "the conflict mechanism protects nobody from Argo CD", and that `ignoreDifferences` "only affects diff computation". SECONDARY-ONLY. https://jm-dev.it/blog/argocd-server-side-apply-field-ownership/ (2026-09-16)
- A practitioner case study says scoped `managedFieldsManagers` has the fewest side effects but "it's not a documented contract between the two projects". SECONDARY-ONLY. christianhuth.de, the kube-green write-up (2026-08 by image path).
- A named adopter's written conflict policy, SIG API Machinery discussion of parsing `managedFields` to ignore conflicts, a head-to-head comparison of force with strip-or-adopt, and whether `kubectl` made server-side apply the default were not found. UNVERIFIED.

## Not found or unread

- The Config Connector public documentation page `ways-to-install` returned empty content, and no other Config Connector page about field managers was found.
- The body of the Argo CD sync-options page past the Server-Side Apply section, including "Respect ignore differences configs", was not read.
- The `ssa.PatchReplaceFieldsManagers` body and the Cluster API `MitigateManagedFieldsIssue` body were not read.

## Pages updated from this source

[[concepts/server-side-apply-and-field-ownership]], [[comparisons/ssa-conflict-policy-across-tools]], [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]], [[decisions/force-conflicts-or-surface-them-to-humans]], [[decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field]], [[entities/helm]], [[entities/kro]], [[entities/ack]], [[entities/config-connector]], [[entities/cluster-api]], [[entities/argo-cd]], [[entities/flux]], and the findings and examples that cite this page.
