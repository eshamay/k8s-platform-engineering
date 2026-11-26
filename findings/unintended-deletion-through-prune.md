---
title: Unintended deletion through prune
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [pitfall, prune, deletion, gitops]
---

# Unintended deletion through prune

## Observation

Pruning removes objects that are no longer in the desired configuration, and the boundary of "the desired configuration" is easy to misjudge. The kubectl declarative tutorial warns that `kubectl apply --prune` can delete objects that were created outside the config workflow, and it recommends explicit `kubectl delete -f` instead. [[sources/research-declarative-vs-imperative]]

## How tools respond

[[entities/argo-cd]] defaults to no prune and no self-heal, and adds an allow-empty protection so an empty source does not prune everything. [[entities/flux]] prunes when `prune` is enabled, offers a per-object disable annotation, and has a deletion policy with MirrorPrune, Delete, WaitForTermination, and Orphan. See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

## Mitigations

Run `kubectl diff` before applying, keep prune off until the source of truth is trusted, annotate objects that must never be pruned, and choose an orphan or retain policy for critical resources.

## Caveat

The dossier found no incident write-ups of an accidental prune, so the severity is inferred from documentation warnings. See [[open-knowledge-gaps]].

## Related

[[findings/destructive-deletion-of-external-resources]], [[entities/kubectl]]
