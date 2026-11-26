---
title: "Teams with large Terraform estates run Terraform inside the cluster with tofu-controller or Terraform Operator"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [use-case, terraform, tofu-controller, gitops]
---

# Teams with large Terraform estates run Terraform inside the cluster with tofu-controller or Terraform Operator

## Scenario

A team already has a large body of Terraform code and wants it reconciled under GitOps instead of rewriting it as Kubernetes-native resources. [[sources/research-landscape]]

## How it works

[[entities/tofu-controller]] reconciles a Terraform custom resource by running plan and apply in runner pods, storing state as Kubernetes Secrets, and detecting drift by default (https://flux-iac.github.io/tofu-controller/). Manual approval is expressed in Git by putting the plan ID in `.spec.approvePlan`. [[entities/terraform-operator]] similarly starts Terraform workflow pods when the manifest changes, and it stays a thin wrapper because the team still writes Terraform (https://github.com/isaaguilar/terraform-operator).

## Costs

State in Secrets, Git-based approvals, and tight coupling to Terraform and Flux releases are the main costs, see [[findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions]]. The alternative is to model resources natively in [[entities/crossplane]], which the wiki compares in [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]].

## Related

[[examples/tofu-controller-detects-terraform-drift-without-applying]], [[comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers]]
