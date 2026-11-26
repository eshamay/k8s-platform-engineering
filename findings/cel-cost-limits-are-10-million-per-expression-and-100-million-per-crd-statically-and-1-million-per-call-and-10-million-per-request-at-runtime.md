---
title: "CEL cost limits are 10 million per expression and 100 million per CRD statically, and 1 million per call and 10 million per request at runtime"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [cel, limits, crd, validating-admission-policy, verified]
---

# CEL cost limits are 10 million per expression and 100 million per CRD statically, and 1 million per call and 10 million per request at runtime

## Observation

The numbers come from Kubernetes source on master, read on 2026-11-26 (latest release v1.37.3). In `staging/src/k8s.io/apiserver/pkg/apis/cel/config.go`, `PerCallLimit = 1000000` is the runtime limit for one expression call, described as "roughly 0.1 second for each expression validation call". `RuntimeCELCostBudget = 10000000` is the overall runtime budget per ValidatingAdmissionPolicyBinding or per custom resource, described as roughly one second. `RuntimeCELCostBudgetMatchConditions = 2500000` covers matchConditions, roughly a quarter second. `MaxRequestSizeBytes` is 3 MiB and is used as the worst-case size in estimates, and `MaxEvaluatedMessageExpressionSizeBytes` is 5 KiB. https://raw.githubusercontent.com/kubernetes/kubernetes/master/staging/src/k8s.io/apiserver/pkg/apis/cel/config.go [[sources/research-gap-m6-admission-crds]]

In `staging/src/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/validation/validation.go`, `StaticEstimatedCostLimit` is 10,000,000 for one expression and `StaticEstimatedCRDCostLimit = 100000000` is the total for all `x-kubernetes-validations` rules of one CRD. The per-expression check is suppressed when the schema is unchanged (`suppressPerExpressionCost`), so older CRDs are not broken when estimates tighten. https://raw.githubusercontent.com/kubernetes/kubernetes/master/staging/src/k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/validation/validation.go

## Why it matters

Schema authors now have the numbers that the earlier wiki pages said were missing. The static limits decide whether a CRD is accepted at creation, and the runtime limits decide whether a single request is denied while it is evaluated. See [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]].

## Limits of the evidence

The values are read from the default branch, not pinned to a release tag, so a given cluster version can differ. The Kubernetes documentation page itself gives no numbers.

## Related

[[concepts/admission-webhooks-and-cel]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], and [[findings/an-unbounded-list-or-string-makes-the-cel-cost-estimate-reject-a-crd-rule-until-maxitems-and-maxlength-are-set]].
