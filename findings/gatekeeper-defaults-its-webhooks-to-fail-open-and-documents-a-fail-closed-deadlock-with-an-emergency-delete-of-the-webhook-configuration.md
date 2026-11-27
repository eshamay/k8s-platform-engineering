---
title: "Gatekeeper defaults its webhooks to fail open and documents a fail-closed deadlock with an emergency delete of the webhook configuration"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [gatekeeper, webhooks, failure-policy, availability, verified]
---

# Gatekeeper defaults its webhooks to fail open and documents a fail-closed deadlock with an emergency delete of the webhook configuration

## Observation

Gatekeeper's Helm values (v3.23.1 era, read 2026-11-26) set `validatingWebhookFailurePolicy: Ignore` and the mutating equivalent to Ignore, with a 3 second validating timeout, a 1 second mutating timeout and 3 replicas. The `failing-closed` doc states: "Gatekeeper is defaulting to using `failurePolicy: Ignore` for admission request webhook errors." It describes an admission deadlock risk when failing closed and says this "can normally be mitigated by deleting the `ValidatingWebhookConfiguration`". Gatekeeper keeps a separate check-ignore webhook at Fail, excludes namespaces labeled `admission.gatekeeper.sh/ignore`, and its Config resource supports `excludedNamespaces` per process, where "`webhook` process exclusion will exclude resources from specified namespace(s) from the admission webhook." The audit process is the backstop for requests that passed while the webhook failed open. https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/charts/gatekeeper/values.yaml, https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/website/docs/failing-closed.md and https://raw.githubusercontent.com/open-policy-agent/gatekeeper/master/website/docs/exempt-namespaces.md [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

Gatekeeper integrates with ValidatingAdmissionPolicy: the docs state "Feature State: Gatekeeper version v3.18 (stable)" for the integration, with VAP management beta from v3.20 per its doc.

## Why it matters

Gatekeeper is the opposite default from Kyverno and from most operator-shipped webhooks. See [comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno](../comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno.md). The choice itself stays a user decision, recorded as options in [decisions/failure-policy-fail-or-ignore-for-an-admission-webhook](../decisions/failure-policy-fail-or-ignore-for-an-admission-webhook.md).

## Related

[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them](fail-closed-webhooks-can-block-the-writes-needed-to-repair-them.md) and [concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md).
