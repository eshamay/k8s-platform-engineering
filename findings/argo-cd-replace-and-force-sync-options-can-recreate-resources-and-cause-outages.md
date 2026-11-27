---
title: Argo CD Replace and Force sync options can recreate resources and cause outages
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [pitfall, argo-cd, sync-options, replace, force, outage]
---

# Argo CD Replace and Force sync options can recreate resources and cause outages

## Observation

Argo CD's sync options page warns that `Replace=true` and `Force=true` use `kubectl replace` or a delete and create, and that they can cause outages. It also warns that manually setting the tracking annotation on a shared Namespace can lead to unintended deletion, and it recommends confirmation for critical resources: "Resources such as Namespaces are critical and should not be pruned without confirmation." URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/. [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md)

## Why it matters

These options trade safety for the ability to apply changes that normal apply cannot, such as immutable fields. Crossplane takes the opposite position: it never deletes and recreates to change an immutable field, see [findings/crossplane-does-not-delete-and-recreate-to-change-immutable-fields](crossplane-does-not-delete-and-recreate-to-change-immutable-fields.md). The safer Argo CD settings are `Prune=confirm`, `Delete=confirm`, `PruneLast`, and `FailOnSharedResource`, see [findings/unintended-deletion-through-prune](unintended-deletion-through-prune.md).

## Evidence quality

This is a single documentation page and no incident of these options is cited, so the finding stays at draft.

## Related

[entities/argo-cd](../entities/argo-cd.md), [concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md)
