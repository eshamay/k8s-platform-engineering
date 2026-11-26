---
title: "Kyverno defaults to failure policy Fail with a 10 second timeout and needs three admission replicas for high availability"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [kyverno, webhooks, failure-policy, availability, verified]
---

# Kyverno defaults to failure policy Fail with a 10 second timeout and needs three admission replicas for high availability

## Observation

Kyverno's website documentation (main, read 2026-11-26; latest release v1.20.0, published 2026-11-12) says the failure policy controls what happens when a request times out or errors: "The default of `Fail` rejects the request; `Ignore` allows it despite the error." It is set per policy with `spec.failurePolicy`. The webhook timeout is set per policy with `spec.webhookConfiguration.timeoutSeconds`; "The default is `10` seconds, and the allowed range is `1` to `30` seconds." The option `forceFailurePolicyIgnore` defaults to false. Webhooks are generated dynamically from installed policies, and with `autoUpdateWebhooks` disabled Kyverno creates catch-all webhooks "with `FailurePolicy` set to `Ignore`". "The Kyverno and `kube-system` Namespaces are excluded by default." https://raw.githubusercontent.com/kyverno/website/main/src/content/docs/docs/installation/customization.md and https://raw.githubusercontent.com/kyverno/website/main/src/content/docs/docs/policy-types/validating-policy.mdx [[sources/research-gap-m6-admission-crds]]

The high-availability guide says the admission controller does not use leader election for requests and "The minimum supported replica count for a highly-available admission controller deployment is three." The troubleshooting page warns that wildcard-matching policies send every action on every resource to Kyverno, so "expect the resources needed by Kyverno to easily double, triple, or more." https://raw.githubusercontent.com/kyverno/website/main/src/content/docs/docs/guides/high-availability.md

## Limits of the evidence

No measured availability numbers were found, and no page read compares the resilience of Kyverno-generated native ValidatingAdmissionPolicy objects with webhook mode. Both stay UNVERIFIED, so the resilience benefit in [[comparisons/kyverno-versus-native-validating-admission-policy]] remains unquantified.

## Related

[[entities/kyverno]], [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]], and [[findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded]].
