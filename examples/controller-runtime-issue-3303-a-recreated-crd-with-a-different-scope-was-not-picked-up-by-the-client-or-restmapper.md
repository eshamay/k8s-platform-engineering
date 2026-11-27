---
title: controller-runtime issue 3303, a recreated CRD with a different scope was not picked up by the client or RESTMapper
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [controller-runtime, crd, restmapper, cache, issue, secondary-only]
---

# controller-runtime issue 3303, a recreated CRD with a different scope was not picked up by the client or RESTMapper

## Scenario

Issue 3303 in kubernetes-sigs/controller-runtime reports that when a CRD is deleted and recreated under the same GVK with a different scope, the client's resource metadata cache and the dynamic RESTMapper keep the old scope. The reporter's root-cause analysis says `resourceMeta is cached indefinitely by GVK`, and a reporter comment says informers inherit the old scope but can be torn down and recreated. A maintainer commented that it is "quite an edge case", and the stale bot closed the issue on 2026-05-14 with no fix. https://github.com/kubernetes-sigs/controller-runtime/issues/3303 [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

## Reliability

The root cause is the reporter's analysis and was not confirmed by a maintainer, so the claim is SECONDARY-ONLY. The issue is evidence of one consequence of keying caches by GVK ([findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr](../findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr.md)), and of the cost of a RESTMapper that is a snapshot ([findings/stale-restmapper-hides-newly-installed-crds](../findings/stale-restmapper-hides-newly-installed-crds.md)).

## Related

[concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md), [concepts/custom-resource-definition](../concepts/custom-resource-definition.md), [entities/controller-runtime](../entities/controller-runtime.md).
