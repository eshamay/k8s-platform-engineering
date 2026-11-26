---
title: "Research dossier: gap cluster o8-crossplane-residuals"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [crossplane, upjet, packages, function-kro, scaling, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: gap cluster o8-crossplane-residuals

> [!NOTE]
> **Raw file:** `raw/research-gap-o8-crossplane-residuals.md` (sha256 prefix 35c6f2fb6101)<br>
> **Kind:** Verified research dossier for the four residual Crossplane gaps, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the Upjet, Crossplane package, scaling, and function-kro pages<br>
> **Caveat:** The docs repository `master` tree is unversioned, so documentation quotes are labelled "docs master, read 2026-11-26". Which official providers use which Upjet mode, the Function package activation policy, and function-kro's per-resource readiness mechanism were not established.

## Summary

The dossier read primary sources through the gh CLI: the crossplane/docs repository, the Crossplane v2.1.0, v2.3.0, v2.4.0 and v2.5.0 release notes (v2.5.0 was published 2026-11-24), the package resolver and feature-flag source, the crossplane/upjet repository, and the crossplane-contrib/function-kro source. Its verification pass reproduced every quotation and removed no claim.

On scaling it adds nothing that contradicts the wiki: there is still no single v2 scaling page, no numeric limit for XRs or composed resources per controller, and no independent benchmark. On Upjet it settles the runtime model from first-party source: three execution modes chosen per resource, a per-resource Terraform workspace, and a forked provider process shared across reconciles through gRPC reattach with an invocation TTL. No official memory or CPU figures exist. On packages it documents the activation policy, history limit, dependency flags, and the Lock resolver, and it could not confirm the policy for Function packages. On kro status it explains how `function-kro` feeds a Crossplane composite and leaves open whether a standalone kro controller can do so.

## Key claims

Scaling
- The Pods guide gives a one-minute default poll interval (`--poll-interval`) and a one-hour sync interval (`--sync-interval`), and still describes `--max-reconcile-rate` as a per-second rate. VERIFIED, docs master.
- v2.1.0 renamed `--max-reconcile-rate` to `--max-concurrent-reconciles` and relies on API Priority and Fairness, the XR circuit breaker (50 burst, 1 every 2s sustained), and worker pool size. VERIFIED.
- v2.3.0 added the `crossplane.io/poll-interval` annotation and the XR `scale` subresource, and v2.4.0 added zero-replica runtimes for safe-start providers. VERIFIED.
- v2.5.0 reports heap 338 MiB to 190 MiB and RSS 415 MiB to 250 MiB on a 791-CRD cluster, a maintainer-reported number and not an independent benchmark. VERIFIED. It also adds an alpha garbage collector for unused CompositionRevisions with `spec.unusedRevisionHistoryLimit` defaulting to 1. VERIFIED.
- The MRD guide estimates about 3 MiB of API server memory per CRD, an illustrative estimate. VERIFIED.
- No numeric XR or composed-resource capacity limit per controller exists in the sources read. UNVERIFIED negative finding.

Upjet
- Upjet supports a fork-based Terraform CLI mode, a no-fork Plugin SDK v2 mode, and a no-fork Plugin Framework mode, chosen per resource configuration. VERIFIED.
- Each resource has a `Workspace` directory with a state file, and `SharedProvider.Start` forks one native provider process reused through gRPC reattach. VERIFIED.
- The scheduler shares one provider process among MRs with the same handle and replaces it after an invocation TTL when not in use. VERIFIED.
- Metrics expose CLI invocations, running Terraform processes, and time-to-readiness, and the process count is best effort. VERIFIED.
- Issue 754 (open) reports that the Framework connector re-runs `Configure` on every reconcile, and issue 263 (closed) reports a stuck shared provider. SECONDARY-ONLY, reporter descriptions.
- Issue 151 on the memory footprint was closed as outdated after provider families, and a collaborator says monolithic provider packages are discouraged. VERIFIED.
- No official per-resource memory or CPU figures exist in the docs or issues read, and which official providers use which mode is not established. UNVERIFIED.

Packages
- Only one package revision is Active, the newest is activated by default (`Automatic`), `Manual` is the alternative, and one Inactive revision is kept by default. VERIFIED, docs master.
- `skipDependencyResolution` ignores a package's dependencies, and unmet dependencies make a Configuration report `HEALTHY` False. VERIFIED.
- The resolver is the Package Lock controller, it rejects cycles, never modifies the Lock, and creates only the first implied missing node. VERIFIED, source on main.
- Dependency upgrades are alpha behind `--enable-dependency-version-upgrades`, and automatic downgrades need both alpha flags and carry documented risks. VERIFIED.
- v2.5.0 fixes a new revision taking ownership of objects during upgrades. VERIFIED.
- The Function package activation policy and history limit were not found in `packages/functions.md`. UNVERIFIED.

kro status
- `function-kro` embeds kro's engine, needs no kro install, and accepts kro `resources` and `status` blocks unchanged. VERIFIED.
- Not-ready resources only lower `allReady` and real errors are fatal, the desired XR holds only declared status paths, built-in kro conditions are approximated from one run with `InstanceManaged` omitted, conditions waiting for data are omitted, and Crossplane-reserved condition types are rejected with a warning. VERIFIED.
- v2.5.0 reserves `status.crossplane` on modern XRs. VERIFIED.
- How function-kro marks per-resource readiness, and whether a standalone kro controller's status can feed a Crossplane composite, are UNVERIFIED.

## Open questions the dossier leaves

Which official Upjet providers run in which mode, what Upjet costs in memory and CPU, how Function packages handle activation and history, the release that changed the XR circuit breaker default from 50 burst to 100, where function-kro sets per-resource readiness, and whether a standalone kro controller can feed a Crossplane composite.

## Pages touched

New pages are [[findings/upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration]], [[findings/upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl]], [[findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families]], [[findings/the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency]], [[findings/crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags]], [[findings/crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions]], [[findings/function-kro-approximates-kro-built-in-conditions-from-one-run-and-writes-only-declared-status-paths-to-the-desired-xr]], [[findings/no-documentation-was-found-of-a-standalone-kro-controller-feeding-a-crossplane-composite-and-function-kro-s-readiness-link-is-unlocated]], [[examples/upjet-issue-263-reports-a-shared-terraform-provider-stuck-at-its-invocation-limit]], [[examples/upjet-issue-754-reports-the-plugin-framework-connector-re-running-provider-configure-on-every-reconcile]], [[examples/crossplane-v2-5-0-released-2026-11-24-with-alpha-compositionrevision-garbage-collection-and-an-upgrade-ownership-fix]], and [[decisions/let-crossplane-resolve-package-dependencies-or-pin-versions-and-skip-resolution]].

Touched pages are [[entities/upjet]], [[entities/crossplane]], [[findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades]], [[examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step]], [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]], and [[findings/crossplane-core-strips-crd-schemas-from-its-cache-and-no-crossplane-performance-or-sharding-guide-was-found]].

## Related

[[open-knowledge-gaps]], [[sources/research-gap-g3-crossplane-v2]], [[sources/research-gap-b1-recheck-kro-crossplane]], [[sources/research-provider]]
