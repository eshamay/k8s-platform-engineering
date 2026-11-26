---
title: controller-runtime tracks informers by GVK while client-go factories key by Go type or GVR
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Informer keying]
tags: [gvk, gvr, informers, cache, controller-runtime, client-go, mechanism]
---

# controller-runtime tracks informers by GVK while client-go factories key by Go type or GVR

## Observation

Three keying schemes coexist. [[sources/research-gap-m5-informers-caches]]

client-go's generated typed informer factory keys informers by Go type: `informers map[reflect.Type]cache.SharedIndexInformer`. https://github.com/kubernetes/client-go/blob/master/informers/factory.go

client-go's dynamic informer factory keys by GVR: `informers map[schema.GroupVersionResource]informers.GenericInformer`. https://github.com/kubernetes/client-go/blob/master/dynamic/dynamicinformer/informer.go

controller-runtime's informer tracker keys by GVK in three maps, for example `Structured: make(map[schema.GroupVersionKind]*Cache)`, plus Unstructured and Metadata maps. When it creates an informer, it asks the RESTMapper for the GVR with the comment "Kubernetes APIs work against Resources, not GroupVersionKinds." The cache also offers `RemoveInformer`, documented as "deactivates and removes the informer from the cache." https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/cache/internal/informers.go and https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/cache/informer_cache.go

## Consequence for CRD changes

Because controller-runtime keys by GVK and resolves the GVR once, a CRD that changes under the same GVK can leave stale state. Two closed issues show this, and both are user reports and not maintainer-confirmed behavior: [[examples/controller-runtime-issue-3303-a-recreated-crd-with-a-different-scope-was-not-picked-up-by-the-client-or-restmapper]] and [[examples/controller-runtime-issue-2589-a-controller-started-before-its-crd-existed-did-not-recover-until-the-cache-sync-timeout]]. What a running informer does when its CRD is deleted, or when served versions change, was not read from source or documentation and is UNVERIFIED.

## Related

[[concepts/gvk-and-gvr]], [[comparisons/gvk-versus-gvr]], [[concepts/informers-reflectors-and-workqueues]], [[findings/stale-restmapper-hides-newly-installed-crds]], [[entities/controller-runtime]], [[entities/client-go]].
