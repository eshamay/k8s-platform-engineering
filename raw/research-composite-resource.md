# Research dossier: Composite Resources and Resource Graphs

Research date: 2026-11-25

## Overview

A composite resource is a platform-defined Kubernetes API that stands for a bundle of other resources. A user creates one small object, such as a `Database` or `WebApplication`, and a controller expands it into the many lower-level objects it represents: Deployments, Services, cloud buckets, IAM roles, VPCs. The controller keeps those children reconciled, wires values from one child into another, reports aggregate readiness, and tears everything down in a sensible order. This is the standard Kubernetes controller pattern (watch a desired-state object, compare it with the world, converge) applied one level up, where the "world" is a set of other API objects. The user-facing object is deliberately smaller than the sum of its parts, which is why the sources describe it as an abstraction layer for platform teams.

Crossplane and kro implement this idea differently. Crossplane splits it into separate objects. A CompositeResourceDefinition (XRD) declares the API schema, and Crossplane turns it into a CRD. A Composition says how an instance of that API (the composite resource, or XR) becomes composed resources. Since v1.17 that mapping has been a pipeline of "composition functions": gRPC services that receive the observed state and return the desired state. In v1, a namespaced "Claim" sat in front of a cluster-scoped XR. In v2, XRs are namespaced themselves and claims are gone for new-style XRDs. kro merges schema and implementation into one object, the ResourceGraphDefinition (RGD). kro generates the CRD, registers a dynamic controller, infers a dependency DAG from CEL expressions, and creates children in topological order. In March 2026 the Crossplane project shipped `function-kro`, which runs kro-style YAML+CEL inside a Crossplane pipeline step, so the two models now overlap.

The sources frame the problem from the platform-team side. The Google Cloud kro announcement says teams previously had to build custom controllers or use client-side templating (Helm, Kustomize) that cannot use CRD benefits. The Crossplane design-for-organizations blog says a platform team's stable, versioned API protects users from provider features that might break compliance. The Cluster API ClusterClass documentation shows the same pattern for cluster lifecycle: a class plus a small topology spec replaces boilerplate. Common design concerns across the sources are API versioning, who owns the abstraction, how changes roll out to existing instances, and how deletion and readiness propagate.

For tutorial writers, the key ideas build in order. First, CRDs plus controllers are how Kubernetes is extended. Second, a composite is a controller whose children are other API objects. Third, a schema (XRD or RGD `spec.schema`) is the contract with users. Fourth, templating logic (functions or CEL) maps inputs to children. Fifth, dependency and readiness handling decides ordering. Sixth, lifecycle concerns (revisions, deletion policy, GitOps tracking, migration between versions) are where production pain shows up. The sources agree on most of this. They differ on maturity (Crossplane is a CNCF graduated project; kro is still `v1alpha1`) and on whether claims and cluster scope are still relevant (v1 docs say yes; v2 says no).

## Sources

### 1. Crossplane docs: Composite Resources (latest, v2.x)
- URL: https://docs.crossplane.io/latest/composition/composite-resources/
- Title: Composite Resources, Crossplane v2.4 docs (page chrome showed latest release v2.5)
- Publisher: Crossplane project / CNCF
- Kind: official documentation
- Summary: Defines an XR as a set of Kubernetes resources represented as one object, created through a custom API that an XRD defines and a Composition configures. The Composition is chosen by matching `compositeTypeRef` to the XRD's group and kind. The page then covers per-XR controls. These are `compositionRef` and `compositionSelector` for picking a Composition, `compositionUpdatePolicy` (Automatic by default, or Manual) and `compositionRevisionRef` or `compositionRevisionSelector` for pinning revisions, the `crossplane.io/paused` annotation, a per-XR poll interval, and `crossplane.io/reconcile-requested-at` to force a reconcile. It also documents an alpha deletion policy (Background, Foreground, Pipeline) and has a warning that Argo CD's default foreground deletion makes Crossplane ignore the policy. It is useful as the mechanical reference for how an XR is selected, updated, paused and deleted.
- Quote: "A composite resource, or XR, represents a set of Kubernetes resources as a single Kubernetes object."

