---
title: Tested scalability maximums and operator advice differ by an order of magnitude
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [scale, limits, sig-scalability, gardener, nodes]
---

# Tested scalability maximums and operator advice differ by an order of magnitude

## Observation

SIG Scalability's tested envelope lists about 5,000 nodes per cluster, while Gardener advises that most clusters stay below 500 nodes. The envelope also says its thresholds are given for the largest possible cluster and that limits for smaller clusters are proportionally lower. Neither source lists CRD count as a tested dimension. https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md and https://gardener.cloud/docs/guides/administer-shoots/scalability/ [[sources/research-scale-and-sharding]]

## Interpretation

The dossier does not reconcile the two figures. The difference reflects different goals: one is a tested maximum under conditions the project controls, and the other is operational advice for keeping many production clusters healthy over time. This is not recorded as a contradiction, because the sources do not make competing claims about the same quantity. A reader sizing a platform should treat the envelope as an upper bound and the operator advice as a conservative working target. Both sources were reread in full on 2026-11-26 and the figures held. Two qualifiers matter: the SIG table covers "builtin resource types" only and says its thresholds "are NOT hard limits", and Gardener's own advice assumes nodes of at least 8 vCPU and 32 GB. [[sources/research-gap-g3-scale-recheck]]

## Related pages

[[examples/gardener-advises-keeping-most-clusters-under-about-500-nodes-and-controlling-webhooks-and-object-counts]], [[findings/etcd-scale-limits-of-the-shared-store]], [[concepts/scale-and-sharding]].
