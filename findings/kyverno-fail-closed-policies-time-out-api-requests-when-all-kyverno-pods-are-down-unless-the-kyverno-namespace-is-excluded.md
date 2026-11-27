---
title: "Kyverno fail-closed policies time out API requests when all Kyverno pods are down unless the Kyverno namespace is excluded"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [kyverno, webhooks, outage, pitfall, verified]
---

# Kyverno fail-closed policies time out API requests when all Kyverno pods are down unless the Kyverno namespace is excluded

## Observation

The Kyverno troubleshooting guide names the failure mode. If all Kyverno pods are down and policies are fail-closed on Pods, API requests time out, which the guide says is "usually only the case when the Kyverno Namespace has not been excluded". Recovery is to "Delete the Kyverno validating and mutating webhook configurations", named `kyverno-resource-validating-webhook-cfg` and `kyverno-resource-mutating-webhook-cfg`, and Kyverno recreates them. https://raw.githubusercontent.com/kyverno/website/main/src/content/docs/docs/guides/troubleshooting.md, read 2026-11-26. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Why it matters

This is the same deadlock shape recorded for other fail-closed webhooks in [findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them](fail-closed-webhooks-can-block-the-writes-needed-to-repair-them.md). Kyverno's default exclusion of its own namespace and `kube-system` is the documented mitigation, and the three-replica minimum is the availability guidance in [findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability](kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability.md).

## Related

[entities/kyverno](../entities/kyverno.md), [findings/admission-webhook-outages-are-a-recurring-failure-class](admission-webhook-outages-are-a-recurring-failure-class.md), and [concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md).
