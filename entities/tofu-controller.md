---
title: tofu-controller
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [tf-controller, flux-iac tofu-controller]
tags: [tool, terraform, opentofu, gitops]
---

# tofu-controller

tofu-controller is a flux-iac project that runs Terraform or OpenTofu from Flux-style Kubernetes resources, so infrastructure defined as Terraform can be reconciled by the same GitOps machinery as other manifests. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

## Drift detection without correction

The project README mentions a model in which you keep a state file and use GitOps only to detect drift, deciding later whether to act. In its words, "you'd like to use GitOps just for drift detection, so you can decide to do things later when a drift occurs." This is the Terraform-world counterpart of Flux's `warn` drift mode and Crossplane's Observe policy. See [examples/tofu-controller-detects-terraform-drift-without-applying](../examples/tofu-controller-detects-terraform-drift-without-applying.md) and [decisions/staged-adoption-of-automated-drift-correction](../decisions/staged-adoption-of-automated-drift-correction.md).

## Limits of what is known

The README digest gave no detail on approval modes, intervals, or how drift is reported, and the wiki holds no other source on Terraform-in-cluster drift handling. A candidate read is https://blog.ogenki.io/post/terraform-controller/. See [open-knowledge-gaps](../open-knowledge-gaps.md). The maintenance question is answered in the section at the end of this page.

## Related

[entities/flux](flux.md), [concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md), [comparisons/drift-detection-mechanisms-across-tools](../comparisons/drift-detection-mechanisms-across-tools.md)

## Operating model from the project documentation

The project documentation says the controller "detects and fixes drift for your infrastructures, based on the Terraform resources and their TFSTATE." It runs plan and apply in runner pods, stores state as Kubernetes Secrets, and does manual approval by putting the plan ID in `.spec.approvePlan` through Git. Version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x, and Branch Planner was in technology preview (https://flux-iac.github.io/tofu-controller/). This refines the earlier "limits of what is known" section. See [findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions](../findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions.md) and [comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers](../comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers.md). [sources/research-landscape](../sources/research-landscape.md)

## Maintenance status (o6 dossier)

The project now lives at `flux-iac/tofu-controller`, is not archived, and was previously known as Weave TF-Controller. The latest release is v0.17.0 (2026-11-16), preceded by v0.16.6 (2026-10-26), v0.16.5 (2026-08-06), and v0.16.4 (2026-06-08), and the last push was 2026-11-25. Five active and three emeritus maintainers are listed. v0.17.0 removed the v1alpha1 API. Correction note: the earlier "version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x" statement describes a line that is one minor version behind the current release, and the dossier did not read the v0.17 version pairing. See [findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api](../findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api.md) and [examples/tofu-controller-v0-17-0-removed-the-v1alpha1-api-on-2026-11-16](../examples/tofu-controller-v0-17-0-removed-the-v1alpha1-api-on-2026-11-16.md). [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)
