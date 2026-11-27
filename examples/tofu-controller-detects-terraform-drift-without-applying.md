---
title: tofu-controller detects Terraform drift without applying
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [terraform, opentofu, drift, gitops, flux]
---

# tofu-controller detects Terraform drift without applying

## Scenario

Terraform users who already run Flux want visibility into drift between their Terraform state and real infrastructure, but do not want a controller applying changes automatically. The [entities/tofu-controller](../entities/tofu-controller.md) README describes this model: "you'd like to use GitOps just for drift detection, so you can decide to do things later when a drift occurs." The source is https://github.com/flux-iac/tofu-controller. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md)

## Why it fits

Detection-only mode separates noticing a difference from acting on it, which suits infrastructure where an automatic apply could be destructive. It mirrors the `warn` mode of Flux drift detection and Crossplane's Observe policy.

## Limits

The README digest gave no detail on approval modes or intervals, so how drift is surfaced is unknown. See [decisions/staged-adoption-of-automated-drift-correction](../decisions/staged-adoption-of-automated-drift-correction.md) and [open-knowledge-gaps](../open-knowledge-gaps.md).
