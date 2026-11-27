---
title: API evolution breaks webhooks that drop unknown fields
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, webhooks, upgrades, api-evolution]
---

# API evolution breaks webhooks that drop unknown fields

## Observation

A webhook built against an older version of an API can silently drop fields it does not know about. The dossier cites the Pod API gaining sidecar containers in Kubernetes v1.29 as the example, and the good-practices page therefore recommends testing webhooks across minor upgrades. The page also recommends patching only the fields a webhook needs, which limits the damage. URL: https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/. [sources/research-admission-webhooks-and-cel](../sources/research-admission-webhooks-and-cel.md)

## Limits of the evidence

The dossier gives the mechanism and the v1.29 example only as a summary and did not read a concrete incident. How often this happens for CRDs is unknown.

## Related

[findings/unknown-fields-are-silently-pruned-under-structural-schemas](unknown-fields-are-silently-pruned-under-structural-schemas.md), [findings/mutating-webhooks-can-run-repeatedly-and-in-no-guaranteed-order](mutating-webhooks-can-run-repeatedly-and-in-no-guaranteed-order.md), and [concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md).
