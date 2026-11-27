---
title: "Terraform Operator has had no release since May 2024 and is effectively single-maintainer"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Terraform Operator maintenance status]
tags: [terraform-operator, maintenance, single-maintainer, galleybytes]
---

# Terraform Operator has had no release since May 2024 and is effectively single-maintainer

## Observation

The repository `isaaguilar/terraform-operator` now redirects to `GalleyBytes/terraform-operator` (Apache-2.0, 379 stars, not archived), described as "A Kubernetes CRD to handle terraform operations". The latest release is v0.17.1 on 2024-05-17, preceded by v0.17.0 (2024-03-13) and v0.16.0 (2023-10-28). The last commit is dated 2025-12-09, by the main author, with the message "no functional changes, refactor for comprehension". The repository shows 25 open issues. The author isaaguilar has 196 commits out of about 206, and four other contributors have five or fewer. Open issue 177, "Potential insecure secret reference" (2025-10-31), received a maintainer comment the next day. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## What it means

As of 2026-11-26 the project has had no release in about 18 months and no commit in about 11 months, and it depends on one person. A search of the README for deprecation, archive, or maintenance wording found nothing, so a deprecation notice is unverified. The evidence supports describing it as low-activity, not as abandoned. A team weighing it against [entities/tofu-controller](../entities/tofu-controller.md) should weigh that gap, see [findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api](tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api.md). [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## Related

[entities/terraform-operator](../entities/terraform-operator.md), [comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers](../comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers.md)
