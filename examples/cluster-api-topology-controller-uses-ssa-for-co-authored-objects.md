---
title: The Cluster API topology controller uses SSA for co-authored objects
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, server-side-apply, topology, co-authoring]
---

# The Cluster API topology controller uses SSA for co-authored objects

## Scenario

The ClusterClass topology controller in Cluster API generates objects such as control plane and infrastructure objects from a single Cluster definition. The controllers for those objects, and the infrastructure and control plane providers, also write to them. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## What happened

Pull request 6495, merged in June 2022, added a server-side apply helper to the topology controller. The stated motivation is to "leverage on the API server for handling controllers co-authoring the same object". The changed files include a structured-merge dry-run and patch helper under the topology controller. URL: https://github.com/kubernetes-sigs/cluster-api/pull/6495.

## Limits of the evidence

This is a thin source. The dossier read only the description and file list, so it did not verify which fields Cluster API owns and which belong to infrastructure providers. Do not infer field-level rules from this page. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Lesson

A platform controller that generates objects other controllers also edit is a natural fit for SSA, because the API server arbitrates ownership instead of the controller guessing. See [entities/cluster-api](../entities/cluster-api.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md), and [findings/multiple-writers-on-one-object](../findings/multiple-writers-on-one-object.md).

## Update from the m4 dossier

Update 2026-11-26: the limits named above are partly lifted. Source shows the controller applies under the manager `capi-topology` with force ownership, the book says server-side apply lets other controllers co-author the generated objects and advises against ad hoc edits, and the troubleshooting page documents infinite reconcile for slices co-authored by templates and an infrastructure controller (issue 6320). A per-field ownership table was searched for and not found, so field-level rules are still not established. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) See [findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items](../findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items.md).
