---
title: Kyverno ValidatingPolicy generates native ValidatingAdmissionPolicy objects
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [kyverno, validating-admission-policy, cel, policy-engines]
---

# Kyverno ValidatingPolicy generates native ValidatingAdmissionPolicy objects

## Scenario

Kyverno, a CNCF project, started as a webhook-based policy engine, so enforcement depended on Kyverno's own webhook being up. Teams that want its reporting and exceptions, but not a webhook on the write path for every rule, face the availability concern described in [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]]. [[sources/research-admission-webhooks-and-cel]]

## How it works

Kyverno's ValidatingPolicy is a CEL-first policy type described as a superset of the Kubernetes ValidatingAdmissionPolicy. A ValidatingPolicy can generate native ValidatingAdmissionPolicy objects, so enforcement runs in the API server instead of in Kyverno's webhook. The extras stay with Kyverno: background scanning, policy exceptions, extended CEL libraries, PolicyReports, `messageExpressions`, and an evaluation mode for non-Kubernetes JSON payloads such as Terraform plans. URL: https://kyverno.io/docs/policy-types/validating-policy/.

## Lesson

The example shows the ecosystem moving from webhook-based engines toward CEL: the engine keeps the human-facing features and hands the hot path to the API server. The dossier did not read Kyverno's documentation on its own webhook failure policy and availability, so how much resilience the generated objects buy in practice is open; see [[open-knowledge-gaps]] and [[comparisons/kyverno-versus-native-validating-admission-policy]].

## Related

[[entities/kyverno]], [[concepts/admission-webhooks-and-cel]], and [[examples/vap-minimum-replicas-policy-with-per-environment-parameters]].
