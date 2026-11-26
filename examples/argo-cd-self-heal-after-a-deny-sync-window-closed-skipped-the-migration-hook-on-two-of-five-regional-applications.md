---
title: Argo CD self-heal after a deny sync window closed skipped the migration hook on two of five regional Applications
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Argo CD self-heal skipped hook incident]
tags: [argo-cd, self-heal, sync-window, hooks, migration, incident, gitops]
---

# Argo CD self-heal after a deny sync window closed skipped the migration hook on two of five regional Applications

## Scenario

A CNCF Ambassador published a post on 2026-11-20 that retells a customer incident. The customer is unnamed and the figures are secondhand. A release was pushed during a deny sync window, and five regional Argo CD Applications, each with automated sync, prune, and self-heal, were waiting to roll out the same commit. [[sources/research-gap-g1-gitops-drift-incidents]] URL: https://www.cncf.io/blog/2026/11/20/when-a-sync-window-closes-how-argo-cd-self-heal-skipped-the-migration-hook/

## What happened

When the window closed, all five Applications rolled out the commit. Three ran the database migration hook and two did not, which left the two regions running new code against an old schema for 36 to 44 minutes. The author's explanation, from reading Argo CD source and reproducing it in a lab, is that a level-1 refresh mistook the last compared revision for the last synced one, so self-heal ran a partial sync of the out-of-sync resources, and a partial sync skips hooks. In the post's words, "healing drift never runs hooks". The source-code reading is the author's, and the Argo CD version was not stated in the parts the dossier read.

## Mitigations offered

The post offers two. The first is to make the migration a managed resource with a sync wave and a release-specific name, so that it is part of the desired state and not a hook. The second is to turn self-heal off for those Applications, which lets the timer-driven full sync run the hook but means "Anyone who edits a resource by hand now leaves it OutOfSync". See [[decisions/make-a-migration-a-managed-resource-or-turn-self-heal-off]].

## Why it belongs here

This is the strongest dated example of drift correction, a feature meant to be safe and automatic, causing a production incident, although the customer is anonymous. The mechanism is analyzed in [[findings/argo-cd-self-heal-runs-a-partial-sync-that-skips-hooks-according-to-one-author-so-a-migration-hook-can-be-missed]].

## Related

[[entities/argo-cd]], [[concepts/self-healing-and-drift-detection]], [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]], [[decisions/staged-adoption-of-automated-drift-correction]]
