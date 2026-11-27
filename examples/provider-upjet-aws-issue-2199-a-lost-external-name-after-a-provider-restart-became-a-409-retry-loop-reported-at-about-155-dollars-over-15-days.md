---
title: provider-upjet-aws issue 2199 a lost external name after a provider restart became a 409 retry loop reported at about 155 dollars over 15 days
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [provider-upjet-aws issue 2199]
tags: [crossplane, upjet, provider-aws, external-name, retry-loop, cost, idempotency]
---

# provider-upjet-aws issue 2199 a lost external name after a provider restart became a 409 retry loop reported at about 155 dollars over 15 days

## Scenario

On 2026-08-18 a user opened issue 2199 on provider-upjet-aws, which was still open when the dossier read it. The report concerns a PodIdentityAssociation, which the provider creates asynchronously over a window of about 30 to 60 seconds. [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md) URL: https://github.com/crossplane-contrib/provider-upjet-aws/issues/2199

## What happened

A provider-aws-eks restart landed inside that create window, and the external name was lost. On the next reconcile the provider attempted a create again and the cloud answered `409 ResourceInUseException`, because the first create had in fact succeeded. The provider then retried about 3 to 4 times per minute. The 409 stopped a duplicate from being created, so this is a stuck retry loop and not a duplicate resource.

## Reported cost

The reporter says each stuck resource cost about $12 per day in GuardDuty analysis of the CloudTrail management events, and describes "a 15-day, $155 anomaly across 7 stuck PIAs on two clusters". These figures are the reporter's own estimate and were not independently confirmed, so they are SECONDARY-ONLY. A commenter reported the same behavior for a Kafka VPCConnection.

## Why it belongs here

It is a dated, named-reporter case of the hazard that [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](../findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md) describes, and it shows a cost that comes from the retries and not from a leaked resource. It sits beside [examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending](provider-restart-blocks-a-crossplane-resource-on-external-create-pending.md), where the guard stops the resource instead of looping.

## Related

[entities/crossplane](../entities/crossplane.md), [entities/upjet](../entities/upjet.md), [findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error](../findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error.md)
