---
title: Kubebuilder hub-and-spoke conversion for multi-version CRDs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [crd, conversion, kubebuilder, versioning]
---

# Kubebuilder hub-and-spoke conversion for multi-version CRDs

## Scenario

A controller project has shipped several versions of the same API and needs the apiserver to serve every one of them. Each served version must convert to and from whichever version is stored. [[sources/research-custom-resource-definition]]

## How it works

The Kubebuilder book describes picking one version as the hub, with every other version, called a spoke, defining conversion only to and from the hub. A request for any version then converts through the hub, so N versions need roughly 2(N-1) conversion functions instead of a function for every pair. This is the practical way controller-runtime projects implement a conversion webhook. URL: https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html. The quote supplied by the fetch tool is a paraphrase: "Mark one version as the 'hub', and all other versions just define conversion to and from the hub". The dossier did not read the worked tutorial that follows in the book.

## Lesson

The pattern limits how much conversion code must be written and tested, but it still produces a webhook service that the apiserver calls, and the dossier documents what happens when that service is down. See [[findings/a-down-conversion-webhook-can-stall-garbage-collection]], [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]], [[concepts/crd-versioning-and-storage-migration]], and [[entities/kubebuilder]].
