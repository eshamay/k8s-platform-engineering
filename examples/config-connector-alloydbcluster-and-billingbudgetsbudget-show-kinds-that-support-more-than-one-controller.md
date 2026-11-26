---
title: "Config Connector AlloyDBCluster and BillingBudgetsBudget show kinds that support more than one controller"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [AlloyDBCluster controller, BillingBudgetsBudget controller]
tags: [config-connector, controllers, direct, terraform, dcl, static-config]
---

# Config Connector AlloyDBCluster and BillingBudgetsBudget show kinds that support more than one controller

## What the source shows

The controller-types page uses AlloyDBCluster as its example: the kind defaults to the Terraform-based controller and supports both Direct and Terraform. The static table shows the same pattern for BillingBudgetsBudget with DCL as the default: `{DefaultController: k8s.ReconcilerTypeDCL, SupportedControllers: []k8s.ReconcilerType{k8s.ReconcilerTypeDCL, k8s.ReconcilerTypeDirect}}`. [[sources/research-gap-o9-cadence-and-staleness]] https://docs.cloud.google.com/config-connector/docs/concepts/controller-types and https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/resourceconfig/static_config.go

## What it means

These two are members of the groups of kinds that run a legacy controller by default while a direct controller is available: 66 Terraform-default kinds and 15 DCL-default kinds also support Direct. Moving such a kind to direct is a choice the namespace override or the per-resource annotation can make, see [[findings/config-connector-routes-a-kind-to-its-controller-by-namespace-override-then-static-default-and-a-live-crd-label-shows-which-one-runs]]. The page does not state when either kind will change its default.

## Related

[[findings/config-connector-s-static-config-table-lists-814-kinds-and-sets-direct-as-the-default-for-539-of-them]], [[decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource]], [[entities/config-connector]]
