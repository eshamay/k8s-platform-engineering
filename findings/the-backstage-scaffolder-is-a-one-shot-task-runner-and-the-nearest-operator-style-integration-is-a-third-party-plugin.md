---
title: "The Backstage Scaffolder is a one-shot task runner, and the nearest operator-style integration is a third-party plugin"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Backstage Scaffolder and operators]
tags: [backstage, scaffolder, operator-pattern, teraSky, portal]
---

# The Backstage Scaffolder is a one-shot task runner, and the nearest operator-style integration is a third-party plugin

## Observation

The Backstage Software Templates overview (https://backstage.io/docs/features/software-templates/, Backstage v1.57.0 site) says the Scaffolder can "load skeletons of code, template in some variables, and then publish" the result to locations such as GitHub or GitLab. Each run is "treated as a unique task" with a task list and a Start Over action. That is an imperative, run-once tool, not a reconcile loop. The Kubernetes configuration page (https://backstage.io/docs/features/kubernetes/configuration) ties entities to cluster objects through the `backstage.io/kubernetes-id` label or a `backstage.io/kubernetes-label-selector` annotation, where "the label selector takes precedence over the annotation/service id". `customResources` "Defaults to empty array", is set globally or per cluster, and a proxy option exists at `/api/kubernetes/proxy`. [[sources/research-gap-o6-platform-landscape]]

## Operator-style integrations

No Backstage document read describes an operator pattern. The nearest thing is the TeraSky Kubernetes Ingestor, a community plugin that is a controller-like sync loop in the Backstage backend, from cluster to catalog, see [[examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog]]. The upstream `backstage/community-plugins` repository has workspaces for argocd, flux, tekton, argo-workflows, and topology, and none named crossplane or kro. Kratix's Destination documentation names a Backstage catalog filled from a Git repository as a use case, a second integration shape where Git is the hand-off. [[sources/research-gap-o6-platform-landscape]]

## Limits

Only the overview page of Software Templates was read. Whether a built-in Scaffolder action creates Kubernetes custom resources is unverified because the builtin-actions and writing-templates pages were not read. [[sources/research-gap-o6-platform-landscape]]

## Related

[[entities/backstage]], [[findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern]], [[concepts/operator-pattern]]
