---
title: Status writes through the main resource retrigger reconcile loops
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: []
tags: [pitfall, status-subresource, reconcile-loop, kubebuilder]
---

# Status writes through the main resource retrigger reconcile loops

## Observation

Without the status subresource, a status write is a write to the whole object. The write increments `metadata.generation`, the controller's watch fires, and the controller reconciles again, which can write status again. With the subresource enabled (`+kubebuilder:subresource:status` in Kubebuilder), `r.Status().Patch()` updates only status and does not bump generation. One tutorial puts it as "Keeping them separate is how you avoid infinite reconcile loops." [[sources/research-spec-status-split]] URLs: https://www.farishuskovic.dev/blog/k8s-status-subresource/ and https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/.

## Why it matters

The loop is cheap to create and expensive to find, because each pass looks like a normal reconcile. The claim comes from a single-author tutorial and the Kubernetes CRD documentation on generation semantics, not from an incident report.

## Mitigations

Enable the status subresource on every CRD that has a controller, write status only through the status client, and prefer `Patch()` over `Update()` to reduce resourceVersion conflicts. Do not update spec and status in the same call. See [[findings/status-client-rbac-and-conflict-mistakes]], [[findings/defaulting-and-drift-reconcile-loops]], and [[concepts/spec-status-split]].

## Related

[[concepts/reconciliation-loop]], [[concepts/custom-resource-definition]], [[entities/kubebuilder]]

## Note from the operator loop dossier

The subresource removes the generation bump, but it does not by itself end a status-write loop. In the Cluster API provider RKE2 and Crossplane 7221 cases the controller wrote status on every pass, and the write's new resource version reached its own watch and re-enqueued the object. The status subresource therefore needs to be paired with a check that skips unchanged writes, and with predicates on the controller's own events. See [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]]. Source: [[sources/research-gap-g1-operator-loop-failures]].
