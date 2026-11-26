---
title: Argo CD issue 20440 an ApplicationSet-generated Application was deleted with its namespaces and Argo CD itself
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Argo CD issue 20440]
tags: [argo-cd, applicationset, app-of-apps, deletion, incident]
---

# Argo CD issue 20440 an ApplicationSet-generated Application was deleted with its namespaces and Argo CD itself

## Scenario

An anonymous reporter running Argo CD v2.6.6 saw an ApplicationSet-generated Application deleted together with the resources it managed. The issue was still open when the dossier read it, with comments through 2024-11-10, and a second reporter described the same behavior with an app-of-apps layout. [[sources/research-gap-g1-gitops-drift-incidents]] URL: https://github.com/argoproj/argo-cd/issues/20440

## What happened

The report says "All of the resources that were deployed by ArgoCD (from other applications) are suddenly deleted", and the deleted objects included namespaces and Argo CD itself. No root cause was found in the thread. This is the reporters' account, and the wiki does not claim a mechanism.

## Why it belongs here

It is the widest blast radius in the dossier, because one deleted generated Application removed the agent that would have restored it. See [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]].

## Related

[[entities/argo-cd]], [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]], [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]]
