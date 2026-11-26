---
title: Crossplane Usages order deletion and guard against accidental removal
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [crossplane, usage, deletion-ordering, protection]
---

# Crossplane Usages order deletion and guard against accidental removal

## Scenario

A database subnet must not be deleted before the database that sits in it, and a production database must not disappear because someone ran a careless delete. Deleting a [[concepts/managed-resource]] normally deletes the real cloud resource right away, so the platform needs a second guardrail beyond `managementPolicies`. [[sources/research-managed-resource]]

## How it works

A Usage object marks one resource as in use, optionally by another resource. The Crossplane documentation lists its fields as `of`, `by`, `reason`, and `replayDeletion`. While the Usage exists, deletion of the used resource is blocked until its users are gone. The documented purpose is "Deletion ordering by ensuring that a resource isn't deleted before the deletion of its dependent resources," and the `reason` field lets an operator protect a resource from accidental deletion without naming a user. URL: https://docs.crossplane.io/latest/managed-resources/usages/.

## Lesson

Usages add ordering and protection at the delete verb, while `managementPolicies` decide whether the delete verb is allowed at all. The two controls cover different mistakes, so the sources present them as complementary. For ordering through owner references and deletion policies see [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]], and for the wider catalog of deletion controls see [[comparisons/deletion-policies-across-gitops-and-provider-tools]] and [[findings/destructive-deletion-of-external-resources]].
