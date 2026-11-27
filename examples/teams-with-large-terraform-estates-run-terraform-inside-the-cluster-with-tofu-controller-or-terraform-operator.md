---
title: "Teams with large Terraform estates run Terraform inside the cluster with tofu-controller or Terraform Operator"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [use-case, terraform, tofu-controller, gitops]
---

# Teams with large Terraform estates run Terraform inside the cluster with tofu-controller or Terraform Operator

## Scenario

A team already has a large body of Terraform code and wants it reconciled under GitOps instead of rewriting it as Kubernetes-native resources. [sources/research-landscape](../sources/research-landscape.md)

## How it works

[entities/tofu-controller](../entities/tofu-controller.md) reconciles a Terraform custom resource by running plan and apply in runner pods, storing state as Kubernetes Secrets, and detecting drift by default (https://flux-iac.github.io/tofu-controller/). Manual approval is expressed in Git by putting the plan ID in `.spec.approvePlan`. [entities/terraform-operator](../entities/terraform-operator.md) similarly starts Terraform workflow pods when the manifest changes, and it stays a thin wrapper because the team still writes Terraform (https://github.com/isaaguilar/terraform-operator).

## Costs

State in Secrets, Git-based approvals, and tight coupling to Terraform and Flux releases are the main costs, see [findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions](../findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions.md). The alternative is to model resources natively in [entities/crossplane](../entities/crossplane.md), which the wiki compares in [comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply](../comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply.md).

## Related

[examples/tofu-controller-detects-terraform-drift-without-applying](tofu-controller-detects-terraform-drift-without-applying.md), [comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers](../comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers.md)

## Maintenance of the two controllers (o6 dossier)

As of 2026-11-26 tofu-controller is actively released (v0.17.0 on 2026-11-16) and Terraform Operator has had no release since v0.17.1 on 2024-05-17. See [findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api](../findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api.md), [findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer](../findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer.md), and [decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane](../decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane.md). [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)
