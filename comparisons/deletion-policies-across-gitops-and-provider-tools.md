---
title: Deletion policies across GitOps and provider tools
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
aliases: []
tags: [deletion, retain, abandon, orphan]
---

# Deletion policies across GitOps and provider tools

| Tool | Default on delete | How to keep the real resource |
|---|---|---|
| [[entities/ack]] | Deletes the AWS resource before the Kubernetes custom resource | `retain` policy via annotation, namespace annotation, or controller flag |
| [[entities/config-connector]] | Deletes the Google Cloud resource | `abandon` deletion policy annotation |
| [[entities/flux]] | Pruned objects are deleted when `prune` is enabled | Deletion policy `Orphan`; per-object disable annotation; other policies are MirrorPrune, Delete, WaitForTermination |
| [[entities/argo-cd]] | Does not prune by default | Leave prune off; allow-empty protection |
| `kubectl apply --prune` | Deletes objects it considers outside the config | Use explicit `kubectl delete -f` instead |

## Reading the comparison

Declarative deletion semantics propagate to real infrastructure, so every tool offers an opt-out whose name differs. ACK's retain policy is useful for migrations or for removing ACK management, and Config Connector's abandon policy appears in its migration path to Absent mode. See [[findings/destructive-deletion-of-external-resources]], [[findings/unintended-deletion-through-prune]], and [[concepts/finalizers]]. [[sources/research-declarative-vs-imperative]]

## Adoption and Crossplane rows from the idempotency dossier

The idempotency dossier confirms ACK's `deletionPolicy: Retain` and Config Connector's `abandon` policy, and adds that Crossplane deletes an external resource only when its managed resource is deleted, with `managementPolicies` able to omit Delete and an empty list pausing the resource. [[sources/research-idempotency]] See [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].
