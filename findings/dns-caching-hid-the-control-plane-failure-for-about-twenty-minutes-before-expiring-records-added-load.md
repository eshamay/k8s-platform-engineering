---
title: DNS caching hid the control-plane failure for about twenty minutes before expiring records added load
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
aliases: []
tags: [pitfall, dns, control-plane, openai, delayed-visibility]
---

# DNS caching hid the control-plane failure for about twenty minutes before expiring records added load

## Observation

OpenAI's post-mortem for 2024-12-11 says its data plane can run mostly independently of the control plane, but "DNS relies on the control plane – services don't know how to contact one another". Cached DNS records masked the failure while the telemetry rollout continued, and then "as cached records expired over the following 20 minutes, services began failing." The expiring caches also multiplied DNS load on the already overloaded control plane. The figures are self-reported at https://status.openai.com/incidents/ctrsv3lwd797. [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md)

## Why it matters

A delayed-visibility mechanism let the damage spread before anyone understood it. OpenAI lists decoupling the data plane from the control plane and faster recovery with caching and dynamic rate limiters among its prevention commitments, and the wiki did not check whether they shipped. The same delay appears in Jetstack's case, where a staged master upgrade let the problem develop. See [examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane](../examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane.md), [findings/control-plane-overload-blocks-the-remediation-that-would-fix-it](control-plane-overload-blocks-the-remediation-that-would-fix-it.md), and [examples/zalando-s-2019-coredns-outage-turned-a-retry-storm-into-a-total-dns-failure](../examples/zalando-s-2019-coredns-outage-turned-a-retry-storm-into-a-total-dns-failure.md).
