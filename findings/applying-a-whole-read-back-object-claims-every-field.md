---
title: Applying a whole read-back object claims every field
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [pitfall, controller, server-side-apply, anti-pattern]
---

# Applying a whole read-back object claims every field

## Observation

A controller that reads an object from the server and applies the whole object back claims ownership of every field in it, including fields set by users and other controllers. The dossier says the server notices this and rejects it. The recommended patterns are extract-modify-apply, where the controller extracts only its own fields, and constructing the desired fields from scratch. [[sources/research-server-side-apply-and-field-ownership]]

## Evidence

The Kubernetes maintainer blog names two controller styles: "extract and re-apply" for existing controllers and "reconstructive" controllers for new ones. The Kubebuilder book's best practices are to always set a field owner, force ownership of the fields the controller manages, and only specify fields you manage. See [[examples/kubebuilder-controller-applies-status-with-a-field-owner]].

## Related anti-pattern

Writing `managedFields` by hand is discouraged by the API documentation and is only a recovery tool. See [[findings/managedfields-are-hidden-from-kubectl-output-by-default]], [[entities/kubebuilder]], and [[concepts/server-side-apply-and-field-ownership]].
