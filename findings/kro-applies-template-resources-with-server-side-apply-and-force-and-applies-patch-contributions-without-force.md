---
title: kro applies template resources with server-side apply and force, and applies patch contributions without force
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [kro server-side apply behavior]
tags: [kro, server-side-apply, field-manager, conflict, verified]
---

# kro applies template resources with server-side apply and force, and applies patch contributions without force

## Observation

In kro's graph executor, template nodes are applied with `client.Apply`, and when the force flag is set the call adds `client.ForceOwnership`. A patch node, which contributes fields to an object that kro does not own, is applied under a per-node manager without force, and the source comment says "a patch contributes without force so it only claims the fields it sets". [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) URL: https://github.com/kubernetes-sigs/kro/blob/main/pkg/graphengine/executor/simple.go (commit a2ac57b, read 2026-11-26).

## Manager names and conflict detection

The shared manager on the ResourceGraphDefinition and instance path is `kro.run/applyset`, and instance status is written under `kro-instance-status`. An opt-in `ConflictDetection` option, enabled only for the standalone Graph controller, uses a per-Graph manager with the prefix `kro-graphengine.tmpl.` and refuses to force-steal a field already owned by another Graph's template manager. The conflict then surfaces as a soft not-ready state. The source says "External drift (kubectl, other controllers) is still reclaimed by a forced re-apply", so the refusal protects peer Graphs from each other and does not protect other controllers' fields. URL: https://github.com/kubernetes-sigs/kro/blob/main/pkg/graphengine/executor/executor.go

## Why it matters

kro therefore sits between the two common policies. Its owned template resources follow the Kubernetes guidance that a controller forces what it owns, and its patch contributions yield by default. This is the same split the dossier records for Cluster API and Config Connector. See [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md) and [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md). The latest kro release read was v0.10.0, published 2026-11-10.

## Related

[entities/kro](../entities/kro.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md), [findings/forcing-conflicts-hides-disagreements-between-writers](forcing-conflicts-hides-disagreements-between-writers.md)
