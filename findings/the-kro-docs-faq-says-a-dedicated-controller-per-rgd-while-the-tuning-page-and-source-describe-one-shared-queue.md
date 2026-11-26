---
title: The kro docs FAQ says a dedicated controller per RGD while the tuning page and source describe one shared queue
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: [kro dedicated controller wording conflict]
tags: [kro, documentation, workqueue, controller-model]
---

# The kro docs FAQ says a dedicated controller per RGD while the tuning page and source describe one shared queue

## Observation

Two pages in the same kro docs tree describe the controller model differently. The FAQ says "kro then deploys a dedicated controller to respond to instance events on the CRD" and calls it a microcontroller. The controller tuning page says "Single shared queue - All resource events flow through one rate-limited queue" and adds that "the shared queue could be replaced with per-RGD queues in future versions." The source at v0.10.0, `pkg/dynamiccontroller/dynamic_controller.go`, builds one queue named "dynamic-controller-queue", and its header comment says the controller orchestrates "parent watches (one per RGD)". The code and the tuning page agree with each other, so the FAQ wording is the outlier. [[sources/research-gap-o5-kro-ecosystem]] URLs: https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/faq.md, https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/advanced/03-controller-tuning.md, and https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/dynamiccontroller/dynamic_controller.go.

## Why it matters

Readers who take the FAQ at face value will size kro as many controllers with separate queues and workers, and will look for per-RGD isolation that does not exist. The accurate model is one dynamic controller with one worker by default, one token-bucket rate limit of 10 events per second with burst 100, and one parent watch per RGD. Starvation across RGDs is therefore possible, see [[findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues]].

## Related

[[entities/kro]], [[examples/kro-shared-queue-tunes-throughput]], [[findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter]]
