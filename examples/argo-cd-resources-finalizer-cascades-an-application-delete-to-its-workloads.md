---
title: "The Argo CD resources finalizer cascades an Application delete to its workloads"
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [finalizers, argo-cd, gitops, deletion]
---

# The Argo CD resources finalizer cascades an Application delete to its workloads

## Scenario

A platform team generates many Argo CD Applications from one ApplicationSet. They need to know what happens to the deployed workloads when an Application, or the ApplicationSet that produced it, is deleted. The ApplicationSet deletion page answers this through one finalizer. [[sources/research-finalizers]]

## How it works

The `resources-finalizer.argocd.argoproj.io` finalizer on an Application makes deleting the Application also delete the resources it deployed. Deleting an ApplicationSet cascades to its Applications and then to the cluster resources. Deleting the ApplicationSet with `--cascade=orphan` leaves the Applications in place, but each Application still carries the finalizer, so removing one of them later still deletes its workloads. Setting `syncPolicy.preserveResourcesOnDeletion` on the ApplicationSet prevents the finalizer from being added, so the workloads survive. Correction recorded 2026-11-26: a later dossier read the Argo CD source and documentation. The finalizer has three spellings, the bare name, `/foreground`, and `/background`, and a non-cascading delete is `argocd app delete APPNAME --cascade=false` or the UI choice Non-Cascading (Orphan), see [[findings/argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer]]. [[sources/research-gap-m1-finalizers]]

## Why the example matters

The finalizer is the switch that decides whether a GitOps object owns its output. Orphaning the parent object does not remove that ownership, so a team that wants workloads to outlive the controller object must change the policy before deleting anything. See [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].

## Related

[[entities/argo-cd]], [[concepts/finalizers]], [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]]

## Reported cascades

Reporters describe Argo CD deleting managed apps after a reinstall (issue 6046) and an ApplicationSet-generated Application deleted with its namespaces and Argo CD itself (issue 20440), see [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].
