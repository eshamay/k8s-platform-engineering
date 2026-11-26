# Research dossier: Level-Triggered vs Edge-Triggered

Research date: 2026-11-25

Method note: pages were read via web_scrape or WebFetch. Several pages were summarized by WebFetch's page-reading model, not read in full by the researcher (marked "partial read" below). Verbatim quotes are kept under 25 words and attributed.

## Overview

"Edge-triggered" and "level-triggered" come from electronics and interrupt handling. An edge-triggered system reacts to a transition ("the signal went high", "a Pod was deleted"). A level-triggered system reacts to the current value ("the signal is high", "3 replicas desired, 2 exist"). Kubernetes controllers are designed on the level-triggered side. A controller does not replay a log of events to compute what to do. It reads the desired state (`spec`) and the observed state, and acts on the difference.

The sources agree on the core reason: robustness to lost or coalesced information. Watch connections drop, controllers restart, events are batched, and networks fail. If correctness depends on seeing every event, one missed event leaves the system permanently wrong. If correctness depends only on being able to observe the current state, the next reconcile repairs the damage. The Hackernoon explainer shows this with arithmetic: a missed "-1" event leaves an edge-triggered counter at 3 when the true value is 2. The same article walks through a scale-up/scale-down example in which an event-driven reconciler can overshoot to zero replicas.

In practice Kubernetes is a hybrid. Watches and informers deliver events with low latency (an "edge-triggered" optimization), but the event is only a hint to enqueue an object key. The reconciler then reads full state from a cache and enforces all of it. The Kubernetes design archive says this directly: controllers are level-based, yet can gain edge-triggered latency benefits through watch. controller-runtime's Reconciler docs and FAQ turn this into rules: the reconciler is not told the event type, must be idempotent, and must handle skipped or coalesced events.

The newer sources add the counterweight. Level-triggering is not free. A cache read can lag behind the controller's own writes, so a naive level-triggered controller can act twice on the same gap (the "expectations" problem). Level-triggering also means repeated work: periodic resync, drift checks, and calls to external APIs that may have quotas. Tool stacks (Flux, Argo CD, Crossplane, Config Connector) expose this trade-off through intervals, jitter, backoff, and suspend or pause controls.

## Sources

### 1. Level Triggering and Reconciliation in Kubernetes
- URL: https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d
- Publisher/author: HackerNoon, by jbowes (Jan 2018; diagrams by Meg Smith)
- Kind: engineering explainer
- Read in full (web_scrape).
- Summary: The clearest ramp-up piece. It defines edge versus level using signal diagrams and simple `a += 4` arithmetic, then shows what a lossy channel does to each. With disruptions, the level-triggered view is delayed but ends correct, while the edge-triggered view can land in a state the original signal never had. It then applies this to desired versus actual state and the replica scale-up/scale-down example, and concedes edge triggering has real advantages (it transmits only changes) and can be mitigated by periodic full resync or event ordering and versioning.
- Quote (Joe Beda, as cited there): "If you are edge triggered you run risk of compromising your state and never being able to re-create the state."

### 2. Controllers (Kubernetes documentation)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Publisher: Kubernetes project (kubernetes.io)
- Kind: official documentation
- Partial read (WebFetch, first 100,000 of about 101,000 characters).
- Summary: Defines the control loop with the thermostat analogy, explains that controllers drive current state toward the `spec`, and distinguishes controllers that act through the API server (Job creating Pods) from ones that act on external systems. It stresses many small controllers over a monolith, and that kube-controller-manager runs the built-ins with failover. It never uses the words "level-triggered" prominently, but gives the intended mental model for the idea.
- Quote: "As long as the controllers for your cluster are running and able to make useful changes, it doesn't matter if the overall state is stable or not."

### 3. controller-runtime FAQ
- URL: https://github.com/kubernetes-sigs/controller-runtime/blob/main/FAQ.md
- Publisher: kubernetes-sigs/controller-runtime
- Kind: framework documentation (practical guidance)
- Read in full (web_scrape).
- Summary: Gives the practical rules a controller author must follow. One controller per root object type, with other objects mapped to the root via owner or map-function handlers. Do not branch on create/update/delete. Reconcile idempotently by reading all needed state then writing updates, so the reconciler tolerates skipped or coalesced events and restarts. Assume cache reads can be stale: use deterministic object names (StatefulSet and Deployment do), or track your own actions and requeue (ReplicaSet does). Recommends envtest over fake clients.
- Quote: "You should not. Reconcile functions should be idempotent, and should always reconcile state by reading all the state it needs, then writing updates."

