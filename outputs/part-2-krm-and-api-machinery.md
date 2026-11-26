---
title: "Part 2: The Kubernetes Resource Model and API Machinery"
type: output
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags:
  - tutorial
  - series-part
  - krm
  - api-machinery
  - crd
  - server-side-apply
  - admission
---

# Part 2: The Kubernetes Resource Model and API Machinery

> [!NOTE]
> **Audience:** Engineers who operate Kubernetes day to day (pods, deployments, services, RBAC, kubectl) but have not yet studied controllers, API machinery, or platform abstractions.<br>
> **Purpose:** Teach the shared substrate that Flux, Crossplane, kro and their neighbors all build on, so that platform failures and design choices can be explained from first principles.<br>
> **Status:** Draft. Part 2 of the series on Kubernetes platform engineering.<br>
> **Created:** 2026-11-25<br>
> **As of:** 2026-11-25<br>
> **Draws on:** The wiki's concept, example, finding, comparison, decision and entity pages on GVK and GVR, CRDs, the spec and status split, server-side apply and admission, plus the research dossiers listed under Further reading.

## 1. Why the resource model is the real platform

When people first meet Flux, Crossplane or kro, the natural question is which one to pick. A more useful question comes before it: what do these tools have in common, and why can they run side by side in one cluster without a shared codebase or a shared vendor? The answer is that none of them ships its own database, its own authentication system, its own API server, or its own way of describing desired state. They all lean on the same substrate, which this tutorial calls the Kubernetes Resource Model, usually shortened to KRM, together with the API machinery that serves it.

