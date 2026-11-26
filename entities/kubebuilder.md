---
title: Kubebuilder
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: [Kubebuilder Book]
tags: [tool, operators, framework]
---

# Kubebuilder

Kubebuilder is a Kubernetes SIGs framework and tutorial book for writing controllers and operators. Its CronJob tutorial is the dossier's annotated example of a real Reconcile function. [[sources/research-declarative-vs-imperative]]

## What the controller tutorial teaches

The tutorial's Reconcile function fetches the object, lists the children it owns, cleans up, computes the next action, creates children, and requeues. It teaches three habits that make a controller declarative in practice. First, the controller rebuilds status from the observed world and not from prior status, which is the heart of [[concepts/idempotency]]. Second, children carry owner references so that garbage collection and re-triggering work, as described in [[concepts/owner-references-and-garbage-collection]]. Third, status is written through the status subresource, which avoids conflicts with spec updates and allows separate RBAC for the two. The stated goal of the loop is to "move the current state of the cluster closer to the desired state."

## Related

[[concepts/reconciliation-loop]], [[concepts/operator-pattern]], [[concepts/spec-status-split]], [[examples/database-operator-encodes-runbooks]]
