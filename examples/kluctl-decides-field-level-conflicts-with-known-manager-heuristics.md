---
title: Kluctl decides field-level conflicts with known-manager heuristics
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [kluctl, server-side-apply, conflict, deployment-tool]
---

# Kluctl decides field-level conflicts with known-manager heuristics

## Scenario

Kluctl is a deployment tool that originally shelled out to `kubectl` and used client-side apply. That approach hit the annotation size limit on large CRDs, notably Prometheus operator CRDs, and gave no per-field control. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## What happened

The author moved Kluctl to call server-side apply directly. Because `kubectl --server-side` can only error on conflicts or force everything, Kluctl implements its own decision per field. It treats changes made by known interactive managers such as `kubectl` and k9s as temporary and overwrites them. It leaves alone fields it lost to other managers unless the user says otherwise. URL: https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/. The author is the tool's maintainer, so this is a vendor-written account hosted on the Kubernetes blog.

## Controls it exposes

The user can pass `--force-apply`, annotate a resource with `kluctl.io/force-apply`, or annotate with `kluctl.io/force-apply-field` and a JSON path for a single field. The per-field form exists because the ECK operator claims fields under `nodeSets` that it should not. An administrator can run `kubectl --field-manager=admin-override` to make a change that Kluctl will respect, since that manager name is not on its known-interactive list.

## Lesson

The quote that sums it up is "Kluctl will not overwrite any fields that it lost ownership of, unless you explicitly tell it to do so." It is a worked example of a third conflict policy between force-everything and fail-everything. See [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md), [entities/kluctl](../entities/kluctl.md), and [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md).
