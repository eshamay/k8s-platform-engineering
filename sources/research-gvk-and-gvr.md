---
title: "Research dossier: GVK and GVR"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [gvk, gvr, api-machinery, restmapper, discovery, crd-versioning, research-dossier]
---

# Research dossier: GVK and GVR

> [!NOTE]
> **Raw file:** `raw/research-gvk-and-gvr.md` (sha256 prefix 5c56bb1e05a8)<br>
> **Kind:** Research dossier summarizing 18 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The Kubernetes API concepts page was read only to about 100,000 of 180,000 characters, the client-go discovery source came from a summarizing fetch, and the controller-runtime v0.3.0 default claim should be checked against release notes. The Argo CD details in the dossier come from search-result titles and are unverified.

## Summary

The dossier explains that a GVK (GroupVersionKind) names a type or schema, such as `apps/v1, Kind=Deployment`, while a GVR (GroupVersionResource) names an HTTP endpoint collection, such as `apps/v1, Resource=deployments`. Manifests speak GVK and REST URLs speak GVR, so anything that turns a manifest into an HTTP call needs a translator. That translator is the RESTMapper, which client-go builds from the API discovery documents, while a separate Scheme maps GVKs to Go types.

The dossier organizes the topic into three themes. The first is that discovery is a snapshot, so tools that install CRDs at runtime hit "no matches for kind" errors. The second is lifecycle: group and plural names are effectively permanent, versions evolve through served and storage flags, conversion, and storage version migration, and upstream Kubernetes removes beta GVKs on a published schedule. The third is that platform abstractions such as Crossplane XRDs and kro ResourceGraphDefinitions are GVK factories that generate CRDs and therefore new GVRs. The dossier found no named-organization case studies specifically about GVK or GVR.

See [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md) for the synthesized concept.

## Key claims

### Definitions and URL structure

- A resource type is the name used in the URL, and every resource type has a concrete object schema called a kind. The URL layout is `/api/v1/...` for the core group and `/apis/GROUP/VERSION/...` for named groups, with namespaced and subresource forms. URL: https://kubernetes.io/docs/reference/using-api/api-concepts/. Quote: "A resource type is the name used in the URL; all resource types have a concrete representation (their object schema) which is called a kind." See [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md) and [comparisons/gvk-versus-gvr](../comparisons/gvk-versus-gvr.md).
- A resource is simply a use of a Kind in the API, and each GVK corresponds to a root Go type registered in a Scheme. The mapping is usually one-to-one with the resource being the lowercased plural of the kind, but a single Kind such as `Scale` is served by many subresources (`deployments/scale`, `replicasets/scale`), whereas a CRD gives each Kind exactly one resource. The Kubebuilder book also argues for one Kind per concern, such as separate App and DB Kinds. URL: https://book.kubebuilder.io/cronjob-tutorial/gvks.html. Quote: "A resource is simply a use of a Kind in the API." See [examples/hpa-scales-any-workload-through-the-scale-subresource](../examples/hpa-scales-any-workload-through-the-scale-subresource.md).
- A short Slovak-language course page positions the REST mapper as the GVK-to-GVR converter and the Scheme as the Go-type serializer, with discovery telling clients what exists. It is a supplementary source. URL: https://okontajneroch.sk/18_client_go_pt1/. See [concepts/api-discovery-and-restmapper](../concepts/api-discovery-and-restmapper.md).

### Discovery and the RESTMapper

- The API publishes itself through the Discovery API and OpenAPI. Aggregated discovery (stable in v1.30) serves all resources for `/api` and `/apis` in one request when the client sends the `apidiscovery.k8s.io` Accept header, whereas unaggregated discovery needs a request per group-version. OpenAPI v3 has been stable since v1.27 and is preferred over v2. URL: https://kubernetes.io/docs/concepts/overview/kubernetes-api/. See [concepts/api-discovery-and-restmapper](../concepts/api-discovery-and-restmapper.md).
- The client-go restmapper package offers `NewDiscoveryRESTMapper`, `DeferredDiscoveryRESTMapper` (lazy initialization on first use), `NewShortcutExpander` for abbreviations such as `po`, `GetAPIGroupResources`, and `Reset`. URL: https://pkg.go.dev/k8s.io/client-go/restmapper. See [entities/client-go](../entities/client-go.md).
- The mapper is assembled from per-group-version DefaultRESTMappers with priority ordering (preferred versions first, core v1 first). The deferred variant invalidates and rebuilds its delegate when a mapping fails and the cache is not fresh, which is how it self-heals after a CRD is installed. The dossier reached this through a summarizing fetch, not a verbatim read. URL: https://github.com/kubernetes/client-go/blob/master/restmapper/discovery.go. See [comparisons/restmapper-strategies-static-deferred-and-dynamic](../comparisons/restmapper-strategies-static-deferred-and-dynamic.md).

### Failure modes

