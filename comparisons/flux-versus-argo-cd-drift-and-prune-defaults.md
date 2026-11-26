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
