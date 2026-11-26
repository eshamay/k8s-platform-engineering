---
title: Flux label sharding versus Argo CD cluster sharding
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [comparison, flux, argo-cd, sharding, scale]
---

# Flux label sharding versus Argo CD cluster sharding

Flux and Argo CD both split reconciliation work across several controller instances, but they choose different partition keys. Flux partitions by a label on each object, and Argo CD partitions by the destination cluster. [[sources/research-scale-and-sharding]]

| Aspect | Flux | Argo CD |
|---|---|---|
| Partition key | Label `sharding.fluxcd.io/key` on each object | Destination cluster |
| How instances are told their share | Each instance gets a `--watch-label-selector`; the default instance uses a negated selector | `ARGOCD_CONTROLLER_REPLICAS` gives the replica total to each application-controller replica |
| Assignment | By whoever applies the label, often in bulk with `commonMetadata` | By an algorithm: legacy (UID based, uneven), round-robin, or consistent-hashing |
| Controllers covered | Source, kustomize, and helm controllers; notification-controller stays a singleton | The application controller |
| Setup | Kustomize overlays add a name suffix and patch arguments | A StatefulSet with several replicas; clusters can be pinned through the cluster secret |
| Main pitfall | Dependent kinds such as a HelmChart must carry the same label as their HelmRepository | Uneven legacy distribution; other algorithms still labelled experimental (Alpha) at v3.6.3 |
| First step before sharding | Raise `--concurrent` to 10 to 20 and raise resources | Raise `--status-processors` and `--operation-processors`, with larger values suggested for around 1,000 applications |

## Reading the comparison

Label sharding lets a platform team separate tenants or noisy namespaces inside one cluster, at the price of label discipline. Cluster sharding fits hub-and-spoke setups where one control plane manages many destination clusters, but it cannot divide a single very large cluster. Both rely on the same fact: leader election makes extra replicas of an unsharded controller add availability and not throughput. See [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]], [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]], [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]], [[comparisons/flux-versus-argo-cd-architecture]], and [[concepts/scale-and-sharding]].

## Maturity recheck, 2026-11-26

Argo CD's docs at v3.6.3 still call round-robin and consistent-hashing experimental and list both as Alpha, with the wording unchanged since v2.14.0 and v3.0.0. The current default is unconfirmed because the v3.6.3 page drops the "(default)" marker beside `legacy`. See [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]] and [[sources/research-gap-g3-argocd-capi]].
