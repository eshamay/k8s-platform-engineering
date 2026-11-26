# Research dossier: Managed Resources

Research date: 2026-11-25

## Overview

A Crossplane managed resource (MR) is a Kubernetes object that stands for exactly one external thing, such as an S3 bucket, a Cloud SQL instance or a Kubernetes object in another cluster. The object lives in the Kubernetes API. The thing it describes lives in a provider's system (a cloud API, SaaS, etc.). A provider controller reconciles the two: it reads the real thing, compares it to what the object asks for, and creates, updates or deletes the real thing to close the gap. The docs call the in-cluster object the managed resource and the real object the external resource (source 1). For readers who already run Kubernetes, the shortest framing is "a Deployment-style controller loop whose pods are cloud resources".

Mechanically every MR has the same skeleton. `spec.forProvider` is the desired state and is authoritative. `spec.initProvider` holds values applied only at creation (useful for fields something else later changes, such as autoscaled counts). `status.atProvider` is what the provider last observed. Two conditions, Synced (did the last reconcile succeed) and Ready (is the external thing usable), are independent and diagnose different failures (sources 1, 4). The `crossplane.io/external-name` annotation says which external resource the object maps to. It defaults to the object name for many kinds, or an ID the cloud assigns. Crossplane also writes create-pending, succeeded and failed annotations to avoid leaking resources when a create call is interrupted (source 1). The provider-development guide shows the underlying reconciler loop: connect, observe, create, update, delete, with idempotent create and delete (source 8).

`spec.managementPolicies` is the main safety and import lever. It lists which verbs Crossplane may perform: Observe, Create, Update, Delete, LateInitialize, or `*` for all (the default). `["Observe"]` gives read-only import. Everything except Delete gives "manage but orphan on delete". An empty list pauses reconciliation (sources 1, 2, 4). The design doc behind observe-only import (source 3) started with a three-value enum (FullControl, OrphanOnDelete, ObserveOnly) and the shipped feature generalised it into a list. Import follows a standard recipe: set the external-name annotation to the existing resource's identifier, set Observe, apply, inspect `status.atProvider`, then copy the needed values into `spec.forProvider` and switch to `["*"]` (source 2).

The sources frame the problem differently. Official docs are procedural and feature-focused (1, 2, 11). The design doc explains why observe-only was needed: people wanted to reference legacy resources without taking ownership (3). Third-party explainers and consultancies stress operational habits, such as "Synced False with Ready True is the silent failure" and "start with Observe on production" (4, 5). Comparative sources show the same ownership question solved in other stacks: Config Connector uses a deletion-policy annotation (6), ACK uses a read-only annotation (7), Flux uses prune and deletion policy at the GitOps layer (15), and Argo CD needs annotation-based tracking to coexist with Crossplane (13). Scale issues, caused by providers shipping thousands of CRDs, appear as an architectural cost of "one CRD per external resource type" (9, 10, 11).

## Sources

### 1. Managed Resources (Crossplane docs, latest)
- URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/
- Title: Managed Resources, Crossplane v2.4 (latest)
- Publisher: Crossplane Authors / CNCF
- Kind: Official documentation
- Summary: Defines MRs and external resources, and lays out forProvider, initProvider and atProvider. It explains external-name defaults and the creation annotations that prevent leaked resources. The management policy table lists `*`, Create, Delete, Observe, Update and LateInitialize, and says an empty array pauses reconciliation. It notes Crossplane keeps immutable fields unchanged rather than delete-and-recreate as Terraform does. It lists the Ready reasons (Creating, Available, Deleting, Unavailable) and Synced reasons (ReconcileSuccess, ReconcileError, ReconcilePaused), and the `crossplane.io/paused: "true"` annotation. It covers ProviderConfig versus the cluster-wide ClusterProviderConfig and connection secrets. Read via fetch with a summarising prompt, so wording is paraphrased from that extraction.
- Quote: "Crossplane calls the object inside Kubernetes a managed resource and the external object inside the Provider an external resource."

