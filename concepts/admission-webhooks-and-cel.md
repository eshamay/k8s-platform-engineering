---
title: Admission Webhooks and CEL
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
aliases: [Admission control, Common Expression Language]
tags: [api-machinery]
---

# Admission Webhooks and CEL

## Definition

Interception of API requests before they are persisted to etcd, either to mutate defaults or to validate rules. Validation is increasingly handled natively with CEL (Common Expression Language) rules embedded directly in a CRD schema instead of an external webhook. [[sources/krm-platform-vocabulary]]

## Why it matters

Webhooks add a network dependency to every write, and an unavailable webhook can block cluster operations. In-schema CEL removes that dependency for many validation needs, which matters for platform APIs published through [[concepts/custom-resource-definition]].

## Related

[[concepts/composite-resource]], [[concepts/spec-status-split]], [[concepts/gvk-and-gvr]]

## To research

ValidatingAdmissionPolicy, webhook failure policies, and how policy engines fit alongside CEL.

## Additions from the CRD dossier

CEL rules in `x-kubernetes-validations` let a CRD express cross-field validation without a webhook, with per-rule cost limits protecting the apiserver. The dossier also shows that webhook outages recur as a failure class and that a down conversion webhook can stall garbage collection. [[sources/research-custom-resource-definition]] See [[comparisons/cel-validation-rules-versus-validating-webhooks]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]], [[findings/admission-webhook-outages-are-a-recurring-failure-class]], and [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].
