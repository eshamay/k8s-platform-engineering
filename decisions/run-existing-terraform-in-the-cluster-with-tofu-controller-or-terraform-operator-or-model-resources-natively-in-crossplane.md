---
title: "Run existing Terraform in the cluster with tofu-controller or Terraform Operator, or model resources natively in Crossplane"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [decision, terraform, tofu-controller, terraform-operator, crossplane, evidence-only]
---

# Run existing Terraform in the cluster with tofu-controller or Terraform Operator, or model resources natively in Crossplane

## Status

Draft. This records a decision point and the evidence for each option. It makes no recommendation, because the evidence for a recommendation is missing, see [findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated](../findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated.md). [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## Context

A team with a large Terraform estate wants continuous reconciliation under Kubernetes. It can keep the Terraform code and run it inside a controller, or it can re-express the resources as Kubernetes-native objects. [examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator](../examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator.md)

## Options

**Option 1, tofu-controller.** Evidence: a flux-iac project, not archived, with releases on 2026-06-08, 2026-08-06, 2026-10-26, and 2026-11-16, five active maintainers, and the v1alpha1 API removed in v0.17.0. It runs plan and apply in runner pods, keeps state in Kubernetes Secrets, and takes approval through `.spec.approvePlan` in Git. The documented pairing for 0.16 is Terraform 1.5.7 and Flux 2.6.x. See [findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api](../findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api.md).

**Option 2, Terraform Operator.** Evidence: a GalleyBytes repository, not archived, with the latest release on 2024-05-17, the last commit on 2025-12-09, and one author behind 196 of about 206 commits. It starts Terraform workflow pods when the manifest changes, and the team still writes Terraform. No deprecation notice was found. See [findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer](../findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer.md).

**Option 3, native Crossplane resources.** Evidence: Crossplane is CNCF graduated, runs always-on controllers, and gives each resource an API object under Kubernetes RBAC. A 2022 consultancy report says it has no `terraform plan` equivalent, and that report is dated. A lab walkthrough shows a staged path through a Terraform provider inside Crossplane, with no production use. The evidence for this option comes from sources with a stake or from old posts. See [examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane](../examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane.md) and [comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply](../comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply.md).

## Consequences

Options 1 and 2 keep Terraform code and state semantics and add a controller to operate. Option 3 changes the resource model and needs a hosting cluster and Kubernetes skills. Which consequence a team can carry depends on facts the dossier does not hold, such as measured drift-correction latency or independent migration reports. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[entities/tofu-controller](../entities/tofu-controller.md), [entities/terraform-operator](../entities/terraform-operator.md), [entities/crossplane](../entities/crossplane.md), [entities/upjet](../entities/upjet.md)
