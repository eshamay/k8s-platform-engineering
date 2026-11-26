---
title: "The Cluster API sync-period flag is a cache resync and not a poll of the cloud infrastructure"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cluster-api, sync-period, resync, defaults, drift]
---

# The Cluster API sync-period flag is a cache resync and not a poll of the cloud infrastructure

## Observation

Cluster API's core controller flag `--sync-period` defaults to 10 minutes and is described in source as "The minimum interval at which watched resources are reconciled (e.g. 15m)". Reading the 10-minute value as a drift-detection cadence would be a mistake, because the flag governs the controller's watched-resource resync and does not poll the cloud. [[sources/research-gap-g3-reconcile-defaults]] https://github.com/kubernetes-sigs/cluster-api/blob/main/core/main.go (default branch as of 2026-11-26)

## What is and is not known

No per-resource drift period for infrastructure was found. The dossier also did not find MachineHealthCheck or per-controller requeue periods, and the Cluster API book path it tried returned 404, so the only verified Cluster API cadence is this flag. Machine health relies on node conditions and timeouts, see [[examples/cluster-api-machine-health-check-replaces-failed-nodes]]. The contrast with ACK (10 hours after `ResourceSynced`), Config Connector (a 10 minute mean with jitter), and Crossplane (1 or 10 minutes) is therefore a contrast of mechanisms, not of one comparable number, see [[comparisons/drift-detection-mechanisms-across-tools]].

## Consequences

Do not put 10 minutes in the Cluster API cell of a drift-latency table as if it were a poll interval. Put the flag in the cadence row with a note that it is a cache resync, and leave the infrastructure drift cell open until current controller source or the current book is read. See [[entities/cluster-api]], [[concepts/informers-reflectors-and-workqueues]], and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].
