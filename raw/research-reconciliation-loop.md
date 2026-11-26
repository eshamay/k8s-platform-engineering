# Research dossier: Reconciliation Loop

Research date: 2026-11-25

## Overview

A reconciliation loop is the core mechanism of every Kubernetes controller. The controller watches some objects, compares the desired state (usually `spec`) with the observed state (the cluster, or an external system), and takes actions to move the observed state toward the desired state. It then reports what it saw in `status`. The official Kubernetes controller docs frame this as a non-terminating control loop, and they stress that the cluster does not need to reach a stable state. Controllers keep correcting failures indefinitely. The docs also describe a design of many small, focused controllers rather than one monolith.

The key design property is that reconciliation is level-based rather than edge-triggered. The controller-runtime documentation says a reconcile request carries only the object's namespace and name, not the event or the object's contents. The reconciler therefore reads current state and recomputes what to do. The 2018 explainer on level triggering shows why: an edge-triggered system that misses or reorders an event can end up in a state the source never held. A level-triggered system self-corrects after a disruption. The price is that reconcile logic must be idempotent and must tolerate being run many times, in any order, after crashes.

Mechanically, in controller-runtime and Kubebuilder, informers keep a local cache of watched objects and push keys into a rate-limited workqueue. Workers call `Reconcile(ctx, Request)`, which returns a `Result` and an error. Three outcomes matter. A non-nil error requeues with per-item exponential backoff (a `TerminalError` opts out of retry). A nil error with `RequeueAfter` requeues after a fixed delay. A nil error with nothing set means the work is done until the next watch event or resync. Practitioner sources say that choosing among these is a common source of confusion, and that bad choices cause hot loops or stalled objects.

Different stacks wrap this same primitive with different timing policy. Flux uses `spec.interval` for a periodic full reconcile and `retryInterval` for failures. Argo CD polls Git on a roughly 2 to 3 minute cadence and offers self-heal and retry backoff settings. Crossplane providers run an Observe/Create/Update/Delete loop against external APIs and expose `Synced` and `Ready` conditions. kro funnels all instance events through one shared rate-limited queue with tunable workers. The sources agree on the core pattern. They differ on how much they poll, how they handle external-API cost, and how they surface failure.

## Sources

### 1. Kubernetes documentation: Controllers
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers (Kubernetes concepts, architecture)
- Publisher: Kubernetes project / CNCF
- Kind: Official documentation
- Summary: Defines controllers as control loops that watch cluster state and move current state toward desired state. It separates controllers that act through the API server (the Job controller creates Pods through it) from those that act directly on external systems, such as node autoscalers. It states the design philosophy of many simple controllers, each owning one aspect and using labels to identify its objects. It also says built-in controllers run in kube-controller-manager and custom ones can run as Pods or outside the cluster. This is the right first page for the thermostat mental model.
- Quote: "Controllers are control loops that watch cluster state and make changes where needed, moving current state closer to desired state."

### 2. controller-runtime reconcile package reference
- URL: https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/reconcile
- Title: reconcile package - sigs.k8s.io/controller-runtime/pkg/reconcile
- Publisher: Kubernetes SIGs (controller-runtime)
- Kind: API reference
- Summary: Documents `Request` (name and namespace only), `Result` (`Requeue`, now deprecated; `RequeueAfter`; an optional `Priority` for priority queues) and `TerminalError`. It spells out the three outcomes: error gives exponential backoff, `RequeueAfter` gives a fixed delay, and `Requeue: true` gives rate-limited requeue. It defines reconciliation as level-based and idempotent. A `TerminalError` is logged and counted in metrics but not retried. Writers should use it for the exact return-value semantics.
- Quote: "action isn't driven off changes in individual Events, but instead is driven by actual cluster state read from the apiserver or a local cache."

