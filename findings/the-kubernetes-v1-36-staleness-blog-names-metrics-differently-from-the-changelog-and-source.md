---
title: "The Kubernetes v1.36 staleness blog names metrics differently from the CHANGELOG and source"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
aliases: [staleness metric names]
tags: [pitfall, kubernetes, v1-36, metrics, staleness, documentation]
---

# The Kubernetes v1.36 staleness blog names metrics differently from the CHANGELOG and source

## Observation

The v1.36 staleness mitigation blog and the code disagree on metric names. The blog names a skip counter `stale_sync_skips_total` ("with the subsystem of the controller") and a gauge `store_resource_version`, and it labels the skip metric alpha. The CHANGELOG and source give the full names. [[sources/research-gap-g3-k8s-and-controller-runtime]]

| What the blog says | What the CHANGELOG or source says | Where |
|---|---|---|
| `stale_sync_skips_total` | `daemonset_controller_stale_sync_skips_total` and `job_controller_stale_sync_skips_total` | CHANGELOG-1.36, PRs 134937 and 137210 |
| `store_resource_version` | `informer_store_resource_version` with labels name, group, version, resource, alpha | tag v1.36.0, `component-base/metrics/prometheus/clientgo/fifo/metrics.go` |

The gauge help text is "The 15 least significant digits of the resource version of the store", so it is a coarse lag signal and not the full resource version. The dossier found no CHANGELOG names for the ReplicaSet and StatefulSet skip metrics, so those two names remain unknown. The v1.37 scheduler additionally publishes `informer_queued_items` and `informer_processing_latency_seconds` (CHANGELOG-1.37, PR 140511).

## Why it is a pitfall

A dashboard or alert written from the blog's short names will match nothing, because Prometheus matches the full name including the subsystem prefix. The metrics are also alpha, so names and labels may change.

## What to do

Take metric names from the CHANGELOG or from the source at the tag in use, and check them against a live `/metrics` endpoint. See [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]] and [[findings/stale-cache-and-double-action]].

## Related

[[concepts/informers-reflectors-and-workqueues]], [[entities/client-go]], [[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]]
