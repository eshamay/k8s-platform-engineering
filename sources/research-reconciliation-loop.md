---
title: "Research dossier: Reconciliation Loop"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
aliases: []
tags: [reconciliation, controllers, controller-runtime, requeue, research-dossier]
---

# Research dossier: Reconciliation Loop

> [!NOTE]
> **Raw file:** `raw/research-reconciliation-loop.md` (sha256 prefix df7d66206baf)<br>
> **Kind:** Research dossier summarizing 15 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The dossier was built from tool summaries of fetched pages, not a line-by-line read, and several scrapes exceeded the tool size limit. The Flux page was read only for its first 100,000 of about 121,600 characters, and the kro figures come from the `next` documentation path. The dossier found no named-company postmortem and could not read ACK or Config Connector material.

## Summary

The dossier defines the reconciliation loop as the core mechanism of every Kubernetes controller. A controller watches objects, compares desired state (usually `spec`) with observed state, acts to move the observed state toward the desired state, and reports what it saw in `status`. The official documentation frames this as a non-terminating control loop that never needs to reach a stable end state, and it recommends many small controllers that each own one aspect.

The central design property is that reconciliation is level-based and not edge-triggered. A reconcile request carries only a namespace and a name, so the reconciler must read current state and recompute what to do. That makes self-correction after missed or reordered events possible, and it obliges reconcile logic to be idempotent. In controller-runtime and Kubebuilder, informers fill a local cache and push keys into a rate-limited workqueue, and a worker calls `Reconcile` which returns a result and an error. The return value selects one of three behaviors: error with exponential backoff, `RequeueAfter` with a fixed delay, or nothing set, which means done until the next event or resync.

Flux, Argo CD, Crossplane, and kro wrap the same primitive with different timing and failure policy. The dossier's pitfall coverage is the richest part: self-triggered loops, confusing return values, stale cache reads, expensive external calls, retry policy, load and fairness, unsafe deletes, and event-driven design. It flags one unresolved factual conflict about `Result{Requeue: true}`.

## Key claims

Claims are grouped by the page they came from. Each URL below is a page the dossier read, and none is rich enough here to justify a separate source page.

### Controller concept and level-based design

