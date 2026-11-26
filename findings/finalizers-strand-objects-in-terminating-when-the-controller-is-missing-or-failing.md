---
title: Finalizers strand objects in Terminating when the controller is missing or failing
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, finalizers, deletion, operators]
---

# Finalizers strand objects in Terminating when the controller is missing or failing

## Observation

Operators that manage external resources depend on finalizers to clean up before an object disappears. Deleting such an object sets a `deletionTimestamp`, and the object lingers until every controller removes its finalizer key. The Kubernetes finalizers page lists three reasons an object stays in Terminating: failing cleanup logic, a controller that is not running, or blocked dependencies. The page also warns that manually stripping finalizers is risky, because it skips the cleanup the finalizer existed to guarantee. [[sources/research-operator-pattern]]

## Implication for operator removal

Uninstalling an operator before its custom resources are deleted leaves those resources stuck, because nothing remains to run cleanup. This links to the white paper's advice to design so that removing the operator does not disrupt applications. The dossier found no named incident, so this rests on documentation only. URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/.

## Related

[[concepts/finalizers]], [[findings/destructive-deletion-of-external-resources]], [[findings/operator-privileges-and-removal-behavior-set-the-blast-radius]], [[concepts/operator-pattern]]

## Additional evidence from the finalizers dossier

The finalizers dossier names three usual causes of a stranded object: a controller that is gone, such as an uninstalled operator, a cleanup that errors forever, and a child that holds its own finalizer. It adds a diagnosis path (read the finalizers, find the owner, read its logs) and warns that the shortcut of forcing removal skips cleanup. [[sources/research-finalizers]] See [[concepts/finalizers]], [[findings/cleanup-that-always-errors-or-assumes-the-external-resource-exists-strands-the-object]], [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]], and [[findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone]].
