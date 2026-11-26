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
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
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

## Versions and discovery

A CRD can list several versions, exactly one of which is the storage version while any number can be served, and conversion is either `None` or a webhook. A CRD adds new kinds and resources to the existing API server, and it gives each Kind exactly one resource, unlike subresources such as `Scale`. The generated GVK and GVR become known to clients through API discovery, so a CRD installed at runtime can be invisible to a client whose mapper was built earlier. [[sources/research-gvk-and-gvr]] See [[concepts/crd-versioning-and-storage-migration]], [[concepts/api-discovery-and-restmapper]], [[findings/stale-restmapper-hides-newly-installed-crds]], and [[findings/crd-version-removal-without-migration-strands-stored-objects]].
