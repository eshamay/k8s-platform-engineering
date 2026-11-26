---
title: "Scope provider credentials per namespace or cluster-wide"
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [decision, credentials, multi-tenancy, provider, crossplane, ack, config-connector]
---

# Scope provider credentials per namespace or cluster-wide

## Status

Open. The sources describe the options each tool offers and recommend scoping, but give no production comparison, so this page records the trade-offs and is not a settled recommendation. [[sources/research-provider]]

## Context

A provider controller holds cloud credentials, and anyone who can create its objects effectively borrows those credentials, see [[findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions]]. A platform team must decide whether one identity serves the whole cluster or whether identities are scoped to namespaces, accounts, or projects. [[sources/research-provider]]

## Options

- One cluster-wide identity. Crossplane managed resources default to a `ClusterProviderConfig` named `default`, and Config Connector has a cluster mode. This is simple to operate.
- One configuration per account. Crossplane lets one cluster target several accounts with multiple `ProviderConfig` objects.
- Identity per namespace. ACK's `IAMRoleSelector` maps namespaces to IAM roles, and Config Connector's namespaced mode binds namespaces to Google service accounts and projects, see [[examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management]] and [[examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts]].

## Trade-offs

A single identity needs the union of everyone's permissions and, in Config Connector cluster mode, exhausts one quota project. Scoped identities limit blast radius and spread quota, but they add configuration per tenant and more roles to maintain. Reference settings are not a substitute, see [[findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation]]. Crossplane version 2 introduced `ClusterProviderConfig`, so scope and defaults differ from the v1.20 pages and the target version should be confirmed.

## Consequences to plan for

Applying manifests only from a trusted repository through GitOps narrows who can create objects at all. See [[concepts/provider]], [[entities/crossplane]], [[entities/ack]], and [[entities/config-connector]].

## Update from the o4 dossier

For Config Connector the CRD default is namespaced mode, and cluster mode requires exactly one credential, see [[findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential]]. The option's evidence was previously a best-practices summary, and it now rests on Google's installation-types page and the operator source. No recommendation is added. [[sources/research-gap-o4-config-connector-ack]]
