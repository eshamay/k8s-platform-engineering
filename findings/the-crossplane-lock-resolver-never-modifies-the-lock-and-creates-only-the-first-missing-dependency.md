---
title: "The Crossplane Lock resolver never modifies the Lock and creates only the first missing dependency"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: [Crossplane package resolver]
tags: [crossplane, packages, dependencies, lock, resolver]
---

# The Crossplane Lock resolver never modifies the Lock and creates only the first missing dependency

## Observation

Crossplane resolves package dependencies in a controller whose source comment reads "Package resolver implements the Crossplane Package Lock controller." It lives in `internal/controller/pkg/resolver` and watches ConfigurationRevision, ProviderRevision, FunctionRevision, and ImageConfig objects. It builds a directed acyclic graph from the packages recorded in the Lock, rejects cycles, and when dependencies are implied but missing it creates only the first one: "The resolver never modifies the Lock. We only create the first implied node". Failure sets a `ResolutionFailed` condition and success sets `ResolutionSucceeded`. https://github.com/crossplane/crossplane/blob/main/internal/controller/pkg/resolver/reconciler.go (main, read 2026-11-26). [sources/research-gap-o8-crossplane-residuals](../sources/research-gap-o8-crossplane-residuals.md)

The "lock file" is not a file. It is the cluster-scoped `Lock` object named `lock`. Dependencies are declared in a package's `crossplane.yaml` with an optional version constraint such as `">=v0.36.0"`, and may be Functions, Providers, or other Configurations. https://github.com/crossplane/docs/blob/master/content/master/packages/configurations.md (docs master)

## Why it matters

Because only one missing node is created per pass, a chain of missing dependencies is filled in over several reconciles and not in one step, so a Configuration can report unmet dependencies for a short time during install. The resolver reads the Lock and does not rewrite it, so the Lock records what the package manager has installed and not what the resolver would prefer.

## Evidence status

VERIFIED from source on main and docs master. The activation constants in `apis/pkg/v1/revision.go` were not readable, so activation values come from the docs.

## Related

[findings/crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags](crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags.md), [findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades](provider-upgrades-leave-old-revisions-and-block-automatic-downgrades.md), [decisions/let-crossplane-resolve-package-dependencies-or-pin-versions-and-skip-resolution](../decisions/let-crossplane-resolve-package-dependencies-or-pin-versions-and-skip-resolution.md), [entities/crossplane](../entities/crossplane.md)
