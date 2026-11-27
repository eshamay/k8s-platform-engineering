---
title: A slow control-plane database stopped pod suspension and exhausted subnet IPs, and a CNI setting change caused a second outage
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
aliases: []
tags: [pitfall, aws-cni, ip-exhaustion, control-plane, neon, rollback]
---

# A slow control-plane database stopped pod suspension and exhausted subnet IPs, and a CNI setting change caused a second outage

## Observation

Neon's postmortem of 2025-05-21 reports a chain of three failures. A changed query plan slowed an expensive control-plane database query by 10x to 100x. The slowdown stopped idle compute pods from being suspended, so pods rose to about 8000 against 6000 planned capacity. That exhausted the IPs in 2 of 3 subnets. Mitigation set `WARM_IP_TARGET` to 1 (about a 10k pod ceiling) and then both `WARM_IP_TARGET` and `WARM_ENI_TARGET` to 0. On May 19, "restoring WARM_IP_TARGET to '1' triggered a new outage." The figures are self-reported at https://neon.com/blog/postmortem-delayed-start-compute-operations. [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md)

## Why it matters

Pod count on a Kubernetes platform is bounded by network address supply as well as by compute, and a platform-level control loop that stops shrinking the fleet can run into that bound. The incident also shows that emergency settings need a tested way back. The failing layer was Neon's own control plane and not the Kubernetes API. See [examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query](../examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query.md) and [concepts/scale-and-sharding](../concepts/scale-and-sharding.md).