### 3. controller-runtime issue 808: ways to trigger or not trigger exponential backoff
- URL: https://github.com/kubernetes-sigs/controller-runtime/issues/808
- Title: Document ways to trigger/not trigger exponential backoff
- Publisher: kubernetes-sigs/controller-runtime maintainers and users
- Kind: Issue thread (community and maintainer discussion)
- Summary: Records the confusion about which return values cause backoff. Per the thread, returning an error enters the exponential backoff loop. The thread's reading of `Result{Requeue: true}` conflicts with the package reference in source 2: it says an immediate requeue without backoff, whereas pkg.go.dev says rate-limited. See Open questions. Backoff is tuned through the controller's `RateLimiter` option, for example a typed item-exponential-failure limiter with a base delay and a max delay. This is useful as evidence that the semantics were historically under-documented.
- Quote: "Today, you only need to return an error to make it go in exponential backoff loop."

### 4. Kubebuilder book: CronJob tutorial, controller implementation
- URL: https://book.kubebuilder.io/cronjob-tutorial/controller-implementation
- Title: Implementing a controller (Kubebuilder Book)
- Publisher: Kubernetes SIGs (Kubebuilder)
- Kind: Official tutorial
- Summary: A worked Reconcile for a CronJob-like type. It teaches idempotency, rebuilding status from observed child objects instead of trusting stored status, updating the status subresource separately, setting controller owner references so garbage collection and child-triggered reconciles work, and adding field indexes to list children efficiently. It also shows `RequeueAfter` used to wake the controller at the next scheduled run. It is the best hands-on code walkthrough for new controller authors.
- Quote: "status should be able to be reconstituted from the state of the world"

### 5. Level Triggering and Reconciliation in Kubernetes
- URL: https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d
- Title: Level Triggering and Reconciliation in Kubernetes
- Publisher/author: HackerNoon, author jbowes (January 2018; diagrams credited to Meg Smith)
- Kind: Conceptual explainer
- Summary: Uses signal-processing analogies to show why Kubernetes compares full desired and actual state instead of replaying change events. A scaling example (1 to 5 to 2 replicas) shows an edge-triggered system terminating more replicas than exist and ending at zero. It concedes that edge triggering has efficiency benefits and can be made safe with periodic full resync or event versioning. It quotes Joe Beda on level-triggered loops being forgiving. It is dated (2018) but the concept is unchanged.
- Quote: "If you are level triggered the pattern is very forgiving" (attributed to Joe Beda, via the article).

### 6. So you wanna write Kubernetes controllers?
- URL: https://ahmet.im/blog/controller-pitfalls/
- Title: So you wanna write Kubernetes controllers?
- Publisher/author: Ahmet Alp Balkan (personal blog)
- Kind: Engineering blog, pitfalls guide
- Summary: A catalogue of mistakes. It covers poor CRD design and spec/status confusion, stale cache reads, missing conditions and `observedGeneration`, making external API calls on every reconcile instead of tracking progress in status, unclear use of error vs `Requeue` vs `RequeueAfter`, skipping the expectations pattern for in-memory write bookkeeping, unfocused controller scope, misunderstanding workqueue resync, and accidentally creating informers by querying undeclared types. Very useful for the pitfalls section.
- Quote: "Low barrier to entry combined with good intentions and the 'illusion of working implementation' is not a recipe for success."

### 7. Avoid Kubernetes Operator Reconcile Loop Explosions
- URL: https://www.golinuxcloud.com/avoid-kubernetes-operator-reconcile-loop-explosions/
- Title: Avoid Kubernetes Operator Reconcile Loop Explosions (2026)
- Publisher/author: GoLinuxCloud, Deepak Prasad
- Kind: Tutorial / troubleshooting blog
- Summary: Explains how controllers generate their own events and loop. Causes: status writes retriggering reconciles, accidental spec mutation, noisy child resources watched through `Owns()`, aggressive `RequeueAfter`, and event-driven logic. Fixes: `GenerationChangedPredicate`, `Patch` or status updates rather than full `Update`, watching higher-level aggregates, jitter on requeue, and strictly level-based logic. It is a secondary source, so claims should be verified against controller-runtime docs.
- Quote: "Keep `Reconcile` idempotent and level-triggered."

