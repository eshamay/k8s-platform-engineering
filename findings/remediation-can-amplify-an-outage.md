---
title: Automatic remediation can amplify an outage
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cluster-api, remediation, safety]
---

# Automatic remediation can amplify an outage

## Observation

If many machines look unhealthy at the same moment, the cause is often shared, such as a network partition or a bad control-plane component, and replacing them all would make things worse. Cluster API's `maxUnhealthy` setting on a MachineHealthCheck short-circuits remediation when too many machines look bad. The source is the v0.4 Cluster API book. Correction 2026-11-26: `maxUnhealthy` is the deprecated v1beta1 name, and the brake is off by default. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [examples/cluster-api-machine-health-check-replaces-failed-nodes](../examples/cluster-api-machine-health-check-replaces-failed-nodes.md).

## Interpretation

Self-healing needs a brake as well as an accelerator. The same idea appears elsewhere as `prune` being off by default in Argo CD, a `warn` mode in Flux before `enabled`, and `Observe` in Crossplane. See [decisions/staged-adoption-of-automated-drift-correction](../decisions/staged-adoption-of-automated-drift-correction.md) and [findings/retry-storms-and-unbounded-retries](retry-storms-and-unbounded-retries.md).

## Caveat

The dossier found no postmortem of an outage made worse by remediation. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[entities/cluster-api](../entities/cluster-api.md), [concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md)

## Update from the v1beta2 API

The brake is `remediation.triggerIf.unhealthyLessThanOrEqualTo` in v1beta2 and its default of 100 percent means "disabled by default", so remediation proceeds regardless of cluster state until an operator sets a limit. Control plane remediation has its own preconditions and an unbounded default retry. See [findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set](the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set.md), [findings/a-non-working-kubelet-on-the-etcd-leader-blocks-cluster-api-control-plane-remediation](a-non-working-kubelet-on-the-etcd-leader-blocks-cluster-api-control-plane-remediation.md), and [sources/research-gap-g3-argocd-capi](../sources/research-gap-g3-argocd-capi.md).
