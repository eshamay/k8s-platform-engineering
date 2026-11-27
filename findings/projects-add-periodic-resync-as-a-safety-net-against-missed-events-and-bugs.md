---
title: Projects add periodic resync as a safety net against missed events and bugs
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Resync as a safeguard]
tags: [resync, informer, safety-net, argo-rollouts, kubefleet]
---

# Projects add periodic resync as a safety net against missed events and bugs

## Observation

Two projects document a periodic resync as a deliberate guard. KubeFleet's placement controller has a hardcoded 30-minute safety resync, commented in code as "We use a safety resync period to requeue all the finished request just in case there is a bug in the system", and issue 635 (2026-04-23) proposes unifying it across controllers. That is VERIFIED design intent and not an incident. A user in Argo Rollouts issue 4140 says operators run `--rollout-resync=60` "to prevent rollouts from getting stuck due to missed events". That statement is SECONDARY-ONLY, because it is a user's claim about the flag's purpose. A later pass verified that the flag exists in the controller's `main.go` ("Time period in seconds for rollouts resync."), but the project does not describe it as a guard against missed events, so the claim stays SECONDARY-ONLY ([sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md)). [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md)

## Interpretation

Both uses match the wiki's existing advice that resync is a defense against reconciler bugs. They do not answer what a resync replays, but the client-go source does: it replays the informer's local cache and does not refetch from the API server ([findings/a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server](a-resync-replays-the-informers-local-cache-to-the-handlers-and-never-contacts-the-api-server.md); correction note, 2026-11-26). [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md) The Argo Rollouts thread also shows the cost side, with high workqueue add rates after promotions, see [examples/argo-rollouts-issue-4140-workqueue-add-rates-stayed-high-after-promotions-with-a-60-second-resync](../examples/argo-rollouts-issue-4140-workqueue-add-rates-stayed-high-after-promotions-with-a-60-second-resync.md).

## Related

[decisions/keep-informer-resync-disabled-or-set-a-periodic-resync](../decisions/keep-informer-resync-disabled-or-set-a-periodic-resync.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md), [findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object](an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object.md)
