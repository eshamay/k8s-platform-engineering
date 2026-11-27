---
title: Validate with CEL rules or a validating webhook
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [decision, crd, cel, webhooks, validation]
---

# Validate with CEL rules or a validating webhook

## Status

Draft. This records a decision point described in Kubernetes documentation and blog posts, not a choice made by this wiki.

## Context

A CRD author needs validation that the base OpenAPI schema cannot express, such as a comparison between two fields. The author can embed CEL rules in the CRD, or run a validating admission webhook. The choice affects availability of the whole cluster, because a webhook sits on the write path. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md)

## Options

The first option is `x-kubernetes-validations` CEL rules, which need no service and are protected by per-rule cost limits. The second is a validating webhook, which allows arbitrary code at the price of running, securing, and keeping a service available. See [comparisons/cel-validation-rules-versus-validating-webhooks](../comparisons/cel-validation-rules-versus-validating-webhooks.md).

## Decision guidance

The dossier's synthesis is to use CEL where it can express the check, since that removes a failure point, and to reserve webhooks for logic that CEL cannot express. Webhook outages are documented as a recurring failure class, which raises the cost of choosing a webhook. URL: https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/.

## Consequences

CEL keeps validation inside the CRD, so it moves with the definition and avoids a new availability dependency. A webhook keeps flexibility but must be run highly available. Conversion between versions is a separate question covered in [decisions/conversion-webhook-versus-new-xrd-for-breaking-changes](conversion-webhook-versus-new-xrd-for-breaking-changes.md). See also [findings/admission-webhook-outages-are-a-recurring-failure-class](../findings/admission-webhook-outages-are-a-recurring-failure-class.md) and [examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks](../examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks.md).

## Additions from the admission dossier

The admission dossier supports the guidance above with KEP-3488, which frames CEL policy as an alternative for most validating use cases, and with the Kubernetes good-practices page, which recommends CEL-based policies where they suffice and webhooks only when external data, complex code, or side effects are needed. If a webhook is chosen, how it should fail is a second decision; see [decisions/failure-policy-fail-or-ignore-for-an-admission-webhook](failure-policy-fail-or-ignore-for-an-admission-webhook.md). See also [comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules](../comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules.md). [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md)

## Evidence from the admission and CRD dossier

The CRD CEL limits are 10,000,000 per expression and 100,000,000 per CRD statically ([findings/cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime](../findings/cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime.md)), and unbounded lists and strings are rejected until bounded ([findings/an-unbounded-list-or-string-makes-the-cel-cost-estimate-reject-a-crd-rule-until-maxitems-and-maxlength-are-set](../findings/an-unbounded-list-or-string-makes-the-cel-cost-estimate-reject-a-crd-rule-until-maxitems-and-maxlength-are-set.md)). Crossplane chose CEL over its own XRD and Composition webhooks ([findings/crossplane-core-ships-one-fail-closed-usage-webhook-and-replaced-its-xrd-and-composition-webhooks-with-cel](../findings/crossplane-core-ships-one-fail-closed-usage-webhook-and-replaced-its-xrd-and-composition-webhooks-with-cel.md)). No recommendation is made here. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)
