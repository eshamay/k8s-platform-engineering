---
title: Custom Resource Definition (CRD)
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [CRD]
tags: [api-machinery]
---

# Custom Resource Definition (CRD)

## Definition

The mechanism for registering a new GVK with the Kubernetes API server. Registration grants native storage, RBAC, and validation without writing custom API server code. [[sources/krm-platform-vocabulary]]

## Why it matters

CRDs are the extension point that makes the [[concepts/universal-control-plane]] idea practical. Every [[concepts/provider]], [[concepts/composite-resource]], and operator in this wiki ships one or more CRDs. Large numbers of CRDs have scale costs on the API server, a pitfall to research.

## Related

[[concepts/gvk-and-gvr]], [[concepts/admission-webhooks-and-cel]], [[concepts/operator-pattern]]

## To research

OpenAPI schema validation, versioning and conversion webhooks, CRD count limits, and storage-version migrations.
