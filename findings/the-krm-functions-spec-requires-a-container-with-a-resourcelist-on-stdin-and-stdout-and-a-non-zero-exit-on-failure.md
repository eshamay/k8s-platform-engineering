---
title: "The KRM functions spec requires a container with a ResourceList on stdin and stdout and a non-zero exit on failure"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [krm-functions, spec, containers, resourcelist]
---

# The KRM functions spec requires a container with a ResourceList on stdin and stdout and a non-zero exit on failure

## Observation

The KRM Functions Specification in kubernetes-sigs/kustomize (master branch, spec `apiVersion: v1`, read 2026-11-26) states the contract in normative terms. "A function MUST be implemented as a container." A function must accept input on stdin and write a Kubernetes object of kind `ResourceList` to stdout, and the spec text is "A function MUST accept input from `stdin` and MUST output to `stdout` a Kubernetes object of kind `ResourceList`". The `ResourceList` uses `config.kubernetes.io/v1` or `v1beta1`. Its `items` array is the only required property, `functionConfig` is an optional input object ("an optional Kubernetes object for passing arguments to a function invocation"), and `results` is an optional output. [[sources/research-gap-o7-krm-functions]]

The spec adds four more requirements. YAML is mandatory: "A function MUST support YAML as a serialization format for the input and output." Errors go to stderr as non-structured text, and "A non-zero exit code indicates a failure." A function container "MUST be capable of running as a non-root user `nobody` if it does not require access to host filesystem." A function may create, update, or delete any number of items. [[sources/research-gap-o7-krm-functions]]

## What it means

The container requirement is a MUST in the specification itself, so a runtime that skips containers is using an extension, not the standard, see [[findings/kpt-and-kustomize-run-functions-without-containers-only-through-opt-in-exec-extensions-that-both-docs-discourage]]. This is the root of the laptop and CI cost described in [[findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack]]. The wire contract also differs from Crossplane's, see [[findings/crossplane-functions-speak-a-grpc-runfunction-contract-that-differs-from-the-krm-resourcelist-over-stdio]].

Source URL: https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/cmd/config/docs/api-conventions/functions-spec.md

## Related

[[entities/kpt]], [[entities/kustomize]], [[findings/the-krm-functions-spec-is-a-client-side-standard-decoupled-from-the-cluster-and-reserves-internal-annotations]]
