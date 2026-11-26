---
title: Adopt-or-create can take over a look-alike resource
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
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
