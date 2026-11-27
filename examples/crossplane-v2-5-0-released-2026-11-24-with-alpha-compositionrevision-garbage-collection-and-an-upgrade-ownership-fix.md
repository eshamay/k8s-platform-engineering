---
title: "Crossplane v2.5.0, released 2026-11-24, added alpha CompositionRevision garbage collection and an upgrade ownership fix"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [crossplane, release, compositionrevision, packages, upgrade]
---

# Crossplane v2.5.0, released 2026-11-24, added alpha CompositionRevision garbage collection and an upgrade ownership fix

## Scenario

The Crossplane v2.5.0 release notes (2026-11-24) record three changes that bear on scale and upgrades. Alpha garbage collection "deletes unused revisions beyond the new `spec.unusedRevisionHistoryLimit` field on `Composition` (default `1`", which bounds how many CompositionRevision objects accumulate. A new package revision "now reliably takes ownership of its objects during upgrades", fixing a case where a new revision took control of objects from a replaced one. And `status.crossplane` is reserved for Crossplane on modern XRs. URL: https://github.com/crossplane/crossplane/releases/tag/v2.5.0. [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

## Outcome

The release notes also carry the maintainer-reported memory result recorded in [examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds](crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds.md). The GC feature is alpha, so it needs enabling and its default is not a recommendation. How the package ownership bug showed up in practice, and in which earlier versions, is not described in the dossier.

## Related

[entities/crossplane](../entities/crossplane.md), [findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades](../findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades.md), [findings/crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions](../findings/crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions.md)
