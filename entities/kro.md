---
title: kro (kube-resource-orchestrator)
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: [kube-resource-orchestrator]
tags: [tool, platform]
---

# kro (kube-resource-orchestrator)

A tool that, like Crossplane, adds vocabulary for building internal developer platforms by grouping resources behind a simpler API, expressed as a resource graph. [[sources/krm-platform-vocabulary]]

## What kro is

Google announced kro on 2025-01-30 as a joint effort of Google, AWS, and Microsoft. A ResourceGraphDefinition expands one end-user CRD into a graph of Kubernetes resources, including cloud resources from [[entities/ack]], [[entities/config-connector]], and Azure Service Operator. The announcement describes kro as "a Kubernetes-native framework that lets you create reusable APIs to deploy multiple resources as a single unit." The project site describes an in-cluster controller driven by one CRD that reconciles continuously with drift detection, uses CEL (typed and non-Turing-complete) to reference fields across resources, and calls itself a SIG Cloud Provider subproject. The site showed version 0.10.0, so kro is pre-1.0, and the announcement said it was not production-ready. [[sources/research-universal-control-plane]]

Use cases from the announcement are in [[examples/self-service-gke-cluster-with-kro]]. See [[findings/immature-abstractions-in-the-control-plane-ecosystem]]. The dependency-graph and readiness mechanics were not visible in the fetched page.

## Resource graph details

The overview documentation says a ResourceGraphDefinition holds a schema, resource templates, and CEL expressions, and kro turns it into a CRD and controller. kro infers dependency order from expressions, waits on status values that do not exist yet, supports conditionals and forEach collections, and validates definitions at apply time. CEL is deliberately non-Turing-complete so definitions terminate and are auditable. The example composes an ACK S3 bucket and a Deployment behind a WebApp API, and the page showed version 0.10.0 with a Graph feature in alpha. [[sources/research-declarative-vs-imperative]] See [[examples/platform-team-self-service-apis-with-crossplane-and-kro]].

## Related concepts

[[concepts/composite-resource]], [[concepts/composition]], [[entities/crossplane]]

## To research

Resource graph definition, dependency and ordering semantics, CEL usage, maturity, and comparison with Crossplane Compositions (see [[open-knowledge-gaps]]).
