---
title: "ACK ships one Helm chart per service with its CRDs in the chart, and no written API version policy was found"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [ack, crd, helm, versioning, verified]
---

# ACK ships one Helm chart per service with its CRDs in the chart, and no written API version policy was found

## Observation

The ACK install doc says "Each ACK service controller has a separate Helm chart" that installs the controller, its CRDs and RBAC. The s3-controller v1.16.0 chart carries three CRDs in `helm/crds`, the bucket CRD being 75,208 bytes. The shared runtime has a webhook registry, but only for conversion. The install doc tells users to check CRD changes before upgrades. https://raw.githubusercontent.com/aws-controllers-k8s/community/main/docs/content/docs/user-docs/install.md and https://github.com/aws-controllers-k8s/s3-controller/tree/main/helm/crds, read 2026-11-26. [[sources/research-gap-m6-admission-crds]]

## Not found

A written ACK API-version stability policy was searched for in the community docs tree and not found. That is UNVERIFIED, not evidence that no policy exists.

## Related

[[findings/helm-does-not-upgrade-or-delete-crds]], [[entities/ack]], and [[findings/kro-and-ack-ship-no-admission-webhook-and-rely-on-crd-schema-and-cel-validation-and-no-argo-cd-webhook-was-found-in-a-tree-search-only]].
