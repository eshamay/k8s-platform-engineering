---
title: The scale dossier relies on model digests for most numbers, so limits need rechecking
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [source-quality, scale, caveat]
---

# The scale dossier relies on model digests for most numbers, so limits need rechecking

## Observation

Eleven of the thirteen pages behind [sources/research-scale-and-sharding](../sources/research-scale-and-sharding.md) were read through WebFetch, which returns a model-generated digest and not the raw page text. The API Priority and Fairness page and KEP-1040 were only partly read, with about 39,000 and 69,000 characters unread respectively. Only the client-go architecture document and the Crossplane provider-families blog were read in full.

## Which numbers are affected

The figures that need rechecking before they are quoted include the per-CRD memory in the Upbound post, the Gardener etcd, object, and node limits, the Argo CD processor sizes and the experimental label on its algorithms, the Crossplane CRD and pod estimates, and the SIG Scalability thresholds. Quotes the dossier marks as paraphrased, such as the KEP-1040 sentence about crowding out load, should not be reproduced as verbatim.

## How the wiki treats them

Pages built from this dossier stay at `draft` where they depend on a single digest, and the numbers are attributed to the source. [concepts/scale-and-sharding](../concepts/scale-and-sharding.md) is active because its structure is supported by several independent sources, not because every figure is verified. A follow-up read of the raw pages is tracked in [open-knowledge-gaps](../open-knowledge-gaps.md).

## Recheck result (2026-11-26)

The follow-up read in [sources/research-gap-g3-scale-recheck](../sources/research-gap-g3-scale-recheck.md) compared the digest-derived figures with raw text, using full-page scrapes and raw files from GitHub, and found no numeric value that needed correcting. Three wordings were tightened: the Upbound figure is "a little over 4MiB" of resident memory per CRD and not "several MiB", the Argo CD processor guidance is 50 and 25 for 1,000 applications against defaults of 20 and 10, and the Crossplane memory figures are design-doc targets. The APF page was read in full. The KEP-1040 README was fetched in full but only its Summary, Motivation, Goals, seat and shuffle-sharding sections and `kep.yaml` were read closely, so the sentence that the dossier had marked as a paraphrase is now quotable verbatim while claims about the rest of the KEP stay unverified. The caveat above is therefore historical for the figures listed, and still applies to anything not named in the recheck.

## KEP-1040 residual (2026-11-26)

Update 2026-11-26: the KEP-1040 residual is now read. The README (3,337 lines) was read by section, covering the fair queuing equations, LIST width, test plan, graduation criteria, and production readiness answers, and `kep.yaml` was read. See [findings/apf-fair-queuing-allocates-seats-equally-and-a-slow-reader-can-hold-hand-size-times-ten-seats](apf-fair-queuing-allocates-seats-equally-and-a-slow-reader-can-hold-hand-size-times-ten-seats.md) and [findings/the-kep-1040-readme-history-stops-at-v1-26-while-its-kep-yaml-records-stable-in-v1-29](the-kep-1040-readme-history-stops-at-v1-26-while-its-kep-yaml-records-stable-in-v1-29.md). The figures from the earlier recheck (SIG Scalability, Gardener, Upbound, Argo CD, Crossplane) were not reread in this pass and stand as recorded. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md)
