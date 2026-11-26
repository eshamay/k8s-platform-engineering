---
title: A kro Graph has no revision history and sets no owner references on the resources it creates
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, graph-api, graph-revision, owner-references, alpha]
---

# A kro Graph has no revision history and sets no owner references on the resources it creates

## Observation

For a ResourceGraphDefinition, kro creates "an immutable snapshot called a **GraphRevision**" on each spec change. The Graph status and lifecycle page says the opposite for the alpha `Graph` kind: "kro does not create GraphRevision objects for Graphs". It also says "kro does not set owner references on the resources a Graph creates". Instead a Graph keeps a `status.managedResources` inventory, capped at 5000 entries, that drives pruning and deletion. The page documents a third condition model for Graphs (`Accepted`, `ResourcesConverged`, `Ready`) with reasons such as `WaitingForReadiness`, `DataPending`, `FieldManagerConflict`, and `ApplyFailed`. [[sources/research-gap-g3-kro]] URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/graph/05-status-and-lifecycle.md

## Why it matters

The revision machinery that makes a bad RGD edit visible, described in [[findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback]], does not exist for Graphs, so there is no revision object to pin or compare. Missing owner references mean Kubernetes garbage collection will not clean up a Graph's resources, and tools that follow owner references to show a hierarchy will not link them to the Graph. The inventory cap of 5000 is a ceiling on what one Graph can manage. The docs also say that by default kro does not set owner references on RGD instance resources either, which is consistent with the ApplySet design in [[findings/default-owner-references-delete-out-of-order-and-cannot-link-namespaced-to-cluster-scoped-objects-so-kro-uses-applysets]].

## Mitigations

Keep Graph definitions in Git, since the cluster holds no history for them. Use the `managedResources` inventory, not owner references, to see what a Graph owns. For rollout safety that depends on revisions, stay on RGDs, see [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]] and [[entities/kro]].