The idea behind this is what the wiki calls the [[concepts/universal-control-plane]]. Kubernetes ships two things bundled together. One is a container scheduler. The other is a generic, extensible API server backed by etcd (the cluster's key-value store), with authentication, RBAC, admission, validation and a watch mechanism, plus a convention for controllers that reconcile what a user declared toward what actually exists. The second part has no inherent tie to pods. Anything that can be described declaratively and reconciled by a loop can be modeled as an object in the API, whether that is a cloud database, a DNS record, a whole cluster, or an application bundle. Once an external thing is represented as a Kubernetes object, it inherits authentication, authorization, audit, watch and a uniform client experience without anyone writing those features again.

This is why the resource model, and not any single tool, is the real platform. Flux fetches manifests from Git and writes objects into the API server. Crossplane defines new object types for infrastructure and runs controllers that act on them. kro lets a platform team publish a new object type that expands into a graph of other objects. Argo CD, Kyverno, cert-manager, Cluster API and the cloud add-ons (Config Connector, ACK, Azure Service Operator) all read and write the same kinds of objects through the same HTTP API. They coexist because they agree on a small set of contracts: how a type is named, how its schema is declared and evolved, who owns which half of an object, who owns which individual field, and how writes are checked before they are stored.

The thesis of this part is that those contracts explain most platform failures and most good design choices. When a Flux reconcile fails with "no matches for kind," when an Argo CD application sits permanently out of sync, when a webhook outage stops a cluster from being repaired, or when a Crossplane upgrade quietly changes who owns a field, the cause is almost always a contract in this substrate behaving exactly as designed while an operator or tool assumed something else. Learning the contracts first makes the tools far easier to reason about later. The tutorial walks from the structure of a single object up through naming, schemas, versioning, ownership and admission, then looks at pitfalls, at how individual tools use the machinery, and finally at principles for building APIs that platforms can sit on.

## 2. Anatomy of a Kubernetes resource: apiVersion, kind, metadata, spec, status

Every object you have ever applied with kubectl has the same skeleton. Before looking at the machinery, it is worth reading that skeleton slowly, because each part exists for a reason that later sections depend on.

Consider a small Deployment as it might look when read back from a cluster, trimmed for clarity.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: shop
  generation: 4
  resourceVersion: "812345"
  labels:
    app: web
  ownerReferences: []
  finalizers: []
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: example/web:1.4.2
status:
  observedGeneration: 4
  readyReplicas: 3
  conditions:
    - type: Available
      status: "True"
```

The first two fields, `apiVersion` and `kind`, say what type of thing this is. Together they form what the next section calls a GVK, and they let the API server pick the right schema, the right storage format and the right endpoint. The `metadata` block holds identity and bookkeeping that is common to every object: the name, the namespace, labels, and several fields that platform tooling relies on heavily. The `generation` counter increases whenever the desired state changes. The `resourceVersion` is an opaque token that supports optimistic concurrency, meaning that a write based on a stale copy is rejected with an HTTP 409 conflict instead of silently overwriting a newer change. The `ownerReferences` field links a child object to its parent so that deleting the parent cascades to the child, a behavior covered in [[concepts/owner-references-and-garbage-collection]]. The `finalizers` field lists tokens that stop the object from being removed from storage until a controller has finished cleanup, as described in [[concepts/finalizers]]. Finalizers are the reason an object can sit in `Terminating` for a long time when its controller is missing or failing, and they are the main way a controller makes deletion safe for things that live outside the cluster, such as a cloud database.

The last two top-level blocks, `spec` and `status`, are the heart of the model. The `spec` records intent: what somebody wants to be true. The `status` records observation: what a controller has actually found. This separation is explained in section 6, and it is what makes Kubernetes declarative. A person or a tool states intent once, and independent control loops work to make reality match it and report progress without rewriting the intent. The wiki's page on [[concepts/declarative-vs-imperative]] draws the contrast with imperative commands like `kubectl scale`, which act on a live object once and leave no record of why.

A controller is simply a program that watches objects of some type and acts to reduce the gap between spec and observed reality. Because a controller can crash, restart, miss an event, or run twice, the loop has to be written so that running it again does no harm. That property is [[concepts/idempotency]], and it is why controllers are written as "look at the current world and compute what should change" rather than as scripts of one-shot commands. Keep this picture of a control loop in mind, because every contract discussed below exists to make many such loops, written by different teams, safe to run against the same API.

Two further pieces of the skeleton deserve a name now. `status.conditions` is a standardized list of entries, each with a type, a status, a reason, a message and an `observedGeneration`, which gives tools a common language for readiness. The wiki covers it in [[concepts/conditions]]. And the `generation` and `observedGeneration` pair gives anyone reading an object a cheap way to ask whether the status still describes the latest spec.

## 3. GVK versus GVR, discovery and the RESTMapper

Kubernetes names things in two different ways, and confusing them is a common stumbling block for people who start writing tooling. A GVK, short for GroupVersionKind, names a type: the schema of an object, such as `apps/v1` with `Kind=Deployment`. A GVR, short for GroupVersionResource, names an HTTP endpoint collection: the lowercase plural that appears in a URL, such as `apps/v1` with `Resource=deployments`. The Kubernetes API concepts page puts the split in one sentence: a resource type is the name used in the URL, and every resource type has a concrete representation, its object schema, which is called a kind. The wiki's seed vocabulary gives a provider example, where `s3.aws.upbound.io/v1beta1` with `Kind=Bucket` is the GVK and `buckets` is the resource. See [[concepts/gvk-and-gvr]] and the side-by-side table in [[comparisons/gvk-versus-gvr]].

Manifests and wire payloads speak GVK through their `apiVersion` and `kind` fields. REST URLs speak GVR, in the form `/apis/<group>/<version>/<plural>`, with the core group served under `/api/v1`. In the great majority of cases the mapping is one to one and the resource is the lowercased plural of the kind, but that is a convention and not a guarantee. The classic exception is the `Scale` kind. Many resources expose a subresource that returns the same `Scale` kind, for instance `deployments/scale` and `replicasets/scale`, and this is how the HorizontalPodAutoscaler adjusts replica counts on very different workloads without knowing any of their schemas. One GVK is served at many GVR endpoints there. A custom resource definition, by contrast, gives each kind exactly one resource. [[examples/hpa-scales-any-workload-through-the-scale-subresource]] walks through the HPA case, and [[examples/a-scalable-composition-lets-hpa-and-keda-drive-an-xr-through-the-scale-subresource]] shows the same trick applied to a Crossplane composite resource, where the composition author must patch the desired replica count down into the Deployment and write the observed count back up to the composite's status.

Why does the distinction matter in practice? Because different parts of the system speak different dialects. Humans and Git repositories speak GVK. RBAC rules, audit logs and URLs speak GVR. A generic tool that is handed a manifest and has to send it to the server must translate from one to the other, and it does so using API discovery. The API server publishes a catalog of what it serves, in two forms: the Discovery API, which lists group-versions and their resources, and OpenAPI, which describes schemas. Discovery historically required one request per group-version after fetching the `/api` and `/apis` roots. Aggregated discovery, stable in Kubernetes 1.30, serves everything in one request when the client asks for it with the right Accept header, so modern clients make far fewer startup calls. OpenAPI v3 has been stable since 1.27 and is preferred over v2. The wiki notes that its dossier found no enhancement proposal for aggregated discovery, so the rationale rests on user documentation alone. See [[concepts/api-discovery-and-restmapper]].

Clients feed discovery output into a component called the RESTMapper, which translates a kind into the resource that appears in a URL. In client-go, the Go client library that most controllers use, the restmapper package builds one from discovery, prefers the preferred version of each group, and can add shortcut names such as `po` for pods. A separate registry called the Scheme maps GVKs to Go types so that typed clients can decode JSON, while dynamic and unstructured clients skip the Scheme and take a GVR directly. See [[entities/client-go]].

The key operational fact is that discovery is a snapshot. A mapper built once at startup reflects the cluster at that moment. If a CRD is installed later, the mapper does not know about it, and any lookup fails with the familiar "no matches for kind X in version Y" error. The wiki records this in [[findings/stale-restmapper-hides-newly-installed-crds]]: controller-runtime issue 321 reported exactly this, with workarounds that reloaded the mapper on a miss or recreated the client, and the eventual fix was a dynamic, rate-limited mapper that invalidates itself when a lookup fails. The wiki reports that this became the default in controller-runtime v0.3.0, but that comes from a summarized issue thread and should be checked against release notes before it is relied on. [[comparisons/restmapper-strategies-static-deferred-and-dynamic]] contrasts the three strategies: a static mapper that fails until rebuilt, a deferred mapper that lazily rebuilds, and a dynamic mapper that heals on demand.

The same failure shows up at the delivery layer in a very ordinary form. A Helm chart or GitOps application includes a Prometheus Operator `ServiceMonitor`, and the CRD for it is absent or not yet established when the manifest is applied. The dossier calls this the most common everyday GVK-missing scenario, and [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]] collects the causes, which include the CRD not existing yet, a wrong apiVersion, and version skew between an operator and its CRDs. The mitigations the sources describe are ordering (Flux `dependsOn`, Argo CD sync waves), mapper invalidation, and not depending on the CRD being present at all. [[comparisons/missing-crd-handling-flux-versus-argo-cd]] sets the two tools side by side, though the wiki is candid that the Argo CD column is thin because the Argo-specific posts did not resolve, so it should not be treated as a settled comparison. See also [[findings/custom-resources-applied-before-their-crd-exists]].

One more wrinkle is that GVK is not always a unique key. A scaffolding tool that composes external APIs can meet two external types that share the same group, version and kind under different domains. Kubebuilder issue 5872 proposes that the tool error on such an ambiguity and accept an explicit `--domain` flag. The wiki notes that the issue was still open in late October 2026, so whether it lands is unknown. See [[examples/kubebuilder-domain-flag-for-ambiguous-external-gvks]].

## 4. Custom resource definitions: schemas, scope, structural schemas and pruning

A CustomResourceDefinition, or CRD, is the extension point that makes the universal control plane practical. It is itself a Kubernetes object, and creating one registers a brand new resource type with the API server at runtime. Once the CRD exists, the built-in kube-apiserver serves a REST endpoint for the new kind with the same machinery it uses for built-in types: list and watch, RBAC, audit logging, schema validation, and storage in etcd. No new server is needed, and the official documentation observes that custom resources can appear and disappear in a running cluster through dynamic registration. See [[concepts/custom-resource-definition]].

A CRD by itself only stores data. The usual pattern pairs a custom resource with a custom controller that reconciles the declared `spec` and reports progress in `status`, which is the operator pattern. The wiki's decision page [[decisions/crd-versus-aggregated-api]] records the alternative: an aggregated API server, a separate server behind the API aggregation layer that gives more control over storage and REST behavior at a higher operational cost. The guidance is to choose a CRD unless the kind needs storage other than etcd or unusual REST semantics, because a CRD inherits storage, authentication, authorization, versioning and watch from the API server with almost no code.

Here is a small CRD for a hypothetical `Database` type that a platform team might publish.

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.platform.example.com
spec:
  group: platform.example.com
  scope: Namespaced
  names:
    kind: Database
    plural: databases
    singular: database
  versions:
    - name: v1
      served: true
      storage: true
      subresources:
        status: {}
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                storageGB:
                  type: integer
                  minimum: 10
                minReplicas:
                  type: integer
                maxReplicas:
                  type: integer
              x-kubernetes-validations:
                - rule: "!has(self.minReplicas) || !has(self.maxReplicas) || self.minReplicas <= self.maxReplicas"
                  message: "minReplicas must not exceed maxReplicas"
            status:
              type: object
              x-kubernetes-preserve-unknown-fields: true
```

The CRD's name must be `<plural>.<group>`, and the group and plural names are what clients and RBAC rules will use forever, which section 10 returns to. The `scope` says whether instances live inside a namespace or are cluster-wide. The `versions` list declares which versions exist, which are served over the API, and which one is the storage version, the form actually persisted in etcd. The `schema` is a structural OpenAPI v3 schema. The `subresources.status` entry turns on the separate status endpoint discussed in section 6. The `x-kubernetes-validations` entry carries a CEL rule, which section 8 covers. Notice that the rule begins with two `has()` checks. Neither `minReplicas` nor `maxReplicas` is required in this schema, and in CEL, reading a field that is absent from the object is an error ("no such key") and not a quiet null. A bare `self.minReplicas <= self.maxReplicas` would therefore reject perfectly valid objects that simply leave one of the two fields out. The alternative is to list both fields under `required` in the spec schema, which is the right choice when they must always be present; the `has()` form is the right choice when they are truly optional and the comparison should apply only when both are set.

The word structural deserves attention, because it explains a behavior that routinely surprises authors. Plain OpenAPI describes what must be present but not what is forbidden, so a possibly incomplete spec used to let unknown fields leak into storage. Structural schemas, introduced to make validation, pruning and defaulting reliable, are a constrained subset of OpenAPI v3. Under a structural schema, the API server drops any field the schema does not declare, unless the author sets `x-kubernetes-preserve-unknown-fields`. The effect is that someone who forgets to declare a field sees the value vanish from stored objects without any error. [[findings/unknown-fields-are-silently-pruned-under-structural-schemas]] records the behavior and its rationale. When a custom resource seems to ignore a field you set, pruning is the first thing to check, and the fix is nearly always to declare the field in the schema.

CRDs are cheap to add but they are not free. Each one adds API surface, etcd data, possibly webhook dependencies, and upgrade-ordering concerns. Two operational facts are worth knowing early. First, deleting a CRD deletes every custom resource of that kind. The wiki marks this as standard behavior that the dossier reported secondhand and did not see stated verbatim in the pages it read, so treat it as unverified against a primary page, but it is consistent with the caution that delivery tools show around CRD deletion. See [[findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind]]. Second, Helm has no native support for upgrading or deleting CRDs, which the Flux documentation attributes to the danger of unintentional data loss. A chart upgrade leaves the old definition in place, and removing a chart leaves its CRDs behind. Flux works around this with `spec.install.crds` and `spec.upgrade.crds`, whose policies are Skip, Create (the default) and CreateReplace, and CreateReplace updates existing CRDs but does not delete ones removed from the chart. See [[findings/helm-does-not-upgrade-or-delete-crds]].

Scale is the third cost. Crossplane's model gives every external resource type its own CRD, so a multi-cloud provider set implies thousands of them. Upbound's estimate, recorded in [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]], is roughly two thousand CRDs for AWS, Azure and GCP together, with more than 4 MiB of API server memory per CRD and about 300 API group-versions needing discovery requests. A GitHub issue reports that installing providers with over a hundred Terrajet-based CRDs made (Terrajet and its successor Upjet are Crossplane's Terraform-based provider generators, which section 9 describes further) API servers slow, with causes in OpenAPI recomputation each time a CRD is registered and in client discovery rate limits. Custom resources share the same storage and watch paths as built-in objects, which is why an unrelated write-up of large-cluster tuning, [[examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd]], is relevant here: serving list requests from the watch cache cut one team's memory use from roughly 400 GB to 100 GB at more than 10,000 nodes.

## 5. Versioning, storage versions and conversion for CRDs

An API that is useful lives long enough to need change, and a CRD supports that by listing several versions of the same kind. Exactly one version is the storage version, which is how objects are written to etcd. Any number of versions can be marked `served`, meaning the API server answers requests for them. When a client asks for a version other than the stored one, the API server converts the object on the fly. See [[concepts/crd-versioning-and-storage-migration]].

The conversion strategy is either `None` or `Webhook`. With `None`, the server rewrites only the `apiVersion` field, so it is safe only when the two versions have compatible schemas. With `Webhook`, the server calls a service that performs the translation, configured with `conversionReviewVersions` and a `caBundle`. When a project has several versions, the Kubebuilder book recommends a hub-and-spoke arrangement: one version is the hub, every other version (a spoke) converts only to and from the hub, and a request for any version converts through the hub. That keeps the number of conversion functions near 2(N-1) for N versions instead of one for every pair, as shown in [[examples/kubebuilder-hub-and-spoke-conversion-for-multi-version-crds]]. [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]] lays the three options out in a table. The guidance in the sources is to prefer `None` when schemas are compatible, because it removes a runtime dependency.

