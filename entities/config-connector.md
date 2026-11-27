---
title: Config Connector
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: medium-config-connector-pitfalls
    hash: c5b9825d753a
    ingested: 2026-11-26
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
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
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: [KCC, Google Config Connector]
tags: [tool, provider, gcp]
---

# Config Connector

Config Connector (KCC) is Google's set of provider controllers that expose Google Cloud resources as Kubernetes custom resources, so they receive the same RBAC and GitOps flow as any other object. It is one of the controllers that act directly on an external system, which is the "direct control" pattern described in the Kubernetes controller documentation. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## Deletion and acquisition behavior

Deleting a Config Connector resource deletes the associated Google Cloud resource by default. Setting the annotation `deletion-policy: abandon` retains the cloud resource. Config Connector also acquires an existing cloud resource when the manifest name matches it, which helps with migration but can collide with resources that were never meant to be managed. See [findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md) and [findings/immutable-fields-and-drift-collisions](../findings/immutable-fields-and-drift-collisions.md).

## Reconciliation strategy

Config Connector reconciles level-triggered against the cloud API, periodically correcting drift once a resource is UpToDate and retrying failures with exponential backoff capped at two minutes. The annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` tunes or, at "0", disables the interval, longer intervals reduce API quota use, unreadable fields such as passwords are actuated only on spec change, and immutable-field changes need recreation. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md) See [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md) and [examples/cloud-console-changes-reverted-by-provider-controllers](../examples/cloud-console-changes-reverted-by-provider-controllers.md).

## Role in platforms

The kro announcement uses Config Connector to build a self-service GKE cluster API. See [examples/self-service-gke-cluster-with-kro](../examples/self-service-gke-cluster-with-kro.md). It is a [concepts/provider](../concepts/provider.md) in the vocabulary of this wiki, and its objects are [concepts/managed-resource](../concepts/managed-resource.md) instances.

## Ignoring unspecified fields

Config Connector offers Absent mode (default from 1.123.1), which does not copy unspecified fields into the spec, and a legacy Merge mode that caused endless reconcile loops, drift fights with Config Sync because lists are atomic, and HTTP 400 errors from GET/PUT asymmetry. Migration uses the abandon deletion policy. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md) See [findings/defaulting-and-drift-reconcile-loops](../findings/defaulting-and-drift-reconcile-loops.md) and [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md).

## To research

The dossier read only the delete and manage page, through a summarizing fetch. Scale behavior is unknown. Correction note 2026-11-26: resource coverage by controller and the reconcile interval are now read from source, see the o9 section below. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Controller types

Config Connector has direct (Go SDK), Terraform-based, DCL-based, and IAM controllers behind a routing controller whose namespace-level overrides beat build-time defaults. Direct controllers use less CPU and memory and give better latency and status. The controller-types page says nothing about reconcile intervals or drift cadence. Correction note 2026-11-26: the intervals and the per-kind controller table are now read from source, see the o9 section below. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [comparisons/drift-detection-mechanisms-across-tools](../comparisons/drift-detection-mechanisms-across-tools.md) and [open-knowledge-gaps](../open-knowledge-gaps.md).

## Credentials and GitOps role

Config Connector installs CRDs and controllers that reconcile Kubernetes objects into Google Cloud resources asynchronously, using the controller's own IAM service account instead of individual developers' identities. This centralizes cloud authorization behind Kubernetes RBAC, the same credential-concentration trade-off GitOps agents raise. The dossier did not read deletion or abandon behavior. [sources/research-gitops-pull-based-delivery](../sources/research-gitops-pull-based-delivery.md) See [findings/blast-radius-and-privilege-centralization](../findings/blast-radius-and-privilege-centralization.md) and [concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md).

## Status semantics

The spec and status dossier fetched no primary source on Config Connector, so its condition vocabulary and `observedGeneration` behavior were unknown then. They are now read from source: see the Conditions section and the m3 section at the end of this page. [sources/research-spec-status-split](../sources/research-spec-status-split.md)

## Coverage gap in the operator-pattern dossier

The operator-pattern dossier fetched no page on Config Connector, so its failure handling as an operator is not covered by that source. [sources/research-operator-pattern](../sources/research-operator-pattern.md) See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Idempotent create by acquisition

The managing-and-deleting-resources page says that if a resource does not exist Config Connector creates it, and if a resource with the same name already exists in the organization, project, or folder it acquires and manages it. Resources with service-generated IDs can be acquired only through the `resourceID` field. Deleting the Kubernetes object deletes the cloud resource unless `cnrm.cloud.google.com/deletion-policy: abandon` is set. The dossier read only this page for Config Connector. [sources/research-idempotency](../sources/research-idempotency.md) See [examples/config-connector-acquires-an-existing-google-cloud-resource-by-name](../examples/config-connector-acquires-an-existing-google-cloud-resource-by-name.md) and [findings/adopt-or-create-can-take-over-a-look-alike-resource](../findings/adopt-or-create-can-take-over-a-look-alike-resource.md).

## Deletion policy and finalizer behavior

Deleting a Config Connector object deletes the Google Cloud resource by default. The annotation `cnrm.cloud.google.com/deletion-policy: abandon` keeps the resource, and it must be applied before the manifest is deleted. The official page does not discuss finalizers. Source shows `cnrm.cloud.google.com/finalizer` and a second `cnrm.cloud.google.com/deletion-defender` finalizer, see [findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup](../findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup.md) and [findings/config-connector-has-a-second-deletion-defender-finalizer-and-removes-both-finalizers-with-an-abandon-setting-when-its-crd-is-uninstalled](../findings/config-connector-has-a-second-deletion-defender-finalizer-and-removes-both-finalizers-with-an-abandon-setting-when-its-crd-is-uninstalled.md). A consultancy blog reports that the finalizer deletes a resource that production uses, and that deleting the GKE cluster stops the controller and orphans cloud resources that keep billing. [sources/research-finalizers](../sources/research-finalizers.md) See [findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone](../findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone.md) and [examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object](../examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object.md).

## Abandon policy versus owner references

Deleting a Config Connector object deletes the real Google Cloud resource by default, and the annotation `cnrm.cloud.google.com/deletion-policy: abandon` keeps it. The page shows Kubernetes delete semantics reaching an external system through finalizer-style controller handling and not through owner references. [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md) See [comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers](../comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers.md).

## Conditions

Config Connector uses a single `Ready` condition: `False` with reason `Updating` while it calls Google APIs (the message names the first changed field), `True` with reason `UpToDate`, and `False` with reason `UpdateFailed` carrying the error. Correction note: this section previously said `UpdateFailure` and "the message names the first changed field", both taken from the design document. The shipped code uses `UpdateFailed`, and the first-field-path message and the operation-ID reason are not in code. [sources/research-conditions](../sources/research-conditions.md) See [examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure](../examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure.md) and [concepts/conditions](../concepts/conditions.md).

## Acquire by name and the abandon annotation

Config Connector acquires an existing Google Cloud resource when the manifest name or ID matches it, so import is implicit and not flagged. Deleting the Kubernetes object deletes the cloud resource by default, and the annotation `cnrm.cloud.google.com/deletion-policy: abandon` must be set before deletion to keep it. The dossier read this page through a summarized fetch and found nothing on conflict handling when two objects target the same cloud resource. [sources/research-managed-resource](../sources/research-managed-resource.md) See [comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack](../comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack.md).

## Leaf provider beneath composite layers

The composite resources dossier shows Config Connector as a leaf provider. The Google Cloud kro announcement describes a platform admin exposing a GKE cluster API whose underlying resources are Config Connector objects for the cluster, node pools, IAM service account and policy member, and policies, with only cluster name, node pool name, max nodes, location, and optional networks exposed to users. The dossier read none of Config Connector's own pages on readiness, deletion, or abandon semantics. [sources/research-composite-resource](../sources/research-composite-resource.md) See [examples/self-service-gke-cluster-with-kro](../examples/self-service-gke-cluster-with-kro.md) and [comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers](../comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers.md).

## Permission model beneath compositions

Config Connector reconciles with its own service account identity, not the submitter's, so the right to create objects in a Config Connector namespace is effectively the right to change cloud resources. Google recommends tightly controlling who can create them, for example by applying them from a trusted repository. The dossier states this for Config Connector only and calls its extension to Crossplane and kro an inference. It also describes Config Connector as a managed-resource layer that compositions and kro graphs wrap, and says nothing about readiness or deletion-policy interplay when wrapped. [sources/research-composition](../sources/research-composition.md) See [findings/blast-radius-and-privilege-centralization](../findings/blast-radius-and-privilege-centralization.md).

## Provider behavior in the Providers dossier

The Providers dossier read the overview in full. Reconciliation runs as the Config Connector IAM service account, so creating the Kubernetes object is effectively permission to change cloud resources, see [findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions](../findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions.md). Namespaced mode binds namespaces to separate service accounts and projects, see [examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts](../examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts.md). Terraform and DCL controllers use a default 2-minute maximum backoff, and setting the `reconcile-interval-in-seconds` annotation to 0 disables drift correction. Deleting stateful resources such as Spanner instances can lose data, see [findings/deleting-stateful-resources-through-a-provider-can-lose-data](../findings/deleting-stateful-resources-through-a-provider-can-lose-data.md). [sources/research-provider](../sources/research-provider.md)

## Named as a kro-compatible leaf provider

The kro overview says kro works with any CRD and names ACK, Azure Service Operator, and Config Connector as examples, and the engineer's blog comparison says kro relies on them because it orchestrates only Kubernetes objects. The dossier read no primary Config Connector page. See [entities/kro](kro.md) and [comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog](../comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog.md). [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Landscape view: identity and ordering

The overview says Config Connector "reconciles the configured state against Google Cloud APIs asynchronously" and acts with its own IAM service account, which centralizes authorization, see [findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights](../findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights.md). A single practitioner blog reports no Terraform-style dependency ordering and unordered deletion under Argo CD, worked around with sync waves and a finalizer-patching CronJob, see [findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering](../findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering.md). The dossier did not confirm namespaced versus cluster mode details or deletion policies. See [examples/google-cloud-shops-deliver-config-connector-resources-from-git-while-the-controller-s-own-identity-makes-the-cloud-calls](../examples/google-cloud-shops-deliver-config-connector-resources-from-git-while-the-controller-s-own-identity-makes-the-cloud-calls.md). [sources/research-landscape](../sources/research-landscape.md)

## Reconcile interval and drift cadence in the reconcile-defaults dossier

The reconciliation page says resources reconcile on every update and "after a jitter period with an average based on the preconfigured default interval". In source the global default mean is 10 minutes, the interval resolves from the Terraform service mapping, DCL metadata, IAM kind constants, and then the default, jitter spreads requeues between 0.5 and 1.5 times the mean (5 to 15 minutes by default), the annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` overrides it per resource, setting it to 0 is documented as irreversible, and failure backoff is capped at 120 seconds by default. Per-kind Terraform and DCL values were not read, so whether the controller types differ by default is open. [sources/research-gap-g3-reconcile-defaults](../sources/research-gap-g3-reconcile-defaults.md) See [findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible](../findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible.md).

