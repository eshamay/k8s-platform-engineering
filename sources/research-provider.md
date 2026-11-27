---
title: "Research dossier: Providers"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [provider, crossplane, ack, config-connector, upjet, cluster-api, research-dossier]
---

# Research dossier: Providers

> [!NOTE]
> **Raw file:** `raw/research-provider.md` (sha256 prefix 7e43edcd71be)<br>
> **Kind:** Research dossier summarizing 14 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Several pages were read through summarizing fetches, so wording is paraphrased. The quotes for Upjet, ACK, and Config Connector are close paraphrases or short phrases and should be checked against the live pages before they are reused as verbatim text. The dossier found no named customer case studies, and the Crossplane production-story search failed.

## Summary

The dossier defines a provider as the software that teaches a cluster to manage something outside the cluster, usually a cloud service. A provider pairs CustomResourceDefinitions that describe the external resource with a controller that watches those objects and calls the external API to make reality match. This is the same observe, compare, act loop used for Deployments, applied to resources outside the cluster.

The tools package that idea differently. Crossplane makes the provider an installable OCI package, with a ProviderConfig for credentials and a composition layer on top. ACK, Config Connector, and Azure Service Operator are cloud-vendor add-ons that expose cloud resources close to one-to-one with no built-in composition. Cluster API uses the word for a different job, a contract that infrastructure, bootstrap, and control-plane implementations follow so the core can build whole clusters.

Most large provider catalogs are generated. Upjet generates Crossplane providers from Terraform providers, ACK generates controllers from AWS API models, and Azure Service Operator generates CRDs from Azure Resource Manager schemas. Generation gives broad coverage cheaply and also produces very large API surfaces, which led to provider-aws once installing more than 900 CRDs and to Crossplane's provider families. The operational risks the dossier lists are orphaned or destroyed infrastructure on deletion, reversion of out-of-band changes, and the credential blast radius of a controller that holds broad cloud permissions.

## Key claims

### Crossplane providers and managed resources

