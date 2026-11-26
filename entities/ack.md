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

## Related

[[concepts/provider]], [[concepts/managed-resource]], [[entities/config-connector]], [[examples/cloud-services-as-kubernetes-objects]]