- A controller-runtime client built its RESTMapper once at startup, so CRDs created later produced "no matches for kind". Workarounds were wrapper mappers that reload on no-match and recreated clients, and the fix was a dynamic, rate-limited mapper that invalidates on lookup failure, reported as the default since controller-runtime v0.3.0. The version claim comes from a summarized thread and needs checking against release notes. URL: https://github.com/kubernetes-sigs/controller-runtime/issues/321. See [findings/stale-restmapper-hides-newly-installed-crds](../findings/stale-restmapper-hides-newly-installed-crds.md).
- A Prometheus Operator `ServiceMonitor` applied before its CRD is established fails with "no matches for kind" in Helm, Argo CD, and Flux alike. Causes include the CRD being absent or not yet established, a wrong apiVersion, operator and CRD version skew, and GitOps applying custom resources before CRDs. URL: https://oneuptime.com/blog/post/2026-08-27-fix-no-matches-kind-servicemonitor-helm-argo-cd/view. Quote: "Install a pinned, compatible CRD set first, wait for it to become established". This is a practitioner post of uneven rigor. See [examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd](../examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd.md) and [findings/custom-resources-applied-before-their-crd-exists](../findings/custom-resources-applied-before-their-crd-exists.md).
- Kubebuilder issue 5872 (opened 2026-07-14, still open in late October 2026) proposes a `--domain` flag and erroring on ambiguous external GVK resolution, because multiple external resources can share Group, Version, and Kind under different domains. URL: https://github.com/kubernetes-sigs/kubebuilder/issues/5872. See [examples/kubebuilder-domain-flag-for-ambiguous-external-gvks](../examples/kubebuilder-domain-flag-for-ambiguous-external-gvks.md).
- A practitioner post advises choosing group and resource names carefully because changing them is hard. URL: https://dev.to/omerxx/10-things-i-wish-id-known-before-building-a-kubernetes-crd-controller-1cl3. Quote: "Changing them is quite the challenge, to say the least." The post touches GVK and GVR only in passing. See [findings/group-and-plural-names-are-effectively-permanent](../findings/group-and-plural-names-are-effectively-permanent.md).

### Ordering in GitOps tools

- Flux orders work with `.spec.dependsOn`, `.spec.healthChecks`, and `.spec.wait`. The documented pattern puts CRD-providing controllers in one Kustomization and the custom resources in another that depends on it, and health checks reference resources by apiVersion and kind so they also depend on discovery. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/. Quote: "the Kustomization is only applied after the referred Kustomizations are ready". See [comparisons/missing-crd-handling-flux-versus-argo-cd](../comparisons/missing-crd-handling-flux-versus-argo-cd.md) and [entities/flux](../entities/flux.md).
- Argo CD users reach for sync waves and skipping dry-run on missing resources. The dossier could not read the Argo-specific posts (two sites failed to resolve), so these details come from search-result titles and are unverified. See [comparisons/missing-crd-handling-flux-versus-argo-cd](../comparisons/missing-crd-handling-flux-versus-argo-cd.md).

### Platform abstractions as GVK factories

- A Crossplane XRD declares `group`, `kind`, `plural`, a version list, and a `scope`, and Crossplane generates the CRD from it. The XRD name must be `<plural>.<group>`. Group and names are immutable (delete and recreate to change), breaking schema changes should ship as new XRDs or through conversion webhooks, and schema edits need a Crossplane pod restart. URL: https://docs.crossplane.io/latest/composition/composite-resource-definitions/. The dossier only mentions, and does not detail, the difference between v1 claims and v2 namespaced composite resources. See [examples/xrd-and-rgd-declare-platform-gvks](../examples/xrd-and-rgd-declare-platform-gvks.md), [decisions/conversion-webhook-versus-new-xrd-for-breaking-changes](../decisions/conversion-webhook-versus-new-xrd-for-breaking-changes.md), and [entities/crossplane](../entities/crossplane.md).
- In a kro ResourceGraphDefinition, `schema` declares `apiVersion`, `kind`, and an optional `group` that defaults to `kro.run`. kro converts a SimpleSchema into an OpenAPI v3 schema, creates a CRD named `<plural>.<group>`, and infers status field types from CEL expressions. URL: https://kro.run/docs/concepts/rgd/schema/. Quote: "When you create an RGD, kro converts your SimpleSchema into an OpenAPI v3 schema and generates a CRD". See [entities/kro](../entities/kro.md).
- CRDs add new kinds and resources to the existing API server, while the aggregation layer fronts a separately run API server for full control over REST behavior. URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/. See [decisions/crd-versus-aggregated-api](../decisions/crd-versus-aggregated-api.md).

### Versioning and removal

- One version per CRD is the storage version and any number can be `served`. Conversion is `None`, which rewrites only the apiVersion and requires matching schemas, or `Webhook`. Retiring a version means adding the new version, migrating clients, setting the old version `served: false`, upgrading stored objects, and then removing it. URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/. See [concepts/crd-versioning-and-storage-migration](../concepts/crd-versioning-and-storage-migration.md) and [findings/crd-version-removal-without-migration-strands-stored-objects](../findings/crd-version-removal-without-migration-strands-stored-objects.md).
- A StorageVersionMigration object rewrites all stored objects to the current storage version, and it is needed before dropping an old CRD version or changing the storage schema. URL: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration/. Quote: "all objects for a Resource have been migrated off of a stale storage version."
- Kubernetes 1.26 removed `flowcontrol.apiserver.k8s.io/v1beta1` and `autoscaling/v2beta2`, with advice to move manifests and clients to GA versions. URL: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/. See [examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26](../examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26.md) and [findings/removed-beta-gvks-break-pinned-manifests-and-clients](../findings/removed-beta-gvks-break-pinned-manifests-and-clients.md).
- PodSecurityPolicy (`policy/v1beta1`) was deprecated in 1.21 and removed in 1.25, replaced by Pod Security Admission, which is an example of a whole resource and not just a version being retired. URL: https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/.

## Open questions in the dossier

The dossier could not establish how Argo CD, Config Connector, ACK, and Cluster API key resources by GVK, did not cover informer and cache-by-GVR behavior, found no KEP for aggregated discovery, did not clarify Crossplane v1 claims versus v2 namespaced composite resources, and did not know whether Kubebuilder issue 5872 will land. These are tracked in [open-knowledge-gaps](../open-knowledge-gaps.md).
