---
title: ACK adopt-or-create brings existing AWS resources under management
type: example
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [ack, aws, adoption, idempotency]
---

# ACK adopt-or-create brings existing AWS resources under management

## Scenario

A team has AWS resources that already exist, such as a VPC, an SQS queue, an SNS topic, an S3 bucket, or a DynamoDB table, and wants Kubernetes objects to manage them. The ACK resource adoption guide describes two annotation-driven policies. [sources/research-idempotency](../sources/research-idempotency.md)

## How it works

The `services.k8s.aws/adoption-policy` annotation selects the policy. With `adopt-or-create`, the controller adopts the resource if it exists in AWS and creates it if it does not, and the manifest becomes the source of truth. This makes a retried create converge on the existing object, which is the declarative and retry-friendly option. With `adopt`, the controller imports strictly, does not change the resource, and fills the custom resource's spec from AWS. The `adoption-fields` annotation tells the controller how to find the resource, for example by VPC ID, queue URL, SNS ARN, bucket name, or table name. After adoption the annotations are no longer needed. [sources/research-idempotency](../sources/research-idempotency.md)

## Cautions

Deleting the Kubernetes object deletes the AWS resource unless `deletionPolicy: Retain` is set, and the guide labels adoption a Beta feature. In the 2020 announcement the ACK team had asked the community whether ACK should adopt existing resources and how destructive operations should behave, and these features are the later answer. [sources/research-idempotency](../sources/research-idempotency.md) See [findings/adopt-or-create-can-take-over-a-look-alike-resource](../findings/adopt-or-create-can-take-over-a-look-alike-resource.md), [findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md), and [decisions/adopt-or-create-or-require-explicit-import](../decisions/adopt-or-create-or-require-explicit-import.md).

## Related

[entities/ack](../entities/ack.md), [examples/config-connector-acquires-an-existing-google-cloud-resource-by-name](config-connector-acquires-an-existing-google-cloud-resource-by-name.md), [concepts/idempotency](../concepts/idempotency.md)

## Update from the leaked-resources dossier

The "makes a retried create converge on the existing object" description above holds only when the identifier was recorded. The dossier reproduced that `adopt-or-create` adopts a found resource without checking whether another custom resource manages it ([examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it](ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it.md), against moto), behaves differently for Role and Policy, and can leave an adopted EKS Cluster or RDS DBCluster unable to reach `Synced`. See [findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](../findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md) and [findings/ack-adoption-semantics-are-inconsistent-across-kinds-and-adopted-resources-can-fail-to-converge](../findings/ack-adoption-semantics-are-inconsistent-across-kinds-and-adopted-resources-can-fail-to-converge.md). [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md)
