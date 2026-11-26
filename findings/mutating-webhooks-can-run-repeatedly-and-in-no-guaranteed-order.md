---
title: Mutating webhooks can run repeatedly and in no guaranteed order
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, webhooks, mutation, idempotency]
---

# Mutating webhooks can run repeatedly and in no guaranteed order

## Observation

A mutating webhook can be invoked more than once for the same request, ordering between webhooks is not guaranteed, and a webhook can loop on its own changes or on another webhook's. The Kubernetes good-practices page recommends idempotent mutation, minimal patches, merging rather than overwriting arrays, avoiding self-triggering and dependency loops between webhooks, and validating the final state in a validating stage. Reinvocation is opt-in through `reinvocationPolicy: IfNeeded`. URL: https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/ and https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/. Quote: "Ensure that the mutating webhooks in your cluster are idempotent". [[sources/research-admission-webhooks-and-cel]]

## Why it matters for platforms

Mutation hides writers from the person who applied the object. When a webhook rewrites fields that a controller or a GitOps tool also sets, the two can fight, as in [[findings/controllers-fighting-over-fields-cause-revert-loops]]. Order dependence also means a policy that must see the final object belongs in a validating webhook; the reference says webhooks that need the final state should be validating. A source walkthrough adds that mutating webhooks run serially and validating webhooks in parallel.

## Related

[[concepts/admission-webhooks-and-cel]], [[concepts/idempotency]], and [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].
