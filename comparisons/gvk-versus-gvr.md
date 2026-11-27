---
title: GVK versus GVR
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [gvk, gvr, api-machinery]
---

# GVK versus GVR

| Dimension | GVK (GroupVersionKind) | GVR (GroupVersionResource) |
|---|---|---|
| What it names | A type: the concrete object schema | An HTTP endpoint collection: the plural resource in a URL |
| Example | `apps/v1, Kind=Deployment` | `apps/v1, Resource=deployments` |
| Where it appears | `apiVersion` and `kind` in manifests and wire payloads | `/apis/<group>/<version>/<plural>`, or `/api/v1` for the core group |
| Go side | A root Go type registered in a Scheme | Taken directly by dynamic and unstructured clients |
| Cardinality | One Kind can be served by many resources, such as `Scale` | A CRD gives each Kind exactly one resource |

[sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md)

## Reading the table

The mapping is usually one to one and the resource is the lowercased plural of the kind, but this is not guaranteed. The RESTMapper translates between the two, using the API discovery documents. See [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md), [concepts/api-discovery-and-restmapper](../concepts/api-discovery-and-restmapper.md), and [examples/hpa-scales-any-workload-through-the-scale-subresource](../examples/hpa-scales-any-workload-through-the-scale-subresource.md).

## Where caches and tools use each key

controller-runtime keys informers by GVK and maps to a GVR through the RESTMapper, client-go's typed factory keys by Go type, its dynamic factory keys by GVR, kro holds one informer per GVR, and Argo CD, ACK and Config Connector identify resources by group and kind with no version. See [findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr](../findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr.md) and [findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately](../findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately.md). [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)
