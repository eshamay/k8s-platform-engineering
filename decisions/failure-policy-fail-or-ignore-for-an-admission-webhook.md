---
title: Failure policy Fail or Ignore for an admission webhook
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-g1-named-incident-reports
    hash: 3c7df7bb12f1
    ingested: 2026-11-26
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [decision, webhooks, failure-policy, availability]
---

# Failure policy Fail or Ignore for an admission webhook

## Status

Active as an evidence record. It lays out options with source evidence and makes no recommendation, and the choice is not made by this wiki.

## Context

Every admission webhook configuration must say what happens when the call fails or times out. The `v1` default is `Fail`, and `timeoutSeconds` defaults to 10 seconds. The choice trades enforcement against availability, because the API server blocks on the call. [[sources/research-admission-webhooks-and-cel]]

## Options

With `Fail`, a request is rejected if the webhook cannot answer, so a policy is never bypassed but an outage blocks every matching write. With `Ignore`, the request proceeds when the webhook fails, so the cluster stays writable but a check or a default may be skipped.

## Decision guidance

The vendor blog advises that security-critical validations should use `Fail` and nice-to-have mutations can use `Ignore`. The official good-practices page does not reduce it to one rule but lists the controls that make `Fail` safer: narrow match scoping, short timeouts, excluding system namespaces, and running the backend highly available behind a load balancer. Both agree on the mitigations. URL: https://oneuptime.com/blog/post/2026-02-09-webhook-failurepolicy-ha/view and https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/.

## Consequences

`Fail` raises the cost of a webhook outage, as in [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]], while `Ignore` weakens guarantees. Moving a check to an in-process CEL policy sidesteps the question for simple rules; see [[decisions/validate-with-cel-rules-or-a-validating-webhook]]. ValidatingAdmissionPolicy has its own `failurePolicy` that applies to evaluation errors.

## Evidence from the Jetstack incident

Jetstack's 2019 post is a primary example of the `Fail` deadlock and of the scoping mitigation. It limited the webhook to namespaces where policy applies, enabled it only for Ingress and Service resources, and added a livenessProbe to OPA. It did not change the failure policy, and the post-level evidence says nothing about `Ignore`. See [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]]. [[sources/research-gap-g1-outage-postmortems]]

## Related

[[concepts/admission-webhooks-and-cel]] and [[findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window]].

## Correction note from the named-incident dossier

A second read confirmed that Jetstack's post never mentions `failurePolicy`. The evidence above is about scoping and probes only, and no `failurePolicy` recommendation should be cited to Jetstack. [[sources/research-gap-g1-named-incident-reports]]

## Evidence from tool defaults, 2026-11-26

The options are visible in what tools ship. Fail-open: Gatekeeper's default (Ignore, with an audit backstop) and Kyverno's catch-all fallback when auto-update is disabled. Fail-closed: Cluster API, Config Connector, the Crossplane Usage webhook and Kyverno's default. Each side has a documented cost. Fail-closed needs the self-exclusion and replica measures in [[findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded]] and a deadlock exit (delete the webhook configuration), and Crossplane exposes Ignore for managed Kubernetes services that reject Fail with wildcard rules. Fail-open skips checks while the webhook is down, which Gatekeeper's docs address through audit. The full table is in [[comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno]]. [[sources/research-gap-m6-admission-crds]]
