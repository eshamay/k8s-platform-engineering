---
title: A provider restart blocks a Crossplane resource on external-create-pending
type: example
status: active
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
tags: [crossplane, idempotency, external-create-pending, provider-aws]
---

# A provider restart blocks a Crossplane resource on external-create-pending

## Scenario

Users of Crossplane issue 3037 report managed resources that stop reconciling after a provider restart. One report involves an SQS queue on provider-aws, and another involves a GCP resource. In the reported cases the provider restarted while a create was failing, for example because of IAM errors. [sources/research-idempotency](../sources/research-idempotency.md)

## What happens

Within a single reconcile the provider writes `crossplane.io/external-create-pending` before it calls the cloud create API, and writes `external-create-succeeded` or `external-create-failed` afterward. When the provider restarts between those writes, the next reconcile finds the pending marker with no outcome. The managed resource is blocked and an event says "cannot determine creation result - remove the crossplane.io/external-create-pending annotation if it is safe to proceed." A person has to decide whether a cloud resource exists and then remove the annotation. [sources/research-idempotency](../sources/research-idempotency.md)

## Why Crossplane stops

A maintainer explains that Crossplane originally looked the resource up by identifier on the next reconcile. Many cloud APIs return a generated ID, such as an AWS VPC ID, so if the response is lost the controller has no identifier to look up, and a second create could leak the first resource. Looking up by tags or labels needs per-resource code and fails where tagging is unsupported. The issue proposed documenting the behavior and letting resources with deterministic identifiers opt out, and it was closed as not planned. [sources/research-idempotency](../sources/research-idempotency.md)

## Lesson

Failing safe protects against duplicates and leaked cost, but it does not scale because every ambiguity needs a human. See [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](../findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md) and [decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging](../decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging.md).

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/managed-resource](../concepts/managed-resource.md), [findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource](../findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource.md)

## Update from the leaked-resources dossier

The 2026-11-26 dossier read issue 3037 again, with the maintainer's later comments, and corrects the "proposed" status of the opt-out. The maintainer (Nic Cope) said the pending marker "ensures that if creation was ambiguous that we stop and ask a human to intervene rather than potentially creating more infrastructure", and later listed three leak scenarios the annotations cover: cloud-generated names that cannot be stored, eventually consistent APIs reporting that a resource does not exist, and stale cache reads of the managed resource. The opt-out for deterministic identifiers did ship in crossplane-runtime as `WithDeterministicExternalName`, but an open upjet issue says upjet controllers do not set it, so deterministically named resources still wedge. See [findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error](../findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error.md) and [decisions/set-withdeterministicexternalname-for-resources-whose-names-the-user-chooses](../decisions/set-withdeterministicexternalname-for-resources-whose-names-the-user-chooses.md).

Correction note: the earlier text on this page says the issue proposed an opt-out and was closed as not planned. The dossier confirms the issue is closed and that the option now exists in the runtime, and it does not restate the "not planned" reason, so read that phrase as unconfirmed.

Reported triggers in the thread are a normal Deployment rollout of the provider after a create that was failing on IAM errors and a cluster upgrade that replaced all nodes (that second report was partly struck through by its author). The maintainer also said providers had no graceful shutdown handling for in-flight creates at the time. crossplane-runtime issue 340 (2022-07-14) shows provider-terraform leaving the annotation stuck when its pod is terminated mid-apply. A dated, named cost case is [examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days](provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days.md). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)
