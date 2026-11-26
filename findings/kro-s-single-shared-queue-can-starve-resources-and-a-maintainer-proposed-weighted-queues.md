---
title: kro's single shared queue can starve resources and a maintainer proposed weighted queues
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [kro issue 198]
tags: [kro, workqueue, starvation, scale, proposal]
---

# kro's single shared queue can starve resources and a maintainer proposed weighted queues

## Observation

kro's controller tuning page describes a "Single shared queue - All resource events flow through one rate-limited queue", shared by every ResourceGraphDefinition, and the docs add that "the shared queue could be replaced with per-RGD queues in future versions." On 2025-01-11 the maintainer a-hilaly opened issue 198 proposing weighted queues, because a single queue "can lead to resource starvation and unpredictable processing times for important resources." [[sources/research-gap-g1-named-adopters]] URLs: https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/advanced/03-controller-tuning.md and https://github.com/kubernetes-sigs/kro/issues/198.

## What is not known

The proposal is not shipped as far as the dossier read. Issue 610 (2025-07-23) asks for continuous performance testing and posts no results, so there is no measured scaling limit for the shared queue. The defaults on main are one dynamic-controller worker and a token bucket of 10 events per second with burst 100, which bound throughput, and they may differ from tagged releases.

## Correction to the earlier framing

Earlier wiki pages described kro as starting a dedicated controller per ResourceGraphDefinition. The released docs describe lazy informers per registered RGD but a shared queue and shared workers, so the scaling question is about one queue and not about many controllers. See [[entities/kro]].

## Related

[[examples/kro-shared-queue-tunes-throughput]], [[findings/a-kro-hard-apply-failure-discarded-watches-and-hot-looped-while-large-collections-re-listed-against-the-apiserver]], [[concepts/informers-reflectors-and-workqueues]]
