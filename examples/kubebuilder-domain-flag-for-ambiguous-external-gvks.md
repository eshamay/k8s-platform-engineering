---
title: Kubebuilder proposes a --domain flag for ambiguous external GVKs
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
aliases: []
tags: [gvk, kubebuilder, scaffolding]
---

# Kubebuilder proposes a --domain flag for ambiguous external GVKs

## Scenario

A project composes external APIs while scaffolding with Kubebuilder. Two external resources can share the same Group, Version, and Kind under different domains, so the Group, Version, and Kind alone do not identify one type. [[sources/research-gvk-and-gvr]]

## The proposal

Kubebuilder issue 5872, opened on 2026-07-14, proposes that the tool error on an ambiguous external GVK resolution and accept an explicit `--domain` flag. The dossier says the issue was still open and carried stale and unstale labels as of late October 2026, and whether it lands is unknown. URL: https://github.com/kubernetes-sigs/kubebuilder/issues/5872.

## Lesson

GVK is a strong identifier inside one cluster, but it is not always a unique key in tooling that works across API domains. The safe response in the proposal is to fail and ask for explicit input. See [[entities/kubebuilder]] and [[concepts/gvk-and-gvr]].
