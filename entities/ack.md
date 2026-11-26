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
