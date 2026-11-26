---
title: Adopt-or-create can take over a look-alike resource
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [Accidental adoption]
tags: [pitfall, ack, config-connector, adoption, crossplane]
---

# Adopt-or-create can take over a look-alike resource

## Observation

Adopt-or-create is convenient, because a retried create converges on whatever already exists. It can also take over a resource that happens to share a name and then update it to match the manifest. ACK documents that `adopt-or-create` makes the manifest the source of truth, so the existing resource is overwritten to match the spec, and it offers the strict `adopt` policy for inspecting first. Config Connector acquires any resource with the same name in the organization, project, or folder. [[sources/research-idempotency]]

## Competing positions

SAP argues that adoption should require explicit intent, so its provider removes the defaulting initializer and refuses brownfield resources unless the external name was set deliberately. Crossplane's official import flow uses an Observe-only management policy, then promotes to full management. The dossier says the sources do not agree on the best default and that no source compares production outcomes. [[sources/research-idempotency]]

## Related hazards

Adopted resources inherit the deletion behavior of the tool: in ACK and Config Connector, deleting the Kubernetes object deletes the cloud resource unless a retain or abandon policy is set. Crossplane's `managementPolicies` can omit Delete. See [[findings/destructive-deletion-of-external-resources]] and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].

## Mitigations

Use strict adoption or Observe-only first, read the populated spec, and only then hand over full management. Set a retain or abandon policy before adopting a resource that must survive removal of the Kubernetes object. See [[decisions/adopt-or-create-or-require-explicit-import]].

## Related

[[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]], [[examples/config-connector-acquires-an-existing-google-cloud-resource-by-name]], [[findings/immutable-fields-and-drift-collisions]], [[concepts/idempotency]]

## Update from the leaked-resources dossier

The dossier turns the documented risk into reproduced cases. ACK `adopt-or-create` adopts a found resource with no check on whether another custom resource manages it, so two custom resources overwrote one IAM role and deleting either deleted it ([[examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it]], reproduced against moto, not real AWS). Config Connector acquisition of an existing bucket removed settings the CRD does not model ([[examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config]]). See [[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]], [[findings/ack-adoption-semantics-are-inconsistent-across-kinds-and-adopted-resources-can-fail-to-converge]], and [[findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model]]. No production frequencies were found, so the page still cannot say how often this happens. [[sources/research-gap-g1-leaked-resources-adoption]]
