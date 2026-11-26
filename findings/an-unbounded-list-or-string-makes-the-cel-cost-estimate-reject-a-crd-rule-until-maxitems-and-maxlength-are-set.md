---
title: "An unbounded list or string makes the CEL cost estimate reject a CRD rule until maxItems and maxLength are set"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [cel, crd, pitfall, limits, verified]
---

# An unbounded list or string makes the CEL cost estimate reject a CRD rule until maxItems and maxLength are set

## Observation

The Kubernetes CRD documentation says the estimator assumes the worst case when a list, map or string has no bound, so it is "considered best practice to put a limit via `maxItems`, `maxProperties`, and `maxLength`". The page's own example `self.all(x, x.contains('a string'))` on an unbounded array of strings is rejected: "the API server rejects this rule on validation budget grounds". With `maxItems` 25 and `maxLength` 10 the same rule is accepted. The estimate multiplies by how many times a rule runs, so nested lists multiply. https://raw.githubusercontent.com/kubernetes/website/main/content/en/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions.md, read 2026-11-26. [[sources/research-gap-m6-admission-crds]]

## Why it matters

Platform API authors who generate CRDs, such as XRD and ResourceGraphDefinition authors, hit this when they add iterating rules to schemas that have no bounds. The failure shows at CRD creation, not at request time. The numbers behind it are in [[findings/cel-cost-limits-are-10-million-per-expression-and-100-million-per-crd-statically-and-1-million-per-call-and-10-million-per-request-at-runtime]].

## Related

[[concepts/custom-resource-definition]], [[comparisons/cel-validation-rules-versus-validating-webhooks]], and [[concepts/admission-webhooks-and-cel]].
