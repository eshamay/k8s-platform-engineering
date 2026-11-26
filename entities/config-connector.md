---
title: Config Connector
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: [KCC, Google Config Connector]
tags: [tool, provider, gcp]
---

# Config Connector

Config Connector (KCC) is Google's set of provider controllers that expose Google Cloud resources as Kubernetes custom resources, so they receive the same RBAC and GitOps flow as any other object. It is one of the controllers that act directly on an external system, which is the "direct control" pattern described in the Kubernetes controller documentation. [[sources/research-universal-control-plane]]

## Deletion and acquisition behavior

Deleting a Config Connector resource deletes the associated Google Cloud resource by default. Setting the annotation `deletion-policy: abandon` retains the cloud resource. Config Connector also acquires an existing cloud resource when the manifest name matches it, which helps with migration but can collide with resources that were never meant to be managed. See [[findings/destructive-deletion-of-external-resources]] and [[findings/immutable-fields-and-drift-collisions]].

## Role in platforms

The kro announcement uses Config Connector to build a self-service GKE cluster API. See [[examples/self-service-gke-cluster-with-kro]]. It is a [[concepts/provider]] in the vocabulary of this wiki, and its objects are [[concepts/managed-resource]] instances.

## To research

The dossier read only the delete and manage page, through a summarizing fetch. Resource coverage, reconcile interval, and scale behavior are unknown. See [[open-knowledge-gaps]].
