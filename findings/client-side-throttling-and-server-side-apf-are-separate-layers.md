---
title: Client-side throttling and server-side APF are separate layers
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
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: []
tags: [pitfall, scale, apf, throttling, client-go, qps]
---

# Client-side throttling and server-side APF are separate layers

## Observation

Two independent mechanisms slow a controller down. The client's own rate limiter, configured by `QPS` and `Burst` in `rest.Config`, delays requests before they leave the process. API Priority and Fairness on the server queues or rejects requests with HTTP 429 when a priority level is saturated: levels of type `Reject` answer excess traffic immediately with 429, and levels of type `Queue` use shuffle sharding and fair queuing. The page is feature-state stable since v1.29, and its intro says "a poorly-behaved controller need not starve others (even at the same priority level)." The recheck of 2026-11-26 read the whole page. [sources/research-gap-g3-scale-recheck](../sources/research-gap-g3-scale-recheck.md) The client-go architecture document calls the client settings "the client's half of the contract with the server's API Priority and Fairness system" and says the client honours the 429 `Retry-After` header. https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md [sources/research-scale-and-sharding](../sources/research-scale-and-sharding.md)

## Why it matters

A log line quoted by Upbound shows the confusion. It says a request waited "due to client-side throttling, not priority and fairness", which tells the reader that raising server capacity would not have helped, and the fix was a higher client discovery limit. APF in turn protects the cluster from a misbehaving controller by isolating its flow, but it depends on clients backing off, and the dossier names custom clients with poor backoff as a risk. The APF metrics, such as the rejected-requests counter and the queue-length gauges, show whether a controller is being throttled by the server. https://kubernetes.io/docs/concepts/cluster-administration/flow-control/

## What to check first

When a controller is slow, the first question is which layer is waiting. Client-side waits appear in the client's own logs, while server-side waits appear in the APF metrics and as 429 responses. The tool-specific knobs are compared in [comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro](../comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro.md). The overload case that APF is meant to contain is [examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane](../examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane.md), and the mechanism in context is [concepts/scale-and-sharding](../concepts/scale-and-sharding.md). See also [examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes](../examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes.md).

## Flux as a worked case

Flux controllers have been APF-aware since mid-2022, and a custom-kubeconfig path that still throttled on the client was fixed in 2026. See [findings/flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026](flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026.md). No published incident ties Flux to APF throttling. [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md)
