# Research dossier: gap cluster m7-operators-idempotency

Research date: 2026-11-26

## Overview

This dossier covers seven open gaps about operators and idempotency. Evidence came from official documentation, project READMEs, and Go source read in this run, mostly through the GitHub contents API (raw text) and page scrapes. Versions and dates are those seen on 2026-11-26: Argo CD v3.6.3, Backstage v1.57.3, Cluster API v1.14.4, Crossplane v2.5.0, kro v0.10.0, Config Connector v1.162.0, Kubebuilder v4.16.0, Operator SDK v1.42.3, Java Operator SDK v5.7.0, Kopf 1.45.2, shell-operator v1.21.5, Metacontroller v4.17.11.

Two gaps are answered from primary text. The per-provider external-name gap resolves the apparent contradiction in the wiki: the Crossplane docs say providers name external resources like the Kubernetes object by default, and the upjet source shows the mechanism (a name initializer that copies metadata.name into the external-name annotation) and where it is switched off or overridden (provider-assigned IDs, `ParameterAsIdentifier("bucket")` for S3, templated IDs for Azure and some GCP kinds). The Config Connector conflict gap is answered by the "Managing conflicts" page, which describes a namespace-scoped lease with a default of no conflict prevention.

The framework-choice gap has no source that gives selection criteria. The evidence is each project's own self-description, which is presented side by side with no recommendation. The capability-levels gap has one directly relevant sentence in the Operator SDK docs (operators that delegate to off-cluster services "would remain at Level 1"), but the docs do not mention Crossplane, kro, or composition. The Backstage gap is partly answered: the Backstage Kubernetes plugin can fetch configured custom resources and is entity-label driven, but no Backstage doc describes an "operator pattern" relationship. The kro and Cluster API gap is answered for kro (tracking, field managers, retries) and Cluster API (provider best practices on tags and deterministic names), though Cluster API's contract text gives guidance, not a guaranteed idempotency mechanism.

All statements are marked VERIFIED only where the quoted text was read in this run from the cited URL. Interpretive sentences in the gap sections are my own reading and carry no status.

## Gap: Criteria for choosing an operator framework or language

No source read in this run gives selection criteria. What exists is each project's own statement of what it is and who it is for. Options are listed without a recommendation.

- Kubebuilder (Go): its book targets "Kubernetes API extension developers" and teaches API design and controller-runtime concepts. Go only.
- Operator SDK: a framework built on controller-runtime that offers Go, Ansible, and Helm workflows. The Go path is the only one described as writing the reconciling logic in a general language; Ansible and Helm map custom resources to playbooks and charts.
- Java Operator SDK (JOSDK): Java, uses the Fabric8 client, with retries, dependent-resource handling, and event scheduling built in. Related projects include a Quarkus extension and a language-independent meta-operator ("Kubernetes Glue Operator").
- Kopf (Python): decorator-based handlers. The maintainer states there is no active development of new major functionality and that the project is production-ready.
- shell-operator: runs scripts as hooks triggered by Kubernetes events. It states it is not an operator for a particular software product.
- Metacontroller: declarative watches plus a webhook in any language that takes JSON and returns JSON; adopt/orphan, garbage collection, retries, and backoff are built in.
- kube-rs and KubeOps (named in the wiki gap) were not searched in this run.

Claims

