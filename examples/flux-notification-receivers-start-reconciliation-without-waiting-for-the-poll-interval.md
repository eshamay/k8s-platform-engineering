---
title: Flux notification receivers start reconciliation without waiting for the poll interval
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [use-case, flux, notification-controller, webhooks, alerts]
---

# Flux notification receivers start reconciliation without waiting for the poll interval

## Scenario

By default Flux learns about a new commit or image only when a source's interval next fires, so a push can wait for up to one interval before it is deployed. Operators also need to hear about failures without watching the cluster. The notification controller covers both needs. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## How it works

A Receiver accepts webhooks from systems such as GitHub, GitLab, Bitbucket, Harbor, and Jenkins and tells the matching sources to reconcile at once. A Provider defines where outbound events go, such as a chat system, and an Alert selects which events to send by severity and by involved object. The Morgan Stanley team fed these events into developer tools so tenants could see the result of their own deployments.

A missing webhook is a quiet failure, since the system keeps working but changes arrive only at the next poll. The practitioner blog in the dossier lists missing webhooks among its common pitfalls.

## Related

[entities/flux](../entities/flux.md), [findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent](../findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent.md), [findings/drift-detection-latency-is-the-interval](../findings/drift-detection-latency-is-the-interval.md), [examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing](flux-kustomization-interval-and-retry-interval-set-the-loop-timing.md), [examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding](morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding.md)
