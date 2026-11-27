---
title: An ambiguous create result halts reconciliation until a human intervenes
type: finding
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
aliases: [Ambiguous create]
tags: [pitfall, crossplane, idempotency, external-resources, create-pending]
---

# An ambiguous create result halts reconciliation until a human intervenes

## Observation

If a controller crashes after calling a cloud create API but before recording the returned ID, the next reconcile cannot tell whether the resource exists. A naive retry creates a duplicate and leaks the first resource. Crossplane writes `external-create-pending` before the call and refuses to continue when the outcome is unknown, so the managed resource is blocked with an event that tells the operator to remove the annotation if it is safe to proceed. The reporters on Crossplane issue 3037 hit this after provider restarts, and the issue was closed as not planned. [sources/research-idempotency](../sources/research-idempotency.md)

## Why it happens

Many cloud APIs generate the identifier, as an AWS VPC does, so the controller has nothing deterministic to look up after a lost response. Lookup by tags or labels needs per-resource code and fails when the resource type cannot be tagged. The maintainer's proposed mitigations were to document the behavior and to let resources with deterministic identifiers opt out. [sources/research-idempotency](../sources/research-idempotency.md)

## Interpretation

The behavior is safe but does not scale, as the issue reporter noted: each ambiguity costs a human decision. SAP's provider narrows the problem with a bounded semantic lookup, and ACK and Config Connector avoid it for resources with caller-chosen names or IDs by acquiring what exists. A client token on the API side removes the ambiguity at the source. The dossier found no general solution. [sources/research-idempotency](../sources/research-idempotency.md) See [comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector](../comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector.md).

## Mitigations

Prefer APIs and resource types with caller-chosen names or client tokens, record intent before acting, keep a bounded recovery path for resource types that have a business key, and alert on managed resources stuck behind the pending marker. See [decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging](../decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging.md) and [examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending](../examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending.md).

## Related

[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource](a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource.md), [concepts/idempotency](../concepts/idempotency.md), [entities/crossplane](../entities/crossplane.md), [concepts/managed-resource](../concepts/managed-resource.md)

## Update from the leaked-resources dossier

The dossier adds dated incidents and corrects one open question. The Crossplane opt-out for deterministic identifiers shipped as `WithDeterministicExternalName` in crossplane-runtime, but upjet-based providers do not set it ([findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error](provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error.md)). A lost external name after a provider restart turned into a 409 retry loop that the reporter put at about $155 over 15 days ([examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days](../examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days.md)). In ACK a lost create response duplicates the resource or wedges the custom resource for 48 resources in 22 controllers by one audit ([findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource](an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource.md)), and a CI run created a second VPC endpoint ([examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours](../examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours.md)). No named postmortem or conference talk exists ([findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import](no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import.md)). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)
