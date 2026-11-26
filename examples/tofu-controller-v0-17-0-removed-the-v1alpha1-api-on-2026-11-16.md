---
title: "tofu-controller v0.17.0 removed the v1alpha1 API on 2026-11-16"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [tofu-controller, release, api-removal, v1alpha2, breaking-change]
---

# tofu-controller v0.17.0 removed the v1alpha1 API on 2026-11-16

## Scenario

A team runs Terraform resources under tofu-controller with manifests written against the `v1alpha1` API and plans to upgrade to the newest release. [[sources/research-gap-o6-platform-landscape]]

## What happened

The release v0.17.0 was published on 2026-11-16 (https://github.com/flux-iac/tofu-controller/releases), and its changelog lists "v1alpha1 API removed" as a breaking change, so only `v1alpha2` remains. The preceding release, v0.16.6, appeared on 2026-10-26. Manifests still on `v1alpha1` therefore need migration before the upgrade, which is the usual consequence of a removed served version and is the same category of work the wiki describes in [[concepts/crd-versioning-and-storage-migration]]. The dossier did not read the migration notes, so how the project advises doing it is unknown. [[sources/research-gap-o6-platform-landscape]]

## Related

[[entities/tofu-controller]], [[findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api]]
