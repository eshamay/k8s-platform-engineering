---
title: Control plane overload blocks the remediation that would fix it
type: finding
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
aliases: []
tags: [pitfall, api-server, outage, priority-and-fairness, openai, jetstack]
---

# Control plane overload blocks the remediation that would fix it

> Correction, 2026-11-26: the earlier text described "many clients each made expensive API calls" on the strength of commentary. The primary post-mortem says every node in each cluster ran expensive API operations and does not say they were list or watch calls. The page is rewritten from the primary text. See [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md).

## Observation

OpenAI's primary post-mortem for 2024-12-11 says a new telemetry service made every node in each cluster run Kubernetes API operations whose cost scaled with cluster size, which overwhelmed the API servers in large clusters. The fix, removing the service, needed control-plane access: "we needed to access the Kubernetes control plane – which we could not do". Engineers were locked out of the system they needed to repair. A second dependency made it worse, because DNS relies on the control plane and expiring cached records carried the failure to running workloads. All figures are self-reported at https://status.openai.com/incidents/ctrsv3lwd797. [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md)

Jetstack's 2019 GKE outage has the same shape at a smaller scale. A validating webhook blocked the write that a master needed to pass its health check, and the repair was possible only because the API server answered intermittently, so the webhook configuration could be deleted. See [findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade](an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade.md).

## Interpretation

OpenAI parallelized three mitigations: scaling down cluster size, blocking network access to the admin APIs so new expensive requests stopped, and scaling up the API servers. Its prevention list names break-glass access that works "in any circumstances", phased rollouts with cluster-health monitoring, fault injection, and decoupling the data plane from the control plane. API Priority and Fairness is a commentator's suggestion, not an OpenAI commitment, and it is wiki-side inference that it would have preserved administrator access. See [examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane](../examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane.md), [examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook](../examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook.md), [findings/dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load](dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load.md), [findings/remediation-can-amplify-an-outage](remediation-can-amplify-an-outage.md), and [findings/etcd-scale-limits-of-the-shared-store](etcd-scale-limits-of-the-shared-store.md).

## Related

[concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md)
