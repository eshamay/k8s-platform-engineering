---
title: "provider-upjet-aws maps S3 buckets to a bucket parameter and VPCs to provider-assigned IDs"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: []
tags: [crossplane, upjet, aws, external-name, s3, vpc]
---

# provider-upjet-aws maps S3 buckets to a bucket parameter and VPCs to provider-assigned IDs

## Scenario

A user applies two managed resources from the Crossplane AWS provider, a bucket and a VPC, and wants to know what ends up in `crossplane.io/external-name` for each. The answer comes from `config/externalname.go` in https://github.com/crossplane-contrib/provider-upjet-aws, read from main on 2026-11-26. The latest release at the time was v2.10.0, published 2026-11-20, and the file can be ahead of that tag. [[sources/research-gap-m7-operators-idempotency]]

## What the file says

The bucket line is `"aws_s3_bucket": config.ParameterAsIdentifier("bucket"),`, so the external name feeds the `bucket` argument and the object name acts as the bucket name, which matches the general Crossplane default. IAM roles and EKS clusters use `config.NameAsIdentifier`. The VPC line is `"aws_vpc": config.IdentifierFromProvider,`, and the same function is used for subnets, security groups, instances, database instances, and KMS keys. For these kinds the name initializer is disabled, and the annotation is filled with the provider-generated ID, such as `vpc-2213das`, after creation. [[sources/research-gap-m7-operators-idempotency]]

## Why it matters

The bucket can be recreated or found again by its chosen name, while the VPC identifier exists only once the cloud has answered. A restart between the answer and the annotation write is the window that the create-pending guard exists to cover. See [[examples/provider-restart-blocks-a-crossplane-resource-on-external-create-pending]] and [[examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days]].

## Related

[[findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids]], [[entities/upjet]], [[concepts/managed-resource]]
