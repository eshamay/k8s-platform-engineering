---
title: "kro sets no owner references on instance children and tracks them with labels and an ApplySet inventory"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
aliases: []
tags: [kro, owner-references, labels, applyset, garbage-collection, deletion]
---

# kro sets no owner references on instance children and tracks them with labels and an ApplySet inventory

## Observation

The kro v0.10.0 instances page says "kro does not set Kubernetes owner references on managed resources by default. This is intentional for two reasons": owner references trigger garbage collection "without ordering guarantees", and a namespaced owner cannot own a cluster-scoped child. Ownership is expressed with labels and the Kubernetes ApplySet specification instead. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/06-instances.md

Each child carries `kro.run/owned`, `kro.run/kro-version`, `kro.run/instance-id`, `kro.run/instance-name`, `kro.run/instance-group`, `kro.run/instance-version`, `kro.run/instance-kind`, `kro.run/node-id`, `app.kubernetes.io/managed-by: kro`, and `applyset.kubernetes.io/part-of`. A namespaced instance adds `kro.run/instance-namespace`, and `forEach` collection items add `kro.run/collection-index` and `kro.run/collection-size`. Long instance names or groups are hashed into label values with an `h-` prefix, and the full value is kept in an `internal.kro.run/...` annotation. The label constants are in `pkg/metadata/labels.go`. The docs say children do not carry `resource-graph-definition-*` labels. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

kro stores each child's dependency wave in the `internal.kro.run/apply-order` annotation and deletes in reverse order, one wave at a time. It finds children from the instance's persisted ApplySet inventory and not by re-evaluating the graph, so cleanup can proceed when an external reference is gone. Children without a valid annotation, for example those created before an upgrade, go in a final unordered wave. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Where kro does use owner references

kro stamps a `ResourceGraphDefinition` owner reference on the CRD it generates and on GraphRevision objects, and the controller re-adopts orphaned revisions by stamping the reference again. The alpha Graph API sets no owner references and cleans up from `status.managedResources` and a Graph finalizer. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md) See [findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates](a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates.md).

## Why it matters

A tool that follows owner references to draw a hierarchy, or that relies on garbage collection for cleanup, will not see kro's children as owned by the instance. Users must read the labels or the ApplySet inventory. The docs allow adding owner references by hand in a template and warn that resources "may be garbage collected out of order", that cross-namespace or cluster-scoped children fail validation, and that timing can conflict with kro's reconciliation. See [decisions/give-kro-children-manual-owner-references-or-leave-them-to-applyset-labels](../decisions/give-kro-children-manual-owner-references-or-leave-them-to-applyset-labels.md) and [findings/default-owner-references-delete-out-of-order-and-cannot-link-namespaced-to-cluster-scoped-objects-so-kro-uses-applysets](default-owner-references-delete-out-of-order-and-cannot-link-namespaced-to-cluster-scoped-objects-so-kro-uses-applysets.md).

## Not settled

KREP-004 (owner references and deletion policy for RGD and CRD lifecycle) is listed as draft in the v1 roadmap and was not read. KREP-014 is a broader instance lifecycle field under design and was not read. [sources/research-gap-m2-ownership-gc](../sources/research-gap-m2-ownership-gc.md)

## Related

[entities/kro](../entities/kro.md), [concepts/owner-references-and-garbage-collection](../concepts/owner-references-and-garbage-collection.md), [examples/kro-deletes-instance-resources-in-reverse-dependency-waves](../examples/kro-deletes-instance-resources-in-reverse-dependency-waves.md), [examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd](../examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd.md)
