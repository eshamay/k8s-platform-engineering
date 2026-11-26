---
title: Kyverno
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
aliases: []
tags: [policy-engine, admission, cel, cncf]
---

# Kyverno

## What it is

Kyverno is a CNCF project and Kubernetes policy engine. It started as a webhook-based engine and now offers CEL-based policy types, the first documented in the dossier being ValidatingPolicy, described as a superset of the Kubernetes ValidatingAdmissionPolicy. [[sources/research-admission-webhooks-and-cel]]

## What the dossier establishes

ValidatingPolicy adds background scanning, policy exceptions, extended CEL libraries, PolicyReports, `messageExpressions`, and an evaluation mode for non-Kubernetes JSON payloads such as Terraform plans. A ValidatingPolicy can generate native ValidatingAdmissionPolicy objects so enforcement runs in the API server rather than in Kyverno's webhook. URL: https://kyverno.io/docs/policy-types/validating-policy/. See [[examples/kyverno-validatingpolicy-generates-native-vap-objects]] and [[comparisons/kyverno-versus-native-validating-admission-policy]].

## Not established

Kyverno's own webhook `failurePolicy` and availability behavior were not read, so its failure modes are unknown here. See [[open-knowledge-gaps]].

## Related

[[concepts/admission-webhooks-and-cel]]
