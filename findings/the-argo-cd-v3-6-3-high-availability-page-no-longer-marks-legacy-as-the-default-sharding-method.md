---
title: The Argo CD v3.6.3 high-availability page no longer marks legacy as the default sharding method
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, sharding, defaults, documentation]
---

# The Argo CD v3.6.3 high-availability page no longer marks legacy as the default sharding method

## Observation

At v2.8.0 the high-availability page read "Supported sharding methods are : [legacy (default), round-robin]." At v2.14.0 and v3.0.0 the list still showed "legacy (default)". The v3.6.3 page (released 2026-11-24) lists three methods, `legacy`, `round-robin`, and `consistent-hashing`, without the "(default)" marker. Nothing read says the default changed. The dossier did not read the `argocd-cmd-params-cm` reference or the v3.x upgrade notes, so whether `legacy` is still the default in v3.6.3 is UNVERIFIED. [[sources/research-gap-g3-argocd-capi]] URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/operator-manual/high_availability.md.

## Why it matters

The legacy method is "uid based distribution (non-uniform)", and the other two are labelled experimental at v3.6.3. A team that wants to know what it runs today cannot learn the default from the current page and has to check the controller's `--sharding-method` setting or the parameters config map.

## Related

[[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[entities/argo-cd]], [[concepts/scale-and-sharding]]
