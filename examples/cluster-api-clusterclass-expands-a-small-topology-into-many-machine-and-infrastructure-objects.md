---
title: Cluster API ClusterClass expands a small topology into many machine and infrastructure objects
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [cluster-api, clusterclass, topology, composite-pattern]
---

# Cluster API ClusterClass expands a small topology into many machine and infrastructure objects

## Scenario

An operator wants many similar clusters without repeating boilerplate. Cluster API's ClusterClass answers the same expansion problem that composite resources answer for general platforms, but only for cluster objects. [[sources/research-composite-resource]]

## How it works

A ClusterClass is a reusable definition of what a cluster looks like. A Cluster then carries a small `topology` that refers to the class and supplies the variable parts. A controller expands the pair into the machine and infrastructure objects that Cluster API already knows how to reconcile. The Cluster API book describes ClusterClass as "a powerful abstraction implemented on top of existing interfaces," enabled by the `ClusterTopology` feature gate, with separate documents for class authors and cluster operators and a CAEP titled "ClusterClass and Managed Topologies." URL: https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/.

## Caveats

The page read is a thin landing page that labels the feature experimental and alpha, which may be out of date, and the CAEP was not read. The dossier does not name an industry deployment. ClusterClass is not a general-purpose composer, so it complements Crossplane and kro and does not replace them. See [[entities/cluster-api]], [[examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects]], [[examples/cluster-fleet-lifecycle-with-cluster-api]], and [[concepts/composite-resource]].