Retiring a version has a documented sequence that is easy to get wrong. Add the new version, migrate clients to it, set the old version to `served: false`, upgrade the stored objects so that none remain in the old storage form, and only then remove the old version from the CRD. The task page tells authors to check `status.storedVersions` before dropping a version. Skipping the migration step strands objects that the API server can no longer decode, which [[findings/crd-version-removal-without-migration-strands-stored-objects]] describes. The upgrade step uses a StorageVersionMigration object. One blog post that the wiki has not cross-checked reports that the built-in StorageVersionMigration API and controller reached GA and are on by default in Kubernetes 1.37; confirm that against the Kubernetes release notes before relying on it, and note that whether migration triggers automatically is also unverified. Before that, operators wrote their own migrators.

The risk with webhook conversion is that it puts a network service in the path of reads. A bug report in the Kubernetes repository, summarized in [[findings/a-down-conversion-webhook-can-stall-garbage-collection]], describes the garbage collector in kube-controller-manager failing to sync its cache when a conversion webhook behind a CRD was unavailable. Cascading deletes stopped, so a deleted Deployment left its ReplicaSets and pods behind. The issue was closed as a duplicate of an older one, and the proposed direction was to let the garbage collector keep working with a partially synced informer. An informer is a client-side cache of objects that a controller keeps current by holding a watch open against the API server, so a controller can read from memory instead of querying the server on every decision. One webhook for one CRD thus damaged behavior for unrelated built-in resources.

For platform teams, versioning is where product management meets API machinery. Crossplane recommends Kubernetes-style alpha, beta and stable versions for XRDs, and says that breaking schema changes should ship as new XRDs or through conversion webhooks, because an XRD's group and names cannot change. [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]] records the trade: a webhook keeps one type and one name but adds a service to run, while a new XRD avoids conversion machinery but forks the API so that consumers must migrate. The wiki does not rank the two.

Upstream Kubernetes treats its own beta types the same way. It removes beta GVKs on a published schedule: PodSecurityPolicy under `policy/v1beta1` was removed in 1.25, and the HPA's `autoscaling/v2beta2` and `flowcontrol.apiserver.k8s.io/v1beta1` went in 1.26. Manifests, charts and clients pinned to those GVKs break once the cluster upgrades. [[examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26]] tells that story, and section 10 explains the mechanism and how to check ahead of time. Deprecation scanners such as pluto and kubent appeared in search results, but the wiki did not read them, so their behavior is not established here. See [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]].

## 6. The spec and status split and the status subresource