### 2. Crossplane docs: Composite Resource Definitions (v1.20)
- URL: https://docs.crossplane.io/v1.20/concepts/composite-resource-definitions/
- Title: Composite Resource Definitions, Crossplane v1.20
- Publisher: Crossplane project / CNCF
- Kind: official documentation (older version, still the clearest XRD walk-through)
- Summary: Explains that an XRD is like a CRD with fewer required fields plus Crossplane options (claims, connection secrets, defaults). Applying one makes Crossplane create a matching CRD. The page covers `group`, `names.kind` and `plural` (the XRD name must be `<plural>.<group>`, and the convention is an `X` prefix on the kind), and versioning following Kubernetes alpha/beta/stable conventions. It covers OpenAPIv3 structural schemas and `required` being per-object. It lists defaults such as `defaultCompositionRef`, `enforcedCompositionRef` and `defaultCompositionUpdatePolicy`, and notes XRD conditions such as `WatchingCompositeResource`. It warns that `group` and `names` cannot be changed without deleting the XRD. It also has a "Confused about Compositions, XRDs, XRs and Claims?" box that is a good seed for a glossary. Pair it with source 7 for what changed in v2.
- Quote: "Crossplane XRDs are like Kubernetes custom resource definitions." The page continues that they require fewer fields and add options for Claims and connection secrets.

### 3. Crossplane docs: Compositions (latest, v2.x)
- URL: https://docs.crossplane.io/latest/composition/compositions/
- Title: Compositions, Crossplane v2.4 docs
- Publisher: Crossplane project / CNCF
- Kind: official documentation
- Summary: Describes a Composition as a pipeline of composition functions, which are Crossplane extensions that template resources. A Function is installed as a package and runs as a pod. Crossplane calls each step in order with the XR's current state and the state of resources it owns, and the function returns what should exist. Options named on the page include function-patch-and-transform, Go templating, CUE, KCL, Python, and custom functions in Go or Python. The page also covers `compositeTypeRef` matching, RBAC for composed resources, ordered deletion control, testing, and credentials and "required resources" that functions can request. It notes functions do not run on deletion, so Crossplane deletes composed resources itself. Useful for explaining why Crossplane moved from fixed patch-and-transform to programmable pipelines.
- Quote: "A Composition is a pipeline of composition functions."

### 4. Crossplane docs: Claims (v1.20)
- URL: https://docs.crossplane.io/v1.20/concepts/claims/
- Title: Claims, Crossplane v1.20
- Publisher: Crossplane project / CNCF
- Kind: official documentation (older version)
- Summary: Explains the v1 claim model. A claim is a namespaced stand-in for a cluster-scoped XR. The XRD must enable claims through `claimNames`. Creating a claim causes Crossplane to create an XR, linked through `spec.resourceRef` on the claim and `spec.claimRef` on the XR. Claims can bind to pre-provisioned XRs, which suits slow-to-provision resources. Connection secrets land in the claim's namespace through `writeConnectionSecretToRef`. The page says claims are unnecessary if you do not use namespaces. Valuable for tutorial writers because many existing blog posts and Git repos still use claims, so learners need to recognize them even though v2 removed the concept.
- Quote: "Claims represents a set of managed resources as a single Kubernetes object, inside a namespace."

### 5. kro docs: ResourceGraphDefinition overview (v0.10.0)
- URL: https://kro.run/docs/concepts/rgd/overview/
- Title: Overview, kro
- Publisher: kro project (Kubernetes SIG Cloud Provider subproject)
- Kind: official documentation
- Summary: An RGD defines a new API and the resources behind it in one object, with `spec.schema` (API shape in SimpleSchema) and `spec.resources` (templates with CEL expressions). When applied, kro validates it, generates a CRD, registers it, and starts a dynamic controller for instances. Static analysis at RGD creation covers schema, existence of referenced kinds, CEL type checking and dependency inference, including cycle rejection. The computed order lands in `status.topologicalOrder`, with creation in topological order and deletion in reverse. Status conditions are Ready, GraphRevisionsResolved, GraphAccepted, KindReady and ControllerReady. Spec changes become immutable GraphRevision objects, and if the latest revision fails compilation, instances stop progressing with no fallback to an older revision. Breaking schema changes are blocked unless the `kro.run/allow-breaking-changes` annotation is set. Best primary source for kro mechanics.
- Quote: "kro performs extensive static analysis to catch errors before deployment."

