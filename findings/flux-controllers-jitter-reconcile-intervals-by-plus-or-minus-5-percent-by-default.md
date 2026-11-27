---
title: "Flux controllers jitter reconcile intervals by plus or minus 5 percent by default"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [Flux interval jitter, interval-jitter-percentage]
tags: [flux, interval, jitter, kustomize-controller, helm-controller, defaults, verified]
---

# Flux controllers jitter reconcile intervals by plus or minus 5 percent by default

## Observation

Flux controllers do not requeue at exactly the interval an author wrote. The shared package `github.com/fluxcd/pkg/runtime/jitter` perturbs every interval by a random percentage, and the default is `--interval-jitter-percentage=5`. The jitter is symmetric: the package draws a random percentage up to the limit "with the sign chosen randomly", so 5 means plus or minus 5 percent of the interval. A `.spec.interval` of 10 minutes therefore requeues somewhere between 9.5 and 10.5 minutes. [sources/research-gap-b1-recheck-flux-k8s](../sources/research-gap-b1-recheck-flux-k8s.md) https://github.com/fluxcd/pkg/blob/main/runtime/jitter/interval.go

The kustomize-controller options page documents the flag with "(default 5)" and says "A value of 10 will apply a jitter of +/-10%". Both kustomize-controller and helm-controller bind the flag with `intervalJitterOptions.BindFlags` and call `SetGlobalJitter`. kustomize-controller applies it to the success requeue with `RequeueAfter: jitter.JitteredIntervalDuration(obj.GetRequeueAfter())`. Jitter is not applied when the percentage is 0 or 100 or more. https://fluxcd.io/flux/components/kustomize/options/

## History of the default

The package default became plus or minus 5 percent on 2023-08-07 in fluxcd/pkg commit b73ba327, titled "runtime/jitter: change default to +/-5%". The dossier did not record the earlier value.

## What this settles

The earlier wiki pages said the Kustomization reference mentions jitter and that the value "was not read". The value is now read: it is 5 percent, symmetric, controller-wide, and the same flag exists on the options page for kustomize-controller. See [findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default](the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default.md).

## Why it matters

Jitter is why a fleet of Kustomizations with the same interval does not apply on the same second, and it is why drift-correction latency is "about the interval" and not exactly the interval. See [findings/drift-detection-latency-is-the-interval](drift-detection-latency-is-the-interval.md). A code comment in the jitter package uses "requeue every 5 minutes" as a worked example (1000 resources, concurrency 50). That example may feed the five-minute folklore, but that attribution is the dossier's inference and is unverified. See [findings/the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason](the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason.md).

## Related

[entities/flux](../entities/flux.md), [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md), [examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing](../examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing.md), [findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation](the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation.md)
