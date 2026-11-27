---
title: An HPA and Git both set replicas and surface an SSA conflict
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [server-side-apply, hpa, gitops, conflict]
---

# An HPA and Git both set replicas and surface an SSA conflict

## Scenario

A repository says a Deployment should have 3 replicas, and a horizontal pod autoscaler has since set `replicas` to 10 to absorb load. A CD system now applies the repository's manifest. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## What happened

The Kubernetes maintainer blog uses this as the canonical case for why a CD system must see conflicts. Under server-side apply the autoscaler owns `replicas`, so the CD system's apply conflicts instead of silently resetting the field to 3. URL: https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/. The post describes the human responses to such a conflict: reject the change by force-applying, accept it, or accept it and then reject it later.

## How tools handle it

The post notes a possible future in which tools parse `managedFields` to decide which conflicts to ignore. Today, Argo CD practitioner guidance keeps `ignoreDifferences` for fields a controller rewrites on purpose, with `replicas` under an autoscaler as the example. URL: https://blog.danielepetrollo.com/en/argocd-outofsync-server-side-diff.

## Lesson

The example shows why a blanket force is dangerous when a second controller legitimately owns a field. See [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md), [findings/controllers-fighting-over-fields-cause-revert-loops](../findings/controllers-fighting-over-fields-cause-revert-loops.md), and [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).
