---
title: The stock Flux source-controller keeps artifacts in an emptyDir with one-minute retention so a restart rebuilds them
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [flux, source-controller, artifacts, storage, defaults]
---

# The stock Flux source-controller keeps artifacts in an emptyDir with one-minute retention so a restart rebuilds them

## Observation

The artifact flags in fluxcd/pkg default to a storage path of `/data`, a bind address of `:9090`, a retention TTL of one minute (`defaultArtifactRetentionTTL = time.Minute`), two records kept after garbage collection, and a sha256 digest algorithm. The stock source-controller manifest advertises the in-cluster address through the Service DNS name, passes `--enable-leader-election` and `--storage-path=/data`, and runs `replicas: 1` with `type: Recreate`. The two volumes visible in the manifest are both `emptyDir: {}`. [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

URLs: https://github.com/fluxcd/pkg/blob/main/artifact/config/flags.go and https://github.com/fluxcd/source-controller/blob/main/config/manager/deployment.yaml, read on `main` on 2026-11-26. The GitRepository spec adds that an Artifact can "disappear from the storage due to e.g. the source-controller Pod being evicted", and that a suspended object does not reflect the loss until it is resumed (https://github.com/fluxcd/source-controller/blob/main/docs/spec/v1/gitrepositories.md).

## Inference, not verified

The dossier infers that `/data` maps to one of the emptyDir volumes, so artifacts do not survive a pod restart by default and are fetched and rebuilt on the next reconcile. The emptyDir lines are verified. The mapping of `/data` to one of them and the consequences are inference, and no document was read on persistent alternatives such as a PVC. Treat the restart behavior as likely and not confirmed.

## Why it matters

Together with [findings/flux-source-controller-starts-its-artifact-server-only-after-winning-leader-election-and-standbys-fail-readiness](flux-source-controller-starts-its-artifact-server-only-after-winning-leader-election-and-standbys-fail-readiness.md), the defaults mean a source-controller restart is a window with no artifact server and, probably, an empty store. A platform that rolls source-controller often, or runs it on evictable nodes, should expect dependents to wait for artifacts to be rebuilt.

## Related

[findings/objects-that-leave-a-flux-shard-keep-stale-artifacts-on-the-old-source-controller](objects-that-leave-a-flux-shard-keep-stale-artifacts-on-the-old-source-controller.md), [entities/flux](../entities/flux.md), [decisions/single-replica-versus-leader-election](../decisions/single-replica-versus-leader-election.md)
