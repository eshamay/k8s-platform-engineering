---
title: Config Connector
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [KCC, Google Config Connector]
tags: [tool, provider, gcp]
---

# Config Connector

Config Connector (KCC) is Google's set of provider controllers that expose Google Cloud resources as Kubernetes custom resources, so they receive the same RBAC and GitOps flow as any other object. It is one of the controllers that act directly on an external system, which is the "direct control" pattern described in the Kubernetes controller documentation. [[sources/research-universal-control-plane]]

## Deletion and acquisition behavior

Deleting a Config Connector resource deletes the associated Google Cloud resource by default. Setting the annotation `deletion-policy: abandon` retains the cloud resource. Config Connector also acquires an existing cloud resource when the manifest name matches it, which helps with migration but can collide with resources that were never meant to be managed. See [[findings/destructive-deletion-of-external-resources]] and [[findings/immutable-fields-and-drift-collisions]].

## Reconciliation strategy

Config Connector reconciles level-triggered against the cloud API, periodically correcting drift once a resource is UpToDate and retrying failures with exponential backoff capped at two minutes. The annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` tunes or, at "0", disables the interval, longer intervals reduce API quota use, unreadable fields such as passwords are actuated only on spec change, and immutable-field changes need recreation. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]] and [[examples/cloud-console-changes-reverted-by-provider-controllers]].

## Role in platforms

The kro announcement uses Config Connector to build a self-service GKE cluster API. See [[examples/self-service-gke-cluster-with-kro]]. It is a [[concepts/provider]] in the vocabulary of this wiki, and its objects are [[concepts/managed-resource]] instances.

## Ignoring unspecified fields

Config Connector offers Absent mode (default from 1.123.1), which does not copy unspecified fields into the spec, and a legacy Merge mode that caused endless reconcile loops, drift fights with Config Sync because lists are atomic, and HTTP 400 errors from GET/PUT asymmetry. Migration uses the abandon deletion policy. [[sources/research-declarative-vs-imperative]] See [[findings/defaulting-and-drift-reconcile-loops]] and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].

## To research

The dossier read only the delete and manage page, through a summarizing fetch. Resource coverage, reconcile interval, and scale behavior are unknown. See [[open-knowledge-gaps]].

## Controller types

Config Connector has direct (Go SDK), Terraform-based, DCL-based, and IAM controllers behind a routing controller whose namespace-level overrides beat build-time defaults. Direct controllers use less CPU and memory and give better latency and status. The controller-types page says nothing about reconcile intervals or drift cadence, so that remains a gap. [[sources/research-self-healing-and-drift-detection]] See [[comparisons/drift-detection-mechanisms-across-tools]] and [[open-knowledge-gaps]].

## Credentials and GitOps role

Config Connector installs CRDs and controllers that reconcile Kubernetes objects into Google Cloud resources asynchronously, using the controller's own IAM service account instead of individual developers' identities. This centralizes cloud authorization behind Kubernetes RBAC, the same credential-concentration trade-off GitOps agents raise. The dossier did not read deletion or abandon behavior. [[sources/research-gitops-pull-based-delivery]] See [[findings/blast-radius-and-privilege-centralization]] and [[concepts/gitops-pull-based-delivery]].

## Status semantics

The spec and status dossier fetched no primary source on Config Connector, so its condition vocabulary and `observedGeneration` behavior were unknown then. They are now read from source: see the Conditions section and the m3 section at the end of this page. [[sources/research-spec-status-split]]

## Coverage gap in the operator-pattern dossier

The operator-pattern dossier fetched no page on Config Connector, so its failure handling as an operator is not covered by that source. [[sources/research-operator-pattern]] See [[open-knowledge-gaps]].

## Idempotent create by acquisition

The managing-and-deleting-resources page says that if a resource does not exist Config Connector creates it, and if a resource with the same name already exists in the organization, project, or folder it acquires and manages it. Resources with service-generated IDs can be acquired only through the `resourceID` field. Deleting the Kubernetes object deletes the cloud resource unless `cnrm.cloud.google.com/deletion-policy: abandon` is set. The dossier read only this page for Config Connector. [[sources/research-idempotency]] See [[examples/config-connector-acquires-an-existing-google-cloud-resource-by-name]] and [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].

## Deletion policy and finalizer behavior

Deleting a Config Connector object deletes the Google Cloud resource by default. The annotation `cnrm.cloud.google.com/deletion-policy: abandon` keeps the resource, and it must be applied before the manifest is deleted. The official page does not discuss finalizers. Source shows `cnrm.cloud.google.com/finalizer` and a second `cnrm.cloud.google.com/deletion-defender` finalizer, see [[findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup]] and [[findings/config-connector-has-a-second-deletion-defender-finalizer-and-removes-both-finalizers-with-an-abandon-setting-when-its-crd-is-uninstalled]]. A consultancy blog reports that the finalizer deletes a resource that production uses, and that deleting the GKE cluster stops the controller and orphans cloud resources that keep billing. [[sources/research-finalizers]] See [[findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone]] and [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]].

## Abandon policy versus owner references

Deleting a Config Connector object deletes the real Google Cloud resource by default, and the annotation `cnrm.cloud.google.com/deletion-policy: abandon` keeps it. The page shows Kubernetes delete semantics reaching an external system through finalizer-style controller handling and not through owner references. [[sources/research-owner-references-and-garbage-collection]] See [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].

## Conditions

Config Connector uses a single `Ready` condition: `False` with reason `Updating` while it calls Google APIs (the message names the first changed field), `True` with reason `UpToDate`, and `False` with reason `UpdateFailed` carrying the error. Correction note: this section previously said `UpdateFailure` and "the message names the first changed field", both taken from the design document. The shipped code uses `UpdateFailed`, and the first-field-path message and the operation-ID reason are not in code. [[sources/research-conditions]] See [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]] and [[concepts/conditions]].

## Acquire by name and the abandon annotation

Config Connector acquires an existing Google Cloud resource when the manifest name or ID matches it, so import is implicit and not flagged. Deleting the Kubernetes object deletes the cloud resource by default, and the annotation `cnrm.cloud.google.com/deletion-policy: abandon` must be set before deletion to keep it. The dossier read this page through a summarized fetch and found nothing on conflict handling when two objects target the same cloud resource. [[sources/research-managed-resource]] See [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]].

## Leaf provider beneath composite layers

The composite resources dossier shows Config Connector as a leaf provider. The Google Cloud kro announcement describes a platform admin exposing a GKE cluster API whose underlying resources are Config Connector objects for the cluster, node pools, IAM service account and policy member, and policies, with only cluster name, node pool name, max nodes, location, and optional networks exposed to users. The dossier read none of Config Connector's own pages on readiness, deletion, or abandon semantics. [[sources/research-composite-resource]] See [[examples/self-service-gke-cluster-with-kro]] and [[comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers]].

## Permission model beneath compositions

Config Connector reconciles with its own service account identity, not the submitter's, so the right to create objects in a Config Connector namespace is effectively the right to change cloud resources. Google recommends tightly controlling who can create them, for example by applying them from a trusted repository. The dossier states this for Config Connector only and calls its extension to Crossplane and kro an inference. It also describes Config Connector as a managed-resource layer that compositions and kro graphs wrap, and says nothing about readiness or deletion-policy interplay when wrapped. [[sources/research-composition]] See [[findings/blast-radius-and-privilege-centralization]].

## Provider behavior in the Providers dossier

The Providers dossier read the overview in full. Reconciliation runs as the Config Connector IAM service account, so creating the Kubernetes object is effectively permission to change cloud resources, see [[findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions]]. Namespaced mode binds namespaces to separate service accounts and projects, see [[examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts]]. Terraform and DCL controllers use a default 2-minute maximum backoff, and setting the `reconcile-interval-in-seconds` annotation to 0 disables drift correction. Deleting stateful resources such as Spanner instances can lose data, see [[findings/deleting-stateful-resources-through-a-provider-can-lose-data]]. [[sources/research-provider]]

## Named as a kro-compatible leaf provider

The kro overview says kro works with any CRD and names ACK, Azure Service Operator, and Config Connector as examples, and the engineer's blog comparison says kro relies on them because it orchestrates only Kubernetes objects. The dossier read no primary Config Connector page. See [[entities/kro]] and [[comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog]]. [[sources/research-kro-and-abstraction-models]]

## Landscape view: identity and ordering

The overview says Config Connector "reconciles the configured state against Google Cloud APIs asynchronously" and acts with its own IAM service account, which centralizes authorization, see [[findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights]]. A single practitioner blog reports no Terraform-style dependency ordering and unordered deletion under Argo CD, worked around with sync waves and a finalizer-patching CronJob, see [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]]. The dossier did not confirm namespaced versus cluster mode details or deletion policies. See [[examples/google-cloud-shops-deliver-config-connector-resources-from-git-while-the-controller-s-own-identity-makes-the-cloud-calls]]. [[sources/research-landscape]]

## Reconcile interval and drift cadence in the reconcile-defaults dossier

The reconciliation page says resources reconcile on every update and "after a jitter period with an average based on the preconfigured default interval". In source the global default mean is 10 minutes, the interval resolves from the Terraform service mapping, DCL metadata, IAM kind constants, and then the default, jitter spreads requeues between 0.5 and 1.5 times the mean (5 to 15 minutes by default), the annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` overrides it per resource, setting it to 0 is documented as irreversible, and failure backoff is capped at 120 seconds by default. Per-kind Terraform and DCL values were not read, so whether the controller types differ by default is open. [[sources/research-gap-g3-reconcile-defaults]] See [[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]].

