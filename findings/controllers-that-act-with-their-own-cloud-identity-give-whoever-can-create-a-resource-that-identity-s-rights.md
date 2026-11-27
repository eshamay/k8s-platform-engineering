---
title: "Controllers that act with their own cloud identity give whoever can create a resource that identity's rights"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [pitfall, identity, blast-radius, config-connector, aso, rbac]
---

# Controllers that act with their own cloud identity give whoever can create a resource that identity's rights

## Observation

Config Connector acts against Google Cloud with its own IAM service account and not the user's identity. That centralizes authorization and decouples developer permissions from cloud resource rights, but it also means whoever can create a custom resource effectively gets that service account's rights (https://docs.cloud.google.com/config-connector/docs/overview). [sources/research-landscape](../sources/research-landscape.md)

## How tools narrow the blast radius

Config Connector offers namespaced mode, and Azure Service Operator v2 offers multi-tenant and reduced-permission modes, workload identity among them (https://azure.github.io/azure-service-operator/). On the delivery side, Argo CD uses AppProjects and Flux uses Kubernetes RBAC with a lockdown mode, per the Akuity comparison, which is a vendor source. The dossier did not confirm how Config Connector's namespaced and cluster modes behave in detail. The wiki's existing page [examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts](../examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts.md) has more from another dossier, and ACK's equivalent is [examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management](../examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management.md).

## Related

[entities/config-connector](../entities/config-connector.md), [entities/azure-service-operator](../entities/azure-service-operator.md), [concepts/tooling-landscape](../concepts/tooling-landscape.md)
