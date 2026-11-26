---
title: Control plane overload blocks the remediation that would fix it
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, api-server, outage, priority-and-fairness]
---

# Control plane overload blocks the remediation that would fix it

## Observation

In the public OpenAI outage discussed in the dossier, many clients each made expensive API calls, the API servers were overloaded, and the overload prevented operators from using the API to roll the change back. A second dependency made it worse: DNS-based discovery needed the control plane, so the failure reached running workloads. [[sources/research-informers-reflectors-and-workqueues]]

## Interpretation

Shared informers cut the number of independent list-and-watch streams per process, but the number of processes still multiplies load. The commentary's mitigations are staged rollouts, testing at large cluster size, API Priority and Fairness so administrators keep access, and right-sized control planes. The evidence is commentary on a postmortem that was not read directly, and the cause was not informers. See [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]], [[findings/remediation-can-amplify-an-outage]], and [[findings/etcd-scale-limits-of-the-shared-store]].

## Related

[[concepts/informers-reflectors-and-workqueues]]
