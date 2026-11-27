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
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: [kro issue 198]
tags: [kro, workqueue, starvation, scale, proposal]
---

# kro's single shared queue can starve resources and a maintainer proposed weighted queues

## Observation

kro's controller tuning page describes a "Single shared queue - All resource events flow through one rate-limited queue", shared by every ResourceGraphDefinition, and the docs add that "the shared queue could be replaced with per-RGD queues in future versions." On 2025-01-11 the maintainer a-hilaly opened issue 198 proposing weighted queues, because a single queue "can lead to resource starvation and unpredictable processing times for important resources." [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md) URLs: https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/advanced/03-controller-tuning.md and https://github.com/kubernetes-sigs/kro/issues/198.

## What is not known

The proposal is not shipped as far as the dossier read. Issue 610 (2025-07-23) asks for continuous performance testing and posts no results, so there is no measured scaling limit for the shared queue. The defaults on main are one dynamic-controller worker and a token bucket of 10 events per second with burst 100, which bound throughput, and they may differ from tagged releases.

## Correction to the earlier framing

Earlier wiki pages described kro as starting a dedicated controller per ResourceGraphDefinition. The released docs describe lazy informers per registered RGD but a shared queue and shared workers, so the scaling question is about one queue and not about many controllers. See [entities/kro](../entities/kro.md).

## Related

[examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md), [findings/a-kro-hard-apply-failure-discarded-watches-and-hot-looped-while-large-collections-re-listed-against-the-apiserver](a-kro-hard-apply-failure-discarded-watches-and-hot-looped-while-large-collections-re-listed-against-the-apiserver.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md)

## Update from the o5 dossier

Update 2026-11-26: the shared-queue model is confirmed against the v0.10.0 source (`Name: "dynamic-controller-queue"`), and the docs FAQ is the outlier, see [findings/the-kro-docs-faq-says-a-dedicated-controller-per-rgd-while-the-tuning-page-and-source-describe-one-shared-queue](the-kro-docs-faq-says-a-dedicated-controller-per-rgd-while-the-tuning-page-and-source-describe-one-shared-queue.md). Issue 198 and issue 610 are still open. Pull request 1159, which raised deletion latency at large scale, was closed unmerged on 2026-08-11. See [findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter](kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter.md). [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md)
