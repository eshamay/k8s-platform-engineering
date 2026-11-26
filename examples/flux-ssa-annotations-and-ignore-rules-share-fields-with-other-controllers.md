---
title: Flux SSA annotations and ignore rules share fields with other controllers
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [flux, server-side-apply, ignore, annotations]
---

# Flux SSA annotations and ignore rules share fields with other controllers

## Scenario

A Flux Kustomization manages resources whose fields other controllers legitimately change later. The documentation names Secrets managed by cert-manager and ValidatingWebhookConfigurations as the use case. [[sources/research-server-side-apply-and-field-ownership]]

## Per-resource annotations

The annotation `kustomize.toolkit.fluxcd.io/ssa` selects a policy. `Override` makes Flux's intent win, and `Merge` is the policy intended for resources whose fields other controllers mutate later. `IfNotPresent` applies the resource only if it does not exist yet, and `Ignore` skips it. Separate annotations `.../force` and `.../prune` control recreation on immutable-field changes, for example Jobs, and pruning. The force annotation is a different mechanism from conflict forcing. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/.

## Ignore rules

`.spec.ignore` rules take JSON Pointer paths and are described in SSA terms. "Strip" removes the field from the apply payload when another Apply-type manager owns it, so Flux stops contesting it. "Adopt" keeps the live value when Flux is the sole Apply-type owner, so Update-type edits made with `kubectl patch` or `kubectl edit` are not reverted. The manager name `flux-client-side-apply` preserves kubectl edits.

## Limit

Atomic lists such as `.spec.tolerations` cannot be shared between managers under the `Merge` policy, because only one manager can own an atomic list. See [[findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership]].

## Lesson

Flux force-applies by default and then offers escape hatches in SSA vocabulary. See [[comparisons/ssa-conflict-policy-across-tools]], [[comparisons/exemption-and-ignore-controls-across-tools]], and [[entities/flux]].
