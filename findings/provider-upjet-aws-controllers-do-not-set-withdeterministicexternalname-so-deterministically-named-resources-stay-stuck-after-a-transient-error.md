---
title: provider-upjet-aws controllers do not set WithDeterministicExternalName so deterministically named resources stay stuck after a transient error
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [WithDeterministicExternalName]
tags: [crossplane, crossplane-runtime, upjet, provider-aws, external-create-pending, idempotency]
---

# provider-upjet-aws controllers do not set WithDeterministicExternalName so deterministically named resources stay stuck after a transient error

## Observation

The opt-out that Crossplane maintainers proposed in issue 3037 for resources with deterministic identifiers did ship in the runtime. crossplane-runtime main has `WithDeterministicExternalName(b bool)`. When it is false the managed reconciler stops with "cannot determine creation result" after an incomplete create, and when it is true the safeguard is skipped, because "it is safe to re-queue a deterministically named resource." The dossier read the source file on 2026-11-26, and the latest crossplane-runtime release it listed was v2.4.4 (2026-11-24). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

## What is not complete

provider-upjet-aws issue 2251 (2026-09-25, open) reports "Controllers don't set WithDeterministicExternalName", so resources with deterministic names, such as S3 bucket sub-resources and IAM Policy, still wedge. The trigger was a dropped HTTP/2 connection to the Kubernetes API server under load, with about 500 S3 and IAM managed resources across 10 environments created in parallel (self-reported), which lost the response of the pending-annotation update. The claim rests on the reporter's text, because the upjet controller template was not read directly. URL: https://github.com/crossplane-contrib/provider-upjet-aws/issues/2251

## Other ways the guard sticks

crossplane-runtime issue 340 (2022-07-14) shows that provider-terraform can leave the pending annotation stuck if its pod is terminated during a multi-minute `terraform apply`, because the update that records the failure fails on a cancelled context. In issue 3037 the maintainer said providers had no graceful shutdown handling for in-flight creates at that time. See [examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending](../examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending.md).

## Interpretation

The runtime offers the opt-out, but each provider must adopt it, so provider adoption is not complete as of the issue date. Operators of upjet-based providers should expect to remove the annotation by hand for deterministically named resources after a transient error. See [decisions/set-withdeterministicexternalname-for-resources-whose-names-the-user-chooses](../decisions/set-withdeterministicexternalname-for-resources-whose-names-the-user-chooses.md) and [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md).

## Related

[entities/crossplane](../entities/crossplane.md), [entities/upjet](../entities/upjet.md), [examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days](../examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days.md)
