---
title: Flux ignore rules versus Argo CD ignoreDifferences and force-conflicts for drift fights
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [flux, argo-cd, crossplane, ssa, drift, ignore, conflict]
---

# Flux ignore rules versus Argo CD ignoreDifferences and force-conflicts for drift fights

## The shared problem

When a GitOps tool and another writer both set a field, such as an HPA and `replicas`, the two loop forever. Each tool's answer decides who wins, and the sources say so differently. [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md)

## How each tool answers

| Tool | Mechanism | Who wins by default |
|---|---|---|
| Flux | Kustomization `.spec.ignore` with JSON Pointer paths and a target selector; strips the field when another SSA manager owns it, adopts the live value when Flux is the sole owner | The other writer, for ignored fields |
| Argo CD | `ignoreDifferences`, applied at sync time when `RespectIgnoreDifferences` is set; with `ServerSideApply=true` it runs `--force-conflicts` and moves client-side managers to `argocd-controller` | Argo CD, on any field that is not ignored |
| Crossplane | `forProvider` is the source of truth and console edits are reverted; `initProvider` holds create-only values such as an autoscaled `desiredSize` | Crossplane, except for fields in `initProvider` |

URLs: https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/, https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/, and https://docs.crossplane.io/v1.20/concepts/managed-resources/.

## What the sources do not settle

Neither the Flux nor the Argo CD source compares the approaches directly, and neither states which is safer when two controllers legitimately co-own a field. The cost of ignoring is covered in [findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied](../findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied.md). For the wider matrix see [comparisons/exemption-and-ignore-controls-across-tools](exemption-and-ignore-controls-across-tools.md), [comparisons/ssa-conflict-policy-across-tools](ssa-conflict-policy-across-tools.md), and [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md). The question is tracked in [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed](../examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)

## Update from the m4 dossier

Update 2026-11-26: the Flux and Argo CD rows are now backed by primary documentation. The Flux Strip and Adopt wording is in the kustomize-controller specification, Argo CD's server-side apply mode is documented to run `kubectl apply --server-side --force-conflicts` and to ignore `Force=true`, and `managedFieldsManagers` is documented in the diffing page. The comparison the sources lacked is still absent: no source or experiment compares the policies under a shared-field scenario. The options are laid out without a recommendation in [decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field](../decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field.md). [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) See also [examples/the-kube-green-case-study-says-managedfieldsmanagers-works-today-but-is-not-a-documented-contract-between-the-projects](../examples/the-kube-green-case-study-says-managedfieldsmanagers-works-today-but-is-not-a-documented-contract-between-the-projects.md).

## Update from the o1 dossier, 2026-11-26

Two scoping details sharpen the comparison. Argo CD ignore rules are diff-only by default, and `RespectIgnoreDifferences=true` applies only to resources that already exist ([findings/argo-cd-ignoredifferences-only-affects-the-diff-unless-respectignoredifferences-is-set-and-then-only-for-resources-that-already-exist](../findings/argo-cd-ignoredifferences-only-affects-the-diff-unless-respectignoredifferences-is-set-and-then-only-for-resources-that-already-exist.md)). A Flux ignore rule with no `target` matches all objects in the Kustomization ([findings/a-flux-ignore-rule-without-a-target-selector-matches-every-object-the-kustomization-manages](../findings/a-flux-ignore-rule-without-a-target-selector-matches-every-object-the-kustomization-manages.md)). [sources/research-gap-o1-argocd-flux-gitops](../sources/research-gap-o1-argocd-flux-gitops.md)
