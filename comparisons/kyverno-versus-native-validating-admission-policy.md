---
title: Kyverno ValidatingPolicy versus native ValidatingAdmissionPolicy
type: comparison
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
tags: [kyverno, validating-admission-policy, policy-engines, comparison]
---

# Kyverno ValidatingPolicy versus native ValidatingAdmissionPolicy

## Summary

Kyverno's ValidatingPolicy is described as a superset of the Kubernetes ValidatingAdmissionPolicy, so the two are related and not rivals. The native object gives in-process enforcement with no extra service. Kyverno adds features around it and can generate native objects so the enforcement path runs in the API server. [[sources/research-admission-webhooks-and-cel]]

## Side by side

| Aspect | Native ValidatingAdmissionPolicy | Kyverno ValidatingPolicy |
|---|---|---|
| Enforcement path | In the API server | Kyverno's webhook, or generated native objects |
| Extra components | None | Kyverno installation |
| Background scanning of existing objects | No (new policies do not retroactively affect existing objects) | Yes |
| Exceptions and reports | Enforcement actions `Deny`, `Warn`, `Audit` | Policy exceptions and PolicyReports |
| CEL libraries | Standard admission variables | Extended CEL libraries and `messageExpressions` |
| Non-Kubernetes payloads | No | Evaluation mode for JSON such as Terraform plans |

## Notes

The comparison is built from the Kyverno documentation and the Kubernetes tutorial. The 2026-11-26 dossier read Kyverno's failure-policy and availability pages ([[findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability]]) and Gatekeeper's ([[findings/gatekeeper-defaults-its-webhooks-to-fail-open-and-documents-a-fail-closed-deadlock-with-an-emergency-delete-of-the-webhook-configuration]]). Kyverno's webhook mode defaults to Fail with a 10 second timeout and three admission replicas for HA, while Gatekeeper defaults to Ignore. No measured availability numbers or generated-native-policy resilience comparison were found, so the resilience benefit stays unquantified. See [[open-knowledge-gaps]].

## Related

[[entities/kyverno]], [[examples/kyverno-validatingpolicy-generates-native-vap-objects]], and [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].
