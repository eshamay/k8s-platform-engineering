---
title: Crossplane
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
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
aliases: []
tags: [tool, platform]
---

# Crossplane

A Kubernetes extension that turns the cluster into a [[concepts/universal-control-plane]] for external infrastructure. It introduces [[concepts/provider|providers]], [[concepts/managed-resource|managed resources]], [[concepts/composite-resource|composite resources]], and [[concepts/composition|compositions]]. [[sources/krm-platform-vocabulary]]

## Compositions and functions

A CompositeResourceDefinition (XRD) defines a platform-team-owned API schema, and a Composition maps each composite resource to a pipeline of functions. Functions are gRPC servers that receive observed state, accumulated desired state, and input, and return new desired state. Crossplane applies that state and re-observes on each reconcile. The documentation summarizes this as "A pipeline of functions accumulates desired state." This moves composition logic out of YAML templating and into code with state feedback on each loop. The Crossplane home page frames the project as a way to "Extend Kubernetes to manage any resource anywhere" but names no adopters. Crossplane applies composed resources with its own service account, so RBAC on the composite resource API is the main guardrail. [[sources/research-universal-control-plane]]

See [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]] and [[findings/blast-radius-and-privilege-centralization]].

## Declarative framing

The Crossplane documentation says a Composition "composes individual resources together into a larger, reusable, solution," with an XRD defining the composite schema and functions computing desired composed resources. The 2018-era announcement described a "universal declarative-style API for cloud computing" built on claims and classes, which differs from the current composite resource, composition, and function model. [[sources/research-declarative-vs-imperative]] See [[examples/platform-team-self-service-apis-with-crossplane-and-kro]].

## Reconcile cadence

A provider re-reconciles each managed resource, compares `forProvider` to the external resource, and acts according to `managementPolicies` such as Observe, Update, and LateInitialize. A poll interval and a pause annotation control cadence, but the default poll interval was not confirmed from a thin fetch. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]] and [[examples/cloud-console-changes-reverted-by-provider-controllers]].

## Related concepts

[[concepts/custom-resource-definition]], [[concepts/finalizers]], [[concepts/self-healing-and-drift-detection]]

## To research

Architecture, composition functions, provider scaling, claims, adoption stories, pitfalls, and a ramp-up tutorial. See the Compositions versus kro gap in [[open-knowledge-gaps]].
