---
title: "Config Connector has no Terraform-style dependency graph, and Argo CD deletes children without ordering"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: medium-config-connector-pitfalls
    hash: c5b9825d753a
    ingested: 2026-11-26
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

A single practitioner reports that Config Connector does not order resource creation by dependency the way Terraform's graph does. Under Argo CD, deletion has no ordering either, so children can end in a DeleteFailed state after the parent is removed. The author's workaround is Argo CD sync waves for creation plus a CronJob that patches finalizers on orphaned objects (https://medium.com/@michamarszaek/navigating-config-connector-challenges-a-guide-to-overcoming-pitfalls-a63777ae7ed1). [sources/research-landscape](../sources/research-landscape.md)

## Evidence strength

This is a single-author account, and the dossier read it through a brief fetch extraction. It is consistent with the general pattern in [findings/ordering-and-dependency-failures](ordering-and-dependency-failures.md), but it has not been confirmed against Config Connector documentation. The dossier says Crossplane Compositions and Kratix workflows centralize ordering in one abstraction without describing their failure behavior, and that Flux uses `dependsOn` between Kustomizations, which is general knowledge and not from a fetched source.

## Why it matters

Per-resource provisioning controllers push ordering onto the delivery tool, and delivery tools order creation better than deletion. The finalizer cleanup in the workaround ties to [concepts/finalizers](../concepts/finalizers.md), and the sync-wave part to [examples/argo-cd-sync-waves-order-crds-operators-and-workloads](../examples/argo-cd-sync-waves-order-crds-operators-and-workloads.md). See also [findings/background-deletion-gives-no-teardown-ordering-between-dependents](background-deletion-gives-no-teardown-ordering-between-dependents.md).

## Related

[entities/config-connector](../entities/config-connector.md), [entities/argo-cd](../entities/argo-cd.md), [concepts/tooling-landscape](../concepts/tooling-landscape.md)

## Update from the o4 dossier

Corroboration, not confirmation. A Google design document confirms the mechanism that blocks a child when its parent is deleted first, and no read documentation describes ordered teardown, see [findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown](a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown.md). Open issues 534 and 2894 repeat the ordering claim as reporter reports. The Argo CD half is not confirmed: Argo CD reverses wave order when pruning, and whether cascade application deletion honors waves was not found. The page stays draft until that half is read. [sources/research-gap-o4-config-connector-ack](../sources/research-gap-o4-config-connector-ack.md)

## Update from the full read of the Medium post

The Medium post (Michał Marszałek, 2023-12-20) is now read in full, and the observation above is a fair summary of it with three details added. The author says Config Connector resolves a reference such as `datasetRef` by the dataset's manifest name, so a table cannot be created until its dataset exists, and he fixes creation with Argo CD sync waves, the dataset at `-1` and the table at `0`. He cites Config Connector issue 384 for the creation-order complaint and Argo CD issue 14505 for the lack of deletion ordering, and neither issue was read here, so both statements stay with him. His CronJob runs every five minutes, finds tables in `DeleteFailed`, and removes their finalizers when the dataset object is gone, see [examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first](../examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first.md). The evidence grade is unchanged: one practitioner, secondary, and the Argo CD half is still not confirmed because this wiki records that Argo CD reverses wave order when pruning, see [entities/argo-cd](../entities/argo-cd.md). [sources/medium-config-connector-pitfalls](../sources/medium-config-connector-pitfalls.md)
