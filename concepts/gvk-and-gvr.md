---
title: GVK and GVR (Group, Version, Kind and Resource)
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: [GVK, GVR, Group Version Kind, GroupVersionKind, GroupVersionResource]
tags: [api-machinery, gvk, gvr, discovery]
---

# GVK and GVR (Group, Version, Kind and Resource)

## Definition

A GVK (GroupVersionKind) names a type: the schema of an object, such as `apps/v1, Kind=Deployment`. A GVR (GroupVersionResource) names an HTTP endpoint collection: the plural, lowercase resource that appears in a URL, such as `apps/v1, Resource=deployments`. The Kubernetes API concepts page states the split plainly: "A resource type is the name used in the URL; all resource types have a concrete representation (their object schema) which is called a kind." The seed vocabulary gives the same pair with a provider example, where `s3.aws.upbound.io/v1beta1` with `Kind=Bucket` is the GVK and `buckets` is the resource. [[sources/krm-platform-vocabulary]] [[sources/research-gvk-and-gvr]]

## How the two relate

Manifests and wire payloads speak GVK through `apiVersion` and `kind`. REST URLs speak GVR through `/apis/<group>/<version>/<plural>`, and the core group uses `/api/v1`. In most cases the mapping is one to one and the resource is the lowercased plural of the kind, but that is not guaranteed. The Kubebuilder book notes that one Kind, `Scale`, is served by many subresources such as `deployments/scale` and `replicasets/scale`, which is how the HorizontalPodAutoscaler scales different workloads uniformly. A CRD, by contrast, gives each Kind exactly one resource. The Kubebuilder book summarizes the relationship as "A resource is simply a use of a Kind in the API." See [[comparisons/gvk-versus-gvr]] and [[examples/hpa-scales-any-workload-through-the-scale-subresource]].

## Translating between them

Anything that turns a manifest into an HTTP call needs a translator. In client-go that translator is the RESTMapper, which is built from the API discovery documents, and a separate Scheme maps GVKs to Go types so that typed clients can decode JSON. Dynamic and unstructured clients skip the Scheme and take a GVR directly, which is why generic tooling such as GitOps engines, composition engines, and `kubectl` is built around discovery plus a RESTMapper. See [[concepts/api-discovery-and-restmapper]] and [[entities/client-go]].

## Lifecycle of coordinates

Group and plural names are effectively permanent. Crossplane forbids changing an XRD's group or names, and a practitioner post calls renaming "quite the challenge". Versions, in contrast, evolve through served and storage flags, optional conversion webhooks, and storage version migration, and upstream Kubernetes removes beta GVKs on a published schedule. See [[findings/group-and-plural-names-are-effectively-permanent]], [[concepts/crd-versioning-and-storage-migration]], and [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]].

## Platform abstractions as GVK factories

Crossplane XRDs and kro ResourceGraphDefinitions let a platform team declare a group, kind, and version, and the tool generates the CRD, and so a new GVR, on the cluster. The GVK becomes the platform's public contract, so naming and versioning decisions are product decisions. Understanding GVK and GVR is therefore the entry ticket to understanding what these tools create and what their controllers watch. See [[examples/xrd-and-rgd-declare-platform-gvks]].

## Failure classes

Because discovery is a snapshot, tooling that installs CRDs at runtime faces "no matches for kind X in version Y" when a lookup names a GVK that the cluster or a cached mapper does not yet know. The sources describe three mitigations: ordering (Flux `dependsOn`, Argo CD sync waves), mapper invalidation (client-go's deferred mapper and controller-runtime's dynamic mapper), and not depending on the CRD being present at all. GVK is also not always a unique key in scaffolding tools, since external APIs can share Group, Version, and Kind under different domains. See [[findings/stale-restmapper-hides-newly-installed-crds]], [[findings/custom-resources-applied-before-their-crd-exists]], and [[examples/kubebuilder-domain-flag-for-ambiguous-external-gvks]].

## Why it matters

Clients, controllers, and RBAC rules all address objects through these coordinates. Mapping a Kind to its resource name is a routine task for generic tooling, and it is why [[concepts/custom-resource-definition]] declares both names.

## Related

[[concepts/provider]], [[concepts/managed-resource]], [[concepts/informers-reflectors-and-workqueues]], [[decisions/crd-versus-aggregated-api]], [[entities/controller-runtime]], [[entities/kubebuilder]]

## To research

How Argo CD, Config Connector, ACK, and Cluster API key resources by GVK, and how informer caches are keyed by GVR, remain open. See [[open-knowledge-gaps]].
