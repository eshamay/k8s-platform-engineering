---
title: Server-side apply conflict policy across tools
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [comparison, server-side-apply, conflict, gitops]
---

# Server-side apply conflict policy across tools

Every tool that applies with SSA must decide what happens when another manager owns a field it wants to set. The tools answer differently. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

| Tool | Default on conflict | Escape hatches | Field manager |
|---|---|---|---|
| `kubectl apply --server-side` | Error | `--force-conflicts` forces everything | `kubectl` unless `--field-manager` is set |
| [entities/argo-cd](../entities/argo-cd.md) | Force (`--server-side --force-conflicts`), opt-in via `ServerSideApply=true` | `ignoreDifferences`, Server-Side Diff, `managedFieldsManagers` | `argocd-controller` |
| [entities/flux](../entities/flux.md) | Force-applies its own intent | `ssa` annotation (`Override`, `Merge`, `IfNotPresent`, `Ignore`), `.spec.ignore` with Strip and Adopt, `--override-manager` (after a successful dry-run), `--override-manager-before-dry-run` (kustomize-controller v1.10.0 and Flux v2.10.0, recovery only) | kustomize-controller, plus `flux-client-side-apply` for preserving kubectl edits |
| [entities/kluctl](../entities/kluctl.md) | Decides per field, overwriting known interactive managers | `--force-apply`, `kluctl.io/force-apply`, `kluctl.io/force-apply-field` | Kluctl's own manager |
| Controllers (Kubebuilder) | Force ownership of fields they manage | Specify only the fields you manage | Named with `client.FieldOwner` |
| [entities/crossplane](../entities/crossplane.md) | Uses SSA to propagate claim to composite to composed resources | Merge markers on provider CRDs; managed-field cleanup on migration | Prefix `apiextensions.crossplane.io/composed/` |
| [entities/kro](../entities/kro.md) | Applies templates with force; applies patch contributions without force; opt-in conflict detection refuses to steal from another Graph | `ConflictDetection` (standalone Graph controller only) | `kro.run/applyset`, `kro-instance-status`, per-Graph prefix `kro-graphengine.tmpl.` |
| [entities/ack](../entities/ack.md) | No server-side apply in the runtime; sends merge patches (Update-type, no conflicts raised) | None found | None set by the runtime |
| [entities/config-connector](../entities/config-connector.md) | No server-side apply; `Update` writes, and fields set by other managers are read as user intent | None found in docs (public page unreadable) | `cnrm-controller-manager`, plus `supports-ssa` for a metadata-only apply |
| [entities/helm](../entities/helm.md) (CLI, Helm 4) | Server-side apply by default on install; conflicts error unless `--force-conflicts` | `--server-side` true, false, auto; `--force-conflicts` | Binary base name, normally `helm` |
| helm-controller | Always forces conflicts under server-side apply | `--override-manager` (takes over before its dry-run diff) | The controller's own manager |
| [entities/cluster-api](../entities/cluster-api.md) (topology controller) | Force ownership | Avoid co-authored list slices | `capi-topology` |

## Reading the table

The Kubernetes maintainers' guidance is that controllers should force and CD tools should surface conflicts, yet Argo CD and Flux both force by default and then add exemptions. Kluctl is the one tool in the dossier that makes a per-field decision. See [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md) and [findings/forcing-conflicts-hides-disagreements-between-writers](../findings/forcing-conflicts-hides-disagreements-between-writers.md).

The Flux Strip and Adopt rules differ in direction. Strip removes a field from Flux's payload when another Apply-type manager owns it. Adopt keeps the live value when Flux is the sole Apply-type owner so Update-type edits survive. See [examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers](../examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers.md).

## Gaps

Argo CD's `Replace=true` takes precedence over SSA and `Force=true` is ignored under SSA. Correction note, 2026-11-26: kro, ACK, Config Connector, Helm 4, and helm-controller used to be absent because no primary source had been read, and the m4 dossier now supplies the rows above from source at named commits. The Argo CD manager name `argocd-controller` in the table comes from earlier sources, because the sync-options page says client-side apply migration is enabled by default but does not name the manager. The Flux flag semantics are now confirmed by the controller options pages, and the helm-controller flag acts before its dry-run diff while the kustomize-controller default flag acts after it. Config Connector claims rest on source and issues only, since its public docs page was unreadable, and the ACK row rests on absence in the shared runtime. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) See [findings/helm-controller-takes-over-override-manager-fields-before-its-dry-run-diff-the-reverse-of-kustomize-controller](../findings/helm-controller-takes-over-override-manager-fields-before-its-dry-run-diff-the-reverse-of-kustomize-controller.md), [comparisons/exemption-and-ignore-controls-across-tools](exemption-and-ignore-controls-across-tools.md) and [open-knowledge-gaps](../open-knowledge-gaps.md).
