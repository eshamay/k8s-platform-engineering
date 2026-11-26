---
title: Set WithDeterministicExternalName for resources whose names the user chooses
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [decision, crossplane, crossplane-runtime, external-create-pending, idempotency]
---

# Set WithDeterministicExternalName for resources whose names the user chooses

## Status

Open for each provider. The option exists in crossplane-runtime main, and provider-upjet-aws does not yet set it according to an open issue. This page records the trade-off and is not a ruling. [[sources/research-gap-g1-leaked-resources-adoption]]

## Context

Crossplane writes `external-create-pending` before a create and halts when it later finds the marker with no outcome. The guard covers three leak scenarios the maintainer named: cloud-generated names that cannot be stored, eventually consistent APIs reporting that a resource does not exist, and stale cache reads of the managed resource. For a resource whose name the user chooses, the first scenario does not apply, and the halt is only an inconvenience. See [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]].

## Options

- Leave the option false, which is the default. The reconciler stops with "cannot determine creation result" after any incomplete create. It is safe against all three scenarios and needs a human after every transient error.
- Set `WithDeterministicExternalName(true)`. The reconciler skips the safeguard and re-queues the create, because the name identifies the resource. This removes the human step for resources like S3 bucket sub-resources and IAM Policy, but it also drops the protection against eventually consistent reads and stale cache reads.

## Consequences

The first option is what upjet providers do today, and issue 2251 reports about 500 managed resources wedged after a dropped API connection. The second option relies on the cloud API's rejection of a duplicate name, as the 409 in [[examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days]] shows, so a retry of a deterministically named create fails closed. The dossier read the runtime source but not the upjet template.

## Related

[[findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error]], [[decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging]], [[decisions/external-name-annotation-or-spec-field]], [[entities/crossplane]]
