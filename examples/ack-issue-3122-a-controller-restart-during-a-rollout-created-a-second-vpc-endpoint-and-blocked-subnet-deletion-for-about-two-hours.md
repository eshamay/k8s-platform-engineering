---
title: ACK issue 3122 a controller restart during a rollout created a second VPC endpoint and blocked subnet deletion for about two hours
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [ACK issue 3122]
tags: [ack, ec2-controller, duplicate-resource, client-token, leader-election, idempotency]
---

# ACK issue 3122 a controller restart during a rollout created a second VPC endpoint and blocked subnet deletion for about two hours

## Scenario

On 2026-10-31 sapphirew opened ACK community issue 3122 about a CI run for ec2-controller pull request 398, a build dated 2026-10-30. The controller was updated by a Deployment rollout (RollingUpdate) with leader election disabled. [[sources/research-gap-g1-leaked-resources-adoption]] URL: https://github.com/aws-controllers-k8s/community/issues/3122

## What happened

The restart coincided with a second `CreateVpcEndpoint` call. EC2 made two endpoints and only one was recorded in the custom resource. The orphaned endpoint blocked subnet deletion, so bootstrap teardown "spent about 2 hours retrying `DeleteSubnet ... DependencyViolation`" until the orphan was deleted by hand. The issue gives the root cause as the absence of a stable `ClientToken` on the create call.

## What is inferred

The issue says the old pod's create cannot be seen directly, because Prow keeps only the surviving pod's logs. The overlapping-pod explanation is therefore inferred, and an SDK retry of the token-less call would leave the same evidence.

## Maintainer response

Maintainer knottnt cautioned on 2026-11-03 that a stable token can break re-creation after an out-of-band deletion, and suggested turning leader election on by default and using the Recreate deployment strategy. See [[decisions/make-an-ack-create-retry-safe-with-a-stable-client-token-leader-election-or-a-recreate-rollout]].

## Why it belongs here

It is the best timestamped reproduction in the dossier of a duplicate cloud resource from a lost create result, and the figures are the issue author's CI observation. The wider audit is in [[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]], and the mechanism is the one in [[concepts/idempotency]] and [[examples/ec2-client-token-makes-a-retried-runinstances-call-safe]].

## Related

[[entities/ack]], [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]], [[findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent]]

## Seen again in the other-tool pitfalls dossier

The 2026-11-26 other-tool pitfalls dossier re-read issue 3122 and confirmed the reporter (sapphirew, not gecube), the 2026-10-31 filing date, the 2026-10-30 CI run, and that the evidence is specific to `CreateVpcEndpoint`, with the title's "Create calls" generalizing. See [[findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource]] for the ownership issue filed separately. [[sources/research-gap-g1-other-tool-pitfalls]]
