---
title: "Radius and Score are both CNCF Sandbox projects per the landscape file, and both passed sandbox votes"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: [Radius and Score CNCF status]
tags: [radius, score, cncf, sandbox, verification]
---

# Radius and Score are both CNCF Sandbox projects per the landscape file, and both passed sandbox votes

## Observation

The CNCF landscape source file (https://raw.githubusercontent.com/cncf/landscape/master/landscape.yml, read 2026-11-26) lists Radius as `project: sandbox` with `accepted: '2024-04-16'` and Score as `project: sandbox` with `accepted: '2024-07-08'`. The matching `cncf/sandbox` issues are closed with `gitvote/passed` labels: issue 65 for Radius (closed 2024-06-18) and issue 79 for Score (closed 2024-07-08), both under the App Delivery label. This settles maturity from primary listings and not from the projects' own sites or a third-party blog. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## What it does and does not settle

Sandbox is the entry tier of the CNCF, so the finding confirms a project's presence in the foundation and says nothing about production readiness. Radius's changelog still lists breaking changes, see [examples/radius-v0-62-0-was-released-on-2026-10-27-with-breaking-changes-and-one-supported-channel](../examples/radius-v0-62-0-was-released-on-2026-10-27-with-breaking-changes-and-one-supported-channel.md). The Radius and Score documentation sites were not read, so what each tool does rests on its repository README and spec. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## Related

[entities/radius](../entities/radius.md), [entities/score](../entities/score.md), [findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog](radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog.md), [comparisons/score-versus-radius-as-developer-facing-workload-abstractions](../comparisons/score-versus-radius-as-developer-facing-workload-abstractions.md)
