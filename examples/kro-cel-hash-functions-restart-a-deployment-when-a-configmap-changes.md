---
title: kro CEL hash functions restart a Deployment when a ConfigMap changes
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [kro, cel, helm, configmap, rollout, example]
---

# kro CEL hash functions restart a Deployment when a ConfigMap changes

## The Helm habit

Helm chart authors commonly add a checksum of a ConfigMap to a pod template annotation, so that a change to the ConfigMap changes the pod template and forces the Deployment to roll. Because Helm renders once at install or upgrade time, the checksum is computed in the template.

## The kro equivalent

The kro FAQ shows the Helm-style checksum trick for restarting a Deployment when a ConfigMap changes, done with CEL hash functions inside a ResourceGraphDefinition (https://kro.run/docs/faq). The dossier records only a one-sentence summary of that FAQ entry and not the expression itself, so the exact template is not reproduced here. Presumably the Deployment template references the ConfigMap in the same graph, which would also give kro the dependency edge it needs for ordering, but that wiring is an inference and not a claim from the source. [[sources/research-kro-and-abstraction-models]]

## What it shows

The example shows that a pattern that used to need a template engine can be written in kro's bounded expression language. Because kro reconciles continuously, the expression is re-evaluated by a controller and not only at install time. It also shows the limits of the comparison with Helm: the logic is still declared by the platform author, and the end user of the generated API never sees it. See [[entities/kro]], [[comparisons/helm-versus-kro-versus-crossplane-as-platform-abstraction-layers]], and [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]].