Section 2 introduced spec as intent and status as observation. The Kubernetes API conventions describe spec as the complete description of desired state, including defaults and modifications by ecosystem components, and status as a summary of current state, usually written by automated processes. The split is more than a naming convention. It is a division of ownership: users and GitOps tools own `.spec`, and controllers own `.status`. See [[concepts/spec-status-split]].

Why does that matter? Consider a GitOps tool that re-applies a manifest every few minutes. If the object's status lived in the same writable space as its spec, every re-apply could overwrite what a controller observed. With the split, the tool applies only intent, and the controller reports observations in a separate place. The split also gives the reconcile loop a clean input (spec) and a clean output (status).

The split is enforced through the `/status` subresource, which a CRD opts into with `subresources.status: {}`. Once enabled, a PUT or PATCH on the main resource ignores changes to status, a PUT or PATCH on `/status` ignores everything except status, and only changes to the main resource bump `metadata.generation`. The subresource has its own authorization scope, so you can give users write access to spec while giving controllers write access to status. That is a security property as much as a convenience.

The generation counter gives controllers a cheap staleness check. A controller copies the generation it acted on into `status.observedGeneration`, and into each condition under current conventions, so that any consumer can compare the two numbers. Flux exposes the comparison directly: an `observedGeneration` below `metadata.generation` means a spec change is pending. The wiki notes that sources are not settled on whether `observedGeneration` belongs at the top level, on each condition, or both. See [[comparisons/observedgeneration-top-level-versus-per-condition]].

Skipping the subresource has a concrete cost. Without it, a status write is a write to the whole object, so it bumps `generation`, which fires the controller's own watch, which reconciles again, which can write status again. A tutorial quoted in [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]] puts it simply: keeping them separate is how you avoid infinite reconcile loops. With the subresource enabled, a Kubebuilder controller's `r.Status().Patch()` updates only status and leaves generation alone.

Missing `observedGeneration` has a different cost. ACK issue 1583 is the clearest example in the wiki: without the field on its conditions, a stale `ResourceSynced=True` looks exactly like a current one. Argo CD maintainers described working around the gap by comparing managed-field timestamps, which they called fragile. The proposed mitigation is to publish `ResourceSynced=False` at the start of each reconcile. At fetch time the issue was open and frozen. See [[findings/missing-observedgeneration-hides-stale-status]].

Not every CRD should get a status. [[decisions/which-crds-get-a-status-subresource]] records Prometheus Operator's answer. Its `Prometheus`, `Alertmanager`, `PrometheusAgent` and `ThanosRuler` CRDs run as pods and have a single owning reconciler, so they gained replica and availability counts plus `Available` and `Reconciled` conditions. `ServiceMonitor`, `PodMonitor` and `PrometheusRule` stayed without status, because they are configuration read by more than one reconciler and a single status block would collect conflicting data from several writers ([[findings/config-style-crds-with-several-reconcilers-get-no-status]]). The decision also carries a warning for retrofits: enabling the subresource on an existing CRD changes write semantics, since writes to the main resource then ignore status. See [[examples/prometheus-operator-retrofits-status-onto-workload-crds]].

Status is also an integration surface. Flux, Argo CD, kstatus (a Kubernetes SIGs library that computes a generic ready or not-ready verdict for any object from its status conditions), Cluster API and Crossplane all read conditions to decide whether something is ready. Where conventions are followed, generic tooling works. Where they are not, every consumer needs custom code. The wiki gives ACK's missing `observedGeneration` as one example and notes that Cluster API moving from `Ready` to `Available` is unresolved for generic tools. Crossplane's split of `Synced` (is the controller able to reconcile this object) from `Ready` (is the resource usable) keeps two different meanings from sharing one signal. See [[concepts/conditions]] and [[entities/kstatus]].

Composition tools repeat the split one level up. A platform author defines a spec schema for users and a status schema that surfaces rolled-up readiness or selected fields from composed resources. A Crossplane composite resource ([[concepts/composite-resource]]) puts composition selection in its spec and reports `Synced` and `Ready` in its status, while kro uses CEL expressions that reference the status of underlying resources. See [[concepts/composition]].

## 7. Server-side apply, managed fields and field ownership

So far the contracts have concerned naming, schemas and the two halves of an object. This section covers the contract that lets several writers share one object, which is the hardest problem in a platform with many controllers.

Start with what was wrong before. Client-side apply, the original `kubectl apply`, performs a three-way merge in the client between the new manifest, a copy of the last applied manifest stored in the `kubectl.kubernetes.io/last-applied-configuration` annotation, and the live object. The wiki's [[comparisons/client-side-apply-versus-server-side-apply]] lists its problems, drawn from the design proposal KEP-555: surprises after a `kubectl edit`, last writer wins silently, dependence on client version and on a strategic merge patch format (the older kubectl patch format, which relies on per-list merge keys that are hard-coded for built-in types) that grew organically, and an annotation capped at 262,144 bytes in total.

Server-side apply, abbreviated SSA, moves the merge into the API server. A client sends a partial object, its intent, along with a `fieldManager` name. The server merges the intent into the live object and records, for every field, which manager owns it. The records live in `metadata.managedFields`, where each entry names a manager, an operation of `Apply` or `Update`, and the set of fields owned. SSA reached GA in Kubernetes 1.22. A sketch of how ownership looks in practice follows.

```yaml
metadata:
  managedFields:
    - manager: kustomize-controller
      operation: Apply
      fieldsV1:
        f:spec:
          f:template:
            f:spec:
              f:containers:
                k:{"name":"web"}:
                  f:image: {}
                  f:name: {}
    - manager: kube-controller-manager
      operation: Update
      fieldsV1:
        f:spec:
          f:replicas: {}
```

The snippet shows a Deployment where Flux's kustomize controller owns the container image and another writer owns the replica count. The replicas owner appears as `kube-controller-manager` because the HorizontalPodAutoscaler scales through the scale subresource, and the write is recorded under the manager that performs it, not under a separate autoscaler manager. The sketch is trimmed: real output also carries an `apiVersion`, a `fieldsType: FieldsV1` and a `time` on every entry. The `k:{"name":"web"}` key shows that lists can be tracked per entry when the schema declares a key, and the entry records the key field itself (`f:name`) next to `f:image`. That key exists because the container list is declared as a map-type list keyed by `name`, which the next paragraphs explain. Because each manager owns only the fields it set, Flux can re-apply its manifest every few minutes without touching the replica count, and an autoscaler can change replicas without Flux reverting it. By default `kubectl get -o yaml` hides this block unless you pass `--show-managed-fields`, which is why people debugging ownership from default output may wrongly conclude it is empty. [[findings/managedfields-are-hidden-from-kubectl-output-by-default]] notes that Crossplane issue 7453 may have been exactly that confusion, though the issue was marked stale and unresolved, so the underlying claim is unverified.

