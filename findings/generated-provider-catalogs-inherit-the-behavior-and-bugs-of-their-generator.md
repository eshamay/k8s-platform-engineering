---
title: "Generated provider catalogs inherit the behavior and bugs of their generator"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [upjet, provider, code-generation, terraform, pitfall]
---

# Generated provider catalogs inherit the behavior and bugs of their generator

## Observation

Most large provider catalogs are generated. Upjet generates Crossplane providers from Terraform providers and reuses Terraform's resource logic at runtime, ACK generates controllers from AWS API models, and Azure Service Operator generates CRDs from Azure Resource Manager schemas. Config Connector also reuses Terraform internals for part of its catalog, through its Terraform-based and DCL-based controllers. [[sources/research-provider]]

## Why it matters

Providers built from the same generator share behavior, including defaults, error handling, and any bug in the generator or in the upstream Terraform provider. This is the story behind why many providers behave alike, and why a fix may need to land upstream. Generation also produces very large API surfaces, see [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]]. The dossier does not confirm how Upjet runs Terraform at runtime or what that costs in performance or memory, which is recorded as a gap in [[open-knowledge-gaps]]. [[sources/research-provider]]

## What to do

Expect bugs to be shared across providers from the same source, and check the upstream Terraform provider when diagnosing a generated one. Generation reduces hand-written provider bugs but does not remove them, see [[findings/hand-written-providers-that-treat-not-found-as-an-error-break-the-create-flow]]. See [[entities/upjet]] and [[examples/upjet-generates-crossplane-providers-from-terraform-providers]].
