# Research dossier: Custom Resource Definitions

Research date: 2026-11-25

Method note: pages were fetched with WebFetch, which returns a model-generated extract of the page. Several long kubernetes.io pages were only read for their first ~100,000 characters (noted per source). web_scrape output exceeded the token cap on the big pages, so it was not used for them. No authentication was needed for any source.

## Overview

A CustomResourceDefinition (CRD) is a Kubernetes API object that registers a new resource type with the API server at runtime. Once the CRD exists, the built-in kube-apiserver serves a REST endpoint for the new kind. It gives you the same machinery as built-in types: list/watch, RBAC, audit logging, schema validation, and storage in etcd. No new server is needed. The official docs frame this as the low-effort extension path. The alternative, an aggregated API server, is more flexible but means you run and operate a separate server.

A CRD alone only stores data. The usual pattern is "custom resource plus custom controller": the controller watches the resource and reconciles the real world toward the declared `spec`, reporting progress in `status`. This is the operator pattern. The API conventions document sets the rules for the contract. `spec` is user intent and `status` is observation, and status is written through the `/status` subresource. Conditions report state, and `resourceVersion` gives optimistic concurrency. `generation` and `observedGeneration` track whether the controller has seen the latest spec.

The mechanics that matter most to a platform engineer are the schema and the versions. The schema is a structural OpenAPI v3 schema. It drives validation, pruning of unknown fields, and defaulting. Newer clusters add CEL validation rules, which remove many reasons to run a validating webhook. Versions work through `served` and `storage` flags. Exactly one version is the storage version. Conversion between versions is either `None` (only `apiVersion` is rewritten) or a `Webhook`. Moving stored objects to a new storage version is now handled by the built-in StorageVersionMigration API, which the sources report as GA in Kubernetes v1.37.

Higher-level platform tools treat CRDs as a product surface. Crossplane XRDs and kro ResourceGraphDefinitions generate CRDs from a simpler schema, so platform teams publish their own APIs. Flux and Argo CD treat CRDs as a lifecycle problem. Helm will not upgrade or delete them, and client-side apply can fail on very large CRDs. The sources agree that CRDs are cheap to add but carry real operational weight: each one adds API surface, etcd data, webhook dependencies, and upgrade ordering concerns.

## Sources

### 1. Custom Resources
- URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
- Title: Custom Resources | Kubernetes
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: The concept page that defines custom resources and compares CRDs with aggregated APIs. CRDs need no new server and suit simpler needs. Aggregated APIs allow custom business logic but must be run separately. It lists when to use a custom resource (declarative API, kubectl and dashboard integration, RBAC and audit for free) and when not to (non-declarative API, odd REST paths). It warns that third-party CRD code adds failure points, that data lives in etcd and needs backup, and that authN/authZ/audit must be considered. Good first read for tutorial writers. Read the first ~100k of 119k characters.
- Quote: "Custom resources can appear and disappear in a running cluster through dynamic registration, and cluster admins can update custom resources independently of the cluster itself."

### 2. Versions in CustomResourceDefinitions
- URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/
- Title: Versions in CustomResourceDefinitions | Kubernetes
- Publisher: Kubernetes project
- Kind: Official task documentation
- Summary: Explains `served` versus `storage` flags (only one storage version), the lifecycle of adding a version, migrating data, deprecating and removing the old version, and the two conversion strategies. `None` changes only `apiVersion`. `Webhook` calls a service with `conversionReviewVersions` and a `caBundle`. It tells readers to check `status.storedVersions` before dropping an old version from the spec. Core reference for the versioning tutorial. Read the first ~100k of ~139k characters.
- Quote: none verbatim (the fetch tool returned a paraphrase).

