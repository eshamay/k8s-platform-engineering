# Research dossier: Compositions

Research date: 2026-11-25

Scope: Crossplane Compositions (patch-and-transform and composition functions), kro ResourceGraphDefinition, and how neighbouring stacks (Flux, Argo CD, Config Connector, ACK, Cluster API) handle the same problem of turning one small declaration into many coordinated Kubernetes resources.

## Overview

A "composition" in the platform-engineering sense is a way to expose one small, opinionated API object and have a controller expand it into a set of lower-level resources. The platform team owns the expansion logic. Application teams fill in a few fields (image, size, bucket name) and never see the Deployment, Service, IAM role, or cloud database that result. The Crossplane design doc describes the shape as a layering: Providers supply Managed Resources (faithful representations of external APIs), and Compositions teach Crossplane how to turn a Composite Resource (XR, an arbitrary platform-defined API) into a set of those managed resources. The sources consistently stress that this logic sits "behind the API line": consumers see only the XR, so the authoring technology can change without breaking them.

Crossplane has gone through three authoring models. The original one, "patch and transform" (P&T), is a static list of base resources plus patches that copy fields from the XR into each resource. It is deliberately not Turing complete: no conditionals, no loops. That limit led to the second model, composition functions (alpha in v1.11, beta in v1.14), in which a Composition has `mode: Pipeline` and each step calls a gRPC function server. Each function receives the observed and desired state and returns a new desired state; Crossplane, not the function, talks to the API server. P&T itself survives as just another function (`function-patch-and-transform`), and the legacy `mode: Resources` was deprecated in v1.17. Crossplane 2.0 (August 2025) then made XRs namespaced by default, removed the claim/XR split, and allowed compositions to include any Kubernetes resource, not only Crossplane-managed ones.

kro (Kube Resource Orchestrator) takes a different route. Instead of calling external function servers, a `ResourceGraphDefinition` (RGD) declares a schema and a list of resource templates wired together with CEL expressions. kro infers a dependency DAG from those expressions, generates a CRD for the new API, and runs a controller that reconciles each instance in topological order. It started as an AWS experiment (November 2024), became a joint AWS, Microsoft Azure, and Google Cloud project, and its docs now describe it as a subproject of Kubernetes SIG Cloud Provider. CEL is chosen on purpose: it terminates, has no side effects, and is type-checked at apply time.

The sources also frame composition as one answer to a recurring cost. Writing a bespoke controller per platform API needs deep Kubernetes expertise and leaves teams running fleets of controllers (AWS kro announcement). Composition engines trade that cost for a declarative or lightly programmatic authoring surface. The other tools in this dossier sit next to that idea rather than inside it. Flux and Argo CD order and health-gate sets of manifests from Git but do not create new APIs. Config Connector and ACK supply the per-cloud-resource CRDs that compositions typically wrap. Cluster API's ClusterClass is a domain-specific composition for whole clusters.

The recurring pitfalls are consistent across sources: state ownership (a function that omits a resource deletes it), expressiveness creep in declarative DSLs, load and scaling of per-reconcile function calls, readiness and ordering between composed resources, and interaction with GitOps tools that need to track objects they did not directly apply.

## Sources

### 1. Crossplane design doc: Composition Functions (Beta)
- URL: https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md
- Title: "Composition Functions: Beta" (design-doc-composition-functions.md)
- Publisher/author: Crossplane project; owner Nic Cope (negz); reviewers Hasan Turken and Jared Watts
- Kind: design doc (accepted)
- Summary: The most useful primary source for the "why" and the mechanics. It explains that P&T was intentionally limited (no conditionals or iteration) to avoid growing a new DSL, that users nonetheless pushed it toward tens of composed resources and richer logic, and that each P&T change required a core API change tied to the release cycle. The proposal adds `mode: Pipeline` to Composition; each step names a function (`functionRef`) and optional `input`. Functions are long-running gRPC servers deployed by the package manager (like Providers), reached through a headless Service, secured with mTLS. Crossplane sends a `RunFunctionRequest` with `observed` and `desired` state; the function returns the new `desired` state plus `results` (fatal, warning, normal). Functions never call the API server to create resources. The doc also does the load arithmetic: XRs poll every 60 seconds by default, so 100 XRs with one function step means 100 calls per minute, and it lists scaling levers (poll interval, replicas, response caching by TTL). It explains that XRs pin to a CompositionRevision, so Composition edits do not instantly affect existing XRs.
- Quote: "Notably the Functions would not need to be responsible for interacting with the API server to create, update, or delete composed resources." (design doc)

