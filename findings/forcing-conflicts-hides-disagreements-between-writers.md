---
title: Forcing conflicts hides disagreements between writers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [pitfall, server-side-apply, force, gitops]
---

# Forcing conflicts hides disagreements between writers

## Observation

`kubectl apply --server-side` offers only two outcomes on conflict, an error or `--force-conflicts`. Argo CD chooses force, and Flux force-applies its own intent. When the other writer is a controller that legitimately owns the field, such as an autoscaler setting `replicas`, forcing makes the GitOps tool and the controller overwrite each other. [[sources/research-server-side-apply-and-field-ownership]]

## Evidence

The Kubernetes maintainer blog argues that CD systems are "more like users" for apply and must surface conflicts to humans. Kluctl's author says kubectl's all-or-nothing choice is why Kluctl decides per field. Argo CD's `Replace=true` takes precedence over SSA, and `Force=true` is ignored under SSA, so some sync options do not behave as users expect. See [[examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict]] and [[examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics]].

## Interpretation

The dossier states that the sources do not settle the best default for platform teams that run GitOps and in-cluster controllers on the same objects. See [[decisions/force-conflicts-or-surface-them-to-humans]] and [[findings/controllers-fighting-over-fields-cause-revert-loops]].

## Related

[[comparisons/ssa-conflict-policy-across-tools]], [[findings/multiple-writers-on-one-object]], [[concepts/server-side-apply-and-field-ownership]]
