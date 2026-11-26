---
title: XRDs and ResourceGraphDefinitions declare a platform GVK
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [gvk, crossplane, kro, platform-api]
---

# XRDs and ResourceGraphDefinitions declare a platform GVK

## Scenario

A platform team wants application teams to create a `Database` or `App` object in the team's own API group. It declares the type once, and the tool generates the CRD that application teams consume. [[sources/research-gvk-and-gvr]]

## Crossplane

A CompositeResourceDefinition (XRD) declares `group`, `kind`, `plural`, a list of versions, and a `scope`, and Crossplane generates the CRD from it. The XRD name must be `<plural>.<group>`. Group and names are immutable, so changing them means deleting and recreating the XRD. Schema edits need a Crossplane pod restart. URL: https://docs.crossplane.io/latest/composition/composite-resource-definitions/.

## kro

A ResourceGraphDefinition (RGD) has a `schema` block that declares `apiVersion`, `kind`, and an optional `group`, which defaults to `kro.run`. kro converts the SimpleSchema into an OpenAPI v3 schema, creates a CRD named `<plural>.<group>`, and infers the types of status fields from CEL expressions. This is the same GVK-factory idea with a lighter authoring syntax. URL: https://kro.run/docs/concepts/rgd/schema/.

## Lesson

The GVK becomes the platform's public contract, so naming and versioning decisions are product decisions. A group chosen carelessly cannot be changed later. See [[findings/group-and-plural-names-are-effectively-permanent]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]], [[examples/platform-team-self-service-apis-with-crossplane-and-kro]], [[entities/crossplane]], and [[entities/kro]].
