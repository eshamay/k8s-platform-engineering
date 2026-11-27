---
title: Cloud services as Kubernetes objects with ACK and Config Connector
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [use-case, ack, config-connector, provider]
---

# Cloud services as Kubernetes objects with ACK and Config Connector

## Scenario

Teams that already use Kubernetes want S3 buckets, databases, and IAM roles to follow the same RBAC, audit, and GitOps workflow as their Deployments. [entities/ack](../entities/ack.md) on AWS and [entities/config-connector](../entities/config-connector.md) on Google Cloud expose these services as custom resources. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## How it works

Each cloud service is represented as a CRD, and a controller reconciles the object against the cloud API. This is the "direct control" pattern from the Kubernetes controller documentation, where a controller acts on an external system instead of creating Pods. ACK scopes one controller and its IAM permissions per AWS service, and both tools offer adoption of existing resources and a deletion policy.

## What to watch

Deleting the object can delete the real resource by default, and adoption by name can collide with existing infrastructure. See [findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md) and [findings/immutable-fields-and-drift-collisions](../findings/immutable-fields-and-drift-collisions.md). The dossier names no end-user organizations running these tools at scale.