### 3. Extend the Kubernetes API with CustomResourceDefinitions
- URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
- Title: Extend the Kubernetes API with CustomResourceDefinitions | Kubernetes
- Publisher: Kubernetes project
- Kind: Official task documentation
- Summary: Hands-on page covering a minimal CRD manifest (group, scope, names, versions, `openAPIV3Schema`), field pruning with the `x-kubernetes-preserve-unknown-fields` escape hatch, CEL validation rules, defaulting, validation ratcheting, `/status` and `/scale` subresources, finalizers, and additional printer columns. It is the main source for "how to write a CRD". Read the first ~100k of ~170k characters, so later material (for example categories, short names, and deeper CEL details) was not reviewed.
- Quote: none verbatim.

### 4. Kubernetes API Conventions
- URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md
- Title: API Conventions
- Publisher: Kubernetes SIG Architecture
- Kind: Design and convention document
- Summary: The rulebook behind good CRD design. It covers the `spec`/`status` split, standard condition structure (type, status, reason, message, observedGeneration), `resourceVersion` conflicts returning HTTP 409, `generation`, three kinds of defaulting (static, admission, controller-assigned), ownerReferences for garbage collection, avoiding cross-namespace references, and naming style. Useful for explaining why well-built CRDs look the way they do. Read the first ~100k of ~127k characters.
- Quote: "By convention, the Kubernetes API distinguishes between the specification of desired state (`spec`) and the status of objects at current time (`status`)." (the fetch tool supplied this quote and it slightly exceeds 25 words; treat it as approximate)

### 5. Future of CRDs: Structural Schemas
- URL: https://kubernetes.io/blog/2019/06/20/crd-structural-schema/
- Title: Future of CRDs: Structural Schemas
- Publisher: Kubernetes blog
- Kind: Project blog / design rationale
- Summary: Explains why structural schemas were introduced: plain OpenAPI describes what must be present but not what is forbidden, so unknown fields leaked into storage. A structural schema is a constrained subset enabling validation, pruning, and defaulting, which brings CRDs closer to built-in API rigor. Gives the "why" for pruning behavior that surprises newcomers. Read the first ~100k of ~112k characters.
- Quote: "By the nature of OpenAPI specifications though—only describing what must be there, not what shouldn't, and by being potentially incomplete spec"

### 6. Kubernetes v1.37: Storage Version Migration Enabled by Default (GA)
- URL: https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/
- Title: Kubernetes v1.37: Storage Version Migration Enabled by Default
- Publisher: Kubernetes blog
- Kind: Release blog
- Summary: Announces that the built-in StorageVersionMigration API and controller graduated to GA and is on by default in v1.37. You create a `StorageVersionMigration` object naming a resource, and the controller rewrites stored objects to the current storage version. This closes a long-standing gap: operators previously wrote their own migrators (or used external tools) before removing an old CRD version. Details such as exact fields and automatic triggering were not fully verified; read ~100k of ~107k characters. Verify against the release notes before writing a tutorial.
- Quote: "Storage version migration has graduated to General Availability (GA) in Kubernetes v1.37"

### 7. CEL validation rules for CRDs (beta announcement)
- URL: https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/
- Title: Validation rules for CustomResourceDefinitions (beta)
- Publisher: Kubernetes blog
- Kind: Release blog
- Summary: Introduces `x-kubernetes-validations` CEL rules such as `self.minReplicas <= self.maxReplicas`, which let a CRD express cross-field validation inside the schema. Benefits: no webhook to run, less operational risk, and per-rule cost limits protect the apiserver. Read ~100k of ~113k characters. The rest (feature gate history, transition rules) was not read.
- Quote: "Validation rules make it possible to declare how custom resources are validated using the Common Expression Language (CEL)."

