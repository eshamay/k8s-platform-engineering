---
title: Crossplane XRDs versus kro ResourceGraphDefinitions as CRD generators
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [crossplane, kro, crd, platform-api]
---

# Crossplane XRDs versus kro ResourceGraphDefinitions as CRD generators

## Summary

Both tools let a platform team publish its own API by generating a CRD from a higher-level definition, so the team does not hand-write the CRD. This page compares only that CRD-generation step, not the full composition models. [[sources/research-custom-resource-definition]]

## Side by side

| Aspect | Crossplane XRD | kro ResourceGraphDefinition |
|---|---|---|
| Input | OpenAPI v3 schema in the XRD | A simple schema plus a resource graph with CEL expressions |
| Output | A CRD for the composite resource and, in older modes, a claim CRD | A CRD that kro registers with the apiserver |
| Scope options | Namespaced (default in v2), Cluster, or LegacyCluster | Not covered by the dossier |
| Multiple versions | Allowed, and breaking changes need conversion webhooks | Not covered by the dossier |
| Immutability | Group and names cannot change after creation | Not covered by the dossier |
| Quirk | Schema changes may need a Crossplane pod restart | Errors are caught at definition time, and dependency order is inferred |

The Crossplane column comes from https://docs.crossplane.io/latest/composition/composite-resource-definitions/, where the v1.14 URL returned 404 and the latest documentation was read, so details may differ by version. The kro column comes from https://kro.run/docs/concepts/rgd/overview/. The dossier contrasts kro with Crossplane in that kro builds CRDs from a lightweight schema without a separate composition language.

## Related

[[examples/xrd-and-rgd-declare-platform-gvks]], [[examples/platform-team-self-service-apis-with-crossplane-and-kro]], [[entities/crossplane]], [[entities/kro]], and the gap on [[open-knowledge-gaps]] comparing Compositions and kro graphs.
