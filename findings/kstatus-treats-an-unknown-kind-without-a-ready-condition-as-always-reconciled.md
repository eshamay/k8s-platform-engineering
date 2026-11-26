---
title: kstatus treats an unknown kind without a Ready condition as always reconciled
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [kstatus unknown resource fallback]
tags: [pitfall, kstatus, readiness, cluster-api, conditions, verified]
---

# kstatus treats an unknown kind without a Ready condition as always reconciled

## Observation

kstatus, the status library in `sigs.k8s.io/cli-utils`, evaluates a resource in a fixed order. It first checks deletion and generation, then the `Reconciling` and `Stalled` conditions, then type-specific rules for built-in kinds. For a kind it has no rule for, it looks for a `Ready` condition. Its README says that a resource with no `Ready` condition falls back to the unknown-resource strategy, which is to "assume they are always reconciled". The source in `generic.go` acts on `Stalled=True` as failed and `Reconciling=True` as in progress before anything else. [[sources/research-gap-b1-recheck-capi-argocd]] URLs: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md and https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/generic.go

The v1beta2 Cluster API Cluster type, read at v1.15.0-rc.0, defines `ClusterAvailableCondition = AvailableCondition`, and a grep found no Cluster `Ready` constant. The Cluster type also has no `Reconciling` or `Stalled` match, though that was checked only on the Cluster type.

## Why it matters

The two verified facts fit together in a way that would let `Available=False` go unseen by a generic tool. This page does not assert that conclusion, because no source states it and nobody ran kstatus against a v1beta2 Cluster. A pending spec change could also change the result through the generation check. It stays an open question in [[open-knowledge-gaps]] under the generic readiness gap.

## Mitigations

Do not rely on kstatus alone for kinds that publish neither `Ready` nor the abnormal-true pair. Use per-kind checks that read the condition the project actually publishes, such as `Available` plus `spec.availabilityGates` for a v1beta2 Cluster. See [[entities/kstatus]], [[findings/premature-readiness-in-kstatus-based-tools]], [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]], and [[findings/the-flux-cel-cheatsheet-keys-cluster-api-health-on-ready-and-shows-no-v1beta2-available-variant]].

## Full evaluation order

The complete order, from the m3 dossier, is deletion, then the top-level generation check, then `Reconciling` and `Stalled` in array order, then built-in rules, then the `Ready` fallback, then Current. The inference for a v1beta2 Cluster therefore also depends on whether its controller writes a top-level `observedGeneration`, which was not checked. [[sources/research-gap-m3-status-conditions]] See [[findings/kstatus-checks-deletion-then-generation-then-reconciling-and-stalled-then-ready-so-a-stale-top-level-observedgeneration-overrides-ready-true]].
