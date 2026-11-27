---
title: A non-working kubelet on the etcd leader blocks Cluster API control plane remediation
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [pitfall, cluster-api, kubeadm-control-plane, etcd, remediation]
---

# A non-working kubelet on the etcd leader blocks Cluster API control plane remediation

## Observation

The Cluster API healthchecking guide documents a case where KubeadmControlPlane remediation cannot proceed: when the kubelet on the node hosting the etcd leader stops working, "this prevents remediation from happening." The tracked issue is 8465. The documented manual workaround is to forward etcd leadership to another member and then delete the Machine. [sources/research-gap-g3-argocd-capi](../sources/research-gap-g3-argocd-capi.md) URL: https://github.com/kubernetes-sigs/cluster-api/blob/v1.15.0-rc.0/docs/book/src/user/guide/lifecycle/healthchecking.md.

## Why it matters

The cause is the rule that remediation "MUST preserve etcd quorum". The controller must move leadership before it removes the leader's machine, and a broken kubelet on that node stops the move. The automated self-healing loop therefore fails for the machine that most needs replacing, and a human has to act.

## Mitigations

Know the manual procedure before an incident. Alerting on a stalled control plane remediation is the practical way to notice, and the dossier does not describe a built-in signal for it. See [examples/cluster-api-kubeadm-control-plane-remediation-must-preserve-etcd-quorum-and-has-its-own-retry-controls](../examples/cluster-api-kubeadm-control-plane-remediation-must-preserve-etcd-quorum-and-has-its-own-retry-controls.md), [findings/remediation-can-amplify-an-outage](remediation-can-amplify-an-outage.md), and [entities/cluster-api](../entities/cluster-api.md).

## Caveat

The finding is stated in the guide at a release candidate tag. The dossier did not read issue 8465 itself.
