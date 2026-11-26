---
title: A staging test passed because the failure scaled with cluster size and resource checks ignored API server load
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
aliases: []
tags: [pitfall, rollout, testing, scale, openai]
---

# A staging test passed because the failure scaled with cluster size and resource checks ignored API server load

## Observation

OpenAI's post-mortem says the telemetry service's operations had a cost that "scaled with the size of the cluster", so the impact was "most pronounced in our largest clusters, so our testing didn't catch it." The staging test showed no issues, and the pre-rollout resource checks covered CPU and memory only: "no precautions were taken to assess Kubernetes API server load." The change was merged at 2:23pm, applied to all clusters between 2:51pm and 3:20pm, alerted at 3:13pm, and reached maximum impact at 3:40pm. OpenAI's prevention list includes phased rollouts with cluster-health monitoring and fault injection. All of this is self-reported at https://status.openai.com/incidents/ctrsv3lwd797. [[sources/research-gap-g1-outage-postmortems]]

## Why it matters

A rollout gate must measure the shared dependency, here the API servers, at the size of the largest production cluster. The wiki's scale material says the same about tested limits in [[findings/tested-scalability-maximums-and-operator-advice-differ-by-an-order-of-magnitude]]. See [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]] and [[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]].
