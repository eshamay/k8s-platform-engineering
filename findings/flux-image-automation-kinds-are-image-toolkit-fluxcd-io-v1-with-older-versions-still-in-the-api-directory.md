---
title: Flux image automation kinds are image.toolkit.fluxcd.io/v1 with older versions still in the API directory
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [flux, image-automation, api-version, v1]
---

# Flux image automation kinds are image.toolkit.fluxcd.io/v1 with older versions still in the API directory

## Observation

The current spec pages for ImageRepository, ImagePolicy, and ImageUpdateAutomation all use `image.toolkit.fluxcd.io/v1`. The image-reflector-controller spec index is headed "# image.toolkit.fluxcd.io/v1", the ImageUpdateAutomation spec example starts with `apiVersion: image.toolkit.fluxcd.io/v1`, and the ImagePolicy CRD lists `name: v1` with `served: true` and `storage: true`. The Go API directory still holds `v1beta1` and `v1beta2` packages. Both controllers' latest releases were v1.3.1, published 2026-11-20. [[sources/research-gap-o2-flux-internals]]

URLs: https://github.com/fluxcd/image-reflector-controller/blob/main/docs/spec/v1/README.md, https://github.com/fluxcd/image-automation-controller/blob/main/docs/spec/v1/imageupdateautomations.md, and https://github.com/fluxcd/image-reflector-controller/blob/main/config/crd/bases/image.toolkit.fluxcd.io_imagepolicies.yaml, all read on `main` on 2026-11-26.

## What remains unverified

The dossier did not read release notes stating when v1 graduated, so the date and the beta history are unknown. It read the ImageUpdateAutomation spec page but not that CRD's storage version, so the storage version is verified only for ImagePolicy. These pages describe `main`, which may be ahead of a cluster's installed release.

## Related

[[examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging]], [[findings/the-flux-image-update-guide-offers-semver-for-production-a-separate-push-branch-for-review-and-revert-by-narrowing-the-range]], [[entities/flux]]
