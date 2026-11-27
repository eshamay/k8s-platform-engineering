---
title: "Research dossier: kro gap cluster (released-version tuning, Graph API, readiness, status schema, governance)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [kro, v0.10.0, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: kro gap cluster (released-version tuning, Graph API, readiness, status schema, governance)

> [!NOTE]
> **Raw file:** `raw/research-gap-g3-kro.md` (sha256 prefix e8d7c5923d98)<br>
> **Kind:** Verified research dossier for gap cluster g3-kro, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing kro pages<br>
> **Caveat:** Claims are labeled VERIFIED, SECONDARY-ONLY, or UNVERIFIED in the dossier. Only VERIFIED claims, and the SECONDARY-ONLY claims with attribution, enter wiki pages as fact. Documentation was read as markdown source in the kubernetes-sigs/kro repository at tag v0.10.0, not as rendered kro.run pages.

## Summary

The dossier reads kro's documentation at git tag v0.10.0, the latest stable release, published 2026-11-10. It settles the version discrepancy in the wiki: the previous stable release was v0.9.4 (2026-09-04), and a v0.10.0-rc.0 prerelease followed on 2026-09-22, so a September 2026 blog that cites v0.9.x described the stable release of its day. It confirms that the tuning numbers the wiki took from the unreleased "next" documentation hold at v0.10.0, adds the settings the wiki had not recorded, names the four built-in instance conditions, and documents the alpha `Graph` API and the readiness difference between a Graph and a ResourceGraphDefinition. It reports that kro is a subproject of Kubernetes SIG Cloud Provider and that no page read calls it a CNCF project in its own right. It leaves the Crossplane v2 readiness-propagation mechanism only partly answered, because function SDK source was not read.

## Key claims

### Releases and the Graph API

- v0.10.0 is the latest stable release, published 2026-11-10, and its first release-note item is "RGD on Graph - unifying the composition engine (Implementation of KREP-024)". https://github.com/kubernetes-sigs/kro/releases/tag/v0.10.0
- The release sequence is v0.9.0 (2026-03-24), v0.9.1 (2026-04-03), v0.9.2 (2026-05-08), v0.9.3 (2026-07-27), v0.9.4 (2026-09-04), v0.10.0-rc.0 (2026-09-22, prerelease), and v0.10.0 (2026-11-10). https://api.github.com/repos/kubernetes-sigs/kro/releases
- The kro.run version selector defaults to 0.10.0. The live page was unreachable from the verifier's sandbox, so this is SECONDARY-ONLY for the live page and VERIFIED from `website/docusaurus.config.ts` (`lastVersion: "0.10.0"`) and `website/versions.json` in the repository.
- The `Graph` API (`kro.run/v1alpha1`, kind `Graph`) is alpha, introduced in v0.10.0, disabled by default behind the `GraphKind` feature gate, with no compatibility guarantee: "The API and its behavior may change between releases without a compatibility guarantee." https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/graph/01-overview.md
- The gate controls only the Graph controller: "ResourceGraphDefinitions and their instances behave the same whether it is on or off." https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/advanced/02-feature-gates.md
- A Graph "does not generate a new API, has no schema, and has no instances", has five node kinds (`template`, `ref`, `def`, `patch`, `graph`), and applies resources by impersonating a ServiceAccount in the Graph's namespace.
- Enabling Graph needs a manual CRD apply because "Helm does not install or update CRDs on `helm upgrade`", plus the `--controller-namespace` and `--controller-service-account` flags and RBAC that includes the `impersonate` verb.
- The RGD controller now routes through the graph engine and issues immutable `GraphRevision` objects, while RGD stays a separate, non-deprecated Kind: "it does not replace or deprecate the RGD Kind". https://github.com/kubernetes-sigs/kro/blob/v0.10.0/docs/design/proposals/graph.md (the file's own header warns that parts may drift from the code).
- A Graph has no revision history: "kro does not create GraphRevision objects for Graphs", and kro sets no owner references on resources a Graph creates. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/graph/05-status-and-lifecycle.md

### Tuning defaults at v0.10.0

