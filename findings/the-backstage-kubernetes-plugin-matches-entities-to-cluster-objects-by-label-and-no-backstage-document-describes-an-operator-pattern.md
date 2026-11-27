---
title: "The Backstage Kubernetes plugin matches entities to cluster objects by label, and no Backstage document describes an operator pattern"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Backstage and operators]
tags: [backstage, portal, custom-resources, operators, platform-engineering]
---

# The Backstage Kubernetes plugin matches entities to cluster objects by label, and no Backstage document describes an operator pattern

## Observation

Backstage's Kubernetes feature is "designed around the needs of service owners, not cluster admins" and consists of a frontend and a backend plugin, where the backend "wraps the mechanics to connect to Kubernetes clusters to collect the relevant information". The backend fetches standard objects and the custom resources configured by group, apiVersion, and plural, and it matches them to catalog entities through the label `backstage.io/kubernetes-id` or a label selector annotation. A custom resource whose CRD is not installed "is silently skipped and its absence is logged at debug level". The feature supports watching resources "for real-time change notifications using async iterators", and a proxy endpoint exists for "interacting with Custom Resources beyond the default behaviors of the existing Kubernetes plugin". [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## What it means for the operator pattern

This makes Backstage a read-oriented portal over whatever operators produce, which fits the wiki's earlier description of it as a user interface and metadata layer. No Backstage document read describes an operator pattern, and Software Templates were not read in the first pass, so the claim that templates and the catalog form a platform layer above operators was unverified. The overview page has since been read and describes a run-once task runner, see the correction note below. Two further facts are separate from Backstage itself. Red Hat publishes an operator that deploys Red Hat Developer Hub, see [examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift](../examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift.md). Community plugins for Crossplane and Argo CD exist under TeraSky-OSS and backstage/community-plugins, which is SECONDARY-ONLY because only listings and a repository description were read. [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Related

[findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd](backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd.md), [entities/backstage](../entities/backstage.md), [concepts/operator-pattern](../concepts/operator-pattern.md), [comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers](../comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers.md)

## Update from the o6 dossier

Correction note: the Software Templates overview was read in a later pass. It describes the Scaffolder as a tool that loads code skeletons, templates variables, and publishes the result, with each run a unique task, so it is not an operator. The TeraSky Kubernetes Ingestor README, now read, says it auto-ingests Crossplane claims and kro instances as catalog components, which upgrades that item from listing-only to a README-level SECONDARY-ONLY claim. The `backstage/community-plugins` repository has no crossplane or kro workspace. See [findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin](the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin.md). [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)
