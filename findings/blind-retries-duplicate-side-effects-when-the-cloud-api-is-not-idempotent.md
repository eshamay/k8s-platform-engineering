---
title: Blind retries duplicate side effects when the cloud API is not idempotent
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [pitfall, retries, aws, idempotency, client-token]
---

# Blind retries duplicate side effects when the cloud API is not idempotent

## Observation

Retries fix transient faults but can duplicate side effects, such as launching two EC2 instances when the first request succeeded and only its response was lost. The AWS Builders' Library says a retry is safe only when the target API is idempotent, meaning a request can be retransmitted or retried with no additional side effects. Controllers that retry with exponential backoff, as controller-runtime does on error and Argo CD does with sync retry, therefore depend on the idempotency of what they call. [[sources/research-idempotency]]

## Why simple fixes fail

Hash-based duplicate detection is rejected, because two identical requests might be intentional. Returning "already exists" on a retry changes the caller's control flow, so the article prefers a semantically equivalent response. The preferred contract stores a caller-supplied token and the mutation together in one atomic operation. [[sources/research-idempotency]] See [[examples/ec2-client-token-makes-a-retried-runinstances-call-safe]].

## Load side

Many objects sharing one interval can spike API load. Flux offers optional jitter and a separate `retryInterval`, and Argo CD caps backoff with `maxDuration`, but caps and jitter address load, not duplicate side effects. See [[findings/retry-storms-and-unbounded-retries]] and [[comparisons/retry-and-backoff-controls-across-tools]]. [[sources/research-idempotency]]

## Mitigations

Choose APIs with client tokens or caller-chosen identifiers, record intent before a non-idempotent call, and treat unknown results as a state that needs handling. See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]].

## Related

[[concepts/idempotency]], [[findings/failure-retry-loops-and-backoff]]

## Further evidence from the leaked-resources dossier

Config Connector issue 648 shows a cloud API that created an alert policy even when the create returned HTTP 400, so each retry added a policy ([[examples/config-connector-issue-648-an-alert-policy-was-created-on-every-reconcile-although-the-create-returned-http-400]]). Route 53 allows two public hosted zones with the same name, so a second controller with empty status duplicated every zone ([[examples/ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name]]). [[sources/research-gap-g1-leaked-resources-adoption]]
