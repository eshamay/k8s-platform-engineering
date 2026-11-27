---
title: Flux server-side apply reverts ACK reference fields that the controller rewrote, according to issue 2361
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [ack, flux, server-side-apply, references, drift]
---

# Flux server-side apply reverts ACK reference fields that the controller rewrote, according to issue 2361

## Observation

ACK reference fields (the `*Ref` fields) are resolved by the controller, which writes the resolved value back into the custom resource. ACK issue 2361 (open, opened 2025-02-26) reports that Flux server-side apply then restores the Git value, and in the reporter's account "it updates these references back to match the Git repository state." The ACK controller's diff then sees changed desired state, and at the 10-hour requeue the reporter saw unnecessary ECS redeploys. Setting `kustomize.toolkit.fluxcd.io/ssa: merge` did not help. A maintainer suggested a fix modeled on eks-controller pull request 128. URL: https://github.com/aws-controllers-k8s/community/issues/2361. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

## Evidence limits

This is a user report that no maintainer has confirmed as fixed, so the behavior is SECONDARY-ONLY and the page stays draft. It is consistent with the wiki's existing account that the ACK runtime sends merge patches and sets no server-side apply field manager, see [findings/the-ack-runtime-sends-merge-patches-and-sets-no-server-side-apply-field-manager](the-ack-runtime-sends-merge-patches-and-sets-no-server-side-apply-field-manager.md): with no manager recorded for the controller's write, the Git-side applier is the only owner on record.

## Related

[examples/ack-issue-2361-flux-server-side-apply-reverted-reference-fields-and-triggered-ecs-redeploys-at-the-ten-hour-resync](../examples/ack-issue-2361-flux-server-side-apply-reverted-reference-fields-and-triggered-ecs-redeploys-at-the-ten-hour-resync.md), [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md), [findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md), [entities/ack](../entities/ack.md)
