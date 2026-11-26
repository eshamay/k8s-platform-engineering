---
title: "SuperOrbital's 2022 evaluation reported no terraform plan equivalent for Crossplane"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [crossplane, terraform, superorbital, evaluation, secondary-only, dated]
---

# SuperOrbital's 2022 evaluation reported no terraform plan equivalent for Crossplane

## Scenario

The consultancy SuperOrbital evaluated Crossplane in a 2022 post (https://superorbital.io/blog/crossplane-2022/, 2022-09-08), the most independent substantive source the dossier found for Crossplane versus Terraform. [[sources/research-gap-o6-platform-landscape]]

## What it reported

The post says "Crossplane has no equivalent to a dry run mode, like `terraform plan`". It reports that a change to a field that would force recreation in Terraform may be ignored, with the native AWS provider continuing to report the resource as in sync. For providers generated from Terraform it notes "the additional embedded Terraform process to investigate" when debugging. It concludes that "adopting it today is similar to adopting Docker in 2013". All of this is SECONDARY-ONLY, comes from a consultancy and not a production adopter, and is four years old. It predates Crossplane v2 and function-based composition, so the wiki treats it as a dated report and not as a statement about current behavior. [[sources/research-gap-o6-platform-landscape]]

## Related

[[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]], [[findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated]], [[entities/upjet]]