## Acquisition side effects and a failed create in the leaked-resources dossier

The dossier adds two dated Config Connector reports. Issue 14236 (2026-10-21, v1.117.0, open) says acquiring an existing StorageBucket removed its CSEK `FullyRestricted` enforcement config because the CRD has no field for it, a reporter claim not confirmed by maintainers in the text read ([examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config](../examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config.md)). Issue 648 (2022, v1.76.0) shows a MonitoringAlertPolicy created on every reconcile although the create returned HTTP 400, which a Config Connector engineer attributed to the GCP API ([examples/config-connector-issue-648-an-alert-policy-was-created-on-every-reconcile-although-the-create-returned-http-400](../examples/config-connector-issue-648-an-alert-policy-was-created-on-every-reconcile-although-the-create-returned-http-400.md)). Issue 12740 (open) proposes that server-generated-ID resources fail terminally instead of being re-created, and issue 13840 shows a 409 when the server-generated ID was not set. See [findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model](../findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model.md). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)

## Adopters file

The 2026-11-26 adopters dossier found no adopters file at the root of the GoogleCloudPlatform/k8s-config-connector repository, so no named Config Connector adopter is recorded from the project itself. [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md)

## First-party pitfall reports from the other-tool pitfalls dossier

The 2026-11-26 dossier read the Config Connector issue tracker (latest release v1.162.0, 2026-11-23). Issue 16444 says multi-cluster leader election can run a stale deletion against live GCP resources after failover ([findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources](../findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources.md)). Issue 15930 says Direct-controller resources stick in Terminating when a parent is deleted first, and `deletion-policy: abandon` does not release them ([findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them](../findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them.md)). The claim in issue 13335 that abandon leaves `managed-by-cnrm` and lease labels is SECONDARY-ONLY and unreproduced. Issue 12944 says a StorageBucket `spec.location` edit reported UpToDate while the bucket stayed put ([findings/a-config-connector-storagebucket-location-edit-reported-uptodate-while-the-bucket-did-not-move](../findings/a-config-connector-storagebucket-location-edit-reported-uptodate-while-the-bucket-did-not-move.md)). All were open reporter claims, not postmortems. The abandon guidance above therefore has a reported exception. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md)

