---
title: The EKS kro capability composes ACK S3 buckets with Deployments and ConfigMaps
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: resource-composition-with-kro
    hash: 1d5781610376
    ingested: 2026-11-26
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [kro, ack, eks, aws, resource-graph]
---

# The EKS kro capability composes ACK S3 buckets with Deployments and ConfigMaps

## Scenario

AWS documents kro as a managed capability of Amazon EKS and walks through a beginner example, a `WebApplication` API whose ResourceGraphDefinition produces a Deployment and a Service. Its main use-case section goes further and composes ACK S3 Buckets with ConfigMaps and Deployments. [sources/research-composite-resource](../sources/research-composite-resource.md)

## How it works

The RGD declares the user-facing API in SimpleSchema and lists the underlying resources as templates. CEL expressions written as `${...}` reference the user's spec and the status of other resources. When the application needs to know where its bucket lives, the Deployment's configuration refers to the bucket ARN from the ACK object's `status.ackResourceMetadata`. kro infers from that reference that the bucket must exist first, builds a dependency graph, and creates independent resources in parallel. The guide explains the standalone and string-template CEL forms, optional access, ternaries, and `includeWhen`, which can reference only `schema.spec`. URL: https://docs.aws.amazon.com/eks/latest/userguide/kro-concepts.html.

The guide stresses a timing property: "kro validates ResourceGraphDefinitions at creation time, not at runtime." A mistyped field or a cycle is rejected when the platform engineer applies the RGD, before any application team creates an instance.

## Why the example matters

It is evidence that a hyperscaler productized kro and pairs it with ACK, which fills the role of leaf provider while kro supplies the composite layer. It also shows the status-to-spec wiring that gives a resource graph its ordering. The project itself still reports a `v1alpha1` API, so a managed offering does not settle maturity, see [findings/immature-abstractions-in-the-control-plane-ecosystem](../findings/immature-abstractions-in-the-control-plane-ecosystem.md). For the same pattern on Google Cloud see [examples/self-service-gke-cluster-with-kro](self-service-gke-cluster-with-kro.md), and for the tools see [entities/kro](../entities/kro.md) and [entities/ack](../entities/ack.md).

## First-party ACK view of the same pattern (o3 dossier)

The ACK documentation's own kro guide composes an S3 Bucket, a DynamoDB Table, and a Deployment and states the readiness and deletion ordering, see [examples/the-ack-docs-kro-guide-composes-an-s3-bucket-a-dynamodb-table-and-a-deployment-and-deletes-the-deployment-before-the-aws-resources](the-ack-docs-kro-guide-composes-an-s3-bucket-a-dynamodb-table-and-a-deployment-and-deletes-the-deployment-before-the-aws-resources.md). [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

## The EKS overview page that precedes this example

AWS also publishes a short overview page, "Resource composition with kro", which introduces the managed capability, shows the `WebApplication` RGD that produces a Deployment and a Service, and describes how to enable the capability through the console, CLI, or an infrastructure-as-code tool. It names ACK and Argo CD as the two integrations with other managed capabilities. The ACK S3 composition in this example comes from the longer AWS guide, and the overview page does not repeat it. [sources/resource-composition-with-kro](../sources/resource-composition-with-kro.md)
