---
title: "Crossplane core ships one fail-closed Usage webhook and replaced its XRD and Composition webhooks with CEL"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [crossplane, webhooks, cel, admission, verified]
---

# Crossplane core ships one fail-closed Usage webhook and replaced its XRD and Composition webhooks with CEL

## Observation

Crossplane core (latest release v2.5.0; files read on main on 2026-11-26) installs one ValidatingWebhookConfiguration, `crossplane-no-usages`, with `failurePolicy: Fail`. The Helm value for the failure policy defaults to Fail and can be set to Ignore "for compatibility with managed Kubernetes operations that reject `Fail`-policy webhooks with wildcard rules", and the chart value `webhooks.enabled` is described as "Enable webhooks for Crossplane and installed Provider packages." The init code removes the former validating webhooks for CompositeResourceDefinitions and Compositions with the comment "Crossplane used to serve these webhooks, but now uses CEL validation." https://raw.githubusercontent.com/crossplane/crossplane/main/cluster/webhookconfigurations/usage.yaml, https://raw.githubusercontent.com/crossplane/crossplane/main/cluster/charts/crossplane/values.yaml and https://raw.githubusercontent.com/crossplane/crossplane/main/cmd/crossplane/core/init.go [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Why it matters

This replaces the earlier statement that the wiki made no claim about Crossplane's own webhooks. Core validation of its own APIs moved into CRD-level CEL, so the remaining core webhook is the delete-protection one. See [examples/crossplane-no-usages-webhook-blocks-deletes-of-resources-labelled-in-use](../examples/crossplane-no-usages-webhook-blocks-deletes-of-resources-labelled-in-use.md) and [entities/crossplane](../entities/crossplane.md).

## Related

[concepts/admission-webhooks-and-cel](../concepts/admission-webhooks-and-cel.md) and [comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno](../comparisons/admission-webhooks-and-failure-policies-across-crossplane-kro-argo-cd-config-connector-ack-cluster-api-gatekeeper-and-kyverno.md).
