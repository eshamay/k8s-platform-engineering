---
title: "Flux Kustomization deletion policy chooses between MirrorPrune, Delete, WaitForTermination, and Orphan"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [finalizers, flux, gitops, deletion, prune]
---

# Flux Kustomization deletion policy chooses between MirrorPrune, Delete, WaitForTermination, and Orphan

## Scenario

A team removes a Flux Kustomization, either on purpose or by deleting the file that defines it. They want to know whether the objects that it deployed disappear with it. [[sources/research-finalizers]]

## How it works

The Kustomization reference says garbage collection also runs when a Kustomization object is deleted. `spec.prune` governs garbage collection while the object exists, and an object can opt out with the annotation `kustomize.toolkit.fluxcd.io/prune: disabled`. `spec.deletionPolicy` governs what happens to deployed objects at deletion. The options are MirrorPrune (the default, which follows the `prune` setting), Delete, WaitForTermination, and Orphan. WaitForTermination blocks until the children have left etcd, which means Flux's own deletion waits on every finalizer that the children carry.

## Caveats

The dossier read only the first 100 KB of a page of about 121 KB, and it did not isolate the section on Flux's own finalizer. The name `finalizers.fluxcd.io` was not confirmed from a primary source. See [[open-knowledge-gaps]].

## Related

[[entities/flux]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[findings/unintended-deletion-through-prune]], [[concepts/finalizers]]
