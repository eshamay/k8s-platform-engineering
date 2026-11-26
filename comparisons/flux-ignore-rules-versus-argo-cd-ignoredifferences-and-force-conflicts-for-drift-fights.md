---
title: Flux ignore rules versus Argo CD ignoreDifferences and force-conflicts for drift fights
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [flux, argo-cd, crossplane, ssa, drift, ignore, conflict]
---

# Flux ignore rules versus Argo CD ignoreDifferences and force-conflicts for drift fights

## The shared problem

When a GitOps tool and another writer both set a field, such as an HPA and `replicas`, the two loop forever. Each tool's answer decides who wins, and the sources say so differently. [[sources/research-pitfalls-and-case-studies]]

## How each tool answers

| Tool | Mechanism | Who wins by default |
|---|---|---|
| Flux | Kustomization `.spec.ignore` with JSON Pointer paths and a target selector; strips the field when another SSA manager owns it, adopts the live value when Flux is the sole owner | The other writer, for ignored fields |
| Argo CD | `ignoreDifferences`, applied at sync time when `RespectIgnoreDifferences` is set; with `ServerSideApply=true` it runs `--force-conflicts` and moves client-side managers to `argocd-controller` | Argo CD, on any field that is not ignored |
| Crossplane | `forProvider` is the source of truth and console edits are reverted; `initProvider` holds create-only values such as an autoscaled `desiredSize` | Crossplane, except for fields in `initProvider` |

URLs: https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/, https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/, and https://docs.crossplane.io/v1.20/concepts/managed-resources/.

## What the sources do not settle

Neither the Flux nor the Argo CD source compares the approaches directly, and neither states which is safer when two controllers legitimately co-own a field. The cost of ignoring is covered in [[findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied]]. For the wider matrix see [[comparisons/exemption-and-ignore-controls-across-tools]], [[comparisons/ssa-conflict-policy-across-tools]], and [[decisions/force-conflicts-or-surface-them-to-humans]]. The question is tracked in [[open-knowledge-gaps]].

## Related

[[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]], [[concepts/server-side-apply-and-field-ownership]]