### 2. Crossplane docs: Compositions
- URL: https://docs.crossplane.io/latest/composition/compositions/
- Title: "Compositions" (Crossplane v2.x docs)
- Publisher/author: Crossplane authors / CNCF
- Kind: official documentation
- Summary: Current reference for how a Composition works. A Composition is a template that composes many resources into one composite resource. In v2 it is a pipeline of function steps: install a `Function` package (a pod is created), reference it with `functionRef` (or by OCI digest in an alpha feature), and optionally pass `input` whose kind the function defines. Steps run in order and each receives the previous step's result, which makes combinations such as "generate resources with function-cue, then let function-auto-ready mark readiness" possible. The page notes functions do not run on XR deletion (Crossplane deletes composed resources itself), documents observed versus desired state, required resources, function response caching, and ordered deletion of composed resources. Its table of contents shows how much the model grew after the design doc: credentials, required schemas, capability advertisement, and a pipeline context.
- Quote: "Composition functions don't run when you delete a composite resource." (Crossplane docs)

### 3. Crossplane docs: Function Patch and Transform
- URL: https://docs.crossplane.io/latest/guides/function-patch-and-transform/
- Title: "Function Patch and Transform"
- Publisher/author: Crossplane authors
- Kind: official guide / reference
- Summary: Explains how the old P&T style lives on as a function. It covers resource templates, patch types (FromCompositeFieldPath, ToCompositeFieldPath, Combine variants, EnvironmentConfig variants), transforms (convert, map, match, math, string), patch policies, connection details, and readiness checks. The key pitfalls are written into the guide: it cannot patch directly between two composed resources (you route values through a custom XR status field), PatchSets cannot nest and ignore transforms/policies, and the doc notes that legacy `mode: Resources` was deprecated in v1.17. Good to read next to Imagine Learning and VSHN to see why people left P&T for code.
- Quote: "Function Patch and Transform can't directly patch between two composed resources." (Crossplane docs)

### 4. Crossplane docs: Scalable Composition
- URL: https://docs.crossplane.io/latest/guides/scalable-composition/
- Title: "Scalable Composition"
- Publisher/author: Crossplane authors
- Kind: official how-to guide
- Summary: A small worked example showing a `MyApp` XR wrapping a Deployment and exposing the Kubernetes `scale` subresource through the XRD so `kubectl scale`, HPA, and KEDA can drive the XR without knowing its schema. The guide combines function-patch-and-transform with function-auto-ready, and states that the composition author must implement the scaling wiring (patch `spec.replicas` down, write observed replicas back up to status). It demonstrates how a composite resource can behave like a first-class Kubernetes workload API. Note this is about scaling the composed workload, not about scaling Crossplane itself.
- Quote: "The composition author must implement the scaling logic" (Crossplane docs, Important note)

### 5. Crossplane blog: Announcing Crossplane 2.0
- URL: https://blog.crossplane.io/announcing-crossplane-2-0/
- Title: "Announcing Crossplane 2.0"
- Publisher/author: Nic Cope and Jared Watts, Crossplane blog, 12 Aug 2025
- Kind: release announcement
- Summary: Describes the v2 shift. Compositions can include any Kubernetes resource (so one XR can provision a database and deploy the application), XRs and MRs are namespaced by default, the claim/XR duality is removed, there is a new `Operation` type (one-off, cron, and watch-driven day-two workflows), and ManagedResourceDefinitions with activation policies let you install only the CRDs you need rather than 100+ per provider. It states the authors' retrospective that v1 had become "overly opinionated" and that backward compatibility with most v1 configuration is kept. Useful to date older tutorials: anything showing claims or `mode: Resources` predates v2.
- Quote: "Compositions can now include any Kubernetes resource, not just Crossplane-defined resources" (Crossplane blog)

