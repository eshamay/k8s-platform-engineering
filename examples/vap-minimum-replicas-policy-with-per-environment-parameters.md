---
title: A ValidatingAdmissionPolicy enforces a minimum replica count with per-environment parameters
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [validating-admission-policy, cel, guardrails, parameters]
---

# A ValidatingAdmissionPolicy enforces a minimum replica count with per-environment parameters

## Scenario

A platform team wants every Deployment to run at least a minimum number of replicas, and wants different minimums for different environments without copying the policy. Before in-process CEL policies, this kind of guardrail was usually a validating webhook, with its own service and certificates. [[sources/research-admission-webhooks-and-cel]]

## How it works

The Kubernetes tutorial creates a ValidatingAdmissionPolicy that requires Deployments to have at least two replicas, then binds it to a scope and tries the three enforcement actions: `Audit`, `Warn`, and `Deny`. The VAP reference shows replica-limit policies whose limit comes from a parameter resource named by `paramKind` and `paramRef`, so each binding can point at a different parameter object. URL: https://kubernetes.io/docs/tutorials/cluster-management/admission-policies/ and https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/.

This mirrors a division of labor that platform teams already have. The rule author writes the policy once, and the cluster operator writes bindings and parameter objects per environment. The reference also states that `Deny` and `Warn` may not be used together on one binding, because the combination duplicates the failure.

## Lesson

The guardrail runs inside the API server, so there is no webhook to keep available. The tutorial notes that a new policy does not retroactively affect existing objects, so a team adopting a guardrail may want to start with `Audit` or `Warn` to see what would fail. Checks that need data outside the request still need a webhook; see [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]].

## Related

[[concepts/admission-webhooks-and-cel]], [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]], and [[decisions/validate-with-cel-rules-or-a-validating-webhook]].
