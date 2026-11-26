---
title: "Crossplane poll interval defaults differ by layer, with one minute in core and runtime and ten minutes in Upjet providers"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, upjet, poll-interval, defaults, drift, api-quota]
---

# Crossplane poll interval defaults differ by layer, with one minute in core and runtime and ten minutes in Upjet providers

## Observation

There is no single Crossplane poll interval. The managed-resource poll interval is set in several places, and the layers disagree by an order of magnitude. [[sources/research-gap-g3-reconcile-defaults]]

- crossplane-runtime's managed reconciler has `defaultPollInterval = 1 * time.Minute`. https://github.com/crossplane/crossplane-runtime/blob/main/pkg/reconciler/managed/reconciler.go (default branch as of 2026-11-26)
- Crossplane core exposes a `--poll-interval` flag with a 1 minute default ("How often individual resources will be checked for drift from the desired state.") and a minimum per-resource poll interval of 1 second. https://github.com/crossplane/crossplane/blob/main/cmd/crossplane/core/core.go
- A provider built on Upjet overrides the value. The provider-upjet-aws S3 provider defaults to `--poll` 10m, `--sync` 1h, and `--max-reconcile-rate` 100, and it applies jitter of 5 percent of the poll interval ("currently, we configure the jitter to be the 5% of the poll interval"). https://github.com/crossplane-contrib/provider-upjet-aws/blob/92ebe88a2b59925198184c13ea797cfba6a1df29/cmd/provider/s3/zz_main.go (commit 92ebe88)

## Per-resource override and a stale design document

A per-resource poll interval is set with the `crossplane.io/poll-interval` annotation. The design one-pager for it carries "Status: Draft", which could lead a reader to think the feature has not shipped, but it is implemented: core defines a minimum allowed through the annotation (`MinPollInterval`, at v2.4.4 and on main), and crossplane-runtime defines `AnnotationKeyPollInterval = "crossplane.io/poll-interval"`. The design status is stale relative to the code. https://github.com/crossplane/crossplane/blob/main/design/one-pager-per-resource-poll-interval.md

## Consequences

A drift-detection latency quoted for "Crossplane" is wrong unless it names the provider: about one minute for providers that keep the runtime default and about ten minutes for Upjet-generated providers, which are most of the large cloud catalogs, see [[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]]. Every poll of a managed resource can be a cloud API call, so a one-minute default across thousands of resources spends quota that the ten-minute and `--max-reconcile-rate` settings exist to protect, see [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]] and [[findings/cost-of-constant-reconciliation]]. The values above come from source files. A later pass read the docs.crossplane.io managed-resources page in full (42 KB) and found no poll interval default on it, so that page cannot be cited for the number ([[sources/research-gap-b1-unverified-claims]]). The crossplane-runtime and core defaults, and the provider-upjet-aws `10m` and `1h` defaults, were re-verified against source. The `defaultPollIntervalHook` just returns the interval, so no hidden multiplier applies in the runtime. See [[entities/crossplane]], [[entities/upjet]], and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].
