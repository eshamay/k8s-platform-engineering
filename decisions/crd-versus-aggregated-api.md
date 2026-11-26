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
aliases: []
tags: [decision, crd, api-aggregation]
---

# CRD versus aggregated API server

## Status

Draft. This records a decision point described in the Kubernetes documentation, not a choice made by this wiki.

## Context

A team extending the Kubernetes API must choose how new kinds are served. The custom resources page describes two options. [[sources/research-universal-control-plane]]

## Options

A [[concepts/custom-resource-definition]] is served and stored by the API server itself in etcd, and it is the simplest option. An aggregated API is a separate API server behind the aggregation layer, with more control over storage and REST behavior at a higher operational cost.

## Decision guidance

Choose a CRD unless the kind needs storage other than etcd or custom REST semantics. Choosing an aggregated API means running and securing another server, and a CRD keeps all load on the shared store described in [[findings/etcd-scale-limits-of-the-shared-store]].

## Consequences

CRDs inherit storage, authentication, authorization, versioning, and watch from the API server, which is why [[concepts/universal-control-plane]] works with so little code.
