---
title: "Orphaned dependents keep running with empty owner references until someone deletes them"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, orphan, cleanup, gitops]
---

# Orphaned dependents keep running with empty owner references until someone deletes them

## Observation

With `--cascade=orphan` the dependents survive. The KKloud Tarus lab shows that the Pods keep running and their `ownerReferences` becomes empty, so nothing will ever collect them automatically and they need manual deletion. The GitOps equivalents are Flux's `Orphan` deletion policy and Argo CD's non-cascading delete. [[sources/research-owner-references-and-garbage-collection]]

## Consequence

Orphaning is useful for migrations and for keeping workloads alive across a controller change, but the objects become unmanaged. They keep consuming resources and no controller reconciles them. The Argo CD ApplicationSet case adds a twist: orphaning the ApplicationSet leaves Applications whose finalizer still deletes workloads later. See [[examples/kubectl-cascade-modes-compared-in-a-hands-on-lab]], [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]], and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].

## Related

[[concepts/owner-references-and-garbage-collection]], [[findings/api-client-default-propagation-policy-can-differ-from-kubectl-and-orphan-dependents]]
