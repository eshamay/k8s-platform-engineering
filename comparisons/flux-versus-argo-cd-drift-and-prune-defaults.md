---
title: Flux versus Argo CD drift and prune defaults
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [gitops, flux, argo-cd, prune, drift]
---

# Flux versus Argo CD drift and prune defaults

| Behavior | [[entities/flux]] | [[entities/argo-cd]] |
|---|---|---|
| Drift detection | Server-side apply dry run each interval (minimum 60 seconds on the Kustomization page) | Compares Git manifests against live state and marks the app OutOfSync |
| Reverting manual changes | Reverts on reconcile unless suspended | Only when self-heal is enabled; off by default |
| Prune | Controlled by `prune` setting, per-object opt-out annotation | Off by default |
| Empty-source protection | Not described in the dossier | Allow-empty protection |
| Deletion policy | MirrorPrune, Delete, WaitForTermination, Orphan | Not described in the dossier |
| Pause | `suspend` stops new revisions and drift correction | Rollback blocked while auto-sync is on |
| Failed sync handling | Not described | No retry for the same commit and parameters |
| Immutable fields | `force` recreates, may cause downtime | Not described |

## Reading the comparison

The dossier did not read the two tools side by side, so this table merges separate documentation pages and should not be treated as a head-to-head test. The overall pattern is that Argo CD ships with destructive actions off, while Flux exposes explicit switches and policies for each. The Flux concepts page states a default five-minute interval while the Kustomization page states a minimum of 60 seconds, and the user sets the interval, so the default needs verification. See [[findings/unintended-deletion-through-prune]], [[findings/immutable-fields-and-drift-collisions]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], and [[open-knowledge-gaps]]. [[sources/research-declarative-vs-imperative]]

## Helm drift mode and diffing controls

Flux HelmRelease drift detection is off by default (`mode: disabled`), with `warn` as a middle stage, while Argo CD self-heal is also off by default and its `prune` is off by default. Argo CD documents `ignoreDifferences` and Flux documents `driftDetection.ignore` and the `ssa` annotation. [[sources/research-self-healing-and-drift-detection]] See [[comparisons/exemption-and-ignore-controls-across-tools]] and [[comparisons/drift-detection-mechanisms-across-tools]].
