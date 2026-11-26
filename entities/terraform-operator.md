---
title: "Terraform Operator"
type: entity
status: active
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
tags: [tool, terraform, operator, community]
---

# Terraform Operator

Terraform Operator is a community project (isaaguilar/terraform-operator) with a CRD whose controller starts Terraform workflow pods when the manifest changes. Configuration comes through environment variables, ConfigMaps, Secrets, and ServiceAccounts. [[sources/research-landscape]]

## Limits

The README describes it as "A controller that configures and starts Terraform Workflows when it sees changes to the Kubernetes manifest" (https://github.com/isaaguilar/terraform-operator). It is explicitly not an HCL-to-YAML converter, so you still write Terraform, which separates it from [[entities/crossplane]] where the resource model is Kubernetes-native. The first dossier did not check the last release or maintenance level, and the section below records the later check.

## Related

[[entities/terraform]], [[entities/tofu-controller]], [[comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers]], [[concepts/tooling-landscape]]

## Maintenance status (o6 dossier)

The repository moved from `isaaguilar/terraform-operator` to `GalleyBytes/terraform-operator` and is not archived. The latest release is v0.17.1 (2024-05-17), the last commit is 2025-12-09, and one author wrote 196 of about 206 commits. No deprecation notice was found. See [[findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer]]. [[sources/research-gap-o6-platform-landscape]]
