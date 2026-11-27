---
title: Kustomize
type: entity
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
aliases: [kustomize, kubectl apply -k]
tags: [tool, render-time, abstraction, packaging]
---

# Kustomize

Kustomize is a Kubernetes SIG CLI project that customizes plain YAML without templates, and it is the render-time counterpart to Helm in most GitOps setups. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## What it is

The project site describes Kustomize as a "template-free way to customize application configuration". A team keeps a base of ordinary manifests and applies overlays and patches on top of it for each environment. Kustomize is built into `kubectl apply -k` and is integrated with Argo CD and Flux, and the site names Lyft as a KubeCon presenter on the approach and links the original whitepaper on declarative application management (https://kustomize.io/). The site is contributed by Replicated. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Abstraction model

The project encourages a fork, modify, and rebase workflow instead of parameterization. That means there is no custom API for users to fill in: the people who consume an overlay still read and reason about the underlying manifests. This is the opposite end of the spectrum from a Crossplane XRD or a kro ResourceGraphDefinition, which publish a new Kubernetes kind. Kustomize also runs only when invoked, so continuous correction has to come from a tool such as Flux or Argo CD. See [comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius](../comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius.md) and [findings/helm-values-and-kustomize-patches-leak-the-underlying-manifests-into-the-abstraction](../findings/helm-values-and-kustomize-patches-leak-the-underlying-manifests-into-the-abstraction.md).

## Helm inflation and KRM functions

Kustomize can inflate Helm charts. A GitHub design discussion shows maintainers proposing to move that built-in inflation toward KRM functions, and users objecting because KRM functions need a container runtime. Support for Helm v4 arrived in kustomize v5.8.1 and no deprecation date for the built-in path was set. See [findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack](../findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack.md) and [entities/kpt](kpt.md). [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

Kustomize also runs KRM functions as plugins. Containerized functions are the recommended style but alpha and need `--enable-alpha-plugins`, and exec functions need `--enable-alpha-plugins --enable-exec`, with the guide stating "Kustomize does not provide an execution sandbox of any kind". See [findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage](../findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage.md) and [examples/a-kustomize-exec-krm-function-runs-only-with-enable-alpha-plugins-and-enable-exec](../examples/a-kustomize-exec-krm-function-runs-only-with-enable-alpha-plugins-and-enable-exec.md). [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

## Related

[entities/helm](helm.md), [entities/kro](kro.md), [entities/flux](flux.md), [entities/argo-cd](argo-cd.md)
