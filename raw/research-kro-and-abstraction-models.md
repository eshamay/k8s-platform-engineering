# Research dossier: kro and abstraction models

Research date: 2026-11-25

## Overview

Every approach in this dossier answers one question: how does a platform team hide a pile of Kubernetes (and cloud) resources behind an interface that application teams can use without learning all the details? The approaches fall into two families. The first family is client-side or render-time: Helm (Go templates plus values), Kustomize (template-free patching of plain YAML), KRM functions and kpt (containerized programs that read and write lists of Kubernetes objects), and Score (a developer-facing workload spec translated by a CLI into Docker Compose or Kubernetes manifests). These produce manifests once. Continuous correction is left to something else, typically a GitOps tool such as Flux or Argo CD.

The second family is server-side and controller-driven: Crossplane Compositions, kro ResourceGraphDefinitions, and Radius. Here the abstraction is itself a Kubernetes API. The platform team defines a new kind (a CRD), and a controller keeps reconciling the child resources, writes status back to the parent, and handles deletion order. For readers new to controllers, this is the key idea: the abstraction is a live control loop, not a template that ran once.

kro (Kube Resource Orchestrator) is the newest entrant. A single ResourceGraphDefinition (RGD) holds a schema (the user-facing API) and a list of resource templates wired together with CEL expressions. kro generates a CRD, starts a dedicated controller for it, infers dependency order from the expression references, and propagates status. Crossplane splits the same job into a CompositeResourceDefinition (XRD, the API), a Composition (a pipeline of functions that renders children), and Providers (managed resources for cloud APIs), all distributed as OCI Configuration packages.

The sources agree on the main trade-off. kro is more compact and has no extra runtime, but it only orchestrates Kubernetes objects and is still pre-1.0 (API v1alpha1). Crossplane is more expressive and can reach cloud APIs through its own providers, but it costs more to operate and learn. Several sources suggest the two (or kro plus ACK, Config Connector, or ASO) are complementary rather than exclusive. Helm remains the packaging and distribution standard in most of these combinations.

## Sources

### 1. What is kro?
- URL: https://kro.run/docs/overview
- Title: What is kro? (docs v0.10.0)
- Publisher: kro project (Kubernetes SIG Cloud Provider)
- Kind: Official project documentation
- Summary: Defines kro as a way to turn a set of Kubernetes resources into a reusable API. An RGD has a schema section (written in "SimpleSchema" shorthand such as `image: string | default=nginx`) and a resources section of templates that reference fields via `${...}` CEL expressions. kro parses expressions, infers the dependency graph, generates a CRD and runs a controller. It can wait for status fields (for example an ACK bucket ARN) that do not exist yet, supports conditional resources (`includeWhen`) and `forEach` collections, and validates definitions before reconciling. The page notes a newer alpha `Graph` object that composes resources without defining a new API. Works with any CRD, including ACK, Azure Service Operator and Config Connector.
- Quote: "CEL always terminates, has no side effects, and is type-checked at apply time."

### 2. kro FAQ
- URL: https://kro.run/docs/faq
- Title: FAQ | kro
- Publisher: kro project
- Kind: Official documentation
- Summary: Explains that the RGD controller creates a CRD and then deploys a dedicated "microcontroller" per generated API. States the API is `v1alpha1` and may break. Distinguishes RGD (new API, many instances) from Graph (namespaced bundle, no new kind, alpha and disabled by default). Gives the Argo CD recipe: add an owner reference and an `argocd.argoproj.io/tracking-id` annotation to each templated resource so Argo can track kro children. Shows the Helm-style checksum trick for restarting a Deployment when a ConfigMap changes, done with CEL hash functions.
- Quote: "kro's API is currently at `v1alpha1`."

### 3. kro RGD instances
- URL: https://kro.run/docs/concepts/rgd/instances
- Title: Instances | kro
- Publisher: kro project
- Kind: Official documentation
- Summary: Describes instance states (ACTIVE, IN_PROGRESS, DELETING, ERROR) and the observe-compare-act-report loop. kro deliberately avoids default Kubernetes owner references because they cause out-of-order deletion and cannot link namespaced to cluster-scoped objects; it uses ApplySet and reverse-topological deletion instead. Reactive reconciliation restores drift. Notes that fields from `schema.spec` referenced by resources must have values.
- Quote: "If any of the resources in your ResourceGraphDefinition reference any fields in `schema.spec`, they must have a value."
- Read via a summarizing fetch tool, not raw text.

