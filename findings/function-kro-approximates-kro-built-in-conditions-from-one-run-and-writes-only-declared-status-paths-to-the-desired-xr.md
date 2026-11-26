---
title: "function-kro approximates kro built-in conditions from one run and writes only declared status paths to the desired XR"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [function-kro, kro, crossplane, status, conditions, server-side-apply]
---

# function-kro approximates kro built-in conditions from one run and writes only declared status paths to the desired XR

## Observation

`function-kro` is a crossplane-contrib project whose README says it embeds kro's graph builder, CEL evaluator, and runtime, with "There is no need to install KRO itself", and that kro `resources` and `status` blocks "drop into the pipeline input without changes" (main; latest release v0.4.0, 2026-11-26, marked pre-release on GitHub). https://github.com/crossplane-contrib/function-kro/blob/main/README.md [[sources/research-gap-o8-crossplane-residuals]]

In `fn.go` the status behavior differs from the kro controller. A hard graph error becomes a fatal result, except while waiting on external-reference fetches. A not-ready error from the executor only sets `allReady := err == nil` to false. Desired composed resources are written into the response. The desired XR carries only the status paths the graph declares, because "we must only include fields we want to own", which keeps server-side apply ownership narrow. `setAuthorConditions` approximates kro's built-ins from a single run, since a function does not compute them: `GraphResolved` is always True, `ResourcesReady` and `Ready` equal `allReady`, and `InstanceManaged` is omitted. Author conditions created with `runtime.newCondition` come back as XR conditions through the function SDK, conditions waiting for data are left out so "Crossplane only updates the conditions we return, so it keeps its last value on the XR", and Crossplane-reserved condition types are rejected with a warning. https://github.com/crossplane-contrib/function-kro/blob/main/fn.go

Crossplane v2.5.0 also reserves `status.crossplane` on modern XRs, so a graph's declared status paths cannot use it. https://github.com/crossplane/crossplane/releases/tag/v2.5.0

## Why it matters

A kro-style graph run inside Crossplane does not carry kro's four built-in condition semantics. Authors relying on `InstanceManaged` will not find it, and `Ready` here means all resources in this run were ready. How those readiness values reach the XR `Ready` condition remains the v2.5.0 behavior recorded in [[findings/crossplane-function-auto-ready-and-kro-readywhen-gate-on-the-provider-ready-condition-and-no-worked-example-of-crossplane-composing-ack-or-config-connector-was-found]].

## Related

[[entities/function-kro]], [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]], [[findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps]], [[examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step]]
