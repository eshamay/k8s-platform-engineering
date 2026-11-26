# Research dossier: Providers

Research date: 2026-11-25

## Overview

A "provider" in the Kubernetes platform-engineering sense is the piece of software that teaches a cluster how to manage something outside the cluster, usually a cloud service. It pairs two things: CustomResourceDefinitions that describe the external resource as a Kubernetes API, and a controller that watches those objects and calls the external API to make reality match. The user writes YAML such as an S3 bucket or a database. The controller runs the usual observe, compare, act loop. Every source in this dossier shares that mental model, which is the same controller pattern used for Deployments, applied to resources that live outside the cluster.

The tools differ in how they package that idea. Crossplane makes the provider a first-class installable package. A Provider object pulls an OCI image, the package manager installs its CRDs and runs its controller pod, and a ProviderConfig tells it which credentials to use. Crossplane layers a composition system on top so platform teams can publish simpler APIs. ACK (AWS), Config Connector (Google Cloud) and Azure Service Operator are cloud-vendor add-ons. They expose cloud resources close to one-to-one and have no built-in composition layer. Cluster API uses "provider" for a different job: infrastructure, bootstrap and control-plane providers that follow a published contract so the core can build whole clusters.

Most of the large provider catalogs are generated, not hand-written. Upjet generates Crossplane providers from Terraform providers. ACK generates controllers from AWS API models. ASO generates CRDs from Azure Resource Manager schemas. Generation gives broad coverage cheaply but produces very large API surfaces. That led directly to the best-known operational problem in this area: provider-aws once installed more than 900 CRDs, which destabilised control planes. Crossplane's answer was provider families, which split one monolith into per-service providers sharing a common config.

The sources frame the operational risks consistently. Deleting a provider or a managed resource can orphan or destroy real infrastructure. Reconciliation will revert out-of-band changes. Controllers run with broad cloud credentials, so whoever can create the Kubernetes object effectively gets the controller's cloud permissions. Adoption and import features, deletion and management policies, and namespaced credential mapping are the main levers for managing those risks.

## Sources

### 1. Crossplane Providers (docs, latest)
- URL: https://docs.crossplane.io/latest/packages/providers/
- Title: Providers (Crossplane v2.4 docs)
- Publisher: Crossplane project / CNCF
- Kind: Official documentation
- Summary: Explains that providers create new Kubernetes APIs mapped to external APIs and own authentication, API calls and controller logic. A Provider object installs a package; each upgrade creates a ProviderRevision, and old revisions keep deprecated CRDs around (default one inactive revision, set by revisionHistoryLimit). ProviderConfig and ClusterProviderConfig define credentials, so one cluster can target several accounts, and managed resources default to a ClusterProviderConfig named "default". Install policies cover pull policy, revision activation (automatic or manual) and pull secrets. DeploymentRuntimeConfig customises the provider pod. Unmet dependencies show HEALTHY False, automatic dependency downgrades are off by default because of orphan risk, and an alpha provider-deletion-protection feature blocks removal while managed resources exist. Useful as the canonical mechanical description. Content was summarised by the fetch tool; the full page was too large to read raw.
- Quote: "Removing a Provider without first removing the Provider's managed resources may abandon the resources."

### 2. Crossplane Managed Resources (v1.20)
- URL: https://docs.crossplane.io/v1.20/concepts/managed-resources/
- Title: Managed Resources
- Publisher: Crossplane project
- Kind: Official documentation
- Summary: Defines a managed resource (MR) as the Kubernetes object that represents one external resource. spec.forProvider is the source of truth, so external edits are reverted. Covers the crossplane.io/external-name annotation, deletionPolicy (Delete or Orphan), managementPolicies (Create, Update, Delete, Observe, LateInitialize) for partial control, and the Observe-only pattern for importing existing infrastructure. Status uses Ready and Synced conditions. Pitfalls listed: immutable fields need recreation, paused resources cannot be deleted, and a provider crash between create and saving the external name can leak resources. Essential for explaining what a provider actually produces.
- Quote: "Crossplane considers the `forProvider` field of a managed resource the 'source of truth' for external resources."

### 3. Upjet: generating a provider
- URL: https://github.com/crossplane/upjet/blob/main/docs/generating-a-provider.md
- Title: Generating a Provider (upjet docs)
- Publisher: Crossplane project (GitHub)
- Kind: Design and how-to documentation
- Summary: Walks through producing a Crossplane provider from a Terraform provider. You set the Terraform provider source, repo and version in the Makefile, define ExternalNameConfigs that say how each resource is identified and imported, add per-resource customisations, and run make generate to emit CRDs, types and controllers. External-name configuration is required before a resource is generated. Useful for showing that "writing a provider" can mean configuring a generator, not hand-coding controllers.
- Quote: "Only generate resources with an external name configuration defined."

