---
title: "Config Connector and Cluster API register many webhooks and every one uses failure policy Fail"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [config-connector, cluster-api, webhooks, failure-policy, verified]
---

# Config Connector and Cluster API register many webhooks and every one uses failure policy Fail

## Observation

Config Connector (v1.162.0 era) ships a separate webhook-manager Deployment and registers handlers in `pkg/webhook/register.go`, each with `FailurePolicy: admissionregistration.Fail`. The ten named handlers cover immutable-field denial, unknown-field denial, IAM validation, IAM defaulting, container-annotation handling, management-conflict annotation defaulting, a generic defaulter, resource validation, state-into-spec validation and abandon-on-uninstall. The generated configuration sets rules and an objectSelector but no namespaceSelector, and leaves the timeout at the Kubernetes default ("10s is the default in Kubernetes."). https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/webhook/register.go and https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/pkg/webhook/manifests.go [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

Cluster API core (latest release v1.14.4; manifests on main) ships mutating (defaulting) and validating webhooks for Cluster, ClusterClass, ClusterResourceSet, ExtensionConfig, Machine, MachineDeployment, MachineHealthCheck, MachinePool, MachineSet, IPAddress and more, every one `failurePolicy: Fail`, plus CRD conversion webhooks (`strategy: Webhook`, path `/convert`). A count of 21 Fail entries with zero Ignore was reproduced in verification. https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/main/core/config/webhook/manifests.yaml

## Limits of the evidence

Namespace exclusions in the Cluster API and Config Connector webhook manifests were not seen in the files read, but the search was not exhaustive, so their absence is not established.

## Related

[findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation](cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation.md), [examples/config-connector-webhook-manager-runs-ten-fail-closed-handlers-with-an-autoscaler-of-2-to-20-replicas](../examples/config-connector-webhook-manager-runs-ten-fail-closed-handlers-with-an-autoscaler-of-2-to-20-replicas.md), [entities/config-connector](../entities/config-connector.md), and [entities/cluster-api](../entities/cluster-api.md).
