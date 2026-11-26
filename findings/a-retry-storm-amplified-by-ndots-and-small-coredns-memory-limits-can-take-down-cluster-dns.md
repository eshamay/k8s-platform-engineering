---
title: A retry storm amplified by ndots and small CoreDNS memory limits can take down cluster DNS
type: finding
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [pitfall, dns, coredns, ndots, retry-storm, blast-radius]
---

# A retry storm amplified by ndots and small CoreDNS memory limits can take down cluster DNS

## Observation

In Zalando's January 2019 outage, a timed-out downstream call made clients retry, and each retry multiplied DNS traffic. The Kubernetes default `ndots:5` produced about ten DNS queries for each external lookup, Node.js did not cache DNS, and connections were short-lived. CoreDNS pods limited to 100Mi of memory were OOM-killed together and could not recover. URL: https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md. [[sources/research-pitfalls-and-case-studies]]

## Why it matters

DNS is a shared dependency of every workload, so its limits and isolation are part of the platform surface. The postmortem's mitigations were far larger limits (2000Mi) and a node-local CoreDNS-plus-dnsmasq design, and the absence of a vertical autoscaler on CoreDNS was a listed contributing factor. The deeper rule is that one application should not be able to exhaust shared infrastructure.

## Evidence quality

This is a first-party postmortem from 2019, so the defaults and tooling it names may have changed. See [[examples/zalando-s-2019-coredns-outage-turned-a-retry-storm-into-a-total-dns-failure]].

## Related

[[findings/retry-storms-and-unbounded-retries]], [[findings/monitoring-that-runs-inside-the-cluster-and-depends-on-cluster-dns-goes-blind-in-the-outage-it-should-report]], [[concepts/pitfalls-and-case-studies]]
