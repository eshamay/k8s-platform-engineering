---
title: Neon's May 2025 delayed-start incidents exhausted subnet IPs after a slow control-plane database query
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
aliases: [Neon delayed start postmortem]
tags: [postmortem, neon, aws-cni, ip-exhaustion, control-plane, 2025]
---

# Neon's May 2025 delayed-start incidents exhausted subnet IPs after a slow control-plane database query

## Scenario

Neon runs database compute pods on Kubernetes in AWS us-east-1. On 2025-05-16 and 2025-05-19 it had two incidents in which customers could not create or start inactive databases, for a total of 5.5 hours. Neon published the postmortem on 2025-05-21 at https://neon.com/blog/postmortem-delayed-start-compute-operations, and the figures are self-reported. The cause was in Neon's own control plane, which is a platform layered on Kubernetes, and not in the Kubernetes control plane. [sources/research-gap-g1-outage-postmortems](../sources/research-gap-g1-outage-postmortems.md)

## What happened

A changed execution plan on an expensive control-plane database query made it 10x to 100x slower ("increasing query execution times by 1-2 orders of magnitude"). Because of the slow queries, idle compute pods were not suspended, so the pod count rose to about 8000 against 6000 planned capacity, and the pods exhausted IP addresses in 2 of 3 subnets.

For mitigation, Neon set the AWS CNI `WARM_IP_TARGET` to 1, which released some IPs and left a ceiling of about 10k pods, and then set both `WARM_IP_TARGET` and `WARM_ENI_TARGET` to 0. It upscaled the control-plane database and enabled, then disabled, proxy rate limiting. The postmortem says "restoring WARM_IP_TARGET to '1' triggered a new outage" on May 19, so reverting an emergency setting caused a regression. Neon plans to replace this architecture with a project it calls Cells, and a follow-up post on the triggering event was not read.

## Why it belongs here

This is a 2025 incident with a primary write-up, so it is the recent platform evidence the wiki lacked. It differs from the OpenAI case in [examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane](an-openai-outage-shows-many-api-clients-can-overload-the-control-plane.md) because the failing layer is a platform control plane whose backing database slowed down, and the Kubernetes API was not the bottleneck. See [findings/a-slow-control-plane-database-stopped-pod-suspension-and-exhausted-subnet-ips-and-a-cni-setting-change-caused-a-second-outage](../findings/a-slow-control-plane-database-stopped-pod-suspension-and-exhausted-subnet-ips-and-a-cni-setting-change-caused-a-second-outage.md) and [concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md).
