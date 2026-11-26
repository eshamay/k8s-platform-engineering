---
title: The Argo CD USERS file lists 452 self-reported adopters
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: [Argo CD adopters list]
tags: [argo-cd, adopters, gitops, adoption, self-reported]
---

# The Argo CD USERS file lists 452 self-reported adopters

## Scenario

Argo CD keeps a `USERS.md` file at https://github.com/argoproj/argo-cd/blob/master/USERS.md. It opens with "Currently, the following organizations are **officially** using Argo CD", and organizations add themselves through pull requests. [[sources/research-gap-g1-gitops-drift-incidents]]

## What the dossier found

The dossier counted 452 numbered entries on 2026-11-26, and the file last changed on 2026-11-23. The count is the dossier's own and the list is self-reported and unaudited. It gives no outage information. It is the largest primary adopter list the wiki has for a GitOps tool, compared with the more than 200 organizations on the Flux adopters page described in [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].

A press repost of a CNCF release also says "Nearly 60% of Kubernetes clusters managed by survey respondents now rely on Argo CD". That is SECONDARY-ONLY, because the original was not read at cncf.io and the survey year could not be reproduced from the reposted page. See https://aijourn.com/cncf-end-user-survey-finds-argo-cd-as-majority-adopted-gitops-solution-for-kubernetes/.

## Why it belongs here

It answers "who uses it" at the level of names and counts, and it cannot answer "what went wrong", since no entry is tied to an incident. See [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]].

## Related

[[entities/argo-cd]], [[examples/intuit-argo-cd-gitops-origin]], [[examples/subaru-adopted-argo-cd-with-helmfile-to-replace-manual-deployment-procedures]]

## Update 2026-11-26 (o1 dossier)

A later read of the same file counted 461 lines, naming Adobe, IBM, Intuit, Red Hat and Tesla among others. The difference from 452 is probably header and non-entry lines, and the dossier did not re-count entries, so the 452 count stands as the entry count. See [[examples/the-flux-adopters-data-file-lists-xenit-sortlist-tietoevry-nexxiot-soulcycle-and-luma-health-among-others-with-no-write-ups]] and [[sources/research-gap-o1-argocd-flux-gitops]].
