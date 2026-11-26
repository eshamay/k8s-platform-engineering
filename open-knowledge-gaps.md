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
- [[#kubernetes-v136-staleness-mitigation-mechanisms-and-metrics]] — open, unassigned
- [[#named-end-user-case-study-of-convergence-trouble]] — open, unassigned
- [[#kro-released-version-tuning-defaults-and-instance-conditions]] — open, unassigned
- [[#flux-helm-controller-override-manager-and-dry-run-failure-recovery]] — open, unassigned
- [[#config-connector-reconcile-interval-and-drift-cadence]] — open, unassigned
- [[#production-incidents-from-drift-correction]] — open, unassigned
- [[#current-cluster-api-machinehealthcheck-behavior]] — open, unassigned
- [[#kro-drift-issue-history-and-comparability-of-ten-hour-resyncs]] — open, unassigned
- [[#argo-cd-multi-cluster-hub-and-spoke-and-applicationsets]] — open, unassigned
- [[#secret-management-in-gitops-agents]] — open, unassigned
- [[#named-gitops-adopters-and-gitops-caused-outages]] — open, unassigned
- [[#config-connector-and-ack-behavior-under-a-gitops-agent]] — open, unassigned
- [[#git-versus-oci-as-the-canonical-gitops-source]] — open, unassigned
- [[#how-argo-cd-config-connector-ack-and-cluster-api-key-resources-by-gvk]] — open, unassigned
- [[#informer-and-cache-behavior-keyed-by-gvr]] — open, unassigned
- [[#controller-runtime-v030-dynamic-mapper-claim-and-aggregated-discovery-rationale]] — open, unassigned
- [[#deprecated-api-scanners-and-crossplane-v2-gvks]] — open, unassigned
- [[#crd-scale-limits]] — open, unassigned
- [[#storageversionmigration-ga-details-in-kubernetes-v137]] — open, unassigned
- [[#crd-handling-in-cluster-api-config-connector-ack-and-backstage]] — open, unassigned
- [[#status-of-the-conversion-webhook-and-garbage-collection-problem]] — open, unassigned
- [[#contents-of-the-k8saf-admission-webhook-postmortems]] — open, unassigned
- [[#kro-status-schema-and-crossplane-v2-status-propagation]] — open, unassigned
- [[#kstatus-rules-for-combining-observedgeneration-and-conditions]] — open, unassigned
- [[#config-connector-and-argo-cd-status-semantics-beyond-health-checks]] — open, unassigned
- [[#where-observedgeneration-should-live]] — open, unassigned
- [[#generic-readiness-when-cluster-api-moves-from-ready-to-available]] — open, unassigned
- [[#named-case-studies-and-postmortems-for-status-problems]] — open, unassigned
- [[#server-side-apply-behavior-in-kro-ack-config-connector-and-helm-4]] — open, unassigned
- [[#flux-pre-dry-run-manager-takeover-flag-and-current-ssa-documentation]] — open, unassigned
- [[#best-default-conflict-policy-for-teams-running-gitops-and-in-cluster-controllers]] — open, unassigned
- [[#crossplane-v2-server-side-apply-behavior-and-external-writers]] — open, unassigned
- [[#cluster-api-field-ownership-rules-and-argo-cd-server-side-diff-stability]] — open, unassigned
- [[#mutating-admission-policy-release-status]] — open, unassigned
- [[#admission-behavior-of-crossplane-kro-argo-cd-config-connector-ack-cluster-api-and-gatekeeper]] — open, unassigned
- [[#kyverno-webhook-failure-modes-and-availability]] — open, unassigned
- [[#cel-cost-limits-and-per-request-budgets]] — open, unassigned
- [[#named-operator-failure-postmortems]] — open, unassigned
- [[#criteria-for-choosing-an-operator-framework-or-language]] — open, unassigned
- [[#operator-sdk-capability-levels-for-composition-based-operators]] — open, unassigned
- [[#argo-cd-and-config-connector-as-operators]] — open, unassigned
- [[#backstage-and-the-operator-pattern]] — open, unassigned
- [[#requeue-true-backoff-behavior-in-current-controller-runtime]] — open, unassigned
- [[#argo-cd-default-reconcile-interval-across-versions]] — open, unassigned
- [[#named-postmortems-of-runaway-reconcile-loops]] — open, unassigned

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
- **Possible resolution from [[sources/research-eventual-consistency-and-convergence]]:** Only marginally helpful. The dossier adds Flux Kustomization behavior that belongs in the trace: reconcile at `spec.interval`, immediate reconcile on a generation or source revision change, a server-side apply dry run for drift, `dependsOn` and `healthChecks` for readiness, and `retryInterval` for failures. It does not trace source-controller handoff, finalizers, or condition updates. See [[entities/flux]] and [[examples/flux-dependson-and-health-checks-gate-rollout]].
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Marginally helpful. The dossier shows part of the Flux flow for drift: kustomize-controller and helm-controller run a server-side apply dry-run each interval, and a failing dry-run (for example from field-manager conflicts) stops correction before apply. It does not trace source fetch, finalizers, or status conditions end to end. See [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]] and [[entities/flux]].
- **Possible resolution from [[sources/research-gitops-pull-based-delivery]]:** Only marginally helpful. The dossier names the Flux controllers (source, kustomize, helm, notification, image automation), says Kustomizations reconcile every 5 minutes and that bootstrap commits Flux's own manifests, and describes Argo CD's API server, repository server, and application controller. It does not trace the handoff between controllers, finalizers, or condition updates. See [[comparisons/flux-versus-argo-cd-architecture]] and [[entities/flux]].
- **Possible resolution from [[sources/research-gvk-and-gvr]]:** Only marginally helpful. The dossier shows one step of the trace that depends on API discovery: Flux Kustomization `dependsOn` and `healthChecks` reference resources by apiVersion and kind, so the kustomize-controller must resolve each GVK to a resource through discovery before it can apply or assess health. It does not trace source fetch, finalizers, or status conditions. See [[comparisons/missing-crd-handling-flux-versus-argo-cd]] and [[entities/flux]].
- **Possible resolution from [[sources/research-custom-resource-definition]]:** Only marginally helpful. The dossier adds one step to the trace for charts that ship CRDs: Helm will not upgrade or delete them, so Flux's HelmRelease `crds` policies (Skip, Create, CreateReplace) and `dependsOn` decide whether CRDs exist before dependent releases are applied. It does not trace the rest of the flow.
- **Possible resolution from [[sources/research-spec-status-split]]:** Only marginally helpful. The dossier explains the last stretch of the trace: the controller writes conditions and `observedGeneration` through the `/status` subresource, Flux reads `Ready`, `Reconciling`, and `Stalled`, and a lagging `observedGeneration` means the spec change is still pending. It does not trace source fetch or finalizers. See [[concepts/spec-status-split]] and [[examples/flux-helmrelease-status-records-attempts-and-health]].
- **Possible resolution from [[sources/research-server-side-apply-and-field-ownership]]:** Partly helpful for the apply step. The dossier shows that kustomize-controller applies with server-side apply and runs a dry-run each interval, that ownership is recorded in `managedFields` under the manager name, and that a failing dry-run (for example from a stale co-owner of a list entry) stops reconciliation. It does not trace source fetch, finalizers, or condition updates. See [[entities/flux]] and [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]].
- **Possible resolution from [[sources/research-admission-webhooks-and-cel]]:** Only marginally helpful. The dossier places admission (mutating webhooks, schema validation, validating webhooks, or in-process CEL policies) after authentication and authorization and before persistence, and notes that server-side dry-run passes through webhooks, so a missing `sideEffects` declaration can fail a Flux reconcile. It does not trace the full Git-to-Ready path. See [[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]].
- **Possible resolution from [[sources/research-operator-pattern]]:** Only marginally helpful. The dossier names Flux's five controllers (source, kustomize, helm, notification, image automation) and the controller-guideline rules that govern each hop, but it does not trace the handoff between them, finalizer registration, or condition updates. See [[examples/flux-splits-gitops-into-single-purpose-controllers]].
- **Possible resolution from [[sources/research-reconciliation-loop]]:** Marginally helpful. The dossier gives the Flux Kustomization loop timing (`interval`, `retryInterval`, `timeout`, `wait`, `healthChecks`, `dependsOn`, `prune`) and the controller-runtime requeue semantics that govern each hop, but it read only the first 100,000 characters of the Flux page and does not trace source-controller handoff, finalizer registration, or condition updates. See [[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]].

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
- **Possible resolution from [[sources/research-eventual-consistency-and-convergence]]:** Partly helpful. The dossier adds that a Crossplane composite resource is Ready only when its composition function pipeline reports every composed resource ready, and gives kro's controller numbers (single shared queue, backoff, token bucket, 20-retry cap) from unreleased docs. It could not read kro's instance semantics, so readiness comparison is still incomplete. See [[comparisons/retry-and-backoff-controls-across-tools]] and [[examples/kro-shared-queue-tunes-throughput]].
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Only marginally helpful. The dossier adds drift behavior on each side: Crossplane managed resources enforce `forProvider` with management policies and a pause annotation, while kro's dynamic controller resyncs instances every 10 hours through one shared rate-limited queue, and a drift bug in kro was closed in late 2025. It does not compare Composition functions with ResourceGraphDefinition graphs. See [[comparisons/drift-detection-mechanisms-across-tools]] and [[entities/kro]].
- **Possible resolution from [[sources/research-gitops-pull-based-delivery]]:** Only marginally helpful. The dossier shows that both Crossplane and kro sit beneath a GitOps agent and bring their own reconcile loops, that Crossplane needs custom health checks in Argo CD, and that kro validates CEL at creation time and composes with ACK and Config Connector. It does not compare Composition functions with ResourceGraphDefinition graphs. See [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]] and [[examples/crossplane-resources-hosted-by-argo-cd]].
- **Possible resolution from [[sources/research-gvk-and-gvr]]:** Partly helpful on the API-definition side. The dossier shows that both tools are GVK factories: a Crossplane XRD declares group, kind, plural, versions, and scope and is named `<plural>.<group>` with immutable group and names, while a kro RGD `schema` declares apiVersion, kind, and an optional group (default `kro.run`), converts a SimpleSchema to OpenAPI v3, and generates the CRD. It does not compare Composition functions with RGD graphs or readiness. See [[examples/xrd-and-rgd-declare-platform-gvks]] and [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]].
- **Possible resolution from [[sources/research-custom-resource-definition]]:** Partly helpful for the API-definition step only. The dossier compares how an XRD (OpenAPI v3 schema, scope options, conversion webhooks for breaking changes, immutable group and names) and a kro ResourceGraphDefinition (simple schema, CEL-inferred dependencies, definition-time validation) each generate a CRD. It does not compare execution models. See [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]].
- **Possible resolution from [[sources/research-spec-status-split]]:** Partly helpful on the status side only. A Crossplane XR reports `Synced` and `Ready`, with `Ready` meaning the function pipeline reports all composed resources ready, while kro pulls status from composed resources through CEL. kro's status schema was not read because its documentation URL returned 404. See [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]] and [[entities/kro]].
- **Possible resolution from [[sources/research-server-side-apply-and-field-ownership]]:** Marginally helpful, and only for Crossplane. The dossier shows that Crossplane propagates claim to composite resource to composed resources with server-side apply, which depends on merge markers in provider CRDs, and that moving to composition functions needed a managed-fields migration. The kro documentation returned empty content, so nothing is known about how kro applies composed resources. See [[examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions]].
- **Possible resolution from [[sources/research-operator-pattern]]:** Marginally helpful. The dossier frames both tools as replacements for a hand-written operator when a custom API is mostly composition: Crossplane through a function pipeline in a Composition, kro through CEL expressions that infer a dependency graph and generate a CRD and controller at runtime. It does not compare their execution models in depth, and the Crossplane composition concept page returned 404. See [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]].
- **Possible resolution from [[sources/research-reconciliation-loop]]:** Marginally helpful. The dossier describes the Crossplane managed resource loop (Observe, Create, Update, Delete, `Synced` and `Ready`, create tracking) and kro's single shared rate-limited queue with its retry and resync defaults from unreleased documentation. It does not compare Composition functions with ResourceGraphDefinition graphs. See [[entities/crossplane]], [[entities/kro]], and [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]].

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
- **Possible resolution from [[sources/research-eventual-consistency-and-convergence]]:** Partly helpful. The dossier gives kro's workqueue and client rate limits (default one worker, token bucket 10 per second with burst 100, QPS 100 with burst 150), explains Kubernetes v1.36 staleness metrics, and describes leader election for multi-replica controllers. It has no Flux or Crossplane sharding data. See [[examples/kro-shared-queue-tunes-throughput]], [[findings/duplicate-work-from-replicas-without-leader-election]], and [[concepts/informers-reflectors-and-workqueues]].
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Partly helpful on cost. The dossier explains that external-API controllers use long resyncs to limit API cost (ACK about 10 hours with per-kind overrides, kro 10 hours with a single rate-limited queue and one worker by default) and that Argo CD's refresh reads only the Kubernetes API and Git. It has no Flux or Crossplane sharding data. See [[decisions/choosing-a-drift-check-interval-for-external-resources]] and [[findings/cost-of-constant-reconciliation]].
- **Possible resolution from [[sources/research-gitops-pull-based-delivery]]:** Marginally helpful. The only scale datum is Crossplane's guidance to raise the Argo CD Kubernetes client QPS to 300 because of the many CRDs. It has no sharding or concurrency data for Flux or Crossplane controllers. See [[examples/crossplane-resources-hosted-by-argo-cd]].
- **Possible resolution from [[sources/research-gvk-and-gvr]]:** Marginally helpful. The dossier shows that aggregated discovery (stable in v1.30) collapses per-group-version discovery requests into one, which lowers client startup cost, and that mappers rebuild on lookup failure behind a rate limit. It does not cover informer caches keyed by GVR, workqueues, or sharding. See [[concepts/api-discovery-and-restmapper]] and [[comparisons/restmapper-strategies-static-deferred-and-dynamic]].
- **Possible resolution from [[sources/research-custom-resource-definition]]:** Partly helpful on the apiserver side. Custom resources share etcd and watch-cache paths with built-in objects, and Ant Group's 10,000-plus node write-up cut apiserver memory from roughly 400 GB to 100 GB by serving lists from the watch cache, with label indexing and etcd splitting. It has no controller sharding or workqueue data and no CRD-specific numbers. See [[examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd]].
- **Possible resolution from [[sources/research-spec-status-split]]:** Marginally helpful. Writing status through the main resource bumps generation and triggers extra reconciles, which is avoidable load on the controller and API server. The dossier gives no scale numbers. See [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]].
- **Possible resolution from [[sources/research-server-side-apply-and-field-ownership]]:** Marginally helpful. The dossier notes that GET-modify-PUT incurs an optimistic-concurrency retry cost when many actors update one object, which server-side apply avoids. It gives no sharding or workqueue data. See [[comparisons/client-side-apply-versus-server-side-apply]].
- **Possible resolution from [[sources/research-admission-webhooks-and-cel]]:** Marginally helpful. Every matching write blocks on webhook calls (default timeout 10 seconds), so a slow webhook adds latency to the whole write path, and in-process CEL has a comparatively small latency impact according to KEP-3488. The dossier gives no measurements. See [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]].
- **Possible resolution from [[sources/research-operator-pattern]]:** Marginally helpful. The dossier restates the controller guidelines (shared informers, rate-limited workqueues processing one key at a time, waiting for cache sync) and warns that blocking on errors inside the loop stalls other objects, but it has no sharding, concurrency, or scale numbers. See [[findings/blocking-on-errors-inside-the-sync-loop-stalls-every-other-object]] and [[findings/mutating-objects-from-a-shared-cache-or-reading-an-unsynced-cache-corrupts-reconcile-input]].
- **Possible resolution from [[sources/research-reconciliation-loop]]:** Partly helpful. The dossier gives kro's shared queue, default of 1 worker, token bucket of 10 events per second, 20-retry cap, and client QPS 100 with burst 150, and notes Flux jitter and Argo CD jitter, plus the controller-runtime rate-limited workqueue. It has no sharding data and no Crossplane concurrency data. See [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]].

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
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Largely helpful. The dossier covers Argo CD `ignoreDifferences` (JSON pointer, JQ path, `managedFieldsManagers`), Flux `driftDetection.ignore` and the `ssa` annotation, and Crossplane `managementPolicies` with Observe adoption and the pause annotation. ACK adoption was not read. See [[comparisons/exemption-and-ignore-controls-across-tools]].


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
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Partly helpful. ACK defaults to about 10 hours after `ResourceSynced` with per-kind overrides. Crossplane's poll interval is configurable but its default is still not stated, and the Cluster API source is the v0.4 book. See [[comparisons/drift-detection-mechanisms-across-tools]].


## Kubernetes v1.36 staleness mitigation mechanisms and metrics — status: open

- **Question:** What are the actual feature names, mechanisms, and metric names in the Kubernetes v1.36 staleness mitigation work, and how do they change the guidance in [[findings/stale-cache-and-double-action]]?
- **Why it matters:** The dossier read only the first 100,000 characters of the blog post and its summary of the mitigations was generic, so the wiki cannot yet say how upstream makes cache lag observable.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the v1.36 blog post and the linked KEPs directly.
  - [ ] Update [[concepts/informers-reflectors-and-workqueues]] and [[findings/stale-cache-and-double-action]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** staleness, informers, v1-36, verification

## Named end-user case study of convergence trouble — status: open

- **Question:** Is there a named-company case study or primary postmortem in which retry amplification, stale caches, or slow convergence in a Kubernetes controller caused an incident?
- **Why it matters:** The dossier found none, and its only retry-storm postmortem is a secondary vendor-blog account of a GitHub incident that did not involve Kubernetes. See [[findings/retry-storms-and-unbounded-retries]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Locate GitHub's primary postmortem and judge whether the secondary account matches it.
  - [ ] Search for Kubernetes controller incident reports and conference talks.
  - [ ] Add `findings/` or `examples/` pages for each documented incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, retries, case-study

## kro released-version tuning defaults and instance conditions — status: open

- **Question:** Do the kro controller tuning defaults match the released versions, and what status conditions and per-instance reconcile semantics does kro expose?
- **Why it matters:** The numbers in [[examples/kro-shared-queue-tunes-throughput]] come from unreleased "next" docs, and the instances concept page returned empty content.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the released kro tuning and instances documentation.
  - [ ] Update [[entities/kro]] and [[comparisons/retry-and-backoff-controls-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, verification, conditions

## Flux helm-controller override-manager and dry-run failure recovery — status: open

- **Question:** Does official Flux documentation confirm the `--override-manager` flag, its availability since helm-controller v1.5.0, and the recommended recovery when the server-side dry-run fails on a conflicting field manager?
- **Why it matters:** The only source is a community reply, and the dry-run failure stops all drift correction. See [[findings/field-ownership-blocks-drift-correction]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the helm-controller documentation and release notes.
  - [ ] Check the linked Argo CD issue 17717 and Kubernetes issue 130292.
  - [ ] Update [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, helm, server-side-apply, verification

## Config Connector reconcile interval and drift cadence — status: open

- **Question:** What are Config Connector's default reconcile interval and drift-check cadence for direct, Terraform-based, and DCL-based controllers?
- **Why it matters:** The controller-types page says nothing about cadence, so the drift comparison has an unconfirmed row. See [[comparisons/drift-detection-mechanisms-across-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector reconcile-interval and state-into-spec documentation.
  - [ ] Fill the Config Connector row in [[comparisons/drift-detection-mechanisms-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, intervals, verification

## Production incidents from drift correction — status: open

- **Question:** Which named companies run drift-correcting controllers in production, and has any published postmortem described a revert loop, a blocked correction, or a remediation storm?
- **Why it matters:** The dossier found no named adopters or incident accounts, so the pitfalls rest on documentation and issue threads. See [[findings/controllers-fighting-over-fields-cause-revert-loops]] and [[findings/remediation-can-amplify-an-outage]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search for conference talks and postmortems on GitOps revert loops and Cluster API remediation.
  - [ ] Add `examples/` or `findings/` pages for each documented incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, drift, case-study

## Current Cluster API MachineHealthCheck behavior — status: open

- **Question:** How does MachineHealthCheck behave in current Cluster API releases, including remediation templates, newer fields, and the semantics of `maxUnhealthy`?
- **Why it matters:** The dossier read the v0.4 book only. See [[examples/cluster-api-machine-health-check-replaces-failed-nodes]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Cluster API book.
  - [ ] Update [[entities/cluster-api]] and [[findings/remediation-can-amplify-an-outage]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, remediation, verification

## kro drift issue history and comparability of ten-hour resyncs — status: open

- **Question:** What is the true history of kro issue 753 (reported bug, duplicate of issue 323, closed 2025-11-04), and are ACK's 10-hour resync and kro's 10-hour resync comparable mechanisms (informer resync versus explicit requeue)?
- **Why it matters:** The digest of the issue was internally inconsistent, and the comparison table treats the two figures side by side. See [[comparisons/drift-detection-mechanisms-across-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read issue 753, issue 323, and the fixing commits directly.
  - [ ] Read the kro and ACK source for how the resync is scheduled.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, ack, resync, verification

## Argo CD multi-cluster hub-and-spoke and ApplicationSets — status: open

- **Question:** How does Argo CD handle hub-and-spoke multi-cluster delivery (pull versus push from a central instance), and how do ApplicationSets generate applications across a fleet?
- **Why it matters:** The dossier's AWS multi-cluster GitOps article returned only site navigation, so the fleet story for Argo CD is missing, and "pull" is less clear when one central Argo CD instance reaches into many clusters.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD ApplicationSet and cluster-management documentation.
  - [ ] Compare against Flux fleet layouts in [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, multi-cluster, applicationset

## Secret management in GitOps agents — status: open

- **Question:** How do Argo CD and Flux handle secrets (SOPS, KMS, external secret operators), and what are the failure modes?
- **Why it matters:** The dossier says Flux decrypts SOPS and KMS secrets in the controller but did not read Argo CD's secret-management page, so the comparison is one-sided.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read Argo CD's secret management documentation and the Flux SOPS guide.
  - [ ] Add a comparison page under `comparisons/`.
- **Drafted by:** agent on 2026-11-25
- **Tags:** secrets, sops, argo-cd, flux

## Named GitOps adopters and GitOps-caused outages — status: open

- **Question:** Which named organizations run pull-based GitOps at scale, and what outages or near-misses has it caused (bad prune, runaway sync, credential compromise of the agent)?
- **Why it matters:** The dossier found no named production case studies, scale figures, or postmortems, so pitfalls on the GitOps pages rest on documentation warnings.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect CNCF end-user case studies, ADOPTERS files, and conference talks.
  - [ ] Write `examples/` pages for each documented adopter and add evidence to the pitfall findings.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, postmortems, gitops

## Config Connector and ACK behavior under a GitOps agent — status: open

- **Question:** What happens to cloud resources when a GitOps agent prunes a Config Connector or ACK object, and how do deletion and abandon policies interact with Argo CD prune and Flux garbage collection?
- **Why it matters:** The dossier covered neither ACK specifics nor Config Connector deletion and abandon behavior, yet pruning a custom resource can delete real infrastructure.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector deletion policy and ACK adoption and deletion documentation.
  - [ ] Update [[comparisons/deletion-policies-across-gitops-and-provider-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, ack, deletion, prune

## Git versus OCI as the canonical GitOps source — status: open

- **Question:** Do independent sources show measurable security or operational benefits from signed OCI artifacts over direct Git pulls, and when does Argo CD support equivalent flows?
- **Why it matters:** The only evidence in the dossier is a vendor reference architecture, and Flux and Argo CD documentation frame the choice differently. See [[decisions/git-versus-oci-as-the-canonical-source]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find independent write-ups or security reviews of OCI-based Flux delivery.
  - [ ] Check Argo CD's OCI source support in current documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** oci, git, supply-chain

## How Argo CD, Config Connector, ACK, and Cluster API key resources by GVK — status: open

- **Question:** How do Argo CD's resource tracking, Config Connector, ACK, and Cluster API identify and prune resources by GVK, especially across API version changes?
- **Why it matters:** The dossier read no source on this, and the answer determines whether an upstream API version removal or a CRD version change orphans or mis-prunes resources under these tools. See [[concepts/gvk-and-gvr]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Argo CD documentation on resource tracking and pruning across API versions.
  - [ ] Find Config Connector, ACK, and Cluster API documentation on CRD version handling.
  - [ ] Update [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** gvk, argo-cd, config-connector, ack, cluster-api

## Informer and cache behavior keyed by GVR — status: open

- **Question:** How do informers and client caches key their watches and stores by GVR or GVK, and what happens to them when a CRD is added, removed, or changes served versions?
- **Why it matters:** The dossier's source on clients and caches returned empty content, so cache behavior is uncovered. See [[concepts/informers-reflectors-and-workqueues]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find controller-runtime and client-go documentation on informer keying and CRD lifecycle.
  - [ ] Write a finding or update [[concepts/informers-reflectors-and-workqueues]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** gvr, informers, cache

## controller-runtime v0.3.0 dynamic mapper claim and aggregated discovery rationale — status: open

- **Question:** Do the controller-runtime release notes confirm that the dynamic, rate-limited RESTMapper became the default in v0.3.0, and what design rationale lies behind aggregated discovery?
- **Why it matters:** The v0.3.0 claim comes from a summarized issue thread, and no KEP for aggregated discovery was found, so the rationale rests on user-facing docs. See [[findings/stale-restmapper-hides-newly-installed-crds]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Check controller-runtime v0.3.0 release notes.
  - [ ] Locate the aggregated discovery KEP or design discussion.
- **Drafted by:** agent on 2026-11-25
- **Tags:** controller-runtime, restmapper, discovery

## Deprecated API scanners and Crossplane v2 GVKs — status: open

- **Question:** How do deprecation scanners such as pluto and kubent detect removed GVKs, and how do Crossplane v2 namespaced composite resources change the GVKs that XRDs and claims create compared with v1 claims?
- **Why it matters:** Both were seen only as search results or passing mentions in the dossier. See [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]] and [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read pluto and kubent documentation.
  - [ ] Read Crossplane v2 documentation on namespaced composite resources.
- **Drafted by:** agent on 2026-11-25
- **Tags:** deprecation, crossplane, gvk

## CRD scale limits — status: open

- **Question:** What are the authoritative limits on the number of CRDs per cluster, custom resources per type, and apiserver memory per CRD, and is the roughly 1.5 MB object limit from a secondary source correct?
- **Why it matters:** No source read gives official numbers, and the object-size figure comes from one independent explainer. See [[findings/etcd-scale-limits-of-the-shared-store]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read official scalability documentation and SIG API Machinery material.
  - [ ] Confirm the etcd request-size default against etcd documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crd, scale, etcd

## StorageVersionMigration GA details in Kubernetes v1.37 — status: open

- **Question:** What are the exact fields of the StorageVersionMigration API in v1.37, and does migration trigger automatically or only when a user creates the object?
- **Why it matters:** The GA claim rests on one truncated blog extract. See [[concepts/crd-versioning-and-storage-migration]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the KEP and v1.37 release notes.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crd, versioning, storage-migration

## CRD handling in Cluster API, Config Connector, ACK, and Backstage — status: open

- **Question:** How do Cluster API, Config Connector, and ACK handle CRD versioning contracts, very large CRDs, and controller scoping, and how does Backstage consume CRDs?
- **Why it matters:** The CRD dossier did not cover them because its searches returned nothing, so no entity pages were extended and no Backstage page was created. See [[entities/cluster-api]], [[entities/config-connector]], and [[entities/ack]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's API versioning and CRD installation documentation.
  - [ ] Find Backstage Kubernetes plugin documentation on custom resources.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, config-connector, ack, backstage, crd

## Status of the conversion webhook and garbage collection problem — status: open

- **Question:** Is the problem in which a down CRD conversion webhook stalls the garbage collector (issue 110720, a duplicate of 101078) fixed in current Kubernetes releases?
- **Why it matters:** The issue was closed as a duplicate and the dossier does not know the outcome. See [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read issue 101078 and the partial informer sync work.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crd, conversion, garbage-collection

## Contents of the k8s.af admission webhook postmortems — status: open

- **Question:** What do the linked postmortems on admission webhook outages, such as the 2019 Jetstack post and the Airbnb KubeCon NA 2020 talk, actually report?
- **Why it matters:** The dossier read only index entries. See [[findings/admission-webhook-outages-are-a-recurring-failure-class]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Open and summarize the linked posts.
- **Drafted by:** agent on 2026-11-25
- **Tags:** webhooks, postmortems

## kro status schema and Crossplane v2 status propagation — status: open

- **Question:** How do kro ResourceGraphDefinitions define and populate instance status, and how does Crossplane v2 propagate readiness from a function pipeline into composite status?
- **Why it matters:** The dossier read only the kro overview (the RGD URL returned 404) and not the Crossplane composition-function documentation. See [[entities/kro]] and [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Fetch the kro ResourceGraphDefinition docs and the Crossplane composition-function docs.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, crossplane, status

## kstatus rules for combining observedGeneration and conditions — status: open

- **Question:** Exactly how does kstatus combine `observedGeneration`, `Ready`, `Reconciling`, and `Stalled` to produce InProgress, Current, or Failed?
- **Why it matters:** The dossier's summary of the package page was brief. The precise rules explain the premature-readiness race. See [[entities/kstatus]] and [[findings/premature-readiness-in-kstatus-based-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the cli-utils source or documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kstatus, conditions

## Config Connector and Argo CD status semantics beyond health checks — status: open

- **Question:** What conditions and generation tracking do Config Connector resources publish, and how does Argo CD interpret status beyond its health checks?
- **Why it matters:** No primary source on Config Connector was fetched and Argo CD was read only for health. See [[entities/config-connector]] and [[entities/argo-cd]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource status documentation and Argo CD's resource tracking documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, argo-cd, status

## Where observedGeneration should live — status: open

- **Question:** Should `observedGeneration` live at the top level of status, on each condition, or both, given that the conventions say per condition while Flux and Cluster API use a top-level field?
- **Why it matters:** Consumers need one rule to detect stale status. See [[comparisons/observedgeneration-top-level-versus-per-condition]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the final 15,000 characters of the API conventions and the Flux and Cluster API contract documents.
- **Drafted by:** agent on 2026-11-25
- **Tags:** observedgeneration, conditions

## Generic readiness when Cluster API moves from Ready to Available — status: open

- **Question:** How should generic tools such as Flux and kstatus judge Cluster API objects now that Cluster API is replacing `Ready` with `Available`?
- **Why it matters:** Flux added CEL health checks, but a general answer is unresolved. See [[findings/premature-readiness-in-kstatus-based-tools]] and [[entities/cluster-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API condition-transition proposal and Flux CEL health check documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, kstatus, flux

## Named case studies and postmortems for status problems — status: open

- **Question:** Are there named end-user case studies or postmortems about reconcile loops, stale status, or false readiness caused by status handling?
- **Why it matters:** The dossier found only project docs and issues. See [[findings/misleading-readiness-and-stale-status]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search conference talks and public postmortems.
- **Drafted by:** agent on 2026-11-25
- **Tags:** case-studies, postmortems, status

## Server-side apply behavior in kro, ACK, Config Connector, and Helm 4 — status: open

- **Question:** How do kro, ACK, Config Connector, and Helm 4 set field managers, force conflicts, and reconcile fields owned by other controllers, and does Helm 4.0.0 really enable server-side apply by default for new releases?
- **Why it matters:** The dossier could not read a primary source for any of them: the kro page returned empty content, no ACK or Config Connector page was found, and the Helm 4 default rests on one personal blog. See [[comparisons/ssa-conflict-policy-across-tools]] and [[entities/helm]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's documentation or source for field manager names and force behavior.
  - [ ] Find the Helm 4 release notes and the upgrade behavior for releases created with client-side apply.
  - [ ] Add rows to [[comparisons/ssa-conflict-policy-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** server-side-apply, kro, ack, config-connector, helm

## Flux pre-dry-run manager takeover flag and current SSA documentation — status: open

- **Question:** What are the shipped semantics of the kustomize-controller flag proposed in issue 1722 (`--override-manager-before-dry-run`), delivered through PR 1747, and how does current Flux documentation describe `--override-manager`?
- **Why it matters:** The dossier read only the issue thread, and the final flag name and semantics should be checked before anyone relies on them. See [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read kustomize-controller PR 1747 and the current Kustomization documentation.
  - [ ] Update [[entities/flux]] and [[findings/field-ownership-blocks-drift-correction]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, server-side-apply, verification

## Best default conflict policy for teams running GitOps and in-cluster controllers — status: open

- **Question:** What default conflict policy should a platform team choose when a GitOps tool and in-cluster controllers write the same objects, given that the Kubernetes maintainers advise controllers to force and CD tools to surface conflicts while Argo CD and Flux both force?
- **Why it matters:** The dossier says its sources do not settle the question, and the answer decides whether revert loops or blocked automation are the more likely failure. See [[decisions/force-conflicts-or-surface-them-to-humans]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find practitioner write-ups or SIG API Machinery discussion of parsing `managedFields` to ignore conflicts.
  - [ ] Find a named adopter's policy for mixed GitOps and controller ownership.
- **Drafted by:** agent on 2026-11-25
- **Tags:** server-side-apply, gitops, conflict, decision

## Crossplane v2 server-side apply behavior and external writers — status: open

- **Question:** How does Crossplane v2 use server-side apply compared with the v1.20 alpha page, and is Crossplane issue 7453 (an external controller's forced field disappearing from a composite resource on v2.3.1) a real bug or a `managedFields` visibility mistake?
- **Why it matters:** The dossier read only the v1.20 concept page and an unresolved, stale issue whose claim a maintainer could not reproduce. See [[findings/managedfields-are-hidden-from-kubectl-output-by-default]] and [[entities/crossplane]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Crossplane documentation on server-side apply and composition functions.
  - [ ] Check whether issue 7453 was reproduced or closed.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, server-side-apply, verification

## Cluster API field ownership rules and Argo CD Server-Side Diff stability — status: open

- **Question:** Which fields does the Cluster API topology controller own compared with infrastructure and control plane providers, and is Argo CD Server-Side Diff stable since 3.1.0 as one blog claims?
- **Why it matters:** The dossier read only the Cluster API pull request description and relied on a personal blog for the Argo CD stability claim. See [[examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects]] and [[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API book on ClusterClass topology and server-side apply.
  - [ ] Read the Argo CD diff-strategies documentation.
  - [ ] Check whether `kubectl` made server-side apply the default.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, argo-cd, server-side-diff, verification

## Mutating Admission Policy release status — status: open

- **Question:** Is MutatingAdmissionPolicy stable and enabled by default as of Kubernetes v1.36, as one documentation digest reports, or is it still beta?
- **Why it matters:** The digest could not be cross-checked against release notes and earlier knowledge places the feature at beta, so a tutorial could state the wrong status. See [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Check the Kubernetes v1.36 release notes and the live Mutating Admission Policy page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** mutating-admission-policy, verification

## Admission behavior of Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, and Gatekeeper — status: open

- **Question:** What webhooks and CEL validation do these tools ship or rely on, such as Crossplane's own conversion and validation webhooks, CRD-level CEL in composed APIs, kro's validation of generated CRDs, and Gatekeeper's policy model?
- **Why it matters:** The admission dossier found no primary source for any of them, so admission treatment of the platform tools is unknown. See [[concepts/admission-webhooks-and-cel]] and [[entities/crossplane]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's webhook and validation documentation.
  - [ ] Read a primary Gatekeeper source.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, kro, argo-cd, config-connector, ack, cluster-api, gatekeeper

## Kyverno webhook failure modes and availability — status: open

- **Question:** How does Kyverno configure its own webhook failurePolicy, and how does it behave when its pods are unavailable?
- **Why it matters:** Kyverno was documented only for its CEL policy types, so the resilience benefit of generated native policies is unquantified. See [[comparisons/kyverno-versus-native-validating-admission-policy]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Kyverno documentation on webhook configuration and availability.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kyverno, webhooks, availability

## CEL cost limits and per-request budgets — status: open

- **Question:** What are the exact CEL cost limits for CRD validation rules and admission policies, and what per-request budgets apply?
- **Why it matters:** Schema authors need the numbers to decide how tightly to bound lists and strings. See [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Kubernetes CRD validation rules documentation on cost estimation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cel, limits, crd

## Named operator failure postmortems — status: open

- **Question:** Which named organizations have published postmortems of operator failures such as stuck finalizers, reconcile storms, or CRD upgrade breakage, and what did they conclude?
- **Why it matters:** The operator-pattern dossier found no named-company case study, so its pitfall catalog rests on documentation. See [[concepts/operator-pattern]] and [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find published incident write-ups for operator outages and summarize them.
  - [ ] Link each to the matching finding page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** operators, postmortems, finalizers

## Criteria for choosing an operator framework or language — status: open

- **Question:** What criteria should a team use to choose among Kubebuilder, Operator SDK, Kopf, the Java Operator SDK, kube-rs, KubeOps, and Metacontroller, given that the CNCF white paper favors Go while the Kubernetes page lists many languages?
- **Why it matters:** No source in the dossier gives selection criteria. See [[entities/operator-sdk]] and [[entities/kube-rs]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find framework comparisons or maintainers' guidance.
  - [ ] Write a `comparisons/` page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** operators, frameworks, language

## Operator SDK capability levels for composition-based operators — status: open

- **Question:** How strictly do the five Operator SDK capability levels apply to non-Go or generic-composition operators such as kro and Crossplane?
- **Why it matters:** The dossier calls the level descriptions high level and unclear for these tools. See [[entities/operator-sdk]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Operator Framework documentation on scope of the levels.
  - [ ] Map each level to Crossplane and kro features if applicable.
- **Drafted by:** agent on 2026-11-25
- **Tags:** operators, maturity-model, crossplane, kro

## Argo CD and Config Connector as operators — status: open

- **Question:** How do Argo CD and Config Connector handle failures as operators, and do they follow the one-controller-per-concern guidance?
- **Why it matters:** The operator-pattern dossier fetched no page on either tool. See [[entities/argo-cd]] and [[entities/config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD and Config Connector architecture documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, config-connector, operators

## Backstage and the operator pattern — status: open

- **Question:** How does Backstage relate to the operator pattern, for example as a portal over operator-managed custom resources?
- **Why it matters:** No source in the wiki covers Backstage, so the platform-engineering layer above operators is missing. See [[concepts/operator-pattern]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Backstage documentation on Kubernetes and custom resource integration.
- **Drafted by:** agent on 2026-11-25
- **Tags:** backstage, platform-engineering

## Requeue true backoff behavior in current controller-runtime — status: open

- **Question:** Does `Result{Requeue: true}` requeue with rate-limited backoff or immediately, in the current controller-runtime source?
- **Why it matters:** The package reference says rate-limited, while a summary of issue 808 says immediate without backoff, and the field is deprecated. A tutorial or review based on the wrong reading would teach a hot loop or a slow retry. See [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read `reconcile.go` and the controller's requeue handling in the current controller-runtime source.
  - [ ] Check whether the deprecation notice names a replacement.
- **Drafted by:** agent on 2026-11-25
- **Tags:** controller-runtime, requeue, backoff

## Argo CD default reconcile interval across versions — status: open

- **Question:** What is the Argo CD default Git polling interval in each recent release, given that stable documentation says 120 seconds plus 60 seconds of jitter and older material says 3 minutes?
- **Why it matters:** Drift and change latency depend on the interval, and mixed numbers in the wiki can mislead. See [[comparisons/reconcile-cadence-and-off-switches-across-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the `timeout.reconciliation` documentation for several releases.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, intervals

## Named postmortems of runaway reconcile loops — status: open

- **Question:** Which named organizations have published postmortems of a runaway or self-triggered reconcile loop, and what were the causes and fixes?
- **Why it matters:** The dossier found only guidance and no incident reports, so the self-triggered loop finding rests on secondary sources. See [[findings/self-triggered-reconcile-loops-generate-their-own-events]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search public postmortem collections and controller issue trackers for reconcile storms.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortems, hot-loop
