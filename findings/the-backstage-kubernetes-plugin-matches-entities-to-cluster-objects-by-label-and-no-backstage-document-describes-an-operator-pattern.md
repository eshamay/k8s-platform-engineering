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
aliases: [Backstage and operators]
tags: [backstage, portal, custom-resources, operators, platform-engineering]
---

# The Backstage Kubernetes plugin matches entities to cluster objects by label, and no Backstage document describes an operator pattern

## Observation

Backstage's Kubernetes feature is "designed around the needs of service owners, not cluster admins" and consists of a frontend and a backend plugin, where the backend "wraps the mechanics to connect to Kubernetes clusters to collect the relevant information". The backend fetches standard objects and the custom resources configured by group, apiVersion, and plural, and it matches them to catalog entities through the label `backstage.io/kubernetes-id` or a label selector annotation. A custom resource whose CRD is not installed "is silently skipped and its absence is logged at debug level". The feature supports watching resources "for real-time change notifications using async iterators", and a proxy endpoint exists for "interacting with Custom Resources beyond the default behaviors of the existing Kubernetes plugin". [[sources/research-gap-m7-operators-idempotency]]

## What it means for the operator pattern

This makes Backstage a read-oriented portal over whatever operators produce, which fits the wiki's earlier description of it as a user interface and metadata layer. No Backstage document read describes an operator pattern, and Software Templates were not read, so the claim that templates and the catalog form a platform layer above operators is unverified. Two further facts are separate from Backstage itself. Red Hat publishes an operator that deploys Red Hat Developer Hub, see [[examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift]]. Community plugins for Crossplane and Argo CD exist under TeraSky-OSS and backstage/community-plugins, which is SECONDARY-ONLY because only listings and a repository description were read. [[sources/research-gap-m7-operators-idempotency]]

## Related

[[findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd]], [[entities/backstage]], [[concepts/operator-pattern]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]
