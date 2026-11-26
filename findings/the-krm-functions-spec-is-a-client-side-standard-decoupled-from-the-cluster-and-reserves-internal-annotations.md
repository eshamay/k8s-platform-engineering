---
title: "The KRM functions spec is a client-side standard decoupled from the cluster and reserves internal annotations"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [krm-functions, spec, kpt, sig-cli]
---

# The KRM functions spec is a client-side standard decoupled from the cluster and reserves internal annotations

## Observation

The specification says it is "completely decoupled from Kubernetes API machinery and does not depend on any in-cluster components", so it describes how an orchestrator runs a function on files and not how a controller runs one in a cluster. The annotation prefix `internal.config.kubernetes.io` is reserved for internal annotations, and orchestrators use it to carry file path and index information that they add before a run and strip afterwards. [[sources/research-gap-o7-krm-functions]]

The kpt book (page last modified 2026-11-18) says the kpt project created the standard for inter-process communication between the orchestrator and the function, and that it was donated to the CNCF as part of Kubernetes SIG-CLI. kpt also recommends, outside the spec, that functions be deterministic, idempotent, hermetic, and unprivileged: "Executing a function with the same input should produce the same output." Those recommendations are kpt guidance and not spec requirements. [[sources/research-gap-o7-krm-functions]]

## What it means

Because the spec is client-side, Crossplane composition functions share the name and the pipeline idea but not the contract, see [[findings/crossplane-functions-speak-a-grpc-runfunction-contract-that-differs-from-the-krm-resourcelist-over-stdio]]. The earlier wiki phrase that a KRM function is "idempotent" describes the kpt recommendation and not a spec rule.

URLs: https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/cmd/config/docs/api-conventions/functions-spec.md and https://kpt.dev/book/05-developing-functions/

## Related

[[entities/kpt]], [[findings/the-krm-functions-spec-requires-a-container-with-a-resourcelist-on-stdin-and-stdout-and-a-non-zero-exit-on-failure]]