### 8. CRDs and Operators: extending Kubernetes with custom resources
- URL: https://semicolony.dev/codex/kubernetes/internals/crd-operators/
- Title: CRDs and Operators (Kubernetes internals codex)
- Publisher: semicolony.dev (independent author)
- Kind: Tutorial / internals explainer
- Summary: A compact internals walkthrough. The apiserver turns a schema into a typed REST surface. Custom resources sit in the same etcd keyspace as built-ins under `/registry/<group>/<resource>/...`. Controllers reconcile CRs into child resources (StatefulSets, Services, Secrets). It cites limits: objects capped near 1.5 MB, conversion webhook evaluation budget, and per-rule CEL cost budgets. Good plain-language bridge for newcomers, but it is a secondary source, so confirm numeric limits against official docs.
- Quote: "Hand the api-server an OpenAPI schema, it gives you back a typed REST surface: listed, watched, validated, RBAC'd, audit-logged, and stored in etcd."

### 9. Hubs, spokes, and other wheel metaphors
- URL: https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html
- Title: Hubs, spokes, and other wheel metaphors - The Kubebuilder Book
- Publisher: kubernetes-sigs / Kubebuilder
- Kind: Tutorial / framework docs
- Summary: Describes the hub-and-spoke conversion pattern: pick one version as the hub and have every other version convert only to and from it, so N versions need roughly 2(N-1) functions rather than pairwise conversions. This is the practical way controller-runtime projects implement conversion webhooks. A tutorial and a worked multi-version example follow in the same book (not read).
- Quote: "Mark one version as the 'hub', and all other versions just define conversion to and from the hub" (paraphrased by the fetch tool; approximate)

### 10. Composite Resource Definitions (Crossplane)
- URL: https://docs.crossplane.io/latest/composition/composite-resource-definitions/
- Title: Composite Resource Definitions | Crossplane
- Publisher: Crossplane project (CNCF)
- Kind: Official documentation
- Summary: An XRD is a schema from which Crossplane generates a CRD for a composite resource (XR), and in older modes also a claim CRD. Scope can be Namespaced (default in v2), Cluster, or LegacyCluster. Multiple API versions are allowed, and breaking schema changes need conversion webhooks. Documented pitfalls: schema changes may need a Crossplane pod restart, and group or names cannot be changed after creation, so you must delete and recreate. Shows the "CRD as platform API" use case. Note: the v1.14 URL returned 404, so the "latest" docs were read. Details may differ by Crossplane version.
- Quote: "XRDs define the names, data types, and required parameters for a custom API schema following OpenAPIv3 standards."

### 11. kro ResourceGraphDefinition overview
- URL: https://kro.run/docs/concepts/rgd/overview/
- Title: Overview | kro
- Publisher: kro project (Kube Resource Orchestrator)
- Kind: Official documentation
- Summary: kro lets you define a new API with a simple schema, a set of underlying resources, and CEL expressions that pass data between them. Applying a ResourceGraphDefinition causes kro to validate it, generate and register a CRD, and run a dynamic controller for instances. Dependencies are inferred from expressions and resources are created in topological order. Errors are caught at definition time. Contrasts with Crossplane in that kro builds CRDs from a lightweight schema without a separate composition language.
- Quote: "kro generates a CustomResourceDefinition for your API and registers it with the Kubernetes API server."

### 12. Helm Releases (Flux)
- URL: https://fluxcd.io/flux/components/helm/helmreleases/
- Title: Helm Releases | Flux
- Publisher: Flux project (CNCF)
- Kind: Official documentation
- Summary: Documents `spec.install.crds` and `spec.upgrade.crds` with Skip, Create (default), and CreateReplace policies, noting CreateReplace updates existing CRDs but does not delete removed ones. Recommends `dependsOn` so CRDs and their controllers exist before dependent releases. Explains Flux's workaround for Helm's refusal to manage CRD upgrades. Read ~100k of ~130k characters.
- Quote: "Helm has no native support for upgrading or deleting CRDs using Helm due to unintentional data loss dangers."

