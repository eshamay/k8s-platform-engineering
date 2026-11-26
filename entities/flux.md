---
title: Flux
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [Flux CD, FluxCD]
tags: [tool, gitops]
---

# Flux

A GitOps tool that runs in-cluster and pulls KRM manifests from Git, then applies them to the API server. The seed note uses it as the example of [[concepts/gitops-pull-based-delivery]] and of a co-manager that relies on [[concepts/server-side-apply-and-field-ownership]]. [[sources/krm-platform-vocabulary]]

## Related concepts

[[concepts/declarative-vs-imperative]], [[concepts/self-healing-and-drift-detection]], [[concepts/conditions]]

## To research

Component architecture, multi-tenancy, health checking, dependency ordering, scale behavior, and a ramp-up tutorial. See [[open-knowledge-gaps]] for the lifecycle trace.
