---
title: The Flux image update guide offers semver for production, a separate push branch for review, and revert by narrowing the range
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [flux, image-automation, promotion, policy, guide]
---

# The Flux image update guide offers semver for production, a separate push branch for review, and revert by narrowing the range

## Observation

The official image update guide describes three controls and stops there. Production uses semver-selected release tags built by CI, while staging uses `branch-sha-timestamp` tags chosen by numerical or alphabetical policies. Setting `spec.git.push.branch` to a branch different from the checkout branch lets CI open a pull request, and the guide says "This way you can manually approve the image updates before they are applied on your clusters." A bad update is undone by narrowing the semver range, since "you can tell Flux to revert the image tag to a previous version". The guide frames the aim as to "automatically deploy application patches (CVEs and bug fixes)". [[sources/research-gap-o2-flux-internals]]

URL: https://github.com/fluxcd/website/blob/main/content/en/flux/guides/image-update.md, read on `main` on 2026-11-26. ImagePolicy also has a `digestReflectionPolicy` field whose documented default is `Never`, and ImageUpdateAutomation commit messages summarize changes through a template.

## What the guide does not say

The guide does not prescribe a policy for keeping automatic updates out of production beyond the choices above. No third-party adopter write-up on staging-only or reviewed promotion was found, because web search returned nothing and only the guide was read. The safe promotion policy that adopters actually use therefore remains an open question.

## Related

[[decisions/gate-flux-image-automation-with-semver-ranges-a-separate-push-branch-or-staging-only-automation]], [[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]], [[findings/flux-image-automation-kinds-are-image-toolkit-fluxcd-io-v1-with-older-versions-still-in-the-api-directory]], [[examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging]]
