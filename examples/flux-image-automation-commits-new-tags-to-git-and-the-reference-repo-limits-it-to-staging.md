---
title: Flux image automation commits new tags to Git and the reference repo limits it to staging
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [use-case, flux, image-automation, promotion, gitops]
---

# Flux image automation commits new tags to Git and the reference repo limits it to staging

## Scenario

A team wants patch releases and CVE fixes to reach a cluster without anyone editing a manifest by hand, while still keeping Git as the record of what was deployed. The Flux image update guide describes this as a way to "automatically deploy application patches (CVEs and bug fixes), and keep a record of all deployments in Git history." [[sources/research-flux-deep-dive]]

## How it works

Three custom resources split the job. An ImageRepository scans a container registry for tags. An ImagePolicy chooses one tag using semver, calver, or regex rules. An ImageUpdateAutomation edits YAML files at marker comments of the form `$imagepolicy`, commits the change, and pushes it to Git. The ordinary Flux loop then fetches the new revision and applies it, so the cluster only changes through Git and the history stays the audit trail.

The multi-tenancy reference repository enables this only for the staging overlay, which keeps automatic tag changes away from production. The dossier read the guide as a digest, so the current API versions and any beta status still need checking.

## Related

[[entities/flux]], [[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]], [[findings/mutable-remote-references-change-what-a-commit-renders]], [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]], [[examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation]]
