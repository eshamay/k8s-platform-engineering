---
title: Deleting a CRD deletes every custom resource of that kind
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crd, deletion, data-loss]
---

# Deleting a CRD deletes every custom resource of that kind

## Observation

The dossier states that removing a CRD removes all of its custom resources, and it gives this as the reason delivery tools are cautious about deleting CRDs. The dossier calls this standard Kubernetes behavior but did not see it stated verbatim in the pages it read, so this wiki treats the claim as secondhand and unverified against a primary page. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md)

## Connection to tool behavior

The caution shows up in Helm, which will not upgrade or delete CRDs, and in the Flux CreateReplace policy, which does not delete CRDs removed from a chart. See [findings/helm-does-not-upgrade-or-delete-crds](helm-does-not-upgrade-or-delete-crds.md) and [examples/flux-helmrelease-crd-policies-createreplace-and-dependson](../examples/flux-helmrelease-crd-policies-createreplace-and-dependson.md). The official custom resources page also warns that custom resource data lives in etcd and needs backup. URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/.

## Related

[concepts/custom-resource-definition](../concepts/custom-resource-definition.md), [findings/unintended-deletion-through-prune](unintended-deletion-through-prune.md), and [findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md).
