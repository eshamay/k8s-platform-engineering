---
title: "The garbage collector builds a dependency graph from watch events and sorts references into three classes"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [garbage-collection, graph-builder, internals, controllers]
---

# The garbage collector builds a dependency graph from watch events and sorts references into three classes

## Scenario

A platform engineer wants to know why a dependent was deleted, or why an owner is still waiting, and needs the mechanics behind the observed behavior. Two sources explain the internals. The SoByte post is a source-code walkthrough from 2022, and the Kubernetes design proposal in the archive gives the original rationale. The dossier warns that the proposal's foreground and background labels differ from the later implementation, so the proposal is good for architecture and history only. [[sources/research-owner-references-and-garbage-collection]]

## How it works

A GraphBuilder watches all resources through monitors and maintains a dependency graph whose nodes hold their dependents. It feeds three queues: graph changes, `attemptToDelete`, and `attemptToOrphan`. An absent-owner cache remembers the UIDs of owners already confirmed gone, which avoids repeated lookups. Each owner reference on a candidate object is classified as dangling (the owner is absent), waiting for dependent deletion (the owner is in foreground deletion), or solid (the owner exists). Dangling references are patched out. Deletion then follows the background, foreground, or orphan logic, and the walkthrough also covers circular `blockOwnerDeletion` cases. The original design describes the same pieces as a scanner that fills a dirty queue, a garbage processor that checks owners and deletes, and a propagator that keeps the graph. Orphaning is a finalizer that removes owner references from dependents before the owner disappears.

## Why the example matters

The graph is built from watch events, so the collector is a level-based controller like any other and shares the cache-lag concerns described in [[concepts/informers-reflectors-and-workqueues]]. One related open issue, a down conversion webhook stalling garbage collection, is described in [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[concepts/reconciliation-loop]]
