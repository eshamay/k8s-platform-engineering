---
title: "Config Connector's webhook-manager runs ten fail-closed handlers with an autoscaler of 2 to 20 replicas"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [config-connector, webhooks, availability, hpa, verified]
---

# Config Connector's webhook-manager runs ten fail-closed handlers with an autoscaler of 2 to 20 replicas

## Scenario

Config Connector ships a separate webhook-manager Deployment whose HPA reads "maxReplicas: 20 minReplicas: 2". Its handlers in `pkg/webhook/register.go` all use `FailurePolicy: admissionregistration.Fail`. https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/config/installbundle/components/webhook/autoscaler.yaml [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Reliability

VERIFIED from files on master in the v1.162.0 era.

## Related

[findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail](../findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail.md) and [entities/config-connector](../entities/config-connector.md).
