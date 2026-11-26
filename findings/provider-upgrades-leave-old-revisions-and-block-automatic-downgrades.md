---
title: "Provider upgrades leave old revisions and block automatic downgrades"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [crossplane, provider, upgrade, providerrevision, dependencies]
---

# Provider upgrades leave old revisions and block automatic downgrades

## Observation

Each upgrade of a Crossplane provider creates a `ProviderRevision`. Old revisions keep deprecated CRDs around, and by default one inactive revision is retained, a limit set by `revisionHistoryLimit`. Revision activation can be automatic or manual, and automatic dependency downgrades are off by default because of the risk of orphaning resources. A provider whose dependencies are not met shows `HEALTHY` as `False`. [[sources/research-provider]]

## Why it matters

Keeping an old revision lets an operator roll back, and it keeps CRDs that existing objects depend on from disappearing underneath them. The cost is extra CRDs on the API server, which connects to [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]]. Refusing automatic downgrades is a deliberate safety choice, because moving a provider back to a version without a CRD that existing resources use could strand those resources, the same class of problem as [[findings/crd-version-removal-without-migration-strands-stored-objects]].

## What to do

Use manual revision activation where upgrades must be reviewed, check `HEALTHY` after each upgrade, and tune `revisionHistoryLimit` to balance rollback ability against CRD count. ACK handles the equivalent concern through alpha to GA maturity phases and a deprecation policy, see [[entities/ack]]. See also [[concepts/provider]].