When two managers set a field to different values, the later apply gets a conflict error instead of silently overwriting. The applier has three choices: force the write and become the sole owner, drop the field from its request and give up the claim, or set the same value and become a co-owner. If two managers set the same value they share ownership, and a later change by either conflicts with the other. The standard illustration is [[examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict]]: Git says three replicas, the autoscaler has moved to ten, and a CD system applying Git's manifest now sees a conflict instead of resetting to three. The Kubernetes maintainer blog uses this case to argue that conflicts are information, and that a tool that resets silently is hiding a real disagreement.

How lists and maps merge depends on schema markers. Two vocabularies are in play here, and it helps to keep them apart. CRD authors who write Go with Kubebuilder add comment markers (`+listType=map`, `+listMapKey=name`, `+mapType=granular|atomic` and `+structType`), and the generator turns them into the schema extensions `x-kubernetes-list-type`, `x-kubernetes-list-map-keys` and `x-kubernetes-map-type` that a reader actually sees in a CRD or OpenAPI document; `structType` has no CRD YAML field of its own. The `k:{"name":"web"}` key in the sketch above exists because the container list is declared as `listType=map` with the key `name`. A CRD with no markers is treated as unstructured, with atomic lists, so only one manager can own such a list. Flux documents that atomic lists such as `.spec.tolerations` cannot be shared under its `Merge` policy, and Crossplane's SSA page says complex-field merging works only when provider CRD schemas carry the markers. This is why CRD authors should add them. See [[findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership]].

Three pitfalls follow from the ownership model. First, a controller that reads an object and applies the whole thing back claims every field in it, including fields set by users and other controllers. The recommended patterns are extract-modify-apply, where the controller extracts only its own fields, and building the desired fields from scratch. The Kubebuilder book shows its controllers applying status with a named owner and `ForceOwnership`, as in [[examples/kubebuilder-controller-applies-status-with-a-field-owner]]. See [[findings/applying-a-whole-read-back-object-claims-every-field]]. Second, migrating from client-side apply leaves old managers (`kubectl` with operation `Update`, and `before-first-apply`) co-owning fields, so removing a field from the manifest leaves it in the cluster because someone else still owns it and force cannot take a field that is no longer in the applied object. Flux hit this moving from 0.17 to 0.18, and Crossplane hit it moving composed resources to composition functions, where a four-step managed-fields migration clears the old manager before applying under a new one. See [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]], [[examples/flux-migration-from-client-side-apply-strands-removed-fields]] and [[examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions]]. Third, a stale manager that owns a list entry key can leave an invalid half-removed object, as in Flux issue 1722, where a legacy controller co-owned a container entry's key but not its required `image` field, and the dry-run then failed on every reconcile (a server-side dry-run asks the API server to run the full request path, including admission, without persisting anything, which makes it a cheap way to find out whether an apply would succeed) ([[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]]).

The question of who should force is a design decision that tools answer differently. The Kubernetes documentation strongly recommends that controllers always force conflicts on objects they own, since a controller usually cannot resolve a disagreement about fields it manages. The same maintainers argue that CI/CD systems are controllers that behave like users, and should surface conflicts to humans. In practice Argo CD (opt-in SSA with `--force-conflicts`) and Flux (force-applying its own intent) both force, then add escape hatches. Kluctl decides per field, treating changes by known interactive managers like kubectl and k9s as temporary and leaving alone fields that other controllers set. The record is in [[decisions/force-conflicts-or-surface-them-to-humans]], [[comparisons/ssa-conflict-policy-across-tools]], [[findings/forcing-conflicts-hides-disagreements-between-writers]] and [[examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics]]. The wiki is explicit that the sources do not settle the best default for platform teams that run GitOps alongside in-cluster controllers.

## 8. Admission: mutating and validating webhooks, validating admission policy and CEL

Admission control is the stage of the API server's request path that runs after authentication and authorization and before an object is persisted. Its job is to rewrite defaults or to validate rules so that an object is accepted, rejected or modified no matter which client or tool sent it. For a platform this is the enforcement point that does not depend on any particular tool behaving well. See [[concepts/admission-webhooks-and-cel]].

Built-in admission plugins run inside the API server. Dynamic admission control adds two extension routes. The first is the admission webhook: an HTTPS callout in which the API server sends an AdmissionReview request and expects an AdmissionReview response. Mutating webhooks run first and may return patches. The object then passes schema validation, and validating webhooks run and may only allow or deny. A webhook configuration says which requests match, using `rules`, `namespaceSelector`, `objectSelector`, `matchPolicy` and CEL `matchConditions`, and how to behave on trouble: `failurePolicy` defaults to `Fail` for `v1`, `timeoutSeconds` defaults to 10 seconds, `sideEffects` declares whether dry-run requests are safe, and `reinvocationPolicy` lets a mutating webhook be called again after later mutations.

The second route is in-process CEL, the Common Expression Language, a small typed expression language that is not Turing-complete. ValidatingAdmissionPolicy, stable since 1.30, splits the work into a policy holding the CEL `validations`, a binding that sets scope and `validationActions` (`Deny`, `Warn`, `Audit`), and an optional parameter resource that supplies configuration. MutatingAdmissionPolicy extends the same structure to mutation using `ApplyConfiguration` or `JSONPatch`; one digest of the Kubernetes docs, which the wiki has not cross-checked, reports it stable since 1.36, so confirm that version against the Kubernetes release notes before relying on it. CRD validation rules (`x-kubernetes-validations`) put CEL directly inside the schema, with `self` and `oldSelf` for transition rules. The wiki's [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]] gives the four-way table.

A concrete CEL case is the minimum-replicas example from section 4. A plain OpenAPI schema can check each field alone but cannot compare two, so before CEL the usual answer was a validating webhook. The rule `self.minReplicas <= self.maxReplicas`, guarded by `has()` checks as section 4 explained because the fields are optional, solves it with no external service, as [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]] explains. Transition rules reach further. The Kubernetes immutability post shows `self == oldSelf` making a field immutable, and `self.all(x, x in oldSelf)` making a list append-only, which is how a platform can forbid changing a claim's region after creation without writing any code ([[examples/cel-transition-rules-enforce-crd-immutability]]).

Policy that spans many types uses ValidatingAdmissionPolicy. The Kubernetes tutorial builds a policy requiring Deployments to have at least two replicas, binds it to a scope, then exercises the three actions. A parameter resource lets different environments carry different minimums without copying the policy, which [[examples/vap-minimum-replicas-policy-with-per-environment-parameters]] describes. This is the pattern that replaced many guardrails that used to be webhooks with their own service and certificates.