1. Kubebuilder book audience statement. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/kubebuilder/blob/master/docs/book/src/introduction.md (read via contents API, release v4.16.0 published 2026-09-10). Quote: "API extension developers will learn the principles and concepts behind implementing canonical Kubernetes APIs, as well as simple tools and libraries for rapid execution."
2. Operator SDK offers three authoring workflows. Status: VERIFIED. URL: https://sdk.operatorframework.io/docs/overview/ (source: operator-framework/operator-sdk website/content/en/docs/overview/_index.md; latest release v1.42.3 published 2026-06-26) [corrected in verification: the sentence is on the overview page, not in the Go quickstart.md cited originally]. Quote: "The SDK provides workflows to develop operators in Go, Ansible, or Helm."
3. Operator SDK is a framework that uses controller-runtime. Status: VERIFIED. URL: https://github.com/operator-framework/operator-sdk/blob/master/README.md. Quote: "framework that uses the controller-runtime library to make writing operators easier"
4. Operator SDK repository last release was 2026-06-26 (v1.42.3) while the repository was pushed 2026-10-21. Status: VERIFIED (GitHub API metadata). URL: https://api.github.com/repos/operator-framework/operator-sdk/releases/latest. Quote: not applicable (metadata). Reading this as a maintenance signal is an inference and not a source statement.
5. JOSDK describes itself as a framework with retries and dependent-resource handling. Status: VERIFIED. URL: https://github.com/operator-framework/java-operator-sdk/blob/main/README.md (v5.7.0, 2026-11-19). Quote: "Handling dependent resources, related events, and caching." and "Automatic Retries"
6. JOSDK lists a language-independent option built on its workflows. Status: VERIFIED. URL: same README. Quote: "allows to create operators by simply applying a custom resource, thus, is a language independent way."
7. Kopf maintainer states maintenance-mode posture. Status: VERIFIED. URL: https://github.com/nolar/kopf/blob/main/README.md (1.45.2, 2026-10-23). Quote: "There is no active development of **new major** functionality for Kopf"
8. Kopf design goal: handlers via decorators, minimal boilerplate. Status: VERIFIED. URL: same README. Quote: "A full-featured operator in just 2 files: a `Dockerfile` + a Python file"
9. shell-operator is script-hook based and not a product operator. Status: VERIFIED. URL: https://github.com/flant/shell-operator/blob/main/README.md (v1.21.5, 2026-11-06). Quote: "This operator is not an operator for a _particular software product_"
10. Metacontroller lets controllers be written in any language over a JSON webhook. Status: VERIFIED. URL: https://github.com/metacontroller/metacontroller/blob/master/README.md (v4.17.11, 2026-11-22). Quote: "provide a webhook (in any language) that receives the current state as JSON and returns the desired state as JSON."
11. Metacontroller bundles retry and adoption behavior. Status: VERIFIED. URL: same README. Quote: "adopt/orphan semantics, garbage collection, watches, caching, work queues, optimistic concurrency, and retries with backoff all come built in."
12. The CNCF white paper favors Go (claim in the wiki gap). Status: UNVERIFIED in this run; the white paper was not re-read.

Outcome: no selection-criteria source found. Searched project READMEs and the Kubebuilder book intro for "choose", "when to use", "comparison"; found only self-descriptions. A neutral comparison page from maintainers was not found.

## Gap: Operator SDK capability levels for composition-based operators

The Operator SDK capability-levels page defines five levels (Basic Install, Seamless Upgrades, Full Lifecycle, Deep Insights, Auto Pilot). It frames them around an Operator managing an Operand workload, and it states a rule for operators that do not manage an in-cluster workload. The page does not mention Crossplane, kro, composition, or non-Go implementations. Whether the levels "apply" to composition tools is therefore the wiki author's inference, not something the Operator Framework states. Options for the wiki to consider, with the sources on each side:

- Strict reading: the page says operators "delegating to off-clusters orchestration services would remain at Level 1". Crossplane managed resources and Config Connector delegate to cloud APIs, so under this sentence they cap at Level 1. kro composes in-cluster Kubernetes objects, so the sentence does not directly cover it.
- Loose reading: the page says "Each capability represents its own set of features and may be independent of each other", which means a tool could claim features at higher levels without climbing in order.
- Level definitions mention operand backup and restore (Level 3), metrics and alerts (Level 4), and auto-scaling and tuning (Level 5). These are stated in terms of application workloads, so the mapping to a composite resource's "operand" is undefined.

Claims

