---
title: Flux reconciliation fails against a webhook that does not support dry-run
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [flux, webhooks, dry-run, sideeffects, gitops]
---

# Flux reconciliation fails against a webhook that does not support dry-run

## Scenario

A cluster runs a policy or defaulting webhook, and Flux's kustomize-controller reconciles manifests into it. Flux applies with a server-side dry-run first, so every apply passes through the webhook once as a dry-run request. The dossier presents this as a concrete case of GitOps meeting admission. [[sources/research-admission-webhooks-and-cel]]

## How it works

When the webhook's configuration does not declare `sideEffects` of `None` or `NoneOnDryRun`, the API server refuses to send it dry-run requests and the Flux apply fails with the message "admission webhook does not support dry run". The Flux troubleshooting cheatsheet tells users to find the offending ValidatingWebhookConfiguration or MutatingWebhookConfiguration and fix its `sideEffects` field. The Kubernetes reference explains the field semantics. URL: https://fluxcd.io/flux/cheatsheets/troubleshooting/ and https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/.

## Lesson

The fix is on the webhook configuration, not on the GitOps tool, which is why webhook authors need to treat `sideEffects` as part of their API contract. The same cheatsheet covers the default five-minute health-check timeout and the `disableWait` option, which are separate failure sources. See [[findings/webhooks-without-sideeffects-declared-break-dry-run-clients]].

## Related

[[entities/flux]], [[concepts/server-side-apply-and-field-ownership]], and [[concepts/admission-webhooks-and-cel]].
