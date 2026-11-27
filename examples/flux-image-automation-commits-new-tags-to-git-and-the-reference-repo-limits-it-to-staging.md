---
title: Flux image automation commits new tags to Git and the reference repo limits it to staging
type: example
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
tags: [use-case, flux, image-automation, promotion, gitops]
---

# Flux image automation commits new tags to Git and the reference repo limits it to staging

## Scenario

A team wants patch releases and CVE fixes to reach a cluster without anyone editing a manifest by hand, while still keeping Git as the record of what was deployed. The Flux image update guide describes this as a way to "automatically deploy application patches (CVEs and bug fixes), and keep a record of all deployments in Git history." [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## How it works

Three custom resources split the job. An ImageRepository scans a container registry for tags. An ImagePolicy chooses one tag using semver, calver, or regex rules. An ImageUpdateAutomation edits YAML files at marker comments of the form `$imagepolicy`, commits the change, and pushes it to Git. The ordinary Flux loop then fetches the new revision and applies it, so the cluster only changes through Git and the history stays the audit trail.

The multi-tenancy reference repository enables this only for the staging overlay, which keeps automatic tag changes away from production. The dossier read the guide as a digest, so the current API versions and any beta status still need checking.

## Related

[entities/flux](../entities/flux.md), [findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production](../findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production.md), [findings/mutable-remote-references-change-what-a-commit-renders](../findings/mutable-remote-references-change-what-a-commit-renders.md), [examples/argo-cd-app-of-apps-out-of-sync-from-image-updater](argo-cd-app-of-apps-out-of-sync-from-image-updater.md), [examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation](flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation.md)

## Correction: current API version

Correction note, 2026-11-26: the How it works section above says the current API versions and any beta status still need checking. The o2 dossier found that the current spec pages for all three kinds use `image.toolkit.fluxcd.io/v1`, with v1 served and stored for ImagePolicy and controller releases at v1.3.1. See [findings/flux-image-automation-kinds-are-image-toolkit-fluxcd-io-v1-with-older-versions-still-in-the-api-directory](../findings/flux-image-automation-kinds-are-image-toolkit-fluxcd-io-v1-with-older-versions-still-in-the-api-directory.md). The date v1 was introduced remains unknown. The promotion options are in [findings/the-flux-image-update-guide-offers-semver-for-production-a-separate-push-branch-for-review-and-revert-by-narrowing-the-range](../findings/the-flux-image-update-guide-offers-semver-for-production-a-separate-push-branch-for-review-and-revert-by-narrowing-the-range.md). [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)
