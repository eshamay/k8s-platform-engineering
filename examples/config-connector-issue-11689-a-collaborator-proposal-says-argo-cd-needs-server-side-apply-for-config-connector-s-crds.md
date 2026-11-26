---
title: Config Connector issue 11689, a collaborator proposal says Argo CD needs server-side apply for Config Connector's CRDs
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Config Connector issue 11689]
tags: [config-connector, argo-cd, server-side-apply, crd, annotation-limit]
---

# Config Connector issue 11689, a collaborator proposal says Argo CD needs server-side apply for Config Connector's CRDs

## Scenario

A team deploys Config Connector's CRD bundle through an Argo CD Application. The bundle is large, and client-side apply stores the whole object in the `last-applied-configuration` annotation, which is capped at 262,144 bytes. [[sources/research-gap-m4-ssa-conflict-policy]]

## What the issue says

GitHub issue 11689 in GoogleCloudPlatform/k8s-config-connector is a proposal by a repository collaborator. It says that "you **must enable Server-Side Apply** in your ArgoCD Application spec", because the CRD bundle exceeds the annotation limit. URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/11689. The issue was closed on 2026-10-04. The dossier first recorded it as open and corrected that during verification.

## Limits of the evidence

This is the text of a contributor proposal, not official documentation, and the public Config Connector page that might confirm it returned empty content. Treat it as the project's contributor view of the Argo CD seam, not as a documented requirement. The same constraint appears for other large CRDs in [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]] and [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]].

## Related

[[entities/config-connector]], [[entities/argo-cd]], [[findings/config-connector-writes-with-update-under-cnrm-controller-manager-and-reads-other-managers-fields-as-user-intent]]
