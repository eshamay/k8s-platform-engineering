---
title: Spec vs Status Split
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: [Spec and status]
tags: [api-machinery]
---

# Spec vs Status Split

## Definition

The strict separation of ownership on a KRM object. Users and GitOps tools own `.spec`, which records intent. Controllers own `.status`, which records observed reality. The split is enforced through a `/status` subresource. [[sources/krm-platform-vocabulary]]

## Why it matters

The split prevents a GitOps tool that re-applies manifests from overwriting what a controller observed, and it gives the reconcile loop a clean input (spec) and output (status). See [[concepts/reconciliation-loop]] and [[concepts/conditions]].

## Related

[[concepts/declarative-vs-imperative]], [[concepts/server-side-apply-and-field-ownership]], [[concepts/custom-resource-definition]]

## To research

Subresource RBAC, the pitfalls of controllers that write spec, and how tools surface status to users.

## API conventions on spec and status

The Kubernetes API conventions state that the API distinguishes the specification of desired state (`spec`) from the status of objects at the current time (`status`). Status is written through the `/status` subresource, `generation` and `observedGeneration` show whether the controller has seen the latest spec, and `resourceVersion` conflicts return HTTP 409. The quote from the fetch tool is approximate. [[sources/research-custom-resource-definition]] See [[concepts/custom-resource-definition]].
