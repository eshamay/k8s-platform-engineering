# Open knowledge gaps — k8s-platform-engineering

This file tracks unresolved questions about Kubernetes platform engineering.
- Agents may DRAFT new entries during ingest or query.
- Only humans may set status = `closed` and write the Resolution paragraph.
- Closed gaps STAY in this file. They are the project's reasoning trail.

## Index of open gaps

- [[#full-lifecycle-trace-from-git-commit-to-ready-status]] — open, unassigned
- [[#crossplane-compositions-vs-kro-dynamic-resource-graphs]] — open, unassigned
- [[#scale-informers-rate-limited-workqueues-and-sharding]] — open, unassigned

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
