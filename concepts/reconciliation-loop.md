---
title: Reconciliation Loop
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
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
aliases: [Reconcile, Control loop]
tags: [controllers, reconciliation, controller-runtime]
---

# Reconciliation Loop

## Definition

The core `Reconcile(ctx, req)` function. It reads a resource's spec, inspects the external world, performs idempotent API calls to align the two, and updates status. [[sources/krm-platform-vocabulary]]

The Kubernetes documentation describes the wider idea as a non-terminating control loop: "Controllers are control loops that watch cluster state and make changes where needed, moving current state closer to desired state." The cluster never has to reach a stable state, and controllers keep correcting failures indefinitely. The design favors many small controllers that each own one aspect. [[sources/research-reconciliation-loop]]

## Why it matters

Every controller in this wiki is a reconcile loop at heart. The loop's quality depends on [[concepts/idempotency]] and on being [[concepts/level-triggered-vs-edge-triggered|level-triggered]]. Requests arrive as namespace/name keys from the [[concepts/informers-reflectors-and-workqueues|workqueue]].

## Level-based contract

The Reconcile function receives only a namespaced name, never an event type, and must read all needed state before writing. Errors requeue with exponential backoff, and `RequeueAfter` schedules a timed revisit. [[sources/research-level-triggered-vs-edge-triggered]] See [[entities/controller-runtime]] and [[findings/event-specific-logic-in-reconcilers]].

The controller-runtime reference puts it this way: action "isn't driven off changes in individual Events, but instead is driven by actual cluster state read from the apiserver or a local cache." The consequence is that a reconciler can be run many times, in any order, after crashes, and still converge. An edge-triggered system that misses or reorders an event can end in a state the source never held. [[sources/research-reconciliation-loop]] See [[examples/an-edge-triggered-scaler-ends-at-zero-replicas-where-a-level-triggered-one-converges]].

## Mechanics

In controller-runtime and Kubebuilder, informers keep a local cache of watched objects and push keys into a rate-limited workqueue. Workers call `Reconcile(ctx, Request)`, which returns a `Result` and an error. A good reconciler rebuilds `status` from observed child objects instead of trusting stored status, writes status through the status subresource, sets controller owner references so garbage collection and child-triggered reconciles work, and uses field indexes to list children efficiently. [[sources/research-reconciliation-loop]] See [[examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator]] and [[examples/ingress-cert-manager-and-dns-controllers-react-to-one-object]].

## Retries and requeue semantics

The convergence dossier maps reconcile return values to behavior: an empty result and a nil error mean the object has converged, `RequeueAfter` means healthy but waiting, and an error means the attempt failed and triggers workqueue exponential backoff. Errors should not be used as timers. [[sources/research-eventual-consistency-and-convergence]] See [[findings/errors-used-as-timers-in-reconcilers]].

The reconcile package adds `TerminalError`, which is logged and counted but not retried, and marks `Requeue` as deprecated. Sources disagree on whether `Requeue: true` backs off. [[sources/research-reconciliation-loop]] See [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]] and [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]].

## How tools wrap the loop

Different stacks add timing and failure policy around the same primitive. Flux uses `spec.interval` for a periodic full reconcile and `retryInterval` for failures. Argo CD polls Git on a 120 second cadence with 60 seconds of jitter and refuses to retry a failed sync of the same commit unless retry is configured. Crossplane providers run an Observe, Create, Update, Delete loop against external APIs and expose `Synced` and `Ready` conditions. kro funnels all instance events through one shared rate-limited queue. [[sources/research-reconciliation-loop]] See [[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]], [[examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured]], [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]], and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## Pitfalls

- A controller can trigger itself through status writes, spec mutation, noisy children, or aggressive requeue. See [[findings/self-triggered-reconcile-loops-generate-their-own-events]].
- Cache reads can lag the controller's own writes. See [[findings/stale-cache-and-double-action]].
- A create that succeeds while the status write fails can leak an external resource. See [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]].
- A loop with prune permission deletes what it no longer sees in desired state. See [[findings/a-level-based-loop-deletes-what-it-no-longer-sees-in-desired-state]].
- Calling an external API on every reconcile wastes quota. See [[findings/cost-of-constant-reconciliation]].

## Open questions

The dossier found no named-company postmortem of a runaway loop, could not read ACK or Config Connector behavior, and left the `Requeue: true` conflict unresolved. See [[open-knowledge-gaps]].

## Related

[[concepts/spec-status-split]], [[concepts/conditions]], [[concepts/operator-pattern]], [[concepts/finalizers]]
