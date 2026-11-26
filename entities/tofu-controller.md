---
title: tofu-controller
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: [tf-controller, flux-iac tofu-controller]
tags: [tool, terraform, opentofu, gitops]
---

# tofu-controller

tofu-controller is a flux-iac project that runs Terraform or OpenTofu from Flux-style Kubernetes resources, so infrastructure defined as Terraform can be reconciled by the same GitOps machinery as other manifests. [[sources/research-self-healing-and-drift-detection]]

## Drift detection without correction

The project README mentions a model in which you keep a state file and use GitOps only to detect drift, deciding later whether to act. In its words, "you'd like to use GitOps just for drift detection, so you can decide to do things later when a drift occurs." This is the Terraform-world counterpart of Flux's `warn` drift mode and Crossplane's Observe policy. See [[examples/tofu-controller-detects-terraform-drift-without-applying]] and [[decisions/staged-adoption-of-automated-drift-correction]].

## Limits of what is known

The README digest gave no detail on approval modes, intervals, or how drift is reported, and the wiki holds no other source on Terraform-in-cluster drift handling. A candidate read is https://blog.ogenki.io/post/terraform-controller/. See [[open-knowledge-gaps]].

## Related

[[entities/flux]], [[concepts/self-healing-and-drift-detection]], [[comparisons/drift-detection-mechanisms-across-tools]]
