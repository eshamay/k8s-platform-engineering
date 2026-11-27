---
title: "Config Connector namespaced mode maps namespaces to projects and service accounts"
type: example
status: active
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
tags: [config-connector, google-cloud, multi-tenancy, credentials, quota]
---

# Config Connector namespaced mode maps namespaces to projects and service accounts

## Scenario

An organization on Google Cloud runs several teams on one Kubernetes cluster, and each team owns a separate Google Cloud project. A single Config Connector identity in cluster mode would give every team the same permissions and would charge every API call to one quota project. [sources/research-provider](../sources/research-provider.md)

## How it works

Google's best-practices page recommends namespaced mode. Each namespace binds to its own Google service account and project, so a team's manifests can only act with that team's permissions, and API quota is spread across projects instead of being exhausted in one. The same page describes the abandon deletion policy and the acquire workflow, which let a resource move between projects or namespaces without being deleted. [sources/research-provider](../sources/research-provider.md)

## Lesson

Because reconciliation runs as the controller's service account and not as the person who applied the manifest, the namespace to service account mapping is the real access boundary, see [findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions](../findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions.md). The choice of scope is generalized in [decisions/scope-provider-credentials-per-namespace-or-cluster-wide](../decisions/scope-provider-credentials-per-namespace-or-cluster-wide.md), and the same idea appears for AWS in [examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management](ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management.md). See [entities/config-connector](../entities/config-connector.md).

## Verification from the o4 dossier

The recommendation and the per-namespace service account model are now confirmed from Google's installation-types page (updated 2026-11-19) and the operator source, which adds the `ConfigConnectorContext` object, the `managerNamespace` setting, and the CRD default, see [findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential](../findings/config-connector-namespaced-mode-is-the-crd-default-and-needs-one-configconnectorcontext-per-namespace-while-cluster-mode-takes-exactly-one-credential.md). Whether the project-annotation behavior differs by mode was not read. [sources/research-gap-o4-config-connector-ack](../sources/research-gap-o4-config-connector-ack.md)
