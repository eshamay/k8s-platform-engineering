---
title: Crossplane adopters report managed resource counts from thousands to two hundred thousand
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: []
tags: [crossplane, adopters, internal-developer-platform, scale, self-reported]
---

# Crossplane adopters report managed resource counts from thousands to two hundred thousand

## Scenario

Organizations use Crossplane to give teams self-service infrastructure, with [concepts/managed-resource](../concepts/managed-resource.md) objects as the lowest layer under higher-level [concepts/composition](../concepts/composition.md) APIs. The project's ADOPTERS list collects their reports. [sources/research-managed-resource](../sources/research-managed-resource.md)

## What adopters report

The entries are self-reported one-liners and not verified case studies. Nike describes an internal developer platform managing thousands of resources, and Autodesk a unified control plane. SAP reports 100-plus KRM control planes and thousands of managed resources as of February 2024, and Deutsche Kreditbank reports 10-plus EKS clusters with thousands of resources. DB Systel (Deutsche Bahn) describes fully GitOps self-service, and IBM, Elastic, UiPath, VMware Tanzu, and Nokia are also listed. Akamai reports provider-ceph orchestrating up to 200,000 managed resources. URL: https://github.com/crossplane/crossplane/blob/main/ADOPTERS.md. The list's own phrasing is "Crossplane powers the internal developer platform managing thousands of resources from development to production."

## Lesson

The reported counts are well beyond what people manage by hand, which is why the scale costs of one CRD per type and per-resource polling matter. Treat the entries as pointers for further research and not as evidence of behavior. This wiki still lacks named, verified case studies, which is tracked in the adopters gap in [open-knowledge-gaps](../open-knowledge-gaps.md). See also [entities/crossplane](../entities/crossplane.md) and [examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs](crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs.md).

## Re-read of the adopters file

The 2026-11-26 dossier counted 87 linked rows in the ADOPTERS file (last file commit 2026-10-27) and found numeric entries for about eight organizations, all self-reported. Quoted figures: SAP "100+ KRM based control planes" and "1000s of Managed Resources" as of February 2024, Consensys "more than 1,000 resources", Built Technologies "over 10,000 AWS resources" in a developer environment, Akamai provider-ceph "up to 200k Managed Resources" as a capability, DKB "more than 10+ EKS clusters", Nike "thousands of resources", SpareBank 1 Utvikling "over a thousand production microservices", and Jellysmack hundreds of IAM roles. See [examples/sap-reports-more-than-100-crossplane-based-control-planes-and-thousands-of-managed-resources-as-of-february-2024](sap-reports-more-than-100-crossplane-based-control-planes-and-thousands-of-managed-resources-as-of-february-2024.md), [examples/consensys-reports-managing-more-than-1000-resources-with-crossplane](consensys-reports-managing-more-than-1000-resources-with-crossplane.md), [examples/built-technologies-reports-peaks-above-10000-aws-resources-managed-by-crossplane-in-a-developer-environment](built-technologies-reports-peaks-above-10000-aws-resources-managed-by-crossplane-in-a-developer-environment.md), and [examples/sparebank-1-utvikling-reports-a-self-service-migration-of-over-a-thousand-production-microservices-with-crossplane](sparebank-1-utvikling-reports-a-self-service-migration-of-over-a-thousand-production-microservices-with-crossplane.md). [sources/research-gap-g1-named-adopters](../sources/research-gap-g1-named-adopters.md)
