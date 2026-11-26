---
title: Failure policy Fail or Ignore for an admission webhook
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [decision, webhooks, failure-policy, availability]
---

# Failure policy Fail or Ignore for an admission webhook

## Status

Draft. This records a decision point described in documentation and a vendor blog, not a choice made by this wiki.

## Context

Every admission webhook configuration must say what happens when the call fails or times out. The `v1` default is `Fail`, and `timeoutSeconds` defaults to 10 seconds. The choice trades enforcement against availability, because the API server blocks on the call. [[sources/research-admission-webhooks-and-cel]]

## Options

With `Fail`, a request is rejected if the webhook cannot answer, so a policy is never bypassed but an outage blocks every matching write. With `Ignore`, the request proceeds when the webhook fails, so the cluster stays writable but a check or a default may be skipped.

## Decision guidance

The vendor blog advises that security-critical validations should use `Fail` and nice-to-have mutations can use `Ignore`. The official good-practices page does not reduce it to one rule but lists the controls that make `Fail` safer: narrow match scoping, short timeouts, excluding system namespaces, and running the backend highly available behind a load balancer. Both agree on the mitigations. URL: https://oneuptime.com/blog/post/2026-02-09-webhook-failurepolicy-ha/view and https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/.

## Consequences

`Fail` raises the cost of a webhook outage, as in [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]], while `Ignore` weakens guarantees. Moving a check to an in-process CEL policy sidesteps the question for simple rules; see [[decisions/validate-with-cel-rules-or-a-validating-webhook]]. ValidatingAdmissionPolicy has its own `failurePolicy` that applies to evaluation errors.

## Related

[[concepts/admission-webhooks-and-cel]] and [[findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window]].
