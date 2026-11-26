---
title: "A Flux ignore rule without a target selector matches every object the Kustomization manages"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [flux, ignore-rules, drift, pitfall]
---

# A Flux ignore rule without a target selector matches every object the Kustomization manages

## Observation

The kustomize-controller specification says "Omitting the `target` selector causes the rule to match **all** objects managed by the Kustomization". Ignore rules are lists of JSON Pointer (RFC 6901) paths "to exclude from drift detection", and a rule can carry an optional target selector (with optional regular expressions) to narrow it to chosen objects. URL: https://github.com/fluxcd/kustomize-controller/blob/main/docs/spec/v1/kustomizations.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [[sources/research-gap-o1-argocd-flux-gitops]]

## Context

The Flux blog post of 2026-08-03 introduced `.spec.ignore` and says it "lets you tell Flux to leave specific fields alone during drift detection and correction". URL: https://github.com/fluxcd/website/blob/main/content/en/blog/2026-08-03-ignore-rules-drift-detection/index.md. The dossier did not read the post beyond that quoted sentence in detail, and it did not test the behavior.

## Why it matters

A rule written for one Deployment's `/spec/replicas` that omits the target would also exempt that path on every other object in the Kustomization, so real drift on those objects would go uncorrected without any signal. The safe reading of the documentation is to add a target selector to every rule. Two other per-object Flux controls are documented in the same specification: the `kustomize.toolkit.fluxcd.io/force: enabled` annotation for force-replace and the `kustomize.toolkit.fluxcd.io/prune: disabled` annotation for pruning.

## Related

[[entities/flux]], [[comparisons/exemption-and-ignore-controls-across-tools]], [[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]], [[findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied]]