### 6. kro docs: FAQ (v0.10.0)
- URL: https://kro.run/docs/faq
- Title: FAQ, kro
- Publisher: kro project
- Kind: official documentation
- Summary: Short answers on what kro is and how it works. The kro controller verifies an RGD, creates a CRD, and deploys a dedicated micro-controller for instance events. It states the API is `v1alpha1` and may break. It distinguishes an RGD (creates a new API, one resource set per instance) from the newer alpha `Graph` (a namespaced object whose nodes are reconciled directly, disabled by default). It gives the Argo CD recipe: add an ownerReference and an `argocd.argoproj.io/tracking-id` annotation to every templated resource, with a warning about owner reference limits. It also shows a Helm-style checksum trick to restart Deployments when a ConfigMap changes. Useful for the GitOps interaction and the API maturity caveat.
- Quote: "kro's API is currently at `v1alpha1`."

### 7. kro docs: Readiness (v0.10.0)
- URL: https://kro.run/docs/concepts/reconciliation/readiness
- Title: Readiness, kro
- Publisher: kro project
- Kind: official documentation
- Summary: Explains `readyWhen`, a list of CEL boolean expressions that define when one resource counts as ready. In an RGD, dependents wait until all their dependencies are ready, which prevents using status values (such as a database endpoint) that do not exist yet. In the alpha Graph API, `readyWhen` only reports health and does not gate dependents; a dependent is applied as soon as the fields it references exist. Expressions can reference only the resource itself, which keeps them local and debuggable. The page also teaches the optional `?` operator with `orValue`. Good for explaining ordering versus readiness, a recurring source of subtle bugs.
- Quote: "`readyWhen` determines when **this specific resource** is ready."

### 8. Amazon EKS docs: kro concepts
- URL: https://docs.aws.amazon.com/eks/latest/userguide/kro-concepts.html
- Title: kro concepts, Amazon EKS User Guide
- Publisher: Amazon Web Services
- Kind: vendor documentation of a managed capability
- Summary: AWS documents kro as an EKS capability and walks a beginner example (a WebApplication RGD producing a Deployment and Service). It explains SimpleSchema types and constraints, the `${...}` CEL forms (standalone versus string templates, optional access, ternaries, `includeWhen` that can only reference `schema.spec`), and automatic dependency inference into a DAG with parallel creation of independent resources. Its main use-case section composes ACK S3 Buckets with ConfigMaps and Deployments, passing ARNs from `status.ackResourceMetadata`. It stresses that validation happens at RGD creation, not at runtime. Good evidence that a hyperscaler productized kro and pairs it with ACK.
- Quote: "kro validates ResourceGraphDefinitions at creation time, not at runtime."

### 9. Google Cloud blog: Introducing Kube Resource Orchestrator (kro)
- URL: https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator
- Title: Simplify the developer experience on Kubernetes with KRO (page title: Introducing Kube Resource Orchestrator, or kro)
- Publisher: Google Cloud; authors Abdel Sghiouar and Nic Slattery; dated January 30, 2025
- Kind: project announcement / vendor blog
- Summary: Announces kro as a joint effort by Google Cloud, AWS and Azure. It frames the gap: platform teams want standards for app deployment but Kubernetes lacks a native way to define custom groupings of resources, and the alternatives (custom controllers, Helm) are costly or cannot use CRD benefits. Two examples: a platform admin exposing a GKE cluster API backed by Config Connector resources (cluster, node pools, IAM, policies) with only name, node pool, max nodes and location exposed, and a DevOps engineer defining a WebApp API with deployments, services, monitoring agents and buckets. It says kro works with ACK, KCC and ASO. It candidly states the project was early-stage and not production ready at the time.
- Quote: "As an early-stage project, kro is not yet ready for production use"

