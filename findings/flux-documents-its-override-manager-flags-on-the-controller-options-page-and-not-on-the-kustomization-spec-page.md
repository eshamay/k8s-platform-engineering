---
title: Flux documents its override-manager flags on the controller options page and not on the Kustomization spec page
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
aliases: []
tags: [flux, documentation, verification, kustomize-controller]
---

# Flux documents its override-manager flags on the controller options page and not on the Kustomization spec page

## Observation

The Kustomization API reference at https://fluxcd.io/flux/components/kustomize/kustomizations/ was scraped in full on 2026-11-26 and contains no mention of `--override-manager`. The flags are controller arguments and not fields of the Kustomization object, so they are documented on the controller options page at https://fluxcd.io/flux/components/kustomize/options/. That page carries the flag table rows for `--override-manager` and `--override-manager-before-dry-run` and the section "Override managers before dry-run". [[sources/research-gap-g3-flux-ssa-helm]]

## Why it matters

A reader who searches only the Kustomization spec for field-manager handling will conclude that Flux has no such control. The `ssa` annotation, `.spec.ignore` rules, and the force settings live on the spec page, while manager takeover is a per-controller flag. The wiki's SSA comparison therefore lists the flag as a controller setting. See [[comparisons/ssa-conflict-policy-across-tools]].

## Caveat

This is an absence claim from a rendered scrape and not from the source file, so recheck it when the docs change.

## Related

[[entities/flux]], [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]]