### 2. Import Existing Resources
- URL: https://docs.crossplane.io/latest/guides/import-existing-resources/
- Title: Import Existing Resources, Crossplane v2.5
- Publisher: Crossplane Authors / CNCF
- Kind: Official how-to guide
- Summary: Step-by-step import using a GCP DatabaseInstance. Set `managementPolicies: ["Observe"]`, add the external-name annotation matching the provider-side name, pick a Kubernetes object name, and disambiguate with a `forProvider` field such as region if names collide. After apply, `status.atProvider` fills in. To take control, change policies to `["*"]` and manually copy needed values from atProvider into forProvider. States that managementPolicies is a beta feature and that providers must support it.
- Quote: "Crossplane imports observe only resources but never changes or deletes the resources."

### 3. Design doc: Observe-only resources
- URL: https://github.com/crossplane/crossplane/blob/main/design/design-doc-observe-only-resources.md
- Title: design-doc-observe-only-resources.md
- Publisher: Crossplane maintainers (crossplane/crossplane repo)
- Kind: Design document
- Summary: Motivation is referencing and monitoring existing cloud resources owned by other tools, which earlier required workarounds like provider-terraform or provider-kubernetes. The original proposal had FullControl, OrphanOnDelete and ObserveOnly modes where ObserveOnly runs only Observe. The import flow is create with identifying fields only, verify atProvider, then switch to FullControl and copy config. Risks listed: conflicts between deletionPolicy and managementPolicy, required-field validation that must be relaxed for observation (via CEL), and late-initialization being disabled. Considered and rejected a separate data-source-style type because it would double CRD counts.
- Quote: "Crossplane will only observe the external resource and will not make any changes or deletions."

### 4. Managed resources: Synced, Ready, external names and policies
- URL: https://oncallready.dev/learn/platform-engineering-backstage-and-crossplane/managed-resources-synced-ready-external-names-and-policies/
- Title: Crossplane managed resources: Synced vs Ready, import (lesson 42.6)
- Publisher: OnCallReady
- Kind: Tutorial explainer
- Summary: The clearest ramp-up read found. Uses a parcel-and-delivery-note analogy and a table of Synced/Ready combinations. Synced=False with Ready=True means the thing exists but Crossplane can no longer manage it, so drift is not corrected and applications keep working, which makes the failure quiet. Documents error prefixes (connect, observe, create, update, delete failed), event reasons, asynchronous upjet operations, the finalizer `finalizer.managedresource.crossplane.io` (deletion hangs if the provider is gone; hand-removing it orphans the real resource), v2 namespaced MRs without deletionPolicy, and "everything except Delete" as the v2 orphan idiom. Notes the AWS providers are generated from Terraform by upjet and that errors should be read from the right.
- Quote: "Synced False with Ready True means the thing exists but Crossplane can no longer manage it."

### 5. Onboarding AWS with Crossplane: Importing RDS, S3, and EKS Safely
- URL: https://www.cloudkeeper.com/insights/blog/onboarding-aws-crossplane-importing-rds-s3-and-eks-safely
- Title: Onboarding AWS with Crossplane: Importing RDS, S3, and EKS Safely
- Publisher: CloudKeeper
- Kind: Consultancy engineering blog
- Summary: A three-part safety recipe for adopting existing AWS resources: external-name, deletionPolicy Orphan, and ObserveOnly management policy. Lists pitfalls: drift correction from accidental manual changes, needing resources fully provisioned before import, deletion of production infrastructure if YAML is removed without orphan protection, and IAM or ProviderConfig gaps. Recommends testing on non-critical resources first. It uses v1-era `deletionPolicy` and `ObserveOnly` terms, so map to current `managementPolicies` when teaching. Vendor-authored, with limited named-customer detail.
- Quote: "Always start with ObserveOnly when adopting existing infrastructure"

### 6. Managing and deleting resources (Config Connector)
- URL: https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources
- Title: Managing and deleting resources | Config Connector
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Config Connector, the Kubernetes-native controller for Google Cloud resources, acquires an existing resource when the manifest's name (or ID) matches it, so import is implicit rather than flagged. Deleting the Kubernetes object deletes the cloud resource by default. The annotation `cnrm.cloud.google.com/deletion-policy: abandon` must be set before deletion to keep the cloud resource. A useful contrast with Crossplane's explicit policy list.
- Quote: "To keep the Google Cloud resource, add the following to the Config Connector resource YAML before deleting"

