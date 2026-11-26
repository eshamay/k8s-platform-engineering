---
title: "Protect shared credentials with finalizers, caching, or ordered teardown"
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [decision, crossplane, credentials, deletion-ordering]
---

# Protect shared credentials with finalizers, caching, or ordered teardown

## Status

Open. Crossplane issue 7801 discusses the options and the dossier did not confirm a resolution or a shipped fix. [[sources/research-finalizers]]

## Context

When a namespace is deleted, its objects go in arbitrary order. Managed resources need the provider credentials Secret to finish their cleanup, and the Secret has no finalizer.

## Options

- Put a finalizer on the Secret so it outlives the managed resources that use it. A contributor reported success with this in provider-gitlab.
- Cache the credentials in the provider so a deleted Secret does not block calls.
- Order the teardown so dependents are deleted first, as kro does with reverse-dependency waves.

## Trade-offs

A Secret finalizer adds one more object that can get stuck. Caching changes where credentials live in memory. Ordered teardown needs a dependency model, which raw namespace deletion does not have.

## Related

[[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]], [[entities/crossplane]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]
