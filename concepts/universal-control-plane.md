---
title: Universal Control Plane
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [Kubernetes as a control plane]
tags: [architecture, principle]
---

# Universal Control Plane

## Definition

The idea of using the Kubernetes API server and etcd as a centralized database and orchestration engine for any infrastructure, such as cloud databases, DNS records, and SaaS configuration, instead of treating Kubernetes only as a container scheduler. [[sources/krm-platform-vocabulary]]

## Why it matters

Every platform tool in this wiki depends on this idea. Once an external thing is represented as a Kubernetes object, it inherits authentication, RBAC, audit, watch semantics, and a shared tooling ecosystem. See [[concepts/custom-resource-definition]] for how new resource types are registered and [[concepts/reconciliation-loop]] for how controllers keep the external world aligned.

## Related

[[concepts/declarative-vs-imperative]], [[entities/crossplane]], [[concepts/provider]]

## To research

Real-world adoption, limits of etcd as a general-purpose store, and critiques of using Kubernetes this way.
