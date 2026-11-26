---
title: Platform-team self-service APIs with Crossplane and kro
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [use-case, platform, crossplane, kro]
---

# Platform-team self-service APIs with Crossplane and kro

## Scenario

A platform team wants application teams to file one object, such as a WebApp or a database, and get everything behind it: Deployments, Services, and cloud resources. [[sources/research-declarative-vs-imperative]]

## With Crossplane

A CompositeResourceDefinition defines the schema of the platform-owned API, and a Composition composes individual resources into "a larger, reusable, solution." Composition functions are gRPC servers in a pipeline that compute desired composed resources, and Crossplane reconciles observed against desired. See [[entities/crossplane]], [[concepts/composition]], and [[concepts/composite-resource]].

## With kro

A ResourceGraphDefinition holds a schema, resource templates, and CEL expressions, and kro generates a CRD and controller from it. The documentation's example composes an ACK S3 bucket and a Deployment behind one WebApp API. kro infers dependency order from expressions and waits on status values that do not exist yet. See [[entities/kro]], [[entities/ack]], and [[examples/self-service-gke-cluster-with-kro]].

## Why it is declarative

The application team states intent in one object and never scripts the steps. The abstraction makes the end-state richer without changing the model. See [[concepts/declarative-vs-imperative]].

## Caveat

kro was pre-1.0 (0.10.0, with a Graph feature in alpha) in the dossier, and the dossier names no adopters of either tool. See [[findings/immature-abstractions-in-the-control-plane-ecosystem]].