Webhooks remain the general escape hatch. Controller frameworks scaffold them, as in [[examples/kubebuilder-operator-scaffolds-defaulting-and-validating-webhooks]], where the author implements `Default()` and the validation methods and markers generate the manifests. cert-manager is the best documented operator that uses all three roles (validation, defaulting and conversion) for its own CRDs, and it solves the bootstrapping problem every webhook owner faces with a self-signed CA and automatic renewal ([[examples/cert-manager-runs-validation-defaulting-and-conversion-webhooks]]). The decision page [[decisions/validate-with-cel-rules-or-a-validating-webhook]] summarizes the guidance: use CEL where it can express the check, since that removes a failure point, and reserve webhooks for logic that needs external data or arbitrary code. CEL has real limits. Rule cost is capped to protect the API server, so schemas with unlimited lists or strings can be rejected unless iterating rules set `maxItems` and `maxLength`, and CEL cannot call out to registries or signature services. See [[comparisons/cel-validation-rules-versus-validating-webhooks]].

Policy engines sit on top. Kyverno began as a webhook-based engine, and its ValidatingPolicy is a CEL-first policy type described as a superset of ValidatingAdmissionPolicy that adds background scanning of existing objects, policy exceptions, PolicyReports and an evaluation mode for non-Kubernetes JSON such as Terraform plans. A ValidatingPolicy can generate native ValidatingAdmissionPolicy objects, so enforcement runs in the API server instead of Kyverno's webhook. The two are related and not rivals. See [[entities/kyverno]], [[examples/kyverno-validatingpolicy-generates-native-vap-objects]] and [[comparisons/kyverno-versus-native-validating-admission-policy]]. The wiki did not read Kyverno's own webhook failure behavior or any primary Gatekeeper source, so it makes no claim about them.

## 9. Use cases: platform API schemas as contracts, CRD-generating tools, policy at admission

With the contracts in view, three recurring use cases make the machinery concrete.

The first is the platform API as a contract. Crossplane and kro let a platform team declare a type, and the tool generates the CRD that application teams consume. A Crossplane CompositeResourceDefinition declares `group`, `kind`, `plural`, a list of versions and a `scope`, and the XRD's name must be `<plural>.<group>`. A kro ResourceGraphDefinition takes a simple schema plus a resource graph with CEL expressions, and registers a CRD with the API server. In both cases the GVK becomes the platform's public contract, so naming and versioning decisions are product decisions. [[examples/xrd-and-rgd-declare-platform-gvks]] and [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]] describe the mechanics. Both tools treat the schema as a contract with live consumers. For Crossplane, group and names cannot change without deleting the XRD, and at v1.20 a schema change required restarting the Crossplane pod. For kro, a breaking schema change on an RGD is blocked unless the `kro.run/allow-breaking-changes` annotation is set, where breaking means removing a field, changing a type, adding a required field without a default, or changing an enum or pattern, and kro warns that forcing a change can invalidate existing instances. See [[findings/platform-api-schemas-are-contracts-and-breaking-changes-are-blocked-or-need-conversion]]. The wiki notes the kro column of the comparison is thin on versions and scope, and that kro is pre-1.0.

The second use case is generating CRDs from some other authority. Azure Service Operator v2 generates CRDs from Azure Resource Manager schemas, so supported resources and fields track what Azure publishes, and the documentation says it manages 150 or more resources ([[examples/azure-service-operator-generates-crds-from-azure-resource-manager-schemas]]). Upjet, the successor to Terrajet, is Crossplane's Terraform-based provider generator and creates Crossplane providers from Terraform providers: it reads Terraform schemas at build time and produces Go types and controllers, so users see only a Kubernetes API while the runtime reuses Terraform's resource logic ([[examples/upjet-generates-crossplane-providers-from-terraform-providers]]). Generated providers inherit shared behavior and shared bugs, and their CRD counts feed directly into the scale problem from section 4.

The third use case is policy at admission. A platform team that wants "no Deployment below two replicas in production" or "no change to a claim's region after creation" can put that in CEL, scoped by binding and parameterized per environment, so it holds regardless of whether a request came from Flux, Argo CD or a person with kubectl. This is where admission matters most for GitOps: the tools are not admission systems, but their server-side dry-runs pass through admission, so webhook configuration is a GitOps concern too.

## 10. Pitfalls: client-side apply limits, conflicts, webhook outages, removed beta APIs, permanent names

Most of the failures already mentioned are instances of a few patterns. This section collects them with the evidence the wiki has.

**Client-side apply limits.** A very large generated CRD can exceed the annotation cap and fail with "metadata.annotations may not be more than 262144 bytes." The reported case is the Argo CD ApplicationSets CRD, installed through its Helm chart with client-side apply. The issue lists `ServerSideApply=true` as the mitigation, and `ClientSideApplyMigration=false` for Kustomize. Kluctl moved to direct SSA for the same reason after hitting it with Prometheus operator CRDs. See [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]] and [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]].

**Conflicts and false drift.** SSA changes how drift fights look. In the Flux community case, an edited Service port made the helm-controller dry-run fail with duplicate port names, so the controller stopped at "unable to determine cluster state" and never corrected anything, and `driftDetection.ignore` did not help because ignores apply after the dry-run ([[findings/field-ownership-blocks-drift-correction]]). Argo CD with `ServerSideApply=true` can stay OutOfSync because its default diff compares Git-rendered manifests with live state in its own process, so server defaults such as `volumeMode` in a StatefulSet's `volumeClaimTemplates` appear as differences until Server-Side Diff is used ([[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]]). Flux offers `ssa` annotations (`Override`, `Merge`, `IfNotPresent`, `Ignore`) and ignore rules for fields that other controllers legitimately change ([[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]]). The tools' answers are compared in [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]]. External providers add a related problem: they fill in defaults the user never set, and a naive comparison sees a difference. Crossplane's `LateInitialize` management policy lets the controller copy the provider's value into spec without treating it as drift ([[findings/late-initialized-fields-create-false-drift]]). Mixing management techniques on one object is the older form of the same trouble ([[findings/mixing-management-techniques-on-one-object]]).

**Webhook outages.** Because the API server calls webhooks synchronously, an unreachable backend with `failurePolicy: Fail` blocks every matching write, including writes needed to repair the webhook, such as the Deployment that runs it. The k8s.af failure-story index lists several webhook postmortems, one reading "ValidatingWebhookConfiguration caused prolonged downtime, nodes lost, and failed master upgrades," though the dossier did not open the linked posts, so these are index-level descriptions. Official guidance is to scope matches narrowly, exclude system namespaces, keep timeouts short, run multiple replicas, and use `Fail` only for security-critical checks. See [[findings/admission-webhook-outages-are-a-recurring-failure-class]], [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]] and [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]]. Related hazards include certificate and network bootstrap windows (cert-manager documents connectivity trouble on GKE private clusters and EKS with custom CNIs, and an unready period after install; see [[findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window]]), webhooks that omit `sideEffects` and so break dry-run clients with "admission webhook does not support dry run" ([[findings/webhooks-without-sideeffects-declared-break-dry-run-clients]], [[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]]), mutating webhooks that can run repeatedly in no guaranteed order ([[findings/mutating-webhooks-can-run-repeatedly-and-in-no-guaranteed-order]]), and webhooks built against older APIs that silently drop fields they do not know, with the sidecar containers added to Pods in 1.29 as the example ([[findings/api-evolution-breaks-webhooks-that-drop-unknown-fields]]).

