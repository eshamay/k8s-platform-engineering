---
title: "Cluster API chose annotation hooks over finalizers for machine deletion because a misbehaving controller could remove finalizers"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, finalizers, hooks, annotations, machine-deletion]
---

# Cluster API chose annotation hooks over finalizers for machine deletion because a misbehaving controller could remove finalizers

## Observation

The implemented Machine Deletion Phase Hooks proposal (`20200602-machine-deletion-phase-hooks.md`, created 2020-06-02, last updated 2020-08-07, status implemented) chose annotations. Its alternatives section rejects finalizers with the sentence "A misbehaving controller that accidentally removes finalizers could have undesirable effects." The proposal says the annotations pause reconciliation of a machine until all hooks for that lifecycle point are resolved. [[sources/research-gap-m1-finalizers]]

The current API on the main branch defines two prefixes, `pre-drain.delete.hook.machine.cluster.x-k8s.io` and `pre-terminate.delete.hook.machine.cluster.x-k8s.io`. The pre-terminate hook holds up removal of the instance from the infrastructure provider, and the control plane provider adds its own pre-terminate hook to Machines it manages. The annotation keys in the proposal's examples use the older spelling `.cluster-api.x-k8s.io`, and the constants in the API source are authoritative. [[sources/research-gap-m1-finalizers]]

## Why it matters

The finding shows a deliberate design position: external controllers that need to delay a Machine's deletion register an annotation named after themselves, and the Machine controller does not proceed while any hook remains. Removing an entry is the same kind of edit as removing a finalizer, but a stray removal affects one named hook and not the shared finalizer list. The proposal states only the quoted concern, and the thread's other considerations are recorded in [[examples/cluster-api-issue-1514-was-closed-in-april-2020-in-favor-of-a-proposal-that-chose-annotation-hooks]]. The option list is in [[decisions/block-an-object-s-deletion-with-a-finalizer-a-spec-dependency-list-or-an-annotation-hook]].

## Evidence limits

The issue itself does not record the final choice. The outcome comes from the proposal and API source, and the Cluster API book page on the hooks could not be read. [[sources/research-gap-m1-finalizers]]

## Related

[[entities/cluster-api]], [[examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node]], [[findings/machine-deletion-stalls-on-disruption-budgets-attached-volumes-and-failing-hooks]], [[concepts/finalizers]]
