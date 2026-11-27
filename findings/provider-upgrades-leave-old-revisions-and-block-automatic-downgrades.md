---
title: "Provider upgrades leave old revisions and block automatic downgrades"
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [crossplane, provider, upgrade, providerrevision, dependencies]
---

# Provider upgrades leave old revisions and block automatic downgrades

## Observation

Each upgrade of a Crossplane provider creates a `ProviderRevision`. Old revisions keep deprecated CRDs around, and by default one inactive revision is retained, a limit set by `revisionHistoryLimit`. Revision activation can be automatic or manual, and automatic dependency downgrades are off by default because of the risk of orphaning resources. A provider whose dependencies are not met shows `HEALTHY` as `False`. [sources/research-provider](../sources/research-provider.md)

## Why it matters

Keeping an old revision lets an operator roll back, and it keeps CRDs that existing objects depend on from disappearing underneath them. The cost is extra CRDs on the API server, which connects to [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md). Refusing automatic downgrades is a deliberate safety choice, because moving a provider back to a version without a CRD that existing resources use could strand those resources, the same class of problem as [findings/crd-version-removal-without-migration-strands-stored-objects](crd-version-removal-without-migration-strands-stored-objects.md).

## What to do

Use manual revision activation where upgrades must be reviewed, check `HEALTHY` after each upgrade, and tune `revisionHistoryLimit` to balance rollback ability against CRD count. ACK handles the equivalent concern through alpha to GA maturity phases and a deprecation policy, see [entities/ack](../entities/ack.md). See also [concepts/provider](../concepts/provider.md).

## Update from the o8 dossier

Update 2026-11-26: the docs master Providers and Configurations pages confirm each claim above. Only one revision is Active, `Automatic` is the default activation policy, one Inactive revision is kept by default, and `0` disables storing. Automatic downgrade needs both alpha flags and is off by default, see [findings/crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags](crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags.md). The Function package case was not confirmed, see [findings/crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions](crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions.md). The resolver behavior is in [findings/the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency](the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency.md). Promoted from draft to active. [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)
