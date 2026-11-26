---
title: The scale dossier relies on model digests for most numbers, so limits need rechecking
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [source-quality, scale, caveat]
---

# The scale dossier relies on model digests for most numbers, so limits need rechecking

## Observation

Eleven of the thirteen pages behind [[sources/research-scale-and-sharding]] were read through WebFetch, which returns a model-generated digest and not the raw page text. The API Priority and Fairness page and KEP-1040 were only partly read, with about 39,000 and 69,000 characters unread respectively. Only the client-go architecture document and the Crossplane provider-families blog were read in full.

## Which numbers are affected

The figures that need rechecking before they are quoted include the per-CRD memory in the Upbound post, the Gardener etcd, object, and node limits, the Argo CD processor sizes and the experimental label on its algorithms, the Crossplane CRD and pod estimates, and the SIG Scalability thresholds. Quotes the dossier marks as paraphrased, such as the KEP-1040 sentence about crowding out load, should not be reproduced as verbatim.

## How the wiki treats them

Pages built from this dossier stay at `draft` where they depend on a single digest, and the numbers are attributed to the source. [[concepts/scale-and-sharding]] is active because its structure is supported by several independent sources, not because every figure is verified. A follow-up read of the raw pages is tracked in [[open-knowledge-gaps]].