### 4. controller-runtime reconcile package docs
- URL: https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/reconcile
- Publisher: controller-runtime / pkg.go.dev
- Kind: API reference
- Read via WebFetch (targeted prompt, not full page).
- Summary: States the level-based contract in the Reconciler type. The Request carries only a namespaced name, not an event type. A non-nil error requeues with exponential backoff (except `TerminalError`), and `RequeueAfter` schedules a timed revisit. This is the code-level expression of the concept and a good tie-in for tutorials.
- Quote: "Reconciliation is level-based, meaning action isn't driven off changes in individual Events, but instead is driven by actual cluster state."

### 5. Kubernetes design archive: resource-management
- URL: https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/resource-management.md
- Publisher: Kubernetes community (design-proposals-archive)
- Kind: design document
- Read via WebFetch (targeted prompt, summary only).
- Summary: The primary-source design rationale. Controllers are level-based so the system works from desired plus observed state however many intermediate updates were missed. Watches then give back the latency and efficiency benefits of edge-triggering without making correctness depend on them.
- Quote: "Controllers are level-based to maximize fault tolerance."

### 6. Level vs Edge Triggered: A Kubernetes Loop Under Delay and Loss
- URL: https://joshuaayson.com/2026/10/12/kubernetes-reconciliation-loop-ashby-requisite-variety/
- Publisher/author: Joshua Ayson (blog, Oct 2026)
- Kind: analytical blog post with simulation
- Partial read (WebFetch summary; page is long).
- Summary: Studies a regulator reading through a channel that is both delayed and lossy. Level-triggered survives loss but, because it cannot see its own recent writes, acts twice on one problem (the "plate shelf" example ends with four plates when three were wanted). Edge-triggered survives delay but a lost event leaves a permanent offset. The fix is Kubernetes-style "expectations": a level-triggered loop that remembers its own unseen writes and resolves them using API resource versions. Useful for explaining why pure level-triggering is not enough.
- Quote (Kubernetes Controller Writing Guide, via Ayson): "Level driven, not edge driven."

### 7. Kubernetes from First Principles, Chapter 7: Key Design Principles
- URL: https://rajatarya.github.io/kubernetes-first-principles/07-design-principles.html
- Publisher/author: Rajat Arya (online book)
- Kind: tutorial/explainer
- Read in full (web_scrape).
- Summary: Short beginner-friendly treatment. Contrasts "a pod was deleted" with "desired is 3, actual is 2", ties the idea to informers' cached copies, and lists common misconceptions: declarative does not mean one-shot, controllers are continuous loops, and event-driven controllers break when events are missed. Its further-reading list points to the Hackernoon article, KEPs, the design archive, and API conventions.
- Quote: "Edge-triggered systems require reliable event delivery; level-triggered systems only require eventual state observation."

### 8. Desired State vs Actual State in Kubernetes: The Level-Triggered Model
- URL: https://www.golinuxcloud.com/desired-state-vs-actual-state-kubernetes/
- Publisher/author: GoLinuxCloud, Deepak Prasad
- Kind: tutorial explainer
- Partial read (WebFetch summary).
- Summary: Walks through spec versus status, informers and cache, the workqueue (events trigger reconcile but the controller reads whole-object state), and periodic resync. Lists beginner pitfalls: `.status` is derived, `kubectl apply` returns before convergence, and Pending Pods mean the scheduler is still working.
- Quote (cited Kubernetes docs): "Each controller tries to move the current cluster state closer to the desired state."

### 9. Level-triggered vs edge-triggered reconciliation (RunBook Academy)
- URL: https://runbook.academy/courses/kubernetes/lessons/kubernetes-iv-06-level-vs-edge-triggered/
- Publisher: RunBook Academy (Kubernetes course lesson)
- Kind: course lesson
- Partial read (WebFetch, first 100,000 of about 125,000 characters).
- Summary: Defines both modes with Deployment and Pod-deletion examples. Notes edge-triggered controllers can miss events on restart and need fallback reconciliation, level-triggered ones look slower but tolerate transient failure, and mixing both needs care to avoid duplicate or conflicting actions.
- Quote: "Level-triggered reconciliation continuously observes and corrects state drift."

### 10. Controller Pattern (Apeiro Reference Architecture)
- URL: https://documentation.apeirora.eu/docs/best-practices/digital-twins/controller
- Publisher: ApeiroRA (EU-funded open cloud reference architecture)
- Kind: architecture best-practice doc
- Read via WebFetch (summary).
- Summary: Presents the controller pattern for digital-twin style systems outside classic Kubernetes workloads. It frames level-triggering as favoring resilience over efficiency, and notes the cost of constant monitoring. Shows the pattern used as a general architectural idiom.
- Quote: "Controllers continuously reconcile the actual state with the desired state, much like a PID controller adjusts the control variable to minimize error."