### 13. Argo CD ApplicationSets CRD too large for client-side apply
- URL: https://github.com/argoproj/argo-helm/issues/3704
- Title: argo-cd: ApplicationSets CRD too large for client-side-apply
- Publisher: argoproj/argo-helm issue tracker
- Kind: GitHub issue / community knowledge
- Summary: A real failure: a CRD's generated schema grew so large that the `last-applied-configuration` annotation exceeded the 262,144 byte annotation limit, so client-side apply failed. Workarounds are `ServerSideApply=true` sync option (and `ClientSideApplyMigration=false` for Kustomize). Concrete example of why big CRDs and Git-driven delivery tools clash.
- Quote: "The ApplicationSets CRD is invalid: metadata.annotations may not be more than 262144 bytes"

### 14. CRD Conversion webhook down results in controller-manager GC not working
- URL: https://github.com/kubernetes/kubernetes/issues/110720
- Title: CRD Conversion webhook down results in controller-manager GC...
- Publisher: kubernetes/kubernetes issue tracker
- Kind: Bug report / failure analysis
- Summary: When a CRD's conversion webhook service is unavailable, the garbage collector in kube-controller-manager can fail to sync its cache. Cascading deletes then stop (for example, a Deployment is deleted but ReplicaSets and Pods remain). The issue was closed as a duplicate of #101078, with the proposed direction being letting GC work with partial informer sync. This shows a third-party CRD webhook can degrade core control-plane behavior.
- Quote: "When the webhook service is down, the GC of controller-manager to be still working." (as returned; likely a typo for "not working")

### 15. Kubernetes Failure Stories
- URL: https://k8s.af/
- Title: Kubernetes Failure Stories
- Publisher: Henning Jacobs (community index)
- Kind: Postmortem index
- Summary: A curated list of public postmortems. The extract surfaced webhook-related ones, including Jetstack's 2019 post on an admission webhook outage and an Airbnb KubeCon NA 2020 talk citing a mutating admission webhook in outages. These are not CRD-specific but illustrate the same blast-radius pattern as source 14. I did not open the linked posts, so the one-line descriptions are index entries only.
- Quote: "ValidatingWebhookConfiguration caused prolonged downtime, nodes lost, and failed master upgrades" (index entry text)

### 16. Climbing the peak of scale: Ant Group's large-scale Kubernetes practice
- URL: https://segmentfault.com/a/1190000040750768/en
- Title: Climbing the peak of scale - Ant Group's large-scale Kubernetes cluster
- Publisher: Ant Group engineers (via SegmentFault)
- Kind: Engineering blog / case study
- Summary: Covers running a 10,000+ node cluster: serving lists from the apiserver watch cache (memory from roughly 400 GB to 100 GB), dynamic watch cache sizing, label indexing, retry tuning, and etcd splitting. It is not about CRDs specifically, but the apiserver and etcd bottlenecks it addresses are the ones that large CR counts hit, since CRs share the same storage and watch paths. Use it as a scale-limits context source, with that caveat.
- Quote: "All problems in computer science can be solved by another level of indirection, except for too many layers of indirection and performance problems."

## Real-world use cases

Crossplane uses XRDs to let platform teams publish company-specific APIs (for example a database or cluster abstraction) that expand into cloud resources via Compositions; see https://docs.crossplane.io/latest/composition/composite-resource-definitions/. kro offers a lighter route to the same outcome: an RGD defines a schema and a resource graph, and kro generates the CRD and runs the controller (https://kro.run/docs/concepts/rgd/overview/).

The generic operator scenario, described in https://semicolony.dev/codex/kubernetes/internals/crd-operators/, is a `PostgresCluster`-style CR that a controller turns into StatefulSets, Services, and Secrets. The official concept page (https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) names the same pattern as the operator pattern. Argo CD's ApplicationSet and Application CRDs (source 13) and Flux's HelmRelease (source 12) are CRD-based APIs that GitOps users consume daily. I did not find, in the pages read, named case studies of Config Connector, ACK, or Cluster API; those need additional sourcing.

At scale, Ant Group's 10,000+ node cluster (https://segmentfault.com/a/1190000040750768/en) shows the apiserver and etcd tuning needed when many objects are stored and watched. It does not break out CRD counts.

