---
title: Operator privileges and removal behavior set the blast radius
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, security, rbac, operators]
---

# Operator privileges and removal behavior set the blast radius

## Observation

An operator runs continuously with credentials that can change workloads, so a compromised or buggy operator can damage everything it manages. The CNCF operator white paper recommends documenting the operator's scope and RBAC, applying least privilege, and verifying provenance. It also recommends designing the operator so that removing it does not disrupt the applications it manages. [sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Interpretation

ACK follows the least-privilege idea by shipping one controller per AWS service, so each controller can receive only that service's permissions. See [comparisons/how-flux-ack-and-cluster-api-split-controllers](../comparisons/how-flux-ack-and-cluster-api-split-controllers.md). URL: https://github.com/cncf/tag-app-delivery/blob/main/operator-wg/whitepaper/Operator-WhitePaper_v1-0.md.

## Related

[findings/blast-radius-and-privilege-centralization](blast-radius-and-privilege-centralization.md), [findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing](finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing.md), [concepts/operator-pattern](../concepts/operator-pattern.md)
