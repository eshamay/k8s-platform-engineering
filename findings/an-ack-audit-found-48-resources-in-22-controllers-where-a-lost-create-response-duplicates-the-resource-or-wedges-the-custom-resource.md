---
title: An ACK audit found 48 resources in 22 controllers where a lost create response duplicates the resource or wedges the custom resource
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [ack, idempotency, duplicate-resource, client-token, audit, runtime]
---

# An ACK audit found 48 resources in 22 controllers where a lost create response duplicates the resource or wedges the custom resource

## Observation

ACK community issue 3177 (2026-11-13, gecube) states that when a Create response is lost, "48 resources in 22 controllers either create a second AWS resource (28) or fail on every following reconcile" because the name is already taken (20). It adds 12 more resources that depend on undocumented behavior. This is the author's own audit of code and documentation at main on 2026-11-13. It is not an observed production incident count, and the dossier did not re-run it. [[sources/research-gap-g1-leaked-resources-adoption]] URL: https://github.com/aws-controllers-k8s/community/issues/3177

## Mechanism

ACK controllers record the AWS identifier in status after the create call returns. A controller that stops before that write leaves a resource in AWS whose identifier the custom resource does not have. For server-generated identifiers the next reconcile creates a second resource. For caller-named resources the next create fails because the name exists, and the custom resource wedges. This is the failure that [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]] describes in general, now with a count for one project.

## The fix in progress

ACK runtime pull request 292 (opened 2026-11-13, merged 2026-11-20) moves the status patch to immediately after Create. Its text says a controller stopped before that patch "left a resource in AWS whose identifier the CR did not have", which is a duplicate for server-generated IDs. The merge narrows the window and does not close it, because a crash between the AWS call and the patch can still lose the identifier. URL: https://github.com/aws-controllers-k8s/runtime/pull/292

## Observed instance

The audit's mechanism matches the dated reproduction in [[examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours]], and the two-cluster variant in [[examples/ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name]].

## Related

[[entities/ack]], [[concepts/idempotency]], [[decisions/make-an-ack-create-retry-safe-with-a-stable-client-token-leader-election-or-a-recreate-rollout]], [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]]
