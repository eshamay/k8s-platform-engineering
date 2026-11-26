---
title: Default owner references delete out of order and cannot link namespaced to cluster-scoped objects, so kro uses ApplySets
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [kro, owner-references, applyset, deletion, garbage-collection, gitops]
---

# Default owner references delete out of order and cannot link namespaced to cluster-scoped objects, so kro uses ApplySets

## Observation

The kro instances documentation says kro deliberately avoids the default Kubernetes owner references for the children of an instance. Two reasons are given: owner references cause out-of-order deletion, and they cannot link a namespaced object to a cluster-scoped one. kro tracks children with an ApplySet and deletes them in reverse topological order instead (https://kro.run/docs/concepts/rgd/instances, read through a summarizing fetch). [[sources/research-kro-and-abstraction-models]]

## Why it matters

The garbage collector deletes dependents without regard to dependency order among siblings, so a graph that needs a database removed only after the application that uses it cannot rely on owner references alone. The Kubernetes rule that a cluster-scoped dependent cannot have a namespaced owner is the second limit, and it matters for any abstraction that mixes both scopes. See [[concepts/owner-references-and-garbage-collection]] and [[findings/cross-namespace-owner-references-are-treated-as-absent-and-the-dependent-can-be-collected]].

The cost is at the GitOps seam. A GitOps agent that decides what it owns from ownership metadata cannot see kro's children the usual way, so the kro FAQ tells Argo CD users to add an owner reference and an `argocd.argoproj.io/tracking-id` annotation to each templated resource, and it documents risks with doing so. See [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]] and [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]].

## Evidence strength

This is project documentation describing design intent, not a measured failure. The wiki holds no incident report for it. The same dossier says kro reacts to drift by restoring managed children, which is a separate claim. [[sources/research-kro-and-abstraction-models]]
