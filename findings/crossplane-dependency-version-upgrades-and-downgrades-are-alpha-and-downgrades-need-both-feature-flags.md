---
title: "Crossplane dependency version upgrades and downgrades are alpha, and downgrades need both feature flags"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [crossplane, packages, dependencies, upgrade, downgrade, alpha]
---

# Crossplane dependency version upgrades and downgrades are alpha, and downgrades need both feature flags

## Observation

Automatic movement of a dependency version is off by default and alpha. The Configurations page says of upgrades: "It's an alpha feature that requires enabling with the `--enable-dependency-version-upgrades` flag." With it on, the resolver picks the minimum version that satisfies all constraints. Downgrades are a second alpha flag, `EnableAlphaDependencyVersionDowngrades`, set through the Helm value `packageManager.enableAutomaticDependencyDowngrade=true`. The source states "It builds on EnableAlphaDependencyVersionUpgrades; both flags must be set to enable downgrades." https://github.com/crossplane/crossplane/blob/main/internal/features/features.go

The docs warn "Downgrading a package can cause unexpected behavior", naming orphaned managed resources, data loss, and storage-version changes. Without downgrades, the resolver error says that when a valid version requires a downgrade, "manual intervention is required." https://github.com/crossplane/crossplane/blob/main/internal/controller/pkg/resolver/reconciler.go [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

## Why it matters

The default posture is conservative: the resolver may add a missing dependency, but it will not move an installed one unless an operator opts in twice for downgrades. A platform team that wants unattended dependency movement is relying on alpha behavior, and one that does not has to resolve conflicts by hand. The decision is laid out in [decisions/let-crossplane-resolve-package-dependencies-or-pin-versions-and-skip-resolution](../decisions/let-crossplane-resolve-package-dependencies-or-pin-versions-and-skip-resolution.md).

## Evidence status

VERIFIED from docs master and source on main.

## Related

[findings/the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency](the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency.md), [findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades](provider-upgrades-leave-old-revisions-and-block-automatic-downgrades.md), [findings/crd-version-removal-without-migration-strands-stored-objects](crd-version-removal-without-migration-strands-stored-objects.md)
