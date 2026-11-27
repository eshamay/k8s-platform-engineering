---
title: ACK issue 3142 a restored cluster copy or overlapping controller install can give one AWS resource two owners
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [ACK issue 3142]
tags: [ack, ownership, deletion, restore, gecube]
---

# ACK issue 3142 a restored cluster copy or overlapping controller install can give one AWS resource two owners

## Scenario

On 2026-11-09 gecube opened ACK community issue 3142 as part of a batch of ACK issues. It asks what stops two controllers from managing one AWS resource. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md) URL: https://github.com/aws-controllers-k8s/community/issues/3142

## What the reporter says

ACK records ownership only in the CR status, and nothing in AWS names an owner. Three setups can produce two owners of one resource: a restored copy of the cluster, two controller installs, or a rollout overlap. Deleting the CR in one of them deletes the resource the other still manages, since "there is no owner check before an update or a delete".

## Status and limits

Open when read. The batch is one reporter's audit, so it is not independent corroboration, and no incident with real impact is attached. See [findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource](../findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource.md) and [findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](../findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md).

## Related

[entities/ack](../entities/ack.md), [examples/ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name](ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name.md)
