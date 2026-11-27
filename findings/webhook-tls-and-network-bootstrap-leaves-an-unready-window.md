---
title: Webhook TLS and network bootstrap leaves an unready window
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, webhooks, tls, cabundle, connectivity]
---

# Webhook TLS and network bootstrap leaves an unready window

## Observation

Every webhook owner must solve certificate and network bootstrapping. The cert-manager webhook page documents two practical failure modes. The first is connectivity from the API server to the webhook on GKE private clusters and on EKS with custom CNIs. The second is an initial unavailability after install, while the webhook waits for leader election, certificate generation, and CA bundle injection. cert-manager addresses TLS with a self-signed CA and automatic renewal of the serving certificate. URL: https://cert-manager.io/docs/concepts/webhook/. [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md)

## Why it matters

During the window a webhook that is registered with `failurePolicy: Fail` can reject or stall matching writes, which ties this pitfall to [findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them](fail-closed-webhooks-can-block-the-writes-needed-to-repair-them.md). The Kubernetes reference adds that the API server authenticates to the webhook using kubeconfig-based credentials and mutual TLS, so credential and CA configuration is part of the contract.

## Related

[examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks](../examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks.md), [entities/cert-manager](../entities/cert-manager.md), and [concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md).
