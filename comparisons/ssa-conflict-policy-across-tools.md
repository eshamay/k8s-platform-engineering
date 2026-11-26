---
title: Server-side apply conflict policy across tools
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
aliases: []
tags: [comparison, server-side-apply, conflict, gitops]
---

# Server-side apply conflict policy across tools

Every tool that applies with SSA must decide what happens when another manager owns a field it wants to set. The tools answer differently. [[sources/research-server-side-apply-and-field-ownership]]

| Tool | Default on conflict | Escape hatches | Field manager |
|---|---|---|---|
| `kubectl apply --server-side` | Error | `--force-conflicts` forces everything | `kubectl` unless `--field-manager` is set |
| [[entities/argo-cd]] | Force (`--server-side --force-conflicts`), opt-in via `ServerSideApply=true` | `ignoreDifferences`, Server-Side Diff, `managedFieldsManagers` | `argocd-controller` |
| [[entities/flux]] | Force-applies its own intent | `ssa` annotation (`Override`, `Merge`, `IfNotPresent`, `Ignore`), `.spec.ignore` with Strip and Adopt, `--override-manager` (after a successful dry-run), `--override-manager-before-dry-run` (kustomize-controller v1.10.0 and Flux v2.10.0, recovery only) | kustomize-controller, plus `flux-client-side-apply` for preserving kubectl edits |
| [[entities/kluctl]] | Decides per field, overwriting known interactive managers | `--force-apply`, `kluctl.io/force-apply`, `kluctl.io/force-apply-field` | Kluctl's own manager |
| Controllers (Kubebuilder) | Force ownership of fields they manage | Specify only the fields you manage | Named with `client.FieldOwner` |
| [[entities/crossplane]] | Uses SSA to propagate claim to composite to composed resources | Merge markers on provider CRDs; managed-field cleanup on migration | Prefix `apiextensions.crossplane.io/composed/` |

## Reading the table

The Kubernetes maintainers' guidance is that controllers should force and CD tools should surface conflicts, yet Argo CD and Flux both force by default and then add exemptions. Kluctl is the one tool in the dossier that makes a per-field decision. See [[decisions/force-conflicts-or-surface-them-to-humans]] and [[findings/forcing-conflicts-hides-disagreements-between-writers]].

The Flux Strip and Adopt rules differ in direction. Strip removes a field from Flux's payload when another Apply-type manager owns it. Adopt keeps the live value when Flux is the sole Apply-type owner so Update-type edits survive. See [[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]].

## Gaps

Argo CD's `Replace=true` takes precedence over SSA and `Force=true` is ignored under SSA. kro, ACK, Config Connector, and Helm 4 are absent because the dossier could not read primary sources for them. The Flux flag semantics should be verified against current documentation. See [[comparisons/exemption-and-ignore-controls-across-tools]] and [[open-knowledge-gaps]].