### 8. Kubernetes Operators Best Practices
- URL: https://www.redhat.com/en/blog/kubernetes-operators-best-practices
- Title: Kubernetes Operators Best Practices
- Publisher/author: Red Hat, Raffaele Spazzoli
- Kind: Vendor engineering blog
- Summary: Lists operator practices tied to reconciliation: level-based triggering with idempotent operations, status as a subresource so status writes do not loop, finalizers for cleanup of things not covered by garbage collection, controller references on created resources, in-controller validation and defaulting, and reporting errors through both status and events, with exponential backoff capped to avoid infinite error loops. Good for an operator-author checklist.
- Quote: "Level-based triggering forces re-evaluation of entire state, more suitable in complex, unreliable environments where signals can be lost."

### 9. Flux Kustomization API reference
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization (Flux)
- Publisher: Flux project (CNCF)
- Kind: Official documentation
- Summary (read the first ~100,000 of ~121,600 characters): `spec.interval` is the periodic reconcile cadence (minimum 60s) in which the controller fetches the source, builds, applies with server-side apply, and detects drift. `retryInterval` applies only after failures and defaults to `interval`. `timeout` bounds build, apply, and health-check work. `suspend` pauses reconciliation and drift correction. `wait` and `healthChecks` gate readiness, `dependsOn` orders Kustomizations (with optional CEL readiness expressions), `prune` garbage collects removed objects, and `force` recreates objects with immutable-field conflicts. Jitter can spread load. A manual reconcile can be requested via an annotation. A useful example of a time-driven loop on top of watch-driven reconcilers.

### 10. Crossplane managed resources (v1.20)
- URL: https://docs.crossplane.io/v1.20/concepts/managed-resources/
- Title: Managed Resources (Crossplane v1.20)
- Publisher: Crossplane project (CNCF)
- Kind: Official documentation
- Summary: Describes the `Synced` and `Ready` conditions, `managementPolicies` (default full control, or subsets such as Observe-only), the `crossplane.io/external-name` annotation, create-tracking annotations that guard against leaking cloud resources if a create call succeeds but the status write fails, the `crossplane.io/paused` annotation, `deletionPolicy` (`Delete` or `Orphan`), and async operation conditions for Upjet-based providers. Shows how a reconciler for an external API makes safety explicit.
- Quote: "Determine which actions Crossplane can take on a managed resource and its corresponding external resource"

### 11. Crossplane managed resource API design one-pager
- URL: https://github.com/crossplane/crossplane/blob/main/design/one-pager-managed-resource-api-design.md
- Title: Managed Resource API Design (one-pager)
- Publisher: Crossplane maintainers
- Kind: Design document
- Summary: Sets out the managed resource shape: `spec.forProvider` for desired configuration and `status.atProvider` for observed provider state, the external-name annotation as the provider-side identifier, Conditions for reconcile and sync state, and a CRUD-style external client (Observe, Create, Update, Delete) with consistent error handling. It shows how the spec/status split underpins reconciliation against a cloud API. Only a summary of the design was extracted, not the full text.

### 12. Argo CD automated sync policy
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Title: Automated Sync Policy (Argo CD)
- Publisher: Argo project (CNCF)
- Kind: Official documentation
- Summary: Automated sync is driven by `timeout.reconciliation` in `argocd-cm`, default 120s plus 60s jitter. Self-heal re-syncs when live state diverges from Git (default 5s delay). Prune is off by default. Retry supports attempt limits, base duration, backoff factor, and maximum wait. A key behavior: automated sync will not retry the same commit SHA and parameters after a failed sync, which differs from controller-runtime's retry-forever default.
- Quote: "Automatic sync will not reattempt a sync if the previous sync attempt against the same commit-SHA and parameters had failed."

