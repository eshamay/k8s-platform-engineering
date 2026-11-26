---
title: Oversized Compositions and cloud-shaped APIs make platform APIs hard to use
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, composition, api-design, platform-engineering]
---

# Oversized Compositions and cloud-shaped APIs make platform APIs hard to use

## Observation

A practitioner blog from Polarpoint lists two design mistakes in Crossplane platforms. The first is the oversized "mega-Composition" that tries to compose a whole environment in one blueprint, and the advice is to start with small Compositions. The second is an API shaped like a cloud provider, such as one that mirrors a cloud's own resource names, and the advice is to model APIs by infrastructure domain and to design for the mental model of the people who will use them. The post also says to invest in observability through status conditions and events before rollout. [[sources/research-crossplane-deep-dive]]

## Why it matters

A platform API is a contract that users depend on, so a poorly shaped one is costly to change later. The wiki records that schema changes are blocked or need conversion in [[findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion]]. An oversized Composition also concentrates risk, since editing a live Composition can disrupt composed resources, see [[findings/editing-a-live-composition-can-disrupt-or-replace-existing-composed-resources]].

## Evidence strength

The source is opinion and not primary documentation. It cites no incident and no measurement. The advice fits the operational cost of function pipelines described in [[findings/composition-functions-add-moving-parts-that-must-be-healthy]], since a larger Composition means more functions that must stay healthy. It is best treated as design guidance to verify in practice. The related choice about how many control planes to run is in [[decisions/run-one-crossplane-control-plane-or-several-domain-scoped-ones]].
