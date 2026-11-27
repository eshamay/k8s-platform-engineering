---
title: "The Crossplane XRD docs list LegacyCluster beside v2 scopes although it exists only on the v1 XRD API"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, xrd, claims, legacycluster, docs]
---

# The Crossplane XRD docs list LegacyCluster beside v2 scopes although it exists only on the v1 XRD API

## Observation

The v2.5 XRD documentation page lists three scope values in one table: `Namespaced` (default in v2), `Cluster`, and `LegacyCluster` ("Cluster-scoped with support for claims (v1 compatibility mode)"). That blurs a fact the shipped CRD makes plain. The v2 version of the XRD API (`apiextensions.crossplane.io/v2`) enumerates only `Namespaced` and `Cluster`, defaults to `Namespaced`, and rejects `claimNames` with a CEL rule ("Claims aren't supported in apiextensions.crossplane.io/v2"). `LegacyCluster` appears only on the v1 XRD API, whose scope defaults to `LegacyCluster` and which includes a rule that "Only LegacyCluster composite resources can offer claims". [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) https://github.com/crossplane/docs/blob/master/content/v2.5/api/crds/apiextensions.crossplane.io_compositeresourcedefinitions.yaml

## Why it matters

A reader of the docs table can conclude that a v2 XRD can choose `LegacyCluster` to keep claims. In fact keeping claims means keeping a v1 XRD, which is deprecated in its CRD ("will be removed in a future release; consider migrating to v2") but still served and, in the v2.5 manifest, still the storage version. No removal date was found. Claims are still maintained: v2.4.0 strips XR machinery fields from claim-to-XR sync and v2.5.0 makes a claim fail reconciliation if its XRD lookup fails, so it cannot bypass an XRD's `enforcedCompositionRef`.

## Mitigations

Teach scope as a property of the XRD API version. New work uses a v2 XRD with `Namespaced` or `Cluster` scope and no claims. Existing v1 XRDs keep working with claims after the upgrade, and legacy cluster-scoped XRs cannot compose namespaced resources. See [comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources](../comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources.md), [findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane](older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane.md), [examples/a-v1-crossplane-claim-fronts-a-cluster-scoped-composite-resource](../examples/a-v1-crossplane-claim-fronts-a-cluster-scoped-composite-resource.md), and [concepts/composite-resource](../concepts/composite-resource.md).
