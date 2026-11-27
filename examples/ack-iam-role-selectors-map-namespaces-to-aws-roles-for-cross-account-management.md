---
title: "ACK IAM role selectors map namespaces to AWS roles for cross-account management"
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [ack, aws, iam, multi-tenancy, cross-account]
---

# ACK IAM role selectors map namespaces to AWS roles for cross-account management

## Scenario

A platform team on Amazon EKS wants application teams to manage their own S3 buckets and databases, each in a separate AWS account, from one cluster. The controller must not use one broad role for everyone. [sources/research-provider](../sources/research-provider.md)

## How it works

ACK lets a region be set per resource or per namespace. An `IAMRoleSelector` maps namespaces to IAM roles, so a resource created in a team's namespace is reconciled with that team's role, and the `ACK.IAMRoleSelected` condition reports whether a role was chosen. Cross-namespace references are off by default, and the ACK page states plainly that turning them off is not a tenant isolation control. [sources/research-provider](../sources/research-provider.md)

## Lesson

Role selection is the control that limits what a namespace can do in AWS, while reference settings only govern linking between objects, see [findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation](../findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation.md). The comparable Google Cloud mechanism is in [examples/config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts](config-connector-namespaced-mode-maps-namespaces-to-projects-and-service-accounts.md), and the trade-off is framed in [decisions/scope-provider-credentials-per-namespace-or-cluster-wide](../decisions/scope-provider-credentials-per-namespace-or-cluster-wide.md). See [entities/ack](../entities/ack.md).
