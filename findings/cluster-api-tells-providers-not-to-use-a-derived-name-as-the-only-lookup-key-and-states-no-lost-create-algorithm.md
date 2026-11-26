---
title: "Cluster API tells providers not to use a derived name as the only lookup key and states no lost-create algorithm"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [Cluster API provider idempotency guidance]
tags: [cluster-api, idempotency, providers, tags, providerid]
---

# Cluster API tells providers not to use a derived name as the only lookup key and states no lost-create algorithm

## Observation

The Cluster API provider best-practices page (Cluster API v1.14.4, read on 2026-11-26) says "Do not use a derived infrastructure name as the sole lookup key" and requires that "More robust mechanisms MUST always be provided and used, such as provider-owned tags or labels". Where a name must be shortened to fit a cloud limit, the page asks for "a deterministic transformation that preserves a readable prefix where useful and incorporates a hash". [[sources/research-gap-m7-operators-idempotency]]

The InfraMachine contract says "Node's Provider id MUST surface on `spec.providerID` in the InfraMachine resource", and in v1beta2 the provider reports completion on `status.initialization.provisioned`. The older `status.infrastructure.provisioned` name appears only in the page's legacy step list. The contract also says "there is no more special treatment for provider's terminal failures within Cluster API", so terminal failures are expressed through conditions. [[sources/research-gap-m7-operators-idempotency]]

## What the pages do not say

Neither page states an idempotency algorithm for a create whose response was lost. The guidance relies on provider-owned tags to find a resource again and on the provider ID to bind it to a Machine. How a specific infrastructure provider recovers after a restart, for example how an AWS provider finds an instance, was not read. [[sources/research-gap-m7-operators-idempotency]]

## Interpretation

Cluster API places the identity convention on the provider and leaves enforcement to each implementation, where Crossplane's runtime enforces a create-pending guard for every provider. That contrast is the wiki's reading.

## Related

[[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]], [[entities/cluster-api]], [[concepts/idempotency]], [[concepts/provider]]
