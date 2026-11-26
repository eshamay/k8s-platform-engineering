---
title: "No neutral comparison of Crossplane with Terraform or single-cloud operators was found, and the independent material is dated"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Neutral Crossplane comparisons]
tags: [crossplane, terraform, comparison, bias, evidence-quality, config-connector, ack, aso]
---

# No neutral comparison of Crossplane with Terraform or single-cloud operators was found, and the independent material is dated

## Observation

Searches for Crossplane versus Terraform returned mostly vendor pages: Spacelift (which sells Terraform and multi-IaC orchestration), Loft/vCluster, Stategraph, Encore, and the Crossplane project blog. Five pages were read: the Spacelift article (updated 2026-06-30), a SuperOrbital consultancy post (2022-09-08), a VSHN post (2021-04-29, from a firm that runs Crossplane), a personal migration walkthrough (2023-05-27), and the Crossplane blog post on cloud add-ons (2021-02-02). Two Medium posts returned empty scrapes, and searches for adopter migration post-mortems and for a Config Connector, ACK, and Azure Service Operator comparison returned zero results. No primary-document comparison of the three cloud operators against Crossplane was read. [[sources/research-gap-o6-platform-landscape]]

## What the readable material says, with attribution

- SuperOrbital (2022, SECONDARY-ONLY): "Crossplane has no equivalent to a dry run mode, like `terraform plan`", and fields that would force recreation in Terraform may be ignored while the provider reports in sync. Providers generated from Terraform run the terraform binary underneath, which adds an "embedded Terraform process to investigate". See [[examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane]].
- Spacelift (VENDOR): Terraform has the bigger ecosystem and gentler learning curve, and Crossplane's full provider coverage is hard to meet.
- VSHN (Crossplane-friendly integrator): Terraform is a CLI and Crossplane a control plane, and the cloud operators are "specific to the cloud they are engineered for". This echoes the Crossplane project's framing and is not independent in substance.
- The Crossplane blog says Crossplane "even shares code with some of these addons", a project claim.
- The migration walkthrough is a lab procedure (Terraform provider first, then native providers) with no production use. [[sources/research-gap-o6-platform-landscape]]

## Limits

The only substantive independent source is four years old and predates Crossplane v2 and function-based composition, so the wiki must not treat it as current. Crossplane is CNCF graduated per the CNCF landscape file, which is the one fully verified fact in this cluster. The gap stays open. [[sources/research-gap-o6-platform-landscape]]

## Related

[[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]], [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]], [[findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions]], [[decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane]]