### 10. Crossplane design doc: Composition Functions
- URL: https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md
- Title: Composition Functions: Beta (design doc)
- Publisher: Crossplane maintainers (GitHub)
- Kind: design document
- Summary: Explains why Crossplane replaced patch-and-transform (P&T) with functions. Maintainers wanted to avoid growing a new configuration DSL organically, citing Brian Grant's writing on configuration complexity, and noted P&T was starting down that path through feature requests. The proposal adds `mode: Pipeline` to a Composition with an ordered array of function calls, where each step's output feeds the next. Crossplane calls a function over gRPC with a `RunFunctionRequest` containing observed state, and the function returns desired state. Functions ship as packages, so alternative authoring languages (templates, CUE, KCL, Go, Python) are possible. Essential for understanding the architectural reason for v2's removal of native P&T.
- Quote: "Avoid organically growing a new configuration Domain Specific Language (DSL)."

### 11. Crossplane blog: Design Compositions For Your Organizational Needs
- URL: https://blog.crossplane.io/design-compositions-for-your-organizational-needs-with-crossplane/
- Title: Design Compositions For Your Organizational Needs With Crossplane
- Publisher: Crossplane blog; author Markus Schweig (Upbound), 06 Oct 2023
- Kind: engineering blog from a vendor
- Summary: Argues that platform teams should expose well understood features behind their own versioned APIs instead of passing provider features straight through, because native features can break proprietary environments or reduce compliance. It describes the model (XRDs define APIs, claims issue requests, Compositions map to managed resources, providers reconcile against external systems) and lists design principles: automated tagging, multi-tenant segregation for claims, external secret stores, GitOps, and short feedback loops. It also gives a test-driven composition workflow using kind, Kuttl and Skaffold, with each Kuttl run taking 2 to 5 minutes. Dated (pre-v2, pre-function default), and the vendor-authored tone should be noted.
- Quote: "Multi-tenant access segregation for resource claims is an excellent pattern for proper cloud governance and security."

### 12. Crossplane docs: Upgrade to Crossplane v2
- URL: https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/
- Title: Upgrade to Crossplane v2
- Publisher: Crossplane project / CNCF
- Kind: official migration guide
- Summary: Lists what v2 removes: native patch-and-transform (`mode: Resources`), ControllerConfig, external secret stores, XR-level connection details, and the default registry flag. It requires being on v1.20 and upgrading one minor version at a time, and offers `crossplane beta upgrade check` and `crossplane beta convert pipeline-composition` to find and fix removed features. v2 introduces namespaced managed resources under `.m.` API groups and namespaced XRs. Existing v1 cluster-scoped XRs and MRs keep working, but no automated migration exists yet. It warns against editing a live Composition used by existing XRs because that could disrupt or replace resources. This is the best source for the claim-versus-namespaced-XR transition.
- Quote: "There's no automated tooling yet to migrate existing v1 cluster-scoped XRs and MRs to v2 namespaced style."

### 13. Crossplane blog: Introducing function-kro
- URL: https://blog.crossplane.io/function-kro-yaml-cel/
- Title: Introducing function-kro: YAML+CEL Composition Meets Crossplane
- Publisher: Crossplane blog; author Jared Watts (Upbound), 19 Mar 2026
- Kind: project announcement / engineering blog
- Summary: Announces a composition function embedding kro's graph builder, CEL evaluator and runtime so kro-style `resources` blocks drop into a Crossplane pipeline step unchanged. The example is a NetworkingStack API with a VPC, Subnet and SecurityGroup wired by CEL, followed by a `function-auto-ready` step. The post says Crossplane adds structure beyond a standalone RGD (schema separated from implementation) and lists what that buys: CompositionRevisions to pin and roll back, extra pipeline steps for policy or tagging, multiple Compositions behind one API (AWS, GCP, Azure), pause annotations, and `crossplane render` for local testing. It also shows `crossplane xrd generate --from simpleschema`. Primary evidence that the two stacks are converging. Vendor-authored, so claims of "full feature parity" are the project's own.
- Quote: "One schema, many implementations."

