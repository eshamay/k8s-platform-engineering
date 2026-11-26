---
title: function-kro lists documented behavioral differences from upstream kro so its full-parity claim reads as same engine with gaps
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: [function-kro upstream differences]
tags: [function-kro, kro, crossplane, parity, verification]
---

# function-kro lists documented behavioral differences from upstream kro so its full-parity claim reads as same engine with gaps

## Observation

The function-kro README says it "natively embeds KRO's graph builder, CEL evaluator, and runtime engine with full feature parity". The repository's own file `patches/UPSTREAM_DIFFERENCES.md` at v0.4.0 opens with "This document lists where a ResourceGraph behaves differently than the same RGD would in kro". The listed differences are as follows. An existing resource that cannot be rendered makes the function return a fatal result and "Crossplane then applies nothing", so the composite goes Synced=False, where upstream keeps the resource and retries. A resource waiting on dependencies still receives template updates. A hard error in one resource fails the whole run. Dependents see rendered values one function pass before server-set values. The composite's status is not checked against the XRD, because "function-kro doesn't check the ResourceGraph's status fields against it." Resource scope is inferred and not asked of the API server. Crossplane-owned condition types cannot be set by authors. `runtime.condition` reads approximations of built-in conditions, with `GraphResolved` always `True`. Creation-time RGD validation is skipped "because it requires upstream code that isn't public". [[sources/research-gap-o5-kro-ecosystem]] URLs: https://github.com/crossplane-contrib/function-kro/blob/v0.4.0/patches/UPSTREAM_DIFFERENCES.md and https://github.com/crossplane-contrib/function-kro/blob/main/README.md.

## What changed in v0.4.0

Release v0.4.0 (2026-11-26) imports kro v0.10.0 as a Go module and "runs kro's own graph engine, so its behavior matches upstream kro much more closely." A resource is now held back until every resource it references is ready, "matching upstream kro". The parity claim is therefore best read as the same engine with a documented list of gaps. See [[examples/function-kro-v0-4-0-moved-onto-the-kro-v0-10-0-graph-engine-on-2026-11-26-with-one-listed-maintainer]].

## What is not known

The dossier did not confirm whether the server-side apply ownership problem described in `spec-desired-ssa.md` (the function returning the observed composite as desired state) is fixed in v0.4.0. It also did not map kro GraphRevisions to Crossplane CompositionRevisions, since the README credits safe rollouts to CompositionRevisions, a Crossplane layer. No independent production reports of function-kro were found.

## Why it matters

A team choosing between standalone kro and function-kro cannot assume identical failure behavior. The fatal-run difference changes what an operator sees when a composed object is missing, and the skipped validation means mistakes that kro rejects at RGD creation may surface at runtime. See [[entities/function-kro]], [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]], and [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]].
