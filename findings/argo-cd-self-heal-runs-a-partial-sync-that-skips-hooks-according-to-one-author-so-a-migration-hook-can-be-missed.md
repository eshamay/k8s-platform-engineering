---
title: Argo CD self-heal runs a partial sync that skips hooks according to one author, so a migration hook can be missed
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, self-heal, hooks, migration, sync-window]
---

# Argo CD self-heal runs a partial sync that skips hooks according to one author, so a migration hook can be missed

## Observation

A CNCF blog post of 2026-11-20 says that when Argo CD self-heal fires, it can run a partial sync of only the out-of-sync resources, and that "healing drift never runs hooks". In the post's customer incident, two of five regional Applications therefore skipped a database migration hook that three others ran, and the regions ran mismatched code and schema for 36 to 44 minutes. [[sources/research-gap-g1-gitops-drift-incidents]] See [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]].

## Mechanism, as the author states it

A level-1 refresh "mistook" the last compared revision for the last synced one, so Argo CD believed the new commit had already been synced and treated the remaining difference as drift to heal. The author reached this by reading Argo CD source and reproducing it in a lab. The dossier did not confirm it in the source, the Argo CD version was not stated in the parts read, and the figures are secondhand from an unnamed customer. Treat the mechanism as the author's claim.

## Mitigations

The author offers two: make the migration a managed resource with a sync wave and a release-specific name, or turn self-heal off so the timer-driven full sync runs the hook. Turning it off costs drift correction, because "Anyone who edits a resource by hand now leaves it OutOfSync". See [[decisions/make-a-migration-a-managed-resource-or-turn-self-heal-off]].

## Why it matters

[[entities/argo-cd]] documents that hooks run on every sync. The incident suggests that self-heal does not always count as a sync for that purpose, so a migration written as a hook is not guaranteed to run. This is a correction to the unqualified wording on the entity page, which now carries a note.

## Related

[[concepts/self-healing-and-drift-detection]], [[findings/ordering-and-dependency-failures]], [[decisions/staged-adoption-of-automated-drift-correction]]
