---
title: "The ApplicationSet create-only policy does not stop owner-reference deletion of Applications"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, applicationset, deletion, policy]
---

# The ApplicationSet create-only policy does not stop owner-reference deletion of Applications

## Observation

The ApplicationSet controller has a `--policy` setting that limits what the controller may do to generated Applications, such as create-only. The page that documents it says the policy "doesn't prevent Application controller from deleting Applications according to ownerReferences". Deleting the ApplicationSet can therefore still delete the Applications it generated through the owner references, whatever the policy says. URL: https://github.com/argoproj/argo-cd/blob/main/docs/operator-manual/applicationset/Controlling-Resource-Modification.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [sources/research-gap-o1-argocd-flux-gitops](../sources/research-gap-o1-argocd-flux-gitops.md)

## Why it matters

Create-only is the closest thing in the two tools' documentation to an observe-only stance, and the dossier found no Argo CD or Flux feature that matches Crossplane's Observe management policy. The limit above means create-only protects Applications from edits by the ApplicationSet controller but not from a cascade, which is the mechanism behind [examples/argo-cd-issue-20440-an-applicationset-generated-application-was-deleted-with-its-namespaces-and-argo-cd-itself](../examples/argo-cd-issue-20440-an-applicationset-generated-application-was-deleted-with-its-namespaces-and-argo-cd-itself.md) and the wider pattern in [findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed](deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed.md).

## Related

[entities/argo-cd](../entities/argo-cd.md), [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md)
