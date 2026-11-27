---
title: ACK ships one controller per AWS service
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, ack, aws, external-systems]
---

# ACK ships one controller per AWS service

## Scenario

AWS exposes hundreds of resource types through service-specific APIs. AWS Controllers for Kubernetes lets teams manage them as Kubernetes objects without running supporting services inside the cluster. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## How it works

ACK ships one controller image per AWS service, and each reconciles custom resources into calls to that service's API. It supports adopting pre-existing AWS resources and exporting fields to ConfigMaps or Secrets. The project describes its purpose as letting users "define and use AWS service resources directly from Kubernetes without needing to run supporting services within the cluster." URL: https://aws-controllers-k8s.github.io/community/docs/community/overview/.

## Related

[entities/ack](../entities/ack.md), [comparisons/how-flux-ack-and-cluster-api-split-controllers](../comparisons/how-flux-ack-and-cluster-api-split-controllers.md), [examples/ack-resync-period-tuning-for-stateful-resources](ack-resync-period-tuning-for-stateful-resources.md), [examples/cloud-services-as-kubernetes-objects](cloud-services-as-kubernetes-objects.md)