### 7. ReadOnly Resources (ACK)
- URL: https://aws-controllers-k8s.github.io/docs/guides/readonly/
- Title: ReadOnly Resources | AWS Controllers for Kubernetes
- Publisher: AWS Controllers for Kubernetes project
- Kind: Official documentation
- Summary: ACK offers annotation `services.k8s.aws/read-only: "true"`. The controller syncs status from AWS but ignores spec, never creates, updates or deletes, and shows an error if the AWS resource is missing. The page contrasts this with ACK's separate resource adoption feature, which gives full management. That is the same observe-versus-adopt split Crossplane expresses via managementPolicies. (I did not obtain a readable copy of the AWS ACK intro blog.)
- Quote: "ACK will sync the resource status from AWS but will never create, update, or delete the underlying AWS resource."

### 8. Provider development guide (managed reconciler)
- URL: https://github.com/crossplane/crossplane/blob/main/contributing/guide-provider-development.md
- Title: guide-provider-development.md
- Publisher: Crossplane maintainers
- Kind: Architecture and contributor guide
- Summary: Describes `managed.Reconciler` phases (Connect, Observe, Create, Update, Delete) and the five-method `managed.ExternalClient` interface that provider authors implement. Stresses idempotency, late initialization of output-only fields into the object, and publishing connection details. Good for explaining to newcomers that MRs are just a controller pattern with a shared reconciler library. The page may be dated relative to current crossplane-runtime (it lacks the Disconnect step and newer features), so verify before quoting specifics.
- Quote: "Delete implementations must not return an error when asked to delete a non-existent external resource."

### 9. GitHub issue: API server becomes unresponsive with too many CRDs
- URL: https://github.com/crossplane/crossplane/issues/2649
- Title: API Server (and clients) becomes unresponsive with too many CRDs
- Publisher: Crossplane community (GitHub issue)
- Kind: Issue thread and postmortem-style discussion
- Summary: Installing 100+ CRD Terrajet-based providers made API servers slow. Root causes: OpenAPI spec recomputation on each CRD registration and client discovery rate limits (around 20 rps with 30 rps burst). Observed outcomes: GKE control planes unresponsive at about 680 CRDs, kubectl taking 14+ seconds, Rancher slowness, and a second large provider taking about 70 minutes to install versus 20 for the first. Upstream raised discovery limits, but this was not considered sufficient at the time.

### 10. Scaling Kubernetes to Thousands of CRDs
- URL: https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds
- Title: Scaling Kubernetes to Thousands of CRDs
- Publisher: Upbound
- Kind: Engineering blog
- Summary: Explains why multi-cloud providers (AWS, Azure, GCP) imply roughly 2,000 CRDs, with 4+ MiB of API server memory per CRD and about 300 API group-versions requiring discovery requests. Lists upstream fixes: discovery rate limit increases (Kubernetes 1.22+), checksum-based client cache instead of fsync, lazy OpenAPI computation (1.23+), consolidated etcd client logging (1.25+). Shows the upstream-contribution path taken by a platform vendor.
- Quote: "Each time a CRD was added or updated the API server was doing serialization work that became more expensive."

### 11. Managed Resource Activation Policies (and MRDs)
- URL: https://docs.crossplane.io/latest/managed-resources/managed-resource-activation-policies/
- Title: Managed Resource Activation Policies, Crossplane v2.4
- Publisher: Crossplane Authors / CNCF
- Kind: Official documentation
- Summary: Crossplane v2 represents each MR type as a ManagedResourceDefinition (MRD) and uses ManagedResourceActivationPolicies (MRAPs) with exact or prefix-wildcard patterns to activate only the MRDs a cluster needs. Providers that implement "safe-start" can activate MRDs on demand. This is the official answer to the CRD-scale problem in sources 9 and 10, and shows MR types becoming selectively installed.

