---
title: "Choose foreground or a pipeline policy for ordered composite teardown"
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [decision, crossplane, deletion-ordering, composition]
---

# Choose foreground or a pipeline policy for ordered composite teardown

## Status

Open. Crossplane documents the options but the issue that asked for per-resource deletion behavior was closed as stale in April 2025 without a design, and the dossier did not cover Crossplane v2 namespaced composites. [[sources/research-owner-references-and-garbage-collection]]

## Context

A composite resource owns composed resources whose cloud dependencies require an order, such as a database before its network. The default Background policy lets the garbage collector remove the whole tree at once. A team must decide how to get an ordered teardown.

## Options

- Keep Background and accept parallel deletion, which is simplest but cannot enforce order, and Usages cannot help.
- Set `Foreground` so children are deleted before the composite is removed, which waits on dependents but does not itself order siblings.
- Use the `Pipeline` policy, where a function removes resources from desired state step by step and so controls the order explicitly.
- Create resources through a Claim, where the claim controller deletes the composite using `compositeDeletePolicy`, a route one user chose in issue 6084 and that the documentation did not explain.

## Trade-offs

Foreground is a native Kubernetes mode with a clear meaning but only orders parent against child. Pipeline gives full control and moves the logic into function code that the team must maintain. The claim route is implicit behavior that depends on a controller default. kro offers a different model, reverse dependency waves, that is described in [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]].

## Related

[[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]], [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]], [[entities/crossplane]]

## Update from the composite resources dossier

The current Crossplane composite resources page documents the deletion policy (alpha) and warns that Argo CD's default foreground deletion makes Crossplane ignore it, with `PrunePropagationPolicy=background` and a background finalizer as the fix, so the choice here also depends on the GitOps tool's settings. A stuck Foreground or Pipeline deletion leaves the XR in Deleting until the finalizer is removed manually. [[sources/research-composite-resource]] See [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]].
