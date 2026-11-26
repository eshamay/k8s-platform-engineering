---
title: Kluctl
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [entity, deployment-tool, server-side-apply]
---

# Kluctl

## What it is

Kluctl is a deployment tool for Kubernetes that appears in the wiki through one source: a Kubernetes blog post written by its author, Alexander Block. The tool originally shelled out to `kubectl` and used client-side apply, then moved to calling server-side apply directly. [[sources/research-server-side-apply-and-field-ownership]]

## Behavior documented

Kluctl makes conflict decisions per field. It overwrites changes from known interactive managers such as `kubectl` and k9s, treating them as temporary, and it does not overwrite fields it lost to other managers unless told to. The controls are `--force-apply`, the resource annotation `kluctl.io/force-apply`, and the field-level annotation `kluctl.io/force-apply-field` with a JSON path. An administrator can use `kubectl --field-manager=admin-override` to make a change Kluctl respects. URL: https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/.

## Caveat

The only source is the tool author's own account. See [[examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics]], [[comparisons/ssa-conflict-policy-across-tools]], and [[concepts/server-side-apply-and-field-ownership]].
