---
title: ACK adoption semantics are inconsistent across kinds and adopted resources can fail to converge
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: []
tags: [ack, adoption, adopt-or-create, reconcile-loop, health-checks, kro]
---

# ACK adoption semantics are inconsistent across kinds and adopted resources can fail to converge

## Observation

Three ACK issues show that adoption behaves differently by resource kind and can leave an adopted resource unable to reach `Synced`. All are reporter accounts and none was shown to be fixed. [[sources/research-gap-g1-leaked-resources-adoption]]

## Inconsistent semantics

ACK issue 3103 (2026-10-22) compares Role and Policy in the same "name already exists" situation. Role gives a terminal error and Policy retries `EntityAlreadyExists` forever as recoverable, so "the same situation produces a terminal error for one kind and an endless retry for the other." `adopt-or-create` also does not adopt a Policy unless its ARN is passed in `adoption-fields`. Health tools see the difference: the issue notes Argo CD custom checks show Degraded for one and Progressing forever for the other. URL: https://github.com/aws-controllers-k8s/community/issues/3103

## Adoption that does not converge

ACK issue 3123 (2026-10-31) reports that an EKS Cluster adopted over an existing cluster loops on a no-op update, with CloudTrail showing "17 identical failed calls in 11 minutes" per the reporter. ACK issue 2728 (2025-12-24) reports that an RDS DBCluster created through kro with `adopt-or-create` reconcile-loops, because the controller rewrites a KMS alias to an ARN, so "certain fields (for example, kmsKeyID) trigger a continuous reconcile loop." URLs: https://github.com/aws-controllers-k8s/community/issues/3123 and https://github.com/aws-controllers-k8s/community/issues/2728

## Interpretation

Operators cannot assume that an annotation that works for one ACK kind behaves the same for another, and an adopted resource that never reaches `Synced` also hits the readiness gaps in [[findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed]]. The kro case links to the loop mechanics in [[findings/defaulting-and-drift-reconcile-loops]].

## Related

[[entities/ack]], [[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]], [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]]
