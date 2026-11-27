---
title: SAP reports more than 100 Crossplane-based control planes and thousands of managed resources as of February 2024
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [SAP Crossplane adopter entry]
tags: [crossplane, adopters, sap, self-reported, scale]
---

# SAP reports more than 100 Crossplane-based control planes and thousands of managed resources as of February 2024

## Scenario

SAP lists itself in the Crossplane project's ADOPTERS file. The entry is the most specific statement of control-plane count in that file. [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md)

## What the entry says

The entry reads "currently 100+ KRM based control planes with Crossplane and other technologies and 1000s of Managed Resources", and it is dated "As of February 2024". It is a self-report through the contact handles in the file and has not been audited. URL: https://raw.githubusercontent.com/crossplane/crossplane/main/ADOPTERS.md, main branch, file last committed 2026-10-27.

## How to read it

The figure counts control planes, so it is a fleet-shape statement and not the size of one cluster. The phrase "and other technologies" means the control planes are not all Crossplane alone. The date is nearly three years old at the time of the dossier, so it says nothing about current scale.

## Related

[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand](crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand.md), [entities/crossplane](../entities/crossplane.md), [concepts/managed-resource](../concepts/managed-resource.md)
