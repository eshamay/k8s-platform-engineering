---
title: Self-triggered reconcile loops generate their own events
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Reconcile loop explosion, Hot loop]
tags: [reconciliation, hot-loop, predicates, requeue]
---

# Self-triggered reconcile loops generate their own events

## Observation

A controller can create the events that wake it. The GoLinuxCloud article lists the causes: status writes that retrigger reconciles, accidental mutation of the spec, noisy child resources watched through `Owns()`, an aggressive `RequeueAfter`, and logic that depends on individual events. The result is a hot loop that burns controller CPU and API server capacity while changing nothing of substance. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Mitigations

The article and the Red Hat best-practices post agree on a set of fixes. Use `GenerationChangedPredicate` so status-only changes do not requeue. Write status through the status subresource and use `Patch` instead of a full `Update`. Watch a higher-level aggregate in place of many noisy children. Add jitter to requeue delays. Keep `Reconcile` idempotent and level-triggered. The GoLinuxCloud article is a secondary source, so check its claims against the controller-runtime documentation. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Why it matters

The finding is the operational face of the level-based design: because a reconcile reads state and writes state, any write that is visible to its own watch can feed itself. No named-company postmortem appeared in the original dossier, so the original evidence was guidance and not incident reports. Correction on 2026-11-26: issue-level incident reports now exist, see the section at the end of this page. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Related

[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops](status-writes-through-the-main-resource-retrigger-reconcile-loops.md), [findings/defaulting-and-drift-reconcile-loops](defaulting-and-drift-reconcile-loops.md), [findings/controllers-fighting-over-fields-cause-revert-loops](controllers-fighting-over-fields-cause-revert-loops.md), [concepts/reconciliation-loop](../concepts/reconciliation-loop.md), [concepts/spec-status-split](../concepts/spec-status-split.md)

## Incident evidence from the operator loop dossier

The 2026-11-26 dossier adds named, issue-level cases for this finding, still with no named-company postmortem. Cluster API provider RKE2 reached about 10 reconciles per second from an unconditional status patch ([examples/cluster-api-provider-rke2-issue-905-an-unconditional-status-patch-held-the-controller-at-about-ten-reconciles-per-second](../examples/cluster-api-provider-rke2-issue-905-an-unconditional-status-patch-held-the-controller-at-about-ten-reconciles-per-second.md)), Longhorn's BackupTargetController reached about 6 per second because volatile text in a condition message defeated its equality check ([examples/longhorn-issue-13831-volatile-text-in-a-condition-message-drove-about-six-reconciles-per-second](../examples/longhorn-issue-13831-volatile-text-in-a-condition-message-drove-about-six-reconciles-per-second.md)), kube-shard reached about 13 per second from two server-side applies of one ConfigMap ([examples/konflux-kube-shard-issue-121-two-server-side-applies-of-one-configmap-looped-at-about-13-reconciles-per-second](../examples/konflux-kube-shard-issue-121-two-server-side-applies-of-one-configmap-looped-at-about-13-reconciles-per-second.md)), and Crossplane issue 7221 reported an unconditional `Status().Update()` ([examples/crossplane-issue-7221-an-unconditional-status-update-kept-reconcile-ordering-tests-from-converging](../examples/crossplane-issue-7221-an-unconditional-status-update-kept-reconcile-ordering-tests-from-converging.md)). The rates are the reporters' own. The mechanisms are collected in [findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop](a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop.md), [findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm](volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm.md), and [findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version](applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).