## Status semantics read from source in the m3 dossier

The docs say `status` is read-only and that the `Ready` condition conveys readiness plus error or information through its reason and message, and important changes also appear as Kubernetes events. The lifecycle handler replaces the whole conditions list with one `Ready` entry and keeps `lastTransitionTime` unless the status value changes. Shipped reasons include `Updating`, `UpToDate`, `UpdateFailed`, `DependencyNotReady`, `DependencyNotFound`, `DependencyInvalid`, `ManagementConflict`, and `Unmanaged`. The docs label these as event types, but the same strings are used as `Ready` reasons in code. A top-level `status.observedGeneration` is written on every status update, and the per-condition line is commented out with a TODO. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) See [findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code](../findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code.md), [examples/config-connector-direct-controllers-write-a-top-level-observedgeneration-and-leave-the-per-condition-line-commented-out](../examples/config-connector-direct-controllers-write-a-top-level-observedgeneration-and-leave-the-per-condition-line-commented-out.md), and [examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration](../examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration.md).

## Server-side apply and field managers (m4 dossier)

Config Connector does not apply with server-side apply. Its lifecycle handler writes with `Update` and `Status().Update` under the field owner `cnrm-controller-manager`, skips entries from that manager when it computes the spec fields owned by others, and so reads fields set by a GitOps tool as user intent. A helper sends a tiny server-side apply patch under the manager `supports-ssa` only to create `managedFields` metadata. A repository collaborator's proposal, issue 11689 (closed 2026-10-04), says Argo CD needs server-side apply for the CRD bundle because of the annotation size limit. The public documentation page could not be read, so these statements come from source at commit 793f18c and from issues. The latest release read was v1.162.0, published 2026-11-23. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) See [findings/config-connector-writes-with-update-under-cnrm-controller-manager-and-reads-other-managers-fields-as-user-intent](../findings/config-connector-writes-with-update-under-cnrm-controller-manager-and-reads-other-managers-fields-as-user-intent.md) and [examples/config-connector-issue-11689-a-collaborator-proposal-says-argo-cd-needs-server-side-apply-for-config-connector-s-crds](../examples/config-connector-issue-11689-a-collaborator-proposal-says-argo-cd-needs-server-side-apply-for-config-connector-s-crds.md).

