---
title: "Config Connector namespaced mode is the CRD default and needs one ConfigConnectorContext per namespace while cluster mode takes exactly one credential"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [config-connector, installation-modes, namespaced, cluster-mode, identity]
---

# Config Connector namespaced mode is the CRD default and needs one ConfigConnectorContext per namespace while cluster mode takes exactly one credential

## Observation

Google's installation-types page (last updated 2026-11-19) says Config Connector can be installed in namespaced mode, "recommended for most use cases", or in cluster mode, and that namespaced mode "provides better permission isolation". The operator's `ConfigConnector` CRD agrees: the field comment reads "This can be either 'cluster' or 'namespaced'. The default is 'namespaced'." [sources/research-gap-o4-config-connector-ack](../sources/research-gap-o4-config-connector-ack.md)

In cluster mode one Google service account serves every resource, even across several projects. The CRD requires exactly one of `googleServiceAccount` or `credentialSecretName`: "You must specify either `credentialSecretName` or `googleServiceAccount` when in cluster mode, but not both."

In namespaced mode each enabled namespace needs its own `ConfigConnectorContext` object that names that namespace's Google service account. The context also carries per-namespace `requestProjectPolicy`, `billingProject`, `stateIntoSpec`, and `actuationMode`, an experimental per-kind controller override, and an immutable `managerNamespace` that deploys the controller managers there instead of in `cnrm-system`. With `actuationMode: Paused`, resources are still reconciled with the API server but not actuated onto the cloud, and the context value overrides the `ConfigConnector` value in namespaced mode.

Namespace annotations such as `cnrm.cloud.google.com/project-id` pick the target project, folder, or organization, but "will only be applied if the resource configuration does not already specify where to create the resource".

## What remains unsettled

The dossier did not read the manual-install or IAM pages, so it does not say whether the namespace annotation behavior or the number of controller pods differs between the two modes. A concrete scenario of one cluster serving several team projects is in [examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts](../examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts.md).

## Why it matters

The mode decides which identity performs cloud calls, which is the access boundary described in [findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions](anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions.md). The general trade-off is laid out in [decisions/scope-provider-credentials-per-namespace-or-cluster-wide](../decisions/scope-provider-credentials-per-namespace-or-cluster-wide.md).

## Related

[entities/config-connector](../entities/config-connector.md), [findings/config-connector-deletion-policy-has-two-source-values-and-only-abandon-changes-the-delete-path-and-the-terraform-based-controller-path-is-unverified](config-connector-deletion-policy-has-two-source-values-and-only-abandon-changes-the-delete-path-and-the-terraform-based-controller-path-is-unverified.md)
