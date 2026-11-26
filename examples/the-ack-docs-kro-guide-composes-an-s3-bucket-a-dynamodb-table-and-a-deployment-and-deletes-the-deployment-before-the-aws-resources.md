---
title: The ACK docs kro guide composes an S3 bucket, a DynamoDB table, and a Deployment, and deletes the Deployment before the AWS resources
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [kro, ack, composition, readiness, deletion, aws]
---

# The ACK docs kro guide composes an S3 bucket, a DynamoDB table, and a Deployment, and deletes the Deployment before the AWS resources

## Scenario

The ACK documentation includes a "Using ACK with kro" guide whose ResourceGraphDefinition composes an ACK S3 Bucket, an ACK DynamoDB Table, and a Deployment, with outputs read from `status.ackResourceMetadata.arn`. URL: https://aws-controllers-k8s.github.io/docs/guides/kro/ (documentation copyright 2026, read against kro v0.10.0). [[sources/research-gap-o3-gitops-provider-managed]]

## What the guide states

Quote: "kro waits for ACK resources to become ready before creating dependent resources". Quote: "If an ACK resource fails, dependent resources won't be created". On deleting an instance, kro removes the Deployment first and then the AWS resources, following ACK's deletion policy. This is the first-party description of the interplay, in contrast with the AWS EKS guide in [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]].

## Not documented

The guide does not say how kro's own alpha `kro.run/deletion-policy` annotation (Delete or Orphaned, behind a feature gate, with owner references overriding Orphaned) combines with ACK's `services.k8s.aws/deletion-policy`. The pages imply the two are independent, because a kro orphaning leaves the custom resource in place, but that inference was not tested. The guide was read, not run.

## Related

[[entities/kro]], [[entities/ack]], [[findings/crossplane-function-auto-ready-and-kro-readywhen-gate-on-the-provider-ready-condition-and-no-worked-example-of-crossplane-composing-ack-or-config-connector-was-found]], [[findings/ack-referencing-resources-wait-on-backoff-after-the-referenced-resource-syncs-according-to-issue-3131]], [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]]
