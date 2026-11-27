---
title: Flux SSA annotations and ignore rules share fields with other controllers
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [flux, server-side-apply, ignore, annotations]
---

# Flux SSA annotations and ignore rules share fields with other controllers

## Scenario

A Flux Kustomization manages resources whose fields other controllers legitimately change later. The documentation names Secrets managed by cert-manager and ValidatingWebhookConfigurations as the use case. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## Per-resource annotations

The annotation `kustomize.toolkit.fluxcd.io/ssa` selects a policy. `Override` makes Flux's intent win, and `Merge` is the policy intended for resources whose fields other controllers mutate later. `IfNotPresent` applies the resource only if it does not exist yet, and `Ignore` skips it. Separate annotations `.../force` and `.../prune` control recreation on immutable-field changes, for example Jobs, and pruning. The force annotation is a different mechanism from conflict forcing. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/.

## Ignore rules

`.spec.ignore` rules take JSON Pointer paths and are described in SSA terms. "Strip" removes the field from the apply payload when another Apply-type manager owns it, so Flux stops contesting it. "Adopt" keeps the live value when Flux is the sole Apply-type owner, so Update-type edits made with `kubectl patch` or `kubectl edit` are not reverted. The manager name `flux-client-side-apply` preserves kubectl edits.

## Limit

Atomic lists such as `.spec.tolerations` cannot be shared between managers under the `Merge` policy, because only one manager can own an atomic list. See [findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership](../findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership.md).

## Lesson

Flux force-applies by default and then offers escape hatches in SSA vocabulary. See [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md), [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md), and [entities/flux](../entities/flux.md).

## Update from the m4 dossier

Update 2026-11-26: the Strip and Adopt wording above is confirmed by the kustomize-controller specification. Strip removes the field from the apply payload, which "relinquishes the controller's ownership". Adopt "preserves the current value without reverting changes made by Update-type operations", and changes to ignored fields alone do not trigger a reconciliation. Because Strip applies only to Apply-type managers, a controller that writes with Update, such as Config Connector's `cnrm-controller-manager`, would be covered by Adopt. That last point is an inference from the specification and the source, not a project statement. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) See [decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field](../decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field.md).
