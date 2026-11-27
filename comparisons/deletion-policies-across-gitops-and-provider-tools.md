---
title: Deletion policies across GitOps and provider tools
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [deletion, retain, abandon, orphan]
---

# Deletion policies across GitOps and provider tools

| Tool | Default on delete | How to keep the real resource |
|---|---|---|
| [entities/ack](../entities/ack.md) | Deletes the AWS resource before the Kubernetes custom resource | `retain` policy via annotation, namespace annotation, or controller flag |
| [entities/config-connector](../entities/config-connector.md) | Deletes the Google Cloud resource | `abandon` deletion policy annotation |
| [entities/flux](../entities/flux.md) | Pruned objects are deleted when `prune` is enabled | Deletion policy `Orphan`; per-object disable annotation; other policies are MirrorPrune, Delete, WaitForTermination |
| [entities/argo-cd](../entities/argo-cd.md) | Does not prune by default | Leave prune off; allow-empty protection |
| `kubectl apply --prune` | Deletes objects it considers outside the config | Use explicit `kubectl delete -f` instead |

## Reading the comparison

Declarative deletion semantics propagate to real infrastructure, so every tool offers an opt-out whose name differs. ACK's retain policy is useful for migrations or for removing ACK management, and Config Connector's abandon policy appears in its migration path to Absent mode. See [findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md), [findings/unintended-deletion-through-prune](../findings/unintended-deletion-through-prune.md), and [concepts/finalizers](../concepts/finalizers.md). [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## Adoption and Crossplane rows from the idempotency dossier

The idempotency dossier confirms ACK's `deletionPolicy: Retain` and Config Connector's `abandon` policy, and adds that Crossplane deletes an external resource only when its managed resource is deleted, with `managementPolicies` able to omit Delete and an empty list pausing the resource. [sources/research-idempotency](../sources/research-idempotency.md) See [comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector](ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector.md).

## Additions from the finalizers dossier

Crossplane belongs in the table: its default is Delete, and `deletionPolicy: Orphan` keeps the cloud resource, with enabled `managementPolicies` taking precedence. For Argo CD, the Application finalizer cascades to workloads unless `preserveResourcesOnDeletion` is set, so "does not prune by default" describes pruning during sync and not deleting the Application. [sources/research-finalizers](../sources/research-finalizers.md) See [comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api](finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api.md) and [decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted](../decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted.md).

## Owner-reference-based tools

Cluster API and Crossplane add owner-reference-driven cascades, and Crossplane composites offer Background, Foreground, and Pipeline policies. See [comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers](how-tools-garbage-collect-owner-references-inventory-and-finalizers.md) and [comparisons/background-foreground-and-orphan-propagation-modes](background-foreground-and-orphan-propagation-modes.md). [sources/research-owner-references-and-garbage-collection](../sources/research-owner-references-and-garbage-collection.md)

## Crossplane policy list and Usages

The managed resource dossier adds that in Crossplane v2 the way to keep the cloud resource is to leave Delete out of `managementPolicies`, that the v1 `deletionPolicy: Orphan` is absent on namespaced managed resources, and that a Usage blocks deletion while a dependent resource still uses the target. [sources/research-managed-resource](../sources/research-managed-resource.md) See [comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack](observe-only-and-keep-controls-across-crossplane-config-connector-and-ack.md) and [examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal](../examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal.md).

## Reported prune incident

ACK issue 2911 (2026) reports an Argo CD prune of an ACK CR that removed the AWS resource and then left the CR in `Terminating` because the controller mishandled the not-found error, see [examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone](../examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone.md). Source: [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md).

## First-party deletion reports from the other-tool pitfalls dossier

Reporter claims from 2026 qualify the opt-outs in this table. ACK's namespace-level retain annotation is reported ignored in single `--watch-namespace` installs ([findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs](../findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs.md)). Config Connector's `abandon` is reported not to release Direct-controller resources stuck in Terminating ([findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them](../findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them.md)), and a stale deletion can run after leader failover ([findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources](../findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources.md)). All are open and unconfirmed by maintainers. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md)

## Verified lookup order and agent-side controls (o3 dossier)

ACK resolves its policy from the resource annotation, then the namespace annotation, then the controller default, and first match wins, so the controller-wide setting is the weakest layer, see [findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain](../findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain.md). Config Connector's `abandon` must be set before the delete. On the agent side, Flux offers the per-object `kustomize.toolkit.fluxcd.io/prune: disabled` annotation and a Kustomization `.spec.deletionPolicy` of MirrorPrune (default), Delete, WaitForTermination, or Orphan, and Argo CD offers `Prune=false`, `Prune=confirm`, `Delete=false`, `Delete=confirm`, and `preserveResourcesOnDeletion` for ApplicationSet-created Applications. The options are laid out in [decisions/protect-a-provider-managed-object-from-gitops-prune-with-a-provider-retain-policy-or-an-agent-side-prune-opt-out](../decisions/protect-a-provider-managed-object-from-gitops-prune-with-a-provider-retain-policy-or-an-agent-side-prune-opt-out.md). All of these rest on documentation read at current versions, and no end-to-end prune test of a provider object was found. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

## Update from the o4 dossier

Config Connector's policy has two source values, `delete` and `abandon`, and only `abandon` changes the path ([findings/config-connector-deletion-policy-has-two-source-values-and-only-abandon-changes-the-delete-path-and-the-terraform-based-controller-path-is-unverified](../findings/config-connector-deletion-policy-has-two-source-values-and-only-abandon-changes-the-delete-path-and-the-terraform-based-controller-path-is-unverified.md)). kro gains an alpha per-resource `Delete` or `Orphaned` policy behind an off-by-default gate ([findings/kro-v0-10-0-fixes-partial-apply-cleanup-and-duplicate-rgd-identities-and-pull-request-1445-adds-an-alpha-deletion-policy-behind-an-off-by-default-gate](../findings/kro-v0-10-0-fixes-partial-apply-cleanup-and-duplicate-rgd-identities-and-pull-request-1445-adds-an-alpha-deletion-policy-behind-an-off-by-default-gate.md)). Flux `WaitForTermination` gives up at `.spec.timeout` ([findings/a-flux-waitfortermination-deletion-policy-gives-up-at-spec-timeout-and-lets-the-kustomization-be-deleted-while-a-provider-resource-may-still-be-finalizing](../findings/a-flux-waitfortermination-deletion-policy-gives-up-at-spec-timeout-and-lets-the-kustomization-be-deleted-while-a-provider-resource-may-still-be-finalizing.md)). ACK resolves resource, then namespace, then controller flag, with `delete` as the default in both documentation sites. [sources/research-gap-o4-config-connector-ack](../sources/research-gap-o4-config-connector-ack.md)
