---
title: Kyverno ValidatingPolicy versus native ValidatingAdmissionPolicy
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
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

The comparison is built from the Kyverno documentation and the Kubernetes tutorial. The dossier did not read Kyverno's pages on its webhook `failurePolicy` or availability, and read no primary Gatekeeper source, so it cannot compare failure behavior or other engines. See [[open-knowledge-gaps]].

## Related

[[entities/kyverno]], [[examples/kyverno-validatingpolicy-generates-native-vap-objects]], and [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].
