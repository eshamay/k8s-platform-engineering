---
title: Build the same StorageApp API with kro and with a Crossplane Go-templating Composition
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [kro, crossplane, example, s3, eks, comparison]
---

# Build the same StorageApp API with kro and with a Crossplane Go-templating Composition

## The setup

An AWS Builders community tutorial on DEV Community builds one platform API, `StorageApp`, twice, so the two tools can be compared on identical requirements (https://dev.to/aws-builders/building-an-s3-backed-app-on-eks-comparing-kro-and-crossplane-composition-4ed8). One `StorageApp` manifest yields an application, an S3 bucket, and an IAM role. The dossier read the page through a summarizing fetch, so details are a digest. [sources/research-kro-and-abstraction-models](../sources/research-kro-and-abstraction-models.md)

## Two builds

In the first build, a kro ResourceGraphDefinition sits on top of Crossplane managed resources, so kro handles the graph and Crossplane providers reach AWS. In the second build, a pure Crossplane XRD is paired with a Composition that uses `function-go-templating`. The source reports that the outcomes were equivalent: the application, the bucket, and the role were created, data was preserved on deletion, and permission failures were reflected in readiness.

## What differed

The template-based Composition needs hand-written logic for creation order and for avoiding deletion of a resource when a dependency is briefly unavailable. kro's reference model handles both more naturally, because order is inferred from the expressions that reference other resources. The author's summary is that the kro route makes the platform-side definitions "easier to read and write." See [findings/go-template-compositions-need-hand-written-ordering-and-deletion-guards](../findings/go-template-compositions-need-hand-written-ordering-and-deletion-guards.md).

## Why it is useful

The example shows that the two tools can be combined and not only compared, which is the same convergence that [entities/function-kro](../entities/function-kro.md) formalizes inside a Crossplane pipeline. It is also the closest thing in the dossier to a like-for-like experiment. It is a single tutorial, not a production report, and it gives no scale or incident data. See [comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models](../comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models.md) and [decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer](../decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer.md).
