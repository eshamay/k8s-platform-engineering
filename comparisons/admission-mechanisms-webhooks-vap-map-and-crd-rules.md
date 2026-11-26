---
title: Admission mechanisms compared - webhooks, ValidatingAdmissionPolicy, MutatingAdmissionPolicy, and CRD rules
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
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

## Why the docs say v1.30

Correction note, 2026-11-26: the caveat above said the docs sentence "first available in the v1.30 release" conflicts with the gate table. It is explained by code. The `MutatingAdmissionPolicy` gate was registered as Alpha with default false in v1.30.0 (pull request 123425) as a placeholder with no API behind it, and the usable `v1alpha1` API arrived in v1.32, which is where the KEP and the v1.36.0 gate table start. Cite v1.32 as the first usable release and v1.36 for GA and default on. See [[findings/the-mutating-admission-policy-gate-was-registered-in-v1-30-as-an-inert-alpha-placeholder-and-the-usable-api-arrived-in-v1-32]]. [[sources/research-gap-b1-recheck-flux-k8s]]

## Additions from the admission and CRD dossier

CEL cost limits for CRD rules and policies are in [[findings/cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime]]. Per-tool webhook defaults are in [[comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno]]. [[sources/research-gap-m6-admission-crds]]
