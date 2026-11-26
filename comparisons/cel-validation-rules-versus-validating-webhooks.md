---
title: CEL validation rules versus validating webhooks
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [crd, cel, webhooks, validation]
---

# CEL validation rules versus validating webhooks

## Summary

Both mechanisms reject invalid custom resources before they are persisted. CEL rules are declared inside the CRD schema and evaluated by the apiserver, while a validating webhook is an external service the apiserver calls. [[sources/research-custom-resource-definition]]

## Side by side

| Aspect | CEL rules in the CRD | Validating webhook |
|---|---|---|
| Where it runs | Inside the apiserver | In a separate service the apiserver calls |
| Extra infrastructure | None | A service, certificates, and a `caBundle` or equivalent |
| Failure mode | Rule is invalid or too costly, caught per rule | Service outage can block writes and disrupt the cluster |
| Cross-field checks | Yes, such as `self.minReplicas <= self.maxReplicas` | Yes, with arbitrary code |
| Cost control | Per-rule cost limits protect the apiserver | The webhook author must manage latency |
| Travels with the CRD | Yes | No, installed separately |

The CEL column comes from the validation rules announcement at https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/. The webhook failure column draws on the postmortem index at https://k8s.af/ and the conversion webhook issue at https://github.com/kubernetes/kubernetes/issues/110720, both of which are about webhooks generally and not strictly validating ones.

## Where webhooks still apply

The dossier does not claim CEL replaces every webhook. Logic that needs external data or arbitrary code still needs a webhook, and conversion between versions is a separate webhook type with no CEL equivalent in the sources. The dossier read only the start of the CEL announcement, so transition rules and feature-gate history are not compared here.

## Related

[[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], [[concepts/admission-webhooks-and-cel]], and [[findings/admission-webhook-outages-are-a-recurring-failure-class]].

## Additions from the admission dossier

The admission dossier adds the policy-object route between the two columns above: ValidatingAdmissionPolicy (stable since v1.30) runs CEL in the API server but is declared outside any one CRD, with a binding and optional parameter resource. It also adds the limits on the CEL side: no external data, bounded cost, and informational type checking. See [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]] and [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]]. [[sources/research-admission-webhooks-and-cel]]
