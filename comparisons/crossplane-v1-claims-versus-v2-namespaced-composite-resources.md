---
title: Crossplane v1 claims versus v2 namespaced composite resources
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
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
| Composite resource scope | Cluster-scoped | Namespaced (the default) or Cluster on the v2 XRD API. `LegacyCluster` exists only on the v1 XRD API and keeps claims |
| Link between objects | `spec.resourceRef` on the claim, `spec.claimRef` on the XR | Not needed for new-style XRDs |
| XRD setting | `claimNames` enables claims | Claims not available for new-style XRDs |
| Composition mode | Pipeline or native patch-and-transform | Pipeline only, `mode: Resources` removed |
| Managed resources | Cluster-scoped | Namespaced ones under `.m.` API groups, with existing v1 ones still working |
| Deletion ordering | Claim controller deletes the XR using the claim's delete policy | XR deletion policy Background, Foreground, or Pipeline |
| Migration | Existing v1 XRs keep working | No automated tool to move v1 cluster-scoped XRs and managed resources |

## Reading the table

Sources are mixed in age. The claim rows come from the v1.20 pages. The v2 rows come from the upgrade guide, the v2.5 XRD and composite resources pages, and the XRD CRD manifest shipped with the v2.5 docs, which closes the earlier doubt about claim support in v2. The deletion-ordering row follows the earlier wiki finding that claims order deletion through the claim's delete policy, see [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]].

## Related

[[examples/a-v1-crossplane-claim-fronts-a-cluster-scoped-composite-resource]], [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]], [[findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane]], [[concepts/composite-resource]]

## Update from the v2.5 verification pass (2026-11-26)

Correction (2026-11-26): the earlier version of this page placed `LegacyCluster` in the v2 column on the strength of a third-party blog. The primary sources say otherwise. The v2 XRD API enumerates only `Namespaced` and `Cluster` and rejects `claimNames` with a CEL rule, while the v1 XRD API defaults to `LegacyCluster` and only `LegacyCluster` XRs can offer claims. The v1 XRD API is deprecated but served and still the storage version in the v2.5 manifest. [[sources/research-gap-g3-crossplane-v2]]

Further verified points: the v2.5 `composition/` docs directory has no claims page (v1.20 had `concepts/claims.md`), legacy cluster-scoped XRs are always deleted with the Background policy, claim-to-XR sync through server-side apply is a beta flag on by default (`--enable-ssa-claims`), and the v2.5.0 notes say claims "remain supported in Crossplane v2". A legacy cluster-scoped XR cannot compose namespaced resources. No date or plan to deprecate claims was found. The deletion-ordering row still follows the claim controller's delete policy for v1, and the legacy-XR Background rule above describes the XR itself. See [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]].
