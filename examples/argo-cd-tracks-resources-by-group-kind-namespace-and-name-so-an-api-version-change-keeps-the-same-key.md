---
title: Argo CD tracks resources by group, kind, namespace, and name so an API version change keeps the same key
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, gvk, resource-tracking, gitops-engine, version]
---

# Argo CD tracks resources by group, kind, namespace, and name so an API version change keeps the same key

## Scenario

Argo CD's annotation tracking writes `argocd.argoproj.io/tracking-id: my-app:apps/Deployment:default/my-deployment`, and the documentation says tracking will "consider the resource properties in the annotation (name, namespace, group and kind)". https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/resource_tracking.md (latest release v3.6.3, published 2026-11-24) [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

In the gitops-engine library the `ResourceKey` struct has Group, Kind, Namespace and Name only, and the cluster cache is indexed by GroupKind and watches "a list of the preferred versions of all API resources which are to be monitored". When it compares live and desired state it converts the live object to the manifest's version with `c.kubectl.ConvertToVersion(managedObj, targetObj.GroupVersionKind().Group, targetObj.GroupVersionKind().Version)`. https://github.com/argoproj/gitops-engine/blob/master/pkg/cache/cluster.go

## Reading

A manifest that moves from one version of a kind to another maps to the same key, so the move does not by itself orphan or prune the live object. This reading comes from the source, and the dossier did not test a removed served version. See [findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately](../findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately.md), [decisions/choose-an-argo-cd-resource-tracking-method-annotation-annotation-plus-label-or-label](../decisions/choose-an-argo-cd-resource-tracking-method-annotation-annotation-plus-label-or-label.md), and [entities/argo-cd](../entities/argo-cd.md).