- Defaults are 1 dynamic-controller worker, a 36000 s (10 hour) resync, and 20 queue retries. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/advanced/03-controller-tuning.md
- The rate limiter combines per-item exponential backoff (200 ms minimum, 1000 s maximum) with a bucket of 10 events per second and burst 100. API client defaults are QPS 100 and burst 150.
- The instance requeue interval defaults to 3 s and backs off exponentially, "doubling each time up to a cap of five minutes", resetting on progress. At v0.9.4 the same setting reads "Fixed delay for delayed instance requeues when kro is waiting for resources, readiness, or deletion to settle". The change to exponential backoff is the dossier's inference from comparing the two pages.
- New or newly recorded settings are `config.watchSyncTimeout` (30 s, also `--watch-sync-timeout`, release-note PR 1463), `config.graphConcurrentReconciles` (1), `config.applyConcurrency` (20), `config.rgd.maxCollectionSize` (1000), `config.rgd.maxCollectionDimensionSize` (10), and `config.celCostLimit` (0, disabled).
- The shared single queue is a documented design principle, with a note that "the shared queue could be replaced with per-RGD queues in future versions".
- Not verified: that the rate-limiter defaults are unchanged since v0.9.4 beyond the resync, retry, concurrency, QPS, and burst lines.

### Instance conditions and state

