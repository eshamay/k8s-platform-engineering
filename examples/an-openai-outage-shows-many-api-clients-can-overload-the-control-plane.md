---
title: An OpenAI outage shows many API clients can overload the control plane
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
aliases: [OpenAI December 2024 outage]
tags: [outage, api-server, postmortem, scale, openai]
---

# An OpenAI outage shows many API clients can overload the control plane

> Correction, 2026-11-26: this page first rested on Ahmet Alp Balkan's commentary. The primary post-mortem has now been read, and it does not say the calls were list or watch calls, so the earlier "many clients that list and watch independently" framing is withdrawn. See [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md).

## Scenario

On 2024-12-11, OpenAI deployed a new telemetry service to collect detailed Kubernetes control plane metrics. The primary post-mortem on its status page (https://status.openai.com/incidents/ctrsv3lwd797) says the service's configuration "caused every node in each cluster to execute resource-intensive Kubernetes API operations whose cost scaled with the size of the cluster." OpenAI operates hundreds of clusters. All figures here are self-reported. Commentary at https://ahmet.im/blog/openai-kubernetes-incident/ was the earlier secondary account. [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md)

## What happened

The change was merged at 2:23pm PST and applied to all clusters between 2:51pm and 3:20pm. The telemetry service was deployed at 3:12pm, alerts fired at 3:13pm, and "Between 3:16 PM PST and 7:38 PM PST on December 11, 2024, all OpenAI services experienced significant degradation." Maximum customer impact was at 3:40pm, the first cluster recovered at 4:36pm, and all clusters recovered at 7:38pm.

The API servers were overwhelmed in most large clusters. The data plane can run mostly independently, but DNS relies on the control plane. Cached records hid the failure for about 20 minutes while the rollout continued, and then expiring caches multiplied the load, see [findings/dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load](../findings/dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load.md). Remediation was slow because removing the telemetry service required control-plane access that the load had removed: "we needed to access the Kubernetes control plane – which we could not do." Teams ran three mitigations in parallel: scaling down cluster size, blocking network access to the Kubernetes admin APIs to stop new expensive requests, and scaling up the API servers.

Staging did not catch it, because the impact was specific to larger clusters and the pre-rollout checks covered CPU and memory and not API server load, see [findings/a-staging-test-passed-because-the-failure-scaled-with-cluster-size-and-resource-checks-ignored-api-server-load](../findings/a-staging-test-passed-because-the-failure-scaled-with-cluster-size-and-resource-checks-ignored-api-server-load.md). OpenAI's stated prevention commitments are phased rollouts with cluster-health monitoring, fault injection, break-glass access to the API servers, decoupling the data plane from the control plane, and faster recovery with caching and dynamic rate limiters. The wiki did not check whether these shipped. The status page also shows the incident running from Dec 11, 2024, 06:42 PM to Dec 12 01:23 AM in a timezone it does not state.

## Why it belongs here

The primary text names a controller or agent storm against the API server and is the closest primary evidence the wiki has for the control-plane-as-platform outage class. It does not say the calls were list or watch calls, and it does not say the service was a DaemonSet, so any claim to that effect is inference. The commentary's suggestion that API Priority and Fairness would keep administrators connected is the commentator's lesson and not an OpenAI commitment. The relevance to informers is indirect, because one cache-backed watch per process is cheap while the same work repeated on every node of a large cluster is not, and that point is this wiki's interpretation. See [findings/control-plane-overload-blocks-the-remediation-that-would-fix-it](../findings/control-plane-overload-blocks-the-remediation-that-would-fix-it.md), [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md), [examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query](neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query.md), and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).