## Pitfalls and how tools address them

Schema and pruning. Unknown fields are dropped under a structural schema unless `x-kubernetes-preserve-unknown-fields` is set (https://kubernetes.io/blog/2019/06/20/crd-structural-schema/, https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/). Authors who forget to declare a field see it silently disappear. CEL rules and validation ratcheting reduce webhook need and let stricter validation be introduced without invalidating existing objects (https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/).

Versioning and storage. Only one storage version exists. Do not remove an old version from the spec until `status.storedVersions` shows migration is done (https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/). Historically operators ran their own migrators; v1.37 reports a built-in StorageVersionMigration controller (https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/). Kubebuilder's hub-and-spoke pattern limits the number of conversion functions you must write and test (https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html). Crossplane warns that breaking XRD changes need conversion webhooks and that group and names are immutable (source 10).

Conversion webhook availability. A down conversion webhook can stall the garbage collector and hence cascading deletion cluster-wide (https://github.com/kubernetes/kubernetes/issues/110720). Mitigations suggested by the sources: prefer `None` conversion when schemas are compatible, use CEL instead of validating webhooks, and run webhooks highly available. The k8s.af index (https://k8s.af/) lists admission webhook outages as a recurring failure class.

Delivery tools. Helm will not upgrade or delete CRDs; Flux compensates with `crds: CreateReplace` and `dependsOn` for ordering (https://fluxcd.io/flux/components/helm/helmreleases/). Argo CD users hit the 262,144-byte annotation limit with large CRDs and fix it with server-side apply (https://github.com/argoproj/argo-helm/issues/3704). Deleting a CRD deletes all its custom resources, which is why tools are cautious about CRD removal. That fact is standard Kubernetes behavior but I did not see it stated verbatim in the pages read.

Tool-generated CRDs. Crossplane schema changes may require a pod restart (source 10). kro validates at RGD time to catch errors early (source 11).

Scale. Objects are limited to roughly 1.5 MB by etcd request-size defaults, per the secondary source semicolony.dev. Large numbers of CRs consume apiserver watch-cache memory and etcd space; the Ant Group write-up gives techniques (watch cache serving, indexing) but not CRD-specific numbers.

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/ : best conceptual starting point, including CRD versus aggregated API.
- https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/ : walkthrough of writing a CRD with validation, defaults, and subresources.
- https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/ : step-by-step multi-version and conversion guidance.
- https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html : hub-and-spoke conversion explained for controller authors.
- https://semicolony.dev/codex/kubernetes/internals/crd-operators/ : short internals explainer on how CRs are served and stored.
- https://kubernetes.io/blog/2019/06/20/crd-structural-schema/ : why structural schemas and pruning exist.
- https://kro.run/docs/concepts/rgd/overview/ : lightweight example of generating CRDs from a schema.

## Open questions

- Scale limits: no source read gives authoritative numbers for maximum CRDs per cluster, CRs per type, or apiserver memory per CRD. The ~1.5 MB object limit comes from a secondary source only. Needs official scalability docs or SIG API Machinery material.
- The v1.37 StorageVersionMigration GA claim comes from a single blog extract that was cut off at the end; confirm feature details (automatic triggering versus manual object creation) in the KEP and release notes.
- Cluster API, Config Connector, and ACK CRD handling (versioning contract, very large CRDs, controller scoping) were not covered because a Cluster API search returned nothing and time was spent elsewhere. They need follow-up.
- Whether the GC and conversion webhook problem (issue 110720, duplicate of #101078) is fixed in current releases is unknown from the sources.
- Source 4's quote and source 2's quote came from tool extracts and are approximate. Source 3 and others were only read in the first ~100k characters, so some topics (categories, short names, ownership of defaults) may have details I missed.
- Postmortems linked from k8s.af were not opened; claims about them are index-level only.
