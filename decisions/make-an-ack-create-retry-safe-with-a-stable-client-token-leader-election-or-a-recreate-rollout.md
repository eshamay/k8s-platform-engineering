---
title: Make an ACK create retry-safe with a stable client token, leader election, or a Recreate rollout
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [decision, ack, client-token, leader-election, deployment-strategy, idempotency]
---

# Make an ACK create retry-safe with a stable client token, leader election, or a Recreate rollout

## Status

Open. The options come from the discussion in ACK issue 3122, and the dossier did not check whether any of the proposed changes merged, apart from runtime pull request 292. [[sources/research-gap-g1-leaked-resources-adoption]]

## Context

A restart during a Deployment rollout, with leader election off, produced a second `CreateVpcEndpoint` call in the CI run behind ACK issue 3122. EC2 created two endpoints, only one was recorded, and the orphan blocked teardown for about 2 hours. The audit in issue 3177 counts 48 resources in 22 controllers exposed to a lost create response. See [[examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours]].

## Options

- A stable `ClientToken` on each create call, so the cloud recognizes a retry, as EC2 does for `RunInstances` in [[examples/ec2-client-token-makes-a-retried-runinstances-call-safe]]. This removes the ambiguity at the source. Maintainer knottnt cautioned that a stable token can break re-creation after the resource is deleted out of band.
- Turn leader election on by default, so two pods never create at once. This is the maintainer's suggestion in the issue.
- Use the Recreate deployment strategy, so the old pod is gone before the new one starts. Also the maintainer's suggestion.
- Patch status immediately after Create, as ACK runtime pull request 292 (merged 2026-11-20) does. This narrows the window and leaves a gap between the AWS call and the patch.

## Consequences

Leader election and Recreate prevent the overlapping-pod case but do nothing for a crash between the create call and the status write. A token covers both but needs per-API care and a policy for token lifetime. The options are complementary and the dossier gives no ranking. See [[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]] and [[decisions/single-replica-versus-leader-election]].

## Related

[[entities/ack]], [[concepts/idempotency]], [[decisions/recover-from-an-ambiguous-create-by-halting-searching-or-tagging]]
