---
title: One unhealthy kro resource graph definition blocked updates to every other definition
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [kro, rgd, blast-radius, controller, pitfall]
---

# One unhealthy kro resource graph definition blocked updates to every other definition

## Observation

kro issue 886 (2025-12-05, reporter toweroy) says one misconfigured ResourceGraphDefinition blocked updates to all other RGDs until the bad one was deleted and the controller pod was restarted. The reporter's wording is that "all new changes to every `ResourceGraphDefinition` will be blocked". The issue was open when the dossier read it on 2026-11-26. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md) URL: https://github.com/kubernetes-sigs/kro/issues/886

## Why it matters

The issue describes a shared failure domain: platform teams that host many RGDs in one cluster may find that a single bad definition stops every other team's schema changes. It echoes the shared-queue concern in [findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues](kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues.md), although the issue describes an RGD-level block and not queue starvation.

## Evidence limits

This is one reporter's account. The dossier did not reproduce it, did not tie it to a fix, and the wiki does not know whether the v0.10.0 release changes the behavior. Issue 886 predates v0.10.0 by about eleven months.

## Related

[entities/kro](../entities/kro.md), [findings/a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback](a-kro-graph-revision-that-fails-compilation-stops-all-instances-with-no-fallback.md), [findings/blast-radius-and-privilege-centralization](blast-radius-and-privilege-centralization.md)
