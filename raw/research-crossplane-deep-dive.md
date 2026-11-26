# Research dossier: Crossplane deep dive

Research date: 2026-11-25

Method note: web_scrape returned empty or oversized output for most pages, so every page below was read through WebFetch, which returns a model-generated extract of the page, not raw text. Quotes come from those extracts. Re-verify quotes against the live pages before publishing them. The Sixt/AWS case study could not be read (the fetch returned only navigation chrome), so it is not used.

## Overview

Crossplane is a Kubernetes add-on that turns a cluster into a control plane for things outside the cluster, and increasingly for anything that can be described as Kubernetes objects. It is a set of controllers and API extensions that follow the usual Kubernetes pattern: you declare desired state, and controllers reconcile reality toward it continuously. The "Crossplane vs Terraform" post frames the difference as always-on reconciliation with automatic drift correction, against Terraform's on-demand plan and apply with a state file.

Mechanically there are four layers. (1) Providers are packages that install CRDs for external services, such as an S3 bucket or a Cloud SQL instance, plus a controller. Each CRD instance is a "managed resource" (MR), and `spec.forProvider` is treated as the source of truth for the external object. (2) A Composite Resource Definition (XRD) defines a new platform API schema in OpenAPI v3, and Crossplane generates a CRD from it. Users create instances of it, called composite resources (XRs). (3) A Composition says what an XR is made of. In current versions it is a pipeline of composition functions, which are gRPC servers that receive observed and desired state and return a new desired state. Crossplane then applies the result with server-side apply. (4) Packages (Provider, Function, Configuration, ImageConfig) are OCI images that distribute all of this.

Crossplane v2 changed the model. XRs are namespaced by default, the old "claim" indirection is no longer needed, compositions can contain any Kubernetes resource (not only managed infrastructure), and the project added Operations for day-two tasks. Native patch-and-transform compositions, ControllerConfig and external secret stores were removed. Upgrades to v2 must start from v1.20. The project graduated in the CNCF in late 2025, which sources present as a maturity signal with 70+ public adopters.

