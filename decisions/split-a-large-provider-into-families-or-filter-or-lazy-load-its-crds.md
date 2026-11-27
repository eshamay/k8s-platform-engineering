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
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [decision, crossplane, provider-family, crd-count, scale]
---

# Split a large provider into families or filter or lazy-load its CRDs

## Status

Decided by the Crossplane project in 2023, as recorded in its smaller-providers design doc and the provider-families blog post. This page records the project's reasoning and is not an ADR authored by this wiki. Current Crossplane v2 guidance was checked on 2026-11-26 and does not reverse the decision, see the update below.

## Context

Crossplane providers generated from cloud APIs installed hundreds of CRDs, with provider-aws above 900 by one count. Installing one could leave the API unresponsive for up to an hour. CRD count was never an official Kubernetes scaling threshold, and upstream fixes did not keep up with generated providers. The design doc says problems appear around 500 CRDs and that "Installing a single large provider can break a cluster." https://blog.crossplane.io/crd-scaling-provider-families/ and https://github.com/crossplane/crossplane/blob/main/design/design-doc-smaller-providers.md [sources/research-scale-and-sharding](../sources/research-scale-and-sharding.md)

## Options

Splitting the provider into service-scoped providers grouped as a family needs no new Crossplane concepts and gives a non-disruptive migration. Filtering CRDs through an allow list and lazy-loading CRDs on demand were the alternatives, and the design doc rejected both.

## Decision

The community chose provider families, and Upbound's official providers shipped as families first.

## Consequences

A typical user drops from more than 900 CRDs to about 176, at the cost of about 9 provider pods instead of 2 and more per-provider memory. The per-provider memory numbers in the design doc are targets, not measurements, see [findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements](../findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements.md). See [findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory](../findings/splitting-a-provider-into-a-family-trades-fewer-crds-for-more-pods-and-memory.md). Crossplane later added resource-type activation in version 2, see [examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs](../examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs.md), which revisits the filtering idea. See also [examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use](../examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use.md), [comparisons/provider-families-versus-per-service-controllers](../comparisons/provider-families-versus-per-service-controllers.md), and [concepts/scale-and-sharding](../concepts/scale-and-sharding.md).

## Update from the v2.5 verification pass (2026-11-26)

The Accepted managed resource definition design doc says families "helped alleviate the issue, but some large Crossplane deployments still work around it", and v2 doubles the managed resource types per provider because it adds namespaced types beside legacy ones. It positions MRDs and activation policies as the next answer and does not retire families: provider-upjet-aws (v2.10.0, 2026-11-20) is still built as a family with sub-packages. So the 2023 decision stands and now has an alpha alternative, activation policies with safe-start providers, plus v2.4 scale-to-zero and v2.5 memory cuts. The idea this page called filtering has therefore returned in a different form. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) See [findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off](../findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off.md) and [examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds](../examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds.md).

## Evidence update (2026-11-26)

A recheck of the current Crossplane v2 material found no published numeric limit for XRs or composed resources per controller, no independent v2 benchmark, and no guidance that retires provider families. The options above are unchanged and this page still gives no recommendation beyond the evidence it cites. [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md)

## Evidence from the admission and CRD dossier

No official CRD count limit exists, and issue reports tie roughly 700 CRDs to a CPU spike and roughly 1,900 CRDs to about 8 GiB of apiserver memory ([findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit](../findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit.md)). Config Connector ships 883 CRD files ([findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind](../findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind.md)). No recommendation is made here. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Update from the o8 dossier

Update 2026-11-26: nothing read in the o8 dossier retires the 2023 provider-family decision. A collaborator comment on Upjet issue 151 says large monolithic provider packages for AWS, GCP, and Azure are discouraged, and the v2.5 MRD guide estimates about 3 MiB of API server memory per CRD, an illustrative figure and not a benchmark. See [findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families](../findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families.md). [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)
