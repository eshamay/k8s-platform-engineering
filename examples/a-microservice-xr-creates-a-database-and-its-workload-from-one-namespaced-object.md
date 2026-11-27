---
title: A Microservice XR creates a database and its workload from one namespaced object
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
aliases: []
tags: [use-case, crossplane, crossplane-v2, illustration]
---

# A Microservice XR creates a database and its workload from one namespaced object

## Scenario

The Crossplane 2.0 announcement sketches a platform team that offers a `Microservice` kind. One namespaced object creates an RDS instance, security groups, a Deployment, a Service, an Ingress, and monitoring dashboards. [sources/research-composition](../sources/research-composition.md)

## What makes it possible

Crossplane 2.0 lets a Composition include any Kubernetes resource, not only Crossplane-managed ones, so the same XR can provision cloud infrastructure and deploy the application. XRs are namespaced by default and the claim and XR split is removed, so the developer's object lives in the developer's namespace. The announcement is at https://blog.crossplane.io/announcing-crossplane-2-0/ (12 August 2025).

## Caveat

The dossier states this is an illustration from the Crossplane authors and not a named customer, so the page stays at draft until a real deployment is found. For the earlier claim-based model see [examples/a-v1-crossplane-claim-fronts-a-cluster-scoped-composite-resource](a-v1-crossplane-claim-fronts-a-cluster-scoped-composite-resource.md).

## Related

[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources](../comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources.md), [concepts/composition](../concepts/composition.md), [entities/crossplane](../entities/crossplane.md), [examples/platform-team-self-service-apis-with-crossplane-and-kro](platform-team-self-service-apis-with-crossplane-and-kro.md)