1. Levels are named 1 to 5. Status: VERIFIED. URL: https://sdk.operatorframework.io/docs/overview/operator-capabilities/ (read 2026-11-26, no version stamp). Quote: "Level 1 - Basic Install", "Level 5 - Auto Pilot"
2. Delegating operators remain at Level 1. Status: VERIFIED. URL: same. Quote: "Operator that do not manage a workload and/or are delegating to off-clusters orchestration services would remain at Level 1."
3. Capabilities may be independent. Status: VERIFIED. URL: same. Quote: "Each capability represents its own set of features and may be independent of each other."
4. Level 3 covers backup and restore of the operand. Status: VERIFIED. URL: same. Quote: "backup and restore the operand from the operator itself without any additional manual intervention"
5. Level 5 covers auto-scaling and tuning. Status: VERIFIED. URL: same. Quote: "The operator should configure the Operand to auto-scale as load picks up."
6. The levels page defines Managed resources as including off-cluster services. Status: VERIFIED. URL: same. Quote: "the Kubernetes objects or off-cluster services the Operator uses to constitute an Operand"
7. The page does not mention Crossplane, kro, or composition. Status: VERIFIED by search of the full scraped text (no occurrence of those words). URL: same.

Outcome: partial. The Level 1 delegation sentence is direct evidence; a feature-by-feature mapping for Crossplane and kro was not found in any Operator Framework source and the wiki would need to author it, labeled as inference.

## Gap: Argo CD and Config Connector as operators

Argo CD. The architecture page splits Argo CD into an API server, a repository server, and an Application Controller, and describes the controller as a Kubernetes controller that compares live and target state. Failure handling is documented in the user guide: failed sync operations can be retried with exponential backoff (limit, duration, factor, maxDuration), self-heal re-attempts a sync after a timeout, and resource health is assessed with built-in rules (for example Degraded for a Pod in CrashLoopBackOff) that can be customized. The ApplicationSet controller is a separate component listed in the manual. Whether this "follows one-controller-per-concern guidance" depends on which guidance the wiki means; the documents read here describe the split but do not reference that guidance.

Config Connector. The Reconciliation page says resources can be applied in any order and converge by eventual consistency, that errors retry with exponential backoff capped at 2 minutes by default (configurable by annotation for direct controllers), and that periodic reconcile interval is configurable per resource by annotation. The status carries a ready condition with message and reason, and events are emitted.

Claims

1. Argo CD application controller role. Status: VERIFIED. URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/ (stable docs, read 2026-11-26; latest release v3.6.3, 2026-11-24). Quote: "The application controller is a Kubernetes controller which continuously monitors running applications"
2. Argo CD components are separate services. Status: VERIFIED. URL: same. Quote: "The repository server is an internal service which maintains a local cache of the Git repository"
3. Sync retry with exponential backoff. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/auto_sync.md. Quote: "Argo CD can automatically retry a failed sync operation using exponential backoff."
4. Unlimited retries via -1. Status: VERIFIED. URL: same. Quote: "Set to `-1` for unlimited retries."
5. Self-heal retries after a timeout. Status: VERIFIED. URL: same. Quote: "the sync will be attempted again after self-heal timeout (5 seconds by default)"
6. Health assessment marks failing pods Degraded. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/master/docs/operator-manual/health.md. Quote: "\"Degraded\" if a container is in an error state (e.g. `CrashLoopBackOff`, `ImagePullBackOff`)"
7. Config Connector retries with capped backoff. Status: VERIFIED. URL: https://cloud.google.com/config-connector/docs/concepts/reconciliation (last updated 2026-11-10). Quote: "Config Connector retries with exponential backoff where maximum backoff is 2 minutes."
8. Config Connector reconcile interval is annotation-configurable. Status: VERIFIED. URL: same. Quote: "configure the average reconcile interval for resources managed by Config Connector with the `cnrm.cloud.google.com/reconcile-interval-in-seconds` annotation"
9. Config Connector converges in any order. Status: VERIFIED. URL: same. Quote: "you can create and update resources in any order, regardless of dependency relationships."
10. Config Connector ready condition and events. Status: VERIFIED. URL: https://cloud.google.com/config-connector/docs/concepts/resources (last updated 2026-11-10). Quote: "Important status changes for Config Connector resources are visible as Kubernetes events."
11. Config Connector's controller-types page (direct vs Terraform-based controllers) was not read. Status: UNVERIFIED.

Outcome: answered for failure handling (retry, backoff, health); the "one controller per concern" part is not answerable from these pages.

## Gap: Backstage and the operator pattern

