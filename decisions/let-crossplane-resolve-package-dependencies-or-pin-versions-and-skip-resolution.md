---
title: "Let Crossplane resolve package dependencies or pin versions and skip resolution"
type: decision
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [decision, crossplane, packages, dependencies, upgrade, evidence-only]
---

# Let Crossplane resolve package dependencies or pin versions and skip resolution

## Status

Draft. This records a decision point and the evidence for each option. It makes no recommendation, because the dossier found no adopter report of any option in production. [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

## Context

A Configuration can depend on Providers, Functions, and other Configurations. Platform teams decide how much of the version movement Crossplane does for them. [findings/the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency](../findings/the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency.md)

## Options

**Option 1, default resolution.** The resolver creates a missing dependency, one node per pass, and leaves installed versions alone. Unmet dependencies show as `HEALTHY` False on the Configuration, and a needed downgrade ends in "manual intervention is required." Evidence: docs master and resolver source.

**Option 2, alpha dependency upgrades.** Enable `--enable-dependency-version-upgrades` so the resolver picks the minimum version satisfying all constraints. Evidence: the docs call it alpha. See [findings/crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags](../findings/crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags.md).

**Option 3, alpha upgrades plus downgrades.** Also set the Helm value `packageManager.enableAutomaticDependencyDowngrade=true`. Evidence: both flags are required, and the docs warn of orphaned managed resources, data loss, and storage-version changes.

**Option 4, skip resolution.** Set `skipDependencyResolution: true` and install the providers yourself, optionally with `revisionActivationPolicy: Manual`. Evidence: the docs describe the flag, and the Provider upgrade section says a new `ProviderRevision` lets Crossplane retain deprecated CRDs "until you decide". See [findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades](../findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades.md).

## Consequences

Options 2 and 3 trade review effort for reliance on alpha behavior. Option 4 moves the whole dependency graph into the operator's change process, and its Function behavior is unconfirmed, see [findings/crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions](../findings/crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions.md).

## Related

[entities/crossplane](../entities/crossplane.md), [decisions/choose-automatic-or-manual-composition-update-policy](choose-automatic-or-manual-composition-update-policy.md)