### 11. Flux Kustomization API
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Publisher: Flux project (CNCF)
- Kind: official documentation
- Partial read (WebFetch, first 100,000 of about 121,600 characters).
- Summary: Shows level-triggering in a GitOps tool. `.spec.interval` (minimum 60s) re-fetches, builds, and applies on a schedule, and every cycle runs a server-side apply dry-run to detect and correct drift. `.spec.retryInterval` governs failures. Reconcile also runs immediately on source revision changes or metadata changes, so events are a latency optimization on top of the interval. `.spec.suspend` stops both applying and drift detection; `.spec.force` recreates objects on immutable-field conflicts.
- Quote: "When the Git revision changes, the manifests are reconciled automatically."

### 12. Argo CD Automated Sync Policy
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Publisher: Argo project (CNCF)
- Kind: official documentation
- Read via WebFetch (summary).
- Summary: Argo CD compares Git manifests to live state and marks Applications OutOfSync. Automated sync with self-heal re-applies when live state drifts. Polling is governed by `timeout.reconciliation` in `argocd-cm`. Prune is off by default. Automated sync does not retry a failed sync of the same commit and parameters, and rollback is blocked while automated sync is on.
- Quote: "The automatic sync interval is determined by the `timeout.reconciliation` value in the `argocd-cm` ConfigMap." (default 120s plus up to 60s jitter, per the page)

### 13. Config Connector: Reconciliation strategy
- URL: https://docs.cloud.google.com/config-connector/docs/concepts/reconciliation
- Publisher: Google Cloud
- Kind: official documentation
- Read via WebFetch (summary).
- Summary: Describes level-triggered reconciliation against an external cloud API. It reconciles periodically to correct drift once a resource is UpToDate, retries failures with exponential backoff capped at 2 minutes, and exposes annotations to tune or disable the interval (`cnrm.cloud.google.com/reconcile-interval-in-seconds`) and cap backoff. Longer intervals reduce API quota use. Some fields (unreadable ones like passwords) are only actuated on spec change, and immutable-field changes need recreation.
- Quote: "GKE moves your declared configuration towards eventual consistency with the desired state."

### 14. Crossplane Managed Resources
- URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/
- Publisher: Crossplane project (CNCF)
- Kind: official documentation
- Thin read (WebFetch returned only a short summary).
- Summary: A provider re-reconciles each managed resource, compares `forProvider` to the external resource, and acts according to `managementPolicies` (Observe, Update, LateInitialize and so on). Poll interval and a pause annotation control cadence. Details on poll interval defaults were not confirmed from this fetch.
- Quote: "Each time a provider reconciles a managed resource it checks the resource's creation annotations."

## Real-world use cases

