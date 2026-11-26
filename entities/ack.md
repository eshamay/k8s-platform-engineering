---
title: AWS Controllers for Kubernetes (ACK)
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
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
aliases: [ACK, AWS Controllers for Kubernetes]
tags: [tool, provider, aws]
---

# AWS Controllers for Kubernetes (ACK)

ACK is the AWS project that exposes AWS services such as S3, databases, and IAM as Kubernetes custom resources. It follows the pattern of controllers that act directly on an external API. [[sources/research-universal-control-plane]]

## Design properties

ACK runs one controller per AWS service. Each controller talks to a single AWS API endpoint and receives only the IAM permissions it needs, so permissions and releases are scoped per service. Reconciliation runs on change and on a periodic resync, with a default the dossier states as 10 hours. Existing AWS resources can be adopted through annotations, a deletion-policy annotation chooses between delete and retain, and cross-account management uses IAM roles that are separate from Kubernetes RBAC.

## Pitfalls

A ten-hour resync means an out-of-band change may sit uncorrected for a long time, while adoption can collide with existing resources. See [[findings/immutable-fields-and-drift-collisions]], [[findings/destructive-deletion-of-external-resources]], and [[findings/blast-radius-and-privilege-centralization]]. The dossier flags the resync default as something to re-verify against current docs.

## Deletion policy documentation

Deleting an ACK custom resource deletes the AWS resource first by default. A `retain` policy, set by annotation, namespace annotation, or controller flag, keeps the cloud resource, which helps with migrations or with removing ACK management. Adoption is a separate feature that the dossier did not read. [[sources/research-declarative-vs-imperative]] See [[comparisons/deletion-policies-across-gitops-and-provider-tools]].

## Reconcile behavior

The level-triggered dossier could not confirm ACK's resync or drift-recovery behavior, because the overview page lacked those details. ACK is expected to follow the same reconcile shape as other provider controllers. [[sources/research-level-triggered-vs-edge-triggered]] See [[examples/cloud-console-changes-reverted-by-provider-controllers]] and [[open-knowledge-gaps]].

## Related

[[concepts/provider]], [[concepts/managed-resource]], [[entities/config-connector]], [[examples/cloud-services-as-kubernetes-objects]]

## Drift recovery

The ACK drift-recovery page confirms the long resync: after `ResourceSynced = true` controllers keep reconciling about every 10 hours by default to limit AWS API cost and throttling, and the Helm values `reconcile.defaultResyncPeriod` and `reconcile.resourceResyncPeriods` shorten it per kind. This confirms the default noted earlier through a digest of the primary page. [[sources/research-self-healing-and-drift-detection]] See [[examples/ack-resync-period-tuning-for-stateful-resources]] and [[decisions/choosing-a-drift-check-interval-for-external-resources]].

## Conditions without observedGeneration

ACK publishes `ResourceSynced`, but its conditions lack `observedGeneration`, so consumers cannot distinguish a stale `ResourceSynced=True` from a current one. Issue 1583 proposes adding it, or publishing `False` at reconcile start. The issue was open with a frozen label when fetched. [[sources/research-spec-status-split]] See [[findings/missing-observedgeneration-hides-stale-status]] and [[decisions/publish-synced-false-at-reconcile-start]].

## One controller image per AWS service

The ACK overview says the project ships one controller image per AWS service, each reconciling custom resources into AWS API calls, with support for adopting pre-existing AWS resources and exporting fields to ConfigMaps or Secrets. The operator-pattern dossier cites it as an example of per-service controllers for an external system. [[sources/research-operator-pattern]] See [[examples/ack-ships-one-controller-per-aws-service]] and [[comparisons/how-flux-ack-and-cluster-api-split-controllers]].

## Resource adoption policies

The ACK adoption guide describes the `services.k8s.aws/adoption-policy` annotation with two values: `adopt-or-create` adopts an existing AWS resource or creates it, with the manifest as source of truth, and `adopt` imports strictly and fills the spec from AWS. The `adoption-fields` annotation names the identifier used to find the resource, such as a VPC ID, queue URL, SNS ARN, bucket name, or table name. Deleting the Kubernetes object deletes the AWS resource unless `deletionPolicy: Retain` is set, and the guide labels adoption a Beta feature. This fills the adoption gap noted above, though the dossier did not read ACK's idempotency behavior for creates beyond adoption. [[sources/research-idempotency]] See [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]], [[findings/adopt-or-create-can-take-over-a-look-alike-resource]], and [[decisions/adopt-or-create-or-require-explicit-import]].

## Deletion policy

By default ACK deletes the AWS resource and then the Kubernetes object. The `services.k8s.aws/deletion-policy: retain` annotation keeps the AWS resource, which the guide recommends for cluster migration and for S3 buckets and RDS databases. Lookup order is resource annotation, namespace annotation, then controller default, and retained resources can be re-imported with the adoption annotations. The page does not say how the ACK finalizer is named or removed. [[sources/research-finalizers]] See [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]] and [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]].

## Conditions

ACK uses `ACK.Recoverable` for transient errors such as throttling, `ACK.Terminal` for errors that need a spec change, `ACK.ResourceSynced` for whether the AWS resource matches the spec, `ACK.Adopted`, `ACK.ReferencesResolved`, and `Ready` as the top-level indicator. [[sources/research-conditions]] See [[examples/ack-splits-terminal-and-recoverable-errors-into-separate-conditions]] and [[concepts/conditions]].

## Read-only annotation versus adoption

ACK offers the annotation `services.k8s.aws/read-only: "true"`, under which the controller syncs status from AWS, ignores spec, never creates, updates, or deletes, and shows an error if the AWS resource is missing. ACK's separate adoption feature gives full management, which mirrors the observe-versus-promote split in Crossplane's management policies. [[sources/research-managed-resource]] See [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]].

## Leaf provider beneath kro

The composite resources dossier shows ACK as a leaf provider. The Amazon EKS guide composes ACK S3 Buckets with ConfigMaps and Deployments in a kro RGD and passes the bucket ARN from `status.ackResourceMetadata` into the application's configuration. The dossier read none of ACK's own documentation on readiness or deletion. [[sources/research-composite-resource]] See [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]].

## Operational topics inherited by a composition layer

The ACK overview says ACK "lets you define and use AWS service resources directly from Kubernetes" and ships one controller image per AWS service, which avoids CRD sprawl by construction. Its sidebar lists drift recovery, adoption, retention after deletion, field export into ConfigMaps or Secrets, and multi-account and multi-region management, which are the problems a composition layer inherits. The page is thin and the site is marked deprecated, so verify against the current site. [[sources/research-composition]]
