---
title: The Argo CD ApplicationSets CRD too large for client-side apply
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [argo-cd, crd, server-side-apply, helm]
---

# The Argo CD ApplicationSets CRD too large for client-side apply

## Scenario

A team installs Argo CD through its helm chart and syncs the chart with client-side apply. The generated schema of the ApplicationSets CRD has grown so large that the install fails. [[sources/research-custom-resource-definition]]

## What happened

An issue in the argo-helm repository reports the error "The ApplicationSets CRD is invalid: metadata.annotations may not be more than 262144 bytes". Client-side apply stores a copy of the object in the `last-applied-configuration` annotation, and for this CRD that copy exceeded the 262,144-byte annotation limit. URL: https://github.com/argoproj/argo-helm/issues/3704.

## Workaround

The issue lists two workarounds: set the `ServerSideApply=true` sync option, and for Kustomize also set `ClientSideApplyMigration=false`. The dossier does not explain why this works. The usual reason, which is general Kubernetes behavior and not stated by the source, is that server-side apply tracks ownership in `managedFields` and does not write the large annotation.

## Lesson

Large generated CRDs and delivery tools that rely on client-side apply collide, and the fix is a different apply mechanism rather than a smaller CRD. See [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]], [[concepts/server-side-apply-and-field-ownership]], and [[entities/argo-cd]].
