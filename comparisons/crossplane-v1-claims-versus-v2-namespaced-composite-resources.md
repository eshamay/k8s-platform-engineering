---
title: Crossplane v1 claims versus v2 namespaced composite resources
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [crossplane, claims, v1, v2, namespaces]
---

# Crossplane v1 claims versus v2 namespaced composite resources

## Summary

In v1 a namespaced claim sat in front of a cluster-scoped XR, which is how a team got a namespaced API. In v2 XRs are namespaced themselves, and claims are removed for new-style XRDs. [[sources/research-composite-resource]]

## Side by side

| Aspect | v1 | v2 |
|---|---|---|
| User-facing object | Claim, namespaced | XR, namespaced |
| Composite resource scope | Cluster-scoped | Namespaced (the default scope), with a `LegacyCluster` fallback reported by a third-party blog |
| Link between objects | `spec.resourceRef` on the claim, `spec.claimRef` on the XR | Not needed for new-style XRDs |
| XRD setting | `claimNames` enables claims | Claims not available for new-style XRDs |
| Composition mode | Pipeline or native patch-and-transform | Pipeline only, `mode: Resources` removed |
| Managed resources | Cluster-scoped | Namespaced ones under `.m.` API groups, with existing v1 ones still working |
| Deletion ordering | Claim controller deletes the XR using the claim's delete policy | XR deletion policy Background, Foreground, or Pipeline |
| Migration | Existing v1 XRs keep working | No automated tool to move v1 cluster-scoped XRs and managed resources |

## Reading the table

Sources are mixed in age. The claim rows come from the v1.20 pages, the v2 rows come from the upgrade guide and the latest composite resources page, and the `LegacyCluster` detail comes only from the comparison blog. The dossier did not read a primary v2 XRD page that states claim support precisely, so the v2 column needs verification, as tracked in [[open-knowledge-gaps]]. The deletion-ordering row follows the earlier wiki finding that claims order deletion through the claim's delete policy, see [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]].

## Related

[[examples/a-v1-crossplane-claim-fronts-a-cluster-scoped-composite-resource]], [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]], [[findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane]], [[concepts/composite-resource]]
