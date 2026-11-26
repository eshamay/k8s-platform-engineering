---
title: "ApplicationSet generators have documented limits: matrix takes two children, nesting is once, and pull request polling defaults to 30 minutes"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, applicationset, generators, limits]
---

# ApplicationSet generators have documented limits: matrix takes two children, nesting is once, and pull request polling defaults to 30 minutes

## Observation

The ApplicationSet generator pages document several limits. The matrix generator "currently only supports combining the outputs of only two child generators". "Combination-type generators (matrix or merge) can only be nested once." The Pull Request generator "polls every `requeueAfterSeconds` interval (defaulting to every 30 minutes)" and "will make anonymous requests which have a lower rate limit" when no token is configured. The OCI generator polls "defaulting to every 3 minutes", with a webhook refresh option. URLs under https://github.com/argoproj/argo-cd/blob/main/docs/operator-manual/applicationset/: Generators-Matrix.md, Generators-Pull-Request.md, Generators-OCI.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [[sources/research-gap-o1-argocd-flux-gitops]]

## The generator count

The overview page says "As of this writing there are nine generators:" and then lists ten, because the OCI generator was added to the list. The wording is a stale count and not a missing generator. URL: https://github.com/argoproj/argo-cd/blob/main/docs/operator-manual/applicationset/Generators.md.

## The Cluster generator

The Cluster generator works "based on the list of clusters defined within (and managed by) Argo CD", reacts to cluster additions and removals, and "will automatically target both local and non-local clusters" unless a selector excludes the local one. URL: https://github.com/argoproj/argo-cd/blob/main/docs/operator-manual/applicationset/Generators-Cluster.md. The dossier found no quantified scale limit for ApplicationSet or hub-and-spoke Argo CD, which is UNVERIFIED and not a claim that none exists.

## Related

[[entities/argo-cd]], [[findings/argo-cd-reaches-into-registered-clusters-from-a-hub-and-the-argocd-agent-pull-model-is-a-labs-project-of-unverified-maturity]], [[examples/argo-cd-issue-20440-an-applicationset-generated-application-was-deleted-with-its-namespaces-and-argo-cd-itself]]
