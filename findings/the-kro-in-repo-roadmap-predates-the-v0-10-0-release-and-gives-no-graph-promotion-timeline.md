---
title: The kro in-repo roadmap predates the v0.10.0 release and gives no Graph promotion timeline
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: []
tags: [kro, graph-api, roadmap, governance, maturity]
---

# The kro in-repo roadmap predates the v0.10.0 release and gives no Graph promotion timeline

## Observation

The roadmap file `docs/v1-roadmap.md` in the kro repository is marked "Last Updated 2026-04-03" and says "v0.10 - ETA Mid-May 2026". The v0.10.0 release was published on 2026-11-10, about six months later. The file does not list the Graph API or KREP-024 as a feature entry, although it mentions Graph Revisions (KREP-013) and a Graph-node variables item. Its open items include decorators, multi-cluster (KREP-012), lifecycles, propagation control, and versioning, and it says "It is not intended to be a timeline for planning purposes." [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/docs/v1-roadmap.md

The design text for KREP-024 says the Graph API is additive and that "it does not replace or deprecate the RGD Kind", while the RGD controller now runs on the graph engine and issues `GraphRevision` objects. It lists features such as KREP-006 `propagateWhen` and lifecycle signals as "Planned / Not yet implemented". No page read gives a promotion timeline from alpha, and none says whether RGD will eventually be expressed as a Graph at the API surface. Live roadmap pages and GitHub issue threads were not read.

## Why it matters

A platform team deciding between RGDs and Graphs cannot plan from the roadmap, because it lags the release it was meant to describe and carries no dates. The defensible position from first-party text is narrow. Graph alpha has no compatibility guarantee, RGD is the stable-looking surface, and both ride one engine, so engine changes reach RGD users as well.

## Mitigations

Treat the roadmap as a list of open design topics, and track the release notes and the KREP documents for actual changes. Build platform APIs on RGDs, and use Graph only for experiments until a promotion statement exists. Governance context is in [entities/kro](../entities/kro.md), and the adjacent pitfall is [findings/enabling-the-kro-graph-api-needs-a-manual-crd-apply-because-helm-does-not-update-crds-on-upgrade](enabling-the-kro-graph-api-needs-a-manual-crd-apply-because-helm-does-not-update-crds-on-upgrade.md).

## Update from the o5 dossier

Update 2026-11-26: the live kro.run roadmap page, scraped today, still lists v0.10.0 as "Next" with 8 KREPs and shows v0.11.0, v0.12.0, and v1.0.0 lanes with 0 KREPs, so it also lags the release and gives no Graph timeline. KREP-026 propagation control (issue 1510) was opened 2026-11-13 and is open. See [decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api](../decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api.md). [sources/research-gap-o5-kro-ecosystem](../sources/research-gap-o5-kro-ecosystem.md)