### 6. Crossplane blog: Composition Functions in Production (VSHN)
- URL: https://blog.crossplane.io/composition-functions-in-production/
- Title: "Composition Functions in Production"
- Publisher/author: Tobias Brunner (VSHN), 13 Dec 2023
- Kind: engineering blog / case study
- Summary: VSHN, a Swiss DevOps and managed Kubernetes provider, has run Crossplane in production for roughly three years and uses composition functions in its VSHN Application Catalog (AppCat), a marketplace for self-provisioned databases, queues, and object storage. P&T hit limits early: no conditionals, no loops, no dynamic lookups. Functions let them inspect current state, drive Helm chart deployments, and generalize backup and maintenance logic. The post records operational lessons from alpha: OpenShift's crun runtime initially could not run functions, execution was slow with crun, and "missing resources on function requests were actually deleted", meaning functions must return the full desired state each call. They also warn that managing the same objects with both P&T and functions "increases complexity dramatically" because it becomes hard to see where a change happens.
- Quote: "if an object is not explicitly specified in a request payload, it will be deleted." (VSHN, Crossplane blog)

### 7. Crossplane blog: How Imagine Learning uses Crossplane and Composition Functions
- URL: https://blog.crossplane.io/building-crossplane-composition-functions-to-empower-your-control-plane/
- Title: "Building Crossplane Composition Functions to Empower Your Control Plane"
- Publisher/author: Blake Romano (Imagine Learning), 7 Mar 2024
- Kind: engineering blog / case study
- Summary: Imagine Learning, a K-12 digital education company, uses Crossplane for its internal developer platform on AWS. Native P&T compositions for AWS RDS clusters ran past 1,000 lines (about 1,250 for a two-instance cluster), and nearly identical files were needed for different instance counts because P&T cannot render conditionally or loop. They moved to composition functions, chose one monolithic function that routes to per-composition rendering logic (fewer idle pods, one code base), and replaced the duplicated files with a loop over `instanceCount`. They run `crossplane beta render` locally to unit-test output, which they say prevents contract breaks between XR or EnvironmentConfig inputs and deployed state.
- Quote: "Composition files for resources like AWS RDS Clusters regularly contained more than 1,000 lines of repetitive code." (Imagine Learning)

### 8. Crossplane docs: Configuring Crossplane with Argo CD
- URL: https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/
- Title: "Configuring Crossplane with Argo CD"
- Publisher/author: Crossplane authors
- Kind: official integration guide
- Summary: Lists the settings needed so Argo CD and Crossplane cooperate: use annotation-based resource tracking (`application.resourceTrackingMethod: annotation`) rather than label tracking, add custom Lua health checks so Crossplane objects with Ready/Synced/Healthy conditions show up correctly (and some kinds with no status are treated as healthy), hide `ProviderConfigUsage` from the UI to keep it responsive, and raise the Argo CD Kubernetes client QPS (default 50, suggested 300) because many CRDs generate many API queries. It recommends Argo CD 2.4.8 or later. This is the clearest statement of how a GitOps tool must be tuned for generated resources.
- Quote: "you need to configure Argo CD to use Annotation based resource tracking." (Crossplane docs)

### 9. kro docs: What is kro?
- URL: https://kro.run/docs/overview
- Title: "What is kro?" (version 0.10.0)
- Publisher/author: kro project (Kubernetes SIG Cloud Provider subproject)
- Kind: official documentation
- Summary: States the model concisely: a ResourceGraphDefinition has a `schema` (the API surface, written in "SimpleSchema") and `resources` (templates). CEL expressions in `${...}` bind them. kro parses the expressions, infers the dependency graph, generates a CRD, and starts a controller. The worked example wraps a ConfigMap, an ACK S3 Bucket, a Deployment, and a Service behind a `WebApp` API and writes `bucketArn` back to the instance status. Features called out: references to status fields that do not exist yet (kro waits), ordering inferred rather than declared, conditional resources (`includeWhen`), `forEach` collections, and static type checking at apply time. It also introduces an alpha `Graph` object that offers the same engine without defining a new API.
- Quote: "You never declare resource order. kro reads your CEL expressions and builds the dependency graph automatically." (kro docs)

### 10. kro docs: Dependencies and Ordering
- URL: https://kro.run/docs/concepts/expressions/dependencies-ordering
- Title: "Dependencies & Ordering"
- Publisher/author: kro project
- Kind: official documentation
- Summary: Explains how every CEL field reference creates a DAG edge (even with the optional `?.` operator), shows linear, diamond, and parallel-branch patterns, and states that creation follows topological order while deletion runs in reverse. Circular references fail validation; the fix is to take one side from `schema.spec`. At runtime kro evaluates static expressions once, then for each resource waits until its dependency expressions are resolvable (the referenced object exists and has the field) before creating or updating it. The computed order is visible at `status.topologicalOrder` on the RGD. Good conceptual material for explaining controllers that wait on other objects' status.
- Quote: "kro waits for CEL expressions to be resolvable before proceeding." (kro docs)

