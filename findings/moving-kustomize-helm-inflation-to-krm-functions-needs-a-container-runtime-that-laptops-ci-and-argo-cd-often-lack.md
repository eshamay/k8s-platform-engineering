---
title: Moving Kustomize Helm inflation to KRM functions needs a container runtime that laptops, CI, and Argo CD often lack
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kustomize, krm-functions, helm, argo-cd, containers]
---

# Moving Kustomize Helm inflation to KRM functions needs a container runtime that laptops, CI, and Argo CD often lack

## Observation

In a GitHub issue titled "Helm support: long term plan", Kustomize maintainers proposed moving the built-in Helm inflation generator toward KRM functions (https://github.com/kubernetes-sigs/kustomize/issues/4401). Users objected, because a KRM function runs as a container and so needs a container runtime. One commenter put it as "We require kustomize to be run on various end user devices that won't have docker installed." The thread also records that authentication to private chart repositories had long been broken. Support for Helm v4 arrived in kustomize v5.8.1, and no deprecation date for the built-in path was set. The dossier read the thread through a summarizing fetch. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Why it matters

The dispute is a concrete cost of the KRM function model, and it shows that render-time abstractions fight over where code runs. A function that needs a container runtime cannot run on a laptop without one, in a CI runner that forbids nested containers, or inside the Argo CD repo server. Crossplane avoids the problem by running its composition functions in-cluster as gRPC services, and kro avoids it by evaluating CEL in process, so server-side abstractions move that execution requirement into the cluster. See [entities/kpt](../entities/kpt.md), [entities/kustomize](../entities/kustomize.md), and [comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius](../comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius.md).

## Update from the KRM specification

The container requirement the commenters ran into is a MUST in the KRM Functions Specification, so it is not a Kustomize choice, see [findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure](the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure.md). The only verified non-container path is the opt-in exec extension, see [findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage](kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage.md). The claims here about Argo CD and CI runners are still unverified by primary text. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

## Evidence strength

The evidence is a design discussion and not an incident. It shows user objections and maintainer intent, and it does not show how the proposal was finally resolved beyond the Helm v4 note.
