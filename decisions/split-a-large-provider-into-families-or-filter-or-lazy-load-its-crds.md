---
title: Split a large provider into families or filter or lazy-load its CRDs
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
aliases: []
tags: [decision, crossplane, provider-family, crd-count, scale]
---

# Split a large provider into families or filter or lazy-load its CRDs

## Status

Decided by the Crossplane project in 2023, as recorded in its smaller-providers design doc and the provider-families blog post. This page records the project's reasoning and is not an ADR authored by this wiki. Current Crossplane v2 guidance after 2023 is unverified.

## Context

Crossplane providers generated from cloud APIs installed hundreds of CRDs, with provider-aws above 900 by one count. Installing one could leave the API unresponsive for up to an hour. CRD count was never an official Kubernetes scaling threshold, and upstream fixes did not keep up with generated providers. The design doc says problems appear around 500 CRDs and that "Installing a single large provider can break a cluster." https://blog.crossplane.io/crd-scaling-provider-families/ and https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md [[sources/research-scale-and-sharding]]

## Options

Splitting the provider into service-scoped providers grouped as a family needs no new Crossplane concepts and gives a non-disruptive migration. Filtering CRDs through an allow list and lazy-loading CRDs on demand were the alternatives, and the design doc rejected both.

## Decision

The community chose provider families, and Upbound's official providers shipped as families first.

## Consequences

A typical user drops from more than 900 CRDs to about 176, at the cost of about 9 provider pods instead of 2 and more per-provider memory. See [[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]]. Crossplane later added resource-type activation in version 2, see [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]], which revisits the filtering idea. See also [[examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use]], [[comparisons/provider-families-versus-per-service-controllers]], and [[concepts/scale-and-sharding]].
