---
title: "kpt containers get no network and no host filesystem by default"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [kpt, krm-functions, sandboxing, containers]
---

# kpt containers get no network and no host filesystem by default

## Observation

The kpt documentation states that by default "the functions cannot access the network" and "the functions cannot access the host file system". A user opts in with `--network` and `--mount` on `kpt fn eval`. These defaults are kpt orchestrator behavior, and the KRM spec itself only says a function must be able to run as the non-root user `nobody` when it does not need the host filesystem. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

## What it means

The sandbox is a property of the container run, which is why exec functions lose it. The function-development page also shows the container requirement in practice: its quickstart needs Docker and Go 1.24 or later. See [findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage](kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage.md).

URL: https://github.com/kptdev/kpt/blob/main/documentation/content/en/book/04-using-functions/_index.md

## Related

[entities/kpt](../entities/kpt.md), [findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure](the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure.md)
