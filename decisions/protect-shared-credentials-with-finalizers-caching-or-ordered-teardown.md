---
title: "Protect shared credentials with finalizers, caching, or ordered teardown"
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [decision, crossplane, credentials, deletion-ordering]
---

# Protect shared credentials with finalizers, caching, or ordered teardown

## Status

Open. As of 2026-11-26 Crossplane issue 7801 is open with no maintainer reply and no linked fix, so no option has been chosen. [sources/research-finalizers](../sources/research-finalizers.md) [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Context

When a namespace is deleted, its objects go in arbitrary order. Managed resources need the provider credentials Secret to finish their cleanup, and the Secret has no finalizer.

## Options

- Put a finalizer on the Secret so it outlives the managed resources that use it. A contributor reported success with this in provider-gitlab.
- Cache the credentials in the provider so a deleted Secret does not block calls.
- Order the teardown so dependents are deleted first, as kro does with reverse-dependency waves.

## Trade-offs

A Secret finalizer adds one more object that can get stuck. Caching changes where credentials live in memory. Ordered teardown needs a dependency model, which raw namespace deletion does not have.

## Evidence

The issue body lists the three options as "none of them decided". A commenter on 2026-10-14 reported that a Secret finalizer fixed their provider-gitlab runs, and that caching worked 9 of 9 times in a prototype but failed after a provider restart. These are third-party measurements on one build and SECONDARY-ONLY. The ProviderConfig itself is already protected by crossplane-runtime pull request 1113, merged 2026-09-08, and the Secret is the part still unprotected. No maintainer has said which approach is preferred. See [examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply](../examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply.md) and [findings/crossplane-protects-providerconfigs-while-managed-resources-terminate-but-the-credentials-secret-behind-them-is-still-unprotected](../findings/crossplane-protects-providerconfigs-while-managed-resources-terminate-but-the-credentials-secret-behind-them-is-still-unprotected.md). [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup](../findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup.md), [entities/crossplane](../entities/crossplane.md), [examples/kro-deletes-instance-resources-in-reverse-dependency-waves](../examples/kro-deletes-instance-resources-in-reverse-dependency-waves.md)
