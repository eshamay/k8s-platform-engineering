---
title: Webhooks without sideEffects declared break dry-run clients
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, webhooks, dry-run, sideeffects, gitops]
---

# Webhooks without sideEffects declared break dry-run clients

## Observation

Flux and other server-side-apply or dry-run clients fail against admission webhooks that do not declare `sideEffects` of `None` or `NoneOnDryRun`. The failure message is "admission webhook does not support dry run", and Flux surfaces it as a reconciliation failure. The Kubernetes reference explains `sideEffects` (`None`, `NoneOnDryRun`, `Some`) and why dry-run requests need it, and the Flux cheatsheet says to find the offending Validating or Mutating webhook configuration and fix `sideEffects`. URL: https://fluxcd.io/flux/cheatsheets/troubleshooting/ and https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/. [[sources/research-admission-webhooks-and-cel]]

## Why it happens

A dry-run request must not persist anything, so the API server only sends it to webhooks that promise not to cause side effects when the request is a dry run. A webhook that cannot make that promise is skipped by refusing the request.

## Where the fix lives

The fix is on the webhook configuration, not in the GitOps tool. For an operator author, that means declaring `sideEffects` correctly as part of the webhook's contract. See [[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]].

## Related

[[concepts/admission-webhooks-and-cel]], [[entities/flux]], and [[findings/diff-is-not-apply-server-defaults-look-like-drift]].