Backstage's Kubernetes feature is described as built for service owners and made of two plugins (frontend and backend). The backend can fetch standard objects and configured custom resources per cluster, matched to catalog entities by the `backstage.io/kubernetes-id` label or a label selector annotation. A custom resource whose CRD is not installed returns 404 and is skipped with a debug log. A proxy endpoint exists for plugin authors who want to read or write custom resources beyond default behavior. This makes Backstage a read-oriented portal over whatever operators produce, not an operator. No Backstage document read describes an operator pattern. For packaging, Red Hat publishes a separate operator that deploys Backstage (Red Hat Developer Hub) on Kubernetes, which is an operator for Backstage and not a Backstage feature.

Claims

1. Kubernetes plugin audience. Status: VERIFIED. URL: https://backstage.io/docs/features/kubernetes/ (Backstage stable v1.57.0 shown on page; latest release v1.57.3, 2026-11-26). Quote: "designed around the needs of service owners, not cluster admins."
2. Two plugins, backend connects to clusters. Status: VERIFIED. URL: same. Quote: "the backend wraps the mechanics to connect to Kubernetes clusters to collect the relevant information"
3. Custom resources are configured by group, apiVersion, plural. Status: VERIFIED. URL: https://github.com/backstage/backstage/blob/master/docs/features/kubernetes/configuration.md. Quote: "Configures which custom resources to look for by default when returning an entity's Kubernetes resources."
4. Missing CRD is skipped. Status: VERIFIED. URL: same. Quote: "it is silently skipped and its absence is logged at debug level."
5. Entity-to-object matching via label. Status: VERIFIED. URL: same. Quote: "'backstage.io/kubernetes-id': <BACKSTAGE_ENTITY_NAME>"
6. Proxy endpoint for custom resources. Status: VERIFIED. URL: https://github.com/backstage/backstage/blob/master/docs/features/kubernetes/proxy.md. Quote: "interacting with Custom Resources beyond the default behaviors of the existing Kubernetes plugin"
7. Watching resources supported by the backend. Status: VERIFIED. URL: https://backstage.io/docs/features/kubernetes/. Quote: "supports watching resources for real-time change notifications using async iterators."
8. An operator exists to deploy Backstage. Status: VERIFIED (repository description). URL: https://github.com/redhat-developer/rhdh-operator. Quote: "Operator for Deploying Red Hat Developer Hub (Backstage) on Kubernetes and OpenShift"
9. Community Crossplane or Argo CD plugins exist (TeraSky-OSS/backstage-plugins; backstage/community-plugins has an argocd workspace). Status: SECONDARY-ONLY (names seen in listings and a repo description, plugin docs not read). URL: https://github.com/TeraSky-OSS/backstage-plugins. Quote: "Backstage Plugins Developed by TeraSky"
10. Software Templates and Catalog as a platform layer above operators. Status: UNVERIFIED; not read.

Outcome: partial. The custom-resource integration is documented, but no Backstage source speaks about the operator pattern, and Software Templates were not read.

## Gap: kro and Cluster API idempotency for external and infrastructure creates

kro. The kro docs (read from the GitHub source because the kro.run page scrape returned empty) describe two layers. For ResourceGraphDefinition instances, kro applies labels and annotations to every managed resource (`kro.run/owned`, `kro.run/instance-id`, `kro.run/node-id`, and ApplySet labels) and tracks them with the Kubernetes ApplySet specification. It sets no owner references by default, to allow ordered deletion. In the newer Graph documentation (present at the v0.10.0 tag), kro records the resources it is about to create in `status.managedResources` before applying them, so a controller restart between apply and status write does not lose track. It applies with server-side apply per Graph as a field manager, without force, so a field owned by another manager yields a `FieldManagerConflict` instead of an overwrite. Deletion works from status. Retries use exponential backoff for waiting states (1 second to 5 minutes) and controller-runtime rate-limited retry for hard failures. kro's documented scope here is Kubernetes objects; the pages read do not describe creation of non-Kubernetes cloud resources, which in kro goes through other operators' CRs (for example ACK or Config Connector resources inside a graph). Names are deterministic only to the extent the RGD author templates them; the docs read do not state a naming rule for children.

