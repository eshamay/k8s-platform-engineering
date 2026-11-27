---
title: Stateful data services run on Postgres and Elastic operators
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [use-case, stateful, databases, operators]
---

# Stateful data services run on Postgres and Elastic operators

## Scenario

Stateful data services are the classic operator use case, because a database needs human operational knowledge that a Deployment cannot express: provisioning, high availability, version upgrades, backups, and schema migrations. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## How it works

The CNCF explainer names Postgres operators and the Elastic operator as well-known examples that automate provisioning, HA, upgrades, and backups. The Kubernetes operator page uses the hypothetical SampleDB scenario for the same reasons, with an operator that creates PVCs, StatefulSets, and Jobs and cleans up on delete. The CNCF white paper lists stateful applications, upgrades, backup and DR, auto-remediation, and day-2 operations as the core scenarios. URL: https://www.cncf.io/blog/2022/06/15/kubernetes-operators-what-are-they-some-examples/.

## Caveat

The dossier names these operators without reading their documentation, so object counts, failure behavior, and adopters are unknown. See [examples/database-operator-encodes-runbooks](database-operator-encodes-runbooks.md) for the SampleDB illustration, [examples/postgrescluster-custom-resource-reconciled-into-child-objects](postgrescluster-custom-resource-reconciled-into-child-objects.md) for a concrete resource shape, and [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[concepts/operator-pattern](../concepts/operator-pattern.md), [concepts/finalizers](../concepts/finalizers.md)
