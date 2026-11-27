---
title: Without prune Flux leaves removed manifests running as orphans
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [pitfall, flux, prune, garbage-collection]
---

# Without prune Flux leaves removed manifests running as orphans

## Observation

The Kustomization reference defines garbage collection as removing objects that were applied earlier but are missing from the current source revision. When `prune` is off, deleting a manifest from Git leaves the live object in the cluster, which breaks the claim that Git is the source of truth. The practitioner blog puts it this way: "Git is the only source of truth. Without prune, deleted manifests leave orphaned resources." It recommends enabling `prune` together with `healthChecks`. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## Trade-off

The opposite risk is covered elsewhere in the wiki. Turning prune on means a bad edit to Git can delete real objects, and for provider-managed resources it can delete cloud infrastructure. The per-object annotation `kustomize.toolkit.fluxcd.io/prune: disabled` is the escape hatch.

## Related

[findings/unintended-deletion-through-prune](unintended-deletion-through-prune.md), [findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md), [comparisons/flux-versus-argo-cd-drift-and-prune-defaults](../comparisons/flux-versus-argo-cd-drift-and-prune-defaults.md), [entities/flux](../entities/flux.md)
