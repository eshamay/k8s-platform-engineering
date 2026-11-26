---
title: "Crossplane foreground and pipeline deletion policies order composed resource teardown"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [crossplane, composition, deletion-ordering, foreground, usages]
---

# Crossplane foreground and pipeline deletion policies order composed resource teardown

## Scenario

A platform team composes a database and its network under one composite resource, and the database must be deleted before the network. With the default policy the whole tree is removed at once and the order is not honored. The Crossplane Compositions page and issue 6084 describe the options. [[sources/research-owner-references-and-garbage-collection]]

## How it works

Composed resources carry `ownerReferences` to their composite resource. The Compositions page (v2.4) describes three composite deletion policies. `Background`, the default, lets the garbage collector delete the children automatically. `Foreground` deletes the children before the composite is removed, and the page says Crossplane "keeps the parent composite resource until they're gone". `Pipeline` lets a function control the order by removing resources from desired state step by step, and the page adds that a composed resource no longer returned by the function is deleted.

Issue 6084, opened in November 2024 and closed as stale in April 2025, shows why the setting matters. A maintainer-level contributor explains that a standalone composite is treated like any other object, so without foreground deletion the garbage collector marks all children deleted at once and Usages cannot enforce order. Claims behave differently because the composite has no ownerReference pointing at the claim, and the claim controller deletes the composite using `compositeDeletePolicy` or `defaultCompositeDeletePolicy`. One user switched from XRs to Claims for exactly this reason and noted that the documentation did not say so. A proposal to switch propagation during deletion was doubted by maintainers and lapsed. The maintainer's advice, paraphrased by the dossier, was that the user must specify foreground deletion if ordering is required.

## Why the example matters

It shows a tool-level answer layered on the general mechanism. See [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]] and [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]]. The dossier did not cover Crossplane v2 namespaced composites or `managementPolicies`.

## Related

[[entities/crossplane]], [[concepts/composite-resource]], [[concepts/owner-references-and-garbage-collection]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]
