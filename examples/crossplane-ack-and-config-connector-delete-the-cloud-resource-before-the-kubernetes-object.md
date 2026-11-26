---
title: "Crossplane, ACK, and Config Connector delete the cloud resource before the Kubernetes object"
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [finalizers, crossplane, ack, config-connector, deletion]
---

# Crossplane, ACK, and Config Connector delete the cloud resource before the Kubernetes object

## Scenario

An engineer deletes a custom resource that represents an S3 bucket, an RDS database, or a Google Cloud resource. The three tools in this example all treat that delete as a request to tear down the real resource. [[sources/research-finalizers]]

## How it works

Crossplane holds a finalizer until the external resource is fully gone. The managed resources page says "When the external resource is fully deleted Crossplane removes the Finalizer and deletes the managed resource object." The default `deletionPolicy` is Delete, and Orphan keeps the cloud resource. When `managementPolicies` are enabled they take precedence over `deletionPolicy`.

ACK deletes the AWS resource and then the Kubernetes object by default. The annotation `services.k8s.aws/deletion-policy: retain` keeps the AWS resource, which the guide recommends for migrating between clusters and for protecting S3 buckets and RDS databases. ACK looks up the policy on the resource, then on the namespace, then in the controller default, and a retained resource can be re-imported with the adoption annotations.

Config Connector deletes the Google Cloud resource by default. The annotation `cnrm.cloud.google.com/deletion-policy: abandon` keeps it, and the page says to apply the annotation first and delete the manifest afterward. That page does not discuss finalizers directly.

## Caveats

The dossier found that the ACK, Config Connector, and kro pages do not say how finalizers are named or removed in each tool, so a comparison would need live objects or source code. See [[open-knowledge-gaps]].

## Related

[[entities/crossplane]], [[entities/ack]], [[entities/config-connector]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]]

## Verified against current documentation (o3 dossier)

The ACK and Config Connector defaults and opt-outs on this page were re-read in the 2026 documentation: Config Connector says "When deleting a Config Connector resource the associated Google Cloud resource is deleted by default", and ACK deletes the AWS resource and then the custom resource. Argo CD prune and Flux prune are ordinary deletes, so the defaults apply, see [[findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain]]. [[sources/research-gap-o3-gitops-provider-managed]]
