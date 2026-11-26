---
title: Drift detection mechanisms across tools
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [comparison, drift, self-healing]
---

# Drift detection mechanisms across tools

The values below are as stated on the fetched pages and may change by version. [[sources/research-self-healing-and-drift-detection]]

| Tool | What is compared | Default action on drift | Cadence |
|---|---|---|---|
| [[entities/flux]] Kustomization | Server-side apply dry-run against live objects | Corrects each interval unless suspended | `interval`, minimum 60s |
| [[entities/flux]] HelmRelease | Dry-run apply of the stored Helm manifest | None by default (`mode: disabled`); `warn` emits events; `enabled` corrects | `.spec.interval` |
| [[entities/argo-cd]] | Target manifests versus live state | Marks OutOfSync; reverts only if `selfHeal` is on (about 5s delay) | 120s plus up to 60s jitter, or Git webhook |
| [[entities/crossplane]] | `forProvider` versus observed external state | Reverts external edits | Configurable poll interval, default not confirmed |
| [[entities/ack]] | Spec versus AWS state | Re-reconciles after `ResourceSynced` | About 10 hours, tunable per kind |
| [[entities/kro]] | Instance graph versus live resources | Dynamic controller resync | 10 hours (36,000s) |
| [[entities/config-connector]] | Spec versus Google Cloud state | Periodic reconcile once UpToDate | Not stated on the controller-types page |
| [[entities/cluster-api]] | Node conditions versus timeouts | Replaces unhealthy Machines | Timeout-based, v0.4 book |
| [[entities/tofu-controller]] | Terraform state versus infrastructure | Detection-only model mentioned | Not stated |

## Reading the table

The in-cluster tools read the Kubernetes API and are cheap to run often, so their cadences are seconds to minutes. The external-API controllers pay a cloud API call for every observation, so their cadences are hours. Whether ACK's and kro's 10-hour figures are comparable mechanisms (informer resync versus explicit requeue) is not stated. See [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[comparisons/exemption-and-ignore-controls-across-tools]], [[findings/drift-detection-latency-is-the-interval]], and [[concepts/self-healing-and-drift-detection]].
