---
title: cert-manager runs validation, defaulting, and conversion webhooks on its own CRDs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [cert-manager, webhooks, conversion, tls]
---

# cert-manager runs validation, defaulting, and conversion webhooks on its own CRDs

## Scenario

cert-manager is an operator that ships its own CRDs, so it needs the full set of API-server extension points for them: validating bad objects, filling defaults, and converting between API versions. It is the best documented example in the dossier of an operator using all three webhook roles. [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md)

## How it works

The cert-manager webhook page describes one webhook component that handles validation, defaulting, and conversion for cert-manager resources. It also describes how the webhook solves the bootstrapping problem every webhook owner faces: a self-signed CA is generated, the serving certificate is issued from it, the CA bundle is injected into the webhook configuration, and the serving certificate is renewed automatically. URL: https://cert-manager.io/docs/concepts/webhook/. Quote: "The webhook automatically renews its serving certificate before it expires."

## Lesson

The same page lists the failure modes seen in practice: API server to webhook connectivity on GKE private clusters and on EKS with custom CNIs, and an initial unavailability after install while the webhook waits for leader election, certificate generation, and CA bundle injection. These are the costs that in-process CEL avoids for validation, and they remain for conversion, where CEL has no equivalent in the sources. See [findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window](../findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window.md) and [entities/cert-manager](../entities/cert-manager.md).

## Related

[concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md), [concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md), [findings/a-down-conversion-webhook-can-stall-garbage-collection](../findings/a-down-conversion-webhook-can-stall-garbage-collection.md), and [examples/kubebuilder-operator-scaffolds-defaulting-and-validating-webhooks](kubebuilder-operator-scaffolds-defaulting-and-validating-webhooks.md).
