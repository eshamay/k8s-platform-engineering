---
title: One practitioner reports a Terraform plan that showed an update while the apply recreated the resource and lost data
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: medium-terraform-opentofu-crossplane
    hash: 13ec64862460
    ingested: 2026-11-26
aliases: []
tags: [terraform, plan, recreate, data-loss, provider-bug, secondary-source, single-source]
---

# One practitioner reports a Terraform plan that showed an update while the apply recreated the resource and lost data

> [!NOTE]
> **Evidence grade:** Single anonymous anecdote in an opinion post by Gavin Yap, 2025-01-10, https://medium.com/@maclarensg_50191/choosing-between-terraform-opentofu-and-crossplane-3fdbacbefc68. No provider, resource, date, or fix is named.

## Observation

The author says that with an official Terraform provider from one of his service providers, `terraform plan` showed an update with no recreate, yet `terraform apply` recreated the resource, and the setup or data of the thing it managed was lost. His CI kept the plan logs, and he asked the provider to investigate and says the fault was in the official provider. He uses the story to argue that plan review is necessary before changing critical resources such as production databases. [[sources/medium-terraform-opentofu-crossplane]]

## What it means for the wiki

The wiki's comparison credits Terraform with a reviewable plan before apply and Crossplane with no built-in plan preview, see [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]] and [[examples/superorbital-s-2022-evaluation-reported-no-terraform-plan-equivalent-for-crossplane]]. This anecdote does not remove that difference, but it limits it: a plan is only as accurate as the provider that produces it, so a plan review is a check and not a guarantee. It is one report with no named provider, so it is not a measurement of how often plans and applies diverge.

## Limits

The post gives no technical cause, such as a provider that mis-declared a recreate-forcing field. The post does not say whether Crossplane managed resources could meet the same failure. The wiki's record of how Crossplane handles immutable fields is in [[findings/crossplane-does-not-delete-and-recreate-to-change-immutable-fields]].
