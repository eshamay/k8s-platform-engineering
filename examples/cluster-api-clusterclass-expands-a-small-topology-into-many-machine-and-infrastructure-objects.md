---
title: Cluster API ClusterClass expands a small topology into many machine and infrastructure objects
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, clusterclass, topology, composite-pattern]
---

# Cluster API ClusterClass expands a small topology into many machine and infrastructure objects

## Scenario

An operator wants many similar clusters without repeating boilerplate. Cluster API's ClusterClass answers the same expansion problem that composite resources answer for general platforms, but only for cluster objects. [sources/research-composite-resource](../sources/research-composite-resource.md)

## How it works

A ClusterClass is a reusable definition of what a cluster looks like. A Cluster then carries a small `topology` that refers to the class and supplies the variable parts. A controller expands the pair into the machine and infrastructure objects that Cluster API already knows how to reconcile. The Cluster API book describes ClusterClass as "a powerful abstraction implemented on top of existing interfaces," enabled by the `ClusterTopology` feature gate, with separate documents for class authors and cluster operators and a CAEP titled "ClusterClass and Managed Topologies." URL: https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/.

## Caveats

The page read is a thin landing page that labels the feature experimental and alpha. Correction 2026-11-26: that label is out of date for v1.15, as described below. The dossier does not name an industry deployment. ClusterClass is not a general-purpose composer, so it complements Crossplane and kro and does not replace them. See [entities/cluster-api](../entities/cluster-api.md), [examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects](cluster-api-topology-controller-uses-ssa-for-co-authored-objects.md), [examples/cluster-fleet-lifecycle-with-cluster-api](cluster-fleet-lifecycle-with-cluster-api.md), and [concepts/composite-resource](../concepts/composite-resource.md).

## Maturity and the proposal

At v1.15.0-rc.0 the `ClusterTopology` gate is Beta and on by default, and the v1.14.4 docs still say alpha. The proposal (created 2021-05-26) describes ClusterClass as a collection of template references and the Cluster as "a single control point to manage the Kubernetes version, worker pools, labels, replicas", with continuous reconciliation of the managed objects. Its history adds MachineHealthCheck support on 2022-01-10 and upgrade plans on 2025-05-13, and its frontmatter still says `provisional`. See [examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules](cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules.md), [findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional](../findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional.md), and [sources/research-gap-g3-argocd-capi](../sources/research-gap-g3-argocd-capi.md).
