# Research dossier: GVK and GVR

Research date: 2026-11-25

## Overview

A GVK (GroupVersionKind) names a *type*: the schema of an object, such as `apps/v1, Kind=Deployment`. A GVR (GroupVersionResource) names an *HTTP endpoint collection*: the plural, lowercase resource that appears in a URL, such as `apps/v1, Resource=deployments`. The Kubernetes API concepts page states the split plainly: the resource is the URL name, and the kind is the concrete schema. Most of the time the mapping is one-to-one and the resource is the lowercased plural of the kind, but it is not guaranteed. The Kubebuilder book notes that a single Kind such as `Scale` is served by many subresources (`deployments/scale`, `replicasets/scale`), which is how the HPA can scale different workloads uniformly. CRDs, by contrast, give each Kind exactly one resource.

Manifests and wire payloads speak GVK (`apiVersion` plus `kind`). REST URLs speak GVR (`/apis/<group>/<version>/<plural>`; core group uses `/api/v1`). Anything that turns a manifest into an HTTP call needs a translator. That translator is the RESTMapper, which client-go builds from the API discovery documents (`/api`, `/apis`, and since v1.30 stable aggregated discovery in one request). A second registry, the Scheme, maps GVKs to Go types so typed clients can decode JSON. Dynamic and unstructured clients skip the Scheme and take a GVR directly, which is why generic tooling (GitOps engines, composition engines, `kubectl`) is built around discovery plus RESTMapper.