### 4. Resource Composition with kro (Amazon EKS capability)
- URL: https://docs.aws.amazon.com/eks/latest/userguide/kro.html
- Title: Resource Composition with kro (Kube Resource Orchestrator) - Amazon EKS
- Publisher: AWS
- Kind: Vendor documentation
- Summary: Shows that AWS now offers kro as a fully managed EKS Capability, so teams need not install or scale the controller. Positions kro as the glue that composes workloads with ACK-managed AWS resources into "cloud building blocks" with default and immutable organizational settings, and notes Argo CD (also an EKS capability) can deploy kro custom resources across clusters. Useful as evidence of vendor adoption and of the kro plus ACK plus Argo CD stack.
- Quote: "removing the need for 'glue' operators in your cluster."

### 5. Crossplane vs kro: packaging Kubernetes manifests
- URL: https://kubernetesinmyhead.net/deployment/crossplane-vs-kro/
- Title: Crossplane vs kro: packaging Kubernetes manifests
- Publisher: Kubernetes in my head (individual engineer's notes)
- Kind: Blog comparison, dated July 2026
- Summary: Side-by-side table. Crossplane: XRD plus Composition (function pipeline: patch-and-transform, KCL, Go templating, Python) plus managed resources, shipped as an OCI Configuration package pinning providers and functions; optional namespaced Claim. kro: one RGD file, CEL, inferred ordering, Kubernetes objects only, distributed through Git, Helm or Kustomize. Notes Crossplane's Upjet generates providers from Terraform providers and that kro has no equivalent. Governance: Crossplane is CNCF Incubating; kro is a Kubernetes SIG Cloud Provider subproject announced jointly by AWS, Google Cloud and Microsoft Azure in January 2025.
- Quote: "kro is markedly more compact and has no external runtime to install besides its own controller."

### 6. kro vs Crossplane vs Helm (2026): Platform APIs
- URL: https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm
- Title: kro vs Crossplane vs Helm (2026): Platform APIs
- Publisher: Coding Protocols
- Kind: Blog comparison
- Summary: Frames Helm as render-once packaging with no drift correction, kro as lightweight reconciled platform APIs from existing Kubernetes resources, and Crossplane as the control plane for external cloud infrastructure. Argues mature platforms layer all three: Helm installs components, Crossplane provisions cloud resources, kro composes developer-facing APIs. Warns kro is pre-1.0.
- Quote: "kro is pre-1.0, not marked production-ready."
- Read via a summarizing fetch tool; the raw page was too large.

### 7. Building an S3-Backed App on EKS: Comparing kro and Crossplane Composition
- URL: https://dev.to/aws-builders/building-an-s3-backed-app-on-eks-comparing-kro-and-crossplane-composition-4ed8
- Title: Building an S3-Backed App on EKS: Comparing kro and Crossplane Composition
- Publisher: AWS Builders community, DEV Community
- Kind: Hands-on tutorial and comparison
- Summary: Builds the same `StorageApp` API twice: kro RGD on top of Crossplane managed resources, and a pure Crossplane XRD plus `function-go-templating`. Outcomes were equivalent (app, S3 bucket, IAM role; data preserved on deletion; permission failures reflected in readiness). Template-based Composition needs hand-written logic for creation order and for avoiding deletion when a dependency is briefly unavailable, which kro's reference model handles more naturally.
- Quote: "make the platform-side definitions easier to read and write."
- Read via a summarizing fetch tool.

### 8. Composite Resource Definitions (Crossplane v2.4)
- URL: https://docs.crossplane.io/latest/composition/composite-resource-definitions/
- Title: Composite Resource Definitions
- Publisher: Crossplane project (CNCF)
- Kind: Official documentation
- Summary: Explains XRDs as the schema of a custom API, paired with Compositions that say how it creates resources and functions that add logic. In v2 the default scope is Namespaced (an XR can only compose resources in its namespace), with Cluster and LegacyCluster (v1-style claims) alternatives. Supports multiple API versions, one referenceable; breaking schema changes need a new XRD or conversion webhook. Useful for seeing how much more API-lifecycle machinery Crossplane exposes than kro.
- Quote: "Composite resources can use any schema version set as `served: true`."
- Read via a summarizing fetch tool.

### 9. Helm: Charts
- URL: https://helm.sh/docs/topics/charts/
- Title: Charts
- Publisher: Helm project (CNCF graduated)
- Kind: Official documentation
- Summary: Defines a chart (Chart.yaml, values.yaml, templates/, charts/ dependencies, crds/). Helm renders Go templates with values, aggregates objects and installs them as one tracked release. The abstraction surface is the values file, which is free-form and not a real API schema unless a values schema is added.
- Quote: "A chart is a collection of files that describe a related set of Kubernetes resources."
- Read via a summarizing fetch tool.

### 10. Kustomize
- URL: https://kustomize.io/
- Title: Kustomize - Kubernetes native configuration management
- Publisher: Kubernetes SIG CLI (site contributed by Replicated)
- Kind: Official project site
- Summary: Presents Kustomize as template-free customization of plain YAML (bases, overlays, patches) built into `kubectl apply -k` and integrated with Argo CD and Flux. Encourages a fork/modify/rebase workflow instead of parameterization, so there is no custom API for users. Links the origin whitepaper on declarative application management and a Lyft KubeCon talk.
- Quote: "Kustomize introduces a template-free way to customize application configuration"

### 11. Helm support: long term plan (Kustomize issue 4401)
- URL: https://github.com/kubernetes-sigs/kustomize/issues/4401
- Title: Helm support: long term plan
- Publisher: kubernetes-sigs/kustomize GitHub community
- Kind: Issue thread and design discussion
- Summary: Maintainers proposed moving Kustomize's built-in Helm inflation toward KRM functions. Users objected that KRM functions need a container runtime, which is missing on many laptops, CI runners and in Argo CD, and that private chart repository authentication has long been broken. Shows a real-world cost of the KRM function model and why render-time abstractions fight over where code runs. Support for Helm v4 arrived in kustomize v5.8.1; no deprecation date was set.
- Quote: "We require kustomize to be run on various end user devices that won't have docker installed."
- Read via a summarizing fetch tool.

### 12. kpt (KRM functions and Configuration as Data)
- URL: https://github.com/kptdev/kpt
- Title: kptdev/kpt
- Publisher: kpt project (CNCF Sandbox)
- Kind: Project repository and README
- Summary: Describes kpt as a package-centric toolchain that treats configuration as data stored apart from live state. KRM functions are idempotent programs, run in containers, that read and write lists of Kubernetes objects, in any language. This is the model Crossplane's composition functions and Kustomize's plugin system echo.
- Quote: "Configuration as Data is an approach to management of configuration which makes configuration data the source of truth"
- Read via a summarizing fetch tool.

### 13. Score
- URL: https://score.dev/
- Title: Score
- Publisher: Score project (CNCF Sandbox, originated at Humanitec)
- Kind: Official project site
- Summary: Score is a developer-centric, platform-agnostic workload spec. One `score.yaml` declares containers, ports and abstract resources (for example `type: postgres`); implementation CLIs (`score-compose`, `score-k8s`) generate Docker Compose or Kubernetes manifests, so the "how" becomes an environment detail. Aimed at cutting YAML bloat and local-versus-prod drift. It generates output rather than running a controller.
- Quote: "the 'how' becomes an environment specific implementation detail"

### 14. Radius application platform review
- URL: https://devopsboys.com/blog/radius-application-platform-kubernetes-review-2026
- Title: Radius Application Platform review (2026)
- Publisher: DevOpsBoys
- Kind: Third-party blog review
- Summary: Describes Radius as an application-definition platform (originated at Microsoft, CNCF Sandbox since 2024 per this source) where developers describe containers, databases and connections, and platform engineers supply Recipes that decide what a resource type becomes per environment. Lists strengths (connection model, dev/prod parity, dependency graph) and limits (Bicep dependency, Azure-leaning, own control plane, early maturity). The primary Radius docs page could not be read (empty scrape and 404 on retry), so claims here are secondary.
- Quote: "The developer asks for 'a Redis cache.'"

## Real-world use cases

AWS is the clearest named adopter of kro. The EKS user guide (https://docs.aws.amazon.com/eks/latest/userguide/kro.html) offers it as a managed capability to compose Deployments and Services with ACK-managed AWS resources such as S3 buckets, and pairs it with managed Argo CD to roll out platform building blocks across clusters. The kro overview (https://kro.run/docs/overview) uses the same shape: a `WebApp` API that creates a ConfigMap, an ACK `Bucket`, a Deployment and a Service, and notes Azure Service Operator and GCP Config Connector work equally well. The kubernetesinmyhead comparison (https://kubernetesinmyhead.net/deployment/crossplane-vs-kro/) records that kro was announced jointly by AWS, Google Cloud and Microsoft Azure in January 2025.

The typical Crossplane scenario is a platform team offering "a database" or "a cluster" as a single API that provisions cloud resources, with provider coverage extended by Terraform-derived Upjet providers (same comparison page). The dev.to tutorial (https://dev.to/aws-builders/building-an-s3-backed-app-on-eks-comparing-kro-and-crossplane-composition-4ed8) is a concrete example: one `StorageApp` manifest yields an app, a bucket and an IAM role.

Kustomize's own site (https://kustomize.io/) lists Lyft as a KubeCon presenter on template-free YAML and names Argo CD, Flux and Kots as integrators. Score's site (https://score.dev/) quotes testimonials from small and mid-size companies (Mineiros, Frontside Software, BAUHAUS Deutschland) using a single spec across local Docker and Kubernetes. These are vendor-site testimonials, not independent case studies. I did not find a detailed named production postmortem for kro, and the layered "Helm plus Crossplane plus kro" pattern in https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm is described as typical rather than tied to named companies.

## Pitfalls and how tools address them

Maturity and API churn. kro is v1alpha1 and may break (https://kro.run/docs/faq); the Coding Protocols comparison says outright it is not production-ready. Crossplane offers versioned XRDs, conversion webhooks, and one referenceable version (https://docs.crossplane.io/latest/composition/composite-resource-definitions/), which gives a more mature upgrade story.

Drift. Helm renders and installs once, so drift correction depends on a GitOps tool (codingprotocols link above). kro and Crossplane both run reconcile loops that restore drift; kro states this explicitly for managed children (https://kro.run/docs/concepts/rgd/instances).

Ordering, readiness and deletion. In Crossplane Compositions built from Go templates, authors must hand-code creation order and guard against deleting resources when a dependency briefly disappears (dev.to tutorial). kro infers order from CEL references, waits for not-yet-existing status values, and deletes in reverse topological order. kro avoids ordinary owner references, which cause out-of-order deletion and cannot span namespaced and cluster-scoped objects, using ApplySets instead. The cost: GitOps tools need help. Argo CD needs a tracking-id annotation plus an owner reference on templated children, with documented risks (https://kro.run/docs/faq).

Expression safety. kro chose CEL so definitions always terminate, have no side effects and are type-checked at apply time (https://kro.run/docs/overview). Crossplane's function pipeline is more expressive (Go templates, KCL, Python) and therefore easier to make complicated (kubernetesinmyhead comparison).

Where the code runs. KRM functions and Crossplane functions run as containers. Kustomize users pushed back on moving Helm inflation to KRM functions because many CI systems, laptops and Argo CD setups cannot run containers (https://github.com/kubernetes-sigs/kustomize/issues/4401). Crossplane avoids this by running functions in-cluster as gRPC services; kro avoids it by using in-process CEL.

Scope of children. kro only orchestrates Kubernetes objects and relies on ACK, ASO or Config Connector for cloud resources; Crossplane providers reach cloud APIs directly (kubernetesinmyhead comparison). Crossplane v2 namespaced XRs can only compose resources in their own namespace (XRD docs), a constraint to plan around.

Abstraction leakage. Helm values and Kustomize patches expose the underlying manifests, so users still need to understand Kubernetes. Score and Radius push the abstraction higher (workload plus abstract resource types) but add a translation or control-plane layer, and Radius is early-stage and Azure-leaning (https://devopsboys.com/blog/radius-application-platform-kubernetes-review-2026).

## Tutorial and explainer links

- https://kro.run/docs/overview: best first read for how an RGD becomes a CRD plus controller.
- https://kro.run/docs/faq: short answers on Argo CD integration, Graph versus RGD, and the checksum restart pattern.
- https://dev.to/aws-builders/building-an-s3-backed-app-on-eks-comparing-kro-and-crossplane-composition-4ed8: the same platform API built both ways, good for a worked comparison.
- https://kubernetesinmyhead.net/deployment/crossplane-vs-kro/: concise table of packaging differences.
- https://codingprotocols.com/blog/kro-vs-crossplane-vs-helm: how Helm, Crossplane and kro layer together.
- https://helm.sh/docs/topics/charts/: baseline for the render-time model.
- https://kustomize.io/: baseline for template-free overlays and links to the original whitepaper.
- https://github.com/kptdev/kpt: explains Configuration as Data and KRM functions.
- https://score.dev/: shortest path to the developer-spec idea.

## Open questions

- Crossplane's claims and composition-function status in v2: the XRD page as read did not describe claims status; the docs main concept pages (https://docs.crossplane.io/latest/concepts/compositions/) returned empty content and were not read.
- Governance: the kubernetesinmyhead page says kro is not a CNCF project and sits under SIG Cloud Provider; confirm against kro.run, which says only that it is a SIG Cloud Provider subproject.
- Radius CNCF Sandbox status and maturity come only from a third-party blog; the official Radius docs were unreadable in this run.
- Score is described as a CNCF Sandbox project on its own site; its relationship to Humanitec and to Radius-style platforms was not verified from primary documents.
- Graph (alpha) versus RGD in kro: how Graph will affect adoption and the stability of RGD is unclear.
- No named production postmortem or large-scale benchmark for kro was found; scaling limits of per-RGD dedicated controllers are not covered in the sources read.
- Gaps: no Flux, Cluster API, or Config Connector primary pages were read in this run, and the KRM function specification itself was not fetched.
