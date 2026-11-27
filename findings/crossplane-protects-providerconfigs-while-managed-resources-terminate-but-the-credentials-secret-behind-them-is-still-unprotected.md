---
title: "Crossplane protects ProviderConfigs while managed resources terminate but the credentials Secret behind them is still unprotected"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [crossplane, finalizers, credentials, providerconfig, namespace-deletion]
---

# Crossplane protects ProviderConfigs while managed resources terminate but the credentials Secret behind them is still unprotected

## Observation

On 2026-09-08, three related items landed. crossplane-runtime pull request 1113, "Protect ProviderConfigs while managed resources terminate", merged. Crossplane pull request 7594, a one-pager on ProviderConfig deletion protection under foreground deletion, merged. Issue 4661, "ProviderConfigUsage does not work when deletion policy is set to Foreground", was closed. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

The `Secret` that holds the credentials is not covered. Issue 7801, opened on 2026-09-02, says the Secret has no finalizer and that pull request 7594 treats Secret protection as out of scope. When a namespace is deleted, its objects go in arbitrary order, so the Secret can vanish while managed resources still need it to call the cloud API. Those resources then cannot authenticate and stay Terminating. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Status on 2026-11-26

Issue 7801 is open, labeled `enhancement`, with two comments and no maintainer reply or linked fix pull request. Its body lists three directions, "none of them decided": a Usage-style or generic dependency-protection controller, provider-side credential caching, and ordered namespace teardown. The Secret-protection question is therefore unresolved, and the wiki cannot say that a fix shipped. See [examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply](../examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply.md) and [decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown](../decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown.md). [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup](a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup.md), [entities/crossplane](../entities/crossplane.md), [concepts/finalizers](../concepts/finalizers.md)