Because discovery is a snapshot, platform tooling that installs CRDs at runtime has a recurring failure class: a lookup for a GVK that the cluster (or the cached mapper) does not yet know, surfaced as "no matches for kind X in version Y". The sources describe three mitigations: ordering (Flux `dependsOn`, Argo CD sync waves), mapper invalidation (client-go DeferredDiscoveryRESTMapper, controller-runtime's dynamic rate-limited mapper), and not depending on the CRD being present at all.

The second theme is lifecycle. Group and plural names are effectively permanent (Crossplane forbids changing an XRD's group or names; a practitioner post calls renaming "quite the challenge"). Versions evolve through served/storage flags, optional conversion webhooks, and storage version migration, and upstream Kubernetes removes beta GVKs on a published schedule (PSP `policy/v1beta1` in 1.25, HPA `v2beta2` and flowcontrol `v1beta1` in 1.26), which breaks manifests and clients pinned to old GVKs.

The third theme is that platform abstractions are GVK factories. Crossplane XRDs and kro ResourceGraphDefinitions let a platform team declare a group, kind, and version, and the tool generates the CRD (and so a new GVR) on the cluster. Understanding GVK/GVR is therefore the entry ticket to understanding what these tools create and what their controllers watch.

## Sources

### 1. Kubernetes API Concepts
- URL: https://kubernetes.io/docs/reference/using-api/api-concepts/
- Title: Kubernetes API Concepts
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: Canonical definition of resource type versus kind, the API group and version scheme, and the URL layouts (`/api/v1/...` for core, `/apis/GROUP/VERSION/...` for named groups, with namespaced and subresource forms). It also covers discovery endpoints and aggregated discovery, plus watch, pagination, and server-side apply semantics. Useful as the authoritative reference for the GVR-to-URL relationship. Only the first ~100k of ~180k characters were read; later sections (watch bookmarks, server-side apply, etc.) were not.
- Quote: "A resource type is the name used in the URL; all resource types have a concrete representation (their object schema) which is called a kind."

### 2. The Kubernetes API (overview)
- URL: https://kubernetes.io/docs/concepts/overview/kubernetes-api/
- Title: The Kubernetes API
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Describes the two ways the API publishes itself: the Discovery API and OpenAPI. Aggregated discovery (stable in v1.30) serves all resources for `/api` and `/apis` in a single request when the client sends the `apidiscovery.k8s.io` Accept header, whereas unaggregated discovery requires per-group-version requests. OpenAPI v3 (stable since v1.27) is preferred over v2. Explains why modern clients make far fewer startup calls. Last ~8k characters not read.

### 3. Groups and Versions and Kinds, oh my! (Kubebuilder Book)
- URL: https://book.kubebuilder.io/cronjob-tutorial/gvks.html
- Title: Groups and Versions and Kinds, oh my!
- Publisher: Kubebuilder / kubernetes-sigs
- Kind: Tutorial / official project book
- Summary: The friendliest ramp-up explanation. Defines group, version, kind, and resource, notes the Scale/subresource exception, and explains that each GVK corresponds to a root Go type registered in a Scheme. It also argues for one CRD per concern (App and DB as separate Kinds) as a design principle.
- Quote: "A resource is simply a use of a Kind in the API."

### 4. client-go restmapper package
- URL: https://pkg.go.dev/k8s.io/client-go/restmapper
- Title: restmapper package - k8s.io/client-go/restmapper
- Publisher: Kubernetes (Go package docs)
- Kind: API reference
- Summary: Lists the constructors that build a mapper from discovery output: `NewDiscoveryRESTMapper`, `DeferredDiscoveryRESTMapper` (lazy init on first use), `NewShortcutExpander` (for `po` style abbreviations), `GetAPIGroupResources`, and `Reset`. Good for naming the moving parts when explaining how a GVK becomes a GVR.

### 5. client-go restmapper/discovery.go
- URL: https://github.com/kubernetes/client-go/blob/master/restmapper/discovery.go
- Title: client-go/restmapper/discovery.go
- Publisher: kubernetes/client-go
- Kind: Source code
- Summary: Shows the mapper being assembled from per-group-version DefaultRESTMappers with priority ordering (preferred versions first, core v1 first). The deferred variant invalidates and rebuilds its delegate when a mapping fails and the cache is not fresh, which is the mechanism behind self-healing after a CRD is installed. The result came from a summarizing fetch, not a verbatim read of the whole file.

### 6. controller-runtime issue 321: RESTMapper doesn't update to reflect new CRDs
- URL: https://github.com/kubernetes-sigs/controller-runtime/issues/321
- Title: RESTMapper doesn't update to reflect new CRDs
- Publisher: kubernetes-sigs/controller-runtime community
- Kind: GitHub issue / design discussion
- Summary: Documents the original failure: the client's RESTMapper was built once at startup, so CRDs created later produced "no matches for kind". Workarounds included wrapper mappers that reload on no-match and recreating clients. The fix was a dynamic, rate-limited mapper that invalidates on lookup failure, default since controller-runtime v0.3.0. A strong case study in how the GVK-to-GVR cache fails and how it was fixed.

### 7. Kubebuilder issue 5872: `--domain` flag and ambiguous external GVK resolution
- URL: https://github.com/kubernetes-sigs/kubebuilder/issues/5872
- Title: Add `--domain` flag and reject ambiguous external GVK resolution
- Publisher: kubernetes-sigs/kubebuilder (opened 2026-07-14)
- Kind: GitHub issue (feature proposal)
- Summary: A recent example that GVK is not always a unique key in scaffolding tools. Multiple external resources may share Group, Version, and Kind under different domains, so Kubebuilder proposes erroring on ambiguity and adding an explicit `--domain`. Still open and labeled stale/unstale in the thread as of late October 2026.

### 8. Flux Kustomization API
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization
- Publisher: Flux project (CNCF)
- Kind: Official documentation
- Summary: Explains ordering with `.spec.dependsOn`, `.spec.healthChecks`, and `.spec.wait`. The documented pattern is to put CRD-providing controllers in one Kustomization and the custom resources in another that depends on it. Health checks reference resources by apiVersion/kind, so they too depend on discovery. Last ~21k characters not read.
- Quote: "the Kustomization is only applied after the referred Kustomizations are ready"

### 9. Crossplane Composite Resource Definitions
- URL: https://docs.crossplane.io/latest/composition/composite-resource-definitions/
- Title: Composite Resource Definitions (Crossplane v2.4)
- Publisher: Crossplane (CNCF)
- Kind: Official documentation
- Summary: An XRD declares `group`, `kind`, `plural`, a version list, and a `scope`, and Crossplane generates the CRD from it. The XRD name must be `<plural>.<group>`. Group and names are immutable (delete and recreate to change), breaking schema changes should ship as new XRDs or via conversion webhooks, and schema edits need a Crossplane pod restart. Shows the platform-team-as-GVK-author model. The v1 claims versus v2 distinction was only mentioned, not detailed.

### 10. kro Schema Definition
- URL: https://kro.run/docs/concepts/rgd/schema/
- Title: Schema Definition
- Publisher: kro project
- Kind: Official documentation
- Summary: In an RGD, `schema` declares `apiVersion`, `kind`, and an optional `group` (default `kro.run`). kro converts a SimpleSchema into OpenAPI v3 and creates a CRD named `<plural>.<group>`, and types status fields by inferring from CEL expressions. Same GVK-factory idea as Crossplane with a lighter authoring syntax.
- Quote: "When you create an RGD, kro converts your SimpleSchema into an OpenAPI v3 schema and generates a CRD"

### 11. Custom Resources (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
- Title: Custom Resources
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Explains that CRDs add new kinds and resources to the existing API server, while the aggregation layer fronts a separately run API server for full control over REST behavior. Frames when a new GVR should be a CRD (declarative, kubectl-friendly) versus aggregated. Tail ~19k characters unread.

### 12. Versions in CustomResourceDefinitions
- URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/
- Title: Versions in CustomResourceDefinitions
- Publisher: Kubernetes project
- Kind: Official task documentation
- Summary: One version per CRD is the storage version; any number can be `served`. Conversion is `None` (rewrites only apiVersion, schemas must match) or `Webhook`. The retirement sequence is add the new version, migrate clients, set the old version `served: false`, upgrade stored objects, then remove it. About 39k characters unread.

### 13. Migrate Kubernetes Objects Using Storage Version Migration
- URL: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration/
- Title: Migrate Kubernetes Objects Using Storage Version Migration
- Publisher: Kubernetes project
- Kind: Official task documentation
- Summary: A StorageVersionMigration object rewrites all stored objects to the current storage version, needed before dropping an old CRD version or changing storage schema. Closes the loop on the versions page.
- Quote: "all objects for a Resource have been migrated off of a stale storage version."

### 14. Kubernetes 1.26 removals and deprecations
- URL: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/
- Title: Kubernetes Removals, Deprecations, and Major Changes in 1.26
- Publisher: Kubernetes blog
- Kind: Release engineering blog
- Summary: Lists removed GVKs, notably `flowcontrol.apiserver.k8s.io/v1beta1` and `autoscaling/v2beta2`, with advice to move manifests and clients to GA versions. Concrete evidence that a GVK can disappear from a cluster and break pinned tooling.

### 15. PodSecurityPolicy Deprecation: Past, Present, and Future
- URL: https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/
- Title: PodSecurityPolicy Deprecation: Past, Present, and Future
- Publisher: Kubernetes blog
- Kind: Project blog / deprecation announcement
- Summary: PSP (`policy/v1beta1`) was deprecated in 1.21 and removed in 1.25, replaced by Pod Security Admission. A real example of a whole resource, not just a version, being retired.

### 16. Fix "no matches for kind ServiceMonitor" in Helm or Argo CD
- URL: https://oneuptime.com/blog/post/2026-08-27-fix-no-matches-kind-servicemonitor-helm-argo-cd/view
- Title: Fix Missing ServiceMonitor CRDs in Helm or Argo CD
- Publisher: OneUptime blog
- Kind: Engineering blog / troubleshooting guide
- Summary: Lists causes (CRD absent or not yet established, wrong apiVersion, operator/CRD version skew, GitOps applying custom resources before CRDs) and fixes (install pinned CRDs first, wait for established, order after discovery). Directly maps to the Prometheus Operator ServiceMonitor scenario.
- Quote: "Install a pinned, compatible CRD set first, wait for it to become established"

### 17. 10 Things I Wish I'd Known Before Building a Kubernetes CRD Controller
- URL: https://dev.to/omerxx/10-things-i-wish-id-known-before-building-a-kubernetes-crd-controller-1cl3
- Title: 10 Things I Wish I'd Known Before Building a Kubernetes CRD Controller
- Publisher: Omer Hamerman (DEV Community)
- Kind: Practitioner blog
- Summary: Lessons for controller authors: use Kubebuilder, finalizers, owner references, the dynamic client with `DefaultUnstructuredConverter` outside controllers, and choose group/resource names carefully because they are hard to change. It only touches GVK/GVR in passing.
- Quote: "Changing them is quite the challenge, to say the least."

### 18. Knižnica client-go (okontajneroch.sk)
- URL: https://okontajneroch.sk/18_client_go_pt1/
- Title: Knižnica client-go
- Publisher: okontajneroch.sk (Slovak-language Kubernetes course)
- Kind: Tutorial explainer
- Summary: Briefly positions the REST mapper as the GVK-to-GVR converter and the Scheme as the Go-type serializer, with discovery telling clients what exists. Short and in Slovak, so a supplementary source.

## Real-world use cases

Kubebuilder-based operators: the Kubebuilder book's CronJob tutorial and its App/DB example show the typical pattern, where each domain concept gets its own Kind, and controller-gen emits a CRD so each Kind gains a GVR (https://book.kubebuilder.io/cronjob-tutorial/gvks.html). The Kubebuilder `--domain` issue shows that real projects composing external APIs can hit identical G/V/K under different domains (https://github.com/kubernetes-sigs/kubebuilder/issues/5872).

Platform APIs on Crossplane and kro: a platform team defines, for example, a `Database` or `App` Kind in its own group via an XRD or an RGD, and the tool generates the CRD that application teams consume (https://docs.crossplane.io/latest/composition/composite-resource-definitions/, https://kro.run/docs/concepts/rgd/schema/). The GVK becomes the platform's public contract, so naming and versioning decisions are product decisions.

Prometheus Operator `ServiceMonitor` in Helm and Argo CD deployments is the most common everyday GVK-missing scenario (https://oneuptime.com/blog/post/2026-08-27-fix-no-matches-kind-servicemonitor-helm-argo-cd/view). Flux users solve the same case with a controllers Kustomization followed by a dependent configuration Kustomization (https://fluxcd.io/flux/components/kustomize/kustomizations/).

HPA and scale subresources: the HorizontalPodAutoscaler talks to any scalable workload because many resources return the same `Scale` Kind (https://book.kubebuilder.io/cronjob-tutorial/gvks.html).

Cluster upgrades: teams upgrading across 1.25 and 1.26 had to migrate manifests off `policy/v1beta1` PSP, `autoscaling/v2beta2`, and `flowcontrol/v1beta1` (https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/, https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/).

I did not find readable named-organization case studies (for example a company engineering blog) specifically about GVK/GVR; the use cases above are project-level and typical-scenario.

## Pitfalls and how tools address them

Stale mapper after CRD install. A mapper built once at startup cannot see later CRDs. controller-runtime fixed this with a dynamic, rate-limited mapper that invalidates on failure (https://github.com/kubernetes-sigs/controller-runtime/issues/321), and client-go's DeferredDiscoveryRESTMapper resets and retries on a failed mapping (https://github.com/kubernetes/client-go/blob/master/restmapper/discovery.go, https://pkg.go.dev/k8s.io/client-go/restmapper).

Applying custom resources before their CRD exists. This produces "no matches for kind" in Helm, Argo CD, and Flux alike (https://oneuptime.com/blog/post/2026-08-27-fix-no-matches-kind-servicemonitor-helm-argo-cd/view). Flux addresses it with separate Kustomizations ordered by `dependsOn` plus health checks (https://fluxcd.io/flux/components/kustomize/kustomizations/). Argo CD users reach for sync waves and skipping dry-run on missing resources; I could not read the Argo-specific posts (philipptheserver.com and argorollouts.com failed to resolve), so those details come from search-result titles only and are unverified.

Immutable and ambiguous names. Crossplane refuses to change an XRD group or names after creation, and recommends new XRDs for breaking schema changes (https://docs.crossplane.io/latest/composition/composite-resource-definitions/). A practitioner post makes the same warning about choosing group names (https://dev.to/omerxx/10-things-i-wish-id-known-before-building-a-kubernetes-crd-controller-1cl3). Ambiguity across domains is being handled in Kubebuilder by erroring and requiring explicit input (https://github.com/kubernetes-sigs/kubebuilder/issues/5872).

Version evolution hazards. `conversion.strategy: None` only rewrites the apiVersion, so differing schemas need a webhook, and an old version must stop being served and have its stored objects migrated before removal (https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/, https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration/).

Upstream GVK removal. Pinned manifests, charts, and clients break when beta versions disappear (https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/). The mitigation in these sources is to move to GA versions ahead of upgrades; deprecation-scanning tools (pluto, kubent) were only seen in search results and not read.

Discovery cost. Without aggregated discovery, clients make a request per group-version; the stable aggregated form (v1.30) collapses that (https://kubernetes.io/docs/concepts/overview/kubernetes-api/).

Not covered by any page I could read: how Config Connector, ACK, Cluster API, and Argo CD's own resource tracking handle GVKs. The Cluster API clusterctl page I fetched contained no GVK detail.

## Tutorial and explainer links

- https://book.kubebuilder.io/cronjob-tutorial/gvks.html: best first read, explains the four terms and the Scheme.
- https://kubernetes.io/docs/reference/using-api/api-concepts/: authoritative resource-versus-kind and URL structure reference.
- https://kubernetes.io/docs/concepts/overview/kubernetes-api/: how discovery and OpenAPI expose GVKs and GVRs.
- https://pkg.go.dev/k8s.io/client-go/restmapper: names the Go types that do the GVK-to-GVR translation.
- https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/: how to evolve a CRD's versions safely.
- https://kro.run/docs/concepts/rgd/schema/: shows a GVK being declared and a CRD generated in a few lines.
- https://okontajneroch.sk/18_client_go_pt1/: short client-go overview (Slovak).

## Open questions

- How Argo CD, Config Connector, ACK, and Cluster API specifically key resources by GVK (for example, tracking and pruning across API version changes) was not established from readable sources.
- The api-concepts page was read only to about 100k of 180k characters, and the Medium post by Tim Ebert on clients and caches returned empty content, so informer and cache-by-GVR behavior is not covered.
- No KEP for aggregated discovery was found (the search returned nothing), so the design rationale is only from the user-facing docs.
- Crossplane v1 claims versus v2 namespaced XRs and how that changes the GVKs involved was not clarified.
- Whether the Kubebuilder domain-ambiguity proposal (issue 5872) lands is unknown; it was open at the time of reading.
- Several secondary sources (DEV Community, OneUptime) are practitioner posts of uneven rigor; the controller-runtime v0.3.0 default claim comes from a summarized issue thread and should be checked against release notes before publishing.
