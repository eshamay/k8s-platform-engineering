---
title: "Anyone who can create a provider-managed object gets the controller's cloud permissions"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [provider, security, credentials, config-connector, rbac]
---

# Anyone who can create a provider-managed object gets the controller's cloud permissions

## Observation

Config Connector's overview states that reconciliation runs as the Config Connector IAM service account and not as the human who applied the manifest. It follows that permission to create the Kubernetes object is effectively permission to change cloud resources with the controller's identity. Google recommends having a controller apply manifests from a trusted repository. [[sources/research-provider]]

## Why it matters

Kubernetes RBAC on the custom resource becomes the cloud authorization boundary. A user with no cloud permissions of their own can still create a bucket, a database, or an IAM binding if the controller's identity is allowed to. The same shape holds for every [[concepts/provider]], since the controller acts on the user's behalf with its own credentials. [[sources/research-provider]]

## Mitigations the sources give

- Use one `ProviderConfig` per account in Crossplane so different objects use different credentials.
- Use ACK's `IAMRoleSelector` to map namespaces to IAM roles, see [[examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management]].
- Use Config Connector namespaced mode so namespaces bind to separate service accounts, see [[examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts]].
- Apply manifests only from a trusted repository through a GitOps controller such as [[entities/flux]].

The choice between one shared identity and many scoped ones is analyzed in [[decisions/scope-provider-credentials-per-namespace-or-cluster-wide]].