### 12. Crossplane ADOPTERS.md
- URL: https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md
- Title: ADOPTERS.md
- Publisher: Crossplane project (self-reported by adopters)
- Kind: Adopter list
- Summary: Self-reported production usage: Nike (internal developer platform managing thousands of resources), Autodesk (unified control plane), SAP (100+ KRM control planes, thousands of MRs as of Feb 2024), Deutsche Kreditbank (10+ EKS clusters, thousands of resources), IBM, Elastic, UiPath, VMware Tanzu, DB Systel (Deutsche Bahn; 100% GitOps self-service), Nokia, and Akamai (provider-ceph orchestrating up to 200k MRs). Entries are one-line claims, not verified case studies.
- Quote: "Crossplane powers the internal developer platform managing thousands of resources from development to production."

### 13. Configuring Crossplane with Argo CD
- URL: https://docs.crossplane.io/latest/guides/crossplane-with-argo-cd/
- Title: Configuring Crossplane with Argo CD
- Publisher: Crossplane Authors / CNCF
- Kind: Official integration guide
- Summary: Argo CD should use annotation-based resource tracking, because label tracking conflicts with Crossplane's own labels on resources it composes. It needs custom Lua health checks that read Ready and Synced conditions, should hide ProviderConfigUsage objects to avoid UI overload, and may need `ARGOCD_K8S_CLIENT_QPS` raised (to 300) as CRDs multiply.
- Quote: "Argo CD synchronizes Kubernetes resource manifests stored in a Git repository with those running in a Kubernetes cluster (GitOps)."

### 14. Usages (deletion ordering and protection)
- URL: https://docs.crossplane.io/latest/managed-resources/usages/
- Title: Usages, Crossplane v2.4
- Publisher: Crossplane Authors / CNCF
- Kind: Official documentation
- Summary: A Usage object marks one resource as in use, optionally by another. It blocks deletion of the used resource until users are gone, giving deletion ordering (for example, do not delete a database subnet before the database) and accidental-deletion protection via a reason field. Fields: of, by, reason, replayDeletion. Complements managementPolicies as a second guardrail.
- Quote: "Deletion ordering by ensuring that a resource isn't deleted before the deletion of its dependent resources."

### 15. Flux Kustomization: pruning and garbage collection
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomizations
- Publisher: Flux project / CNCF
- Kind: Official documentation
- Summary: With `spec.prune: true`, objects that were applied earlier but disappeared from Git are deleted, tracked via `.status.inventory`. The annotation `kustomize.toolkit.fluxcd.io/prune: disabled` exempts an object. `spec.deletionPolicy` (MirrorPrune, Delete, WaitForTermination, Orphan) governs what happens when the Kustomization itself is deleted. For MRs, a Git removal chain becomes: Flux prunes the object, then the provider deletes the cloud resource, unless Delete is excluded from managementPolicies. I read only the first 100,000 of about 121,000 characters.
- Quote: "Garbage collection means that the Kubernetes objects that were previously applied on the cluster but are missing from the current source revision, are removed from the cluster automatically."

## Real-world use cases

Internal developer platforms are the dominant story. Nike, Autodesk, SAP, DB Systel and Deutsche Kreditbank report using Crossplane to give teams self-service infrastructure, with MRs as the lowest layer under higher-level compositions (source 12). SAP's claim of 100+ control planes and thousands of MRs, and Akamai's provider-ceph at up to 200k MRs, show MR counts well beyond hand-managed scale. These are self-reported one-liners, so treat them as pointers for further digging rather than case studies.

Brownfield adoption is the second typical scenario. A team with existing RDS, S3 or Cloud SQL resources creates MRs with external names and Observe policy, validates atProvider, then promotes to full control (sources 2, 3, 5). Another is read-only reference: a composition consumes data from a database owned by another team, using Observe permanently (sources 3, 4). The Config Connector acquire-by-name model (source 6) and ACK read-only annotation (source 7) serve the same two needs on Google Cloud and AWS.

A third scenario is multi-tenant and multi-cluster operation, where MRs are scoped to namespaces in Crossplane v2 and paired with ProviderConfigs for per-team credentials (sources 1, 4). GitOps pipelines with Argo CD or Flux deliver the MRs and compositions (sources 13, 15).

