---
title: Crossplane v2 removed features and offers no automated migration for v1 composites
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, v2, migration, version-churn]
---

# Crossplane v2 removed features and offers no automated migration for v1 composites

## Observation

The Crossplane v2 upgrade guide lists what v2 removes: native patch-and-transform (`mode: Resources`), ControllerConfig, external secret stores, XR-level connection details, and the default registry flag. It requires starting from v1.20 and upgrading one minor version at a time. It offers `crossplane beta upgrade check` to find removed features and `crossplane beta convert pipeline-composition` to convert native compositions. It introduces namespaced managed resources under `.m.` API groups and namespaced XRs. Existing v1 cluster-scoped XRs and managed resources keep working, but "There's no automated tooling yet to migrate existing v1 cluster-scoped XRs and MRs to v2 namespaced style." [[sources/research-composite-resource]] URL: https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/.

## Why it matters

Platform teams that built on v1 face a manual path to move their composites to the namespaced style, and they must convert any native compositions before upgrading. Tutorials and repositories that rely on claims or `mode: Resources` no longer match current behavior, see [[findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane]].

## Mitigations

Run the upgrade check before each minor version, convert compositions to pipelines early, and keep v1-style XRs running until a planned migration. See [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]], [[entities/crossplane]], and [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

## Upgrade guide checklist

The Crossplane deep dive adds that the upgrade guide lists the removals as native patch and transform (`mode: Resources`), `ControllerConfig` (replaced by `DeploymentRuntimeConfig`), alpha external secret stores, native XR connection details (recreated as composed Secrets), and the `--registry` flag (packages need fully qualified names). It says to upgrade only from v1.20 and mentions a CLI converter for deprecations, which means some conversion help exists even though a full migration of v1 composites is manual. See [[examples/crossplane-v2-upgrade-moves-through-v1-20-the-conversion-cli-and-then-providers]]. [[sources/research-crossplane-deep-dive]]

## Update from the v2.5 verification pass (2026-11-26)

The v2.5 upgrade guide says legacy cluster-scoped XRs continue to work with claims, and the project's scanner for removed v1 features is `crossplane beta upgrade check` in the v1.20 CLI. The v2.5.0 release notes state that legacy workloads such as claims remain supported through backwards compatibility. No removal date for claims, legacy `deletionPolicy`, or cluster-scoped managed resources has been announced beyond "a future date". [[sources/research-gap-g3-crossplane-v2]] See [[findings/pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged]].