### 4. Upjet repository
- URL: https://github.com/crossplane/upjet
- Title: Upjet: generate Crossplane providers from any Terraform provider
- Publisher: Crossplane project (GitHub)
- Kind: Source repository and README
- Summary: Describes Upjet as a code-generation framework with two phases. At build time it reads Terraform schemas and generates Go types and controllers. At runtime the controllers reuse Terraform's resource logic while users see only a Kubernetes API. The page says it underpins the official AWS, Azure and GCP Crossplane providers plus many community ones (Grafana, GitHub). Star and commit counts quoted by the fetch tool are not stable and should not be reused. Good for the "why do providers share behaviour and bugs" story.
- Quote: "Upjet bridges the gap between Terraform's vast provider ecosystem and Kubernetes-native infrastructure management." (paraphrase by the fetch summariser; verify against the live README before quoting)

### 5. Solving the Crossplane Provider CRD Scaling Problem with Provider Families
- URL: https://blog.crossplane.io/crd-scaling-provider-families/
- Title: Solving the Crossplane Provider CRD Scaling Problem with Provider Families
- Publisher: Crossplane blog
- Kind: Engineering blog / design rationale
- Summary: Documents why provider-aws alone installing more than 900 CRDs made the API server unresponsive, sometimes for up to an hour during scale-up. The fix was scoped providers grouped into families, so operators install only the services they use. The authors chose it because it needed no new user concept, gave fewer CRDs by default and allowed easy migration from monoliths. They note it also depended on upstream Kubernetes improvements and ecosystem adoption. The single most useful source for explaining provider families.
- Quote: "Crossplane, on the other hand, frequently installs multiple hundreds of CRDs or even thousands in some cases."

### 6. Crossplane vs Cloud Provider Infrastructure Addons
- URL: https://blog.crossplane.io/crossplane-vs-cloud-infrastructure-addons/
- Title: Crossplane vs Cloud Provider Infrastructure Addons
- Publisher: Crossplane blog
- Kind: Comparison / opinion from a project maintainer (vendor-adjacent, so treat as positioning)
- Summary: Groups Crossplane, ACK, Config Connector and Azure Service Operator as tools that expose cloud APIs as custom resources. Argues Crossplane's difference is Composition: platform teams bundle many managed resources into composite resources with a simpler developer-facing API, whereas the cloud add-ons expose resources one-to-one.
- Quote: "The Crossplane community believes that the typical developer using Kubernetes to deploy their application shouldn't have to deal with low level infrastructure APIs."

### 7. Crossplane provider development guide
- URL: https://github.com/crossplane/crossplane/blob/main/contributing/guide-provider-development.md
- Title: Provider development guide
- Publisher: Crossplane project (GitHub)
- Kind: Contributor guide / source walkthrough
- Summary: Shows how a hand-written provider is built. You define Spec and Status types embedding crossplane-runtime's ResourceSpec and ResourceStatus, implement an ExternalClient with Observe, Create, Update and Delete, wrap it with managed.NewReconciler, and register controllers with the manager. Pitfalls: report non-existence from Observe as ResourceExists false and not as an error, ignore expected already-exists and not-found errors, keep parameter structs faithful to the external API, and document fields because user docs are generated from GoDoc. Gives the mechanical heart of a provider for readers who want the controller internals.
- Quote: "A controller is an endless loop that observes the desired state, observes the actual state, and tries to make the actual state match the desired state."

### 8. ACK concepts (Amazon EKS user guide)
- URL: https://docs.aws.amazon.com/eks/latest/userguide/ack-concepts.html
- Title: ACK concepts
- Publisher: Amazon Web Services
- Kind: Official documentation
- Summary: Read in full. Covers the reconciliation loop, with immediate reconcile on spec change and a 10-hour periodic resync for passive drift detection. Lists status conditions (Ready, ACK.ResourceSynced, ACK.Terminal, ACK.Recoverable, ACK.Adopted, ACK.ReferencesResolved, ACK.IAMRoleSelected). Deletion policy defaults to delete, with a retain annotation. Adoption brings existing AWS resources under management through an adoption-policy annotation (adopt, or adopt-or-create). Region can be set per resource or per namespace, and IAMRoleSelector maps namespaces to IAM roles for cross-account use. Cross-namespace references are off by default and are explicitly not a tenant isolation control. Retries use exponential backoff and permanent errors do not retry. It also points to kro for composing ACK resources. The richest single source for how a vendor controller family behaves.
- Quote: "ACK manages AWS resources through Kubernetes APIs by continuously reconciling the desired state in your manifests with the actual state in AWS." (paraphrased closely; opening sentence of the page)

