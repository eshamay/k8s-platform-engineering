---
title: "kro records the resources it is about to create in status before applying them, and applies without force"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: [kro idempotency]
tags: [kro, idempotency, applyset, server-side-apply, retries]
---

# kro records the resources it is about to create in status before applying them, and applies without force

## Observation

The kro documentation, read from the GitHub source tree because the kro.run pages scraped empty, describes two layers. For ResourceGraphDefinition instances, kro labels every managed resource (`kro.run/owned`, `kro.run/instance-id`, `kro.run/node-id`, and ApplySet labels) and states that "kro uses the Kubernetes ApplySet specification for tracking and pruning managed resources." It "does not set Kubernetes owner references on managed resources by default", which allows ordered deletion. [[sources/research-gap-m7-operators-idempotency]]

In the Graph documentation, present at the v0.10.0 tag, the intent is recorded first: "Before any apply, kro records the resources it is about to create in `status.managedResources`." The page adds that "If the controller restarts between applying a resource and recording the result, the next reconcile still knows about it." Applies use server-side apply with each Graph as a field manager and no force, so "the apply is rejected with a conflict rather than stealing the field", surfaced as the reason `FieldManagerConflict`. Deletion works from status and "keeps the finalizer, and retries" on failure. Waiting states retry with exponential backoff "starting at one second and capped at five minutes". [[sources/research-gap-m7-operators-idempotency]]

## Scope

These mechanisms cover Kubernetes children. The pages read do not describe creating non-Kubernetes cloud resources, which in kro happens through other operators' custom resources inside a graph, for example ACK or Config Connector objects. The docs read do not state a naming rule for children, so names are deterministic only to the extent the graph author templates them. [[sources/research-gap-m7-operators-idempotency]]

## Interpretation

The status-before-apply record is the same idea as Crossplane's create-pending annotation, moved into a status list, but it protects Kubernetes children and not an external cloud call. That comparison is the wiki's reading and no source makes it. See [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].

## Related

[[findings/kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory]], [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]], [[entities/kro]], [[concepts/idempotency]]
