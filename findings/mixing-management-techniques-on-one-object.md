---
title: Mixing management techniques on one object
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [pitfall, kubectl, imperative]
---

# Mixing management techniques on one object

## Observation

The Kubernetes object-management page warns not to use more than one technique on the same object. The reason is visible in its own wording for declarative configuration: "Changes made directly to live objects are retained, even if they are not merged back into the configuration files." A manual `kubectl scale` therefore survives a later `kubectl apply`, and the file in Git no longer describes the live object. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## Interpretation

An imperative edit creates drift that the declarative tool does not see, because the tool only compares fields it manages. Level-triggered controllers will correct drift only for the fields the spec declares. GitOps tools with self-heal revert such edits, while a plain `kubectl apply` does not. See [concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md) and [entities/kubectl](../entities/kubectl.md).

## Mitigations

Pick one technique per object, review changes with `kubectl diff`, and use Flux suspend when an imperative incident fix is needed.

## Related

[findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md), [comparisons/kubectl-object-management-techniques](../comparisons/kubectl-object-management-techniques.md), [decisions/choosing-an-object-management-technique](../decisions/choosing-an-object-management-technique.md)
