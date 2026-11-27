---
title: Crossplane v2 upgrade moves through v1.20, the conversion CLI, and then providers
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [crossplane, upgrade, v2, migration]
---

# Crossplane v2 upgrade moves through v1.20, the conversion CLI, and then providers

## Scenario

A team runs Crossplane v1 with native patch-and-transform Compositions and wants to reach v2. The official upgrade guide says to upgrade only from v1.20, the final v1.x release, so any older installation first has to climb to v1.20. [sources/research-crossplane-deep-dive](../sources/research-crossplane-deep-dive.md)

## The sequence

First, reach v1.20. Second, fix deprecations, with a command-line converter available to help move native patch-and-transform (`mode: Resources`) to function pipelines. Third, upgrade the core with Helm. Fourth, optionally set managed resource activation policies so that only the needed CRDs are installed. Fifth, upgrade the providers. The guide doubles as a map of what changed, which is why it is a useful first read for anyone learning the v2 model.

## What the team must change by hand

`ControllerConfig` is replaced by `DeploymentRuntimeConfig`. The alpha external secret stores are removed. XRs no longer carry native connection details, so teams recreate them as composed Secrets. The `--registry` flag is removed, so package references must be fully qualified names. These are the breaking changes that [findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites](../findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites.md) records.

## Staging the rollout

The Compositions documentation says that referencing functions by OCI digest pins their versions per Composition revision, which allows a staged rollout. Pinning package versions and rolling out revision by revision keeps one bad function version from reaching every composite at once. See [decisions/choose-automatic-or-manual-composition-update-policy](../decisions/choose-automatic-or-manual-composition-update-policy.md), [concepts/composition](../concepts/composition.md), and [entities/crossplane](../entities/crossplane.md).

## Caveat

The dossier read the guide through a summarizing fetch, so field names should be checked on the live page. Whether v2 removes claims or only makes them optional is unresolved in these sources. See [comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources](../comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources.md).
