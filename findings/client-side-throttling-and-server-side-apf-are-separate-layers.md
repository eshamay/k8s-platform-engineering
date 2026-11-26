---
title: Client-side throttling and server-side APF are separate layers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [pitfall, scale, apf, throttling, client-go, qps]
---

# Client-side throttling and server-side APF are separate layers

## Observation

Two independent mechanisms slow a controller down. The client's own rate limiter, configured by `QPS` and `Burst` in `rest.Config`, delays requests before they leave the process. API Priority and Fairness on the server queues or rejects requests with HTTP 429 when a priority level is saturated. The client-go architecture document calls the client settings "the client's half of the contract with the server's API Priority and Fairness system" and says the client honours the 429 `Retry-After` header. https://github.com/kubernetes/client-go/blob/master/ARCHITECTURE.md [[sources/research-scale-and-sharding]]

## Why it matters

A log line quoted by Upbound shows the confusion. It says a request waited "due to client-side throttling, not priority and fairness", which tells the reader that raising server capacity would not have helped, and the fix was a higher client discovery limit. APF in turn protects the cluster from a misbehaving controller by isolating its flow, but it depends on clients backing off, and the dossier names custom clients with poor backoff as a risk. The APF metrics, such as the rejected-requests counter and the queue-length gauges, show whether a controller is being throttled by the server. https://kubernetes.io/docs/concepts/cluster-administration/flow-control/

## What to check first

When a controller is slow, the first question is which layer is waiting. Client-side waits appear in the client's own logs, while server-side waits appear in the APF metrics and as 429 responses. The tool-specific knobs are compared in [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]]. The overload case that APF is meant to contain is [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]], and the mechanism in context is [[concepts/scale-and-sharding]]. See also [[examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes]].
