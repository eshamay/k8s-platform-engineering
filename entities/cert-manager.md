---
title: cert-manager
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [operator, webhooks, tls, cncf]
---

# cert-manager

## What it is

cert-manager is a CNCF operator that issues and renews TLS certificates through its own CRDs. Other sources in this wiki name it as a Kubernetes add-on operator and as an example of Secrets that Flux must leave to another controller. [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md)

## Webhook role

It uses all three webhook roles on its own CRDs: validation, defaulting, and conversion. Its documentation describes a self-signed CA, automatic renewal of the serving certificate, and failure modes in practice: connectivity from the API server on GKE private clusters and EKS with custom CNIs, and an initial unavailability window after install. URL: https://cert-manager.io/docs/concepts/webhook/. See [examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks](../examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks.md) and [findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window](../findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window.md).

## Related

[concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md), [concepts/operator-pattern](../concepts/operator-pattern.md), and [examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers](../examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers.md).

## Named as a cluster add-on operator

The CNCF explainer names cert-manager as an operator for TLS certificate issuance and renewal. [sources/research-operator-pattern](../sources/research-operator-pattern.md) See [examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects](../examples/cluster-add-on-operators-turn-install-and-day-2-work-into-objects.md).
