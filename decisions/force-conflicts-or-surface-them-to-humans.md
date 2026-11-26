---
title: Force conflicts or surface them to humans
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [decision, server-side-apply, conflict, gitops]
---

# Force conflicts or surface them to humans

## Status

Draft. This records a decision point described by the Kubernetes maintainers and visible in tool defaults, not a choice made by this wiki.

## Context

A writer applying with server-side apply receives a conflict when another manager owns a field it wants to set. It can force the write, drop the field, or share ownership by setting the same value. The right default depends on whether the writer is a controller or a CD system. [[sources/research-server-side-apply-and-field-ownership]]

## Options

The first option is to force. The Kubernetes documentation says "It is strongly recommended for controllers to always force conflicts on objects that they own and manage", because a controller usually cannot resolve a disagreement about fields it owns. The second option is to surface the conflict to a human. The maintainer blog argues that "CI/CD systems are literally controllers, but for the purpose of apply, they are more like users", so they should show conflicts and let people reject a hotfix by force-applying, accept it, or accept then reject. A third option is to decide per field, as Kluctl does. See [[comparisons/ssa-conflict-policy-across-tools]].

## Decision guidance

The dossier observes that Argo CD and Flux both force by default, then provide exemptions such as `ignoreDifferences`, Flux ignore rules, and `ssa` annotations. The sources do not settle the best default for platform teams that run GitOps and in-cluster controllers on the same objects. A reasonable reading is to force for fields the tool exclusively owns and to exempt fields that another controller rewrites on purpose, such as `replicas` under an autoscaler.

## Consequences

Forcing keeps the cluster matching Git but can start revert loops with controllers that own the same field. Surfacing conflicts protects hotfixes but makes automation stop and wait for a person. See [[findings/forcing-conflicts-hides-disagreements-between-writers]], [[examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict]], and [[findings/controllers-fighting-over-fields-cause-revert-loops]].
