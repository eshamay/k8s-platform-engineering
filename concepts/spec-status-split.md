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
