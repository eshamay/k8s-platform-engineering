---
title: "controller-runtime v0.25.0 ships an experimental, opt-in read-your-writes client"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: [ReadYourWritesConsistency]
tags: [controller-runtime, staleness, read-your-writes, v0-25, verified]
---

# controller-runtime v0.25.0 ships an experimental, opt-in read-your-writes client

## Observation

The v0.25.0 release notes, published 2026-09-03, say the release "introduces a new experimental `ReadYourWritesConsistency` feature". It is enabled through `Client.EnableReadYourWritesConsistency`, so a controller must ask for it. v0.25.3 (published 2026-11-16) is the latest release the dossier saw. [sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md) URL: https://github.com/kubernetes-sigs/controller-runtime/releases/tag/v0.25.0

This replaces the earlier wiki position that the design had merged (pull request 3473, 2026-10-05) with no release confirmed to ship it. The earlier note's design pull request 3473 merged on 2026-10-05, a month after the v0.25.0 release date, and the dossier did not reconcile the two dates. The dossier did not read the v0.25.0 diff, so the exact cache semantics are not described here.

## What it means for controller authors

The built-in Kubernetes controllers get a resource-version gate in v1.36, see [examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write](../examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write.md). For operators built on controller-runtime, the library now offers an opt-in client behavior, labelled experimental. Until it is stable, deterministic names, expectations, and explicit uncached reads remain the documented defenses in [findings/stale-cache-and-double-action](stale-cache-and-double-action.md).

## Not settled

Whether any later release promotes the feature beyond experimental, and what it costs in memory or latency, was not checked. See [entities/controller-runtime](../entities/controller-runtime.md) and [examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it](../examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it.md).
