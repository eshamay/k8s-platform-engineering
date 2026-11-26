---
title: Admission webhook outages are a recurring failure class
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [pitfall, webhooks, postmortems, availability]
---

# Admission webhook outages are a recurring failure class

## Observation

The k8s.af index of public Kubernetes failure stories surfaces several webhook-related postmortems. Its entries include a 2019 Jetstack post about an admission webhook outage and an Airbnb KubeCon NA 2020 talk that cites a mutating admission webhook in outages. One index entry reads "ValidatingWebhookConfiguration caused prolonged downtime, nodes lost, and failed master upgrades." URL: https://k8s.af/. [[sources/research-custom-resource-definition]]

## Limits of the evidence

The dossier did not open the linked posts, so these are index-level descriptions and not verified accounts. The postmortems are also not CRD-specific. They illustrate the same blast-radius pattern as [[findings/a-down-conversion-webhook-can-stall-garbage-collection]], in which a webhook that sits on the request path turns its own outage into a cluster-wide problem. A gap asks for the postmortems to be read directly.

## Related

[[concepts/admission-webhooks-and-cel]], [[comparisons/cel-validation-rules-versus-validating-webhooks]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], and [[open-knowledge-gaps]].
