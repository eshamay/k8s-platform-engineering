---
title: Deleting or recreating an Argo CD parent can cascade to everything it managed
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, deletion, app-of-apps, applicationset, namespace, prune]
---

# Deleting or recreating an Argo CD parent can cascade to everything it managed

## Observation

Three anonymous Argo CD issues show deletion reaching further than the person who triggered it expected. In issue 6046 (2021), reinstalling Argo CD into a wiped namespace was followed by Argo CD deleting all the apps it managed. In issue 20440 (v2.6.6, open when read), a deleted ApplicationSet-generated Application took its managed resources, namespaces, and Argo CD itself with it, and a second reporter saw the same with app-of-apps. In issue 15441 (2023), removing an explicit Namespace manifest in favor of `CreateNamespace=true` deleted and recreated the namespace during the sync. [[sources/research-gap-g1-gitops-drift-incidents]]

## What is and is not established

All three are reporters' accounts with no named organization. Only issue 6046 gets a hint at cause, since a maintainer asked whether the Application custom resources carried the resources finalizer, which is the setting that cascades an Application delete to its workloads, see [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]]. Issue 20440 had no root cause found. The common thread is that deleting the parent object, or a manifest that owns a namespace, is treated as an instruction to delete the children.

## Mitigations

Check whether Applications carry the resources finalizer before deleting or recreating them, avoid deleting the namespace that holds the agent's own Applications, and review what a source change deletes, including implicit namespaces, before it merges. These are inferences from the reports and the finalizer documentation and not tested advice.

## Related

[[findings/unintended-deletion-through-prune]], [[examples/argo-cd-issue-6046-reinstalling-argo-cd-into-a-wiped-namespace-started-deleting-every-app-it-managed]], [[examples/argo-cd-issue-20440-an-applicationset-generated-application-was-deleted-with-its-namespaces-and-argo-cd-itself]], [[examples/argo-cd-issue-15441-removing-a-namespace-manifest-under-createnamespace-deleted-and-recreated-the-namespace]], [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]]
