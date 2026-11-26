---
title: "Research dossier: Compositions"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [composition, crossplane, kro, composition-functions, research-dossier]
---

# Research dossier: Compositions

> [!NOTE]
> **Raw file:** `raw/research-composition.md` (sha256 prefix f57d89652816)<br>
> **Kind:** Research dossier summarizing 19 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The Crossplane pages are a mix of v2.4 and v2.5 documentation, the Cluster API ClusterClass page is labelled alpha and may be stale, the ACK site is marked deprecated, and the OOMKilled article is a low-authority third-party post with simulated logs.

## Summary

The dossier explains a composition as a way to expose one small, opinionated API object and have a controller expand it into many lower-level resources. The platform team owns the expansion logic, and application teams fill in a few fields without ever seeing the Deployment, Service, IAM role, or cloud database that result. Crossplane layers this as Providers that supply managed resources and Compositions that turn a composite resource into those managed resources.

Crossplane has used three authoring models. Patch and transform is a static list of base resources plus patches and is deliberately not Turing complete. Composition functions (alpha in v1.11, beta in v1.14) put a gRPC function in each pipeline step, where the function receives observed and desired state and returns a new desired state. Crossplane 2.0 then made composites namespaced by default and let compositions include any Kubernetes resource. kro takes a different route: a ResourceGraphDefinition declares a schema and templates wired together with CEL, and kro infers a dependency graph from the expressions.

The dossier also places Flux, Argo CD, Config Connector, ACK, and Cluster API around the idea. Flux and Argo CD order and health-gate manifest sets but do not create new APIs, Config Connector and ACK provide the per-cloud-resource CRDs that compositions wrap, and ClusterClass is a composition pattern for whole clusters. Its pitfall catalog covers state ownership, expressiveness creep, function load, readiness and ordering, GitOps tracking, CRD sprawl, permissions, and API stability.

## Key claims

### Crossplane composition functions

