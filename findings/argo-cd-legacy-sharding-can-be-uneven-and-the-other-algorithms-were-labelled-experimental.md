---
title: Argo CD legacy sharding can be uneven and the other algorithms were labelled experimental
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [pitfall, argo-cd, sharding, scale, algorithm]
---

# Argo CD legacy sharding can be uneven and the other algorithms were labelled experimental

## Observation

Argo CD assigns each destination cluster to one application-controller replica. The `ARGOCD_CONTROLLER_REPLICAS` setting tells each replica the total, and the assignment algorithm is selectable. The legacy algorithm is based on the cluster UID and can distribute clusters unevenly, while round-robin and consistent-hashing were described as experimental in the digest of the high-availability page. A cluster can also be pinned to a shard through a field on its cluster secret. https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/ [[sources/research-scale-and-sharding]]

## Why it matters

Because the unit of sharding is a whole cluster, one very large cluster cannot be split, and an uneven assignment leaves one replica with most of the load while others idle. The experimental label means a team choosing a better distribution accepts maturity risk. The label may be out of date, since the dossier says the current release was not rechecked. This is tracked as a gap in [[open-knowledge-gaps]].

## Related pages

[[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[entities/argo-cd]], [[concepts/scale-and-sharding]].