**Removed beta APIs.** The trap here is that nothing is wrong today. A manifest that pins `policy/v1beta1` or `autoscaling/v2beta2` applies cleanly on a cluster that still serves that version, so tests and dry-runs pass right up until the control plane upgrade. Once the API server stops serving a removed version, any manifest, Helm chart template or client that names it is rejected with the same "no matches for kind" style of error described in section 3, and Helm can also fail on releases whose stored release metadata still references the removed version. Objects already in the cluster are usually not lost, because they were persisted in the storage version and the API server can still read and serve them under a newer GVK; the breakage lands on the tooling and the manifests that write them. To check ahead of an upgrade, the API server exposes an `apiserver_requested_deprecated_apis` metric that shows which deprecated versions clients are still calling, and scanners such as pluto and kubent can inspect manifests, charts and live objects for removed versions, with the caveat from section 5 that the wiki did not read those tools and so cannot vouch for what they do or miss. The advice is to move to GA versions before upgrading ([[findings/removed-beta-gvks-break-pinned-manifests-and-clients]]).

**Permanent names.** Crossplane refuses to change an XRD's group or names after creation, and a practitioner post says that changing them for a CRD controller is "quite the challenge, to say the least." The post is a single practitioner's view, but it matches the mechanics, since group and plural appear in URLs, RBAC rules and every stored reference. See [[findings/group-and-plural-names-are-effectively-permanent]].

**Missing ordering.** Custom resources applied before their CRDs fail, because the API server has no endpoint for a kind it has not yet been told about, and a bulk apply submits everything at once without waiting for the CRD to become established. Flux and Argo CD address that with different ordering tools, as section 3 described. Flux's `dependsOn` makes one Kustomization or HelmRelease wait until another is ready, so the one that installs the CRDs finishes first. Argo CD's sync waves split a sync into numbered stages and advance to the next stage only when the previous one is healthy. Both work by turning a single simultaneous apply into a sequence in which each step can rely on the previous one, and both are far more dependable than hoping a retry will eventually succeed.

## 11. How Flux, Crossplane, kro, Argo CD, Kyverno and cloud add-ons use or differ on the machinery

It helps to read the tools against the contracts rather than against each other.

**Flux** is a set of single-purpose controllers that communicate through CRDs, and it is both a heavy user and a heavy victim of the machinery. It applies with SSA after a server-side dry run every interval, so admission behavior surfaces directly as reconcile failures. It offers `dependsOn`, health checks and `wait` to order CRDs before custom resources, per-resource `ssa` annotations, ignore rules, and `--override-manager` to reclaim legacy field owners. It surfaces webhook trouble but does not prevent it. See [[entities/flux]].

**Argo CD** treats SSA as an opt-in sync option and separately offers Server-Side Diff, and it runs with `--force-conflicts` when SSA is on. It orders by phase, wave, kind and name, advancing only when a wave is healthy, so it addresses missing CRDs with sync waves. Its health model rolls up child status, which makes the status conventions of section 6 matter directly ([[entities/argo-cd]]).

**Crossplane** uses the machinery as a code generator and a field-ownership user. XRDs generate CRDs for composite resources, providers ship one CRD per external type, and SSA propagates claims to composites to composed resources under a manager prefix of `apiextensions.crossplane.io/composed/`. Composition functions are small programs that a composition calls to compute which resources to create; they run as pods that Crossplane talks to over gRPC (a binary remote-procedure-call protocol) and that receive observed and desired state. Crossplane applies composed resources with its own service account, so RBAC on the composite API is the main guardrail. Its `Synced` and `Ready` split and its `forProvider` versus `atProvider` separation are applications of the spec and status contract ([[entities/crossplane]]).

**kro** also generates CRDs, from a simpler schema plus CEL expressions that reference fields across resources, and it infers dependency order and catches errors at definition time. It guards schema contracts with the breaking-change annotation described earlier. It is pre-1.0 and its announcement described it as not production-ready ([[entities/kro]]). The wiki did not read kro's status schema at primary-source depth.

**Kyverno** sits on the admission contract. It began as a webhook engine, in which every matching request is sent to Kyverno's own service for a decision, and that design carries the availability and `failurePolicy` risks described in section 10. Its newer ValidatingPolicy type is CEL-first and can generate native ValidatingAdmissionPolicy objects, so enforcement can move into the API server and the Kyverno webhook leaves the request path for those checks. What it adds beyond the native feature is background scanning, policy exceptions, reports and evaluation of non-Kubernetes JSON. How this differs from Gatekeeper-style webhook engines is only partly established: the wiki read no primary Gatekeeper source, so the comparison is limited to Kyverno's own documentation of this CEL-first direction ([[entities/kyverno]]).

**cert-manager** is a different kind of example, a plain operator and not a policy engine. It does not decide anything about other teams' objects. It runs validation, defaulting and conversion webhooks for its own CRDs, and it solves its own certificate bootstrapping with a self-signed CA, so it shows what an ordinary controller needs from the admission and conversion machinery ([[entities/cert-manager]]).

**Cloud add-ons** expose cloud resources close to one to one. [[entities/config-connector]] reconciles level-triggered (it reacts to the current state of the object and the cloud resource, not to individual change events) against the Google Cloud API, deletes the cloud resource by default when the object is deleted, and acquires an existing cloud resource when the manifest name matches. [[entities/ack]] runs one controller per AWS service with scoped permissions, a periodic resync that the dossier states as ten hours by default (flagged for re-verification), and a deletion-policy annotation, and it lacks `observedGeneration` on conditions. [[entities/azure-service-operator]] generates CRDs from ARM schemas and uses owner references to model lifecycle relationships. All three rely on [[concepts/finalizers]] to make external deletion safe, and none ships a composition layer, which is the gap kro and Crossplane fill.

**Cluster API** shows the contracts at the opposite end from GitOps. Its topology controller added an SSA helper in pull request 6495, stated as a way to "leverage on the API server for handling controllers co-authoring the same object," because the ClusterClass controller and the infrastructure and control plane providers all write to the same generated objects ([[examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects]], [[entities/cluster-api]]). Its machines are immutable by design, a deliberate rollout model akin to Pod versus Deployment.

**Plain controllers** built with [[entities/kubebuilder]] and [[entities/controller-runtime]] get most of the contracts by convention. The Kubebuilder book teaches rebuilding status from the observed world rather than from prior status, setting owner references on children, writing status through the subresource, and applying with a named field owner. A deliberate gap remains in the wiki: the dossier found no primary sources on admission for Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API or Gatekeeper, so this tutorial makes no claim about them.

## 12. Design principles for APIs that platforms can build on