## Cache choices (m5 dossier)

By default the manager's client caches only ConfigConnector and ConfigConnectorContext objects and CRDs, disables caching for Namespace, Secret, ConfigMap and IAM kinds, and does not cache unstructured objects. The cache-everything mode is commented "Currently only used in preview". Client rate is QPS 20 and burst 30. A registration controller watches CRDs and registers one controller per group and kind, with the version taken from the CRD. See [examples/config-connector-caches-only-its-own-configuration-kinds-by-default](../examples/config-connector-caches-only-its-own-configuration-kinds-by-default.md) and [findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately](../findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately.md). [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

## Admission and CRD footprint

Config Connector runs a separate webhook-manager with ten fail-closed handlers and an HPA of 2 to 20 replicas ([findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail](../findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail.md)), and ships 883 CRD files, the largest 579,353 bytes ([findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind](../findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind.md)). [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Conflict handling when two objects target one resource (m7 dossier)

Correction note, 2026-11-26: the "Acquire by name and the abandon annotation" section above says the dossier found nothing on conflict handling. The "Managing conflicts" page answers it. Two objects in different namespaces on one cloud resource is "possible, but not recommended", prevention is a lease stored in the labels `cnrm-lease-holder-id` and `cnrm-lease-expiration`, a loser shows `ManagementConflict`, and the annotation `cnrm.cloud.google.com/management-conflict-prevention-policy` defaults to `none`. It does not work for resources without labels. See [findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set](../findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set.md), [examples/config-connector-lease-labels-gate-two-namespaces-that-manage-one-google-cloud-resource](../examples/config-connector-lease-labels-gate-two-namespaces-that-manage-one-google-cloud-resource.md), and [decisions/set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition](../decisions/set-config-connector-management-conflict-prevention-to-none-or-resource-or-avoid-acquisition.md). Failure handling (backoff capped at 2 minutes, any-order convergence, the Ready condition) is in [findings/argo-cd-and-config-connector-document-bounded-exponential-backoff-and-status-based-health-for-failure-handling](../findings/argo-cd-and-config-connector-document-bounded-exponential-backoff-and-status-based-health-for-failure-handling.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Under a GitOps agent (o3 dossier)

Deleting the object deletes the Google Cloud resource by default, and `cnrm.cloud.google.com/deletion-policy: abandon` must be present before the delete, which is the documented default that Argo CD prune and Flux prune trigger as ordinary deletes. The `state-into-spec` default is `Absent` for resources created from 1.123.1 and earlier versions defaulted to `Merge`, and `Merge` populates unspecified fields that Config Sync and Argo CD treat as drift because both treat lists as atomic, see [findings/config-connector-state-into-spec-merge-populates-unspecified-fields-that-argo-cd-and-config-sync-treat-as-drift-and-absent-is-the-default-from-1-123-1](../findings/config-connector-state-into-spec-merge-populates-unspecified-fields-that-argo-cd-and-config-sync-treat-as-drift-and-absent-is-the-default-from-1-123-1.md). Argo CD ships a built-in health script for the group, and issue 30164 shows a kind stuck in Progressing, see [findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves](../findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves.md) and [examples/argo-cd-issue-30164-config-connector-customize-kinds-stayed-progressing-because-the-health-script-did-not-handle-status-healthy](../examples/argo-cd-issue-30164-config-connector-customize-kinds-stayed-progressing-because-the-health-script-did-not-handle-status-healthy.md). Issue 837 is a SECONDARY-ONLY report of Argo CD 2.7.6 replacing DNSRecordSet objects, see [examples/config-connector-issue-837-argo-cd-2-7-6-kept-replacing-dnsrecordset-objects-until-the-default-annotations-were-added-explicitly](../examples/config-connector-issue-837-argo-cd-2-7-6-kept-replacing-dnsrecordset-objects-until-the-default-annotations-were-added-explicitly.md). Flux has no Config Connector entry in its CEL cheatsheet, see [findings/flux-judges-provider-managed-resources-through-kstatus-or-cel-health-check-expressions-and-its-cel-cheatsheet-lists-crossplane-but-not-config-connector-or-ack](../findings/flux-judges-provider-managed-resources-through-kstatus-or-cel-health-check-expressions-and-its-cel-cheatsheet-lists-crossplane-but-not-config-connector-or-ack.md). No test prunes a Config Connector object end to end under either agent. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

## Install modes, deletion policy, and known issues (o4 dossier)

The 2026-11-26 o4 dossier replaces the earlier "dossier did not confirm namespaced versus cluster mode details or deletion policies" statements in this page. Namespaced mode is the default in the operator CRD and Google's recommendation, it needs one `ConfigConnectorContext` per namespace, and cluster mode takes exactly one of `googleServiceAccount` or `credentialSecretName`, see [findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential](../findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential.md). The deletion policy has two constants in source, `delete` and `abandon`, and only `abandon` changes the path, with the Terraform-based controller path unverified, see [findings/config-connector-deletion-policy-has-two-source-values-and-only-abandon-changes-the-delete-path-and-the-terraform-based-controller-path-is-unverified](../findings/config-connector-deletion-policy-has-two-source-values-and-only-abandon-changes-the-delete-path-and-the-terraform-based-controller-path-is-unverified.md). A Google design document describes a child stuck on `DependencyNotFound` after its parent was deleted first, and no read documentation describes ordered teardown, see [findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown](../findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown.md). Known issues for versions 1.132.0 to 1.134.1 are in [findings/config-connector-known-issues-record-a-webhook-tls-race-before-1-134-1-and-direct-reconciler-regressions-in-1-132-0-and-1-134-0](../findings/config-connector-known-issues-record-a-webhook-tls-race-before-1-134-1-and-direct-reconciler-regressions-in-1-132-0-and-1-134-0.md), and the GKE add-on lag is in [findings/the-gke-config-connector-add-on-can-lag-the-latest-release-by-12-months-or-more-and-google-discourages-it-for-production](../findings/the-gke-config-connector-add-on-can-lag-the-latest-release-by-12-months-or-more-and-google-discourages-it-for-production.md). Open issues 534, 479, and 2894 are reporter claims, see [examples/config-connector-issue-534-deleting-a-bigquerydataset-before-its-tables-left-both-in-failure-and-the-issue-has-been-open-since-2021](../examples/config-connector-issue-534-deleting-a-bigquerydataset-before-its-tables-left-both-in-failure-and-the-issue-has-been-open-since-2021.md), [examples/config-connector-issue-479-a-containernodepool-delete-stuck-after-a-quota-error-on-kcc-1-46-0](../examples/config-connector-issue-479-a-containernodepool-delete-stuck-after-a-quota-error-on-kcc-1-46-0.md), and [examples/config-connector-issue-2894-a-reporter-says-kcc-lacks-terraform-s-dependency-graph-and-owner-reference-cleanup-left-ghost-tag-bindings](../examples/config-connector-issue-2894-a-reporter-says-kcc-lacks-terraform-s-dependency-graph-and-owner-reference-cleanup-left-ghost-tag-bindings.md). Direct comparison with Crossplane: [findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions](../findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions.md). [sources/research-gap-o4-config-connector-ack](../sources/research-gap-o4-config-connector-ack.md)

## Controller kind per resource and cadence from the o9 dossier

Update 2026-11-26: the per-kind mapping is a Go table, `ControllerConfigStatic` in `pkg/controller/resourceconfig/static_config.go`, with 814 entries at master commit 5cce7c7e. By default controller it has Direct 539, Terraform 206, DCL 65 and 4 IAM-specific kinds, and 110 kinds support more than one controller ([findings/config-connector-s-static-config-table-lists-814-kinds-and-sets-direct-as-the-default-for-539-of-them](../findings/config-connector-s-static-config-table-lists-814-kinds-and-sets-direct-as-the-default-for-539-of-them.md)). The controller-types page says new resources use the direct controller by default and existing ones are migrated regularly, a namespace override beats the build-time default, and the live CRD labels `cnrm.cloud.google.com/tf2crd` and `cnrm.cloud.google.com/dcl2crd` identify Terraform and DCL, with neither meaning direct ([findings/config-connector-routes-a-kind-to-its-controller-by-namespace-override-then-static-default-and-a-live-crd-label-shows-which-one-runs](../findings/config-connector-routes-a-kind-to-its-controller-by-namespace-override-then-static-default-and-a-live-crd-label-shows-which-one-runs.md)). The table lives only in source and the release in which any kind migrated is not established.

The three reconcilers requeue after success through the same jittered function, so the controller kind alone does not change the default cadence of a 10-minute mean with a 5 to 15 minute spread ([findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence](../findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence.md)). Per-kind overrides exist only as five Terraform service-mapping entries, ComputeSSLCertificate 0, ServiceIdentity 0, and ServiceUsage `Service`, BigtableInstance and BigtableTable at 3600, and no DCL entry sets a value ([findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds](../findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds.md)). Drift detection is the reconcile itself, and the failure backoff ceiling annotation works only for direct controllers from 1.160.0 ([findings/config-connector-has-no-separate-drift-poll-and-the-failure-backoff-annotation-works-only-for-direct-controllers-from-1-160-0](../findings/config-connector-has-no-separate-drift-poll-and-the-failure-backoff-annotation-works-only-for-direct-controllers-from-1-160-0.md)). See [decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource](../decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource.md). [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md)

## The Medium practitioner post, read in full (secondary)

A Medium post by Michał Marszałek (2023-12-20) describes Config Connector as 100% Kubernetes-native and Google-only, praises deploying buckets, BigQuery datasets and tables, and Pub/Sub resources alongside an application, and names dependency order as the main pain point. It reports that a BigQuery table cannot be created until its dataset exists, which the author fixes with Argo CD sync waves, and that deleting the dataset first leaves the table in `DeleteFailed`, which his CronJob clears by removing the table's finalizers. The claims are one practitioner's, consistent with the first-party reporter claim in issue 534 and with the design document recorded above, and not confirmed independently. See [examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first](../examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first.md) and [findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering](../findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering.md). [sources/medium-config-connector-pitfalls](../sources/medium-config-connector-pitfalls.md)
