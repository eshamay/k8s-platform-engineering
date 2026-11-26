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
aliases: []
tags: [operator, webhooks, tls, cncf]
---

# cert-manager

## What it is

cert-manager is a CNCF operator that issues and renews TLS certificates through its own CRDs. Other sources in this wiki name it as a Kubernetes add-on operator and as an example of Secrets that Flux must leave to another controller. [[sources/research-admission-webhooks-and-cel]]

## Webhook role

It uses all three webhook roles on its own CRDs: validation, defaulting, and conversion. Its documentation describes a self-signed CA, automatic renewal of the serving certificate, and failure modes in practice: connectivity from the API server on GKE private clusters and EKS with custom CNIs, and an initial unavailability window after install. URL: https://cert-manager.io/docs/concepts/webhook/. See [[examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks]] and [[findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window]].

## Related

[[concepts/admission-webhooks-and-cel]], [[concepts/operator-pattern]], and [[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]].