## Acquisition side effects and a failed create in the leaked-resources dossier

The dossier adds two dated Config Connector reports. Issue 14236 (2026-10-21, v1.117.0, open) says acquiring an existing StorageBucket removed its CSEK `FullyRestricted` enforcement config because the CRD has no field for it, a reporter claim not confirmed by maintainers in the text read ([[examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config]]). Issue 648 (2022, v1.76.0) shows a MonitoringAlertPolicy created on every reconcile although the create returned HTTP 400, which a Config Connector engineer attributed to the GCP API ([[examples/config-connector-issue-648-an-alert-policy-was-created-on-every-reconcile-although-the-create-returned-http-400]]). Issue 12740 (open) proposes that server-generated-ID resources fail terminally instead of being re-created, and issue 13840 shows a 409 when the server-generated ID was not set. See [[findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model]]. [[sources/research-gap-g1-leaked-resources-adoption]]

## Adopters file

The 2026-11-26 adopters dossier found no adopters file at the root of the GoogleCloudPlatform/k8s-config-connector repository, so no named Config Connector adopter is recorded from the project itself. [[sources/research-gap-g1-named-adopters]]

## First-party pitfall reports from the other-tool pitfalls dossier

The 2026-11-26 dossier read the Config Connector issue tracker (latest release v1.162.0, 2026-11-23). Issue 16444 says multi-cluster leader election can run a stale deletion against live GCP resources after failover ([[findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources]]). Issue 15930 says Direct-controller resources stick in Terminating when a parent is deleted first, and `deletion-policy: abandon` does not release them ([[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]]). The claim in issue 13335 that abandon leaves `managed-by-cnrm` and lease labels is SECONDARY-ONLY and unreproduced. Issue 12944 says a StorageBucket `spec.location` edit reported UpToDate while the bucket stayed put ([[findings/a-config-connector-storagebucket-location-edit-reported-uptodate-while-the-bucket-did-not-move]]). All were open reporter claims, not postmortems. The abandon guidance above therefore has a reported exception. [[sources/research-gap-g1-other-tool-pitfalls]]

