---
title: Platform API schemas are contracts and breaking changes are blocked or need conversion
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, kro, schema, versioning]
---

# Platform API schemas are contracts and breaking changes are blocked or need conversion

## Observation

Both tools treat the schema of a composite API as a contract with live consumers. For Crossplane, an XRD's `group` and `names` cannot be changed without deleting the XRD, and at v1.20 changing a schema required restarting the Crossplane pod. The XRD documentation recommends Kubernetes-style alpha, beta, and stable versioning. For kro, a breaking schema change on an RGD is blocked unless the `kro.run/allow-breaking-changes` annotation is set. Breaking means removing a field, changing a type, adding a required field without a default, or changing an enum or pattern. kro warns that forcing a change can invalidate existing instances. [[sources/research-composite-resource]] URLs: https://docs.crossplane.io/v1.20/concepts/composite-resource-definitions/ and https://kro.run/docs/concepts/rgd/overview/.

## Why it matters

The composite kind is the product that other teams consume, so a schema change reaches every instance and every manifest in Git. The tools differ in how they guard that: kro blocks by default, while Crossplane relies on versioning and conversion webhooks for breaking changes.

## Mitigations

Ship breaking changes as a new version or a new kind, and treat the override annotation as a last resort. See [[findings/group-and-plural-names-are-effectively-permanent]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]], [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]], and [[findings/crd-version-removal-without-migration-strands-stored-objects]].

## kro gate reports from the other-tool pitfalls dossier

kro v0.8.0 introduced the breaking-change gate in January 2026, and two September 2026 issues describe its edges: the error did not name the override annotation (1395), and added validation markers were not patched into the live CRD (1391). See [[findings/a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd]]. [[sources/research-gap-g1-other-tool-pitfalls]]
