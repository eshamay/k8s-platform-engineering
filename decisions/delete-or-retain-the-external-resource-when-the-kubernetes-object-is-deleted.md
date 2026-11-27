---
title: "Delete or retain the external resource when the Kubernetes object is deleted"
type: decision
status: draft
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
tags: [decision, deletion, retain, crossplane, ack, config-connector]
---

# Delete or retain the external resource when the Kubernetes object is deleted

## Status

Open. The sources document the defaults and the opt-outs but do not recommend one setting, so this page records the options. [sources/research-finalizers](../sources/research-finalizers.md)

## Context

Crossplane, ACK, and Config Connector default to deleting the cloud resource when the Kubernetes object is deleted. A mistaken manifest removal or a GitOps prune can therefore destroy production data. Retaining the resource has costs too, because it can leak spend and leave things to clean up by hand.

## Options

- Delete by default and accept the cascade. This keeps the cluster the single source of truth and avoids leaks.
- Retain, abandon, or Orphan on critical resources, such as Crossplane `deletionPolicy: Orphan`, ACK `deletion-policy: retain`, and Config Connector `deletion-policy: abandon`. ACK names cluster migration and stateful buckets or databases as reasons.
- Remove the GitOps cascade instead, with Argo CD `preserveResourcesOnDeletion`, the Flux `prune: disabled` annotation, or `deletionPolicy: Orphan`.

## Trade-offs

Retention protects data and enables migration, but it needs a policy applied before the delete, as the Config Connector page says, and a retained resource can later be re-imported through the ACK adoption annotations. Deletion keeps the system tidy but is unrecoverable.

## Related

[findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md), [decisions/adopt-or-create-or-require-explicit-import](adopt-or-create-or-require-explicit-import.md)

## Update from the o3 dossier

For the GitOps prune case specifically, the options by layer, with evidence and no recommendation, are on [decisions/protect-a-provider-managed-object-from-gitops-prune-with-a-provider-retain-policy-or-an-agent-side-prune-opt-out](protect-a-provider-managed-object-from-gitops-prune-with-a-provider-retain-policy-or-an-agent-side-prune-opt-out.md). The ACK lookup order (resource, namespace, controller default) means a controller-wide retain can be overridden by a resource-level annotation. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)
