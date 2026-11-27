---
title: kpt and KRM functions
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: [kpt, KRM functions, Configuration as Data]
tags: [tool, render-time, krm-functions, configuration-as-data]
---

# kpt and KRM functions

kpt is a package-centric toolchain that treats configuration as data stored apart from live cluster state, and its KRM function model is the shared ancestor of several render-time extension mechanisms. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Configuration as Data

The kpt repository describes Configuration as Data as "an approach to management of configuration which makes configuration data the source of truth". Packages of Kubernetes objects are kept in a store, edited and validated by programs, and only later applied to a cluster. The project is a CNCF Sandbox project (https://github.com/kptdev/kpt). [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## KRM functions

A KRM function is a program that reads a list of Kubernetes objects and writes a list of Kubernetes objects. It can be written in any language. The KRM Functions Specification says "A function MUST be implemented as a container" that reads a `ResourceList` on stdin and writes one on stdout, exits non-zero on failure, and can run as the non-root user `nobody`, see [findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure](../findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure.md). The standard originated in kpt, was donated to Kubernetes SIG-CLI, and is decoupled from any in-cluster component, see [findings/the-krm-functions-spec-is-a-client-side-standard-decoupled-from-the-cluster-and-reserves-internal-annotations](../findings/the-krm-functions-spec-is-a-client-side-standard-decoupled-from-the-cluster-and-reserves-internal-annotations.md). kpt recommends, outside the spec, that functions be deterministic and idempotent, and its containers get no network or host filesystem by default, see [findings/kpt-containers-get-no-network-and-no-host-filesystem-by-default](../findings/kpt-containers-get-no-network-and-no-host-filesystem-by-default.md). kpt can also run `exec` functions behind `--allow-exec`, which its docs discourage, see [findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage](../findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage.md). Correction note: the earlier text called a KRM function idempotent as a definition, but idempotence is kpt guidance and not a spec rule. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md) The container requirement has a real cost, shown in [findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack](../findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack.md). Crossplane avoids that cost by running its functions in-cluster as gRPC services, and kro avoids it by evaluating CEL in process. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Related

[entities/kustomize](kustomize.md), [entities/crossplane](crossplane.md), [decisions/run-a-krm-function-as-a-container-or-as-an-exec-binary](../decisions/run-a-krm-function-as-a-container-or-as-an-exec-binary.md), [findings/crossplane-functions-speak-a-grpc-runfunction-contract-that-differs-from-the-krm-resourcelist-over-stdio](../findings/crossplane-functions-speak-a-grpc-runfunction-contract-that-differs-from-the-krm-resourcelist-over-stdio.md), [concepts/composition](../concepts/composition.md), [comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius](../comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius.md)
