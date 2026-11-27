---
title: "Crossplane issue 5283 has left deletionPolicy deprecation open since 2024"
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [crossplane, deletion-policy, management-policies, issue, lifecycle]
---

# Crossplane issue 5283 has left deletionPolicy deprecation open since 2024

## Scenario

Crossplane managed resources historically carried `deletionPolicy` (Delete or Orphan) beside the newer `managementPolicies` list. Issue 5283, "Deprecate DeletionPolicy", was opened on 2024-01-25 to settle which field is canonical. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) https://github.com/crossplane/crossplane/issues/5283

## State as of 2026-11-26

The issue is still OPEN with state reason REOPENED. Its last activity was 2024-08-14, when the stale bot was followed by a maintainer `/fresh`. Labels are `exempt-from-stale`, `feature-lifecycle`, and `release/breaking-api-change`. A contributor wrote "We never actually deprecated it, just added a note that we plan to deprecate", and a maintainer agreed that officially deprecating it is a first step toward GA of management policies.

## What changed around it

Crossplane v2.0.0 (2025-08-14) removed `deletionPolicy` from the new namespaced managed resources ("Namespaced managed resources, that are net new in v2, no longer have the `deletionPolicy` field") and left existing cluster-scoped ones unchanged. In crossplane-runtime `main`, `LegacyManagementPoliciesResolver` is marked Deprecated and serves types that had a deletion policy, while `ManagementPoliciesResolver` serves modern ones. The v2.5 managed resources page never mentions `deletionPolicy`. So the field is absent from the docs and from namespaced MRs, but it was never formally deprecated on legacy MRs.

## Lesson

A feature can disappear from the docs and from new API types years before any formal deprecation. Teach `managementPolicies` for new work and treat `deletionPolicy` as a legacy field that still works on cluster-scoped MRs. See [findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies](../findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies.md), [decisions/choose-management-policies-for-an-imported-resource](../decisions/choose-management-policies-for-an-imported-resource.md), [concepts/managed-resource](../concepts/managed-resource.md), and [entities/crossplane](../entities/crossplane.md).
