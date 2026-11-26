---
title: Radius Recipes let platform engineers decide what a Redis cache becomes in each environment
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [radius, recipes, example, application-platform]
---

# Radius Recipes let platform engineers decide what a Redis cache becomes in each environment

## The use case

In Radius, a developer describes an application with its containers, databases, and the connections between them, and asks for "a Redis cache" without specifying how to build one. A platform engineer then supplies a Recipe that decides what the `Redis` resource type becomes in a given environment. A third-party review describes this split as the heart of the product (https://devopsboys.com/blog/radius-application-platform-kubernetes-review-2026). [[sources/research-kro-and-abstraction-models]]

## Why it is an example of an abstraction model

The same application definition can therefore run with a lightweight implementation in a development environment and a managed cloud service in production, because the Recipe is bound to the environment and not to the application. The review credits this with development and production parity and credits the connection model and dependency graph with making wiring explicit. It is the same separation of concerns that a Crossplane Composition gives behind an XRD, with the difference that the developer-facing vocabulary is an application and not a platform-defined kind.

## Caveats

The review lists a Bicep dependency, an Azure lean, a separate control plane, and early maturity as limits. The primary Radius documentation could not be read, so this example has only secondary support. See [[entities/radius]] and [[findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog]].
