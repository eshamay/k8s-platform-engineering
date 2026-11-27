---
title: "tofu-controller is community maintained under flux-iac, and v0.17.0 removed the v1alpha1 API"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [tofu-controller maintenance status]
tags: [tofu-controller, maintenance, weaveworks, terraform, releases]
---

# tofu-controller is community maintained under flux-iac, and v0.17.0 removed the v1alpha1 API

## Observation

tofu-controller lives at `flux-iac/tofu-controller` (Apache-2.0, 1,733 stars, not archived), is described as "A GitOps OpenTofu and Terraform controller for Flux", and says it was "previously known as Weave TF-Controller". The last push was 2026-11-25. Releases are v0.17.0 (2026-11-16), v0.16.6 (2026-10-26), v0.16.5 (2026-08-06), and v0.16.4 (2026-06-08), a roughly monthly to bimonthly cadence. The `MAINTAINERS` file lists five active maintainers (Chanwit Kaewkasi, Balazs Nadasdi, Tonni Follmann, Aksel Skaar Leirvaag, Alex Marston) and three emeritus ones, two of them formerly at Weaveworks and one at Nvidia. Non-bot commits continued through 2026-11-18, and the top contributor, chanwit, has 566 commits against 88 from dependabot. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## What it means

The question left open after Weaveworks' wind-down is answered: the project is community maintained and actively released as of 2026-11-26. The v0.17.0 changelog lists a breaking change, removal of the v1alpha1 API, so only `v1alpha2` remains, see [examples/tofu-controller-v0-17-0-removed-the-v1alpha1-api-on-2026-11-16](../examples/tofu-controller-v0-17-0-removed-the-v1alpha1-api-on-2026-11-16.md). The earlier wiki note that version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x describes a release line that is now one minor version behind. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## Related

[entities/tofu-controller](../entities/tofu-controller.md), [comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers](../comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers.md), [findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer](terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer.md), [findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions](terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions.md)
