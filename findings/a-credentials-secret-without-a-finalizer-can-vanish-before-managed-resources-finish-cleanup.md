---
title: "A credentials Secret without a finalizer can vanish before managed resources finish cleanup"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, finalizers, crossplane, ordering, namespaces]
---

# A credentials Secret without a finalizer can vanish before managed resources finish cleanup

## Observation

Crossplane issue 7801 describes a failure in namespace deletion. Objects in a deleted namespace go in arbitrary order. A credentials Secret that has no finalizer can be removed while managed resources still need it to call the cloud API, so those managed resources cannot authenticate and stay stuck Terminating. The issue weighs three fixes: finalizer protection on the Secret, provider-side credential caching, and ordered teardown. A contributor reports success protecting Secrets with finalizers in provider-gitlab. [[sources/research-finalizers]]

## Why it matters

The managed resources hold finalizers that depend on a second object with no finalizer of its own. This is a dependency-ordering problem that finalizers on one side cannot solve alone. kro avoids the class by deleting in reverse dependency waves. See [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]] and [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]].

## Caveat

The issue is a proposal discussion. Its final resolution, and whether a fix shipped, were not confirmed. See [[open-knowledge-gaps]].

## Related

[[entities/crossplane]], [[concepts/finalizers]], [[findings/ordering-and-dependency-failures]]