### 14. Crossplane ADOPTERS.md
- URL: https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md
- Title: ADOPTERS.md, crossplane/crossplane
- Publisher: Crossplane project (self-reported by organizations)
- Kind: project adopter list
- Summary: A self-reported table of organizations and how they use Crossplane. Entries relevant to composite resources include Renault (XRDs and compositions as an abstraction layer for Kubernetes platform services), Wellhub/Gympass and Wildlife Studios (self-service platforms), Deutsche Kreditbank (integrated into its standard operating platform, managing more than 10 EKS clusters), Consensys (internal developer platform, managing more than 1,000 resources per the truncated row), Autodesk (declarative API abstractions for a unified control plane), Grafana Labs (internal developer platform control plane), VSHN (AppCat service catalog), Millennium bcp (self-service application lifecycle), Continental (self-service ephemeral vclusters), and Syntasso (Crossplane as a component of Kratix). Entries are brief and unaudited, so they show adoption patterns rather than depth.
- Quote: "Self-service platform for end-to-end application (and dependant resources) lifecycle" (Millennium bcp entry).

### 15. Cluster API book: ClusterClass
- URL: https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/
- Title: Experimental Feature: ClusterClass (alpha), The Cluster API Book
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: official documentation (short landing page)
- Summary: Introduces ClusterClass as a way to create clusters with less boilerplate and flexible customization, implemented on top of existing Cluster API interfaces. It points to the CAEP "ClusterClass and Managed Topologies" proposal, separate docs for class authors and cluster operators, and the `ClusterTopology` feature gate. The page is thin, and the page version I read labels the feature alpha, which may be out of date, so treat maturity statements as unverified. Included as a non-Crossplane, non-kro example of the same pattern: a reusable class plus a small topology object that a controller expands into many machine and infrastructure objects. I did not read the linked CAEP.
- Quote: "ClusterClass is a powerful abstraction implemented on top of existing interfaces"

### 16. Coding Protocols: kro vs Crossplane vs Helm
- URL: https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm
- Title: kro vs Crossplane vs Helm: Choosing How to Build Kubernetes Platform Abstractions
- Publisher: Coding Protocols; author Ajeet Yadav; published June 26, 2026, updated September 19, 2026
- Kind: third-party comparison blog / explainer
- Summary: A readable comparison that places Helm (packaging, no reconciliation), kro (a CRD factory over existing Kubernetes resources) and Crossplane (a control plane that owns external infrastructure) at different altitudes. It explains v2 changes in plain terms (namespaced XRs, claims removed, a `LegacyCluster` fallback for v1-style XRDs, functions as the standard). A table compares expression model, drift handling, ordering and maturity, and a decision rule says to use kro when building blocks are already Kubernetes resources and Crossplane when you need to drive cloud APIs directly. It says IDPs often combine them. Its kro version claim (v0.9.x) trails the kro docs I read (0.10.0), so verify against the kro site. A consultancy blog, so secondary evidence.
- Quote: "kro is a CRD factory."

## Real-world use cases

Self-service infrastructure APIs are the dominant use case. The Crossplane adopter list (https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md) names Renault building platform services behind XRDs and compositions, Wellhub, Wildlife Studios, Splash and Millennium bcp offering self-service provisioning to engineers, Grafana Labs and Consensys running internal developer platforms, and Autodesk using abstractions for a unified control plane. Deutsche Kreditbank reports managing more than 10 EKS clusters with Crossplane. These rows are self-reported and short, so they show what is being built but not outcomes.

Productized service catalogs are a second pattern. VSHN's AppCat is listed as a cloud-native marketplace powered by Crossplane, and Syntasso lists Crossplane as an optional subcomponent of Kratix (same adopter list). Continental provides self-service ephemeral vclusters to developers. These cases treat each composite kind as a product that other teams consume.

