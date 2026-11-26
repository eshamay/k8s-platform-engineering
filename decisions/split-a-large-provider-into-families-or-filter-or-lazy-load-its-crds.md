---
title: Split a large provider into families or filter or lazy-load its CRDs
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
  - id: research-gap-g3-scale-recheck
    hash: d9bd6911bff7
    ingested: 2026-11-26
aliases: []
tags: [decision, crossplane, provider-family, crd-count, scale]
---

# Split a large provider into families or filter or lazy-load its CRDs

## Status

Decided by the Crossplane project in 2023, as recorded in its smaller-providers design doc and the provider-families blog post. This page records the project's reasoning and is not an ADR authored by this wiki. Current Crossplane v2 guidance was checked on 2026-11-26 and does not reverse the decision, see the update below.

## Context

Crossplane providers generated from cloud APIs installed hundreds of CRDs, with provider-aws above 900 by one count. Installing one could leave the API unresponsive for up to an hour. CRD count was never an official Kubernetes scaling threshold, and upstream fixes did not keep up with generated providers. The design doc says problems appear around 500 CRDs and that "Installing a single large provider can break a cluster." https://blog.crossplane.io/crd-scaling-provider-families/ and https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md [[sources/research-scale-and-sharding]]

## Options

Splitting the provider into service-scoped providers grouped as a family needs no new Crossplane concepts and gives a non-disruptive migration. Filtering CRDs through an allow list and lazy-loading CRDs on demand were the alternatives, and the design doc rejected both.

## Decision

The community chose provider families, and Upbound's official providers shipped as families first.

## Consequences

A typical user drops from more than 900 CRDs to about 176, at the cost of about 9 provider pods instead of 2 and more per-provider memory. The per-provider memory numbers in the design doc are targets, not measurements, see [[findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements]]. See [[findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory]]. Crossplane later added resource-type activation in version 2, see [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]], which revisits the filtering idea. See also [[examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use]], [[comparisons/provider-families-versus-per-service-controllers]], and [[concepts/scale-and-sharding]].

## Update from the v2.5 verification pass (2026-11-26)

The Accepted managed resource definition design doc says families "helped alleviate the issue, but some large Crossplane deployments still work around it", and v2 doubles the managed resource types per provider because it adds namespaced types beside legacy ones. It positions MRDs and activation policies as the next answer and does not retire families: provider-upjet-aws (v2.10.0, 2026-11-20) is still built as a family with sub-packages. So the 2023 decision stands and now has an alpha alternative, activation policies with safe-start providers, plus v2.4 scale-to-zero and v2.5 memory cuts. The idea this page called filtering has therefore returned in a different form. [[sources/research-gap-g3-crossplane-v2]] See [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]] and [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]].

## Evidence update (2026-11-26)

A recheck of the current Crossplane v2 material found no published numeric limit for XRs or composed resources per controller, no independent v2 benchmark, and no guidance that retires provider families. The options above are unchanged and this page still gives no recommendation beyond the evidence it cites. [[sources/research-gap-b1-recheck-kro-crossplane]]
