---
title: "crossplane-runtime issue 1150 reports a rejected ProviderConfigUsage create in a terminating namespace blocking managed resource deletion for hours"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [crossplane, namespace-deletion, providerconfigusage, finalizers, issue]
---

# crossplane-runtime issue 1150 reports a rejected ProviderConfigUsage create in a terminating namespace blocking managed resource deletion for hours

## Scenario

Issue [crossplane/crossplane-runtime#1150](https://github.com/crossplane/crossplane-runtime/issues/1150) is open. Its reporter, on Crossplane v2.3.3, deletes a namespace that holds namespaced managed resources. The report traces the problem to the managed reconciler: "Connect() runs before the WasDeleted check", so the reconciler tries to create a `ProviderConfigUsage` object even though the resource is being deleted. The API server rejects the create with a 403 `NamespaceTerminating`, and managed resource deletion stays blocked for hours. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Evidence strength

This is SECONDARY-ONLY. The dossier read only the first part of the issue body and did not re-read the code. Whether a later release fixed it was not checked. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Where it sits

It is the second documented failure mode of namespace deletion with the provider running, beside the credentials Secret race in [examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply](crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply.md). The case with the provider absent is not documented anywhere the dossier searched. See [findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup](../findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup.md).

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/finalizers](../concepts/finalizers.md), [concepts/managed-resource](../concepts/managed-resource.md)
