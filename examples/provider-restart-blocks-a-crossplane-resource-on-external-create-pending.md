---
title: A provider restart blocks a Crossplane resource on external-create-pending
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [crossplane, idempotency, external-create-pending, provider-aws]
---

# A provider restart blocks a Crossplane resource on external-create-pending

## Scenario

Users of Crossplane issue 3037 report managed resources that stop reconciling after a provider restart. One report involves an SQS queue on provider-aws, and another involves a GCP resource. In the reported cases the provider restarted while a create was failing, for example because of IAM errors. [[sources/research-idempotency]]

## What happens

Within a single reconcile the provider writes `crossplane.io/external-create-pending` before it calls the cloud create API, and writes `external-create-succeeded` or `external-create-failed` afterward. When the provider restarts between those writes, the next reconcile finds the pending marker with no outcome. The managed resource is blocked and an event says "cannot determine creation result - remove the crossplane.io/external-create-pending annotation if it is safe to proceed." A person has to decide whether a cloud resource exists and then remove the annotation. [[sources/research-idempotency]]

## Why Crossplane stops

A maintainer explains that Crossplane originally looked the resource up by identifier on the next reconcile. Many cloud APIs return a generated ID, such as an AWS VPC ID, so if the response is lost the controller has no identifier to look up, and a second create could leak the first resource. Looking up by tags or labels needs per-resource code and fails where tagging is unsupported. The issue proposed documenting the behavior and letting resources with deterministic identifiers opt out, and it was closed as not planned. [[sources/research-idempotency]]

## Lesson

Failing safe protects against duplicates and leaked cost, but it does not scale because every ambiguity needs a human. See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]] and [[decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging]].

## Related

[[entities/crossplane]], [[concepts/managed-resource]], [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]]
