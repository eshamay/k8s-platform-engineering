---
title: Kubernetes has no supported downgrade, so a failed control-plane upgrade forces a backup restore and an untested restore procedure is the risk
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: reddit-pi-day-outage-postmortem
    hash: 195bd85b2856
    ingested: 2026-11-26
aliases: []
tags: [upgrade, rollback, backup-restore, etcd, reddit, runbook]
---

# Kubernetes has no supported downgrade, so a failed control-plane upgrade forces a backup restore and an untested restore procedure is the risk

## Observation

Reddit's postmortem states that reverting a failed deployment is normally "Plan A", but Kubernetes has no supported downgrade procedure because an upgrade performs schema and data migrations automatically and defines no reverse path. Downgrading therefore means restoring a backup and reloading state. The upgrade procedure already took a backup as a standard step, but the backup and restore procedures were years old, had been exercised on pilot clusters and never on this production cluster, and the team did not know how long a restore would take. Initial estimates were hours of guaranteed downtime, so they spent about two hours fixing forward before choosing the restore. [sources/reddit-pi-day-outage-postmortem](../sources/reddit-pi-day-outage-postmortem.md)

## What went wrong in the restore

The procedure was written for a now end-of-life Kubernetes version and for Docker, while the cluster used CRI-O, so commands and arguments had to be rewritten live. The backup could be taken on any control-plane node but the restore had to be run on the first node. Hostnames were default AWS names that did not identify control-plane membership, so the restored node presented TLS certificates that other nodes could not use, and new members could not reach etcd until new certificates were generated. AWS capacity for the control-plane instance type was also briefly exhausted, which delayed the new nodes. [sources/reddit-pi-day-outage-postmortem](../sources/reddit-pi-day-outage-postmortem.md)

## Why it matters

This is the control-plane analogue of the backup lessons in other postmortems: a backup is only as good as a rehearsed restore, and the restore runbook has to track the environment. Skyscanner and Spotify drew the same conclusion from their own incidents, in [examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services](../examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services.md) and the Spotify cluster deletion example. See also [examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected](../examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected.md).

## Related pages

[findings/etcd-scale-limits-of-the-shared-store](etcd-scale-limits-of-the-shared-store.md), [concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md).