### 11. kro docs: FAQ
- URL: https://kro.run/docs/faq
- Title: "FAQ" (version 0.10.0)
- Publisher/author: kro project
- Kind: official documentation
- Summary: Answers what kro is, notes the API is `v1alpha1` and may change, and distinguishes a ResourceGraphDefinition (creates a new API; each instance yields resources) from an alpha `Graph` (no new API; nodes are the resources). Two practical items matter for pitfalls: Argo CD integration needs an `argocd.argoproj.io/tracking-id` annotation and an owner reference added to every templated resource, with a warning that owner references have limitations; and the Helm-style "restart on ConfigMap change" trick works by hashing ConfigMap data into a pod template annotation using CEL `hash` and `json` libraries.
- Quote: "kro's API is currently at `v1alpha1`." (kro FAQ)

### 12. AWS Open Source Blog: Introducing kro
- URL: https://aws.amazon.com/blogs/opensource/introducing-open-source-kro-kube-resource-orchestrator/
- Title: "Introducing kro: Kube Resource Orchestrator"
- Publisher/author: AWS Open Source Blog (authors listed include Amine Hilaly, Christina Andonov, Lukonde Mwila)
- Kind: project announcement / motivation
- Summary: The origin story. It frames the problem as platform teams having to write and run bespoke controllers for each custom API ("building for Kubernetes, rather than with Kubernetes"). kro's answer was a single `ResourceGroup` CRD (later renamed ResourceGraphDefinition): apply it and kro validates the spec, generates a CRD, registers it, and runs a dedicated dynamic controller per new type. It claims the platform team can fix defaults and decide which fields remain mutable. It explicitly labels itself an experiment not intended for production at that time, and not integrated into EKS. Useful as a contrast to the Crossplane framing: kro targets "any Kubernetes resource" rather than cloud APIs specifically.
- Quote: "this project is a public experiment and is under active development. It is not yet intended for production use." (AWS blog)

### 13. AWS Open Source Blog: Kube Resource Orchestrator, From Experiment to Community Project
- URL: https://aws.amazon.com/blogs/opensource/kube-resource-orchestrator-from-experiment-to-community-project/
- Title: "Kube Resource Orchestrator, From Experiment to Community Project"
- Publisher/author: AWS Open Source Blog (Jesse Butler)
- Kind: project governance announcement
- Summary: Reports that kro became an open collaboration between AWS, Microsoft Azure, and Google Cloud, moved to a vendor-neutral GitHub organization, and was in the process of adopting CNCF governance guidelines. It records the rename from `ResourceGroup` to `ResourceGraphDefinition` because the new name is "more correct regarding its intent". The post reiterates the vision of working with any Kubernetes resource and any CRD. Use it for dating and for explaining the rename found in older tutorials. It does not report adoption numbers or named users.
- Quote: "kro is now an open collaboration between AWS, Microsoft Azure, and Google Cloud." (AWS blog)

### 14. Flux docs: Kustomization
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: "Kustomizations" (Flux kustomize-controller)
- Publisher/author: Flux project (CNCF)
- Kind: official API documentation
- Summary: Shows how a GitOps controller handles ordering, health, and garbage collection without defining a new API. `.spec.dependsOn` makes one Kustomization apply only after the referenced ones are Ready (the docs' example is installing cert-manager CRDs and controller before cert-manager custom resources). `healthChecks`, `wait`, and CEL-based `healthCheckExprs` define readiness, and a wrong CEL expression makes the controller wait until timeout. `prune: true` garbage-collects objects removed from Git, an annotation can disable pruning per object, and a deletion policy controls whether managed resources are removed, orphaned, or waited on. Server-side apply dry runs correct drift on the configured interval (every ten minutes in the doc's example). Flux therefore handles ordering at the level of whole manifest sets rather than inside one custom resource.
- Quote: "the Kustomization is only applied after the referred Kustomizations are ready" (Flux docs, on `dependsOn`)

