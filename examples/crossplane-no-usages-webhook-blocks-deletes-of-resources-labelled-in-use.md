---
title: "Crossplane's crossplane-no-usages webhook blocks deletes of resources labelled in-use"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [crossplane, webhooks, usage, failure-policy, verified]
---

# Crossplane's crossplane-no-usages webhook blocks deletes of resources labelled in-use

## Scenario

Crossplane core installs a ValidatingWebhookConfiguration named `crossplane-no-usages` that fires on DELETE for any resource carrying the label `crossplane.io/in-use=true`, with `failurePolicy: Fail`. The chart value lets operators set Ignore for managed Kubernetes services that reject Fail-policy webhooks with wildcard rules, and the chart comment names an AKS cluster stop as the case. https://raw.githubusercontent.com/crossplane/crossplane/main/cluster/webhookconfigurations/usage.yaml [[sources/research-gap-m6-admission-crds]]

## Reliability

VERIFIED from the default-branch file; release v2.5.0 is the latest tag and the file can be ahead of it.

## Related

[[findings/crossplane-core-ships-one-fail-closed-usage-webhook-and-replaced-its-xrd-and-composition-webhooks-with-cel]] and [[entities/crossplane]].
