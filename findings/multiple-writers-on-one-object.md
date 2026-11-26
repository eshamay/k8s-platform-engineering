---
title: Multiple writers on one object
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [pitfall, server-side-apply, ownership]
---

# Multiple writers on one object

## Observation

When humans, a GitOps tool, an autoscaler, and other controllers all write to the same object, client-side apply can silently clobber another writer's changes, because it only knows the `last-applied-configuration` annotation. Server-side apply tracks which manager owns each field and raises a conflict when another manager owns a differing field, with an explicit force override. [[sources/research-declarative-vs-imperative]]

## Interpretation

Declarative configuration is meant to support multiple writers, but only if ownership is explicit. The server-side apply documentation says "fields that have a different value and are owned by another manager will result in a conflict." Flux relies on a server-side apply dry run for its drift detection, so its behavior depends on the same ownership model. See [[concepts/server-side-apply-and-field-ownership]] and [[entities/flux]].

## Mitigations

Use server-side apply, resolve a conflict by coordinating, giving up the field, or forcing deliberately, and avoid forcing as a habit.

## Caveat

Flux field-manager details were not read in the dossier, so the exact conflict behavior of GitOps tools is unverified. See [[open-knowledge-gaps]].

## Related

[[findings/mixing-management-techniques-on-one-object]], [[concepts/declarative-vs-imperative]]