### 13. kro controller tuning
- URL: https://kro.run/next/docs/advanced/controller-tuning
- Title: Controller Tuning (kro)
- Publisher: kro project (Kubernetes SIGs)
- Kind: Official documentation
- Summary: kro runs three reconcile loops; its dynamic controller handles all instances through a single shared queue with configurable concurrency (default 1 worker). Defaults reported: bucket rate limit of 10 events per second, full resync every 10 hours, up to 20 retries for failed items, instance requeue starting at 3 seconds with exponential backoff to 5 minutes, client QPS 100 and burst 150. This is a clear example of tunable knobs in a platform abstraction layer. The `next` docs path may differ from released versions (a 0.9.1 path also exists).
- Quote: "All resource events flow through one rate-limited queue, preventing any single RGD from overwhelming the system."

### 14. Kubernetes Controllers Deep Dive
- URL: https://devopstoolkit.live/kubernetes/kubernetes-controllers-deep-dive-how-they-really-work/
- Title: Kubernetes Controllers Deep Dive: How They Really Work
- Publisher: DevOps Toolkit (author not named on the page)
- Kind: Tutorial explainer
- Summary: A beginner-friendly walk through controllers, informers (caching layer between controller and API), per-controller work queues, and the observe-compare-act-wait loop. Uses an Ingress example in which an ingress controller, cert-manager, and a DNS controller all react to the same object. Good for readers who run Kubernetes but have not seen controllers.

### 15. Cluster API: Machine controller
- URL: https://cluster-api.sigs.k8s.io/developer/core/controllers/machine
- Title: Machine controller (Cluster API Book)
- Publisher: Kubernetes SIGs (Cluster API)
- Kind: Official documentation
- Summary: Limited use. The page describes what the Machine controller does (sets owner references, waits for infrastructure and bootstrap provisioning, matches Nodes to provider IDs) but not requeue or pause mechanics. Useful only to show a multi-object, waiting-on-dependencies reconciler.

## Real-world use cases