- The Kubernetes Controllers page (https://kubernetes.io/docs/concepts/architecture/controller/) says "Controllers are control loops that watch cluster state and make changes where needed, moving current state closer to desired state."
- The same page separates controllers that act through the API server, such as the Job controller creating Pods, from controllers that act on external systems, such as node autoscalers. See [examples/job-controller-acts-through-the-api-server-while-the-cluster-autoscaler-acts-directly](../examples/job-controller-acts-through-the-api-server-while-the-cluster-autoscaler-acts-directly.md).
- The same page states the design philosophy of many simple controllers that each own one aspect and identify their objects by labels, and says built-in controllers run in kube-controller-manager while custom ones can run as Pods or outside the cluster.
- The controller-runtime reconcile package reference (https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/reconcile) says "action isn't driven off changes in individual Events, but instead is driven by actual cluster state read from the apiserver or a local cache." A `Request` holds only name and namespace.
- The same reference documents `Result` with `Requeue` (deprecated), `RequeueAfter`, and an optional `Priority` for priority queues, and it documents `TerminalError`, which is logged and counted in metrics but not retried. See [findings/the-requeue-true-result-is-deprecated-and-described-inconsistently](../findings/the-requeue-true-result-is-deprecated-and-described-inconsistently.md) and [decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler](../decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler.md).
- The Level Triggering article (https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d, jbowes, January 2018) uses a scaling example from 1 to 5 to 2 replicas to show an edge-triggered system terminating more replicas than exist and ending at zero. See [examples/an-edge-triggered-scaler-ends-at-zero-replicas-where-a-level-triggered-one-converges](../examples/an-edge-triggered-scaler-ends-at-zero-replicas-where-a-level-triggered-one-converges.md).
- The same article concedes that edge triggering has efficiency benefits and can be made safe with periodic full resync or event versioning, and it quotes Joe Beda: "If you are level triggered the pattern is very forgiving."
- The Red Hat best-practices post (https://www.redhat.com/en/blog/kubernetes-operators-best-practices) says "Level-based triggering forces re-evaluation of entire state, more suitable in complex, unreliable environments where signals can be lost."

### Mechanics and retry semantics

- The DevOps Toolkit deep dive (https://devopstoolkit.live/kubernetes/kubernetes-controllers-deep-dive-how-they-really-work/) describes informers as a caching layer between controller and API, per-controller work queues, and an observe, compare, act, wait loop. Its author is not named. See [examples/ingress-cert-manager-and-dns-controllers-react-to-one-object](../examples/ingress-cert-manager-and-dns-controllers-react-to-one-object.md).
- The package reference says an error gives exponential backoff, `RequeueAfter` gives a fixed delay, and `Requeue: true` gives a rate-limited requeue.
- The controller-runtime issue 808 thread (https://github.com/kubernetes-sigs/controller-runtime/issues/808) says "Today, you only need to return an error to make it go in exponential backoff loop." The thread's reading of `Result{Requeue: true}` is an immediate requeue without backoff, which conflicts with the package reference. See [open-knowledge-gaps](../open-knowledge-gaps.md).
- The same thread says backoff is tuned through the controller's `RateLimiter` option, for example an item-exponential-failure limiter with a base delay and a maximum delay.
- The Kubebuilder CronJob tutorial (https://book.kubebuilder.io/cronjob-tutorial/controller-implementation) teaches idempotency, rebuilding status from observed child objects, updating the status subresource separately, controller owner references, field indexes for listing children, and `RequeueAfter` to wake at the next scheduled run. It says "status should be able to be reconstituted from the state of the world."

### Pitfalls

- The Ahmet Alp Balkan guide (https://ahmet.im/blog/controller-pitfalls/) catalogues poor CRD design, spec and status confusion, stale cache reads, missing conditions and `observedGeneration`, external API calls on every reconcile, unclear use of error versus `Requeue` versus `RequeueAfter`, skipping the expectations pattern, unfocused controller scope, misunderstanding workqueue resync, and accidentally creating informers by querying undeclared types. See [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md) and [findings/cost-of-constant-reconciliation](../findings/cost-of-constant-reconciliation.md).
- The same guide says "Low barrier to entry combined with good intentions and the 'illusion of working implementation' is not a recipe for success."
- The GoLinuxCloud article (https://www.golinuxcloud.com/avoid-kubernetes-operator-reconcile-loop-explosions/) says controllers generate their own events through status writes, accidental spec mutation, noisy children watched with `Owns()`, aggressive `RequeueAfter`, and event-driven logic. Its fixes are `GenerationChangedPredicate`, `Patch` or status updates instead of full `Update`, watching higher-level aggregates, jitter on requeue, and strictly level-based logic. See [findings/self-triggered-reconcile-loops-generate-their-own-events](../findings/self-triggered-reconcile-loops-generate-their-own-events.md).
- The Red Hat post lists status as a subresource so status writes do not loop, finalizers for cleanup outside garbage collection, controller references, in-controller validation and defaulting, error reporting through status and events, and capped exponential backoff.

### Tool timing and failure policy

- The Flux Kustomization reference (https://fluxcd.io/flux/components/kustomize/kustomizations/) says `spec.interval` is the periodic reconcile cadence with a 60 second minimum, `retryInterval` applies only after failures and defaults to `interval`, `timeout` bounds build, apply, and health-check work, `suspend` pauses reconciliation and drift correction, and jitter can spread load. See [examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing](../examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing.md).
- The same reference lists `wait`, `healthChecks`, `dependsOn` with optional CEL readiness expressions, `prune`, and `force` for recreating objects with immutable-field conflicts, and a manual reconcile through an annotation.
- The Crossplane managed resources page (https://docs.crossplane.io/v1.20/concepts/managed-resources/) describes `Synced` and `Ready` conditions, `managementPolicies`, the `crossplane.io/external-name` annotation, create-tracking annotations, the `crossplane.io/paused` annotation, `deletionPolicy`, and async operation conditions for Upjet-based providers. See [findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource](../findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource.md).
- The Crossplane managed resource design one-pager (https://github.com/crossplane/crossplane/blob/main/design/one-pager-managed-resource-api-design.md) sets out `spec.forProvider`, `status.atProvider`, the external-name annotation, Conditions, and a CRUD-style external client with Observe, Create, Update, and Delete. The dossier extracted only a summary of it.
- The Argo CD automated sync page (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/) says reconciliation runs on `timeout.reconciliation` in `argocd-cm`, default 120 seconds plus 60 seconds of jitter, self-heal re-syncs on divergence with a default 5 second delay, and prune is off by default.
- The same page says "Automatic sync will not reattempt a sync if the previous sync attempt against the same commit-SHA and parameters had failed," while retry supports attempt limits, base duration, backoff factor, and maximum wait. See [examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured](../examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured.md).
- The kro controller tuning page (https://kro.run/next/docs/advanced/controller-tuning) says kro runs three reconcile loops, its dynamic controller handles all instances through one shared queue with a default of 1 worker, a bucket rate limit of 10 events per second, a full resync every 10 hours, up to 20 retries, instance requeue starting at 3 seconds with exponential backoff to 5 minutes, and client QPS 100 with burst 150. See [examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md).
- The same page says "All resource events flow through one rate-limited queue, preventing any single RGD from overwhelming the system."
- The Cluster API Machine controller page (https://cluster-api.sigs.k8s.io/developer/core/controllers/machine) sets owner references, waits for infrastructure and bootstrap provisioning, and matches Nodes to provider IDs, but it says nothing on requeue or pause mechanics. See [examples/cluster-api-machine-controller-waits-for-infrastructure-and-bootstrap-data](../examples/cluster-api-machine-controller-waits-for-infrastructure-and-bootstrap-data.md).

### Deletes, load, and dossier-level claims

- The dossier observes that Argo CD prune is off by default, Flux supports per-object prune opt-out annotations, and Crossplane offers an `Orphan` deletion policy, because a level-based loop deletes what it no longer sees in desired state. See [findings/a-level-based-loop-deletes-what-it-no-longer-sees-in-desired-state](../findings/a-level-based-loop-deletes-what-it-no-longer-sees-in-desired-state.md).
- The dossier compares load and fairness controls in kro, Flux, Argo CD, and controller-runtime. See [comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro](../comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro.md).
- The dossier found no source naming a company that runs these controllers at scale and no postmortem about a runaway reconcile loop, and it could not read ACK or Config Connector material. See [open-knowledge-gaps](../open-knowledge-gaps.md).
- The dossier warns that the Argo CD default of 120 seconds plus jitter comes from the stable documentation while older material says 3 minutes, and that GoLinuxCloud and DevOps Toolkit are secondary sources suited to explanation, not authority.
