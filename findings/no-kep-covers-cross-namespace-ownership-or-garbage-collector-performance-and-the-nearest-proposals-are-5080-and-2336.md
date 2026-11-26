---
title: "No KEP covers cross-namespace ownership or garbage collector performance and the nearest proposals are 5080 and 2336"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [keps, garbage-collection, owner-references, cross-namespace, verification]
---

# No KEP covers cross-namespace ownership or garbage collector performance and the nearest proposals are 5080 and 2336

## Observation

A search of the kubernetes/enhancements master tree and its issue search found no KEP dedicated to cross-namespace ownership or to garbage collector throughput. That is a negative search result, not proof of absence. Issue search on kubernetes/kubernetes for garbage collector performance returned bug reports about wrong deletions and UID collisions, not performance work. Conference talks could not be searched. [[sources/research-gap-m2-ownership-gc]]

Two adjacent proposals exist. KEP-5080, ordered namespace deletion (sig-api-machinery, stable in v1.34, gate `OrderedNamespaceDeletion`), says namespace deletion uses `metav1.DeletePropagationBackground` and leaves owner-reference dependencies to the garbage collector. KEP-2336 proposes an optional `resource` field on owner references so a controller can skip "upwards of 20 discovery calls" mapping `kind` to a resource. It is stage alpha with milestone "0.0", last updated 2019-06-12, and no release evidence was read, so whether the field exists is unconfirmed. [[sources/research-gap-m2-ownership-gc]]

## Documented behavior that replaced a proposal

The cross-namespace rule came from issues, not a KEP. The owners-and-dependents page says cross-namespace owner references are disallowed by design, that a namespaced dependent with an invalid owner reference is treated as having an absent owner, and that a warning event `OwnerRefInvalidNamespace` is emitted. A cluster-scoped dependent with a namespaced owner kind is "not able to be garbage collected". See [[examples/kubernetes-issues-65200-and-94631-asked-for-defined-cross-namespace-owner-reference-behavior-and-both-are-closed]] and [[findings/cross-namespace-owner-references-are-treated-as-absent-and-the-dependent-can-be-collected]].

## The design archive is outdated on the orphan default

The archived garbage collection design (last commit 2017-11-03) says `DeleteOptions.OrphanDependents` "defaults to true, because controllers before release 1.2 expect dependent objects to be orphaned". That describes the old default and is outdated against current documentation, where background propagation is the default for most resources. The same file says "Controllers are responsible for adopting orphaned dependent resources." [[sources/research-gap-m2-ownership-gc]] See [[comparisons/background-foreground-and-orphan-propagation-modes]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[concepts/finalizers]]
