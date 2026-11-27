---
title: The Cluster API MachineHealthCheck short-circuit is off by default so remediation is unbounded until a threshold is set
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cluster-api, machinehealthcheck, remediation, defaults]
---

# The Cluster API MachineHealthCheck short-circuit is off by default so remediation is unbounded until a threshold is set

## Observation

The v1beta2 MachineHealthCheck guide at tag v1.15.0-rc.0 says the "short circuiting mechanism is **disabled by default** and Machines will be remediated no matter the state of the cluster." The default threshold is 100 percent, so `remediation.triggerIf.unhealthyLessThanOrEqualTo` only brakes remediation after an operator sets a lower value. [sources/research-gap-g3-argocd-capi](../sources/research-gap-g3-argocd-capi.md) URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/book/src/user/guide/lifecycle/healthchecking.md.

## Why it matters

The wiki's earlier finding says a short-circuit stops a controller from replacing a large share of a fleet when many machines look unhealthy at once for a shared reason. That is true only when the threshold is configured. A team that adds a MachineHealthCheck and relies on the brake without setting it gets unrestricted remediation, which is the amplification case described in [findings/remediation-can-amplify-an-outage](remediation-can-amplify-an-outage.md).

## Mitigations

Set `unhealthyLessThanOrEqualTo` (a count or a percentage that rounds down) or `unhealthyInRange` when defining the check. For control planes, also set `maxRetry` on KubeadmControlPlane remediation, since an unset value retries forever. See [examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers](../examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers.md), [examples/cluster-api-kubeadm-control-plane-remediation-must-preserve-etcd-quorum-and-has-its-own-retry-controls](../examples/cluster-api-kubeadm-control-plane-remediation-must-preserve-etcd-quorum-and-has-its-own-retry-controls.md), and [entities/cluster-api](../entities/cluster-api.md).

## Caveat

The page is read at a release candidate tag, and v1.15.0 final had not shipped on 2026-11-26. The dossier found no incident report of a remediation storm.
