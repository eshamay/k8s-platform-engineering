---
title: "Upjet CLI mode keeps a Terraform workspace per resource and shares a forked provider process until an invocation TTL"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [upjet, crossplane, terraform, workspace, provider-process, metrics]
---

# Upjet CLI mode keeps a Terraform workspace per resource and shares a forked provider process until an invocation TTL

## Observation

In the fork-based CLI mode, each managed resource gets a `Workspace`, which CLAUDE.md describes as the "Per-resource Terraform working directory managing state files". The workspace holds a `terraform.tfstate` file, and the runtime runs `terraform` subcommands (apply, destroy, plan, import, refresh) in sync or async mode. https://github.com/crossplane/upjet/blob/main/CLAUDE.md

The Terraform provider itself is not forked per reconcile. In `provider_runner.go`, `SharedProvider.Start` forks one native Terraform provider process (the source comment reads "Provider runner not yet started. Will fork a new native provider.") and the controllers reach it through a gRPC reattach configuration over a unix socket. `provider_scheduler.go` documents that `SharedProviderScheduler` "shares a native plugin (Terraform provider) process between MR reconciliation loops whose MRs yield the same ProviderHandle", which means resources with identical provider configuration. A runner is replaced when its invocation count reaches a TTL and no invocation is in use. https://github.com/crossplane/upjet/blob/main/pkg/terraform/provider_runner.go and https://github.com/crossplane/upjet/blob/main/pkg/terraform/provider_scheduler.go (main, read 2026-11-26). [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

Operators can measure the cost through Upjet metrics: `upjet_terraform_cli_duration`, `upjet_terraform_active_cli_invocations`, `upjet_terraform_running_processes` (labelled `cli` or `provider`), and `upjet_resource_ttr`. The monitoring doc says the process count "is a best effort metric that may not be able to precisely catch & report all relevant processes". https://github.com/crossplane/upjet/blob/main/docs/monitoring.md

## Why it matters

The TTL counts invocations and not elapsed time, and replacement waits until the runner is idle. A long synchronous Terraform operation can therefore delay replacement, which is the shape of the stuck-provider report in [examples/upjet-issue-263-reports-a-shared-terraform-provider-stuck-at-its-invocation-limit](../examples/upjet-issue-263-reports-a-shared-terraform-provider-stuck-at-its-invocation-limit.md). The per-resource workspace also means state lives on the provider pod's filesystem, so storage and restart behavior belong in a capacity review.

## Evidence status

VERIFIED from first-party source and docs on main. The monitoring doc carries a 2023 copyright date.

## Related

[entities/upjet](../entities/upjet.md), [findings/upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration](upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration.md), [findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families](no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families.md)
