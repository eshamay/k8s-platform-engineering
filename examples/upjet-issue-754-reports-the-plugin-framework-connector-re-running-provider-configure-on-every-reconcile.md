---
title: "Upjet issue 754 reports the Plugin Framework connector re-running provider Configure on every reconcile"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [upjet, terraform, plugin-framework, performance, secondary-only]
---

# Upjet issue 754 reports the Plugin Framework connector re-running provider Configure on every reconcile

## Scenario

Issue 754 in crossplane/upjet, still open on 2026-11-26, says the no-fork Plugin Framework connector "re-runs the provider's `Configure` step on every reconcile of every managed resource". As described by the issue author, each reconcile builds and discards a provider server, whereas the Plugin SDK v2 path reuses a configured handle. URL: https://github.com/crossplane/upjet/issues/754. [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

## Outcome

The dossier marks this SECONDARY-ONLY, since it is the reporter's description and was not confirmed by a maintainer. If accurate, it means the per-reconcile cost differs by execution mode, not only by process count, see [findings/upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration](../findings/upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration.md). No measurement of the cost accompanies the report.

## Related

[entities/upjet](../entities/upjet.md), [findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families](../findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families.md)
