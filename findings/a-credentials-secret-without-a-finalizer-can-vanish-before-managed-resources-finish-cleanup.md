---
title: "A credentials Secret without a finalizer can vanish before managed resources finish cleanup"
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, finalizers, crossplane, ordering, namespaces]
---

# A credentials Secret without a finalizer can vanish before managed resources finish cleanup

## Observation

Crossplane issue 7801 describes a failure in namespace deletion. Objects in a deleted namespace go in arbitrary order. A credentials Secret that has no finalizer can be removed while managed resources still need it to call the cloud API, so those managed resources cannot authenticate and stay stuck Terminating. The issue weighs three fixes: finalizer protection on the Secret, provider-side credential caching, and ordered teardown. A commenter reports success protecting Secrets with finalizers in provider-gitlab, a third-party measurement that is SECONDARY-ONLY. [sources/research-finalizers](../sources/research-finalizers.md)

## Why it matters

The managed resources hold finalizers that depend on a second object with no finalizer of its own. This is a dependency-ordering problem that finalizers on one side cannot solve alone. kro avoids the class by deleting in reverse dependency waves. See [examples/kro-deletes-instance-resources-in-reverse-dependency-waves](../examples/kro-deletes-instance-resources-in-reverse-dependency-waves.md) and [decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown](../decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown.md).

## Caveat

The issue is a proposal discussion, and it is still open on 2026-11-26 with no maintainer reply and no linked fix. The related ProviderConfig protection merged on 2026-09-08. See [findings/crossplane-protects-providerconfigs-while-managed-resources-terminate-but-the-credentials-secret-behind-them-is-still-unprotected](crossplane-protects-providerconfigs-while-managed-resources-terminate-but-the-credentials-secret-behind-them-is-still-unprotected.md) and [examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply](../examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply.md). [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/finalizers](../concepts/finalizers.md), [findings/ordering-and-dependency-failures](ordering-and-dependency-failures.md)

## Namespace deletion with the provider absent

No Crossplane documentation or issue was found that describes a namespaced managed resource when its namespace is deleted while the provider is not running. A managed resource staying Terminating and holding the namespace open follows from the documented finalizer behavior, but it is an inference and unverified. The documented neighbor is the provider-running race above and [examples/crossplane-runtime-issue-1150-reports-a-rejected-providerconfigusage-create-in-a-terminating-namespace-blocking-managed-resource-deletion-for-hours](../examples/crossplane-runtime-issue-1150-reports-a-rejected-providerconfigusage-create-in-a-terminating-namespace-blocking-managed-resource-deletion-for-hours.md). The v2.5 uninstall guide says resources created by Crossplane "aren't deleted if Crossplane isn't uninstalled in order". [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)
