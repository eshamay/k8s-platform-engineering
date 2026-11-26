---
title: "Background deletion gives no teardown ordering between dependents"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, deletion-ordering, background-deletion, crossplane]
---

# Background deletion gives no teardown ordering between dependents

## Observation

In the default background mode the garbage collector may delete a whole owner tree at once. Child-before-parent or sibling-before-sibling dependencies, such as a database before its network, are not honored unless foreground deletion is requested. Crossplane issue 6084 shows the effect: a maintainer-level contributor explains that without foreground deletion the collector marks all children deleted at once, so Usages cannot enforce order. Claims appear to order deletion only because the claim controller deletes the composite using `compositeDeletePolicy`. [[sources/research-owner-references-and-garbage-collection]]

## Consequence

A platform team that relies on a standalone composite resource gets parallel deletion and may see failures or leaked resources in the cloud, since the external APIs enforce their own order. Foreground deletion helps only for dependents that set `blockOwnerDeletion=true`. Crossplane's `Pipeline` policy is a tool-level answer. See [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]], [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]], and [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]