The contracts above also suggest what a good platform API looks like. The following principles are drawn from the wiki's findings, each with its reasoning.

**Treat the GVK as a product, and choose group and plural names as if they were permanent.** Group and plural names are baked into URLs, RBAC, stored references and every client, and the wiki found no tool that makes renaming easy. Crossplane forbids it outright. Evolve through versions, and take the Kubernetes alpha, beta, stable ladder seriously, because upstream removes betas on a published schedule and your consumers will treat yours the same way.

**Declare complete, structural schemas and decide on pruning deliberately.** If a field is not declared, it vanishes silently. A schema is also where CEL rules, defaults, list markers and printer columns live, so a complete schema makes the type self-describing to every tool that reads OpenAPI.

**Prefer conversion that cannot go down.** Use `None` when schemas are compatible. When a webhook is unavoidable, treat it as critical infrastructure, because its outage can stall reads and even garbage collection. When a change is breaking enough, a new type may be safer than a conversion, as the Crossplane guidance allows.

**Separate intent from observation, and publish observation in the standard form.** Enable the status subresource when a single reconciler owns the object, record `observedGeneration`, and use the conventional conditions structure so generic tools can read readiness. Where several reconcilers read one configuration object, consider leaving it statusless, as Prometheus Operator did, rather than merging conflicting writers into one block.

**Mark lists and maps so that ownership can be shared.** Add the Go markers `+listType=map`, `+listMapKey=name`, `+mapType=granular|atomic` and `+structType` where they apply; they generate the schema extensions `x-kubernetes-list-type`, `x-kubernetes-list-map-keys` and `x-kubernetes-map-type` that the API server reads, and that is why a keyed list shows up in `managedFields` as per-entry `k:{"name":"web"}` keys. Without them, a CRD behaves as atomic, and every tool that wants to co-own a list will conflict. Controllers should apply only the fields they own and name their field manager.

**Make conflicts visible, and decide force policy per actor.** Controllers should force fields they own. CD systems that act on behalf of humans should prefer to surface disagreement or, at least, offer per-field ignore rules. The wiki records that the sources do not settle the best default for combined GitOps and controller environments, so the principle is to make the choice explicit and observable instead of inheriting a tool's default by accident.

**Push validation into the schema and in-process policy first, and keep webhooks for what only webhooks can do.** CEL rules travel with the CRD, need no service, and cannot take the cluster down. Reserve webhooks for external data or arbitrary code, and when you use them, scope narrowly, declare `sideEffects`, run replicas, exclude system namespaces, keep mutations idempotent, and choose `failurePolicy` deliberately.

**Keep the surface small.** CRDs share etcd, discovery and OpenAPI computation. A design that generates thousands of CRDs pays for it in API server memory and discovery latency, so group types sensibly and avoid per-field CRDs.

**Design for deletion and for retrofits.** Use finalizers and owner references so that cleanup is safe, document deletion policies for external resources, and remember that enabling a subresource or a stricter validation on an existing type changes what existing clients experience.

The unifying reasoning is that a shared control plane works only as long as every participant keeps the contracts simple enough to be checked by generic machinery. Names that never change, schemas that are explicit, ownership that is recorded per field, and validation that runs inside the server are all ways of making the cluster, rather than any one tool, the arbiter of what is true. That is why Flux, Crossplane and kro can coexist, and why most of their failures turn out to be contract violations. The next part builds on this by looking at what happens inside the controllers that read and write these objects.

## Further reading

Wiki pages relied on, grouped by topic.

- Naming and discovery: [[concepts/gvk-and-gvr]], [[comparisons/gvk-versus-gvr]], [[concepts/api-discovery-and-restmapper]], [[comparisons/restmapper-strategies-static-deferred-and-dynamic]], [[entities/client-go]], [[findings/stale-restmapper-hides-newly-installed-crds]], [[findings/custom-resources-applied-before-their-crd-exists]], [[comparisons/missing-crd-handling-flux-versus-argo-cd]]
- CRDs and versioning: [[concepts/custom-resource-definition]], [[concepts/crd-versioning-and-storage-migration]], [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]], [[decisions/crd-versus-aggregated-api]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]], [[findings/unknown-fields-are-silently-pruned-under-structural-schemas]], [[findings/group-and-plural-names-are-effectively-permanent]], [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]]
- Spec, status and conditions: [[concepts/spec-status-split]], [[concepts/conditions]], [[decisions/which-crds-get-a-status-subresource]], [[findings/missing-observedgeneration-hides-stale-status]], [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]], [[comparisons/observedgeneration-top-level-versus-per-condition]]
- Server-side apply: [[concepts/server-side-apply-and-field-ownership]], [[comparisons/client-side-apply-versus-server-side-apply]], [[comparisons/ssa-conflict-policy-across-tools]], [[decisions/force-conflicts-or-surface-them-to-humans]], [[findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership]], [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]]
- Admission: [[concepts/admission-webhooks-and-cel]], [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]], [[comparisons/cel-validation-rules-versus-validating-webhooks]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], [[decisions/failure-policy-fail-or-ignore-for-an-admission-webhook]], [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]]
- Platform background: [[concepts/universal-control-plane]], [[concepts/declarative-vs-imperative]], [[concepts/idempotency]], [[concepts/finalizers]], [[concepts/owner-references-and-garbage-collection]], [[concepts/composition]], [[concepts/composite-resource]], [[sources/krm-platform-vocabulary]]
- Research dossiers: [[sources/research-gvk-and-gvr]], [[sources/research-custom-resource-definition]], [[sources/research-spec-status-split]], [[sources/research-server-side-apply-and-field-ownership]], [[sources/research-admission-webhooks-and-cel]], [[sources/research-conditions]]

Source URLs cited by those pages.

- https://kubernetes.io/docs/reference/using-api/api-concepts/
- https://kubernetes.io/docs/concepts/overview/kubernetes-api/
- https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
- https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/
- https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration/
- https://kubernetes.io/docs/reference/using-api/server-side-apply/
- https://kubernetes.io/blog/2022/10/20/advanced-server-side-apply/
- https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/
- https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/
- https://kubernetes.io/docs/concepts/cluster-administration/admission-webhooks-good-practices/
- https://kubernetes.io/blog/2022/09/23/crd-validation-rules-beta/
- https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md
- https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/555-server-side-apply/README.md
- https://github.com/kubernetes-sigs/controller-runtime/issues/321
- https://github.com/kubernetes/kubernetes/issues/110720
- https://docs.crossplane.io/latest/composition/composite-resource-definitions/
- https://kro.run/docs/concepts/rgd/overview/
- https://fluxcd.io/flux/components/helm/helmreleases/
- https://cert-manager.io/docs/concepts/webhook/
- https://kyverno.io/docs/policy-types/validating-policy/
- https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html
- https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/
- https://github.com/argoproj/argo-helm/issues/3704
- https://github.com/aws-controllers-k8s/community/issues/1583
