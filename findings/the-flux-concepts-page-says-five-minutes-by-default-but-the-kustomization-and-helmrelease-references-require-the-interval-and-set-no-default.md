---
title: "The Flux concepts page says five minutes by default but the Kustomization and HelmRelease references require the interval and set no default"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [pitfall, flux, interval, defaults, documentation-conflict, drift]
---

# The Flux concepts page says five minutes by default but the Kustomization and HelmRelease references require the interval and set no default

## Observation

Flux's own documentation disagrees with itself about the default reconcile interval, and the disagreement is not a version difference. The concepts page says: "The reconciliation runs every five minutes by default, but this can be changed with `.spec.interval`." The Kustomization reference says: "`.spec.interval` is a required field ... The minimum value should be 60 seconds." The HelmRelease reference also calls `.spec.interval` "a required field". [[sources/research-gap-g3-reconcile-defaults]] https://fluxcd.io/flux/concepts/ and https://fluxcd.io/flux/components/kustomize/kustomizations/

## What the source code shows

The Kustomization CRD Go type marks `Interval` as `+required` and carries only a duration-format pattern, with no default and no minimum marker in the lines read (default branch of kustomize-controller as of 2026-11-26). A required field has no controller-side default, so a manifest without `interval` is rejected and never falls back to five minutes. The 60-second figure is therefore a recommendation written as "should" in prose, and nothing in the type enforces it. The only default the dossier found is the `flux create` command's global `--interval` flag, which defaults to one minute ("source sync interval") and applies when the CLI generates a manifest. https://github.com/fluxcd/kustomize-controller/blob/main/api/v1/kustomization_types.go and https://github.com/fluxcd/flux2/blob/main/cmd/flux/create.go

## Why the numbers still circulate

The five-minute figure matches the 5m used in most example manifests, and the ten-minute figure in the Kustomization reference is an example of drift-check cadence ("every ten minutes, the Kustomization runs a server-side apply dry-run"), not a default. A guide example uses `interval: 60m0s` with the comment "detect drift and undo kubectl edits every hour", which shows hourly drift correction is a normal choice. The origin of the five-minute wording on the concepts page was not traced, because no commit history was read.

## Consequences

Drift-correction latency in Flux is whatever the author wrote in the manifest, see [[findings/drift-detection-latency-is-the-interval]]. A reader who trusts the concepts page may assume a five-minute cadence that no controller supplies. Source or spec changes are handled "instantly outside the interval window", so the interval bounds only drift detection and periodic re-checks. The practical guidance is to set `interval` explicitly on every object and treat 60 seconds as a floor chosen to avoid load, with jitter configurable on the controller to spread timers (the jitter value was not read). See [[entities/flux]], [[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]], and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: the two items this page said were not traced are now answered. The origin of the wording is a docs commit on 2022-08-10 that replaced "every one minute by default" with "every five minutes by default", with no stated reason ([[findings/the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason]]). The controller jitter is plus or minus 5 percent by default ([[findings/flux-controllers-jitter-reconcile-intervals-by-plus-or-minus-5-percent-by-default]]). The Kustomization reference text and the "instantly outside the interval window" wording were re-read and still agree with this page. [[sources/research-gap-b1-recheck-flux-k8s]]