### 9. ACK community overview
- URL: https://aws-controllers-k8s.github.io/community/docs/community/overview/
- Title: Overview, ACK
- Publisher: AWS Controllers for Kubernetes community
- Kind: Official project documentation
- Summary: States the architecture: one controller per AWS service, each packaged as its own container image so versions and deployment are independent, with controllers generated from AWS API specifications. Lists services such as RDS, S3, Lambda, SQS, EC2, SageMaker and EventBridge, and describes alpha-to-GA maturity phases with a deprecation policy. Useful contrast to Crossplane families: ACK was per-service from the start.
- Quote: "AWS Controllers for Kubernetes (ACK) lets you define and use AWS service resources directly from Kubernetes."

### 10. Config Connector overview
- URL: https://docs.cloud.google.com/config-connector/docs/overview
- Title: Config Connector overview
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Read in full. Config Connector is an open source add-on supplying CRDs and controllers for Google Cloud resources. It brings RBAC, events and eventual consistency via loosely coupled dependencies. Key security point: reconciliation runs as the Config Connector IAM service account, not the human who applied the manifest, so permission to create the Kubernetes object is effectively permission to change cloud resources. Google recommends having a controller apply manifests from a trusted repository. It supports acquiring existing resources and Secrets for sensitive values.
- Quote: "reconciles the configured state against Google Cloud APIs asynchronously" (short phrase from the page)

### 11. Config Connector best practices
- URL: https://docs.cloud.google.com/config-connector/docs/best-practices
- Title: Best practices for Config Connector
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Recommends namespaced mode so different namespaces bind to different Google service accounts and projects, which spreads API quota instead of exhausting one quota project in cluster mode. Describes the abandon deletion policy and acquire workflow for moving resources between projects or namespaces without deleting them. Warns about data loss when recreating stateful resources.
- Quote: "Deleting resources can cause data loss with some types of resources, such as SpannerInstance or BigtableTable resources." (as returned by the fetch summariser)

### 12. Config Connector reconciliation
- URL: https://docs.cloud.google.com/config-connector/docs/concepts/reconciliation
- Title: Reconcile resources
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Explains periodic reconciliation, dependency waiting (a subscription waits for its topic), and three controller kinds: direct, Terraform-based and DCL-based. Terraform and DCL controllers use a default 2-minute maximum backoff; direct controllers allow tuning. Drift correction can be disabled with the reconcile-interval-in-seconds annotation set to 0. Notable because it shows a vendor tool also reusing Terraform internals, much like Upjet.
- Quote: "Config Connector waits until the topic is created before creating the associated subscription."

### 13. Azure Service Operator v2
- URL: https://azure.github.io/azure-service-operator/
- Title: Azure Service Operator
- Publisher: Microsoft / Azure
- Kind: Official documentation
- Summary: ASO v2 manages 150+ Azure resources, with CRDs generated from Azure Resource Manager schemas so coverage tracks Azure. Uses ownership references for Azure lifecycle relationships. The page mentions Crossplane only as a code-generation target and gives no comparison, so do not infer one.
- Quote: "ASO allows you to deploy and maintain a wide variety of Azure Resources using the Kubernetes tooling you already know and use."

### 14. Cluster API provider contracts
- URL: https://cluster-api.sigs.k8s.io/developer/providers/contracts/overview
- Title: Provider contracts, The Cluster API Book
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: Official architecture documentation
- Summary: Defines the provider types in Cluster API: infrastructure (clusters, machines, machine pools), bootstrap, control plane, IPAM and addon providers. Each implements agreed CRD fields and behaviours (the contract) so the core controllers stay generic. A different meaning of "provider" from Crossplane: the contract is a small interface for cluster building, not a catalog of every cloud service.
- Quote: "The Cluster API contract defines a set of rules a provider is expected to comply with in order to interact with Cluster API."

## Real-world use cases

Platform teams use Crossplane providers (source 1, 6) to give application developers a small self-service API, such as a "database" claim, while the provider-aws or provider-gcp managed resources behind it create the actual instances, subnets and IAM objects. The Crossplane blog presents this composition layer as the reason to choose it over vendor add-ons.

Upjet-generated providers (sources 3, 4) cover the official AWS, Azure and GCP providers and community providers for SaaS targets such as GitHub and Grafana, so teams manage repositories or dashboards with the same workflow as cloud infrastructure.

ACK (sources 8, 9) is used on Amazon EKS to manage S3, RDS, SQS and similar services from manifests. AWS documents composing ACK resources with kro (source 8). Adoption is the standard migration route for resources first created in CloudFormation or Terraform.

Config Connector (sources 10 to 12) fits Google Cloud shops that want one Kubernetes-based config pipeline, with namespaces mapped to projects for quota and access separation. Azure Service Operator (source 13) fills the same role for Azure.

