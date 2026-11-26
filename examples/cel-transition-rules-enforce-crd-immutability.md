---
title: CEL transition rules enforce immutability and append-only fields in a CRD
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [crd, cel, immutability, transition-rules]
---

# CEL transition rules enforce immutability and append-only fields in a CRD

## Scenario

A CRD author has fields that must not change after creation, such as an immutable region or storage class on a claim for a managed resource, and lists that may only grow. A plain OpenAPI schema cannot compare the new value with the old one, so this was a webhook job. [[sources/research-admission-webhooks-and-cel]]

## How it works

The Kubernetes immutability post shows three patterns using `x-kubernetes-validations`. The rule `self == oldSelf` makes a field immutable. The rule `self.all(x, x in oldSelf)` makes a list append-only. A map can be made key-immutable in the same way. Transition rules reference `oldSelf`, so they run only on updates where an old value exists and are skipped on create. URL: https://kubernetes.io/blog/2022/09/29/enforce-immutability-using-cel/.

## Lesson

Immutability is enforced by the apiserver with the CRD itself, so it travels with the definition and needs no service. The dossier presents the managed-resource immutable identifier as the typical use case and did not read a specific platform that ships such a rule, so the Crossplane and kro angle remains untested; see [[open-knowledge-gaps]]. Rule cost is bounded, so list-iterating rules need `maxItems` and `maxLength`; see [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]].

## Related

[[concepts/admission-webhooks-and-cel]], [[concepts/custom-resource-definition]], [[findings/immutable-fields-and-drift-collisions]], and [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]].
