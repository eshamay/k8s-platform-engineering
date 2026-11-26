---
title: GVK versus GVR
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
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

[[sources/research-gvk-and-gvr]]

## Reading the table

The mapping is usually one to one and the resource is the lowercased plural of the kind, but this is not guaranteed. The RESTMapper translates between the two, using the API discovery documents. See [[concepts/gvk-and-gvr]], [[concepts/api-discovery-and-restmapper]], and [[examples/hpa-scales-any-workload-through-the-scale-subresource]].