Cluster API. The provider best-practices page tells infrastructure providers to link external object names to the originating Kubernetes resource but not to rely on names: "More robust mechanisms MUST always be provided and used, such as provider-owned tags or labels." Where names must be shortened, use a deterministic transformation with a hash. The InfraMachine contract has the provider set `spec.providerID` and `status.initialization.provisioned` after reconciling infrastructure [corrected in verification: the v1beta2 contract text says `status.initialization.provisioned`; the older `status.infrastructure.provisioned` appears only in the page's legacy "Normal resource" step list at the end]. The contract page does not state an explicit idempotency algorithm for create after a lost response; it relies on tags and the providerID. Per-provider mechanics (for example how an AWS provider finds an instance after restart) were not read.

Comparison with Crossplane, ACK, and Config Connector, per sources read: Crossplane uses the external-name annotation plus create-pending, create-succeeded, and create-failed annotations; Config Connector maps name plus container annotation; Cluster API uses provider-owned tags; kro tracks Kubernetes children by labels, ApplySet, and `status.managedResources`.

Claims

1. kro labels children for ownership. Status: VERIFIED. URL: https://github.com/kro-run/kro/blob/main/website/docs/docs/concepts/rgd/06-instances.md (same blob SHA at main and tag v0.10.0; latest release v0.10.0, 2026-11-10). Quote: "`kro.run/owned` | Set to `"true"` to indicate kro manages this resource"
2. kro uses ApplySet for tracking and pruning. Status: VERIFIED. URL: same. Quote: "kro uses the Kubernetes ApplySet specification for tracking and pruning managed resources."
3. No owner references by default, for ordered deletion. Status: VERIFIED. URL: same. Quote: "kro does not set Kubernetes owner references on managed resources by default."
4. Records intent before apply. Status: VERIFIED. URL: https://github.com/kro-run/kro/blob/main/website/docs/docs/concepts/graph/05-status-and-lifecycle.md (file present at tag v0.10.0). Quote: "Before any apply, kro records the resources it is about to create in `status.managedResources`."
5. Restart safety. Status: VERIFIED. URL: same. Quote: "If the controller restarts between applying a resource and recording the result, the next reconcile still knows about it."
6. SSA without force; conflict is reported. Status: VERIFIED. URL: same. Quote: "the apply is rejected with a conflict rather than stealing the field"
7. FieldManagerConflict reason exists. Status: VERIFIED. URL: same. Quote: "A field a node wants to write is owned by another field manager that kro will not take over"
8. Retry policy. Status: VERIFIED. URL: same. Quote: "exponential backoff starting at one second and capped at five minutes."
9. Deletion from status, finalizer retained on failure. Status: VERIFIED. URL: same. Quote: "keeps the finalizer, and retries."
10. Instance reconcile loop is observe, compare, act, report. Status: VERIFIED. URL: kro rgd/06-instances.md above. Quote: "Creates, updates, or deletes resources as needed"
11. kro docs pages on kro.run could not be read; a guessed URL returned empty content. Status: UNREADABLE (see section).
12. Cluster API: names must not be the sole lookup key. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/developer/providers/best-practices.md (Cluster API v1.14.4, 2026-11-03). Quote: "Do not use a derived infrastructure name as the sole lookup key"
13. Cluster API: tags or labels required for association. Status: VERIFIED. URL: same. Quote: "More robust mechanisms MUST always be provided and used, such as provider-owned tags or labels"
14. Cluster API: deterministic hashed names when truncating. Status: VERIFIED. URL: same. Quote: "Use a deterministic transformation that preserves a readable prefix where useful and incorporates a hash"
15. Cluster API: providerID surfaced on InfraMachine. Status: VERIFIED. URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/book/src/developer/providers/contracts/infra-machine.md. Quote: "Node's Provider id  MUST surface on `spec.providerID` in the InfraMachine resource."
16. Cluster API v1beta2: terminal failures use conditions. Status: VERIFIED. URL: same. Quote: "there is no more special treatment for provider's terminal failures within Cluster API."
17. Crossplane create-annotations for ambiguous creates (comparison row). Status: VERIFIED. URL: https://github.com/crossplane/docs/blob/master/content/master/managed-resources/managed-resources.md (Crossplane v2.5.0, 2026-11-24 latest release; docs branch master). Quote: "If it doesn't, it _leaks_ the resource."
18. How specific Cluster API infrastructure providers recover from a lost create response. Status: UNVERIFIED; provider code not read.

Outcome: answered for kro and for the Cluster API contract-level guidance; provider-level implementations remain unread.

## Gap: Per-provider external-name defaults

The Crossplane managed-resources page states the general default. Provider source shows how it is realized. In upjet-based providers a name initializer sets the external-name annotation to `metadata.name` when none is given, unless the resource config sets `DisableNameInitializer` (used where the provider assigns the identifier, such as AWS VPC). The shipped configs then vary by resource:

AWS (provider-upjet-aws, config/externalname.go, v2.10.0 released 2026-11-20 is the latest release; the file was read from main) [corrected in verification: dossier had v2.8.0 / 2026-10-08, which is the Azure provider's release]:
- aws_s3_bucket: `ParameterAsIdentifier("bucket")`, so the external name feeds the `bucket` argument.
- aws_iam_role, aws_eks_cluster: `NameAsIdentifier`.
- aws_vpc, aws_subnet, aws_security_group, aws_instance, aws_db_instance, aws_kms_key: `IdentifierFromProvider`, so the annotation is filled with the provider-generated ID after creation and the name initializer is disabled.

Azure (provider-upjet-azure, config/externalname.go, latest release v2.8.0, 2026-10-08) [corrected in verification: dossier had v2.10.0 / 2026-11-20, which is the AWS provider's release]: `TemplatedStringAsIdentifier("name", "/subscriptions/{{...}}/resourceGroups/...")` for resource group, virtual network, storage account, and AKS cluster. The name is user-chosen and the Azure resource ID is templated from it.

GCP (provider-upjet-gcp, config/externalname.go, latest release v3.1.0, 2026-10-08): `TemplatedStringAsIdentifier("name", ...)` for compute instance, compute network, subnetwork, GKE cluster, Cloud SQL instance, and storage bucket (`{{ project }}/{{ external_name }}`); `IdentifierFromProvider` for `google_project_iam_member`; a custom `serviceAccount()` function for service accounts.

This resolves the wiki's contradiction: S3 uses the object name through a parameter mapping (consistent with the general default), while many AWS kinds do not (provider-generated IDs). The Crossplane docs sentence is a default that does not hold for provider-assigned IDs, and the same page says so in a later section.

Limits of this evidence: the files are on main and may be ahead of the latest release tags noted above; only a sample of kinds was inspected; provider-aws (non-upjet, v0.60.0 on 2026-10-30 per the release listing, repository not read) and provider-azure native repositories were not read. Whether AWS, Azure, and GCP files differ in v1 versus v2 namespaced variants was not checked.

Claims

1. General default naming. Status: VERIFIED. URL: https://github.com/crossplane/docs/blob/master/content/master/managed-resources/managed-resources.md. Quote: "By default Providers give external resources the same name as the Kubernetes object."
2. A pre-set annotation overrides the default. Status: VERIFIED. URL: same. Quote: "use the annotation value as the external resource name."
3. Some systems generate non-deterministic names. Status: VERIFIED. URL: same. Quote: "the external system generates an nondeterministic name and returns it to the provider."
4. Name initializer sets external name to metadata.name and can be disabled. Status: VERIFIED. URL: https://github.com/crossplane/upjet/blob/main/pkg/config/resource.go. Quote: "sets external name to metadata.name if none specified should be disabled."
5. IdentifierFromProvider disables the name initializer. Status: VERIFIED. URL: https://github.com/crossplane/upjet/blob/main/pkg/config/externalname.go. Quote: "DisableNameInitializer:  true,"
6. IdentifierFromProvider is for provider-assigned IDs such as AWS VPC. Status: VERIFIED. URL: same. Quote: "assigned by the remote client, such as AWS VPC where it gets an identifier like vpc-2213das"
7. NameAsIdentifier uses the name argument. Status: VERIFIED. URL: same. Quote: "NameAsIdentifier uses \"name\" field in the arguments as the identifier of the resource."
8. aws_s3_bucket uses bucket parameter. Status: VERIFIED. URL: https://github.com/crossplane-contrib/provider-upjet-aws/blob/main/config/externalname.go (line 2520). Quote: `"aws_s3_bucket": config.ParameterAsIdentifier("bucket"),`
9. aws_vpc, aws_instance, aws_db_instance use provider IDs. Status: VERIFIED. URL: same. Quote: `"aws_vpc": config.IdentifierFromProvider,`
10. aws_iam_role and aws_eks_cluster use name. Status: VERIFIED. URL: same. Quote: `"aws_iam_role": config.NameAsIdentifier,`
11. Azure resource group uses templated ID from name. Status: VERIFIED. URL: https://github.com/crossplane-contrib/provider-upjet-azure/blob/main/config/externalname.go (line 191). Quote: `"azurerm_resource_group": config.TemplatedStringAsIdentifier("name", "/subscriptions/{{ .setup.configuration.subscription_id }}/resourceGroups/{{ .external_name }}")`
12. GCP compute instance uses templated ID. Status: VERIFIED. URL: https://github.com/crossplane-contrib/provider-upjet-gcp/blob/main/config/externalname.go (line 232). Quote: `"google_compute_instance": config.TemplatedStringAsIdentifier("name", "projects/{{ .setup.configuration.project }}/zones/{{ .parameters.zone }}/instances/{{ .external_name }}")`
13. GCP project IAM member uses provider ID. Status: VERIFIED. URL: same (line 155). Quote: `"google_project_iam_member": config.IdentifierFromProvider,`
14. Upjet guide on format varying by provider. Status: VERIFIED. URL: https://github.com/crossplane/upjet/blob/main/docs/configuring-a-resource.md. Quote: "The format and source of the external name depends on the cloud provider;"
15. Full per-kind table across all three providers. Status: UNVERIFIED; only sample kinds read; full files are 2563 (Azure), 1576 (GCP) and 4710 (AWS) lines.

Outcome: answered at the mechanism level with sampled kinds; a complete per-kind table was not built.

## Gap: Config Connector conflict handling when two objects target one cloud resource

The "Managing conflicts" page answers this directly. Config Connector maps a Kubernetes resource to a cloud resource by name, container annotation, and region or location if applicable, and by default acquires an existing resource of the same name. Creating two Config Connector resources in different namespaces that manage the same cloud resource is "possible, but not recommended". Conflict prevention uses a namespace-scoped lease stored as two labels on the cloud resource (`cnrm-lease-holder-id` and `cnrm-lease-expiration`). A lease lasts 40 minutes and is extended when under 20 minutes remain. A loser sees status `ManagementConflict`. The control is the annotation `cnrm.cloud.google.com/management-conflict-prevention-policy` with values `resource` or `none`, and the default is `none`, which means no prevention unless the user opts in. Limits: prevention does not work for resources that do not support labels; and two objects in the same namespace that use `resourceID` to name the same cloud resource conflict in a way Config Connector cannot manage. Deleting an acquiring object deletes the cloud resource unless `deletion-policy` is set to abandon. Some resources with service-generated IDs can be acquired only through `resourceID`, and some cannot be acquired at all.

For the wiki's decision page, the options with sources are: rely on the default (no prevention), set `resource` per object (lease labels), or avoid acquisition for look-alike resources by using `resourceID` and deletion-policy abandon. Sources show the tradeoff but do not recommend.

Claims

1. Acquire if exists, create if not. Status: VERIFIED. URL: https://cloud.google.com/config-connector/docs/how-to/managing-deleting-resources (last updated 2026-11-10). Quote: "If a resource with the same name already exists, Config Connector acquires that resource and starts managing it."
2. Match rule. Status: VERIFIED. URL: same. Quote: "Config Connector acquires, or takes control of, resources when the values in the manifest and the resource name match."
3. Default deletion removes the cloud resource. Status: VERIFIED. URL: same. Quote: "deleting the object from your cluster will delete the resource."
4. Service-generated IDs acquired only via resourceID. Status: VERIFIED. URL: same. Quote: "by using the `resourceID` field."
5. Mapping key. Status: VERIFIED. URL: https://cloud.google.com/config-connector/docs/concepts/managing-conflicts (last updated 2026-11-10). Quote: "mapping the combination of Kubernetes resource name, container annotation, and if applicable, region or location."
6. Two namespaces on one resource is discouraged and lease-gated. Status: VERIFIED. URL: same. Quote: "possible, but not recommended, to create two Config Connector resources in different namespaces that manage the same Google Cloud resource."
7. Lease labels. Status: VERIFIED. URL: same. Quote: "`cnrm-lease-holder-id`" and "`cnrm-lease-expiration`"
8. Lease takeover conditions. Status: VERIFIED. URL: same. Quote: "The value of `cnrm-lease-expiration` is in the past."
9. Lease length. Status: VERIFIED. URL: same. Quote: "the expiration time is set to 40 minutes in the future."
10. Conflict status. Status: VERIFIED. URL: same. Quote: "lists a Status of `ManagementConflict`."
11. Policy values and default. Status: VERIFIED. URL: same. Quote: "The default value is `none`."
12. Limitation for unlabeled resources. Status: VERIFIED. URL: same. Quote: "Conflict prevention does not work for resources that don't support labels."
13. Limitation with resourceID in one namespace. Status: VERIFIED. URL: same. Quote: "These resources create conflicts that Config Connector cannot manage."
14. Config Connector adds a system label to labeled cloud resources. Status: VERIFIED. URL: https://cloud.google.com/config-connector/docs/concepts/resources. Quote: "Config Connector adds a system label named `managed-by-cnrm` with a value of `true`"
15. Behavior when the two objects are in the same namespace with the same name (cannot happen, one object) or same namespace with different names and no resourceID. Status: UNVERIFIED; not documented in pages read.
16. Config Connector release v1.162.0 published 2026-11-23. Status: VERIFIED (GitHub API metadata). URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/releases. Quote: not applicable.

Outcome: answered, with the caveat that behavior was read from docs and not tested; the existing wiki claim of a reporter issue (14236) is outside this pass.

## Unreadable sources

- https://kro.run/docs/concepts/instances/ : web_scrape returned empty content (status success, no text). Replaced by GitHub source of the same docs.
- https://cloud.google.com/config-connector/docs/concepts/resource-acquisition : web_scrape returned empty content (URL was a guess and may not exist). Replaced by the managing-deleting-resources and managing-conflicts pages.
- web_search for Config Connector conflict wording returned zero results; not an unreadable page but noted for transparency.
- GitHub code search was rate limited once (HTTP 403); the contents API worked afterwards.

## Not found

- Maintainer or neutral guidance for choosing among Kubebuilder, Operator SDK, Kopf, JOSDK, shell-operator, and Metacontroller (searched project READMEs and the Kubebuilder book introduction; found only self-descriptions). kube-rs and KubeOps were not searched.
- Any Operator Framework text mapping capability levels to Crossplane, kro, or other composition tools (searched the full capability-levels page; no mention).
- Any Backstage document that discusses the operator pattern (searched the Kubernetes plugin overview, configuration, and proxy pages).
- A Cluster API provider-level description of idempotent machine creation after a lost response (the provider contract and best-practices pages were read; no provider repository was read).
- A complete per-kind table of default external names for all AWS, Azure, and GCP kinds (only sampled kinds read).
- Config Connector controller-types page and the Argo CD documentation on "one controller per concern" (not read).

## Removed in verification

None. No claim was deleted; three factual corrections (provider release swap, Operator SDK citation URL, InfraMachine provisioned field name) are marked inline. A second verification pass re-fetched about 50 quoted claims (kro, Cluster API, Crossplane/upjet, per-provider externalname.go lines, Config Connector conflicts and reconciliation, Operator SDK levels and overview, Argo CD, Backstage, Kopf, JOSDK, shell-operator, Metacontroller, Kubebuilder, release tags) and reproduced them. Minor note: Backstage's "Designed around the needs of service owners" is capitalized on the page. Not re-fetched: Config Connector "last updated" dates, Crossplane v2 namespaced variants, CNCF white paper (already UNVERIFIED).