Hyperscaler examples for kro appear in the Google Cloud announcement (https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator). A platform admin exposes a GKE cluster API backed by Config Connector resources (cluster, node pools, IAM service account and policy member, policies), and the user sets only cluster name, node pool name, max nodes, location and optional networks. A web application API bundles Deployments, Services, monitoring agents and buckets. The EKS guide (https://docs.aws.amazon.com/eks/latest/userguide/kro-concepts.html) shows kro composing ACK S3 Buckets with ConfigMaps and Deployments, passing the bucket ARN from ACK status into app config. AWS offers kro as a managed EKS capability, which indicates vendor investment even though the project's API is still alpha.

Compliance and governance are a motivation rather than a named deployment. The Crossplane blog (https://blog.crossplane.io/design-compositions-for-your-organizational-needs-with-crossplane/) argues that a platform API with automated tagging, multi-tenant claim segregation and external secret stores lets organizations enforce standards without exposing raw provider features. The function-kro post (https://blog.crossplane.io/function-kro-yaml-cel/) gives a NetworkingStack example (VPC, subnet, security group) and suggests extra pipeline steps for policy checks and cost-allocation tags.

Cluster lifecycle is the Cluster API example (https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/). A ClusterClass plus a Cluster topology expands to machine and infrastructure objects. This is not named as an industry deployment in the page I read.

## Pitfalls and how tools address them

Schema and API evolution. Crossplane XRD `group` and `names` cannot be changed without deleting the XRD, and at v1.20 changing a schema required restarting the Crossplane pod (https://docs.crossplane.io/v1.20/concepts/composite-resource-definitions/). The XRD docs recommend Kubernetes-style alpha/beta/stable versioning. kro blocks breaking schema changes on an RGD (field removal, type change, new required field without default, enum or pattern changes) unless an explicit annotation is set, and warns that forcing a change can invalidate existing instances (https://kro.run/docs/concepts/rgd/overview/). Both sources show that the schema is a contract with live consumers.

Rolling out changes to existing instances. Crossplane tracks Composition changes as CompositionRevisions. XRs default to the Automatic update policy and take the latest revision, but can use Manual with a pinned revision or a revision selector (https://docs.crossplane.io/latest/composition/composite-resources/). The v2 upgrade guide warns against editing a live Composition that existing XRs use, because that could disrupt or replace resources (https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/). kro snapshots each spec change as a GraphRevision, but if the latest revision fails compilation, instances stop progressing and there is no fallback to an older revision. That is a different failure mode from Crossplane's pinning. The function-kro post argues that running kro logic inside Crossplane gets the revision-pinning benefits.

Errors found late versus early. kro validates CEL types, field existence and cycles when the RGD is created, so mistakes surface before any instance exists (https://kro.run/docs/concepts/rgd/overview/, https://docs.aws.amazon.com/eks/latest/userguide/kro-concepts.html). Crossplane functions are external programs, so errors can appear at reconcile time; the docs and blog recommend `crossplane render`, unit tests and a Kuttl-based test loop (https://blog.crossplane.io/function-kro-yaml-cel/, https://blog.crossplane.io/design-compositions-for-your-organizational-needs-with-crossplane/).

Template language sprawl. The Crossplane design doc says maintainers wanted to avoid an organically grown DSL and chose gRPC functions so any language can be used (https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md). The cost is more moving parts: functions are packages that run as pods and must be healthy. kro takes the opposite tradeoff with one restricted expression language (CEL) and no custom code.

Ordering versus readiness. In kro, dependency order is inferred from CEL references, and `readyWhen` gates dependents inside an RGD but only reports health in the alpha Graph API (https://kro.run/docs/concepts/reconciliation/readiness). Referencing a status field that only exists once healthy is the workaround the docs give for Graph. Crossplane leaves ordering to functions and eventual reconciliation; the function-kro post says dependent resources are not created until the referenced output exists.

Deletion semantics and GitOps. Crossplane's alpha deletion policy (Background, Foreground, Pipeline) can be silently bypassed when Argo CD deletes with foreground propagation, in which case Crossplane emits a warning event; the fix is the `PrunePropagationPolicy=background` sync option and a background finalizer (https://docs.crossplane.io/latest/composition/composite-resources/). A stuck Foreground or Pipeline deletion leaves the XR in Deleting until the finalizer is removed manually. Flux and Argo CD both see only the top-level XR or instance, but kro needs explicit ownerReference and `argocd.argoproj.io/tracking-id` annotations on each templated child so Argo CD tracks them correctly (https://kro.run/docs/faq). I found no Flux-specific guidance in the pages I read.

Version churn and migration. Crossplane v2 removed native patch-and-transform, ControllerConfig, external secret stores and XR connection details, and there is no automatic migration from v1 cluster-scoped XRs to namespaced ones (https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/). Older tutorials that rely on claims or `mode: Resources` no longer match current behavior. kro is `v1alpha1` and says breaking changes may come (https://kro.run/docs/faq), and Google's announcement said it was not ready for production at launch.

Choosing the right layer. The comparison post argues that kro suits compositions of resources already on the cluster (including ACK, ASO and Config Connector CRDs), while Crossplane suits owning cloud APIs directly with provider-level drift correction. Helm packages but does not reconcile (https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm). Config Connector, ACK and Azure Service Operator are therefore usually the leaf resources under a composite, while the composite layer is Crossplane or kro. Cluster API's ClusterClass solves the same expansion problem for cluster objects specifically and is not a general-purpose composer.

## Tutorial and explainer links

- https://docs.crossplane.io/latest/composition/composite-resources/ : the XR reference with every per-resource control, good for a mechanics chapter.
- https://docs.crossplane.io/v1.20/concepts/claims/ : the clearest explanation of claim-to-XR linkage, needed to read legacy material.
- https://docs.crossplane.io/latest/composition/compositions/ : how function pipelines work and how to choose function languages.
- https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/ : the map of what changed between v1 and v2.
- https://kro.run/docs/concepts/rgd/overview/ : the best single page on RGD mechanics, validation and graph revisions.
- https://kro.run/docs/concepts/reconciliation/readiness : a short, concrete treatment of readiness versus ordering.
- https://docs.aws.amazon.com/eks/latest/userguide/kro-concepts.html : a gentle beginner example including SimpleSchema and CEL forms.
- https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator : the motivation and two high-level use cases, readable by non-experts.
- https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm : the easiest side-by-side comparison for choosing a stack.
- https://blog.crossplane.io/function-kro-yaml-cel/ : shows how the Crossplane and kro models fit together.

## Open questions

- Claims versus namespaced XRs. The v1.20 pages treat claims as the way to give users a namespaced API. The v2 guide and the comparison post say claims are removed for new-style XRDs and XRs are namespaced. I did not read a primary v2 page that states claim support precisely (the `LegacyCluster` detail comes from the third-party post), so writers should verify against the v2 XRD docs.
- kro maturity and version. The kro docs I read show version 0.10.0 with a `v1alpha1` API, while the comparison blog (updated September 2026) says v0.9.x. The status of the alpha `Graph` API (disabled by default) versus RGD is also still moving.
- Flux. The research brief asked how Flux handles composite resources. The pages I read cover Argo CD interaction only. Nothing in the sources covers Flux health checks, `dependsOn` or CRD ordering with XRs or RGD instances. Flux documentation was not searched or read.
- Config Connector and ACK. Both appear only as leaf-resource providers in the Google and AWS posts. I did not read their own docs on readiness, deletion policy or abandon semantics.
- Cluster API maturity. The ClusterClass page I read labels the feature experimental/alpha. This may be stale, and I did not read the CAEP, so the current status is unverified.
- Failure postmortems. I found no public postmortem about a composite-resource outage in this pass, so the pitfalls above come from documentation warnings, not incident reports.
- Conference talks. I did not read any KubeCon talk or write-up; the adopter list gives names but no depth. A DeepWiki page on the RGD returned a rate-limit error and was skipped.
- Scale and performance. None of the pages gives numbers for how many composites or children a single controller handles. kro's controller tuning docs were not read.
- Kubernetes core docs (CRD, API conventions, controller pattern) were not fetched in this pass, so foundational explanations for the tutorial prerequisite chapters still need sourcing.
