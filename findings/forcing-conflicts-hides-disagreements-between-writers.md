---
title: Forcing conflicts hides disagreements between writers
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [pitfall, server-side-apply, force, gitops]
---

# Forcing conflicts hides disagreements between writers

## Observation

`kubectl apply --server-side` offers only two outcomes on conflict, an error or `--force-conflicts`. Argo CD chooses force, and Flux force-applies its own intent. When the other writer is a controller that legitimately owns the field, such as an autoscaler setting `replicas`, forcing makes the GitOps tool and the controller overwrite each other. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## Evidence

The Kubernetes maintainer blog argues that CD systems are "more like users" for apply and must surface conflicts to humans. Kluctl's author says kubectl's all-or-nothing choice is why Kluctl decides per field. Argo CD's `Replace=true` takes precedence over SSA, and `Force=true` is ignored under SSA, so some sync options do not behave as users expect. See [examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict](../examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict.md) and [examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics](../examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics.md).

## Interpretation

The dossier states that the sources do not settle the best default for platform teams that run GitOps and in-cluster controllers on the same objects. See [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md) and [findings/controllers-fighting-over-fields-cause-revert-loops](controllers-fighting-over-fields-cause-revert-loops.md).

## Related

[comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md), [findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)

## Update from the m4 dossier

Update 2026-11-26: the evidence is now grouped by position without a recommendation in [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md). Forcing is not a complete answer either: Kubernetes issue 130292 shows a forced apply failing to revert a Service port edit ([examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port](../examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port.md)), and a practitioner blog says that under Argo CD "the conflict mechanism protects nobody" (SECONDARY-ONLY). [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)
