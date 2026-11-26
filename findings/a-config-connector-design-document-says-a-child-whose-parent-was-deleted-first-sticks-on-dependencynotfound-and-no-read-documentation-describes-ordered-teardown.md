---
title: "A Config Connector design document says a child whose parent was deleted first sticks on DependencyNotFound, and no read documentation describes ordered teardown"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [config-connector, deletion, ordering, finalizer, dependencynotfound, design-doc]
---

# A Config Connector design document says a child whose parent was deleted first sticks on DependencyNotFound, and no read documentation describes ordered teardown

## Observation

The Config Connector repository holds a design document, `docs/designs/graceful-orphan-deletion.md` (last commit 2026-02-09), that describes the mechanism behind the practitioner report of children left in `DeleteFailed`. When a parent is deleted before its child, the child's reference cannot be resolved, the reconcile reports `DependencyNotFound`, and finalization never completes. The document's own example is a `GKEHubFeatureMembership`: "The finalizer on the `GKEHubFeatureMembership` is never removed." [[sources/research-gap-o4-config-connector-ack]]

The document is a proposal. The dossier did not determine whether or when it shipped, and release notes for 1.161 and 1.162 showed no matching entry, with earlier releases unchecked.

No Config Connector documentation page or source file read describes a dependency-ordered teardown. The issue tracker has open reports instead: issue 534 ([[examples/config-connector-issue-534-deleting-a-bigquerydataset-before-its-tables-left-both-in-failure-and-the-issue-has-been-open-since-2021]]) and issue 2894 ([[examples/config-connector-issue-2894-a-reporter-says-kcc-lacks-terraform-s-dependency-graph-and-owner-reference-cleanup-left-ghost-tag-bindings]]). Issue 15930 reports the same shape for Direct-controller resources, see [[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]].

## What this does and does not settle

It supports the mechanism half of [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]]: a child can be blocked indefinitely when its parent goes first. It does not settle the Argo CD half. Argo CD's sync-waves page says "During pruning, the wave order is reversed from the creation order. Resources in higher waves are pruned first", but the application-deletion page, read only through its first 90 lines, does not say whether cascade deletion honors waves. Neither the practitioner report nor the Argo CD documentation is contradicted, and whether Argo CD deletes children unordered stays open.

## Related

[[entities/config-connector]], [[entities/argo-cd]], [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]], [[concepts/finalizers]]
