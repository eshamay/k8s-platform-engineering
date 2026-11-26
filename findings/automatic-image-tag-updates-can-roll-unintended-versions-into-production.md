---
title: Automatic image tag updates can roll unintended versions into production
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [pitfall, flux, image-automation, promotion]
---

# Automatic image tag updates can roll unintended versions into production

## Observation

Flux image automation commits a new tag to Git whenever an ImagePolicy selects one, and the normal reconcile then deploys it. The dossier warns that the policy must be chosen with care to avoid unintended rollouts, and the multi-tenancy reference repository restricts image automation to staging. A loose regex or a semver range that is wider than intended can promote a release nobody reviewed. The dossier also lists third-party OCI chart tags as a pitfall, since a tag that can be moved changes what a commit renders. [[sources/research-flux-deep-dive]]

## Mitigations

Use narrow semver ranges, keep production on reviewed pull requests, and pin by digest where the registry allows it.

## Related

[[examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging]], [[findings/mutable-remote-references-change-what-a-commit-renders]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[entities/flux]]

## Documented controls from the o2 dossier

The image update guide offers semver ranges for production, a separate push branch for pull-request approval, and revert by narrowing the semver range, but it prescribes no policy beyond those choices. See [[findings/the-flux-image-update-guide-offers-semver-for-production-a-separate-push-branch-for-review-and-revert-by-narrowing-the-range]] and [[decisions/gate-flux-image-automation-with-semver-ranges-a-separate-push-branch-or-staging-only-automation]]. The page is promoted to active because the guide is primary documentation, while the risk itself still has no named incident. [[sources/research-gap-o2-flux-internals]]
