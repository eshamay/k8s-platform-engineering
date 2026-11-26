---
title: Choose management policies for an imported resource
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [decision, crossplane, management-policies, import, adoption]
---

# Choose management policies for an imported resource

## Status

Open question framed by the sources, not an ADR authored by this wiki. The sources agree on a safe first step (Observe) but leave the final policy to the team. [[sources/research-managed-resource]]

## Context

A team has an existing cloud resource and a new [[concepts/managed-resource]] for it. The `managementPolicies` list decides which verbs Crossplane may perform. The wrong final choice either leaves the resource unmanaged or lets a mistaken manifest change or delete production infrastructure. The consultancy advice is "Always start with ObserveOnly when adopting existing infrastructure", and the official guide says that taking control means switching to `["*"]` after copying values into `forProvider`.

## Options

Keep `["Observe"]` permanently, which fits a resource owned by another team that is only referenced, see [[examples/an-observe-only-managed-resource-lets-a-composition-read-a-database-owned-by-another-team]]. Promote to `["*"]`, which gives full lifecycle management including deletion when the object is removed. Promote to every verb except Delete, which the OnCallReady lesson calls the v2 orphan idiom, so the resource is managed but survives deletion of the object. Use an empty list to pause while investigating.

## Consequences

Full control makes manual drift get reverted and makes a deleted manifest delete the resource, especially behind a pruning GitOps layer, see [[findings/unintended-deletion-through-prune]]. Leaving out Delete trades cleanup for safety and can leave orphaned resources that cost money. The sources give no evidence about which option teams regret least. Related guardrails are Usages, see [[examples/crossplane-usages-order-deletion-and-guard-against-accidental-removal]], and the comparisons in [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]]. See also [[findings/observe-based-import-has-manual-copy-steps-ambiguous-names-and-relaxed-validation]] and [[decisions/staged-adoption-of-automated-drift-correction]].

## Update from the v2.5 verification pass (2026-11-26)

`managementPolicies` is still beta in the v2.5 docs and the import guide, so the choice rests on a feature that may change incompatibly but cannot be removed without two releases of deprecation. The import path is `["Observe"]` first, then `["*"]` to take control. For orphan-on-delete, a list without `Delete` is the only option on namespaced managed resources, because they no longer have `deletionPolicy`. [[sources/research-gap-g3-crossplane-v2]] See [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]] and [[examples/crossplane-issue-5283-has-left-deletionpolicy-deprecation-open-since-2024]].
