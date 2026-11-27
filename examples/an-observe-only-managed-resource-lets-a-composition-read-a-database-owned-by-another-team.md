---
title: An observe-only managed resource lets a composition read a database owned by another team
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, observe, management-policies, reference, brownfield]
---

# An observe-only managed resource lets a composition read a database owned by another team

## Scenario

A platform composition needs facts about a database, such as its endpoint, but another team or another tool owns that database and must stay its only writer. The observe-only design document names exactly this motivation: referencing and monitoring existing cloud resources owned by other tools, which earlier required workarounds such as provider-terraform or provider-kubernetes. [sources/research-managed-resource](../sources/research-managed-resource.md)

## How it works

The composition creates a [concepts/managed-resource](../concepts/managed-resource.md) with `managementPolicies: ["Observe"]` and keeps it that way permanently. The provider reads the real resource and publishes it in `status.atProvider`, and the composition can consume those values. The design document's own wording is that "Crossplane will only observe the external resource and will not make any changes or deletions." The authors considered and rejected a separate data-source-style type, because it would double the number of CRDs, which is already a scale concern. URL: https://github.com/crossplane/crossplane/blob/main/design/design-doc-observe-only-resources.md.

## Lesson

Observe is both an import step and a permanent mode. The permanent use is the read-only reference case, and it is the reason the design generalized from a three-value enum (FullControl, OrphanOnDelete, ObserveOnly) to a list of verbs. The costs are that required-field validation must be relaxed for observed objects and that late initialization is disabled. See [findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation](../findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation.md), [decisions/choose-management-policies-for-an-imported-resource](../decisions/choose-management-policies-for-an-imported-resource.md), and [examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources](crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources.md).
