---
title: Reconciliation Loop
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: [Reconcile, Control loop]
tags: [controllers, reconciliation, controller-runtime]
---

# Reconciliation Loop

## Definition

The core `Reconcile(ctx, req)` function. It reads a resource's spec, inspects the external world, performs idempotent API calls to align the two, and updates status. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md)

The Kubernetes documentation describes the wider idea as a non-terminating control loop: "Controllers are control loops that watch cluster state and make changes where needed, moving current state closer to desired state." The cluster never has to reach a stable state, and controllers keep correcting failures indefinitely. The design favors many small controllers that each own one aspect. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md)

## Why it matters

Every controller in this wiki is a reconcile loop at heart. The loop's quality depends on [concepts/idempotency](idempotency.md) and on being [level-triggered](level-triggered-vs-edge-triggered.md). Requests arrive as namespace/name keys from the [workqueue](informers-reflectors-and-workqueues.md).

## Level-based contract

The Reconcile function receives only a namespaced name, never an event type, and must read all needed state before writing. Errors requeue with exponential backoff, and `RequeueAfter` schedules a timed revisit. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md) See [entities/controller-runtime](../entities/controller-runtime.md) and [findings/event-specific-logic-in-reconcilers](../findings/event-specific-logic-in-reconcilers.md).

The controller-runtime reference puts it this way: action "isn't driven off changes in individual Events, but instead is driven by actual cluster state read from the apiserver or a local cache." The consequence is that a reconciler can be run many times, in any order, after crashes, and still converge. An edge-triggered system that misses or reorders an event can end in a state the source never held. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md) See [examples/an-edge-triggered-scaler-ends-at-zero-replicas-where-a-level-triggered-one-converges](../examples/an-edge-triggered-scaler-ends-at-zero-replicas-where-a-level-triggered-one-converges.md).

## Mechanics

In controller-runtime and Kubebuilder, informers keep a local cache of watched objects and push keys into a rate-limited workqueue. Workers call `Reconcile(ctx, Request)`, which returns a `Result` and an error. A good reconciler rebuilds `status` from observed child objects instead of trusting stored status, writes status through the status subresource, sets controller owner references so garbage collection and child-triggered reconciles work, and uses field indexes to list children efficiently. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md) See [examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator](../examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator.md) and [examples/ingress-cert-manager-and-dns-controllers-react-to-one-object](../examples/ingress-cert-manager-and-dns-controllers-react-to-one-object.md).

## Retries and requeue semantics

The convergence dossier maps reconcile return values to behavior: an empty result and a nil error mean the object has converged, `RequeueAfter` means healthy but waiting, and an error means the attempt failed and triggers workqueue exponential backoff. Errors should not be used as timers. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md) See [findings/errors-used-as-timers-in-reconcilers](../findings/errors-used-as-timers-in-reconcilers.md).

The reconcile package adds `TerminalError`, which is logged and counted but not retried, and marks `Requeue` as deprecated. At controller-runtime v0.25.3, `Requeue: true` is a rate-limited requeue with per-item exponential backoff that keeps the failure history, and `RequeueAfter` forgets that history before waiting the exact duration. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md) [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history](../findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history.md), [decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler](../decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler.md) and [findings/the-requeue-true-result-is-deprecated-and-described-inconsistently](../findings/the-requeue-true-result-is-deprecated-and-described-inconsistently.md).

## How tools wrap the loop

Different stacks add timing and failure policy around the same primitive. Flux uses `spec.interval` for a periodic full reconcile and `retryInterval` for failures. Argo CD v3.x polls Git on a 120 second cadence with 60 seconds of jitter (v2.x used a flat 180 seconds) and refuses to retry a failed sync of the same commit unless retry is configured. Crossplane providers run an Observe, Create, Update, Delete loop against external APIs and expose `Synced` and `Ready` conditions. kro funnels all instance events through one shared rate-limited queue. [sources/research-reconciliation-loop](../sources/research-reconciliation-loop.md) See [examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing](../examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing.md), [examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured](../examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured.md), [comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro](../comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro.md), and [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md).

## Pitfalls

- A controller can trigger itself through status writes, spec mutation, noisy children, or aggressive requeue. See [findings/self-triggered-reconcile-loops-generate-their-own-events](../findings/self-triggered-reconcile-loops-generate-their-own-events.md).
- Cache reads can lag the controller's own writes. See [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md).
- A create that succeeds while the status write fails can leak an external resource. See [findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource](../findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource.md).
- A loop with prune permission deletes what it no longer sees in desired state. See [findings/a-level-based-loop-deletes-what-it-no-longer-sees-in-desired-state](../findings/a-level-based-loop-deletes-what-it-no-longer-sees-in-desired-state.md).
- Calling an external API on every reconcile wastes quota. See [findings/cost-of-constant-reconciliation](../findings/cost-of-constant-reconciliation.md).

## Open questions

The first dossier found no named-company postmortem of a runaway loop (a later dossier found issue-level incidents and still no named-company postmortem, see [findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop](../findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop.md)), could not read ACK or Config Connector behavior, and left the `Requeue: true` conflict unresolved, which the controller-runtime v0.25.3 source later settled. See [open-knowledge-gaps](../open-knowledge-gaps.md).

## Related

[concepts/spec-status-split](spec-status-split.md), [concepts/conditions](conditions.md), [concepts/operator-pattern](operator-pattern.md), [concepts/finalizers](finalizers.md)

## Update from the operator loop dossier

The 2026-11-26 dossier adds named, issue-level runaway loops, still with no named-company postmortem. The causes are an unconditional status write on every pass (Cluster API provider RKE2 at about 10 reconciles per second, Crossplane issue 7221), volatile text in a condition message (Longhorn at about 6 per second), and two applies of one object with different labels under an unfiltered `Owns` (kube-shard at about 13 per second). A retry with no backoff cost Longhorn about 25 times its normal controller memory. The rates are the reporters' own. See [findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop](../findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop.md), [findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm](../findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm.md), [findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version](../findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version.md), and [findings/a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage](../findings/a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).
