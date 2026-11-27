---
title: Kyverno
type: entity
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
tags: [policy-engine, admission, cel, cncf]
---

# Kyverno

## What it is

Kyverno is a CNCF project and Kubernetes policy engine. It started as a webhook-based engine and now offers CEL-based policy types, the first documented in the dossier being ValidatingPolicy, described as a superset of the Kubernetes ValidatingAdmissionPolicy. [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md)

## What the dossier establishes

ValidatingPolicy adds background scanning, policy exceptions, extended CEL libraries, PolicyReports, `messageExpressions`, and an evaluation mode for non-Kubernetes JSON payloads such as Terraform plans. A ValidatingPolicy can generate native ValidatingAdmissionPolicy objects so enforcement runs in the API server rather than in Kyverno's webhook. URL: https://kyverno.io/docs/policy-types/validating-policy/. See [examples/kyverno-validatingpolicy-generates-native-vap-objects](../examples/kyverno-validatingpolicy-generates-native-vap-objects.md) and [comparisons/kyverno-versus-native-validating-admission-policy](../comparisons/kyverno-versus-native-validating-admission-policy.md).

## Failure modes and availability

Policy webhooks default to failure policy Fail with a 10 second timeout, the Kyverno and kube-system namespaces are excluded by default, and three admission replicas are the HA minimum ([findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability](../findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability.md)). With all pods down and fail-closed policies on Pods, requests time out unless the Kyverno namespace is excluded ([findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded](../findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded.md)). No measured availability numbers were found. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Related

[concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md)
