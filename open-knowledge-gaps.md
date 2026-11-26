# Open knowledge gaps — k8s-platform-engineering

This file tracks unresolved questions about Kubernetes platform engineering.
- Agents may DRAFT new entries during ingest or query.
- Only humans may set status = `closed` and write the Resolution paragraph.
- Closed gaps STAY in this file. They are the project's reasoning trail.

## Index of open gaps

- [[#full-lifecycle-trace-from-git-commit-to-ready-status]] — open, unassigned
- [[#crossplane-compositions-vs-kro-dynamic-resource-graphs]] — open, unassigned
- [[#scale-informers-rate-limited-workqueues-and-sharding]] — open, unassigned
- [[#named-production-adopters-of-control-plane-tools]] — open, unassigned
- [[#independent-scale-benchmarks-for-etcd-vcluster-and-kcp]] — open, unassigned
- [[#control-plane-as-platform-outage-postmortems]] — open, unassigned
- [[#kro-dependency-graph-and-readiness-mechanics]] — open, unassigned
- [[#direct-reads-of-argo-cd-flux-ack-and-config-connector-failure-modes]] — open, unassigned
- [[#community-direction-for-the-kubernetes-as-a-kernel-distribution-model]] — open, unassigned
- [[#flux-default-reconcile-interval-and-drift-detection-wording]] — open, unassigned
- [[#adoption-observe-only-and-ignore-differences-controls]] — open, unassigned
- [[#argo-cd-versus-flux-head-to-head-behavior]] — open, unassigned
- [[#current-crossplane-terminology-versus-the-early-claims-and-classes-model]] — open, unassigned
- [[#informer-resync-semantics]] — open, unassigned
- [[#origin-of-level-driven-not-edge-driven-guidance]] — open, unassigned
- [[#incidents-caused-by-lost-events-or-edge-triggered-design]] — open, unassigned
- [[#reconcile-defaults-for-crossplane-ack-and-cluster-api]] — open, unassigned

---

## Full lifecycle trace from Git commit to Ready status — status: open

- **Question:** What exactly happens, step by step, from a Git commit in a Flux-managed repository through source fetch, rendering, server-side apply, finalizer registration, controller reconciliation, and status condition updates until the object reports Ready?
- **Why it matters:** The lifecycle trace ties together nearly every concept in the vocabulary and is the best test of whether the wiki's concept pages compose into a coherent whole.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find sources that describe Flux's source-controller, kustomize-controller, and helm-controller flow in detail.
  - [ ] Trace SSA field ownership, finalizer, and condition behavior through the flow.
  - [ ] Write a worked example page under `examples/`.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, lifecycle, ssa, finalizers, conditions

- **Possible resolution from [[sources/research-universal-control-plane]]:** The dossier covers Flux only at the component and Kustomization API level (`dependsOn`, `prune`, `healthChecks`, drift correction through server-side apply dry runs). It does not trace the source-controller to kustomize-controller handoff, so it only partly helps. See [[entities/flux]].
- **Possible resolution from [[sources/research-declarative-vs-imperative]]:** The dossier adds Flux Kustomization details that belong in the trace: sources produce artifacts that Kustomizations apply, drift is detected with a server-side apply dry run each interval, `prune` and the deletion policy govern removal, and `suspend` pauses reconciliation. It still does not trace finalizer registration or status condition updates, so it only partly helps. See [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]].
- **Possible resolution from [[sources/research-level-triggered-vs-edge-triggered]]:** Only marginally helpful. The dossier shows that Flux's Kustomization reconciles on its interval and immediately on source revision changes, runs a server-side apply dry run each cycle, and uses `retryInterval` on failure, which fits the trigger and retry steps of the trace. It does not trace source-controller handoff, finalizers, or condition updates. See [[entities/flux]] and [[examples/gitops-reverts-a-hand-edited-deployment]].

## Crossplane Compositions vs kro dynamic resource graphs — status: open

- **Question:** How do Crossplane Compositions (including composition functions) and kro's ResourceGraphDefinition differ in how they model, order, and reconcile dynamic resource graphs, and what trade-offs follow?
- **Why it matters:** Both offer a simplified API over many underlying resources, but with different execution models; the choice affects portability, debuggability, and dependency handling.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect official docs and design documents for both tools.
  - [ ] Collect practitioner comparisons and real-world adoption stories.
  - [ ] Write a `comparisons/` page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, kro, composition, abstraction

- **Possible resolution from [[sources/research-universal-control-plane]]:** The dossier supplies the execution models: Crossplane uses an XRD plus a Composition that runs a pipeline of gRPC functions with observed-state feedback on each reconcile, while kro uses a ResourceGraphDefinition with CEL references from which ordering is derived. kro was pre-1.0 (0.10.0) and its dependency mechanics were not read. A first draft is in [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]]. See [[entities/crossplane]] and [[entities/kro]].
- **Possible resolution from [[sources/research-declarative-vs-imperative]]:** The dossier adds that kro validates schemas, expressions, and references at apply time, infers dependency order from CEL expressions, waits on not-yet-existing status values, supports conditionals and forEach, and keeps CEL non-Turing-complete so definitions terminate and are auditable. Crossplane instead uses a gRPC function pipeline for flexible composition. Readiness mechanics are still not described. See [[examples/platform-team-self-service-apis-with-crossplane-and-kro]].
- **Possible resolution from [[sources/research-level-triggered-vs-edge-triggered]]:** Only marginally helpful. The dossier adds Crossplane's reconcile mechanics (`forProvider` compared to the external resource, `managementPolicies`, pause annotation) but does not mention kro or composition functions, and the default poll interval was not confirmed. See [[entities/crossplane]] and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## Scale: informers, rate-limited workqueues, and sharding — status: open

- **Question:** How do informers, rate-limiting workqueues, and controller sharding prevent API server bottlenecks, and what scaling limits do Flux and Crossplane hit in practice?
- **Why it matters:** Platform tools that manage thousands of resources can overload the API server or their own controllers; scale behavior determines whether an architecture is viable.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find controller-runtime and client-go documentation on caches and workqueues.
  - [ ] Find Flux and Crossplane sharding, concurrency, and provider-scaling guidance and case studies.
  - [ ] Write a `findings/` page on scaling limits and mitigations.
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, informers, workqueue, sharding

- **Possible resolution from [[sources/research-universal-control-plane]]:** The dossier covers the etcd and API server side of scale (single write leader, 8 GB cap, list and watch amplification, Kine, separate Events etcd, per-tenant control planes), not informer, workqueue, or sharding behavior of Flux and Crossplane. See [[findings/etcd-scale-limits-of-the-shared-store]].
- **Possible resolution from [[sources/research-declarative-vs-imperative]]:** Only marginally helpful. The dossier explains that controllers re-list and reconcile full state and that Kubebuilder controllers use the status subresource and owner references, but it has no sharding, concurrency, or rate-limit data. See [[entities/kubebuilder]].
- **Possible resolution from [[sources/research-level-triggered-vs-edge-triggered]]:** Partly helpful. The dossier explains why events are hints that enqueue keys, how cache lag causes double action, how errors requeue with exponential backoff, and how intervals and jitter limit API load. It has no sharding or concurrency data and does not explain informer resync semantics. See [[findings/stale-cache-and-double-action]], [[findings/cost-of-constant-reconciliation]], and [[concepts/informers-reflectors-and-workqueues]].

## Named production adopters of control-plane tools — status: open

- **Question:** Which named organizations run Crossplane, ACK, Config Connector, Cluster API, or kcp in production, and with what object counts?
- **Why it matters:** The dossier's use cases rest on vendor documentation and announcements, so adoption evidence is missing.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect CNCF project pages, ADOPTERS files, and KubeCon talks.
  - [ ] Write `examples/` pages for each documented adopter.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, crossplane, ack, kcp

## Independent scale benchmarks for etcd, vcluster, and kcp — status: open

- **Question:** What do independent benchmarks show for the 30,000 to 40,000 object degradation point, roughly 100 vCluster tenants, 1000+ kcp tenants, and the million-workspace kcp goal?
- **Why it matters:** These figures come from vendors with a stake in the answer and depend on the workload.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find neutral benchmarks or large-operator write-ups.
  - [ ] Update [[findings/etcd-scale-limits-of-the-shared-store]] and [[comparisons/tenancy-models-namespaces-vcluster-kcp]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, etcd, vcluster, kcp

## Control-plane-as-platform outage postmortems — status: open

- **Question:** Are there public postmortems of outages caused by CRD deletion cascades, etcd quota alarms, or controller storms?
- **Why it matters:** The pitfalls pages lack real incident evidence.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search for public incident reports and conference talks.
  - [ ] Add `findings/` pages for each incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, etcd, deletion

## kro dependency graph and readiness mechanics — status: open

- **Question:** How does kro derive ordering and readiness from references in a ResourceGraphDefinition?
- **Why it matters:** The fetched kro page did not expose these details, which leaves the ordering comparison incomplete.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the RGD reference documentation.
  - [ ] Complete the kro row of [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, ordering, cel

## Direct reads of Argo CD, Flux, ACK, and Config Connector failure modes — status: open

- **Question:** What failure-mode details, such as Argo CD drift and self-heal and Flux server-side apply conflicts, appear in the full documentation?
- **Why it matters:** The dossier read these pages through a summarizing fetch, so details may be missing or wrong. The ACK 10-hour resync default also needs verification.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the full pages directly and correct the entity and finding pages.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, flux, ack, verification

## Community direction for the Kubernetes-as-a-kernel distribution model — status: open

- **Question:** Does the Ænix "distribution" model reflect community direction, for example in a SIG or KEP, or only one vendor's view?
- **Why it matters:** It determines how much weight the non-container use cases deserve.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find SIG discussions or KEPs and conference talks on API server aggregation, server-side apply, and streaming lists.
- **Drafted by:** agent on 2026-11-25
- **Tags:** distributions, aenix, kep

## Flux default reconcile interval and drift-detection wording — status: open

- **Question:** What is the actual default Kustomization interval in Flux, and does the concepts page's five-minute figure conflict with the Kustomization API page's 60-second minimum?
- **Why it matters:** Drift-correction latency is a core operational property, and the two pages read as inconsistent.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux Kustomization reference directly and confirm that `interval` is user-set and what the minimum is.
  - [ ] Update [[entities/flux]] and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, drift, verification

## Adoption, observe-only, and ignore-differences controls — status: open

- **Question:** How do ACK resource adoption, Crossplane management policies (observe-only), Argo CD `ignoreDifferences`, and Flux server-side apply field managers let teams bring existing resources under declarative control or exempt fields from correction?
- **Why it matters:** These controls are the main mitigation for the multiple-writer and drift pitfalls, and none was read in the dossier.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each tool's documentation directly.
  - [ ] Update [[findings/multiple-writers-on-one-object]] and [[findings/defaulting-and-drift-reconcile-loops]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, ignore-differences, management-policies

## Argo CD versus Flux head-to-head behavior — status: open

- **Question:** How do Argo CD and Flux compare in practice on drift correction, pruning, multi-tenancy, and failure behavior, according to neutral sources?
- **Why it matters:** The current comparison page merges separate documentation pages and is not a head-to-head analysis.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find practitioner comparisons and CNCF material.
  - [ ] Revise [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, argo-cd, comparison

## Current Crossplane terminology versus the early claims-and-classes model — status: open

- **Question:** Which parts of Crossplane's 2018-era claims and resource classes design survive in the current composite resource, composition, and function model?
- **Why it matters:** The original announcement is still widely quoted, and its terminology may mislead readers of current documentation.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read current Crossplane docs on claims and compare them with the early blog post.
  - [ ] Update [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, terminology, history

## Informer resync semantics — status: open

- **Question:** What does an informer resync period actually do in client-go and controller-runtime, and how does it differ from a relist against the API server?
- **Why it matters:** Tutorials say controllers re-list or resync periodically, but the dossier found no source that explains that resync replays cached state to handlers and does not refetch from the API server.
- **Owner:** unassigned
- **How to close:**
  - [ ] Walk through the client-go shared informer and reflector source.
  - [ ] Update [[concepts/informers-reflectors-and-workqueues]] and [[concepts/level-triggered-vs-edge-triggered]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** informers, resync, client-go

## Origin of the Level driven, not edge driven guidance — status: open

- **Question:** Where is the Kubernetes Controller Writing Guide that the Ayson post quotes as "Level driven, not edge driven," and does it say more about expectations?
- **Why it matters:** The quote is cited second-hand, and the original guide URL was not located.
- **Owner:** unassigned
- **How to close:**
  - [ ] Locate the guide in the kubernetes/community repository or a successor.
  - [ ] Verify the quote and the Joe Beda attribution to the O'Reilly book Cloud Native Infrastructure.
- **Drafted by:** agent on 2026-11-25
- **Tags:** level-triggered, verification, provenance

## Incidents caused by lost events or edge-triggered design — status: open

- **Question:** Are there named-company postmortems or case studies where a lost event, stale cache, or edge-triggered design caused an outage?
- **Why it matters:** The pitfalls pages rely on explainers and framework docs. The Render informer blog post and the ondemandenv.dev Thermostat article could not be fetched, so they may hold evidence.
- **Owner:** unassigned
- **How to close:**
  - [ ] Retry the Render informer post and search for operator bugs tied to missed events.
  - [ ] Add `findings/` pages for each documented incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, informers, level-triggered

## Reconcile defaults for Crossplane, ACK, and Cluster API — status: open

- **Question:** What are the default poll or resync intervals and drift-recovery behaviors of Crossplane providers, ACK controllers, and Cluster API controllers?
- **Why it matters:** The cadence comparison has empty cells for these tools because the pages fetched did not state the values.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's documentation or source directly.
  - [ ] Fill the rows in [[comparisons/reconcile-cadence-and-off-switches-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, ack, cluster-api, intervals
