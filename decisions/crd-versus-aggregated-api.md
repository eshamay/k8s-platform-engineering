---
title: CRD versus aggregated API server
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [decision, crd, api-aggregation]
---

# CRD versus aggregated API server

## Status

Draft. This records a decision point described in the Kubernetes documentation, not a choice made by this wiki.

## Context

A team extending the Kubernetes API must choose how new kinds are served. The custom resources page describes two options. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## Options

A [concepts/custom-resource-definition](../concepts/custom-resource-definition.md) is served and stored by the API server itself in etcd, and it is the simplest option. An aggregated API is a separate API server behind the aggregation layer, with more control over storage and REST behavior at a higher operational cost.

## Decision guidance

Choose a CRD unless the kind needs storage other than etcd or custom REST semantics. Choosing an aggregated API means running and securing another server, and a CRD keeps all load on the shared store described in [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md).

## Consequences

CRDs inherit storage, authentication, authorization, versioning, and watch from the API server, which is why [concepts/universal-control-plane](../concepts/universal-control-plane.md) works with so little code.

## Additions from the CRD dossier

The custom resources page lists when a custom resource fits (a declarative API, kubectl and dashboard integration, RBAC and audit for free) and when it does not (a non-declarative API, unusual REST paths). It also warns that third-party CRD code adds failure points and that data lives in etcd and needs backup. [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md) See [concepts/custom-resource-definition](../concepts/custom-resource-definition.md).
