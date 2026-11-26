---
title: Flux versus Argo CD drift and prune defaults
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [gitops, flux, argo-cd, prune, drift]
---

# Flux versus Argo CD drift and prune defaults

| Behavior | [[entities/flux]] | [[entities/argo-cd]] |
|---|---|---|
| Drift detection | Server-side apply dry run each interval (required, no default, 60 seconds recommended minimum) | Compares Git manifests against live state and marks the app OutOfSync |
| Reverting manual changes | Reverts on reconcile unless suspended | Only when self-heal is enabled; off by default |
| Prune | Controlled by `prune` setting, per-object opt-out annotation | Off by default |
| Empty-source protection | Not described in the dossier | Allow-empty protection |
| Deletion policy | MirrorPrune, Delete, WaitForTermination, Orphan | Not described in the dossier |
| Pause | `suspend` stops new revisions and drift correction | Rollback blocked while auto-sync is on |
| Failed sync handling | Not described | No retry for the same commit and parameters |
| Immutable fields | `force` recreates, may cause downtime | Not described |

## Reading the comparison

The dossier did not read the two tools side by side, so this table merges separate documentation pages and should not be treated as a head-to-head test. The overall pattern is that Argo CD ships with destructive actions off, while Flux exposes explicit switches and policies for each. The Flux concepts page states a default five-minute interval while the Kustomization page marks the interval as required with a recommended 60 second minimum. Correction 2026-11-26: the interval has no controller-side default, so the five-minute figure is not a default, see [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]]. Argo CD's default is 120 seconds plus up to 60 seconds of jitter in v3.x and a flat 180 seconds in v2.x, see [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]. See [[findings/unintended-deletion-through-prune]], [[findings/immutable-fields-and-drift-collisions]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], and [[open-knowledge-gaps]]. [[sources/research-declarative-vs-imperative]]

## Helm drift mode and diffing controls

Flux HelmRelease drift detection is off by default (`mode: disabled`), with `warn` as a middle stage, while Argo CD self-heal is also off by default and its `prune` is off by default. Argo CD documents `ignoreDifferences` and Flux documents `driftDetection.ignore` and the `ssa` annotation. [[sources/research-self-healing-and-drift-detection]] See [[comparisons/exemption-and-ignore-controls-across-tools]] and [[comparisons/drift-detection-mechanisms-across-tools]].

## Interval default and jitter, 2026-11-26 recheck

Correction note, 2026-11-26: Flux supplies no controller default for the interval, and it jitters every requeue by plus or minus 5 percent by default ([[findings/flux-controllers-jitter-reconcile-intervals-by-plus-or-minus-5-percent-by-default]]). The concepts page's five-minute wording is a 2022 docs edit and not a default ([[findings/the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason]]). HelmRelease drift detection defaults to disabled and, when enabled, corrects drift from a server-side dry-run apply ([[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]]). [[sources/research-gap-b1-recheck-flux-k8s]]
