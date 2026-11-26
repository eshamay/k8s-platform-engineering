---
title: "Terraform Operator"
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [tool, terraform, operator, community]
---

# Terraform Operator

Terraform Operator is a community project (isaaguilar/terraform-operator) with a CRD whose controller starts Terraform workflow pods when the manifest changes. Configuration comes through environment variables, ConfigMaps, Secrets, and ServiceAccounts. [[sources/research-landscape]]

## Limits

The README describes it as "A controller that configures and starts Terraform Workflows when it sees changes to the Kubernetes manifest" (https://github.com/isaaguilar/terraform-operator). It is explicitly not an HCL-to-YAML converter, so you still write Terraform, which separates it from [[entities/crossplane]] where the resource model is Kubernetes-native. The dossier did not check the last release or maintenance level.

## Related

[[entities/terraform]], [[entities/tofu-controller]], [[comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers]], [[concepts/tooling-landscape]]
