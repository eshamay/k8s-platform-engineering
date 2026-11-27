---
title: Terraform
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: medium-terraform-opentofu-crossplane
    hash: 13ec64862460
    ingested: 2026-11-26
  - id: medium-config-connector-pitfalls
    hash: c5b9825d753a
    ingested: 2026-11-26
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: [OpenTofu]
tags: [tool, iac, comparison]
---

# Terraform

A command-line infrastructure-as-code tool, with OpenTofu as its open-source fork, that computes a plan against a state file and applies it when a person or a CI job runs it. In the Crossplane project's framing, "Crossplane is a control plane, where Terraform is a command-line tool — an interface to control planes." [sources/research-crossplane-deep-dive](../sources/research-crossplane-deep-dive.md)

## Role in this wiki

The wiki treats Terraform mainly as the contrast case for Kubernetes-native reconciliation. It is on-demand, state-file based, and reviewable through a plan, where [entities/crossplane](crossplane.md) reconciles continuously and corrects drift. The Crossplane blog concedes that Terraform is simpler and more familiar. The comparison is in [comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply](../comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply.md).

## Bridges into the Kubernetes world

[entities/upjet](upjet.md) generates Crossplane providers from Terraform providers, and [entities/tofu-controller](tofu-controller.md) runs Terraform or OpenTofu from Flux-style resources with a detection-only drift model. Encore also lists Terraform and OpenTofu, Pulumi, and AWS CDK as the main alternatives to Crossplane.

## To research

State locking details, drift behavior in practice, and neutral comparisons with Kubernetes-native tools were not covered by the dossier.

## Terraform inside the cluster

Two controllers run Terraform from Kubernetes custom resources, [entities/tofu-controller](tofu-controller.md) and [entities/terraform-operator](terraform-operator.md), and both still require writing Terraform. See [examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator](../examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator.md). [sources/research-landscape](../sources/research-landscape.md)

## A practitioner's comparison with Config Connector

A 2023 Medium post by a Config Connector user says Terraform's strength is its dependency graph, inferred from references and extendable with `depends_on`, and its weaknesses are the HCL entry barrier for developers and the need to understand state, while Config Connector is fully declarative but supports only Google Cloud. This is one practitioner's opinion and not a controlled comparison. [sources/medium-config-connector-pitfalls](../sources/medium-config-connector-pitfalls.md)

## A practitioner's OpenTofu framework and plan-review argument (secondary)

A Medium post by Gavin Yap (2025-01-10) describes Terraform and OpenTofu with an S3 state backend and DynamoDB or, from Terraform 1.10, the experimental `use_lockfile` option for locking, and a chicken-and-egg problem when the backend bucket must exist first. He values `terraform plan` as a preview before changes to production data, and recommends scheduled CI jobs for reconciliation. His own framework puts short YAML definitions in front of HCL, with GitLab merge requests for self-service. See [examples/a-practitioner-prefers-a-yaml-abstracted-opentofu-framework-with-gitlab-merge-requests-over-crossplane-and-a-portal](../examples/a-practitioner-prefers-a-yaml-abstracted-opentofu-framework-with-gitlab-merge-requests-over-crossplane-and-a-portal.md) and [findings/one-practitioner-reports-a-terraform-plan-that-showed-an-update-while-the-apply-recreated-the-resource-and-lost-data](../findings/one-practitioner-reports-a-terraform-plan-that-showed-an-update-while-the-apply-recreated-the-resource-and-lost-data.md). [sources/medium-terraform-opentofu-crossplane](../sources/medium-terraform-opentofu-crossplane.md)
