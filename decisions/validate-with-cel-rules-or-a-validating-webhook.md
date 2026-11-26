---
title: Validate with CEL rules or a validating webhook
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [decision, crd, cel, webhooks, validation]
---

# Validate with CEL rules or a validating webhook

## Status

Draft. This records a decision point described in Kubernetes documentation and blog posts, not a choice made by this wiki.

## Context

A CRD author needs validation that the base OpenAPI schema cannot express, such as a comparison between two fields. The author can embed CEL rules in the CRD, or run a validating admission webhook. The choice affects availability of the whole cluster, because a webhook sits on the write path. [[sources/research-custom-resource-definition]]

## Options

The first option is `x-kubernetes-validations` CEL rules, which need no service and are protected by per-rule cost limits. The second is a validating webhook, which allows arbitrary code at the price of running, securing, and keeping a service available. See [[comparisons/cel-validation-rules-versus-validating-webhooks]].

## Decision guidance

The dossier's synthesis is to use CEL where it can express the check, since that removes a failure point, and to reserve webhooks for logic that CEL cannot express. Webhook outages are documented as a recurring failure class, which raises the cost of choosing a webhook. URL: https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/.

## Consequences

CEL keeps validation inside the CRD, so it moves with the definition and avoids a new availability dependency. A webhook keeps flexibility but must be run highly available. Conversion between versions is a separate question covered in [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]]. See also [[findings/admission-webhook-outages-are-a-recurring-failure-class]] and [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]].