- A provider creates new Kubernetes APIs mapped to external APIs and owns authentication, API calls, and controller logic (https://docs.crossplane.io/latest/packages/providers/). See [concepts/provider](../concepts/provider.md).
- A Crossplane `Provider` object installs a package, and each upgrade creates a `ProviderRevision`. Old revisions keep deprecated CRDs around, and by default one inactive revision is kept, controlled by `revisionHistoryLimit`. See [findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades](../findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades.md).
- `ProviderConfig` and `ClusterProviderConfig` define credentials, so one cluster can target several accounts. Managed resources default to a `ClusterProviderConfig` named `default`. See [decisions/scope-provider-credentials-per-namespace-or-cluster-wide](../decisions/scope-provider-credentials-per-namespace-or-cluster-wide.md).
- Install policies cover pull policy, revision activation (automatic or manual), and pull secrets, and `DeploymentRuntimeConfig` customizes the provider pod.
- Unmet provider dependencies show `HEALTHY` as `False`, and automatic dependency downgrades are off by default because of orphan risk.
- An alpha provider-deletion-protection feature blocks removal of a provider while managed resources exist. The page states that "Removing a Provider without first removing the Provider's managed resources may abandon the resources." See [findings/removing-a-crossplane-provider-before-its-managed-resources-abandons-the-cloud-resources](../findings/removing-a-crossplane-provider-before-its-managed-resources-abandons-the-cloud-resources.md).
- The fetch of the providers page was summarized because the page was too large to read raw.
- A managed resource is the Kubernetes object that represents one external resource, and `spec.forProvider` is the "source of truth," so external edits are reverted (https://docs.crossplane.io/v1.20/concepts/managed-resources/). See [concepts/managed-resource](../concepts/managed-resource.md).
- Managed resources support the `crossplane.io/external-name` annotation, `deletionPolicy` (`Delete` or `Orphan`), and `managementPolicies` (`Create`, `Update`, `Delete`, `Observe`, `LateInitialize`) for partial control, with an Observe-only pattern for importing existing infrastructure. Status uses `Ready` and `Synced` conditions.
- The managed resources page lists these pitfalls: immutable fields need recreation, paused resources cannot be deleted, and a provider crash between create and saving the external name can leak resources.
- The Crossplane provider development guide (https://github.com/crossplane/crossplane/blob/main/contributing/guide-provider-development.md) shows a hand-written provider built from Spec and Status types that embed crossplane-runtime's `ResourceSpec` and `ResourceStatus`, an `ExternalClient` with Observe, Create, Update, and Delete, `managed.NewReconciler`, and controller registration with the manager. See [examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler](../examples/provider-authors-implement-an-external-client-behind-the-shared-managed-reconciler.md).
- The guide warns to report non-existence from Observe as `ResourceExists: false` and not as an error, to ignore expected already-exists and not-found errors, to keep parameter structs faithful to the external API, and to document fields because user docs are generated from GoDoc. See [findings/hand-written-providers-that-treat-not-found-as-an-error-break-the-create-flow](../findings/hand-written-providers-that-treat-not-found-as-an-error-break-the-create-flow.md).

### Generation and provider families

- Upjet is a code-generation framework with a build phase that reads Terraform schemas to generate Go types and controllers, and a runtime phase where the controllers reuse Terraform's resource logic while users see only a Kubernetes API (https://github.com/crossplane/upjet). See [entities/upjet](../entities/upjet.md).
- The Upjet generation guide (https://github.com/crossplane/upjet/blob/main/docs/generating-a-provider.md) says to set the Terraform provider source, repo, and version in the Makefile, define `ExternalNameConfig` entries for how each resource is identified and imported, add per-resource customizations, and run `make generate`. Only resources with an external name configuration are generated. See [examples/upjet-generates-crossplane-providers-from-terraform-providers](../examples/upjet-generates-crossplane-providers-from-terraform-providers.md).
- Upjet underpins the official AWS, Azure, and GCP Crossplane providers and many community providers such as Grafana and GitHub. Star and commit counts quoted by the fetch tool are unstable and are not recorded here.
- provider-aws alone installing more than 900 CRDs made the API server unresponsive, sometimes for up to an hour during scale-up (https://blog.crossplane.io/crd-scaling-provider-families/). The blog says Crossplane "frequently installs multiple hundreds of CRDs or even thousands in some cases." See [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](../findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md).
- The fix was scoped providers grouped into provider families, chosen because it needed no new user concept, gave fewer CRDs by default, and allowed easy migration from monoliths. It also depended on upstream Kubernetes improvements and ecosystem adoption. See [examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use](../examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use.md).
- The Crossplane blog compares Crossplane with ACK, Config Connector, and Azure Service Operator and argues the difference is Composition, while the cloud add-ons expose resources one-to-one (https://blog.crossplane.io/crossplane-vs-cloud-infrastructure-addons/). The source is maintainer-authored, so it is positioning. See [comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso](../comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso.md).

### ACK

- ACK reconciles immediately on a spec change and resyncs every 10 hours for passive drift detection, per the Amazon EKS capability page (https://docs.aws.amazon.com/eks/latest/userguide/ack-concepts.html). The self-managed default may differ. See [entities/ack](../entities/ack.md).
- ACK status conditions are `Ready`, `ACK.ResourceSynced`, `ACK.Terminal`, `ACK.Recoverable`, `ACK.Adopted`, `ACK.ReferencesResolved`, and `ACK.IAMRoleSelected`.
- ACK's deletion policy defaults to delete and can be changed to retain with an annotation.
- ACK adoption brings existing AWS resources under management through an adoption-policy annotation with the values `adopt` or `adopt-or-create`.
- ACK sets region per resource or per namespace, and `IAMRoleSelector` maps namespaces to IAM roles for cross-account use. See [examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management](../examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management.md).
- ACK cross-namespace references are off by default and the page states that disabling them is not a tenant isolation control. See [findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation](../findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation.md).
- ACK retries use exponential backoff, and permanent errors are not retried. The page points to kro for composing ACK resources.
- The ACK community overview (https://aws-controllers-k8s.github.io/community/docs/community/overview/) states one controller per AWS service, each in its own container image, generated from AWS API specifications, with alpha to GA maturity phases and a deprecation policy. See [comparisons/provider-families-versus-per-service-controllers](../comparisons/provider-families-versus-per-service-controllers.md).

### Config Connector

- Config Connector is an open source add-on supplying CRDs and controllers for Google Cloud resources, with RBAC, events, and eventual consistency through loosely coupled dependencies (https://docs.cloud.google.com/config-connector/docs/overview). See [entities/config-connector](../entities/config-connector.md).
- Reconciliation runs as the Config Connector IAM service account, not the human who applied the manifest, so permission to create the Kubernetes object is effectively permission to change cloud resources. Google recommends a controller that applies manifests from a trusted repository. See [findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions](../findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions.md).
- Best practices (https://docs.cloud.google.com/config-connector/docs/best-practices) recommend namespaced mode so namespaces bind to different Google service accounts and projects, which spreads API quota instead of exhausting one quota project in cluster mode. See [examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts](../examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts.md).
- The abandon deletion policy and the acquire workflow move resources between projects or namespaces without deleting them, and recreating stateful resources can lose data. See [findings/deleting-stateful-resources-through-a-provider-can-lose-data](../findings/deleting-stateful-resources-through-a-provider-can-lose-data.md).
- The reconciliation page (https://docs.cloud.google.com/config-connector/docs/concepts/reconciliation) describes periodic reconciliation, dependency waiting (a subscription waits for its topic), and three controller kinds: direct, Terraform-based, and DCL-based.
- Terraform and DCL controllers use a default 2-minute maximum backoff, direct controllers allow tuning, and drift correction can be disabled with the `reconcile-interval-in-seconds` annotation set to 0.

### Azure Service Operator and Cluster API

- Azure Service Operator v2 manages 150 or more Azure resources, with CRDs generated from Azure Resource Manager schemas so coverage tracks Azure, and uses ownership references for Azure lifecycle relationships (https://azure.github.io/azure-service-operator/). The page mentions Crossplane only as a code-generation target and gives no comparison. See [entities/azure-service-operator](../entities/azure-service-operator.md).
- Cluster API defines infrastructure, bootstrap, control plane, IPAM, and addon provider types, and each implements agreed CRD fields and behaviors, the contract, so the core controllers stay generic (https://cluster-api.sigs.k8s.io/developer/providers/contracts/overview). See [comparisons/crossplane-providers-versus-cluster-api-providers](../comparisons/crossplane-providers-versus-cluster-api-providers.md) and [entities/cluster-api](../entities/cluster-api.md).

### Use cases and gaps the dossier records

- The dossier names typical scenarios from vendor documentation: platform teams fronting provider resources with a small self-service API, GitHub and Grafana managed through Upjet providers, S3, RDS, and SQS managed from manifests on Amazon EKS, Config Connector namespaces mapped to projects, and Cluster API lifecycle of whole clusters. It states these are not named customer reports.
- The dossier found no named end-user case studies with production figures, and several pages (Medium, Pulumi comparison, Stack Overflow, Upbound marketplace, the ACK announcement blog) were not read.
- How Flux, Argo CD, and kro treat provider-managed resources (health, pruning, ordering, deletion) is not covered. See [open-knowledge-gaps](../open-knowledge-gaps.md).
- Crossplane v2 introduced `ClusterProviderConfig`, and the v1.20 managed-resource page and the latest providers page may differ in scope and defaults, so writers should confirm the version they target.
