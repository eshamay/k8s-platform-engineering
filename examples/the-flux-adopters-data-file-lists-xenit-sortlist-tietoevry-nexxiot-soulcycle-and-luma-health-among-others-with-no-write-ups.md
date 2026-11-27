---
title: "The Flux adopters data file lists Xenit, Sortlist, Tietoevry, Nexxiot, SoulCycle, and Luma Health among others, with no write-ups"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [flux, adopters, gitops, self-reported]
---

# The Flux adopters data file lists Xenit, Sortlist, Tietoevry, Nexxiot, SoulCycle, and Luma Health among others, with no write-ups

## Scenario

The Flux website repository keeps its adopter list as a data file at https://github.com/fluxcd/website/blob/main/data/adopters/1-flux-v2.yaml. The dossier read it on 2026-11-26 and found, among other entries, Xenit, Sortlist, Tietoevry, Nexxiot, SoulCycle and Luma Health. [sources/research-gap-o1-argocd-flux-gitops](../sources/research-gap-o1-argocd-flux-gitops.md)

## What the dossier found

The entries are names in a list. No migration story, incident report or measurement was read for any of them, so what these organizations do with Flux, and how well it works, is UNVERIFIED. The Argo CD counterpart is `USERS.md`, which opens "Currently, the following organizations are **officially** using Argo CD" and lists Adobe, IBM, Intuit, Red Hat and Tesla among 461 lines on 2026-11-26, see [examples/the-argo-cd-users-file-lists-452-self-reported-adopters](the-argo-cd-users-file-lists-452-self-reported-adopters.md) for the earlier count of 452 entries. URL: https://github.com/argoproj/argo-cd/blob/main/USERS.md.

## Why it belongs here

It shows the limit of named-adopter evidence for both GitOps tools: lists exist, write-ups do not. A search of `fluxcd/flux2` for `CHANGELOG.md`, `docs/adopters.md` and `ADOPTERS.md` returned 404, so the website data file is the primary list. See [examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding](morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding.md) for the one Flux adopter write-up the wiki holds.