### 15. Argo CD docs: Sync Phases and Waves
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/
- Title: "Sync Phases and Waves"
- Publisher/author: Argo Project (CNCF)
- Kind: official documentation
- Summary: Describes Argo CD's ordering model: hooks (PreSync, Sync, PostSync, SyncFail, Skip, plus PreDelete and PostDelete) mark when resources apply relative to the main sync, and sync waves order resources within a phase. A failed PreSync hook stops the whole sync. During pruning the wave order is reversed, so higher waves are deleted first, and a prune failure halts lower waves. The page warns against `ttlSecondsAfterFinished` on hook Jobs because Argo CD needs to read the Job to know the outcome. Compare with kro: Argo CD ordering is explicit and annotation-based, kro's is inferred from data references.
- Quote: "During pruning, the wave order is reversed from the creation order." (Argo CD docs)

### 16. Cluster API book: ClusterClass
- URL: https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/
- Title: "Experimental Feature: ClusterClass (alpha)"
- Publisher/author: Kubernetes SIG Cluster Lifecycle (Cluster API)
- Kind: official documentation (page is stale; labelled alpha)
- Summary: Introduces ClusterClass as an abstraction on top of existing Cluster API interfaces to reduce boilerplate and enable flexible customization of clusters, using a `topology` on the Cluster object and gated by `ClusterTopology`. Links to the CAEP proposal and guides for ClusterClass authors versus cluster operators. The split between author and consumer mirrors Crossplane's XRD/Composition versus XR split. The page text still says alpha, so confirm current status before writing about it as stable.
- Quote: "reduces boilerplate and enables flexible and powerful customization of clusters" (Cluster API book)

### 17. Google Cloud docs: Config Connector overview
- URL: https://cloud.google.com/config-connector/docs/overview
- Title: "Config Connector overview"
- Publisher/author: Google Cloud
- Kind: official documentation
- Summary: Config Connector is an open source add-on that exposes Google Cloud resources as Kubernetes CRDs with controllers that reconcile them asynchronously. It reconciles using the Config Connector service account's identity, not the submitter's, so the right to create objects in a Config Connector namespace is effectively the right to change cloud resources. Google recommends tightly controlling who can create those objects, for example by having a controller apply them from a trusted repository. This is the "managed resource" layer that Crossplane Compositions and kro RGDs commonly wrap (the kro docs name Config Connector as an option for GCP storage).
- Quote: "Eventual consistency through loosely-coupled dependencies." (Google Cloud docs)

### 18. ACK documentation: Overview
- URL: https://aws-controllers-k8s.github.io/community/docs/community/overview/
- Title: "Overview - ACK"
- Publisher/author: AWS Controllers for Kubernetes project
- Kind: official documentation (marked deprecated site; content moved)
- Summary: ACK lets users define AWS service resources from Kubernetes. Each AWS service has its own controller image (for example the S3 controller), so there is no single ACK binary. The sidebar covers drift recovery, adopting existing AWS resources, retaining AWS resources after CR deletion, field export into ConfigMaps or Secrets, and multi-account and multi-region management; those are the exact problems a composition layer inherits. The page itself is thin and the site says it moved to a new address, so use it mainly for orientation and for the list of operational topics.
- Quote: "lets you define and use AWS service resources directly from Kubernetes." (ACK docs)

### 19. DevopsRoles: Debugging and Mitigating Crossplane Composition Function OOMKilled
- URL: https://www.devopsroles.com/crossplane-composition-function-oomkilled/
- Title: "Debugging and Mitigating Crossplane Composition Function OOMKilled: Memory..."
- Publisher/author: DevopsRoles.com (third-party blog)
- Kind: community troubleshooting write-up (low authority)
- Summary: Argues that functions run as OCI containers that receive the full resource context, so large composites, large EnvironmentConfigs, or heavy logic can exceed memory limits and produce OOMKilled pods and failed XR updates. It proposes setting realistic requests and limits, trimming data handling, monitoring pod status, retries, and splitting logic across pipeline steps. The log excerpts in the article are labelled "Simulated", so treat it as plausible guidance rather than an incident report; corroborate with the design doc's scaling discussion (source 1).
- Quote: "memory exhaustion inside function containers" (DevopsRoles)

## Real-world use cases

