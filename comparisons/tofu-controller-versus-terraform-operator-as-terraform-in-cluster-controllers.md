---
title: "tofu-controller versus Terraform Operator as Terraform-in-cluster controllers"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [comparison, terraform, tofu-controller, terraform-operator]
---

# tofu-controller versus Terraform Operator as Terraform-in-cluster controllers

Both projects wrap existing Terraform code in a CRD and run it in pods, so neither removes the need to write Terraform. The dossier read only each project's own documentation. [[sources/research-landscape]]

| Aspect | [[entities/tofu-controller]] | [[entities/terraform-operator]] |
|---|---|---|
| Family | Flux family (flux-iac) | Independent community project (isaaguilar) |
| Trigger | Reconciles a Terraform custom resource | Starts workflow pods when the manifest changes |
| State | Kubernetes Secrets | Not described by the dossier |
| Drift | Detected by default, with fixes | Not described by the dossier |
| Approval | Plan ID in `.spec.approvePlan` via Git | Not described by the dossier |
| Version coupling | Version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x | Not described by the dossier |
| Maintenance | Unchecked after Weaveworks' wind-down | Last release unchecked |

## Reading the comparison

The table has many blanks on the Terraform Operator side because the dossier read only a short README. The wiki does not fill them from general knowledge. For the Kubernetes-native alternative, see [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]].

## Related

[[findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions]], [[concepts/tooling-landscape]]
