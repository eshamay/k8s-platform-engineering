---
title: "Terraform-in-cluster controllers keep state in Secrets, gate apply on Git approval, and couple to specific versions"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [pitfall, terraform, tofu-controller, state, versions]
---

# Terraform-in-cluster controllers keep state in Secrets, gate apply on Git approval, and couple to specific versions

## Observation

tofu-controller stores Terraform state as Kubernetes Secrets, requires explicit approval for plans by putting the plan ID in `.spec.approvePlan` through Git, and is tied to specific releases. Version 0.16 pairs with Terraform 1.5.7 and Flux 2.6.x, and Branch Planner was in technology preview (https://flux-iac.github.io/tofu-controller/). [[sources/research-landscape]]

## Further limits

Terraform Operator does not remove the need to write Terraform, since it only starts workflow pods when the manifest changes (https://github.com/isaaguilar/terraform-operator). The dossier did not check the maintenance level of either project after Weaveworks' wind-down, so the project-health risk is unconfirmed, see [[open-knowledge-gaps]].

## Related

[[entities/tofu-controller]], [[entities/terraform-operator]], [[examples/teams-with-large-terraform-estates-run-terraform-inside-the-cluster-with-tofu-controller-or-terraform-operator]], [[concepts/tooling-landscape]]
