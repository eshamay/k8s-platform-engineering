---
title: "Crossplane activation policy and history defaults are documented for Providers and Configurations and were not found for Functions"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o8-crossplane-residuals
    hash: 35c6f2fb6101
    ingested: 2026-11-26
aliases: []
tags: [crossplane, packages, revision, activation-policy, history-limit, functions]
---

# Crossplane activation policy and history defaults are documented for Providers and Configurations and were not found for Functions

## Observation

The docs say only one package revision is active at a time: "By default Crossplane sets the most recently installed package revision as `Active`." The `revisionActivationPolicy` is `Automatic` (the default) or `Manual`, where Manual means "Don't automatically activate a Provider." By default "Crossplane maintains one _Inactive_ revision", and `revisionHistoryLimit` set to `0` disables storing. Upgrading means editing `spec.package`, after which "Crossplane installs the new image and creates a new `ProviderRevision`" that keeps deprecated CRDs. `skipDependencyResolution: true` makes Crossplane ignore a Configuration's dependencies. https://github.com/crossplane/docs/blob/master/content/master/packages/providers.md and https://github.com/crossplane/docs/blob/master/content/master/packages/configurations.md (docs master, read 2026-11-26). [[sources/research-gap-o8-crossplane-residuals]]

A keyword scan of `packages/functions.md` for `revisionActivationPolicy`, Automatic, Manual, and `revisionHistoryLimit` found only an unrelated "manually install" line, and a second check in the verification pass agreed. Function revisions exist, because the resolver watches FunctionRevision, so the Function case is UNVERIFIED and not known to be different. In v2.5.0, "A new package revision now reliably takes ownership of its objects during upgrades", see [[examples/crossplane-v2-5-0-released-2026-11-24-with-alpha-compositionrevision-garbage-collection-and-an-upgrade-ownership-fix]].

## Why it matters

The policy decides whether a pinned package can be upgraded without review, and it is the lever the wiki's staged-rollout advice depends on. Applying Provider guidance to Functions is an inference. The related claim that a function upgrade reaches every composition revision is in [[findings/upgrading-a-crossplane-function-changes-every-composition-revision-that-uses-functionref-including-manual-pins]].

## Related

[[findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades]], [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]], [[decisions/let-crossplane-resolve-package-dependencies-or-pin-versions-and-skip-resolution]]
