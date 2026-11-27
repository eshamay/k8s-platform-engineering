---
title: "Upjet issue 263 reports a shared Terraform provider stuck at its invocation limit"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [upjet, incident, terraform, shared-provider, secondary-only]
---

# Upjet issue 263 reports a shared Terraform provider stuck at its invocation limit

## Scenario

A user of an Upjet-generated provider reported in crossplane/upjet issue 263 that the provider appeared "to get stuck when the shared terraform provider had reached its invocation limit". The issue is closed and has three comments. The mechanism the user suspected is that a long synchronous Terraform operation kept the in-use count above zero, so the scheduler could not replace a runner that had reached its invocation TTL. URL: https://github.com/crossplane/upjet/issues/263. [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

## Outcome

The dossier classes this as SECONDARY-ONLY, because it is a user report and not a maintainer-confirmed root cause. The reporter is unnamed in the dossier and no date is recorded. It does show why the TTL-and-idle replacement rule in [findings/upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl](../findings/upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl.md) is a risk surface for long-running operations.

## Related

[entities/upjet](../entities/upjet.md), [findings/upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration](../findings/upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration.md)
