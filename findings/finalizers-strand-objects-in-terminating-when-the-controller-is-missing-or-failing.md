---
title: Finalizers strand objects in Terminating when the controller is missing or failing
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, finalizers, deletion, operators]
---

# Finalizers strand objects in Terminating when the controller is missing or failing

## Observation

Operators that manage external resources depend on finalizers to clean up before an object disappears. Deleting such an object sets a `deletionTimestamp`, and the object lingers until every controller removes its finalizer key. The Kubernetes finalizers page lists three reasons an object stays in Terminating: failing cleanup logic, a controller that is not running, or blocked dependencies. The page also warns that manually stripping finalizers is risky, because it skips the cleanup the finalizer existed to guarantee. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Implication for operator removal

Uninstalling an operator before its custom resources are deleted leaves those resources stuck, because nothing remains to run cleanup. This links to the white paper's advice to design so that removing the operator does not disrupt applications. The dossier found no named incident, so this rests on documentation only. URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/.

## Related

[concepts/finalizers](../concepts/finalizers.md), [findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md), [findings/operator-privileges-and-removal-behavior-set-the-blast-radius](operator-privileges-and-removal-behavior-set-the-blast-radius.md), [concepts/operator-pattern](../concepts/operator-pattern.md)

## Additional evidence from the finalizers dossier

The finalizers dossier names three usual causes of a stranded object: a controller that is gone, such as an uninstalled operator, a cleanup that errors forever, and a child that holds its own finalizer. It adds a diagnosis path (read the finalizers, find the owner, read its logs) and warns that the shortcut of forcing removal skips cleanup. [sources/research-finalizers](../sources/research-finalizers.md) See [concepts/finalizers](../concepts/finalizers.md), [findings/cleanup-that-always-errors-or-assumes-the-external-resource-exists-strands-the-object](cleanup-that-always-errors-or-assumes-the-external-resource-exists-strands-the-object.md), [findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md), and [findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone](deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone.md).

## Addition from the GitOps incidents dossier

ACK issue 2911 (2026) is a dated case of a failing controller stranding a pruned CR in `Terminating`, see [findings/pruning-a-custom-resource-whose-controller-does-not-map-a-not-found-error-leaves-it-terminating-on-its-finalizer](pruning-a-custom-resource-whose-controller-does-not-map-a-not-found-error-leaves-it-terminating-on-its-finalizer.md). Source: [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md).