Cluster API (source 14) is the typical use for lifecycle of whole Kubernetes clusters, with infrastructure providers for AWS, Azure, vSphere and others behind one contract.

I did not find named end-user case studies with production figures in this pass; the Crossplane production-story search failed with a 503. The use cases above are typical scenarios drawn from vendor documentation, not named customer reports.

## Pitfalls and how tools address them

CRD explosion. Generated providers can install hundreds or thousands of CRDs, straining the API server and slowing startup (source 5). Crossplane splits providers into families; ACK ships one controller per service (source 9); Crossplane's provider docs also warn that undersized API servers struggle (source 1). Installing only needed services is the practical rule.

Orphaned or destroyed infrastructure. Removing a Crossplane Provider before its managed resources abandons them (source 1), and an alpha deletion-protection feature blocks that. deletionPolicy Orphan, ACK's retain annotation (source 8) and Config Connector's abandon policy (source 11) keep cloud resources when the Kubernetes object goes away. Config Connector warns specifically about stateful resources such as Spanner.

Drift and out-of-band changes. Crossplane reverts external edits to match forProvider (source 2). ACK resyncs every 10 hours by default (source 8). Config Connector lets you set the reconcile interval, including turning drift correction off (source 12). Crossplane managementPolicies such as Observe let you watch without writing (source 2).

Adopting existing resources. Crossplane uses external-name plus Observe; ACK uses adoption-policy annotations and needs read permission; Config Connector uses acquire (sources 2, 8, 10). Immutable fields and leaked resources after a crash between create and annotation save are Crossplane caveats (source 2).

Credential blast radius. Controllers run with their own cloud identity, so anyone who can create the object can cause cloud changes (source 10). Mitigations in the sources: ProviderConfig per account (source 1), ACK IAMRoleSelector mapped to namespaces (source 8), Config Connector namespaced mode with separate service accounts (source 11), and applying manifests only from a trusted repo through GitOps. ACK states plainly that disabling cross-namespace references is not tenant isolation.

Upgrades and dependencies. Crossplane keeps ProviderRevisions, supports manual revision activation and refuses dependency downgrades by default (source 1). ACK has alpha-to-GA maturity levels and a deprecation policy (source 9).

Hand-written provider bugs. The development guide warns against treating "not found" in Observe as an error and against loose parameter structs (source 7). Generation reduces but does not remove this class of bug.

How GitOps tools interact is only lightly covered by these sources. Config Connector mentions GitOps and the trusted-repo model (sources 10, 11); no source here deeply compares Flux or Argo CD health checks, pruning and provider-managed resources.

## Tutorial and explainer links

- https://docs.crossplane.io/latest/packages/providers/ : best starting point for what installing a provider does.
- https://docs.crossplane.io/v1.20/concepts/managed-resources/ : the clearest explanation of the object a provider produces and its safety knobs.
- https://blog.crossplane.io/crd-scaling-provider-families/ : short story of why families exist.
- https://blog.crossplane.io/crossplane-vs-cloud-infrastructure-addons/ : quick map of Crossplane vs ACK, Config Connector and ASO.
- https://docs.aws.amazon.com/eks/latest/userguide/ack-concepts.html : the most complete worked tour of a vendor controller, with YAML.
- https://docs.cloud.google.com/config-connector/docs/overview : short, readable overview with the security model.
- https://github.com/crossplane/crossplane/blob/main/contributing/guide-provider-development.md : for readers who want to see the controller loop inside a provider.
- https://cluster-api.sigs.k8s.io/developer/providers/contracts/overview : explains the contract-based provider idea.

## Open questions

- Crossplane v2 changed namespacing and introduced ClusterProviderConfig; the v1.20 managed-resource page and the latest providers page may differ in details such as scope and defaults. Writers should confirm which version they target.
- Upjet runtime: the repo summary says controllers reuse Terraform logic, but how that runs (CLI subprocess versus in-process) was not confirmed in what I read, and the sources do not cover performance or memory cost.
- ACK resync is stated as 10 hours on the EKS managed capability page; the self-managed default may differ. Not verified.
- Config Connector lists Terraform, DCL and direct controllers; the sources do not say which resources use which, or the direction of travel.
- No source here gives named customer case studies, quantified production results or a postmortem. The Medium, Pulumi comparison, Stack Overflow "Crossplane vs ACK" and Upbound marketplace pages surfaced in search but were not read (Stack Overflow fetch is blocked, others not attempted).
- The AWS ACK announcement blog could not be read (fetch returned only site navigation).
- How Flux, Argo CD and kro treat provider-managed resources (health, pruning, ordering, deletion) is not covered; a follow-up pass on Flux and Argo CD docs is needed.
- Source 4's quote is a summariser's wording and source 8's and 10's are close paraphrases; verify against the live pages before publishing as verbatim.
