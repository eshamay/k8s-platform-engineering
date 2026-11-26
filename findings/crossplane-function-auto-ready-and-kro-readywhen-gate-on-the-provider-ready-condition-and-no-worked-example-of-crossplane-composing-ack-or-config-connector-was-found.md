---
title: Crossplane function-auto-ready and kro readyWhen gate on the provider Ready condition, and no worked example of Crossplane composing ACK or Config Connector was found
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [crossplane, kro, ack, config-connector, readiness, composition]
---

# Crossplane function-auto-ready and kro readyWhen gate on the provider Ready condition, and no worked example of Crossplane composing ACK or Config Connector was found

## Observation

Crossplane's `function-auto-ready` (v0.7.4, 2026-11-24) considers a composed resource ready if it appears in observed state and, for a kind that is not built in, "the composed resource has the status condition `type: Ready`, `status: True`." URL: https://github.com/crossplane-contrib/function-auto-ready/blob/main/README.md. ACK defines a `Ready` condition that its runtime source says is "equivalent to the ResourceSynced condition type" (https://github.com/aws-controllers-k8s/runtime/blob/main/apis/core/v1alpha1/conditions.go), and Config Connector reports `Ready` with reason `UpToDate`. On paper both satisfy the function. [[sources/research-gap-o3-gitops-provider-managed]]

kro's readiness page says `readyWhen` is a list of CEL expressions, and that without it "Resources are ready once created and all their CEL expression references resolve", with dependents in a ResourceGraphDefinition waiting for readiness. URL: https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/concepts/reconciliation/02-readiness.md.

## What was not found

No Crossplane documentation or example composing ACK or Config Connector objects was found, and no first-party test of the interplay. The claim that ACK and Config Connector satisfy `function-auto-ready` is an inference from documented conditions and was not tested in a composition. Crossplane's provider-kubernetes Object wrapper and its readiness policy were not read. Whether composite deletion (foreground or background) honors ACK or Config Connector deletion ordering is not settled.

## Related

[[findings/a-crossplane-composed-resource-counts-as-ready-only-when-the-function-sets-ready-true-so-unspecified-readiness-leaves-the-xr-creating]], [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]], [[entities/crossplane]], [[entities/kro]], [[examples/the-ack-docs-kro-guide-composes-an-s3-bucket-a-dynamodb-table-and-a-deployment-and-deletes-the-deployment-before-the-aws-resources]]
