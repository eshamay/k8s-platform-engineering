---
title: "Upjet supports three Terraform execution modes selected per resource configuration"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [upjet, crossplane, terraform, runtime, execution-mode]
---

# Upjet supports three Terraform execution modes selected per resource configuration

## Observation

Upjet-generated controllers do not have a single runtime shape. The Upjet README lists "Multiple Terraform Execution Modes": a "Traditional fork-based Terraform CLI and Terraform provider process spawning" mode, a no-fork Terraform Plugin SDK v2 mode that calls the provider as a Go library, and a no-fork Plugin Framework mode that talks to the provider over protov6. The repository's CLAUDE.md says "Three execution modes switch on resource configuration" and names a separate controller file for each: `external.go` for the CLI mode, `external_tfpluginsdk.go`, and `external_tfpluginfw.go`. URLs: https://github.com/crossplane/upjet/blob/main/README.md and https://github.com/crossplane/upjet/blob/main/CLAUDE.md (main, read 2026-11-26). [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

## Why it matters

The question of whether an Upjet provider runs Terraform as a subprocess or in-process has no single answer. It depends on the mode a given resource uses, so one provider package can mix a forked CLI path for some kinds and in-process paths for others. The dossier did not establish which of the official AWS, Azure, and GCP providers use which mode, so any statement about a specific official provider's cost or process count is unsupported.

## Evidence status

VERIFIED from first-party README and CLAUDE.md on main. The per-provider mapping is UNVERIFIED.

## Related

[entities/upjet](../entities/upjet.md), [findings/upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl](upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl.md), [findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families](no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families.md), [examples/upjet-issue-754-reports-the-plugin-framework-connector-re-running-provider-configure-on-every-reconcile](../examples/upjet-issue-754-reports-the-plugin-framework-connector-re-running-provider-configure-on-every-reconcile.md)