Core Kubernetes controllers: The ReplicaSet, StatefulSet, and Deployment controllers are the canonical examples. The controller-runtime FAQ (https://github.com/kubernetes-sigs/controller-runtime/blob/main/FAQ.md) shows they handle cache lag differently: StatefulSet appends ordinal numbers, Deployment hashes the pod template, and ReplicaSet tracks expectations and requeues. Joe Beda's remark, quoted in the Hackernoon piece (https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d), says Kubernetes has shipped bugs that went unnoticed because the loop self-corrected.

GitOps: Flux and Argo CD both turn "Git is truth" into a repeating comparison between Git and the cluster. Flux's Kustomization controller re-applies on an interval and on source change (https://fluxcd.io/flux/components/kustomize/kustomizations/). Argo CD polls on `timeout.reconciliation` and, with self-heal, reverts manual `kubectl edit` changes (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/). Typical scenario: someone hand-edits a Deployment in production, and the next cycle reverts it.

Cloud resource controllers: Config Connector (Google Cloud) and Crossplane providers reconcile external cloud objects such as databases and buckets on a schedule, so a console change gets detected and reverted (https://docs.cloud.google.com/config-connector/docs/concepts/reconciliation, https://docs.crossplane.io/latest/managed-resources/managed-resources/). ACK and Cluster API follow the same shape, but this research could not confirm details for them from the pages fetched.

Non-Kubernetes adoption: The ApeiroRA reference architecture (https://documentation.apeirora.eu/docs/best-practices/digital-twins/controller) recommends the controller pattern for digital-twin systems, showing the idea is used outside container scheduling.

Custom operators: Anyone writing an operator with controller-runtime inherits the level-based contract (https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/reconcile). The Request carries only a name, so authors cannot write event-specific logic even if they wanted to.

## Pitfalls and how tools address them

Stale cache and double action. A controller reads its informer cache, which can lag its own writes, so it may create a second Pod for the same gap. The Ayson post (https://joshuaayson.com/2026/10/12/kubernetes-reconciliation-loop-ashby-requisite-variety/) calls the fix "expectations": remember your own unseen writes and clear them by resource version. controller-runtime's FAQ lists two built-in-controller approaches: deterministic names so the API server rejects duplicates, or requeue-after-timeout for generateName cases.

Writing event-specific logic. Authors tempted to branch on create/update/delete reintroduce edge-triggered fragility. The FAQ says not to, and the Reconciler contract hides the event type. The first-principles book lists this as a common mistake (https://rajatarya.github.io/kubernetes-first-principles/07-design-principles.html).

Cost of constant checking. Level-triggering means repeated reads and, for external systems, repeated API calls. Config Connector gives interval and backoff-cap annotations to limit quota use (https://docs.cloud.google.com/config-connector/docs/concepts/reconciliation). Flux sets a 60s minimum interval and a separate retryInterval (https://fluxcd.io/flux/components/kustomize/kustomizations/). Argo CD adds jitter to its default interval (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/). The Apeiro doc names the resource cost explicitly.

Fighting humans and other controllers. A continuous loop will revert intentional manual changes. Tools provide off-switches: Flux `suspend`, Argo CD self-heal toggle, Crossplane pause annotation and management policies (Observe-only), Config Connector interval "0" to disable. This is the main operational lesson for platform teams: decide who owns each field.

Failure loops. A reconcile that always fails retries forever. controller-runtime uses exponential backoff for errors, with `TerminalError` to stop retrying. Argo CD does not retry a failed automated sync of the same commit. Config Connector caps backoff at two minutes.

Immutable or write-only fields. Level-triggered drift correction cannot fix what it cannot read or change. Config Connector actuates unreadable fields only on spec change and needs recreation for immutable ones; Flux offers `force` to replace objects on immutable conflicts.

Edge-triggered is not always wrong. The Hackernoon article and the design archive both note that edge signals are efficient and can be made safe with periodic full resync or versioned, ordered events. Treat events as hints, state as truth.

## Tutorial and explainer links

- https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d : best first read, with diagrams and the replica example.
- https://kubernetes.io/docs/concepts/architecture/controller/ : official control-loop and thermostat introduction.
- https://rajatarya.github.io/kubernetes-first-principles/07-design-principles.html : short chapter with misconceptions and further reading.
- https://www.golinuxcloud.com/desired-state-vs-actual-state-kubernetes/ : informers, workqueue, and resync in beginner terms.
- https://runbook.academy/courses/kubernetes/lessons/kubernetes-iv-06-level-vs-edge-triggered/ : course lesson comparing the two modes.
- https://github.com/kubernetes-sigs/controller-runtime/blob/main/FAQ.md : the practical rules for writing a correct reconciler.
- https://joshuaayson.com/2026/10/12/kubernetes-reconciliation-loop-ashby-requisite-variety/ : deeper dive on why pure level-triggering needs expectations.

## Open questions

- Several sources were read only through a summarizing fetcher. Quotes from pages 5, 10, 12, 13, and 14 should be re-verified against the live pages before publishing.
- The Joshua Ayson post cites a "Kubernetes Controller Writing Guide" with the phrase "Level driven, not edge driven"; the original guide URL was not located here.
- The Hackernoon piece attributes its Joe Beda quote to the O'Reilly book Cloud Native Infrastructure; the quote was not verified against the book.
- Crossplane's default poll interval, ACK's resync and drift-recovery behavior, and Cluster API controller details were not confirmed (the ACK overview page lacked them; the Cluster API page URL tried returned 404). Argo CD and Flux defaults (120s plus 60s jitter; 60s minimum interval) are as stated on the pages and may change by version.
- No postmortem or named-company case study tying an outage to edge-triggered or lost-event design was found. The Render informer blog post (https://render.com/blog/kubernetes-informers) looked relevant but could not be fetched (connection reset). The ondemandenv.dev "Thermostat" article also could not be fetched (DNS failure).
- Sources differ in framing: the first-principles and Hackernoon pieces describe a pure level-triggered design, while the design archive and Ayson describe a hybrid that uses watch events and expectations. Tutorials should present it as hybrid.
- Neither the official controller page nor the sources explain informer resync period semantics precisely (resync replays cached state to handlers and is not a relist from the API server); this needs a client-go source walkthrough.
