---
title: Drift detection latency is the interval
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [drift, intervals, api-load, trade-off]
---

# Drift detection latency is the interval

## Observation

Each tool detects drift by a different mechanism, and the worst-case detection latency equals the interval of that mechanism. Flux detects drift with a server-side apply dry run each `spec.interval`, Crossplane detects external changes with a poll interval, and Argo CD self-heals when it sees live state diverge from Git. The dossier concludes that long intervals trade API load for slower correction. URLs: https://fluxcd.io/flux/components/kustomize/kustomizations/, https://docs.crossplane.io/latest/managed-resources/managed-resources/, and https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/. [[sources/research-eventual-consistency-and-convergence]]

## Related hazard

Flux needs `force` to change immutable fields, which recreates the object and risks downtime. See [[findings/immutable-fields-and-drift-collisions]].

## Mitigations

Choose intervals per resource class, with shorter intervals for critical objects and longer ones for slow cloud APIs, and use events such as source revision changes for low-latency reaction. See [[findings/cost-of-constant-reconciliation]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], and [[concepts/self-healing-and-drift-detection]].

## Related

[[concepts/eventual-consistency-and-convergence]]
