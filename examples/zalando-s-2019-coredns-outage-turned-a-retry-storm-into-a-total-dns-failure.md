---
title: Zalando's 2019 CoreDNS outage turned a retry storm into a total DNS failure
type: example
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: [Zalando January 2019 DNS outage]
tags: [postmortem, dns, coredns, retry-storm, zalando, blast-radius]
---

# Zalando's 2019 CoreDNS outage turned a retry storm into a total DNS failure

## Scenario

Zalando ran Kubernetes on AWS from 2016 and published its postmortems in the kubernetes-on-aws repository. On 2019-01-07 its product pages returned errors for over an hour. [[sources/research-pitfalls-and-case-studies]]

## What happened

A downstream call timed out, and clients retried, which spiked DNS queries. The CoreDNS pods had a 100Mi memory limit, so they were OOM-killed together and could not recover under the load. Several settings multiplied the problem. The `ndots:5` default meant about ten DNS queries for each external lookup, Node.js did not cache DNS, connections were short-lived, CoreDNS had no vertical autoscaler, and the monitoring depended on DNS and ran inside the cluster. URL: https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md

## Fixes

Zalando raised the memory limits to 2000Mi, adopted a node-local design using CoreDNS with dnsmasq, moved alerting outside the cluster, and made escalation easier.

## Lesson

The postmortem states the principle directly: "It should not be possible for a single application to 'DoS' our DNS infrastructure". The incident is a blast-radius cascade in which a shared platform service lacked isolation, limits, and independent monitoring. See [[findings/a-retry-storm-amplified-by-ndots-and-small-coredns-memory-limits-can-take-down-cluster-dns]], [[findings/monitoring-that-runs-inside-the-cluster-and-depends-on-cluster-dns-goes-blind-in-the-outage-it-should-report]], and [[findings/retry-storms-and-unbounded-retries]]. The author's wider framing is at https://srcco.de/posts/kubernetes-failure-stories.html.

## Related

[[concepts/pitfalls-and-case-studies]]
