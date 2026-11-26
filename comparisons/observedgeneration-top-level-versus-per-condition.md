---
title: observedGeneration at the top level versus on each condition
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [observedgeneration, conditions, conventions, flux, cluster-api, ack]
---

# observedGeneration at the top level versus on each condition

## Question

Should `observedGeneration` live once at the top level of `status`, inside every condition, or both? The dossier lists this as unsettled across sources. [[sources/research-spec-status-split]]

## Comparison

The current API conventions put `observedGeneration` on each condition, so each condition says which spec generation it describes. Flux and Cluster API use a top-level `status.observedGeneration`, and Flux's HelmRelease status also carries conditions of its own. kstatus reads `observedGeneration` together with the conditions. The ACK issue asks for the per-condition form, because a single condition such as `ResourceSynced` can lag behind other conditions, and it argues that the per-condition form stays compatible with Server-Side Apply even when several writers set different conditions.

## Analysis

A top-level field is simple to compare against `metadata.generation` and is cheap for generic tooling. A per-condition field is more precise when different conditions are updated at different times or by different writers, which is why it appears in the conventions. Using both lets simple tools and precise tools coexist, at the cost of two places to keep correct. The dossier does not settle which is better, and it did not read the final 15,000 characters of the conventions. This remains a question for a later pass. See [[findings/missing-observedgeneration-hides-stale-status]], [[findings/premature-readiness-in-kstatus-based-tools]], and [[concepts/conditions]].

## Related

[[concepts/spec-status-split]], [[entities/flux]], [[entities/cluster-api]], [[entities/ack]]
