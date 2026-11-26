---
title: "Single-cloud teams pick ACK per service or Azure Service Operator v2 with code-generated CRDs"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [use-case, ack, azure-service-operator, aws, azure]
---

# Single-cloud teams pick ACK per service or Azure Service Operator v2 with code-generated CRDs

## Scenario

A team runs on only one public cloud and wants that cloud's resources as Kubernetes objects without adopting a multi-cloud framework. [[sources/research-landscape]]

## How it works on AWS

AWS-only teams use ACK. It ships one controller image per AWS service, such as an S3 controller, published in ECR Public, so a cluster installs only the services it needs. ACK can adopt AWS resources that already exist, export field values to ConfigMaps or Secrets, and manage resources across accounts from one cluster (https://aws-controllers-k8s.github.io/community/docs/community/overview/). The trade-off is that each service has its own release cadence.

## How it works on Azure

Azure-only teams use Azure Service Operator v2. Its CRDs are code-generated from Azure Resource Manager schemas, so coverage tracks Azure quickly, with 150 or more resources reported. It uses owner references for garbage collection, reconciles asynchronously, and supports workload identity, multi-tenant deployment modes, and reduced-permission setups (https://azure.github.io/azure-service-operator/).

## Related

[[entities/ack]], [[entities/azure-service-operator]], [[examples/ack-ships-one-controller-per-aws-service]], [[examples/azure-service-operator-generates-crds-from-azure-resource-manager-schemas]], [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]]
