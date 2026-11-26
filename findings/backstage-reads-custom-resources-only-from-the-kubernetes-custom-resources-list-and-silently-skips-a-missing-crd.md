---
title: "Backstage reads custom resources only from the kubernetes.customResources list and silently skips a missing CRD"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [backstage, crd, kubernetes-plugin, configuration, verified]
---

# Backstage reads custom resources only from the kubernetes.customResources list and silently skips a missing CRD

## Observation

The Backstage Kubernetes plugin does not discover CRDs. Custom resources are fetched only if listed under `kubernetes.customResources` with group, apiVersion and plural. The property can be set globally and "is overridden by `customResources` at the clusters level". For a missing CRD "it is silently skipped and its absence is logged at debug level." https://raw.githubusercontent.com/backstage/backstage/master/docs/features/kubernetes/configuration.md, read 2026-11-26 (latest release v1.57.3). [[sources/research-gap-m6-admission-crds]]

## Not found

Backstage's catalog handling of CRDs beyond this configuration was not read, because only the Kubernetes configuration page was searched. That stays UNVERIFIED.

## Related

[[entities/backstage]] and [[findings/custom-resources-applied-before-their-crd-exists]].
