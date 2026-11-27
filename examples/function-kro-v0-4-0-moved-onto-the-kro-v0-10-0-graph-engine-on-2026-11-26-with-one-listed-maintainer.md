---
title: function-kro v0.4.0 moved onto the kro v0.10.0 graph engine on 2026-11-26 with one listed maintainer
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: []
tags: [function-kro, crossplane, kro, release, maintainers]
---

# function-kro v0.4.0 moved onto the kro v0.10.0 graph engine on 2026-11-26 with one listed maintainer

## Scenario

The crossplane-contrib `function-kro` repository published v0.4.0 on 2026-11-26. Earlier releases were v0.3.0 (2026-06-14) and v0.2.1 (2026-04-13). The release notes say the function "runs kro's own graph engine, so its behavior matches upstream kro much more closely", importing kro v0.10.0 as a Go module and vendoring only the executor. [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md) URL: https://github.com/crossplane-contrib/function-kro/releases/tag/v0.4.0.

## What changed

A resource is now held back until every resource it references is ready, "matching upstream kro", so a `readyWhen` that never turns true blocks its dependents. Custom conditions on the composite are supported, and the pipeline context is read only: "writing to it isn't supported yet." Differences from standalone kro remain, listed in `patches/UPSTREAM_DIFFERENCES.md`, see [findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps](../findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps.md).

## Maintainership

OWNERS.md names one maintainer, Jared Watts (jbw976), so the bus factor on paper is one, although the release shows several pull request authors. The dossier read no independent production report. See [entities/function-kro](../entities/function-kro.md) and [examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step](function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step.md).
