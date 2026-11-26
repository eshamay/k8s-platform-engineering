---
title: "Config Connector has no Terraform-style dependency graph, and Argo CD deletes children without ordering"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [pitfall, config-connector, argo-cd, ordering, single-source]
---

# Config Connector has no Terraform-style dependency graph, and Argo CD deletes children without ordering

## Observation

A single practitioner reports that Config Connector does not order resource creation by dependency the way Terraform's graph does. Under Argo CD, deletion has no ordering either, so children can end in a DeleteFailed state after the parent is removed. The author's workaround is Argo CD sync waves for creation plus a CronJob that patches finalizers on orphaned objects (https://medium.com/@michamarszaek/navigating-config-connector-challenges-a-guide-to-overcoming-pitfalls-a63777ae7ed1). [[sources/research-landscape]]

## Evidence strength

This is a single-author account, and the dossier read it through a brief fetch extraction. It is consistent with the general pattern in [[findings/ordering-and-dependency-failures]], but it has not been confirmed against Config Connector documentation. The dossier says Crossplane Compositions and Kratix workflows centralize ordering in one abstraction without describing their failure behavior, and that Flux uses `dependsOn` between Kustomizations, which is general knowledge and not from a fetched source.

## Why it matters

Per-resource provisioning controllers push ordering onto the delivery tool, and delivery tools order creation better than deletion. The finalizer cleanup in the workaround ties to [[concepts/finalizers]], and the sync-wave part to [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]]. See also [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]].

## Related

[[entities/config-connector]], [[entities/argo-cd]], [[concepts/tooling-landscape]]

## Update from the o4 dossier

Corroboration, not confirmation. A Google design document confirms the mechanism that blocks a child when its parent is deleted first, and no read documentation describes ordered teardown, see [[findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown]]. Open issues 534 and 2894 repeat the ordering claim as reporter reports. The Argo CD half is not confirmed: Argo CD reverses wave order when pruning, and whether cascade application deletion honors waves was not found. The page stays draft until that half is read. [[sources/research-gap-o4-config-connector-ack]]
