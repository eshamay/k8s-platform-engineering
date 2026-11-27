---
title: "Crossplane v2.5 docs and source disagree on stage labels, condition status, and group suffixes"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, docs, verification, source-quality]
---

# Crossplane v2.5 docs and source disagree on stage labels, condition status, and group suffixes

## Observation

Three places where the v2.5 documentation and the code read on 2026-11-26 do not match. Each is verified in both directions. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md)

- **Stage of the MRD conversion flag.** The docs label managed resource definitions and activation policies alpha (`state: alpha`, `alphaVersion: 2.0`), yet `core.go` on `main` lists the flag "Enable support CRD to MRD conversion when installing a package" under "Beta Features" with default true.
- **Status of the `AsyncOperation` condition.** The managed resources docs show `AsyncOperation` with reason `Ongoing` and `Status: True`, while upjet's `AsyncOperationOngoingCondition` sets `Status: False`, and the reporter of provider-aws issue 2287 observed False.
- **Group suffix in activation examples.** The MRAP page uses `*.m.crossplane.io` patterns, while the upgrade guide uses `.m.upbound.io` (for example `buckets.s3.aws.m.upbound.io`), which matches the Upbound AWS provider's actual group names.

## Why it matters

A tutorial copied from the MRAP page may activate nothing, because the pattern does not match the provider's group, and a monitor written from the docs' `AsyncOperation` example may test for the wrong status value. A stage label taken from the code and one taken from the docs give different answers about whether a feature is on by default.

## Mitigations

When the two disagree, say so and cite both: docs v2.5 and the file in `main` as read on 2026-11-26. Check a live resource for the status value and the provider's real group names before writing alert rules or activation patterns. See [findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs](upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs.md), [findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off](the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off.md), and [entities/crossplane](../entities/crossplane.md).
