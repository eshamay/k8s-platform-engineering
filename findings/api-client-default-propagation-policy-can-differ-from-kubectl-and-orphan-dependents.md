---
title: "An API client's default propagation policy can differ from kubectl and orphan dependents"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, propagation-policy, client-libraries, race-condition, jobs]
---

# An API client's default propagation policy can differ from kubectl and orphan dependents

## Observation

An Israeli Tech Radar engineering post describes a team that deleted Jobs through the JavaScript Kubernetes client without a propagation policy. That client's default was orphan, while kubectl and the API default to background for most resources. The garbage collector stripped owner references from the Pods before the application's own suspend-and-delete step ran, which left orphaned pending Pods that held volume claims. The fix was an explicit `Foreground` propagation policy. The post attributes the race to the fact that the collector got to the Pods first. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md)

## Consequence

Behavior learned at the command line does not transfer to code. The dossier's advice is to always pass an explicit propagation policy from code. The failure is silent: nothing errors, and leaked Pods hold on to storage until someone notices. This is a single secondary account, and the client default was not checked against the client's source. See [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md) and [comparisons/background-foreground-and-orphan-propagation-modes](../comparisons/background-foreground-and-orphan-propagation-modes.md).

## Related

[findings/orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them](orphaned-dependents-keep-running-with-empty-owner-references-until-someone-deletes-them.md), [examples/kubectl-cascade-modes-compared-in-a-hands-on-lab](../examples/kubectl-cascade-modes-compared-in-a-hands-on-lab.md)
