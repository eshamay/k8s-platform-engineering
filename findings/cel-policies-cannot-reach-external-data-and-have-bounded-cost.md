---
title: CEL policies cannot reach external data and have bounded cost
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cel, limits, cost, validating-admission-policy]
---

# CEL policies cannot reach external data and have bounded cost

## Observation

CEL admission has limits that keep webhooks relevant. Rule cost is bounded to protect the API server, so a CRD schema with unbounded lists or strings can be rejected at creation and iterating rules need `maxItems` and `maxLength`. Type checking of ValidatingAdmissionPolicy is informational because of version skew. CEL policies cannot call external services, so checks that need outside data, such as registry lookups or signature verification, still need a webhook or an engine that provides it. A ValidatingAdmissionPolicy `failurePolicy` applies to evaluation errors, and `Deny` plus `Warn` together is disallowed. URL: https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/, https://www.kubernetes.dev/resources/keps/3488/, and https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/. [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md)

## Limits of the evidence

The exact cost-limit numbers are now recorded in [findings/cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime](cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime.md) (correction note 2026-11-26). The external-data claim is the dossier's synthesis of the KEP scope and the policy variables, not a quoted statement. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules](../comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules.md), [decisions/validate-with-cel-rules-or-a-validating-webhook](../decisions/validate-with-cel-rules-or-a-validating-webhook.md), and [concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md).
