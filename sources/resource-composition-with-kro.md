---
title: "Amazon EKS documentation: Resource composition with kro"
type: source
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: resource-composition-with-kro
    hash: 1d5781610376
    ingested: 2026-11-26
aliases: []
tags: [kro, eks, aws, eks-capabilities, managed-kro, ack, argo-cd, vendor-docs, targeted-pass]
---

# Amazon EKS documentation: Resource composition with kro

> [!NOTE]
> **Raw file:** `raw/resource-composition-with-kro` (sha256 prefix 1d5781610376)<br>
> **URL:** https://docs.aws.amazon.com/eks/latest/userguide/kro.html<br>
> **Author and date:** Amazon Web Services documentation team, no named author; the page carries no publication date in the saved text, and the raw file was supplied on 2026-11-26<br>
> **Kind:** Vendor documentation, primary for what AWS offers as managed kro and not an independent evaluation of kro<br>
> **Ingested:** 2026-11-26 as a targeted pass over the kro, ACK, and Argo CD pages

## Summary

The page is the short overview of kro inside the Amazon EKS "Capabilities" documentation. It describes kro as an open-source, Kubernetes-native project for defining custom Kubernetes APIs, and it says that under EKS Capabilities AWS runs kro as a fully managed service so customers do not install, maintain, or scale kro controllers on their clusters. It then explains how a ResourceGraphDefinition works, lists the benefits, gives a small `WebApplication` example that produces a Deployment and a Service, names two integrations with other EKS managed capabilities, and ends with three getting-started steps.

The page is an overview and not a reference. It states no scale limits, no supported kro version, no pricing, no controller resource settings, and no deletion or finalizer behavior, so it adds product facts to the wiki and adds no operating numbers. The wiki already held a different and longer AWS page on kro use cases, which composes ACK S3 buckets with Deployments, see [examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps](../examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps.md). This page is the front door to that material and does not repeat it.

## Key claims

- AWS says that with EKS Capabilities "kro is fully managed by AWS", which removes installing, maintaining, and scaling kro controllers on the customer's clusters. The page makes this statement twice.
- A ResourceGraphDefinition causes kro to create and register a new CRD from a single resource specification, and kro then manages the custom resources created from that CRD.
- An RGD can contain several resources, and kro determines their interdependencies and ordering so the author does not have to. Values pass from one resource to another with a simple expression syntax, which the page says removes the need for "glue" operators.
- The page states that kro supports "a single primary resource type", the ResourceGraphDefinition, and that kro manages the lifecycle of the custom resources and all their constituent resources.
- Composed resources can be native Kubernetes resources or any CRD installed in the cluster.
- kro integrates with ACK so that workload resources and AWS resources can be composed into higher-level abstractions, described as cloud building blocks with default and immutable settings that follow organizational standards.
- kro uses Common Expression Language to pass values between resources and to express conditional logic.
- kro supports declarative configuration through Kubernetes manifests, so the page says it fits GitOps workflows.
- The page names two integrations with other EKS managed capabilities. ACK composes AWS resources inside an RGD, and Argo CD manages the deployment of kro custom resources across multiple clusters.
- The example RGD uses `apiVersion: kro.run/v1alpha1`, a schema with `name: string` and `replicas: integer | default=3`, and two resources, `deployment` and `service`, that reference `${schema.spec.name}` and `${schema.spec.replicas}`.
- To get started, a user creates a kro capability resource on the EKS cluster through the AWS Console, the AWS CLI, or an infrastructure-as-code tool, then creates RGDs, then applies instances of the custom resources.

## Entities and concepts

- Entities: [entities/kro](../entities/kro.md), [entities/ack](../entities/ack.md), [entities/argo-cd](../entities/argo-cd.md).
- Concepts: [concepts/composition](../concepts/composition.md), [concepts/composite-resource](../concepts/composite-resource.md), [concepts/custom-resource-definition](../concepts/custom-resource-definition.md).

## Limits

The page is vendor documentation and promotional in tone ("seamlessly", "greatly simplifying"), so its benefit statements are AWS's own description and are not evidence of measured outcomes. It does not say which kro release the managed capability runs, whether the alpha `Graph` kind is installed, how the managed controllers scale, or how much a capability costs. The saved text is a text rendering with the YAML flattened and no headings markup, and any tabs, notes, or links on the live page were not captured.

## Pages touched

[entities/kro](../entities/kro.md), [entities/ack](../entities/ack.md), [entities/argo-cd](../entities/argo-cd.md), [examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps](../examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps.md), [decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api](../decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api.md), and the new [findings/the-amazon-eks-kro-overview-lists-resourcegraphdefinition-as-the-only-primary-resource-type-and-names-no-kro-version](../findings/the-amazon-eks-kro-overview-lists-resourcegraphdefinition-as-the-only-primary-resource-type-and-names-no-kro-version.md).
