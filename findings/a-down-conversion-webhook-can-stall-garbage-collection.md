---
title: A down conversion webhook can stall garbage collection
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crd, conversion, webhooks, garbage-collection]
---

# A down conversion webhook can stall garbage collection

## Observation

A bug report in the Kubernetes repository describes what happens when the conversion webhook service behind a CRD is unavailable. The garbage collector in kube-controller-manager can fail to sync its cache, and cascading deletes then stop. In the reported case a Deployment is deleted but its ReplicaSets and Pods remain. The issue was closed as a duplicate of #101078, and the proposed direction was to let the garbage collector keep working with a partially synced informer. URL: https://github.com/kubernetes/kubernetes/issues/110720. The issue text, as returned by the fetch tool, reads "When the webhook service is down, the GC of controller-manager to be still working," which is likely a typo for "not working." [[sources/research-custom-resource-definition]]

## Why it matters

A single third-party CRD with a conversion webhook can degrade core control-plane behavior far from the CRD itself, because the garbage collector watches every resource type, including custom ones. This is a blast-radius problem: the webhook is optional infrastructure from a platform team's view, but its absence harms unrelated workloads.

## Mitigations suggested by the sources

The dossier suggests preferring `None` conversion when schemas are compatible, using CEL rules instead of validating webhooks, and running webhooks highly available. These are the dossier's synthesis and not a documented fix. Whether the underlying problem is fixed in current releases is unknown from the sources, and it is tracked as a gap.

## Related

[[concepts/crd-versioning-and-storage-migration]], [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]], [[concepts/owner-references-and-garbage-collection]], [[findings/admission-webhook-outages-are-a-recurring-failure-class]], and [[open-knowledge-gaps]].
