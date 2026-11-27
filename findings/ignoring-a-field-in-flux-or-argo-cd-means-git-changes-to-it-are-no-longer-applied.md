---
title: Ignoring a field in Flux or Argo CD means Git changes to it are no longer applied
type: finding
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [pitfall, flux, argo-cd, ignore-rules, ignoredifferences, drift]
---

# Ignoring a field in Flux or Argo CD means Git changes to it are no longer applied

## Observation

Flux's new Kustomization `.spec.ignore` rules stop the drift fight over a field by stripping it from the apply payload when another manager owns it, or by adopting the live value when Flux is the sole owner. The Flux blog states the limitation that Git changes to an ignored field are no longer applied, and changes to ignored fields do not trigger reconciliation. URL: https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/. Argo CD's `ignoreDifferences` with `RespectIgnoreDifferences` is the equivalent at sync time. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/. [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md)

## Why it matters

Ignoring a field settles ownership in favor of the other writer. If a team later wants Git to set that field, for example a new replica count, nothing will apply it, and the omission is easy to miss. The practice is to ignore only fields a controller rewrites on purpose, such as `replicas` under an HPA or a `caBundle` written by cert-manager.

## Evidence quality

Both claims come from first-party documentation or project blogs. No source measured how often teams forget the limitation.

## Related

[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights](../comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights.md), [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md), [examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed](../examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed.md)
