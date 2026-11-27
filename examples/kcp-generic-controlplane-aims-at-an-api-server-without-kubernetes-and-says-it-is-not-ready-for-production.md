---
title: kcp generic-controlplane aims at an API server without Kubernetes and says it is not ready for production
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: [generic-controlplane]
tags: [kcp, generic-controlplane, api-server, distributions, cncf]
---

# kcp generic-controlplane aims at an API server without Kubernetes and says it is not ready for production

## Scenario

The kcp-dev/generic-controlplane repository (40 stars when read on 2026-11-26) describes a control plane that "can be used **without Kubernetes**", with API groups as opt-in "batteries" and a long-run plan to make the default server resource-free. Its README says it "is not yet ready for production use". [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md) URL: https://github.com/kcp-dev/generic-controlplane.

## Context

The parent project kcp is a CNCF Sandbox project accepted on 2023-09-19. Its homepage says "kcp intentionally only knows generic APIs, no pods or related resources" and "does not replace Kubernetes", and states ambitions of 1 million workspaces and 10,000 shards, which are goals and not measurements. The latest kcp release read was v0.33.6 (2026-11-04).

## Why it matters

It is the closest CNCF-adjacent project to the idea of an API server without the container scheduler, which is part of the Kubernetes-as-a-kernel argument, but it is early-stage and does not use the distribution framing. See [entities/kcp](../entities/kcp.md), [examples/multi-tenant-api-hosting-with-kcp](multi-tenant-api-hosting-with-kcp.md), and [findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post](../findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post.md).
