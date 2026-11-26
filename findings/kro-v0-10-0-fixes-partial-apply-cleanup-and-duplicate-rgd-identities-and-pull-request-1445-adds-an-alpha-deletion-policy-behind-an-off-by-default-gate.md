---
title: "kro v0.10.0 fixes partial-apply cleanup and duplicate RGD identities, and pull request 1445 adds an alpha deletion policy behind an off-by-default gate"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [kro, release-notes, deletion-policy, orphaned, adoption, first-party]
---

# kro v0.10.0 fixes partial-apply cleanup and duplicate RGD identities, and pull request 1445 adds an alpha deletion policy behind an off-by-default gate

## Observation

The kro v0.10.0 release notes (2026-11-10) list fixes that imply earlier pitfalls: "Fix Graph cleanup after partial apply failures" (#1491), "Reject schema-only RGD duplicate identities before adopting objects" (#1428), and failing closed on schema changes (#1430). Release v0.9.0 (2026-03-24) introduced cluster-scoped instance CRDs. [[sources/research-gap-o4-config-connector-ack]]

Pull request 1445, merged 2026-10-29, "Adds an alpha, per-resource `deletionPolicy` field to RGD resources, behind the `DeletionPolicy` feature gate (off by default)." The values are `Delete` and `Orphaned`, and under `Orphaned` "kro leaves the resource in the cluster and releases it" when the instance is deleted or the resource leaves the desired set. Because the orphan option is new, kro's default behavior is to delete children.

## Evidence strength

These are release-note and pull-request statements. The dossier did not determine whether any fix was prompted by a production incident, so nothing here is a named-organization postmortem. The mechanism of the released `Orphaned` policy, including what it leaves on the object, is read from source in [[findings/kro-deletion-policy-orphaned-releases-a-resource-by-stripping-kro-labels-but-leaves-template-owner-references-in-place]].

## Why it matters

Partial-apply cleanup and duplicate-identity rejection are the two ways a graph controller can strand or double-own objects, compare [[findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates]] and [[examples/kro-issue-1171-a-fault-injection-tool-found-that-a-controller-crash-mid-deletion-leaves-the-instance-finalizer-and-children]]. The orphan option is a kro answer to the question in [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]].

## Related

[[entities/kro]], [[findings/no-named-organization-postmortem-was-found-for-kro-config-connector-ack-or-cluster-api]]