VSHN AppCat (source 6): a managed-services provider uses Crossplane composition functions to sell self-service databases, message queues, and object storage across clouds. Conditionals, Helm-driven deployments, and shared backup and maintenance logic were the drivers for leaving P&T. This is the best example of composition as a product catalogue.

Imagine Learning internal developer platform (source 7): a K-12 education company uses Crossplane on AWS for platform abstractions such as RDS clusters and S3 buckets. Replacing 1,000-line P&T files with Go code that loops over an instance count, and unit-testing output with `crossplane beta render`, is a concrete before and after.

Full-stack "Microservice" API (source 5): the Crossplane 2.0 post sketches a platform team offering a `Microservice` kind that creates an RDS instance, security groups, a Deployment, Service, Ingress, and monitoring dashboards from one namespaced object. This is an illustration from the authors, not a named customer.

kro `WebApp` on cloud storage (sources 9 and 11): the kro docs build a WebApp over a ConfigMap, Deployment, Service, and an S3 bucket via ACK, and note equivalent options with Azure Service Operator or Config Connector. The AWS announcement (source 12) describes the same pattern as the motivating case: standard defaults for web apps with controlled mutable fields.

Cluster creation templates (source 16): Cluster API's ClusterClass lets operators create many similar clusters from one class and a small topology section, a composition pattern for infrastructure lifecycle.

Platform-managed autoscaling (source 4): exposing the `scale` subresource on an XR means HPA or KEDA can scale a composed workload without knowing its schema, a pattern relevant to any platform API that wraps a Deployment.

Cross-tool GitOps installs (sources 14 and 15): Flux `dependsOn` for CRDs-before-custom-resources (cert-manager example) and Argo CD sync waves for ordering are the usual way teams sequence platform bundles when they do not need a new API.

No source here names large end-user organisations at scale beyond VSHN and Imagine Learning. The Crossplane ADOPTERS file and the CNCF graduation coverage turned up in search but were not fetched, so adopter lists are not claimed here.

## Pitfalls and how tools address them

Declarative DSL creep. The Crossplane design doc (source 1) argues that adding conditionals and iteration to a REST-shaped config API leads to an incoherent DSL, and that each addition is slow to land because it changes core APIs. Crossplane's fix was to move logic into functions written in a real language or existing DSL (Go, Python, CUE, KCL, Go templates). kro takes a different guardrail: CEL, which is non-Turing complete and type-checked at apply time (source 9). Both accept a bounded-expression trade-off; they differ on where the bound sits.

Partial desired state deletes things. A function must return the whole desired state each call; omitting a resource removes it (source 6, source 1). VSHN learned this in alpha. Mitigation is to start from the incoming desired state, only mutate your own parts, and pass everything else through, as the design doc requires.

Mixing P&T and code. VSHN warns that managing the same objects with both styles makes it hard to see where a change originates (source 6). Crossplane's own deprecation of `mode: Resources` (source 3) pushes teams toward one pipeline model, with P&T as just a step.

P&T structural limits. No patching directly between composed resources, PatchSets that cannot nest, and no conditionals force workarounds via XR status fields and duplicated files (sources 3 and 7). Functions or kro's expression graph remove these limits.

Function load and memory. Because XRs are polled (default 60 seconds), function calls scale with XR count (source 1). The design doc lists poll-interval tuning, horizontal scaling, and response caching; a third-party article reports OOMKilled function pods on large composites and recommends limits and pipeline splitting (source 19, low authority). Imagine Learning chose one monolithic function to reduce idle pods (source 7), which is a trade-off against isolation.

Rollout of composition changes. XRs pin to a CompositionRevision, so editing a Composition does not instantly change existing XRs (source 1), and OCI-digest references in pipeline steps let each revision call a fixed function version (source 2). This avoids surprise global changes but means older XRs can lag behind.

Readiness and ordering between composed resources. kro infers order from references, waits for expressions to be resolvable, and deletes in reverse (source 10). Flux uses `dependsOn` plus health checks and warns that a bad CEL health expression stalls until timeout (source 14). Argo CD uses explicit waves and hooks and reverses order for pruning (source 15). Crossplane relies on function logic and function-auto-ready for readiness (sources 2 and 4). Teams should expect "Ready" to mean different things in each stack.

