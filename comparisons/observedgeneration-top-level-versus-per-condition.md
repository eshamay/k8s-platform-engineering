---
title: observedGeneration at the top level versus on each condition
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: []
tags: [observedgeneration, conditions, conventions, flux, cluster-api, ack]
---

# observedGeneration at the top level versus on each condition

## Question

Should `observedGeneration` live once at the top level of `status`, inside every condition, or both? The dossier lists this as unsettled across sources. [[sources/research-spec-status-split]]

## Comparison

The current API conventions put `observedGeneration` on each condition, so each condition says which spec generation it describes. Flux writes both a top-level `status.observedGeneration` and a per-condition value, and Cluster API's 2020 proposal had no `observedGeneration` before its 2024 proposal moved to `metav1.Condition`. (Correction note: this sentence previously said Flux and Cluster API use a top-level field.) kstatus reads `observedGeneration` together with the conditions. The ACK issue asks for the per-condition form, because a single condition such as `ResourceSynced` can lag behind other conditions, and it argues that the per-condition form stays compatible with Server-Side Apply even when several writers set different conditions.

## Analysis

A top-level field is simple to compare against `metadata.generation` and is cheap for generic tooling. A per-condition field is more precise when different conditions are updated at different times or by different writers, which is why it appears in the conventions. Using both lets simple tools and precise tools coexist, at the cost of two places to keep correct. The dossier does not settle which is better, and it did not read the final 15,000 characters of the conventions. This remains a question for a later pass. See [[findings/missing-observedgeneration-hides-stale-status]], [[findings/premature-readiness-in-kstatus-based-tools]], and [[concepts/conditions]].

## Related

[[concepts/spec-status-split]], [[entities/flux]], [[entities/cluster-api]], [[entities/ack]]

## Evidence from the conditions dossier

KEP-1623 puts `observedGeneration` on each condition as a non-pointer integer because `metadata.generation` is never zero, kro's RGD reference describes the per-condition value as the generation the condition was based on, and kstatus checks the top-level field. The conventions allow either. The dossier does not settle which is best. [[sources/research-conditions]] See [[concepts/conditions]].

## Evidence from the m3 dossier

The three placements coexist and no source ranks them. The conventions describe both, KEP-1623 is implemented and stable, kstatus and Argo CD read only the top-level field, Flux stamps both, Cluster API's contract accepts a per-condition value that defaults to the resource generation, and Config Connector writes only the top-level value and has the per-condition line commented out with a TODO. The earlier remark that the final 15,000 characters of the conventions were unread is resolved: the conventions on the default branch were read and state no placement rule. [[sources/research-gap-m3-status-conditions]] See [[decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both]], [[findings/kstatus-reads-only-the-top-level-observedgeneration-because-its-condition-struct-has-no-per-condition-field]], [[examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration]], and [[examples/config-connector-direct-controllers-write-a-top-level-observedgeneration-and-leave-the-per-condition-line-commented-out]].
