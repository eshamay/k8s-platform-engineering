---
title: "Run a KRM function as a container or as an exec binary"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [decision, krm-functions, kpt, kustomize, evidence-only]
---

# Run a KRM function as a container or as an exec binary

## Status

Draft. This records a decision point and the evidence for each option. It makes no recommendation, because the dossier did not measure portability or security outcomes in real pipelines. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

## Context

A team using kpt or Kustomize can package a function as a container image or run a local binary. The spec requires a container, and both tools offer exec as a non-spec extension. [findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure](../findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure.md)

## Options

**Option 1, container.** Evidence: it is the spec-conforming form. kpt gives containers no network and no host filesystem by default, and Kustomize calls containerized plugins "the recommended style" while noting alpha status. The cost is a container runtime on every machine that renders, which users objected to in the Kustomize Helm inflation thread. See [findings/kpt-containers-get-no-network-and-no-host-filesystem-by-default](../findings/kpt-containers-get-no-network-and-no-host-filesystem-by-default.md) and [findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack](../findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack.md).

**Option 2, exec binary.** Evidence: kpt needs `--allow-exec` and says binaries "can perform privileged operations in the system", and Kustomize needs `--enable-alpha-plugins --enable-exec` and offers no sandbox. Both docs discourage it for portability and security. It avoids the container runtime. See [findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage](../findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage.md).

## Consequences

Option 1 moves the cost to runtime availability and image distribution. Option 2 moves it to trust in the binary and to per-platform builds. Evidence on how often CI runners or Argo CD repo servers lack a runtime is absent, see [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[entities/kpt](../entities/kpt.md), [entities/kustomize](../entities/kustomize.md), [examples/a-kustomize-exec-krm-function-runs-only-with-enable-alpha-plugins-and-enable-exec](../examples/a-kustomize-exec-krm-function-runs-only-with-enable-alpha-plugins-and-enable-exec.md)
