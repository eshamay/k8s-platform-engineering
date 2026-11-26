---
title: Argo CD issue 6046 reinstalling Argo CD into a wiped namespace started deleting every app it managed
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Argo CD issue 6046]
tags: [argo-cd, finalizers, deletion, reinstall, incident]
---

# Argo CD issue 6046 reinstalling Argo CD into a wiped namespace started deleting every app it managed

## Scenario

On 2021-04-15 an anonymous reporter on EKS, running Argo CD v1.8.1 and then v1.8.7, wiped the `argocd` namespace and reinstalled Argo CD. The issue is now closed. [[sources/research-gap-g1-gitops-drift-incidents]] URL: https://github.com/argoproj/argo-cd/issues/6046

## What happened

After the reinstall, in the reporter's words, "Argocd now started deleting all the apps under it's management". A maintainer asked whether the Application custom resources carried the resources finalizer, which is the setting that makes deleting an Application delete the workloads it created. The dossier did not confirm the root cause, so the finalizer explanation is the maintainer's question and not an established finding.

## Why it belongs here

The report shows that the lifecycle of the GitOps agent's own objects can delete production workloads, which is a different risk from a bad commit. See [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]] and [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]].

## Related

[[entities/argo-cd]], [[concepts/finalizers]], [[findings/unintended-deletion-through-prune]]
