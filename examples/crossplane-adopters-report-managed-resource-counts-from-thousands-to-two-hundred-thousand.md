---
title: Crossplane adopters report managed resource counts from thousands to two hundred thousand
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, adopters, internal-developer-platform, scale, self-reported]
---

# Crossplane adopters report managed resource counts from thousands to two hundred thousand

## Scenario

Organizations use Crossplane to give teams self-service infrastructure, with [[concepts/managed-resource]] objects as the lowest layer under higher-level [[concepts/composition]] APIs. The project's ADOPTERS list collects their reports. [[sources/research-managed-resource]]

## What adopters report

The entries are self-reported one-liners and not verified case studies. Nike describes an internal developer platform managing thousands of resources, and Autodesk a unified control plane. SAP reports 100-plus KRM control planes and thousands of managed resources as of February 2024, and Deutsche Kreditbank reports 10-plus EKS clusters with thousands of resources. DB Systel (Deutsche Bahn) describes fully GitOps self-service, and IBM, Elastic, UiPath, VMware Tanzu, and Nokia are also listed. Akamai reports provider-ceph orchestrating up to 200,000 managed resources. URL: https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md. The list's own phrasing is "Crossplane powers the internal developer platform managing thousands of resources from development to production."

## Lesson

The reported counts are well beyond what people manage by hand, which is why the scale costs of one CRD per type and per-resource polling matter. Treat the entries as pointers for further research and not as evidence of behavior. This wiki still lacks named, verified case studies, which is tracked in the adopters gap in [[open-knowledge-gaps]]. See also [[entities/crossplane]] and [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]].
