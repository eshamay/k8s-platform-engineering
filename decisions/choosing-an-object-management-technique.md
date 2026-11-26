---
title: Choosing an object-management technique
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [decision, kubectl, gitops]
---

# Choosing an object-management technique

## Context

A team must decide how objects in a cluster will be created and changed: by imperative commands, by imperative object configuration, or by declarative configuration. The official documentation frames these as a spectrum with different learning curves, audit properties, and multi-writer tolerance. [[sources/research-declarative-vs-imperative]]

## Options

1. Imperative commands. Lowest learning curve, no review or audit trail, suited to development.
2. Imperative object configuration (`kubectl replace -f`). Files with explicit verbs, suited to a single writer in production.
3. Declarative object configuration (`kubectl apply`, or a GitOps tool). Suited to multiple writers and to review, but harder to debug because of merge and patch logic.

## Decision drivers

Whether more than one actor writes to an object, whether changes need review and an audit trail, and whether the team can tolerate the debugging cost of merge logic. See [[comparisons/kubectl-object-management-techniques]].

## Consequences

Choosing declarative configuration with a GitOps tool gives a reviewable history and drift correction, at the cost of exposure to [[findings/unintended-deletion-through-prune]] and [[findings/defaulting-and-drift-reconcile-loops]]. Whatever the choice, one technique should own each object ([[findings/mixing-management-techniques-on-one-object]]), and escape hatches such as suspend should be planned for incidents.

## Status

Draft. The dossier presents the official guidance and does not describe an organization's actual decision. See [[concepts/declarative-vs-imperative]].