- RGD instances carry four built-in conditions: `InstanceManaged`, `GraphResolved`, `ResourcesReady`, and the root `Ready` ("true when the three above are true"). https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/04-status-conditions.md
- The Instances page says to rely only on `Ready`: "kro reserves the right to add, remove, or modify sub-conditions without breaking compatibility". https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/06-instances.md
- The Instances page lists `state` as ACTIVE, IN_PROGRESS, DELETING, ERROR, while the Schema page lists ACTIVE, IN_PROGRESS, FAILED, DELETING, ERROR, so the documentation disagrees with itself about FAILED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/02-schema.md
- If an RGD declares its own `conditions:` block, the built-ins are filtered off the wire (`.status.conditions[]` shows only the author's) and stay readable through `runtime.condition`, but `status.state` stays kro-driven. kro stamps `lastTransitionTime` and `observedGeneration` on author conditions.
- A failed condition expression sets the instance state to Error, while an expression whose data is not yet available is "skipped for that reconcile without setting `state: Error`".
- The annotation `kro.run/reconcile: suspended` suspends reconciliation of one instance, for manual debugging only.
- Not verified: condition names against Go source; only the docs pages were read.

### Dependency graph and readiness

- Every CEL reference is a dependency edge, including references written with the optional operator, which "still makes the resource depend on `deployment`". Creation follows topological order, deletion follows the reverse, cycles are rejected, and the order is published in `status.topologicalOrder`. Resources that reference only `schema` are created in parallel. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/expressions/03-dependencies-ordering.md
- `readyWhen` may reference only the resource itself (by id) or `each`, and must return a boolean. Without it, "Resources are ready once created and all their CEL expression references resolve". For collections it applies to the whole collection. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/02-readiness.md
- In an RGD, "all resources that depend on it must wait until it's ready". In a Graph, a node "does not wait for the upstream node's `readyWhen` conditions", so `readyWhen` only drives Graph status, and the docs show gating by referencing a field that exists only when the upstream is healthy.
- `readyWhen` is accepted on `template`, `ref`, and `def` nodes and rejected on `patch` and `graph` nodes. `includeWhen` is accepted on `template`, `ref`, `def`, and `patch` nodes.
- `includeWhen` controls whether a resource exists, and skipping a resource skips every dependent. The docs warn that using volatile upstream status causes the graph to "flip-flop". https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/01-conditional-creation.md
- The v0.10.0 notes include a fix that errors on an `includeWhen` that can never resolve (PR 1448).
- `forEach` with several iterators forms a cartesian product, an empty iterator yields zero resources, and iterators cannot depend on each other. Collections are capped at 1000 resources by default, and "collections that exceed this limit will get stuck during deletion". A reference to a collection waits for it to be "fully reconciled and ready". In a Graph, nodes apply serially in topological order while `forEach` items apply in parallel. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/03-collections.md
- kro waits for fields referenced from `schema.spec` to have values: "By referencing them, you are declaring a hard dependency that the fields must exist."

### Status schema

- RGD `spec.schema.status` maps field names to CEL expressions, and the generated CRD gives them "strongly-typed schemas", not arbitrary objects. kro adds `conditions` and `state` to every instance status, and `state` is reserved: kro overrides any user definition.
- Authors build conditions with `runtime.newCondition` (keys `type`, `status`, `reason`, `message`). One `conditions:` entry can return a list, so the number of conditions can track collection size. Custom conditions cannot reference each other.
- RGD-level status has five conditions in v0.10.0: `Ready`, `GraphRevisionsResolved`, `GraphAccepted`, `KindReady`, and `ControllerReady`. RGD `status.state` is `Active` only when `GraphAccepted`, `KindReady`, and `ControllerReady` are True, otherwise `Inactive`. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/rgd/01-overview.md
- A Graph has three conditions (`Accepted`, `ResourcesConverged`, `Ready`) with reasons such as `WaitingForReadiness`, `DataPending`, `FieldManagerConflict`, and `ApplyFailed`, and a `status.managedResources` inventory capped at 5000 entries that drives pruning and deletion.
- By default kro does not set owner references on RGD instance resources.

### Crossplane v2 status propagation (limited)

- A composite resource has two conditions, Synced and Ready, and Ready is True when "the composite resource's composition function pipeline reports that all its composed resources are ready". If Crossplane cannot reconcile the composite, it "reports an error in the Synced condition". https://docs.crossplane.io/latest/composition/composite-resources/ (the "latest" docs path, version not displayed)
- In the v2.5 guide, `function-auto-ready` "automatically marks composed resources as ready when they're healthy". https://github.com/crossplane/docs/blob/master/content/v2.5/guides/scalable-composition.md
- SECONDARY-ONLY: a Draft design one-pager says a fatal function result sets the composite's `Synced` condition to False with the result's message, and that custom user-facing messages today need a user-defined status field. https://github.com/crossplane/crossplane/blob/main/design/one-pager-fn-claim-conditions.md (branch main, Status: Draft)
- Crossplane's latest release is v2.5.0, published 2026-11-24.
- Not verified: how a function's per-resource ready signal becomes the composite Ready condition. The function SDK, the `RunFunctionResponse` readiness field, and the v2 propagation code were not read.

### Governance and the future of Graph

- The kro README (v0.10.0 and main) says kro is "a subproject of Kubernetes SIG Cloud Provider", the Kubernetes community SIG Cloud Provider README lists it, and the repository lives under kubernetes-sigs. https://github.com/kubernetes-sigs/kro/blob/main/README.md
- The kro.run footer says "kro is a subproject of Kubernetes SIG Cloud Provider. Kubernetes is a CNCF graduated project." The second sentence is about Kubernetes and not about kro. This is SECONDARY-ONLY for the live page, with the string confirmed in `website/docusaurus.config.ts`.
- No first-party page read uses the words sandbox or incubating for kro. Absence from the CNCF landscape is UNVERIFIED, because the landscape lookup returned nothing usable.
- The OWNERS approvers are the SIG Cloud Provider leads plus `kro-maintainers`. On main (fetched 2026-11-26) the maintainers are a-hilaly, jakobmoellerdev, and jlbutler, with four reviewers (michaelhtm, cheeseandcereal, NicholasBlaskey, Skarlso) and seven emeritus maintainers. A commit on 2026-11-23 promoted cheftako to emeritus. https://github.com/kubernetes-sigs/kro/blob/main/OWNERS_ALIASES
- The design document says "RGD remains a user-facing Kind with unchanged external behavior, but internally it _is_ a graph", and that "Higher-level abstractions like RGD can be built _from_ Graph". KREP-006 `propagateWhen` and lifecycle signals are marked "Planned" or "Not yet implemented".
- The in-repo roadmap (`docs/v1-roadmap.md`) says "Last Updated 2026-04-03" and "v0.10 - ETA Mid-May 2026", so it lags the 2026-11-10 release. It does not list the Graph API or KREP-024 as a feature entry, though it mentions Graph Revisions and a Graph-node variables item. It says "It is not intended to be a timeline for planning purposes." Its open KREPs cover decorators, multi-cluster (KREP-012), lifecycles, propagation control, and versioning.
- v0.10.0 also lands KREP-009 versioning (PR 1461) and a per-resource deletion policy behind a gate (PR 1445).
- No promotion timeline from alpha and no statement on whether RGD will be expressed as a Graph at the API surface was found. Live kro.run roadmap pages and GitHub issue threads on the Graph direction were not read.

## Not covered by the dossier

- Production adopters, incidents, and scaling evidence for kro. The dossier did not search for them, so this ingest adds no example pages for named adopters or incidents.
- The full v0.9.4 rate-limiter table, the Go source behind the condition names, and the Crossplane function SDK path.

## Pages this source informs

[entities/kro](../entities/kro.md), [examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md), [examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen](../examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen.md), [findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api](../findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api.md), [comparisons/ordering-models-flux-argo-cd-kro-crossplane](../comparisons/ordering-models-flux-argo-cd-kro-crossplane.md), [comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog](../comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog.md), [findings/immature-abstractions-in-the-control-plane-ecosystem](../findings/immature-abstractions-in-the-control-plane-ecosystem.md)
