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