The sources split into three camps. Official docs and CNCF material present Crossplane as a universal, API-first platform substrate. Adopter stories (JFrog, SuperOrbital's evaluation) show the self-service platform pattern, usually paired with Argo CD, and also the cost: you need strong Kubernetes skills and must design and maintain your own abstractions. Critical comparisons (Encore, SuperOrbital) stress that you must run a cluster, write Compositions, and accept ecosystem immaturity. For tutorials, introduce Crossplane as "CRDs plus controllers plus a function pipeline for building your own APIs", and teach the reconcile loop first.

## Sources

### 1. Composite Resources (Crossplane v2.4 docs)
- URL: https://docs.crossplane.io/latest/composition/composite-resources/
- Title: Composite Resources, Crossplane v2.4
- Publisher: Crossplane project / CNCF
- Kind: official documentation
- Summary: Defines an XR as a set of Kubernetes resources presented as one custom API object. It separates three roles. The XRD defines the schema and endpoint, the XR is the instance users create, and the Composition says which managed resources the XR composes. Functions in the pipeline transform data and can influence behavior such as deletion. XRs are namespace-scoped in v2, and legacy cluster-scoped XRs are still supported. Useful as the base vocabulary page for tutorials.
- Quote: "A composite resource or XR (this page) is a custom API."

### 2. Composite Resource Definitions (Crossplane v2.4 docs)
- URL: https://docs.crossplane.io/latest/composition/composite-resource-definitions/
- Title: Composite Resource Definitions, Crossplane v2.4
- Publisher: Crossplane project
- Kind: official documentation
- Summary: Explains that an XRD carries an OpenAPI v3 schema and that applying it makes Crossplane generate a matching CRD, which exposes a new API endpoint. Scope can be Namespaced (the v2 default), Cluster, or LegacyCluster for v1 compatibility. Multiple versions are supported, and each must be marked served, with only one referenceable by Compositions. The extract did not cover claims, so that part of the sources is thin.
- Quote: "Crossplane XRDs are like Kubernetes custom resource definitions."

### 3. Compositions and function pipelines (Crossplane docs, v2.5)
- URL: https://docs.crossplane.io/latest/composition/compositions/
- Title: Compositions
- Publisher: Crossplane project
- Kind: official documentation
- Summary: Describes the pipeline mechanics. On each create or update of an XR, Crossplane calls each function in order with a RunFunctionRequest holding observed state, the desired state accumulated so far, per-function input, and shared pipeline context. Each function returns a RunFunctionResponse. Functions must copy desired state forward, because omitted resources get deleted. Crossplane applies the final desired state with server-side apply. Functions can also signal readiness and request extra resources. Referencing functions by OCI digest pins versions per Composition revision for staged rollout. The extract said little about composition revisions themselves.
- Quote: "A function's main job is to update the desired state and return it to Crossplane."

### 4. Managed Resources (Crossplane v2.4 docs)
- URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/
- Title: Managed Resources
- Publisher: Crossplane project
- Kind: official documentation
- Summary: Covers the lowest layer. An MR is a Kubernetes object that represents an external resource, and its provider creates, updates, observes and deletes the real thing. Providers reconcile continuously. `managementPolicies` (beta) controls which actions are allowed (Create, Delete, Update, Observe, LateInitialize), which replaces the older deletionPolicy as a way to avoid accidental destruction or to import existing resources. Activation policies are mentioned but not explained in the extract.
- Quote: "Crossplane considers the forProvider field of a managed resource the 'source of truth' for external resources."

### 5. Packages overview (Crossplane docs)
- URL: https://docs.crossplane.io/latest/packages/
- Title: Packages
- Publisher: Crossplane project
- Kind: official documentation
- Summary: Lists four package types: Providers (connect to external APIs), Functions (new ways to express composition), Configurations (portable bundles of XRDs, Compositions and dependencies), and Image Configs (central control of package image settings). The extract gave no detail on dependency resolution, revisions or upgrade policy, so that detail needs another source.
- Quote: "Extend Crossplane with packages"

### 6. Upgrade to Crossplane v2 (docs)
- URL: https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/
- Title: Upgrade to Crossplane v2
- Publisher: Crossplane project
- Kind: official upgrade guide
- Summary: The most direct "what breaks" list. Native patch-and-transform (`mode: Resources`) is gone and must move to functions. ControllerConfig is replaced by DeploymentRuntimeConfig. The alpha external secret stores are removed. XRs lose native connection details, so teams recreate them as composed Secrets. The `--registry` flag is removed, so packages need fully qualified names. The path is to reach v1.20, fix deprecations (a CLI converter helps), upgrade core with Helm, optionally set managed resource activation policies, then upgrade providers.
- Quote: "Only upgrade to Crossplane v2 from Crossplane `v1.20`, the final `v1.x` release."

### 7. Announcing Crossplane's CNCF Graduation
- URL: https://blog.crossplane.io/crossplane-cncf-graduation/
- Title: Announcing Crossplane's CNCF Graduation
- Publisher: Crossplane project blog
- Kind: project announcement
- Summary: Gives history (created by Upbound, CNCF Sandbox in 2020) and adoption claims: 70+ public adopters including Nike, Nokia, Grafana, NASA Science Cloud, Elastic, Akamai, SAP and IBM, plus 3,000+ contributors from 480+ companies. Self-reported, so treat the numbers as marketing-grade.
- Quote: "Graduation represents the highest level of maturity in the CNCF and signals that Crossplane is stable, reliable, and broadly deployed."

### 8. Crossplane Reaches Production Maturity by Graduating CNCF
- URL: https://www.infoq.com/news/2025/11/crossplane-grad/
- Title: Crossplane Reaches Production Maturity by Graduating CNCF
- Publisher: InfoQ
- Kind: independent news coverage
- Summary: Independent confirmation of graduation. It names Nike, Autodesk, NASA Science Cloud, Elastic, SAP, IBM and Nokia as users and says the dominant pattern is Crossplane as the backbone of internal developer platforms. Mentions the security audit and vendor-neutral governance requirements. The contributor and company figures differ slightly from the project's own post (450 vs 480 companies).
- Quote: "Crossplane extends the Kubernetes API so infrastructure can be described and managed the same way teams handle workloads."

### 9. Crossplane vs Terraform
- URL: https://blog.crossplane.io/crossplane-vs-terraform/
- Title: Crossplane vs Terraform
- Publisher: Crossplane project blog
- Kind: vendor-side comparison
- Summary: Contrasts always-on reconciliation and drift correction with Terraform's manual or CI-triggered plan and apply. It says each resource is an independent API endpoint, with no shared state-file lock, and that Kubernetes RBAC gives granular access control. It concedes that Terraform is simpler and more familiar, and that Crossplane requires Kubernetes expertise. The source is the project's own, so read it as advocacy.
- Quote: "Crossplane is a control plane, where Terraform is a command-line tool — an interface to control planes."

### 10. Crossplane Alternatives (Encore)
- URL: https://encore.dev/articles/crossplane-alternatives
- Title: Crossplane Alternatives: Terraform, Pulumi, CDK, and More (2026)
- Publisher: Encore
- Kind: competitor blog, critical view
- Summary: Lists drawbacks and substitutes: Terraform/OpenTofu, Pulumi, AWS CDK, single-cloud operators (Config Connector, ACK, Azure Service Operator) and Encore itself. Its main criticisms are the need for a hosting cluster and the authoring overhead of Compositions. The publisher sells a competing product, so weigh the bias, but the single-cloud-operator framing is useful for tool-comparison pages.
- Quote: "Crossplane needs a running Kubernetes cluster as its control plane, even when the resources it provisions have nothing to do with Kubernetes."

### 11. Scaling Kubernetes to Thousands of CRDs
- URL: https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds
- Title: Scaling Kubernetes to Thousands of CRDs
- Publisher: Upbound
- Kind: engineering blog
- Summary: Explains why large provider packages hurt clusters. Clients make hundreds of discovery requests and get throttled. The API server computes OpenAPI schemas expensively on each CRD change. Memory reaches roughly 4 MiB per CRD. Upstream mitigations included higher kubectl discovery rate limits, cheaper client caching, lazy OpenAPI computation and shared etcd clients and loggers. This explains why v2 offers managed resource activation policies, which install only the CRDs you need. The post itself is about upstream Kubernetes fixes and does not detail activation policies.
- Quote: "Each time a CRD was added or updated the API server was doing serialization work increasingly expensive."

### 12. How JFrog delivers self-service cloud environments
- URL: https://jfrog.com/blog/how-jfrog-delivers-self-service-cloud-environments-for-our-developers/
- Title: JFrog uses Crossplane to Automate Cloud Development Infrastructure
- Publisher: JFrog (organizational authorship)
- Kind: adopter case study
- Summary: Developers request resources through a Jenkins-based interface, which writes custom resources into Git. Argo CD applies them and Crossplane provisions the cloud resources. Predefined size classes (small, medium, large) prevent over-provisioning, tagging by owner and expiry supports cost cleanup, and RBAC plus templates provide governance. The post lists no pitfalls, so it is an unqualified success story.
- Quote: "Developers no longer have to wait for approval or depend on other teams to create environments."

### 13. Crossplane Case Study (SuperOrbital)
- URL: https://superorbital.io/blog/crossplane-2022/
- Title: Crossplane Case Study
- Publisher: SuperOrbital (Sean Kane)
- Kind: consultancy evaluation, dated 2022
- Summary: A sober evaluation of an early Crossplane. Listed problems: sparse documentation, uneven provider coverage (native providers versus Terrajet-generated ones), mostly alpha or beta APIs, no dry-run, and hard multi-layer troubleshooting. Concludes that the effort is large and needs deep Kubernetes skill. Several of these gaps have been addressed since (functions, graduation), so tutorials should present it as historical context.
- Quote: "Adopting it today is similar to adopting Docker in 2013."

### 14. Crossplane v2: API-first platforms and compositional control planes
- URL: https://www.polarpoint.io/blog/2026/03/25/crossplane-v2-api-first-platforms-and-compositional-control-planes/
- Title: Crossplane v2: API-first platforms and compositional control planes
- Publisher: Polarpoint (Surjit Bains)
- Kind: practitioner blog
- Summary: Argues for several small, domain-scoped control planes over one monolithic Crossplane instance. Design advice: model APIs by infrastructure domain, not by cloud provider. Invest in observability (status conditions, events) before rollout. Start with small Compositions, not mega-Compositions. Design for users' mental models. Opinion, not primary documentation.
- Quote: "Teams no longer need a single monolithic Crossplane instance"

### 15. Crossplane and AI: the case for API-first infrastructure
- URL: https://www.cncf.io/blog/2026/03/20/crossplane-and-ai-the-case-for-api-first-infrastructure/
- Title: Crossplane and AI: The case for API-first infrastructure
- Publisher: CNCF blog (Ana Margarita Medina)
- Kind: community blog
- Summary: Pitches declarative control planes as the right interface for AI agents. States that v2 compositions can include any Kubernetes resource, so a single composite API can provision infrastructure, deploy apps, configure networking and set up observability. Introduces Operations for scheduled day-two work. Useful for the "where Crossplane is heading" section, but it is forward-looking advocacy.
- Quote: "Controllers handle mechanics, while agents focus on higher-level reasoning"

## Real-world use cases

The CNCF graduation material names Nike, Nokia, Grafana, NASA Science Cloud, Elastic, Akamai, SAP, IBM and Autodesk as public adopters (https://blog.crossplane.io/crossplane-cncf-graduation/, https://www.infoq.com/news/2025/11/crossplane-grad/). InfoQ says the dominant pattern is Crossplane as the backbone of an internal developer platform. Neither source describes any specific adopter's design, so detailed per-company stories need other sources.

JFrog is the best-documented concrete example here. A Jenkins front end writes custom resources to Git, Argo CD syncs them, and Crossplane creates cloud environments. Size classes and expiry tags keep cost and sprawl in check (https://jfrog.com/blog/how-jfrog-delivers-self-service-cloud-environments-for-our-developers/). The typical scenario is a platform team publishing an XRD such as a "database" or "environment" API with a few safe knobs, while Compositions hide the cloud-specific details.

Polarpoint and CNCF's AI post describe emerging scenarios: domain-scoped control planes, whole-application composites that mix cloud resources with in-cluster workloads, and agent-driven operations (https://www.polarpoint.io/blog/2026/03/25/crossplane-v2-api-first-platforms-and-compositional-control-planes/, https://www.cncf.io/blog/2026/03/20/crossplane-and-ai-the-case-for-api-first-infrastructure/). These are prescriptive and not evidence of deployments.

## Pitfalls and how tools address them

Upgrade churn is the first pitfall. v2 removed native patch-and-transform, ControllerConfig, external secret stores and XR connection details, and requires starting from v1.20 (https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/). Mitigation: use the conversion CLI, pin package versions, and stage rollouts using Composition revisions pinned by function digest (https://docs.crossplane.io/latest/composition/compositions/).

Function authoring mistakes are the second pitfall. Functions must carry forward all desired state, because a resource omitted from the response is deleted (https://docs.crossplane.io/latest/composition/compositions/). Tutorials should show this explicitly, since it differs from template-style tools such as Helm.

CRD scale is the third pitfall. Big provider packages install thousands of CRDs, which stress API server memory and CPU and slow client discovery (https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds). Upstream Kubernetes added fixes, and Crossplane v2 adds optional managed resource activation policies to install only needed CRDs (named in the upgrade guide; the mechanism is not explained in the sources read).

Accidental deletion and adoption of existing infrastructure are the fourth. `managementPolicies` lets you drop Delete or use Observe-only (https://docs.crossplane.io/latest/managed-resources/managed-resources/). Compare: Terraform has its own state and plan review (https://blog.crossplane.io/crossplane-vs-terraform/), while Config Connector, ACK and ASO are single-cloud operators with simpler but narrower models (https://encore.dev/articles/crossplane-alternatives). I did not read primary documentation for those three, so deletion-policy details for them need further research.

Organizational and design pitfalls: the platform team must own abstractions, observability and troubleshooting across layers (https://superorbital.io/blog/crossplane-2022/). Oversized Compositions and cloud-shaped APIs hurt users (https://www.polarpoint.io/blog/2026/03/25/crossplane-v2-api-first-platforms-and-compositional-control-planes/). The need for a hosting cluster is a real cost for teams that do not already run Kubernetes (https://encore.dev/articles/crossplane-alternatives). With Argo CD, the JFrog pattern keeps Git as the source and Crossplane as the reconciler, so Argo CD sees XRs, not each cloud resource (https://jfrog.com/blog/how-jfrog-delivers-self-service-cloud-environments-for-our-developers/). Flux, kro, Cluster API and plain controllers were not covered by any source read for this dossier.

## Tutorial and explainer links

- https://docs.crossplane.io/latest/composition/composite-resources/ : best first read for the XR / XRD / Composition vocabulary.
- https://docs.crossplane.io/latest/composition/compositions/ : the function pipeline request and response model.
- https://docs.crossplane.io/latest/managed-resources/managed-resources/ : the provider reconcile loop and management policies.
- https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/ : a checklist that doubles as a map of what changed.
- https://blog.crossplane.io/crossplane-vs-terraform/ : the shortest conceptual contrast with imperative IaC.
- https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds : why CRD count matters, good for API-machinery readers.
- https://jfrog.com/blog/how-jfrog-delivers-self-service-cloud-environments-for-our-developers/ : a simple end-to-end self-service story.
- Search results also listed https://ditwrd.dev/posts/crossplane-composition/ ("Composition is not templating") and https://devopstoolkit.live/crossplane/index.html, but neither could be fetched or read, so they are unverified.

## Open questions

- Claims: the sources read do not say clearly whether v2 removes claims or merely makes them optional. Verify in the v2 release notes or the XRD docs.
- Managed resource activation policies are named but not explained. Need a primary page for the exact behavior and defaults.
- Package dependency resolution, revision activation and upgrade policies were not covered by the packages page extract.
- Operations (day-two) are described only in a CNCF community blog. Check the official docs for maturity and API stability.
- Adopter counts differ slightly between sources (450 vs 480 companies), and all are self-reported.
- Missing material: Upbound product details (UXP, Spaces), the Sixt/AWS EKS case study (unreadable here), Crossplane versus Config Connector/ACK/kro/Cluster API from primary sources, Flux-based GitOps integration, source-code or design-doc walkthroughs, and postmortems. No postmortems were found.
- The official docs pages were read via a summarizing fetch, so exact field names and versions should be checked against the live pages.