Built-in Kubernetes controllers such as the Job controller, which creates Pods through the API server, and node autoscalers acting on external infrastructure are the canonical examples (https://kubernetes.io/docs/concepts/architecture/controller/). The Ingress scenario of an ingress controller, cert-manager, and DNS controller all reacting to one object is a typical multi-controller composition (https://devopstoolkit.live/kubernetes/kubernetes-controllers-deep-dive-how-they-really-work/).

GitOps controllers apply reconciliation to delivery. Flux Kustomizations pull from a source on an interval, apply with drift detection, prune removed objects, and order stacks with `dependsOn` and health checks (https://fluxcd.io/flux/components/kustomize/kustomizations/). Argo CD polls Git and uses self-heal to undo manual drift (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/).

Infrastructure controllers reconcile against cloud APIs. Crossplane providers manage external resources through managed resources with Observe/Create/Update/Delete and external names (https://docs.crossplane.io/v1.20/concepts/managed-resources/, https://github.com/crossplane/crossplane/blob/main/design/one-pager-managed-resource-api-design.md). Cluster API controllers reconcile Machines by waiting for infrastructure and bootstrap data (https://cluster-api.sigs.k8s.io/developer/core/controllers/machine). kro reconciles instances of user-defined APIs through one shared queue (https://kro.run/next/docs/advanced/controller-tuning). The Kubebuilder CronJob tutorial is the typical teaching example of a custom operator that owns child Jobs (https://book.kubebuilder.io/cronjob-tutorial/controller-implementation). No source I could read named a specific company running these at scale or gave a postmortem, which is a gap.

## Pitfalls and how tools address them

Self-triggered loops. Status writes and accidental spec changes generate watch events that requeue the same object, producing hot loops. Mitigations are generation-change predicates, status subresources, patching rather than full updates, and jittered `RequeueAfter` (https://www.golinuxcloud.com/avoid-kubernetes-operator-reconcile-loop-explosions/, https://www.redhat.com/en/blog/kubernetes-operators-best-practices).

Confusing return values. Errors give exponential backoff, `RequeueAfter` gives a fixed delay, and `Requeue: true` is deprecated and described inconsistently. Use errors for failures, `RequeueAfter` for planned polling, and `TerminalError` for failures that retry cannot fix (https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/reconcile, https://github.com/kubernetes-sigs/controller-runtime/issues/808, https://ahmet.im/blog/controller-pitfalls/).

Stale cache and duplicate writes. Reads from the informer cache can lag your own writes, so the controller may act twice. The blog recommends the expectations pattern, and Kubebuilder recommends reconstructing state from observed objects and re-fetching before status updates (https://ahmet.im/blog/controller-pitfalls/, https://book.kubebuilder.io/cronjob-tutorial/controller-implementation).

Expensive external calls. Calling a cloud API on every reconcile wastes quota and time. The blog suggests tracking progress in status. Crossplane records create-pending, succeeded, and failed annotations so a create is not repeated or leaked, and offers `managementPolicies` and a pause annotation to restrict or stop action (https://docs.crossplane.io/v1.20/concepts/managed-resources/).

Failure retry policy. Flux separates `retryInterval` from `interval` and honors `suspend`; Argo CD refuses to retry a failed sync of the same commit unless configured; kro caps retries at 20 with a 3 second to 5 minute backoff; controller-runtime retries failures forever with exponential backoff unless terminal (sources 2, 9, 12, 13 above).

Load and fairness. kro uses one rate-limited shared queue with default 1 worker and client QPS limits; Flux supports jitter so many Kustomizations do not align (https://kro.run/next/docs/advanced/controller-tuning, https://fluxcd.io/flux/components/kustomize/kustomizations/).

Unsafe deletes. Prune is off by default in Argo CD; Flux supports per-object prune opt-out annotations; Crossplane offers `Orphan` deletion policy. Each reflects that a level-based loop will delete things it no longer sees in desired state.

Event-driven design. Event-driven logic can lose or reorder events; level-based design avoids this (https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d).

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/architecture/controller/ : official starting point for the control-loop idea.
- https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d : best conceptual explanation of level vs edge.
- https://devopstoolkit.live/kubernetes/kubernetes-controllers-deep-dive-how-they-really-work/ : informers, queues, and loop in plain language.
- https://book.kubebuilder.io/cronjob-tutorial/controller-implementation : hands-on reconciler code.
- https://ahmet.im/blog/controller-pitfalls/ : what to avoid when writing controllers.
- https://www.golinuxcloud.com/avoid-kubernetes-operator-reconcile-loop-explosions/ : debugging hot loops.
- https://www.redhat.com/en/blog/kubernetes-operators-best-practices : checklist for operators.
- Search hits not read (candidates): https://www.golinuxcloud.com/requeue-requeueafter-error-handling-controller-runtime/ and https://deepwiki.com/kubernetes-sigs/kubebuilder/5.2-reconciliation-loop

## Open questions

- Does `Result{Requeue: true}` back off? The package reference says rate-limited requeue; the issue 808 thread summary says immediate requeue without backoff. Verify against current controller-runtime source (reconcile.go) before writing a tutorial. `Requeue` is also marked deprecated.
- Exact defaults for kro came from the `next` docs and may differ in released versions.
- The Argo CD reconcile interval default of 120s plus 60s jitter is from the stable docs; older material often says 3 minutes.
- I could not read AWS Controllers for Kubernetes (ACK) or Config Connector material. Their drift-detection and resync behavior is not covered. A Render blog page on a DNS dependency outage failed to load.
- No named-company postmortem about a runaway reconcile loop was found. Real-world case studies remain thin.
- Flux page was read only for its first ~100,000 characters.
- Several sources (GoLinuxCloud, DevOps Toolkit) are secondary or have unnamed authors, so use them for explanation and not as authoritative facts.
- Source details come from summaries of fetched pages rather than a line-by-line read of each full page, since several scrapes exceeded the tool size limit.
