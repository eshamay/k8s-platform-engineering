---
title: "tofu-controller versus Terraform Operator as Terraform-in-cluster controllers"
type: comparison
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
tags: [comparison, terraform, tofu-controller, terraform-operator]
---

# tofu-controller versus Terraform Operator as Terraform-in-cluster controllers

Both projects wrap existing Terraform code in a CRD and run it in pods, so neither removes the need to write Terraform. The dossier read only each project's own documentation. [[sources/research-landscape]]

| Aspect | [[entities/tofu-controller]] | [[entities/terraform-operator]] |
|---|---|---|
| Family | Flux family (flux-iac), formerly Weave TF-Controller | Independent community project (isaaguilar, now under GalleyBytes) |
| Trigger | Reconciles a Terraform custom resource | Starts workflow pods when the manifest changes |
| State | Kubernetes Secrets | Not described by the dossier |
| Drift | Detected by default, with fixes | Not described by the dossier |
| Approval | Plan ID in `.spec.approvePlan` via Git | Not described by the dossier |
| Version coupling | Version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x | Not described by the dossier |
| Maintenance | Community maintained at flux-iac, five active maintainers, v0.17.0 on 2026-11-16, last push 2026-11-25 | GalleyBytes repository, v0.17.1 on 2024-05-17, last commit 2025-12-09, one author wrote 196 of about 206 commits |

## Reading the comparison

The table has many blanks on the Terraform Operator side because the dossier read only a short README. The wiki does not fill them from general knowledge. For the Kubernetes-native alternative, see [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]].

## Related

[[findings/terraform-in-cluster-controllers-keep-state-in-secrets-gate-apply-on-git-approval-and-couple-to-specific-versions]], [[concepts/tooling-landscape]]

## Maintenance status (o6 dossier)

The maintenance row is now filled from release, commit, and maintainer files read on 2026-11-26. tofu-controller is actively released, and v0.17.0 removed the v1alpha1 API. The Terraform Operator has had no release in about 18 months, though it is not archived and no deprecation notice was found. See [[findings/tofu-controller-is-community-maintained-under-flux-iac-and-v0-17-0-removed-the-v1alpha1-api]], [[findings/terraform-operator-has-had-no-release-since-may-2024-and-is-effectively-single-maintainer]], and [[decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane]]. The other blank cells (state, drift, approval, version coupling) for the Terraform Operator remain blank. [[sources/research-gap-o6-platform-landscape]]
