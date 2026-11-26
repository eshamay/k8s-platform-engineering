---
title: Flux issue 2514 the first reconciliation over an HPA-managed Deployment reset replicas to one
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Flux issue 2514]
tags: [flux, hpa, replicas, ssa, field-ownership, drift]
---

# Flux issue 2514 the first reconciliation over an HPA-managed Deployment reset replicas to one

## Scenario

Between 2022-03-08 and 2022-03-10 an anonymous reporter put an existing HPA-managed Deployment under Flux. [[sources/research-gap-g1-gitops-drift-incidents]] URL: https://github.com/fluxcd/flux2/issues/2514

## What happened

On the first reconciliation the replica count dropped. The reporter wrote "my pods replicas went down to 1, and then back to the previous number of replicas". A maintainer's first reply said a `replicas` field in Git conflicts with an HPA, since "every time Flux does a reconciliation overrides it". The reporter reproduced the drop without a `replicas` field in Git and attributed it to the handoff of field ownership. The count recovered, so this is a transient scale-down and not an outage report, and no organization is named.

## Why it belongs here

It separates two causes that look alike: a `replicas` value in Git that fights the HPA forever, and a one-time ownership handoff that resets the count once. The first is the revert loop in [[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]]. See [[findings/handing-replicas-between-git-and-an-hpa-can-reset-the-count-or-leave-an-application-permanently-out-of-sync]].

## Related

[[entities/flux]], [[examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict]], [[findings/controllers-fighting-over-fields-cause-revert-loops]]
