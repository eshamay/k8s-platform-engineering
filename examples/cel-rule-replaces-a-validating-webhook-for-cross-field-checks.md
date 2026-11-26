---
title: A CEL rule replaces a validating webhook for cross-field checks
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [crd, cel, validation, webhooks]
---

# A CEL rule replaces a validating webhook for cross-field checks

## Scenario

A CRD author wants to reject an object whose minimum replica count is larger than its maximum. A plain OpenAPI schema can check each field alone but cannot compare two fields, so before CEL the usual answer was a validating admission webhook. [[sources/research-custom-resource-definition]]

## How it works

The Kubernetes blog announcing beta validation rules uses exactly this check. The author adds an `x-kubernetes-validations` entry to the schema with a rule such as `self.minReplicas <= self.maxReplicas`, and the apiserver evaluates it on writes with no external service. URL: https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/. The blog states the goal as "Validation rules make it possible to declare how custom resources are validated using the Common Expression Language (CEL)."

## Lesson

The rule travels with the CRD, so there is no webhook to deploy, secure, or keep available, and the dossier reports that per-rule cost limits protect the apiserver from expensive expressions. The dossier read only the first part of the announcement, so transition rules and feature-gate history are not covered here. Validation ratcheting, covered on the CRD task page, lets stricter rules be added without invalidating objects that already exist. See [[comparisons/cel-validation-rules-versus-validating-webhooks]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], and [[concepts/admission-webhooks-and-cel]].
