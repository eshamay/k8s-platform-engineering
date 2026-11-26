---
title: Admission mechanisms compared - webhooks, ValidatingAdmissionPolicy, MutatingAdmissionPolicy, and CRD rules
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [admission, webhooks, cel, comparison]
---

# Admission mechanisms compared - webhooks, ValidatingAdmissionPolicy, MutatingAdmissionPolicy, and CRD rules

## Summary

Four mechanisms let operators and authors extend admission. Webhooks are the general escape hatch, and the three CEL mechanisms cover declarative cases in-process. The dossier presents them as a division of labor, with the project docs steering authors to CEL when logic is simple enough. [[sources/research-admission-webhooks-and-cel]]

## Side by side

| Aspect | Admission webhook | ValidatingAdmissionPolicy | MutatingAdmissionPolicy | CRD validation rules |
|---|---|---|---|---|
| Runs | External HTTPS service | In the API server | In the API server | In the API server |
| Can mutate | Mutating kind only | No | Yes, `ApplyConfiguration` or `JSONPatch` | No |
| Can validate | Validating kind | Yes | No | Yes |
| Scope | Any resource matched by `rules` and selectors | Any resource, set by constraints and binding | Any resource, set by constraints and binding | One CRD's schema |
| Configuration split | One configuration object | Policy, binding, optional parameter resource | Policy, binding, optional parameter resource | Rules inside the schema |
| External data or code | Yes | No | No | No |
| Failure handling | `failurePolicy` (`Fail` default for `v1`), `timeoutSeconds` (10 s default) | `failurePolicy` for evaluation errors, `validationActions` | `failurePolicy`, `reinvocationPolicy` | Rule errors caught per rule |
| Status | Long established | Stable since v1.30 | Stable (GA) since v1.36, enabled by default | Beta in 1.25, per the announcement |

## What the sources say

The Kubernetes documentation says webhooks that must see the final object should be validating webhooks, and KEP-3488 positions ValidatingAdmissionPolicy as a replacement for most validating use cases but not for mutation or full webhook parity. CRD rules are the lightest option for a single CRD and travel with it, while a policy object applies cluster-wide through bindings. MutatingAdmissionPolicy targets sidecar injection and default labels without a webhook. See [[comparisons/cel-validation-rules-versus-validating-webhooks]] for the CRD-level view.

## Caveats

Mutating Admission Policy is GA and enabled by default from Kubernetes v1.36. The live docs page says "Stable since Kubernetes v1.36; enabled by default", CHANGELOG-1.36 records the promotion (PR 136039), and the gate table at tag v1.36.0 shows Alpha 1.32, Beta 1.34, and GA 1.36 with default true. The docs page also says it "was first available in the v1.30 release", which conflicts with the gate table, so cite the gate table for the alpha and beta versions. [[sources/research-gap-g3-k8s-and-controller-runtime]] See [[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]].

Correction note, 2026-11-26: this page previously said the status came from a digest and might still be beta. The primary sources confirm GA. Cost limits and type checking restrict CEL; see [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]]. Webhook availability is the main risk on the other side; see [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]].

## Related

[[concepts/admission-webhooks-and-cel]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], and [[comparisons/kyverno-versus-native-validating-admission-policy]].
