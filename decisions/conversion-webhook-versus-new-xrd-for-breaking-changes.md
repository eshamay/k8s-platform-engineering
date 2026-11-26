---
title: Conversion webhook versus a new XRD for breaking schema changes
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [decision, crossplane, versioning, crd]
---

# Conversion webhook versus a new XRD for breaking schema changes

## Status

Draft. This records a decision point described in Crossplane and Kubernetes documentation, not a choice made by this wiki.

## Context

A platform team has published a composite resource API through an XRD and now needs a breaking schema change. An XRD's group and names are immutable, so renaming the type is not an option, and the sources give two ways to ship the change. [[sources/research-gvk-and-gvr]]

## Options

The first option is a new version of the same XRD with a conversion webhook, which lets the API server translate between versions. `conversion.strategy: None` rewrites only the `apiVersion`, so it is suitable only when schemas match. The second option is a brand-new XRD, which creates a distinct type and leaves the old one untouched until consumers move.

## Decision guidance

Crossplane documentation recommends new XRDs or conversion webhooks for breaking changes. A webhook keeps one type and one name but adds a service to run, and the old version must be unserved and its stored objects migrated before removal. A new XRD avoids conversion machinery but forks the API, so consumers must be migrated. The dossier does not rank the two, and it did not detail how Crossplane v2 namespaced composite resources change the picture.

## Consequences

Either path makes the GVK a versioned product contract. See [[concepts/crd-versioning-and-storage-migration]], [[findings/group-and-plural-names-are-effectively-permanent]], and [[entities/crossplane]].
