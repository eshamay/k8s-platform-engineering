---
title: kpt and KRM functions
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: [kpt, KRM functions, Configuration as Data]
tags: [tool, render-time, krm-functions, configuration-as-data]
---

# kpt and KRM functions

kpt is a package-centric toolchain that treats configuration as data stored apart from live cluster state, and its KRM function model is the shared ancestor of several render-time extension mechanisms. [[sources/research-kro-and-abstraction-models]]

## Configuration as Data

The kpt repository describes Configuration as Data as "an approach to management of configuration which makes configuration data the source of truth". Packages of Kubernetes objects are kept in a store, edited and validated by programs, and only later applied to a cluster. The project is a CNCF Sandbox project (https://github.com/kptdev/kpt). [[sources/research-kro-and-abstraction-models]]

## KRM functions

A KRM function is an idempotent program, run in a container, that reads a list of Kubernetes objects and writes a list of Kubernetes objects. It can be written in any language. The dossier notes that Crossplane's composition functions and Kustomize's plugin system echo this model, but it did not fetch the KRM function specification itself, so the exact input and output contract is not established here and is tracked in [[open-knowledge-gaps]]. The container requirement has a real cost, shown in [[findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack]]. Crossplane avoids that cost by running its functions in-cluster as gRPC services, and kro avoids it by evaluating CEL in process. [[sources/research-kro-and-abstraction-models]]

## Related

[[entities/kustomize]], [[entities/crossplane]], [[concepts/composition]], [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]]
