# Research dossier: Eventual Consistency and Convergence

Research date: 2026-11-25

Reading note: several large pages were read through a summarizing fetch tool, and a few were read only in their first ~100,000 characters. Summaries below reflect what the tool returned. Quotes were returned by the tool and are short, but check them against the source before publishing.

## Overview

Kubernetes is built around declared intent plus continuous correction. Users write a desired state (spec). Controllers observe actual state and take steps to close the gap. Nothing guarantees that the gap closes instantly, or that every intermediate change is seen. What the system guarantees is that it keeps working toward the latest declared state. That property is eventual consistency, and "convergence" is the observable result: actual state settles on desired state once disruptions stop.

The mechanism that makes this robust is level-based (level-triggered) logic. An edge-triggered system reacts to "something changed" events, so a missed or reordered event leaves it permanently wrong. A level-triggered system reacts to "this is the current state" and recomputes the whole difference each time. Several sources (Tim Hockin's slides, the Hackernoon explainer, the API conventions) frame this as the core design choice. The practical consequences for controller authors are that reconcile functions must be idempotent, must compute from observed state rather than from the event that woke them, and must tolerate being run extra times.

Mechanically, a controller consists of informers (a watch plus a local cache), a work queue that deduplicates keys, and a reconcile function. Failures return an error and the queue retries with exponential backoff. Healthy-but-not-ready situations should use a timed requeue instead of an error. Status conditions and observedGeneration tell users whether a given spec generation has been acted on. Platform tools build on the same loop: Flux re-applies on an interval and detects drift, Crossplane polls external APIs and reports Synced and Ready, Argo CD self-heals and retries with backoff, and kro runs a shared rate-limited queue for resource graphs.

The costs of eventual consistency are staleness (cache lags the API server), retry amplification (backoff misconfigured or absent), duplicated work (multiple replicas without leader election), and ordering problems (dependent resources not ready yet). Sources frame mitigations as: bounded and jittered retries, leader election, health-gated ordering, explicit conditions, and observability of cache freshness (new in Kubernetes v1.36).

## Sources

### 1. Kubernetes v1.36: Staleness Mitigation and Observability for Controllers
- URL: https://kubernetes.io/blog/2026/04/28/kubernetes-v1-36-staleness-mitigation-for-controllers/
- Title: Kubernetes v1.36: Staleness Mitigation and Observability for Controllers
- Publisher: Kubernetes project blog
- Kind: Official release/feature blog
- Summary: Explains that controllers decide using informer caches, which can lag the API server when watch events are delayed or missed, so controllers may act on outdated state. The post describes v1.36 work to mitigate staleness and add metrics for cache synchronization and watch latency. Useful for showing that "eventual" has a real, measurable lag and that upstream now treats it as an observable problem. Read only the first ~100,000 characters; the tool's summary of specific mitigation names is general, so verify against the page.
- Quote: "Staleness in Kubernetes controllers is a problem that affects many controllers" (partial, from tool output)

### 2. Controllers (Kubernetes concepts)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes documentation
- Kind: Official documentation
- Summary: Canonical definition of the controller pattern using the thermostat analogy. Controllers watch the cluster, compare current to desired state, and act through the API server. The page stresses that many simple, decoupled controllers are preferred over one monolith, and that controllers tolerate each other failing. Good first read for the audience.
- Quote: "Each controller tries to move the current cluster state closer to the desired state."

### 3. Edge vs. Level Triggered Logic
- URL: https://speakerdeck.com/thockin/edge-vs-level-triggered-logic
- Title: Edge vs. Level triggered logic
- Publisher/author: Tim Hockin (Kubernetes co-founder), Speaker Deck
- Kind: Conference-style slide deck
- Summary: Uses hardware interrupt lines as analogy. A pulse (edge) can be missed; a held signal (level) persists until serviced. Concludes that level-driven software suits Kubernetes because state is more useful than events: clients can check and re-check at any time. Short, authoritative framing from an original designer.
- Quote: "State is more useful than events."

### 4. Level Triggering and Reconciliation in Kubernetes
- URL: https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d
- Title: Level Triggering and Reconciliation in Kubernetes
- Publisher/author: jbowes on Hacker Noon (2018)
- Kind: Tutorial explainer
- Summary: Walks through edge versus level with addition examples and a replica scaling scenario (1 to 5 to 2) that ends at 0 replicas under edge-triggered handling but at 2 under level-triggered comparison of full states. Notes edge triggering can be repaired by periodic full resync or versioned events. Quotes Joe Beda on the stability of goal-seeking loops. Dated (2018) but conceptually current.
- Quote: "The goal seeking behavior of the control loop is very stable." (Joe Beda, as quoted)

### 5. Kubernetes Controllers Deep Dive: How They Really Work
- URL: https://devopstoolkit.live/kubernetes/kubernetes-controllers-deep-dive-how-they-really-work/
- Title: Kubernetes Controllers Deep Dive: How They Really Work
- Publisher: DevOps Toolkit
- Kind: Tutorial explainer (write-up of a video)
- Summary: Describes the observe, compare, act loop; informers keep a local cache and push notifications to work queues; failed operations retry with exponential backoff; operations must be idempotent. A readable bridge from concept to client-go components.
- Quote: "The controller (1) observes the current state of the resources it's responsible for."

### 6. Availability (kube-rs controllers guide)
- URL: https://kube.rs/controllers/availability/
- Title: Availability - kube
- Publisher: kube-rs project
- Kind: Library documentation / operational guidance
- Summary: Explains why most controllers can run as a single replica: they are queue consumers, watch streams reinitialize with current state on boot, and idempotent reconcilers make repeats harmless, which yields an eventual consistency guarantee. Running two replicas without leader election causes duplicate work and racy writes. Describes Lease-based leader election, step-down on SIGTERM, and rollout surge hazards. Good for the "pitfalls" section.
- Quote: "most controllers lean into the eventual consistency model and run with a single replica" (paraphrase-close; verify)

### 7. Kustomization (Flux)
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization | Flux
- Publisher: Flux project (CNCF)
- Kind: Official API documentation
- Summary: Flux re-reconciles at spec.interval (minimum 60s), uses server-side apply dry-run to detect and correct drift, supports prune, wait and healthChecks for readiness, dependsOn for ordering (dependents wait for Ready), retryInterval for failures, force for immutable-field changes (risking downtime), and suspend. Changes to generation or source revision trigger immediate reconcile outside the interval. Read first ~100,000 of ~121,000 characters.
- Quote: "If the .metadata.generation of a resource changes or the Source revision changes, this is handled instantly outside the interval window."

### 8. Managed Resources (Crossplane v2.4)
- URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/
- Title: Managed Resources
- Publisher: Crossplane project (CNCF)
- Kind: Official documentation
- Summary: Managed resources mirror external cloud objects. Conditions Synced (provider can reconcile it) and Ready (resource is available) separate "controller is working" from "thing is usable". Poll interval can be set per resource with an annotation to detect external drift. The external-name annotation links the object to the cloud identifier and avoids duplicates. Management policies and finalizers control create/update/delete behavior. Providers back off on errors.
- Quote: "Crossplane considers the forProvider field of a managed resource the 'source of truth' for external resources."

### 9. Composite Resources (Crossplane v2.4)
- URL: https://docs.crossplane.io/latest/composition/composite-resources/
- Title: Composite Resources
- Publisher: Crossplane project
- Kind: Official documentation
- Summary: Composite resources report Synced and Ready; Ready depends on the composition function pipeline reporting all composed resources ready. A reconcile can be forced with the crossplane.io/reconcile-requested-at annotation. The page does not describe retry mechanics in detail (a gap).
- Quote: "Crossplane sets the Ready status condition to True when the composite resource's composition function pipeline reports that all its composed resources are ready."

### 10. Automated Sync Policy (Argo CD)
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Title: Automated Sync Policy
- Publisher: Argo CD project (CNCF)
- Kind: Official documentation
- Summary: Self-heal triggers a sync when live state drifts from Git (default delay about 5 seconds). Prune is off by default as a safety measure. Retries use configurable exponential backoff, including unlimited retries. To avoid loops, Argo CD does not re-sync the same commit and parameters after a failure unless self-heal is on. Rollback is blocked while automated sync is enabled.
- Quote: "Automatic sync will not reattempt a sync if the previous sync attempt against the same commit-SHA and parameters had failed."

### 11. Sync Phases and Waves (Argo CD)
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/
- Title: Sync Phases and Waves
- Publisher: Argo CD project
- Kind: Official documentation
- Summary: Ordering is phase, then wave, then kind, then name. Each wave must become Healthy before the next proceeds, with a short pause between waves so controllers can react. Hooks run on every sync and therefore must be idempotent. A failed PreSync hook aborts the sync. Shows how a GitOps tool imposes ordering on top of an eventually consistent cluster.
- Quote: "If a PreSync hook fails then the whole sync operation will stop and will be marked as failed"

### 12. Requeue, RequeueAfter and Error Handling in controller-runtime
- URL: https://www.golinuxcloud.com/requeue-requeueafter-error-handling-controller-runtime/
- Title: controller-runtime Requeue, RequeueAfter & Error Handling (2026)
- Publisher: GoLinuxCloud
- Kind: Tutorial explainer (third-party blog)
- Summary: Maps return values to behavior: empty result and nil means converged; RequeueAfter means healthy but waiting; error means failed and triggers workqueue exponential backoff. Warns against using errors for normal waiting, tight RequeueAfter loops, ignoring NotFound and Conflict, and over-requeueing instead of watching children. Third-party, so confirm against controller-runtime source.
- Quote: "Errors should mean 'this reconcile attempt failed,' not 'come back in thirty seconds.'"

### 13. Controller Tuning (kro)
- URL: https://kro.run/next/docs/advanced/controller-tuning
- Title: Controller Tuning
- Publisher: kro project
- Kind: Official documentation (next/unreleased docs)
- Summary: kro processes all instances from a single shared queue with configurable workers (default 1), combined exponential backoff (200ms to 1000s) and a token bucket (10/s, burst 100), client QPS 100 / burst 150, a 10-hour full resync, and up to 20 retries before an item is dropped. Shows concrete numbers for the responsiveness versus API load tradeoff. Defaults may change; this is the "next" docs version.
- Quote: "Single shared queue prevents any single RGD from overwhelming the system" (tool-reported)

### 14. Kubernetes API Conventions
- URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md
- Title: API Conventions
- Publisher: Kubernetes SIG Architecture
- Kind: Design/convention document
- Summary: Defines spec versus status, level-based semantics, resourceVersion and optimistic concurrency (409 on conflict), the standard conditions structure, and observedGeneration for detecting stale status. Establishes that the system drives toward the most recent spec regardless of intermediate versions. Read first ~100,000 of ~127,000 characters.
- Quote: "The system will drive toward the most recent spec regardless of previous versions" (tool-reported; verify wording)

### 15. How a Retry Loop Took Down GitHub (2026 Postmortem)
- URL: https://www.aurorasre.ai/blog/github-retry-storm-outage-2026
- Title: How a Retry Loop Took Down GitHub (2026 Postmortem)
- Publisher: Arvo / aurorasre.ai (third-party analysis)
- Kind: Postmortem write-up (secondary source)
- Summary: Describes a September 2026 incident in which a background job saturated a shared permissions database, and a retry loop around token creation kept re-sending failing writes, preventing recovery. Lessons: rate-limit background work, monitor the resource actually consumed, bound retries with timeouts. It is not a Kubernetes incident and is a secondary account; use it only as an illustration of retry amplification, and prefer the primary GitHub postmortem if one is located.
- Quote: "a retry loop around token creation kept re-sending the writes that were already failing"

## Real-world use cases

- Deployment and ReplicaSet scaling: the standard example of convergence. A user changes replicas several times quickly and the controller drives to the final count, regardless of intermediate values (https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d, https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md).
- GitOps delivery with Flux: a platform team commits manifests and Flux re-applies them on an interval, correcting manual edits (drift) and gating dependents with dependsOn and health checks (https://fluxcd.io/flux/components/kustomize/kustomizations/).
- Argo CD self-heal: a typical scenario is an engineer hand-editing a live Deployment; Argo CD notices divergence and re-syncs, while sync waves order CRDs, operators, and workloads (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/, https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/).
- Cloud infrastructure through Crossplane: a claim for a database becomes managed resources that poll the cloud API; Synced and Ready convey progress while the cloud provisions slowly (https://docs.crossplane.io/latest/managed-resources/managed-resources/, https://docs.crossplane.io/latest/composition/composite-resources/).
- kro resource graphs: instances of a custom API are expanded into a graph of resources handled by one shared dynamic controller, with tunable throughput (https://kro.run/next/docs/advanced/controller-tuning).
- Small Rust operators on kube-rs, run as single replicas that tolerate restarts, with Linkerd's policy controller cited as a leader-election user (https://kube.rs/controllers/availability/).
- Gap: no named end-user case study (company X ran into convergence issues) was found among the sources read.

## Pitfalls and how tools address them

Stale caches. Controllers read from informer caches that can lag. Kubernetes v1.36 adds mitigation and metrics for this (https://kubernetes.io/blog/2026/04/28/kubernetes-v1-36-staleness-mitigation-for-controllers/). Optimistic concurrency via resourceVersion turns a write based on stale data into a 409 conflict that the controller retries (API conventions URL above).

Errors used as timers. Returning an error for "not ready yet" triggers exponential backoff and noisy failure signals; use RequeueAfter for waiting states, and stop retrying terminal errors by recording them in status (https://www.golinuxcloud.com/requeue-requeueafter-error-handling-controller-runtime/).

Retry storms and unbounded retries. The GitHub account shows retries re-sending failing writes against an overloaded dependency (https://www.aurorasre.ai/blog/github-retry-storm-outage-2026). Tools bound this: kro combines exponential backoff, a token bucket, and a 20-retry cap (https://kro.run/next/docs/advanced/controller-tuning); Argo CD uses configurable backoff and refuses to repeat a failed sync of the same commit (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/); Flux separates retryInterval from interval (https://fluxcd.io/flux/components/kustomize/kustomizations/).

Duplicate work from multiple replicas. Without leader election, two replicas reconcile the same objects and race. Lease-based leader election with step-down on shutdown addresses it, at the cost of failover delay up to lease expiry (https://kube.rs/controllers/availability/).

Ordering and readiness. Dependencies between resources are not ordered by Kubernetes itself. Flux uses dependsOn plus health checks, Argo CD uses health-gated waves and hooks, and Crossplane uses composition function readiness (links in Sources 7, 9, 11). Hooks and waves require idempotent operations.

Misleading status. Readiness can be confused with "controller working". Crossplane's separate Synced and Ready, and the standard conditions with observedGeneration, let users tell whether status reflects the latest spec (Sources 8 and 14).

Drift and external changes. Flux detects drift by interval dry-run; Crossplane by poll interval; Argo CD by self-heal. The detection latency is the interval, so long intervals trade API load for slower correction. Immutable fields need force in Flux, which risks downtime.

Not covered: Config Connector, ACK, and Cluster API specifics (the Cluster API page fetch returned 404), and plain-controller postmortems from Kubernetes itself.

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/architecture/controller/ - the official starting point for the control-loop idea.
- https://speakerdeck.com/thockin/edge-vs-level-triggered-logic - shortest authoritative explanation of why level beats edge.
- https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d - worked examples of missed events and the scaling scenario.
- https://devopstoolkit.live/kubernetes/kubernetes-controllers-deep-dive-how-they-really-work/ - informers, queues, and backoff in plain language.
- https://www.golinuxcloud.com/requeue-requeueafter-error-handling-controller-runtime/ - practical return-value cheat sheet for controller authors.
- https://kube.rs/controllers/availability/ - why single-replica controllers work and when they do not.

## Open questions

- Exact v1.36 staleness mechanisms: the tool summary of the blog was generic; a writer should re-read the page for the real feature names and metric names.
- The kro instances concept page returned empty content, so kro's status conditions and per-instance reconcile semantics are unverified. kro defaults come from "next" docs and may differ in released versions.
- Flux, Crossplane, and Argo CD defaults (poll interval, backoff) were only partly captured; Crossplane's default poll interval and backoff values were not stated.
- Config Connector, ACK, and Cluster API handling of convergence was not sourced.
- The GitHub retry-storm account is secondary and from a vendor blog; its accuracy is unverified and it is not about Kubernetes.
- The Hackernoon piece dates from 2018 and the Hockin deck's date is unknown; confirm they still match current client-go behavior.
