---
title: "Disabling ACK cross-namespace references is not tenant isolation"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [ack, multi-tenancy, security, references, iam]
---

# Disabling ACK cross-namespace references is not tenant isolation

## Observation

The ACK concepts page says cross-namespace references are off by default and states plainly that disabling them is not a tenant isolation control. [[sources/research-provider]]

## Why it matters

A reference setting only decides whether one ACK object may point at another in a different namespace. It does not change which AWS identity the controller uses, so a tenant who can create ACK objects can still act with whatever role the controller or the namespace's role selector provides. Treating the reference setting as a security boundary would give a false sense of separation between teams. [[sources/research-provider]]

## What to do instead

Isolation has to come from the identity layer, meaning `IAMRoleSelector` mappings from namespaces to least-privilege IAM roles, plus Kubernetes RBAC on who can create ACK objects at all. See [[examples/ack-iam-role-selectors-map-namespaces-to-aws-roles-for-cross-account-management]] and [[findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions]]. The tool is [[entities/ack]].
