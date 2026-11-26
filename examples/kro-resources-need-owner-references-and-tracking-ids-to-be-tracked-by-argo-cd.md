---
title: kro resources need owner references and tracking IDs to be tracked by Argo CD
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [kro, argo-cd, gitops, tracking, owner-references]
---

# kro resources need owner references and tracking IDs to be tracked by Argo CD

## Scenario

A team commits a kro instance to Git and lets Argo CD apply it. Argo CD sees only the top-level instance, while kro creates the children, so Argo CD cannot show or track the children unless they carry the right markers. [[sources/research-composite-resource]]

## How it works

The kro FAQ gives a recipe: add an `ownerReference` and an `argocd.argoproj.io/tracking-id` annotation to every templated resource, with a warning about owner reference limits. With those markers Argo CD attributes the children to the Application. The same FAQ shows a Helm-style checksum trick that restarts a Deployment when a ConfigMap changes. URL: https://kro.run/docs/faq. The dossier found no Flux-specific guidance.

## Why the example matters

It shows the seam between two reconcile loops. The GitOps agent sees one object, the composition layer fans it out, and the markers are what let the outer tool follow the inner one. Crossplane has a parallel recipe, see [[examples/crossplane-resources-hosted-by-argo-cd]], and a related pitfall on deletion is in [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]]. See [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]], [[entities/argo-cd]], and [[entities/kro]].
