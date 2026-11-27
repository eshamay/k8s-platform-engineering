---
title: "Crossplane functions speak a gRPC RunFunction contract that differs from the KRM ResourceList over stdio"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [crossplane, krm-functions, grpc, composition-functions, comparison]
---

# Crossplane functions speak a gRPC RunFunction contract that differs from the KRM ResourceList over stdio

## Observation

Crossplane's contract is the protobuf service in `proto/fn/v1/run_function.proto`, `rpc RunFunction(RunFunctionRequest) returns (RunFunctionResponse) {}`. The request carries observed state, desired state, required resources, and schemas, and the function runs as a long-lived server. A KRM function instead reads a flat `items` list from stdin as YAML and exits. The alpha Crossplane design used a YAML `FunctionIO` document, and the beta design merged it into the protobuf message. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

## What it means

Crossplane composition functions share the name and the function-in-a-pipeline idea with KRM functions but not the wire contract, the process lifetime, or the container-per-invocation model. A KRM function cannot be dropped into a Crossplane pipeline without a wrapper. This also explains why Crossplane avoids the container-runtime problem on laptops: its functions run in the cluster. See [findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure](the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure.md) and [comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius](../comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius.md).

URL: https://github.com/crossplane/crossplane/blob/main/proto/fn/v1/run_function.proto

## Related

[entities/crossplane](../entities/crossplane.md), [entities/kpt](../entities/kpt.md), [concepts/composition](../concepts/composition.md)
