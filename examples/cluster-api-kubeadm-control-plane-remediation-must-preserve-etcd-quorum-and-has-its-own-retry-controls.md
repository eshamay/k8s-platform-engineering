---
title: Cluster API KubeadmControlPlane remediation must preserve etcd quorum and has its own retry controls
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, kubeadm-control-plane, remediation, etcd, quorum]
---

# Cluster API KubeadmControlPlane remediation must preserve etcd quorum and has its own retry controls

## Scenario

A control plane machine in a Cluster API cluster fails its health check. Replacing a worker is routine, but replacing a control plane machine risks losing etcd quorum, so KubeadmControlPlane (KCP) remediation follows stricter rules than worker remediation. The rules come from the user guide at tag v1.15.0-rc.0. [[sources/research-gap-g3-argocd-capi]]

## How it works

The guide states "Remediation MUST preserve etcd quorum." KCP remediation has extra preconditions: at least two control plane machines must exist once the control plane is initialized, no machine may be deleting, and prior remediation must have completed. Retry is governed by three KCP fields. `maxRetry` caps attempts, and "If `maxRetry` is not set (default), remediation will be retried infinitely." `retryPeriodSeconds` sets the wait between attempts, and `minHealthyPeriodSeconds` (default 3600) sets how long a replacement must stay healthy before the retry counter resets.

There is one documented dead end. A non-working kubelet on the etcd leader node blocks remediation (issue 8465), and the manual workaround is to forward etcd leadership to another member and then delete the Machine. See [[findings/a-non-working-kubelet-on-the-etcd-leader-blocks-cluster-api-control-plane-remediation]].

## Lesson

Self-healing at the control plane layer is conservative on purpose, because a wrong replacement is more costly than a slow one. The default of unbounded retry means an operator who wants a stop must set `maxRetry`. Compare the worker-side brake in [[examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers]], and see [[findings/remediation-can-amplify-an-outage]] and [[entities/cluster-api]].
