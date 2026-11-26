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

The spec and status dossier fetched no primary source on Config Connector, so its condition vocabulary and `observedGeneration` behavior are unknown. [[sources/research-spec-status-split]] See [[open-knowledge-gaps]].

## Coverage gap in the operator-pattern dossier

The operator-pattern dossier fetched no page on Config Connector, so its failure handling as an operator is not covered by that source. [[sources/research-operator-pattern]] See [[open-knowledge-gaps]].

## Idempotent create by acquisition

The managing-and-deleting-resources page says that if a resource does not exist Config Connector creates it, and if a resource with the same name already exists in the organization, project, or folder it acquires and manages it. Resources with service-generated IDs can be acquired only through the `resourceID` field. Deleting the Kubernetes object deletes the cloud resource unless `cnrm.cloud.google.com/deletion-policy: abandon` is set. The dossier read only this page for Config Connector. [[sources/research-idempotency]] See [[examples/config-connector-acquires-an-existing-google-cloud-resource-by-name]] and [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].

## Deletion policy and finalizer behavior

Deleting a Config Connector object deletes the Google Cloud resource by default. The annotation `cnrm.cloud.google.com/deletion-policy: abandon` keeps the resource, and it must be applied before the manifest is deleted. The official page does not discuss finalizers. A consultancy blog reports that the finalizer deletes a resource that production uses, and that deleting the GKE cluster stops the controller and orphans cloud resources that keep billing. [[sources/research-finalizers]] See [[findings/deleting-the-cluster-first-orphans-cloud-resources-because-the-controller-is-gone]] and [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]].
