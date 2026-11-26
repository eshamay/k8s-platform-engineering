---
title: Gate Flux image automation with semver ranges, a separate push branch, or staging-only automation
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [decision, flux, image-automation, promotion, evidence-only]
---

# Gate Flux image automation with semver ranges, a separate push branch, or staging-only automation

## Status

Evidence only. The wiki makes no recommendation, because the dossier found no adopter write-up on promotion policy and the official guide does not rank its options. [[sources/research-gap-o2-flux-internals]]

## Context

Flux image automation commits a new tag to Git whenever an ImagePolicy selects one, and the normal reconcile then deploys it. A platform team must decide how much of that path may run without a human, particularly for production. The risk is documented in [[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]].

## Options

Option one is to let production follow a semver range over CI-built release tags and keep staging on `branch-sha-timestamp` tags. The guide pairs semver with production and says a bad update is reverted by narrowing the range. Option two is to point `spec.git.push.branch` at a branch other than the checkout branch so CI opens a pull request, which the guide says lets you "manually approve the image updates before they are applied on your clusters". Option three is to enable image automation only for the staging overlay, which is what the multi-tenancy reference repository does, see [[examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging]].

## Evidence and consequences

The first option keeps the whole path automatic and relies on the quality of the range and the release tags, and the revert is itself a Git commit that someone must make. The second adds a human gate and a pull request to maintain. The third gives the most separation and leaves production updates as manual edits. The guide, the reference repository, and the kinds' `v1` status are described in [[findings/the-flux-image-update-guide-offers-semver-for-production-a-separate-push-branch-for-review-and-revert-by-narrowing-the-range]] and [[findings/flux-image-automation-kinds-are-image-toolkit-fluxcd-io-v1-with-older-versions-still-in-the-api-directory]]. No measured outcome, incident, or adopter preference was found for any option.

## Related

[[findings/mutable-remote-references-change-what-a-commit-renders]], [[entities/flux]]