GitOps tracking of generated objects. Argo CD needs annotation tracking and custom health checks for Crossplane (source 8), and for kro each templated resource needs a tracking-id annotation and an owner reference, with the docs warning of owner-reference limits (source 11). Raising Argo CD's client QPS helps when CRD counts are large (source 8). Flux's pruning and deletion policy settings (source 14) matter for composed children that should be orphaned or retained.

CRD sprawl. Installing a full cloud provider adds 100+ CRDs. Crossplane 2.0 introduced managed resource definitions and activation policies to install only what is needed (source 5). ACK ships one controller image per AWS service, which avoids the problem by construction (source 18).

Permission and blast radius. Config Connector reconciles with its own service account, so whoever can create its objects effectively holds that cloud authority (source 17). The same reasoning applies to any composition layer: the controller's identity, not the requester's, performs the work, so access to create XRs or kro instances should be controlled accordingly. The sources state this directly for Config Connector only; applying it to Crossplane and kro is an inference.

API stability. kro is `v1alpha1` and has already renamed its core kind (sources 11 and 13); Cluster API's ClusterClass doc still labels it alpha (source 16). Older tutorials show `ResourceGroup`, claims, or `mode: Resources`, all superseded.

## Tutorial and explainer links

- https://docs.crossplane.io/latest/composition/compositions/ : the current, complete explanation of pipelines and functions; start here for Crossplane.
- https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md : the best "why and how" for functions, including the gRPC contract and scaling math.
- https://docs.crossplane.io/latest/guides/function-patch-and-transform/ : learn patches and transforms and their limits.
- https://docs.crossplane.io/latest/guides/scalable-composition/ : short end-to-end example of an XR wrapping a Deployment with scaling.
- https://blog.crossplane.io/building-crossplane-composition-functions-to-empower-your-control-plane/ : readable before-and-after of P&T versus code, with local render testing.
- https://blog.crossplane.io/composition-functions-in-production/ : practical lessons from a managed-services provider.
- https://kro.run/docs/overview : the clearest single page for what an RGD is and what kro automates.
- https://kro.run/docs/concepts/expressions/dependencies-ordering : explains DAG inference with diagrams and patterns.
- https://aws.amazon.com/blogs/opensource/introducing-open-source-kro-kube-resource-orchestrator/ : motivation for why platform teams want this instead of custom controllers.
- https://fluxcd.io/flux/components/kustomize/kustomizations/ : how Flux orders, health-checks, and prunes sets of manifests.
- https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/ : how Argo CD orders resources with waves and hooks.

## Open questions

- Crossplane docs versions disagree on naming and scope. The fetched pages show v2.x (the compositions page was served as v2.4, other pages as v2.5), while search snippets and older blog posts use `docs.crossplane.io/latest/concepts/...` URLs that now return empty content. Writers should cite the `composition/` paths and check the version banner.
- The design doc says functions run as headless-Service-backed Deployments; the VSHN post (2023) describes running a gRPC runner as a sidecar to the Crossplane pod and an earlier container-runner path. The sources do not say which parts of that earlier runner model still exist.
- kro's own docs describe an alpha `Graph` object alongside RGDs, and its Graph and RGD APIs differ in how readiness gates dependents (the dependencies page says the behaviour "differs between the two APIs"). The exact difference was not read; a later pass should open the Readiness page.
- Performance and scale claims for kro (how many instances per controller, how dynamic controllers behave under many RGDs) are not covered by the pages read. Only the FAQ and AWS blog describe a "dedicated controller" per generated CRD, and the docs list a Controller Tuning page that was not fetched.
- No source gave a head-to-head comparison of Crossplane Compositions and kro. Any comparison in tutorials should be labelled as the wiki authors' synthesis.
- The Cluster API ClusterClass page is flagged alpha, but it is likely out of date relative to current releases; verify status in the Cluster API release notes before presenting it as stable or experimental.
- The Config Connector and ACK pages describe the managed-resource layer but say nothing about how they behave when wrapped by Compositions or RGDs (for example readiness conditions or deletion policy interplay). The ACK docs list drift recovery and deletion policy topics that were not opened.
- Adopter lists (Crossplane ADOPTERS.md) and conference talks were identified in search results but not fetched, so named-organization evidence is limited to VSHN and Imagine Learning.
- The Kubernetes "Operator pattern" and API conventions pages were fetched but only skimmed (navigation and headings), so no claims here are sourced from them. A foundations section for the audience should read them properly.
