---
title: "Config Connector issue 534 deleting a BigQueryDataset before its tables left both in failure, and the issue has been open since 2021"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: [Config Connector issue 534]
tags: [config-connector, deletion, ordering, bigquery, issue]
---

# Config Connector issue 534 deleting a BigQueryDataset before its tables left both in failure, and the issue has been open since 2021

## Scenario

Config Connector issue 534 was opened on 2021-08-19 and was still open when read on 2026-11-26. The reporter, whose association is contributor, says that deleting a `BigQueryDataset` before its `BigQueryTable` objects leaves both in failure: "The required deleting order is: delete BigQueryTable first and then delete BigQueryDataset." The issue gives two annotation workarounds. The dossier records no root-cause statement from a maintainer. URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/534 [[sources/research-gap-o4-config-connector-ack]]

## Evidence strength

This is an open reporter claim. It matches the mechanism in a Google design document, where a child whose parent was deleted first stays on `DependencyNotFound`, see [[findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown]]. It does not show how Argo CD or Flux order the deletes.

## Lesson

A per-resource provider controller leaves teardown order to the caller. See [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]] and [[findings/background-deletion-gives-no-teardown-ordering-between-dependents]].