## Status semantics read from source in the m3 dossier

The docs say `status` is read-only and that the `Ready` condition conveys readiness plus error or information through its reason and message, and important changes also appear as Kubernetes events. The lifecycle handler replaces the whole conditions list with one `Ready` entry and keeps `lastTransitionTime` unless the status value changes. Shipped reasons include `Updating`, `UpToDate`, `UpdateFailed`, `DependencyNotReady`, `DependencyNotFound`, `DependencyInvalid`, `ManagementConflict`, and `Unmanaged`. The docs label these as event types, but the same strings are used as `Ready` reasons in code. A top-level `status.observedGeneration` is written on every status update, and the per-condition line is commented out with a TODO. [[sources/research-gap-m3-status-conditions]] See [[findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code]], [[examples/config-connector-direct-controllers-write-a-top-level-observedgeneration-and-leave-the-per-condition-line-commented-out]], and [[examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration]].

## Server-side apply and field managers (m4 dossier)

Config Connector does not apply with server-side apply. Its lifecycle handler writes with `Update` and `Status().Update` under the field owner `cnrm-controller-manager`, skips entries from that manager when it computes the spec fields owned by others, and so reads fields set by a GitOps tool as user intent. A helper sends a tiny server-side apply patch under the manager `supports-ssa` only to create `managedFields` metadata. A repository collaborator's proposal, issue 11689 (closed 2026-10-04), says Argo CD needs server-side apply for the CRD bundle because of the annotation size limit. The public documentation page could not be read, so these statements come from source at commit 793f18c and from issues. The latest release read was v1.162.0, published 2026-11-23. [[sources/research-gap-m4-ssa-conflict-policy]] See [[findings/config-connector-writes-with-update-under-cnrm-controller-manager-and-reads-other-managers-fields-as-user-intent]] and [[examples/config-connector-issue-11689-a-collaborator-proposal-says-argo-cd-needs-server-side-apply-for-config-connector-s-crds]].

## Cache choices (m5 dossier)

By default the manager's client caches only ConfigConnector and ConfigConnectorContext objects and CRDs, disables caching for Namespace, Secret, ConfigMap and IAM kinds, and does not cache unstructured objects. The cache-everything mode is commented "Currently only used in preview". Client rate is QPS 20 and burst 30. A registration controller watches CRDs and registers one controller per group and kind, with the version taken from the CRD. See [[examples/config-connector-caches-only-its-own-configuration-kinds-by-default]] and [[findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately]]. [[sources/research-gap-m5-informers-caches]]
