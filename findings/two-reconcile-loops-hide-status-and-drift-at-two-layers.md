---
title: Two reconcile loops hide status and drift at two layers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, gitops, kro, crossplane, layering]
---

# Two reconcile loops hide status and drift at two layers

## Observation

With kro or Crossplane beneath a GitOps agent, two independent loops are active. The GitOps agent reconciles Git into the Kubernetes API, and the abstraction controller (kro's dynamic controller or Crossplane's composition machinery) reconciles the resulting custom resource into the underlying resources. kro's project site states that its controller does continuous reconciliation and drift detection of its own, so status and drift can be reported at both layers. [[sources/research-gitops-pull-based-delivery]]

## Why it matters

A green sync in the GitOps agent says only that the custom resource matches Git, and it does not say that the real infrastructure is healthy. Likewise, drift in a composed resource may be corrected by the lower loop without the GitOps agent ever seeing a difference, or the two loops may disagree about who owns a field. The dossier states this as a pitfall but offers no incident evidence.

## Mitigation

Read both layers: the agent's sync status for "Git versus API", and the custom resource's conditions for "API versus reality". Make sure the agent evaluates those conditions, as in [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]].

## Related

[[concepts/gitops-pull-based-delivery]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[entities/kro]], [[entities/crossplane]], [[concepts/self-healing-and-drift-detection]]