- The composition functions design doc (https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md) says patch and transform was intentionally limited, with no conditionals or iteration, to avoid growing a new DSL, and that each change needed a core API change tied to the release cycle.
- The same design doc adds `mode: Pipeline`, where each step names a `functionRef` and optional `input`. Functions are long-running gRPC servers deployed by the package manager, reached through a headless Service and secured with mTLS.
- Crossplane sends a `RunFunctionRequest` with `observed` and `desired` state, and the function returns the new `desired` state plus `results`. "Notably the Functions would not need to be responsible for interacting with the API server to create, update, or delete composed resources."
- XRs poll every 60 seconds by default, so 100 XRs with one function step produce 100 function calls per minute. The design doc lists poll-interval tuning, replicas, and response caching by TTL as the scaling levers.
- XRs pin to a CompositionRevision, so editing a Composition does not instantly change existing XRs.
- The Crossplane Compositions docs (https://docs.crossplane.io/latest/composition/compositions/) describe a v2 Composition as a pipeline of function steps whose steps run in order, each receiving the previous step's result. A function can be referenced by OCI digest in an alpha feature.
- "Composition functions don't run when you delete a composite resource." Crossplane deletes the composed resources itself, and the page also covers required resources, response caching, ordered deletion, credentials, and a pipeline context.
- The Function Patch and Transform guide (https://docs.crossplane.io/latest/guides/function-patch-and-transform/) keeps the old style alive as a function with patches, transforms, patch policies, connection details, and readiness checks. "Function Patch and Transform can't directly patch between two composed resources."
- PatchSets cannot nest and ignore transforms and policies, and the legacy `mode: Resources` was deprecated in v1.17.
- The Scalable Composition guide (https://docs.crossplane.io/latest/guides/scalable-composition/) wraps a Deployment in a `MyApp` XR and exposes the `scale` subresource through the XRD so `kubectl scale`, HPA, and KEDA can drive it. "The composition author must implement the scaling logic."
- The Crossplane 2.0 announcement (https://blog.crossplane.io/announcing-crossplane-2-0/, 12 Aug 2025) says "Compositions can now include any Kubernetes resource, not just Crossplane-defined resources," that XRs and managed resources are namespaced by default, and that the claim and XR duality is removed.
- The same announcement adds an `Operation` type for one-off, cron, and watch-driven day-two workflows and ManagedResourceDefinitions with activation policies so only needed CRDs are installed instead of 100 or more per provider. It describes v1 as having become "overly opinionated."
- The announcement sketches a `Microservice` kind that creates an RDS instance, security groups, a Deployment, Service, Ingress, and dashboards from one namespaced object. This is an illustration by the authors, not a named customer.

### Case studies

- VSHN (https://blog.crossplane.io/composition-functions-in-production/, Tobias Brunner, 13 Dec 2023) runs Crossplane in production for about three years and uses composition functions in its AppCat marketplace for databases, queues, and object storage. Patch and transform hit limits early: no conditionals, no loops, no dynamic lookups.
- VSHN reports that "missing resources on function requests were actually deleted," and that "if an object is not explicitly specified in a request payload, it will be deleted." It also reports that OpenShift's crun runtime initially could not run functions and ran them slowly.
- VSHN warns that managing the same objects with both patch and transform and functions "increases complexity dramatically" because it becomes hard to see where a change happens.
- Imagine Learning (https://blog.crossplane.io/building-crossplane-composition-functions-to-empower-your-control-plane/, Blake Romano, 7 Mar 2024) found AWS RDS composition files "regularly contained more than 1,000 lines of repetitive code," about 1,250 for a two-instance cluster, with near-identical files for different instance counts.
- Imagine Learning chose one monolithic function that routes to per-composition rendering logic, which means fewer idle pods and one code base, and replaced duplicated files with a loop over `instanceCount`. It unit-tests output locally with `crossplane beta render`.
- A third-party article (https://www.devopsroles.com/crossplane-composition-function-oomkilled/) argues that large composites, large EnvironmentConfigs, or heavy logic can exhaust function memory and cause OOMKilled pods, and recommends limits, trimmed data handling, and splitting logic across steps. Its logs are labelled "Simulated," so it is low authority.

### Crossplane with Argo CD

- The Crossplane guide (https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/) says "you need to configure Argo CD to use Annotation based resource tracking," adds custom Lua health checks for Ready, Synced, and Healthy conditions, hides `ProviderConfigUsage`, and suggests raising the Argo CD Kubernetes client QPS from the default 50 to 300. It recommends Argo CD 2.4.8 or later.

### kro

- The kro overview (https://kro.run/docs/overview, version 0.10.0) says a ResourceGraphDefinition has a `schema` in SimpleSchema and `resources` templates bound with CEL in `${...}`. "You never declare resource order. kro reads your CEL expressions and builds the dependency graph automatically."
- The overview's worked example wraps a ConfigMap, an ACK S3 Bucket, a Deployment, and a Service behind a `WebApp` API and writes `bucketArn` back to status. It lists `includeWhen`, `forEach` collections, static type checking at apply time, and an alpha `Graph` object that offers the engine without defining a new API.
- The Dependencies and Ordering page (https://kro.run/docs/concepts/expressions/dependencies-ordering) says every CEL field reference creates a DAG edge, even with the optional `?.` operator. Creation follows topological order, deletion runs in reverse, and circular references fail validation. "kro waits for CEL expressions to be resolvable before proceeding," and the order is visible at `status.topologicalOrder`.
- The kro FAQ (https://kro.run/docs/faq) says "kro's API is currently at `v1alpha1`," that Argo CD integration needs an `argocd.argoproj.io/tracking-id` annotation and an owner reference on every templated resource with a warning about owner-reference limits, and that restart-on-ConfigMap-change works by hashing ConfigMap data into a pod template annotation with CEL `hash` and `json`.
- The AWS announcement (https://aws.amazon.com/blogs/opensource/introducing-open-source-kro-kube-resource-orchestrator/) frames the problem as building bespoke controllers per API, which means "building for Kubernetes, rather than with Kubernetes." It said "this project is a public experiment and is under active development. It is not yet intended for production use."
- The follow-up AWS post (https://aws.amazon.com/blogs/opensource/kube-resource-orchestrator-from-experiment-to-community-project/, Jesse Butler) says "kro is now an open collaboration between AWS, Microsoft Azure, and Google Cloud" and records the rename from `ResourceGroup` to `ResourceGraphDefinition`. It reports no adoption numbers or named users.

### Neighbouring tools

- The Flux Kustomization docs (https://fluxcd.io/flux/components/kustomize/kustomizations/) say with `dependsOn` "the Kustomization is only applied after the referred Kustomizations are ready." `healthChecks`, `wait`, and CEL `healthCheckExprs` define readiness, a wrong CEL expression makes the controller wait until timeout, `prune: true` garbage-collects objects removed from Git, and a deletion policy chooses whether managed resources are removed, orphaned, or waited on.
- The Argo CD sync waves page (https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/) describes hooks (PreSync, Sync, PostSync, SyncFail, Skip, PreDelete, PostDelete) and waves within a phase. "During pruning, the wave order is reversed from the creation order," a failed PreSync hook stops the sync, and `ttlSecondsAfterFinished` on hook Jobs is discouraged.
- The Cluster API ClusterClass page (https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/) says it "reduces boilerplate and enables flexible and powerful customization of clusters" through a `topology` on the Cluster, gated by `ClusterTopology`. The page is labelled alpha and may be out of date.
- The Config Connector overview (https://cloud.google.com/config-connector/docs/overview) says controllers reconcile with the Config Connector service account's identity, not the submitter's, so the right to create objects in a Config Connector namespace is effectively the right to change cloud resources. Google lists "Eventual consistency through loosely-coupled dependencies" as a property.
- The ACK overview (https://aws-controllers-k8s.github.io/community/docs/community/overview/) says ACK "lets you define and use AWS service resources directly from Kubernetes," ships one controller image per AWS service, and lists drift recovery, adoption, retention, field export, and multi-account topics. The site is marked deprecated.

### Dossier-level inferences

- The dossier states the permission and blast-radius point directly for Config Connector only and calls its application to Crossplane and kro an inference. See [[findings/blast-radius-and-privilege-centralization]].
- The dossier says no source gave a head-to-head comparison of Crossplane Compositions and kro, so any such comparison is the wiki authors' synthesis.

## Wiki pages informed by this source

[[concepts/composition]], [[entities/crossplane]], [[entities/kro]], [[entities/argo-cd]], [[entities/flux]], [[entities/config-connector]], [[entities/ack]], [[entities/cluster-api]], [[examples/vshn-appcat-sells-self-service-databases-queues-and-object-storage-through-composition-functions]], [[examples/imagine-learning-replaces-thousand-line-patch-and-transform-files-with-a-looping-composition-function]], [[examples/a-scalable-composition-lets-hpa-and-keda-drive-an-xr-through-the-scale-subresource]], [[examples/a-microservice-xr-creates-a-database-and-its-workload-from-one-namespaced-object]], [[findings/a-composition-function-that-omits-a-resource-from-its-desired-state-deletes-it]], [[findings/patch-and-transform-cannot-branch-loop-or-patch-between-composed-resources]], [[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]], [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]]

## Open questions from the dossier

- Crossplane docs versions disagree on naming, and older `docs.crossplane.io/latest/concepts/...` URLs return empty content, so writers should cite the `composition/` paths and check the version banner.
- The design doc describes functions as Deployments behind a headless Service, while the 2023 VSHN post describes a sidecar runner, and it is unclear which parts of the earlier runner model remain. Resolved in part by [[sources/research-gap-o7-krm-functions]]: the sidecar was the alpha model and Deployments are current, see [[findings/crossplane-moved-composition-functions-from-an-xfn-sidecar-in-v1-11-to-package-manager-deployments-in-v1-14]].
- The kro Graph and RGD APIs differ in how readiness gates dependents, and kro's Readiness and Controller Tuning pages were not read.
- No source compared Crossplane Compositions and kro head to head, and no source describes how Config Connector or ACK behave when wrapped by a composition.
- The Crossplane ADOPTERS file and conference talks were not fetched, so named-organization evidence is limited to VSHN and Imagine Learning.
