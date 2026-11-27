---
title: ACK issue 2361 Flux server-side apply reverted reference fields and triggered ECS redeploys at the ten-hour resync
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: [ACK issue 2361]
tags: [ack, flux, server-side-apply, references, ecs]
---

# ACK issue 2361 Flux server-side apply reverted reference fields and triggered ECS redeploys at the ten-hour resync

## Scenario

ACK community issue 2361 was opened on 2025-02-26 and is open. A user of Flux reports that the ACK controller rewrites reference fields into the custom resource, and that Flux server-side apply "updates these references back to match the Git repository state." The ACK controller then diffs changed desired state against AWS, and the reporter saw unnecessary ECS redeploys at the 10-hour resync. Setting `kustomize.toolkit.fluxcd.io/ssa: merge` did not help. A maintainer suggested a fix modeled on eks-controller pull request 128. URL: https://github.com/aws-controllers-k8s/community/issues/2361. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

## Evidence limits

SECONDARY-ONLY. The report is a user's account of an anonymous cluster, and no maintainer-confirmed resolution was found. See [findings/flux-server-side-apply-reverts-ack-reference-fields-that-the-controller-rewrote-according-to-issue-2361](../findings/flux-server-side-apply-reverts-ack-reference-fields-that-the-controller-rewrote-according-to-issue-2361.md) for the mechanism and [examples/ack-resync-period-tuning-for-stateful-resources](ack-resync-period-tuning-for-stateful-resources.md) for the 10-hour interval.

## Related

[entities/ack](../entities/ack.md), [entities/flux](../entities/flux.md), [comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights](../comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights.md)
