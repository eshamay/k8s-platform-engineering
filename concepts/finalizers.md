---
title: Finalizers
type: concept
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
aliases: [metadata.finalizers]
tags: [controllers]
---

# Finalizers

## Definition

String tokens in `metadata.finalizers` that stop Kubernetes from deleting an object from etcd until the controller has deleted the matching external resource, for example tearing down an AWS RDS instance before removing its KRM representation. [[sources/krm-platform-vocabulary]]

## Why it matters

Finalizers make deletion safe for external resources, and they cause the most familiar operational pain: objects stuck in `Terminating` when a controller is gone or failing. This is a leading pitfall for [[concepts/managed-resource]] cleanup.

## Related

[[concepts/owner-references-and-garbage-collection]], [[concepts/reconciliation-loop]], [[concepts/provider]]

## To research

Safe procedures for removing stuck finalizers, deletion policies, and orphaning options.
