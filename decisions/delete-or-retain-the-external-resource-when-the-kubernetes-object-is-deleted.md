---
title: "Delete or retain the external resource when the Kubernetes object is deleted"
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [decision, deletion, retain, crossplane, ack, config-connector]
---

# Delete or retain the external resource when the Kubernetes object is deleted

## Status

Open. The sources document the defaults and the opt-outs but do not recommend one setting, so this page records the options. [[sources/research-finalizers]]

## Context

Crossplane, ACK, and Config Connector default to deleting the cloud resource when the Kubernetes object is deleted. A mistaken manifest removal or a GitOps prune can therefore destroy production data. Retaining the resource has costs too, because it can leak spend and leave things to clean up by hand.

## Options

- Delete by default and accept the cascade. This keeps the cluster the single source of truth and avoids leaks.
- Retain, abandon, or Orphan on critical resources, such as Crossplane `deletionPolicy: Orphan`, ACK `deletion-policy: retain`, and Config Connector `deletion-policy: abandon`. ACK names cluster migration and stateful buckets or databases as reasons.
- Remove the GitOps cascade instead, with Argo CD `preserveResourcesOnDeletion`, the Flux `prune: disabled` annotation, or `deletionPolicy: Orphan`.

## Trade-offs

Retention protects data and enables migration, but it needs a policy applied before the delete, as the Config Connector page says, and a retained resource can later be re-imported through the ACK adoption annotations. Deletion keeps the system tidy but is unrecoverable.

## Related

[[findings/destructive-deletion-of-external-resources]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[decisions/adopt-or-create-or-require-explicit-import]]
