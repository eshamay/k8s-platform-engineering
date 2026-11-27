---
title: ACK records ownership only in custom resource status so overlapping controllers or a restored copy can share one AWS resource
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [ack, ownership, deletion, duplicate-owner, restore, pitfall]
---

# ACK records ownership only in custom resource status so overlapping controllers or a restored copy can share one AWS resource

## Observation

ACK issue 3142 (2026-11-09, reporter gecube) says ACK keeps the record of which custom resource owns an AWS resource only in the CR's status, and nothing in AWS names an owner. In the reporter's words, "there is no owner check before an update or a delete". A restored cluster copy, two controller installs, or a rollout overlap can therefore give one AWS resource two owners, and deleting a CR in one cluster deletes the resource the other still uses. The issue was open on 2026-11-26. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md) URL: https://github.com/aws-controllers-k8s/community/issues/3142

## Link to the adoption findings

This is the general form of the problem shown by [findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md), where the guard is removed by a policy choice. Issue 3142 says the guard does not exist in the first place when status is empty or lost. The wiki already records a related duplicate from a GitOps bootstrap across two clusters in [examples/ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name](../examples/ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name.md), and an owner-in-AWS-tags proposal in ACK issue 3143.

## Evidence limits

This is one reporter's account and the reporter filed a batch of ACK issues on the same day, so treat them as one audit and not as independent corroboration. No maintainer root-cause confirmation was found. No production incident is attached to it.

## Related

[examples/ack-issue-3142-a-restored-cluster-copy-or-overlapping-controller-install-can-give-one-aws-resource-two-owners](../examples/ack-issue-3142-a-restored-cluster-copy-or-overlapping-controller-install-can-give-one-aws-resource-two-owners.md), [entities/ack](../entities/ack.md), [findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them](backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them.md), [findings/duplicate-work-from-replicas-without-leader-election](duplicate-work-from-replicas-without-leader-election.md)
