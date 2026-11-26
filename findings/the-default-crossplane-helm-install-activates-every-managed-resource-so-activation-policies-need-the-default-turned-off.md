---
title: "The default Crossplane Helm install activates every managed resource so activation policies need the default turned off"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, activation-policy, crd-count, helm, defaults]
---

# The default Crossplane Helm install activates every managed resource so activation policies need the default turned off

## Observation

Managed resource activation policies (MRAPs) only reduce the CRD count if the default is changed. Since v2.0, installing a provider converts its CRDs to managed resource definitions (MRDs), through a flag that defaults to true. An MRD has `state: Active` or `Inactive`, and Inactive means no CRD exists. The Crossplane Helm chart creates a `default` MRAP that activates `"*"` (chart value `provider.defaultActivations: ["*"]`), so a stock install activates everything. The docs say how to go selective: "The Crossplane Helm chart creates a default MRAP that activates all resources", and `--set provider.defaultActivations={}` disables it. [[sources/research-gap-g3-crossplane-v2]] https://github.com/crossplane/crossplane/blob/main/cluster/charts/crossplane/values.yaml

## Mechanism and failure modes

An MRAP lists `spec.activate` patterns. The controller matches MRD names against exact names or prefix-only wildcards (not regular expressions, and `*` only at the start), sets matches to `Active`, and records `status.activated`. MRAPs are additive, and MRD transitions are one-way ("MRD state transitions are one-way only"). An MRD starts Inactive only when the provider declares the `safe-start` capability. Without it, MRDs start Active ("legacy behavior"). The docs name four failure modes: a pattern that matches nothing, MRDs not yet created because the provider is not installed, a provider without `safe-start`, and `Healthy: Unknown` with reason `EncounteredErrors` when some activations fail ("failed to activate 2 of 5 ManagedResourceDefinitions").

## Maturity

The docs label MRAP and MRD alpha (`apiextensions.crossplane.io/v1alpha1`, `alphaVersion: 2.0`), although `core.go` lists the MRD conversion flag under "Beta Features", see [[findings/crossplane-v2-5-docs-and-source-disagree-on-stage-labels-condition-status-and-group-suffixes]]. The docs estimate about 3 MiB of API server memory per CRD, which is an estimate, and no with-versus-without measurement was found.

## Mitigations

Turn off the default activation, list the groups the platform needs, and use providers that declare `safe-start` so an unused provider runtime scales to zero (v2.4.0). Remember that deactivation is not possible once an MRD is Active. See [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]], [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], and [[entities/crossplane]].
