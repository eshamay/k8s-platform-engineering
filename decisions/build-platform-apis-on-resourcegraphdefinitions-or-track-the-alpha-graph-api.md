---
title: Build platform APIs on ResourceGraphDefinitions or track the alpha Graph API
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: resource-composition-with-kro
    hash: 1d5781610376
    ingested: 2026-11-26
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: []
tags: [decision, kro, graph-api, rgd, maturity, evidence-only]
---

# Build platform APIs on ResourceGraphDefinitions or track the alpha Graph API

## Status

Open decision framed by the evidence. This is not an ADR authored by this wiki and it makes no recommendation, because no first-party source states a promotion plan for the Graph API. [[sources/research-gap-o5-kro-ecosystem]]

## Context

kro v0.10.0 (2026-11-10) ships a `Graph` kind (`kro.run/v1alpha1`) that is alpha and off by default behind the `GraphKind` gate. The KREP-024 design document says RGD and Graph "are no longer sibling engines": every RGD compiles to GraphRevision objects and runs on the shared graph engine, while Graph "does not replace or deprecate the RGD Kind". The kro API as a whole is `v1alpha1` and the FAQ warns of possible breaking changes. The in-repo roadmap is dated 2026-04-03 and the live kro.run roadmap still shows v0.10.0 as "Next", so neither gives a Graph timeline. A newer proposal, KREP-026 propagation control, was opened 2026-11-13.

## Options

Treat RGD as the stable surface and Graph as an experiment. Evidence for: the docs call Graph alpha and disabled by default, the gate controls only the Graph controller so RGDs behave the same either way, Graph has no schema, generated API, or instances, and no promotion date exists. Evidence against: the design document says RGD is internally a graph, so Graph semantics may eventually shape RGD behavior.

Track Graph as the eventual primitive. Evidence for: the RGD controller already runs on the graph engine and issues GraphRevisions, and the design says collections apply with bounded parallelism. Evidence against: Graph has no revision history and sets no owner references in the alpha, `readyWhen` only reports health there, and enabling it needs a manual CRD apply, see [[findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates]], [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]], and [[findings/enabling-the-kro-graph-api-needs-a-manual-crd-apply-because-helm-does-not-update-crds-on-upgrade]].

## Consequences

Choosing RGD accepts `v1alpha1` churn on the kind itself but keeps behavior defined by user-facing docs. Choosing Graph accepts a second layer of alpha risk with no compatibility guarantee. Both options depend on a roadmap that lags releases, see [[findings/the-kro-in-repo-roadmap-predates-the-v0-10-0-release-and-gives-no-graph-promotion-timeline]].

## Related

[[entities/kro]], [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]]

## Note from the EKS overview page

The Amazon EKS overview of managed kro describes the ResourceGraphDefinition as kro's single primary resource type and never mentions Graph, which is consistent with building on RGDs when using the managed capability. It does not state which kro version the capability runs, so whether Graph is even available there is unknown. See [[findings/the-amazon-eks-kro-overview-lists-resourcegraphdefinition-as-the-only-primary-resource-type-and-names-no-kro-version]]. [[sources/resource-composition-with-kro]]
