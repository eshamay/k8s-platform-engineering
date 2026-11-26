---
title: Make a migration a managed resource or turn self-heal off
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [decision, argo-cd, self-heal, hooks, migration]
---

# Make a migration a managed resource or turn self-heal off

## Status

Draft. The options come from one author's lab and an unnamed customer incident, not from an Argo CD project recommendation. [[sources/research-gap-g1-gitops-drift-incidents]]

## Context

A database migration written as an Argo CD sync hook can be skipped when self-heal runs a partial sync, as in [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]]. The mechanism is the author's claim, see [[findings/argo-cd-self-heal-runs-a-partial-sync-that-skips-hooks-according-to-one-author-so-a-migration-hook-can-be-missed]].

## Options

- **Managed resource.** Make the migration an ordinary resource in the desired state, with a sync wave for ordering and a release-specific name so each release creates a new one. The migration then belongs to the state that self-heal converges to.
- **Self-heal off.** Turn self-heal off for those Applications so the timer-driven full sync runs the hook. The cost, in the author's words, is that "Anyone who edits a resource by hand now leaves it OutOfSync".

## Consequences

The first keeps drift correction and changes how the migration is written. The second keeps the existing hook and gives up drift correction on those Applications. The post does not rank them, and the wiki has no test of either. See [[decisions/staged-adoption-of-automated-drift-correction]] and [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]].

## Related

[[entities/argo-cd]], [[concepts/self-healing-and-drift-detection]]
