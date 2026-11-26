---
title: "Config Connector deletion policy has two source values and only abandon changes the delete path, and the Terraform-based controller path is unverified"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [config-connector, deletion, abandon, finalizer, deletion-defender]
---

# Config Connector deletion policy has two source values and only abandon changes the delete path, and the Terraform-based controller path is unverified

## Observation

The managing-and-deleting page (last updated 2026-11-10) says "When deleting a Config Connector resource the associated Google Cloud resource is deleted by default", and shows `cnrm.cloud.google.com/deletion-policy: abandon` as the way to keep it. The documentation names no other value. [[sources/research-gap-o4-config-connector-ack]]

Source on master confirms two constants in `pkg/k8s/constants.go`, `DeletionPolicyDelete = "delete"` and `DeletionPolicyAbandon = "abandon"`. The helper `HasAbandonAnnotation` in `pkg/k8s/meta.go` returns `ok && val == DeletionPolicyAbandon`, so any value other than `abandon` leaves the default delete path. The direct controller logs "deletion policy set to abandon; abandoning underlying resource" and does not call the cloud API. The DCL controller "checks the deletion policy and determines whether to abandon the underlying resource", then checks orphan status and the resource lease before deleting.

A separate deletion-defender controller adds the finalizer `cnrm.cloud.google.com/deletion-defender`. When the resource's CRD is being deleted, as in an uninstall, it removes both Config Connector finalizers and sets `abandon` ("resource type is being uninstalled; abandoning by default"), so uninstalling Config Connector does not delete cloud resources. A plain delete of the Kubernetes object only removes the defender finalizer and lets the controller delete the cloud resource. See also [[findings/config-connector-has-a-second-deletion-defender-finalizer-and-removes-both-finalizers-with-an-abandon-setting-when-its-crd-is-uninstalled]].

## What is not verified

The Terraform-based controller path was not found to branch on `abandon`: searching `pkg/controller/tf/tfcontroller.go` for `DeletionPolicy`, `ShouldAbandon`, and `abandon` returned nothing, and the verification pass reproduced that. That is a statement about the search, not proof that the Terraform path ignores the annotation, since the check may live in a shared layer. The annotation must also be applied before the delete, see [[entities/config-connector]].

## Why it matters

Argo CD prune and Flux prune issue ordinary deletes, so under a GitOps agent a resource without `abandon` is deleted from Google Cloud, see [[findings/unintended-deletion-through-prune]]. Issue 15930 reports a case where `abandon` does not release a stuck Direct-controller resource, see [[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]]. Compared with the three-level lookup in ACK and Crossplane's policies, see [[comparisons/deletion-policies-across-gitops-and-provider-tools]].

## Related

[[findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential]], [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]]