## Pitfalls and how tools address them

Accidental deletion of real infrastructure. By default deleting the Kubernetes object deletes the cloud resource, in Crossplane (source 4), Config Connector (source 6) and by default with ACK. Crossplane answers with management policies that omit Delete (source 1, 4), Config Connector with a `deletion-policy: abandon` annotation set before deletion (source 6), ACK with read-only mode (source 7), Flux with prune opt-outs and deletionPolicy Orphan (source 15), and Crossplane Usages as a protection and ordering layer (source 14). The v1 `deletionPolicy: Orphan` is absent on namespaced v2 MRs, which use policies instead (source 4), so older blog advice (source 5) needs translation.

Silent loss of management. Synced=False with Ready=True means the resource still works while drift correction stops, often from expired credentials or removed permissions. Alert on persistent Synced=False and read errors from the right (source 4).

Stuck deletion. Every MR carries a finalizer. If the provider is absent, deletion hangs, including namespace deletion. Removing the finalizer by hand orphans the external resource (source 4).

Import mistakes. Copying atProvider into forProvider is manual. Names can be ambiguous across regions, so add a disambiguating forProvider field (source 2). Observe disables late-initialization and relaxes required-field validation, which can confuse users (source 3). Importing something not yet fully provisioned can fail (source 5). Drift from manual changes will be reverted once full control is on (source 5).

Immutable fields. Crossplane does not delete-and-recreate to change them, unlike Terraform, so a change may simply not apply (source 1).

GitOps tool conflicts. Argo CD label tracking collides with Crossplane's labels, so use annotation tracking, plus health scripts and higher client QPS (source 13). Flux prune cascades into cloud deletion unless guarded (source 15).

Scale. Thousands of CRDs overload API server discovery and OpenAPI computation (sources 9, 10). Remedies are upstream Kubernetes fixes (source 10) and v2 MRDs with activation policies and safe-start (source 11).

## Tutorial and explainer links

- https://oncallready.dev/learn/platform-engineering-backstage-and-crossplane/managed-resources-synced-ready-external-names-and-policies/ - best plain-language walkthrough of Synced, Ready, external names, policies and finalizers.
- https://docs.crossplane.io/latest/managed-resources/managed-resources/ - canonical reference for MR fields and policies.
- https://docs.crossplane.io/latest/guides/import-existing-resources/ - the hands-on import recipe.
- https://docs.crossplane.io/latest/get-started/get-started-with-managed-resources/ - official getting-started page (found in search results; not read).
- https://github.com/crossplane/crossplane/blob/main/design/design-doc-observe-only-resources.md - why observe-only exists and what was traded off.
- https://aws-controllers-k8s.github.io/docs/guides/readonly/ - short comparison point for the observe-only idea outside Crossplane.
- https://www.upbound.io/blog/scaling-kubernetes-to-thousands-of-crds - explains the API machinery cost behind "one CRD per resource type".

## Open questions

- Management policies are labelled beta in the import guide (source 2) while the managed resources page presents them as standard. Current feature-lifecycle status for v2.x should be checked at https://docs.crossplane.io/latest/learn/feature-lifecycle/ (not read).
- Source 5 and the design doc (3) use `ObserveOnly`/`deletionPolicy`, while current docs use a policy list. The mapping from the old enum to the list is not spelled out in any page I read.
- Source 4 says the external-name defaults to the object name for S3, while source 1 says external resources are named like the Kubernetes object by default. Per-provider variation is not documented in one place.
- How Cluster API, kro and plain controller-runtime operators handle adoption and orphaning was not covered by a readable primary source in this pass. The ACK intro blog and Cluster API docs remain unread. The Crossplane docs also do not clearly state how v2 namespaced MRs behave when a namespace is deleted while the provider is down beyond the finalizer note in source 4.
- Config Connector's acquire-by-name behavior (source 6) was extracted from a summarised fetch and lacks detail on conflict handling when two objects target the same cloud resource.
- The MR doc's full text (source 1) was read through a summarising fetch rather than line by line, so subtle caveats may be missing.
