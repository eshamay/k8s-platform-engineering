---
title: Build a custom operator or compose existing resources
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: []
tags: [decision, operators, composition, build-versus-buy]
---

# Build a custom operator or compose existing resources

## Status

Draft. This records a decision point described in documentation, not a choice made by this wiki.

## Context

A team needs a new API for something it manages. It can scaffold an operator with Kubebuilder or the Operator SDK, describe the API as a Crossplane Composition or kro ResourceGraphDefinition, or skip custom resources altogether. The Kubernetes documentation says a custom resource suits declarative APIs of small, infrequently updated objects, so not every automation needs one. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Options

A hand-written operator gives full control and can encode logic such as backups, failover, and schema migrations. Composition gives a custom API without controller code when the work is mostly assembling existing resources, and the dossier names Crossplane and kro as the replacements for a bespoke controller in that case.

## Decision guidance

The dossier advises composition when the custom API is mostly composition of existing resources and a custom operator when domain logic is needed. It gives no criteria for choosing between Crossplane and kro, nor for choosing a language. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Consequences

A hand-written operator brings the full set of pitfalls: cache handling, idempotency, finalizers, status, and privileges. Composition moves those into the tool but adds its own layer. See [findings/hand-written-operators-duplicate-what-composition-could-express](../findings/hand-written-operators-duplicate-what-composition-could-express.md).

## Related

[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](../comparisons/hand-written-operator-versus-crossplane-composition-versus-kro.md), [decisions/crd-versus-aggregated-api](crd-versus-aggregated-api.md), [concepts/operator-pattern](../concepts/operator-pattern.md)

## Update from the m7 dossier

The framework side of this choice, with evidence and no recommendation, is in [decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition](choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)
