---
title: Monitoring that runs inside the cluster and depends on cluster DNS goes blind in the outage it should report
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [pitfall, monitoring, alerting, dns, postmortem]
---

# Monitoring that runs inside the cluster and depends on cluster DNS goes blind in the outage it should report

## Observation

Zalando's postmortem lists monitoring that depended on DNS and ran inside the cluster as a contributing factor to the January 2019 outage, and one of its fixes was alerting from outside the cluster. The dossier's summary adds the broader recurring lesson across its sources: alert from outside the cluster. [[sources/research-pitfalls-and-case-studies]] URL: https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md

## Limits of the evidence

Only one first-party postmortem states this directly, and the dossier did not read other incident reports that might confirm it. The finding stays at draft until a second source supports the pattern. The loveholidays post gives a related but different lesson, which is to alert on HPA saturation and duplicate ReplicaSets, see [[examples/loveholidays-gke-upgrade-from-1-10-to-1-12-overran-its-window-by-about-five-hours]].

## Related

[[findings/a-retry-storm-amplified-by-ndots-and-small-coredns-memory-limits-can-take-down-cluster-dns]], [[concepts/pitfalls-and-case-studies]]
