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
- [[#kro-and-cluster-api-idempotency-for-external-and-infrastructure-creates]] — open, unassigned
- [[#production-outcomes-of-adopt-or-create-versus-explicit-import]] — open, unassigned
- [[#postmortems-of-leaked-or-duplicated-cloud-resources-from-ambiguous-creates]] — open, unassigned
- [[#cache-narrowing-options-in-controller-runtime]] — open, unassigned
- [[#flux-shared-caches-and-crossplane-performance-guidance]] — open, unassigned
- [[#informer-and-cache-choices-of-kro-config-connector-ack-and-cluster-api]] — open, unassigned
- [[#primary-openai-kubernetes-outage-postmortem]] — open, unassigned
- [[#argo-cd-finalizer-variants-and-non-cascading-deletes]] — open, unassigned
- [[#flux-kustomization-finalizer-name-and-behavior]] — open, unassigned
- [[#resolution-of-crossplane-issue-7801-on-credential-protection]] — open, unassigned
- [[#how-ack-config-connector-and-kro-name-and-remove-their-finalizers]] — open, unassigned
- [[#cluster-api-issue-1514-on-blocking-deletion-with-a-finalizer-or-annotation]] — open, unassigned
- [[#how-kro-sets-ownership-and-labels-on-child-resources]] — open, unassigned
- [[#argo-cd-prunepropagationpolicy-and-resource-tracking-methods]] — open, unassigned
- [[#what-happens-when-blockownerdeletion-is-set-without-finalizers-permission]] — open, unassigned
- [[#crossplane-v2-namespaced-composites-and-managementpolicies-versus-garbage-collection]] — open, unassigned
- [[#keps-on-cross-namespace-ownership-and-garbage-collector-performance]] — open, unassigned
- [[#crossplane-v2-condition-behavior-and-the-fix-for-async-synced-signaling]] — open, unassigned
- [[#how-a-platform-should-choose-condition-polarity]] — open, unassigned
- [[#which-parts-of-the-config-connector-reconcile-status-design-shipped]] — open, unassigned
- [[#managementpolicies-feature-status-and-the-observeonly-to-policy-list-mapping]] — open, unassigned
- [[#adoption-and-orphaning-behavior-in-cluster-api-kro-and-controller-runtime-operators]] — open, unassigned
- [[#behavior-of-namespaced-v2-managed-resources-when-a-namespace-is-deleted-while-the-provider-is-down]] — open, unassigned
- [[#per-provider-external-name-defaults]] — open, unassigned
- [[#config-connector-conflict-handling-when-two-objects-target-one-cloud-resource]] — open, unassigned
- [[#claim-support-and-scope-in-crossplane-v2-xrds]] — open, unassigned
- [[#kro-graph-api-status-and-released-version-facts]] — open, unassigned
- [[#flux-handling-of-composite-resources-and-kro-instances]] — open, unassigned
- [[#clusterclass-maturity-and-the-managed-topologies-proposal]] — open, unassigned
- [[#scale-of-composite-resources-per-controller]] — open, unassigned
- [[#feature-parity-of-function-kro-with-standalone-kro]] — open, unassigned
- [[#crossplane-function-runner-architecture-history]] — open, unassigned
- [[#config-connector-and-ack-behavior-when-wrapped-by-compositions]] — open, unassigned
- [[#upjet-runtime-execution-model-and-cost]] — open, unassigned
- [[#config-connector-controller-kind-per-resource]] — open, unassigned
- [[#flux-and-argo-cd-handling-of-provider-managed-resources]] — open, unassigned
- [[#flux-source-controller-internals-and-artifact-serving-under-leader-election]] — open, unassigned
- [[#flux-sharding-in-production-and-the-helmchart-labeling-rule]] — open, unassigned
- [[#flux-image-automation-api-status-and-safe-promotion-policy]] — open, unassigned

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
- **Possible resolution from [[sources/research-idempotency]]:** Only marginally helpful. The dossier confirms that kustomize-controller runs a server-side apply dry-run each interval and that conflicting field ownership signals another actor, which fits the apply step of the trace. It does not trace source fetch, finalizers, or condition updates. See [[entities/flux]] and [[concepts/idempotency]].
- **Possible resolution from [[sources/research-finalizers]]:** Only marginally helpful. The dossier shows finalizer registration and teardown: Crossplane managed resources hold a finalizer until the external resource is gone, and kro keeps the instance finalizer while deleting in reverse dependency waves, but it does not trace source fetch or status conditions. See [[concepts/finalizers]] and [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]].
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Only marginally helpful. The dossier adds the garbage collector side of the trace: the controller sets an owner reference on each child, the garbage collector's dependency graph deletes dependents when the owner goes, and a lost reference breaks cascade. It does not trace Flux's source fetch, apply, or condition updates, and it says Flux prunes through an inventory and not through owner references. See [[concepts/owner-references-and-garbage-collection]] and [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful on the last step. The dossier shows that kustomize-controller waits for applied resources to become healthy (kstatus for compatible custom resources, CEL `healthCheckExprs` for others) before marking a Kustomization `Ready`, that Flux publishes `Ready`, `Reconciling`, and `Stalled` with `observedGeneration`, and that this gating unblocks `dependsOn` dependents. It does not trace source fetch or finalizers. See [[concepts/conditions]] and [[entities/flux]].
- **Possible resolution from [[sources/research-managed-resource]]:** Only marginally helpful. The dossier shows one downstream step, that a Flux prune of a managed resource object triggers the provider's delete of the cloud resource unless Delete is excluded from `managementPolicies`, and that Crossplane's reconciler phases are Connect, Observe, Create, Update, Delete. It does not trace source fetch, apply, or condition updates. See [[entities/flux]] and [[concepts/managed-resource]].
- **Possible resolution from [[sources/research-composite-resource]]:** Not helpful. The dossier read no Flux documentation and says nothing about Flux health checks, `dependsOn`, or CRD ordering with composites. It covers only the Argo CD interaction. A new gap, [[#flux-handling-of-composite-resources-and-kro-instances]], tracks this.
- **Possible resolution from [[sources/research-composition]]:** Only marginally helpful. The dossier adds Flux `dependsOn`, health checks, and pruning and Argo CD sync waves, hooks, and reversed prune order for the ordering and readiness steps of the trace. It does not trace source fetch, finalizers, or condition updates. See [[entities/flux]] and [[entities/argo-cd]].
- **Possible resolution from [[sources/research-provider]]:** Marginally helpful. The dossier describes the provider end of the trace for Crossplane: a `Provider` installs CRDs and a controller, a managed resource is reconciled by the observe, compare, act loop, and `Ready` and `Synced` conditions report the result. It says nothing about the Flux source fetch, finalizer registration for these objects, or the handoff from a GitOps agent. See [[concepts/provider]] and [[entities/crossplane]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Partly helpful. The dossier names the controller roles that the first half of the trace needs: the source controller fetches Git, OCI, Helm, and bucket content and serves it as tar.gz artifacts, the kustomize controller builds and applies it, the notification controller can trigger an immediate reconcile through a Receiver, and `dependsOn` and `healthChecks` gate readiness. It admits that source-controller internals were not covered and does not trace finalizer registration or condition updates. See [[entities/flux]] and [[examples/flux-notification-receivers-start-reconciliation-without-waiting-for-the-poll-interval]].

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
- **Possible resolution from [[sources/research-idempotency]]:** Marginally helpful, and only for Crossplane. The dossier covers Crossplane's managed resource idempotency (external names, `external-create-pending`, `managementPolicies`, `initProvider`) but could not read kro's instance and reconciliation pages, so kro's handling of repeated reconciliation and partial failure is unknown. See [[entities/crossplane]] and [[entities/kro]].
- **Possible resolution from [[sources/research-finalizers]]:** Partly helpful on the deletion side of the comparison only. The dossier shows that kro deletes composed resources in reverse dependency waves and that Crossplane has no equivalent ordering for namespace deletion (issue 7801), but it gives no resolution of which graph model suits which case. See [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]] and [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]].
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Partly helpful on the Crossplane side of deletion only. The dossier shows that composed resources are owned by their composite and that the composite deletion policy is Background, Foreground, or Pipeline, which gives Crossplane an explicit ordered-teardown knob. It could not read kro's instances page, so how kro owns and orders its children is still unknown. See [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]] and [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]].
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful on the status side. Crossplane fixes the meaning of `Synced` and `Ready` in the framework, while kro lets the RGD author define `readyWhen` and custom instance conditions in CEL, which hides kro's built-in conditions. kro's instance-level built-in names were not read. See [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]].
- **Possible resolution from [[sources/research-managed-resource]]:** Not helpful. The dossier covers the managed resource layer under compositions and says kro adoption and orphaning behavior was not read, so it cannot compare Compositions with kro.
- **Possible resolution from [[sources/research-composite-resource]]:** Largely helpful. The dossier reads the primary pages for both sides. Crossplane runs a pipeline of gRPC functions that receive observed state and return desired state, with CompositionRevisions that XRs can pin, while kro puts schema and implementation in one RGD, infers a DAG from CEL references, validates at creation, creates in topological order, deletes in reverse, gates dependents with `readyWhen`, and snapshots immutable GraphRevisions with no fallback. It also shows the two converging through `function-kro`. It gives no scale numbers and no incident evidence, and the v2 claim details and the kro Graph API remain unverified. See [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]], and [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]].
- **Possible resolution from [[sources/research-composition]]:** Partly helpful. The dossier traces Crossplane's three authoring models and kro's CEL-based RGD and states that no source compares them head to head, so the first-draft synthesis is in [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]]. kro's Readiness page and the Graph versus RGD readiness difference were not read.
- **Possible resolution from [[sources/research-provider]]:** Marginally helpful. A maintainer-authored Crossplane blog argues that Composition is what separates Crossplane from the cloud add-ons, and the Amazon EKS ACK guide points to kro for composing ACK resources. Neither is an independent head-to-head of Compositions and kro. See [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]] and [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Not helpful. The dossier says Flux comparisons with Crossplane and kro were not researched and that no source confirms Flux simply deploys their custom resources.

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
- **Possible resolution from [[sources/research-idempotency]]:** Marginally helpful. The dossier notes that Flux jitter and `retryInterval` and Argo CD's `maxDuration` limit retry load, and that many objects sharing one interval can spike API load. It has no informer, sharding, or concurrency data. See [[findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent]].
- **Possible resolution from [[sources/research-informers-reflectors-and-workqueues]]:** Partly helpful. The dossier explains the reflector, DeltaFIFO, indexer, and workqueue pipeline, the default limiter, cache memory growth, and relist behavior, and gives tool knobs: Flux `--concurrent` and Helm cache flags, Argo CD cluster sharding with processor counts and `GOMEMLIMIT`, and Crossplane `--max-reconcile-rate`. It has no Flux sharding data and no Crossplane performance guide. See [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]] and [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]].
- **Possible resolution from [[sources/research-finalizers]]:** Not helpful. The dossier names no adopter beyond the projects themselves, and it cannot supply scale data.
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Marginally helpful. The dossier describes how the garbage collector keeps a graph built from watch events on all resources, with queues and an absent-owner cache, but it gives no scale numbers or sharding data. See [[examples/the-garbage-collector-builds-a-dependency-graph-from-watch-events-and-sorts-references-into-three-classes]].
- **Possible resolution from [[sources/research-conditions]]:** Marginally helpful. The dossier notes that bumping `lastTransitionTime` on every reconcile adds API traffic, but it gives no scale numbers or sharding data. See [[findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat]].
- **Possible resolution from [[sources/research-managed-resource]]:** Partly helpful on the CRD side. The dossier gives numbers for the cost of one CRD per external resource type (roughly 2,000 CRDs for three clouds, more than 4 MiB of API server memory per CRD, about 300 group-versions to discover, GKE control planes unresponsive at about 680 CRDs) and the Crossplane v2 remedy of activation policies, plus Argo CD's client QPS of 300. It has no informer, workqueue, or sharding data for Flux or Crossplane controllers. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]] and [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]].
- **Possible resolution from [[sources/research-composite-resource]]:** Not helpful. The dossier says no page gives numbers for how many composites or children a single controller handles, and kro's tuning pages were not read. A new gap, [[#scale-of-composite-resources-per-controller]], tracks this.
- **Possible resolution from [[sources/research-composition]]:** Marginally helpful. The dossier gives function-call arithmetic for Crossplane (60-second poll, so 100 XRs with one function step make 100 calls per minute) and the Argo CD client QPS advice (50 by default, 300 suggested for many CRDs), but no informer or sharding detail. See [[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]].
- **Possible resolution from [[sources/research-provider]]:** Partly helpful for the API-server side of scale. The Crossplane blog reports that provider-aws installing more than 900 CRDs made the API server unresponsive for up to an hour during scale-up, and that provider families fix it by installing only the services in use. ACK avoids the problem with one controller per service. The dossier does not cover informer cache cost, workqueue rate limiting, or controller sharding. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]] and [[comparisons/provider-families-versus-per-service-controllers]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Largely helpful for Flux. The dossier explains that extra replicas are failover standbys because of leader election, that label-based sharding with `sharding.fluxcd.io/key` and `--watch-label-selector` adds capacity, that the Flux Operator automates shard setup, and that Morgan Stanley raised intervals and `--concurrent` at more than 500 clusters. It has no production sharding numbers and no Crossplane data. See [[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]] and [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]].

## Named production adopters of control-plane tools — status: open

- **Question:** Which named organizations run Crossplane, ACK, Config Connector, Cluster API, or kcp in production, and with what object counts?
- **Why it matters:** The dossier's use cases rest on vendor documentation and announcements, so adoption evidence is missing.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect CNCF project pages, ADOPTERS files, and KubeCon talks.
  - [ ] Write `examples/` pages for each documented adopter.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, crossplane, ack, kcp
- **Possible resolution from [[sources/research-composite-resource]]:** Partly helpful. The same self-reported adopters list adds Renault, Wellhub, Wildlife Studios, Consensys, Grafana Labs, VSHN, Millennium bcp, Continental, and Syntasso (Kratix) as users of composite resources for self-service platforms. The entries are unaudited one-liners and add no counts for composites. No adopter of kro, ACK, Config Connector, or Cluster API is named beyond AWS offering kro on EKS. See [[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]].
- **Possible resolution from [[sources/research-managed-resource]]:** Partly helpful. The Crossplane ADOPTERS list names Nike, Autodesk, SAP, Deutsche Kreditbank, IBM, Elastic, UiPath, VMware Tanzu, DB Systel, Nokia, and Akamai, with reported counts such as SAP's thousands of managed resources and Akamai's up to 200,000. The entries are self-reported one-liners and not verified case studies. See [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Marginally helpful. The Flux adopters page lists more than 200 organizations without use-case detail, and Morgan Stanley reports more than 500 clusters. No adopter of Crossplane, ACK, Config Connector, Cluster API, or kcp is added. See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].

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
- **Possible resolution from [[sources/research-composite-resource]]:** Largely helpful. The RGD overview and readiness pages explain that kro infers dependencies from CEL references into a DAG, records the order in `status.topologicalOrder`, creates in topological order and deletes in reverse, creates independent resources in parallel, and rejects cycles at definition time. `readyWhen` defines per-resource readiness and gates dependents in an RGD, but only reports health in the alpha `Graph` API. The kro row of the ordering comparison can now be filled, though the instance-level conditions remain unread. See [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]] and [[entities/kro]].
- **Possible resolution from [[sources/research-finalizers]]:** Partly helpful on deletion behavior. The dossier reads the Argo CD ApplicationSet deletion page, the Flux Kustomization reference (first 100 KB), the ACK deletion policy guide, and the Config Connector deletion page, all through a summarizing fetch, and it confirms retain and abandon defaults. It does not verify Flux's finalizer name. See [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].
- **Possible resolution from [[sources/research-composition]]:** Partly helpful. The Dependencies and Ordering page confirms that every CEL reference is a DAG edge (even with `?.`), creation is topological and deletion reversed, cycles fail validation, and kro waits for expressions to be resolvable. It says readiness gating differs between the RGD and the alpha Graph APIs but the Readiness page was not read. See [[entities/kro]].

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
- **Possible resolution from [[sources/research-idempotency]]:** Only marginally helpful. The Kustomization reference quote ("every ten minutes, the Kustomization runs a server-side apply dry-run") uses ten minutes as an example interval, and the dossier does not state a default or the 60-second minimum. See [[entities/flux]].

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
- **Possible resolution from [[sources/research-idempotency]]:** Partly closes the ACK adoption part. The dossier reads the ACK adoption guide (`adopt-or-create`, strict `adopt`, `adoption-fields`, Beta status), Config Connector acquisition by name, Crossplane's Observe-then-manage import flow, and SAP's explicit-intent design. It does not read Argo CD `ignoreDifferences` or Flux field managers. See [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]] and [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]].
- **Possible resolution from [[sources/research-managed-resource]]:** Largely helpful for Crossplane, ACK, and Config Connector. The dossier reads the Crossplane import guide and observe-only design document, ACK's read-only annotation, and Config Connector's acquire-by-name behavior and abandon annotation. It does not read Argo CD `ignoreDifferences` or Flux field managers. See [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]] and [[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]].


## Argo CD versus Flux head-to-head behavior — status: open

- **Question:** How do Argo CD and Flux compare in practice on drift correction, pruning, multi-tenancy, and failure behavior, according to neutral sources?
- **Why it matters:** The current comparison page merges separate documentation pages and is not a head-to-head analysis.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find practitioner comparisons and CNCF material.
  - [ ] Revise [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, argo-cd, comparison
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Marginally helpful. The only comparison read is a vendor blog (Devtron), whose claims on scale and the missing Flux UI are opinion, and the dossier says no neutral benchmark was found. See [[comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog]].

## Current Crossplane terminology versus the early claims-and-classes model — status: open

- **Question:** Which parts of Crossplane's 2018-era claims and resource classes design survive in the current composite resource, composition, and function model?
- **Why it matters:** The original announcement is still widely quoted, and its terminology may mislead readers of current documentation.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read current Crossplane docs on claims and compare them with the early blog post.
  - [ ] Update [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, terminology, history
- **Possible resolution from [[sources/research-composite-resource]]:** Partly helpful. The v1.20 claims page and the v2 upgrade guide show that claims are a namespaced stand-in for a cluster-scoped XR in v1 and that v2 makes XRs namespaced and removes claims for new-style XRDs, and that native patch-and-transform is removed in favor of function pipelines. Claim support in v2 is not stated precisely in a primary page, and the 2018 claims-and-classes announcement itself was not read. See [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]].

## Informer resync semantics — status: open

- **Question:** What does an informer resync period actually do in client-go and controller-runtime, and how does it differ from a relist against the API server?
- **Why it matters:** Tutorials say controllers re-list or resync periodically, but the dossier found no source that explains that resync replays cached state to handlers and does not refetch from the API server.
- **Owner:** unassigned
- **How to close:**
  - [ ] Walk through the client-go shared informer and reflector source.
  - [ ] Update [[concepts/informers-reflectors-and-workqueues]] and [[concepts/level-triggered-vs-edge-triggered]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** informers, resync, client-go
- **Possible resolution from [[sources/research-informers-reflectors-and-workqueues]]:** Marginally helpful. One source calls periodic resync a defense against reconciler bugs that is usually disabled, and the pitfalls blog lists misunderstanding it as a common error. No source explains what resync replays or whether it refetches from the API server. See [[decisions/keep-informer-resync-disabled-or-set-a-periodic-resync]].

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
- **Possible resolution from [[sources/research-informers-reflectors-and-workqueues]]:** Marginally helpful, for Crossplane only. Crossplane providers gained `--max-reconcile-rate` in 1.6 alongside `--poll-interval`, but no default value is stated and the current performance guide was not read. See [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]].
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
- **Possible resolution from [[sources/research-composite-resource]]:** Marginally helpful. The dossier reads v0.10.0 pages and lists the RGD conditions, and says the kro controller tuning docs were not read. It adds a version discrepancy, since a September 2026 blog cites v0.9.x. See [[#kro-graph-api-status-and-released-version-facts]].
- **Possible resolution from [[sources/research-conditions]]:** Marginally helpful. The dossier read the v0.10.0 RGD reference and the custom status conditions page, but the Instances page returned empty content, so the built-in instance condition names are still inferred. See [[entities/kro]].

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
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Marginally helpful. The Kustomization reference supports SOPS decryption with age, OpenPGP, and cloud KMS, but the dossier does not cover failure modes or Argo CD. See [[entities/flux]].

## Named GitOps adopters and GitOps-caused outages — status: open

- **Question:** Which named organizations run pull-based GitOps at scale, and what outages or near-misses has it caused (bad prune, runaway sync, credential compromise of the agent)?
- **Why it matters:** The dossier found no named production case studies, scale figures, or postmortems, so pitfalls on the GitOps pages rest on documentation warnings.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect CNCF end-user case studies, ADOPTERS files, and conference talks.
  - [ ] Write `examples/` pages for each documented adopter and add evidence to the pitfall findings.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, postmortems, gitops
- **Possible resolution from [[sources/research-finalizers]]:** Largely helpful on deletion. Config Connector and ACK delete the cloud resource by default, with `abandon` and `retain` as opt-outs applied before the delete, and Argo CD's Application finalizer and Flux's `deletionPolicy` decide whether GitOps deletes cascade. The dossier does not test a prune of a Config Connector or ACK object directly. See [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]] and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Partly helpful on adopters. Morgan Stanley gives a named, self-reported scale (more than 500 clusters) and the adopters page names more than 200 organizations. The dossier found no postmortem or outage report. See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].

## Config Connector and ACK behavior under a GitOps agent — status: open

- **Question:** What happens to cloud resources when a GitOps agent prunes a Config Connector or ACK object, and how do deletion and abandon policies interact with Argo CD prune and Flux garbage collection?
- **Why it matters:** The dossier covered neither ACK specifics nor Config Connector deletion and abandon behavior, yet pruning a custom resource can delete real infrastructure.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector deletion policy and ACK adoption and deletion documentation.
  - [ ] Update [[comparisons/deletion-policies-across-gitops-and-provider-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, ack, deletion, prune
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Partly helpful for Config Connector only. Deleting the object deletes the Google Cloud resource by default, and the `abandon` annotation keeps it. The ACK search failed, so ACK is not covered. See [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].

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
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful for kro. The RGD reference documents `readyWhen`, `includeWhen`, and the RGD conditions (`Ready`, `GraphAccepted`, `KindReady`, `ControllerReady`), and the status-conditions page documents author-defined instance conditions through `runtime.newCondition()`. The Instances page returned no content and Crossplane v2 was not read. See [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]].

## kstatus rules for combining observedGeneration and conditions — status: open

- **Question:** Exactly how does kstatus combine `observedGeneration`, `Ready`, `Reconciling`, and `Stalled` to produce InProgress, Current, or Failed?
- **Why it matters:** The dossier's summary of the package page was brief. The precise rules explain the premature-readiness race. See [[entities/kstatus]] and [[findings/premature-readiness-in-kstatus-based-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the cli-utils source or documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kstatus, conditions
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful. The kstatus README names the statuses, the `Reconciling` and `Stalled` conditions, the `Ready` fallback, and two corner cases, but it does not give the exact combination rules as a table. See [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]].

## Config Connector and Argo CD status semantics beyond health checks — status: open

- **Question:** What conditions and generation tracking do Config Connector resources publish, and how does Argo CD interpret status beyond its health checks?
- **Why it matters:** No primary source on Config Connector was fetched and Argo CD was read only for health. See [[entities/config-connector]] and [[entities/argo-cd]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource status documentation and Argo CD's resource tracking documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, argo-cd, status
- **Possible resolution from [[sources/research-conditions]]:** Largely helpful for Config Connector. The reconcile-status design document describes a single `Ready` condition with reasons `Updating`, `UpToDate`, and `UpdateFailure` and `observedGeneration` set on status update, though it is a design document and may not match shipped behavior. Argo CD was read for health only. See [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]].

## Where observedGeneration should live — status: open

- **Question:** Should `observedGeneration` live at the top level of status, on each condition, or both, given that the conventions say per condition while Flux and Cluster API use a top-level field?
- **Why it matters:** Consumers need one rule to detect stale status. See [[comparisons/observedgeneration-top-level-versus-per-condition]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the final 15,000 characters of the API conventions and the Flux and Cluster API contract documents.
- **Drafted by:** agent on 2026-11-25
- **Tags:** observedgeneration, conditions
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful. KEP-1623 puts `observedGeneration` on each condition as a non-pointer integer, kro describes the per-condition value precisely, and kstatus checks the top-level field, but the dossier states that no source settles the choice. See [[comparisons/observedgeneration-top-level-versus-per-condition]].

## Generic readiness when Cluster API moves from Ready to Available — status: open

- **Question:** How should generic tools such as Flux and kstatus judge Cluster API objects now that Cluster API is replacing `Ready` with `Available`?
- **Why it matters:** Flux added CEL health checks, but a general answer is unresolved. See [[findings/premature-readiness-in-kstatus-based-tools]] and [[entities/cluster-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API condition-transition proposal and Flux CEL health check documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, kstatus, flux
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful. The Cluster API proposal explains the move to `Available` and operation conditions and says Flux uses CEL health checks for Cluster API, but it offers no general rule for generic tools. See [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]].

## Named case studies and postmortems for status problems — status: open

- **Question:** Are there named end-user case studies or postmortems about reconcile loops, stale status, or false readiness caused by status handling?
- **Why it matters:** The dossier found only project docs and issues. See [[findings/misleading-readiness-and-stale-status]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search conference talks and public postmortems.
- **Drafted by:** agent on 2026-11-25
- **Tags:** case-studies, postmortems, status
- **Possible resolution from [[sources/research-conditions]]:** Marginally helpful. The dossier found no postmortems or talks, but it adds one more issue-level case, provider-aws issue 2287, where `Synced` stayed True through a 60-minute update. See [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]].

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
- **Possible resolution from [[sources/research-finalizers]]:** Partly helpful on mechanism only. The dossier found no named-company postmortem for stuck finalizers and says so, but it collects the causes (missing controller, always-failing cleanup, child finalizers) and the dangers of forced removal. See [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]].

## Named operator failure postmortems — status: open

- **Question:** Which named organizations have published postmortems of operator failures such as stuck finalizers, reconcile storms, or CRD upgrade breakage, and what did they conclude?
- **Why it matters:** The operator-pattern dossier found no named-company case study, so its pitfall catalog rests on documentation. See [[concepts/operator-pattern]] and [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find published incident write-ups for operator outages and summarize them.
  - [ ] Link each to the matching finding page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** operators, postmortems, finalizers
- **Possible resolution from [[sources/research-finalizers]]:** Not helpful, although the Kubebuilder book gives the finalizer pattern. See [[entities/kubebuilder]].

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
- **Possible resolution from [[sources/research-finalizers]]:** Marginally helpful. The dossier shows how Argo CD's Application finalizer and Config Connector's deletion policy behave at deletion, but not how either handles failures more broadly. See [[entities/argo-cd]] and [[entities/config-connector]].

## Argo CD and Config Connector as operators — status: open

- **Question:** How do Argo CD and Config Connector handle failures as operators, and do they follow the one-controller-per-concern guidance?
- **Why it matters:** The operator-pattern dossier fetched no page on either tool. See [[entities/argo-cd]] and [[entities/config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD and Config Connector architecture documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, config-connector, operators
- **Possible resolution from [[sources/research-finalizers]]:** Not helpful. The dossier does not cover Backstage.

## Backstage and the operator pattern — status: open

- **Question:** How does Backstage relate to the operator pattern, for example as a portal over operator-managed custom resources?
- **Why it matters:** No source in the wiki covers Backstage, so the platform-engineering layer above operators is missing. See [[concepts/operator-pattern]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Backstage documentation on Kubernetes and custom resource integration.
- **Drafted by:** agent on 2026-11-25
- **Tags:** backstage, platform-engineering
- **Possible resolution from [[sources/research-composite-resource]]:** Not helpful. The dossier does not mention Backstage, although it notes that composite kinds are consumed as products by other teams and that Kratix uses Crossplane as a component.

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

## kro and Cluster API idempotency for external and infrastructure creates — status: open

- **Question:** How do kro (repeated reconciliation and partial failure of a resource graph) and Cluster API (provisioning infrastructure through providers) keep creates idempotent, and do they use markers, deterministic names, or adoption like Crossplane, ACK, and Config Connector?
- **Why it matters:** The idempotency dossier could not read kro's instance and reconciliation pages (empty scrape) and found no readable Cluster API source, so two of the tools in scope are missing from [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the kro instances and reconciliation documentation.
  - [ ] Read the current Cluster API book on infrastructure providers and machine creation.
  - [ ] Add rows to the comparison.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, cluster-api, idempotency

## Production outcomes of adopt-or-create versus explicit import — status: open

- **Question:** What do production teams report when they use ACK `adopt-or-create`, Config Connector acquisition, or Crossplane Observe-then-manage, compared with SAP's explicit-intent design, and which default is safer?
- **Why it matters:** The dossier says the sources do not compare outcomes, so [[decisions/adopt-or-create-or-require-explicit-import]] cannot be settled.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find adopter write-ups, talks, or issue threads on accidental adoption or overwritten resources.
  - [ ] Update the decision page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, ack, config-connector, crossplane

## Postmortems of leaked or duplicated cloud resources from ambiguous creates — status: open

- **Question:** Are there named postmortems or conference talks describing leaked or duplicated cloud resources after a controller crashed between a create call and recording its result?
- **Why it matters:** The dossier's evidence is GitHub issues only, such as Crossplane issue 3037, so [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]] lacks incident accounts with cost or scale.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search public incident reports and talks on Crossplane, ACK, and Config Connector.
  - [ ] Check whether the Crossplane maintainers' proposed opt-out for deterministic identifiers shipped.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, idempotency, external-resources

## Cache narrowing options in controller-runtime — status: open

- **Question:** Which controller-runtime options (cache selectors, transforms, disabling the cache for specific types, metadata-only informers) reduce informer cache memory, and what do they cost?
- **Why it matters:** The cache blog says memory grows with watched objects and has no eviction, but only about 100,000 of about 150,000 characters were read, so the mitigations may be in the unread part.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the rest of the controller-runtime cache blog and the cache package documentation.
  - [ ] Update [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cache, memory, controller-runtime

## Flux shared caches and Crossplane performance guidance — status: open

- **Question:** How do Flux controllers share or isolate informer caches, and what does Crossplane's current performance and sharding guidance say?
- **Why it matters:** The dossier found Flux tuning flags but no informer internals, and the guessed Crossplane performance guide URL returned 404, so the scale gap still has no Flux or Crossplane sharding data.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux controller source and the current Crossplane performance documentation.
  - [ ] Update [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, crossplane, sharding, scale

## Informer and cache choices of kro, Config Connector, ACK, and Cluster API — status: open

- **Question:** What informer, cache, concurrency, and rate-limit choices do kro, Config Connector, ACK, and Cluster API make?
- **Why it matters:** No page in the informers dossier covered these tools, so the comparison tables have empty cells for them. Backstage was also not covered by any source.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's controller configuration documentation or source.
  - [ ] Extend [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, config-connector, ack, cluster-api, informers

## Primary OpenAI Kubernetes outage postmortem — status: open

- **Question:** What does the primary OpenAI postmortem say about the telemetry service, API server load, and DNS dependency, and does it involve list and watch clients?
- **Why it matters:** The dossier read only Ahmet Alp Balkan's commentary, so the quotations and the causal chain are second-hand, and [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]] rests on them.
- **Owner:** unassigned
- **How to close:**
  - [ ] Locate and read the primary postmortem.
  - [ ] Update [[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, api-server, outage

## Argo CD finalizer variants and non-cascading deletes — status: open

- **Question:** What do Argo CD's Foreground and Background finalizer variants do, and which options exist for deleting an Application without deleting its workloads beyond ApplicationSet `preserveResourcesOnDeletion`?
- **Why it matters:** The dossier read only the ApplicationSet deletion page, so Argo CD's deletion behavior is incomplete. See [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD documentation on app deletion and finalizers.
  - [ ] Update [[entities/argo-cd]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, finalizers, deletion
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Partly helpful. The Argo CD App Deletion page says cascade needs the `resources-finalizer.argocd.argoproj.io` finalizer, that cascade uses foreground propagation by default, and that background and non-cascading deletes are selectable. The Foreground and Background finalizer variants and `PrunePropagationPolicy` were still not read. See [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].

## Flux Kustomization finalizer name and behavior — status: open

- **Question:** What is Flux's own finalizer on a Kustomization, and how does `WaitForTermination` interact with the finalizers of child objects?
- **Why it matters:** The dossier read about 100 KB of a page of about 121 KB and did not isolate the finalizer section or confirm `finalizers.fluxcd.io`. See [[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the full Kustomization reference and the kustomize-controller source.
  - [ ] Update [[entities/flux]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, finalizers, verification
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Marginally helpful. The dossier read about 100,000 of 121,000 characters of the Kustomization page, found `deletionPolicy` and inventory-based pruning, and did not isolate the finalizer name or say whether Flux uses owner references. See [[entities/flux]].

## Resolution of Crossplane issue 7801 on credential protection — status: open

- **Question:** Was Crossplane issue 7801 resolved, and did a fix such as Secret finalizers, credential caching, or ordered teardown ship?
- **Why it matters:** The issue is a proposal discussion and its outcome is unknown. See [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]] and [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the issue thread and any linked pull requests.
  - [ ] Update the finding and the decision page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, finalizers, credentials

## How ACK, Config Connector, and kro name and remove their finalizers — status: open

- **Question:** What finalizer names do ACK, Config Connector, and kro put on objects, and how and when does each remove them?
- **Why it matters:** Their documentation pages do not explain it, so a comparison would need live objects or source code. See [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Inspect live objects or read each controller's source.
  - [ ] Add the names to the entity pages.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ack, config-connector, kro, finalizers

## Cluster API issue 1514 on blocking deletion with a finalizer or annotation — status: open

- **Question:** What does Cluster API issue 1514 conclude about blocking deletion with a finalizer or an annotation, and how does that relate to the hook annotations in the current book?
- **Why it matters:** It was a search hit that the dossier did not read. See [[examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the issue and the current machine deletion hook documentation.
  - [ ] Update [[entities/cluster-api]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, finalizers, deletion

## How kro sets ownership and labels on child resources — status: open

- **Question:** Does kro set owner references or labels on the resources that an instance creates, and in what order does it delete them beyond the reverse-wave behavior already recorded?
- **Why it matters:** The owner-reference dossier could not read kro's instances or FAQ pages, so kro is the one platform tool in scope with no known ownership model. See [[entities/kro]] and [[sources/research-owner-references-and-garbage-collection]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read kro's instances and FAQ documentation or the controller source.
  - [ ] Add a kro row to [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, owner-references, deletion
- **Possible resolution from [[sources/research-composite-resource]]:** Marginally helpful. The kro FAQ tells Argo CD users to add an ownerReference and an `argocd.argoproj.io/tracking-id` annotation to every templated resource, which suggests kro does not set these in a way Argo CD tracks by default, and the RGD overview says deletion follows reverse topological order. It does not say whether kro sets its own owner references or labels. See [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]].

## Argo CD PrunePropagationPolicy and resource tracking methods — status: open

- **Question:** How do the `PrunePropagationPolicy` sync option and Argo CD's label, annotation, and tracking-id methods interact with Kubernetes propagation policies when Argo CD prunes or deletes resources?
- **Why it matters:** The dossier read only the App Deletion page, so the way Argo CD identifies the objects it owns, and how it deletes them, is incomplete. See [[entities/argo-cd]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD sync options and resource tracking documentation.
  - [ ] Update [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, prune, propagation-policy

## What happens when blockOwnerDeletion is set without finalizers permission — status: open

- **Question:** When a controller sets `blockOwnerDeletion: true` without `update` on the owner's `/finalizers` subresource, does the API server reject the write or silently drop the flag?
- **Why it matters:** An official page describes an admission check and a controller-author blog describes silent dropping, so the failure mode is disputed. See [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Test on a cluster or read the OwnerReferencesPermissionEnforcement admission plugin source.
  - [ ] Update the finding and [[concepts/owner-references-and-garbage-collection]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** rbac, blockownerdeletion, verification

## Crossplane v2 namespaced composites and managementPolicies versus garbage collection — status: open

- **Question:** How do Crossplane v2 namespaced composite resources and `managementPolicies` interact with owner-reference cascades and the composite deletion policy?
- **Why it matters:** The dossier read the v2.4 Compositions page only through a summary that did not cover either topic. See [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane v2 documentation on composite resources, scope, and management policies.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, deletion, management-policies
- **Possible resolution from [[sources/research-composite-resource]]:** Partly helpful. The current composite resources page documents the alpha deletion policy and its bypass under Argo CD foreground deletion, and the upgrade guide describes namespaced XRs and managed resources under `.m.` groups. Neither source covers how `managementPolicies` interact with the cascade. See [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]].

## KEPs on cross-namespace ownership and garbage collector performance — status: open

- **Question:** Do any Kubernetes enhancement proposals or conference talks address cross-namespace ownership or garbage collector performance, and are the design archive's foreground and background labels outdated?
- **Why it matters:** The dossier fetched no KEPs, and its summaries of the finalizers blog and the design proposal conflicted with current documentation. See [[concepts/owner-references-and-garbage-collection]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search the kubernetes/enhancements repository and SIG API Machinery material.
  - [ ] Re-read the finalizers blog and design proposal in full.
- **Drafted by:** agent on 2026-11-25
- **Tags:** keps, garbage-collection, verification

## Crossplane v2 condition behavior and the fix for async Synced signaling — status: open

- **Question:** Do Crossplane v2 and current upjet and crossplane-runtime releases still overwrite a pending state with `ReconcileSuccess` during long async operations, and is `AsyncOperation` now part of the recommended alert surface?
- **Why it matters:** The dossier read the v1.20 managed resources page and the issue thread only, so the fix status of provider-aws issue 2287 is unknown. See [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read current Crossplane v2 managed resource documentation and the upjet and crossplane-runtime changes linked to the issue.
  - [ ] Update [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, conditions, upjet, verification

## How a platform should choose condition polarity — status: open

- **Question:** Should new condition types be abnormal-true (as kstatus prefers) or positive (as the Cluster API proposal and the API conventions lean), and what evidence shows which choice produces fewer misreadings by generic tools?
- **Why it matters:** The sources read leave the choice to authors, so the wiki cannot recommend one. See [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the last part of the API conventions and the kstatus design discussion.
  - [ ] Find practitioner write-ups on polarity incidents.
- **Drafted by:** agent on 2026-11-25
- **Tags:** conditions, polarity, kstatus, decision

## Which parts of the Config Connector reconcile-status design shipped — status: open

- **Question:** Did Config Connector ship the single `Ready` condition reasons (`Updating`, `UpToDate`, `UpdateFailure`) and the proposal to carry long-running operation IDs in the reason, as the design document describes?
- **Why it matters:** The only source is a design document, so [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]] may describe intent and not behavior.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource status documentation or inspect a live resource.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, conditions, verification

## managementPolicies feature status and the ObserveOnly-to-policy-list mapping — status: open

- **Question:** Is `managementPolicies` still beta in Crossplane v2.x, and how do the older `ObserveOnly` and `deletionPolicy` terms map onto the policy list?
- **Why it matters:** The import guide calls management policies beta while the managed resources page presents them as standard, and no page the dossier read spells out the mapping, so [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]] rests on inference.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane feature-lifecycle page (https://docs.crossplane.io/latest/learn/feature-lifecycle/).
  - [ ] Find a page or release note that maps the old enum to the list.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, management-policies, verification

## Adoption and orphaning behavior in Cluster API, kro, and controller-runtime operators — status: open

- **Question:** How do Cluster API, kro, and plain controller-runtime operators handle adopting an existing resource and orphaning one on delete?
- **Why it matters:** The managed resource dossier found no readable primary source for these tools, so [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]] covers only Crossplane, Config Connector, and ACK.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API and kro documentation on adoption and deletion.
  - [ ] Read the ACK introduction blog.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, orphan, cluster-api, kro

## Behavior of namespaced v2 managed resources when a namespace is deleted while the provider is down — status: open

- **Question:** What happens to namespaced Crossplane v2 managed resources when their namespace is deleted while the provider is absent, beyond the finalizer note?
- **Why it matters:** The dossier says deletion hangs without the provider and that hand-removing the finalizer orphans the real resource, but the Crossplane docs do not state the namespace-deletion case clearly.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Crossplane documentation or an issue that describes the namespace-deletion case in v2.
  - [ ] Add the result to [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, finalizers, namespaces, deletion

## Per-provider external-name defaults — status: open

- **Question:** What is the default `crossplane.io/external-name` for each major provider and resource kind?
- **Why it matters:** One source says the default is the object name for S3 and another says external resources are named like the Kubernetes object by default, and per-provider variation is not documented in one place.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the provider documentation for AWS, Azure, and GCP kinds.
  - [ ] Update [[decisions/external-name-annotation-or-spec-field]] if defaults differ.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, external-name, providers

## Config Connector conflict handling when two objects target one cloud resource — status: open

- **Question:** What does Config Connector do when two Kubernetes objects acquire the same cloud resource?
- **Why it matters:** The acquire-by-name behavior was read through a summarized fetch and lacks conflict handling detail, which matters for [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource acquisition documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, adoption, conflicts


## Claim support and scope in Crossplane v2 XRDs — status: open

- **Question:** What do the primary Crossplane v2 XRD and composite resource pages say about claims, the `LegacyCluster` scope, and how v1 claim-based XRDs coexist with namespaced XRs?
- **Why it matters:** The composite resources dossier read v1.20 pages for claims and XRDs and relied on a third-party blog for the `LegacyCluster` detail, so [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]] has an unverified v2 column.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Crossplane XRD and composite resource documentation.
  - [ ] Update [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]] and [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, claims, v2, verification

## kro Graph API status and released-version facts — status: open

- **Question:** What is the status of kro's alpha `Graph` API compared with the ResourceGraphDefinition, and which kro version is current, given that the docs show 0.10.0 and a third-party blog dated September 2026 says v0.9.x?
- **Why it matters:** The `readyWhen` gating behavior differs between the two APIs, so a tutorial could describe the wrong one. See [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the kro release notes and the Graph API documentation.
  - [ ] Update [[entities/kro]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, graph-api, versioning, verification

## Flux handling of composite resources and kro instances — status: open

- **Question:** How do Flux health checks, `dependsOn`, and CRD ordering behave with Crossplane XRs and kro instances, and does Flux need the same ownerReference or tracking recipes that Argo CD needs?
- **Why it matters:** The composite resources dossier read Argo CD interaction only and no Flux material, yet Flux is a primary tool of this wiki. See [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]] and [[entities/flux]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read Flux documentation on health checks and custom resource readiness for composites.
  - [ ] Write an `examples/` page on Flux hosting composites.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, crossplane, kro, health-checks
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Not helpful. The dossier does not research Flux with composites or kro instances.

## ClusterClass maturity and the managed topologies proposal — status: open

- **Question:** What is the current maturity of Cluster API's ClusterClass and what does the CAEP "ClusterClass and Managed Topologies" specify?
- **Why it matters:** The dossier read only a short landing page that labels the feature alpha, which may be stale. See [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Cluster API book on ClusterClass and the CAEP.
  - [ ] Update [[entities/cluster-api]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, clusterclass, verification

## Scale of composite resources per controller — status: open

- **Question:** How many composites and composed children can a Crossplane function pipeline or a kro dynamic controller reconcile, and what do the tuning pages report?
- **Why it matters:** The composite resources dossier found no numbers for either tool and did not read kro's tuning documentation, so platform sizing has no evidence. See [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read Crossplane performance guidance and kro tuning documentation.
  - [ ] Find adopter or benchmark reports for composites and function pipelines.
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, crossplane, kro, composites

## Feature parity of function-kro with standalone kro — status: open

- **Question:** Does `function-kro` really reach full feature parity with a standalone kro ResourceGraphDefinition, and how do readiness and revision behavior differ when the graph runs inside a Crossplane pipeline?
- **Why it matters:** The parity claim comes from the Crossplane project's own announcement, and the choice between running kro alone or inside Crossplane depends on it. See [[entities/function-kro]] and [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the function-kro repository documentation and compare it with the kro RGD reference.
  - [ ] Find independent reports of running it in production.
- **Drafted by:** agent on 2026-11-25
- **Tags:** function-kro, kro, crossplane, verification

## Crossplane function runner architecture history — status: open

- **Question:** Which parts of the earlier Crossplane function runner model (a gRPC runner as a sidecar to the Crossplane pod, and a container-runner path) still exist, given that the design doc describes functions as Deployments behind a headless Service?
- **Why it matters:** The VSHN post from 2023 and the design doc disagree on the runtime shape, and operators need the current model to size and secure functions. See [[sources/research-composition]] and [[entities/crossplane]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Crossplane Function package and runtime documentation.
  - [ ] Update [[entities/crossplane]] and [[findings/composition-functions-add-moving-parts-that-must-be-healthy]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, composition-functions, verification

## Config Connector and ACK behavior when wrapped by compositions — status: open

- **Question:** How do Config Connector and ACK readiness conditions and deletion policies interact when their resources are composed by a Crossplane Composition or a kro ResourceGraphDefinition?
- **Why it matters:** Both are the managed-resource layer that compositions typically wrap, but the dossier's pages say nothing about this interplay, and the ACK drift recovery and deletion policy topics were not opened. See [[sources/research-composition]], [[entities/config-connector]], and [[entities/ack]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the ACK deletion policy and drift recovery guides and the Config Connector deletion and readiness pages.
  - [ ] Find a worked example of a graph wrapping ACK or Config Connector resources and record how readiness propagates.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ack, config-connector, composition, readiness

## Upjet runtime execution model and cost — status: open

- **Question:** How do Upjet-generated Crossplane controllers run Terraform logic at runtime, as a CLI subprocess or in-process, and what do they cost in memory and performance?
- **Why it matters:** The Upjet repository summary says controllers reuse Terraform's resource logic, but the runtime shape was not confirmed, and the generated official AWS, Azure, and GCP providers depend on it. See [[sources/research-provider]], [[entities/upjet]], and [[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Upjet architecture and performance documentation.
  - [ ] Update [[entities/upjet]] with the runtime model and resource costs.
- **Drafted by:** agent on 2026-11-25
- **Tags:** upjet, crossplane, terraform, performance

## Config Connector controller kind per resource — status: open

- **Question:** Which Config Connector resources use the direct, Terraform-based, or DCL-based controller, and what is the direction of travel between them?
- **Why it matters:** The controller kind decides backoff defaults (2 minutes maximum for Terraform and DCL, tunable for direct) and drift behavior, but the reconciliation page does not map resources to kinds. See [[sources/research-provider]] and [[entities/config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find a per-resource list or the Config Connector release notes on direct controllers.
  - [ ] Update [[entities/config-connector]] with the mapping.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, reconciliation, verification

## Flux and Argo CD handling of provider-managed resources — status: open

- **Question:** How do Flux and Argo CD treat provider-managed resources in terms of health checks, pruning, ordering, and deletion, and does a provider's own condition model interact with their health assessment?
- **Why it matters:** Provider objects delete cloud resources when removed, and the Providers dossier only mentions GitOps through Config Connector's trusted-repository advice. Both agents are a layer that can prune a managed resource. See [[sources/research-provider]], [[concepts/provider]], and [[findings/unintended-deletion-through-prune]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux and Argo CD documentation on health checks, prune, and finalizers for custom resources.
  - [ ] Find a worked example of a managed resource under each agent.
- **Drafted by:** agent on 2026-11-25
- **Tags:** gitops, flux, argo-cd, provider
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Not helpful. The dossier does not read how Flux treats provider-managed resources, and its prune evidence is generic. See [[findings/without-prune-flux-leaves-removed-manifests-running-as-orphans]].

## Flux source-controller internals and artifact serving under leader election — status: open

- **Question:** How does the Flux source controller store and serve artifacts, how does leader election affect artifact serving when several replicas run, and how does OCI source verification work?
- **Why it matters:** The Flux deep dive read the source controller only at overview level, yet every downstream controller depends on its artifacts, and the Git-to-Ready lifecycle trace cannot be completed without it. See [[entities/flux]] and [[sources/research-flux-deep-dive]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the source controller API pages for GitRepository, OCIRepository, HelmChart, and Bucket directly.
  - [ ] Update [[entities/flux]] and write a worked example for the lifecycle trace.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, source-controller, leader-election, verification

## Flux sharding in production and the HelmChart labeling rule — status: open

- **Question:** What do production deployments of Flux sharding look like, and what is the exact labeling rule for HelmChart objects that the sharding page cautions about?
- **Why it matters:** The only adopter in the dossier lists sharding as future work, and the labeling caveat could cause objects to land on the wrong shard. See [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]] and [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux sharding page directly and note the HelmChart caveat.
  - [ ] Find a named adopter that runs shards and record its numbers.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, sharding, scale, verification

## Flux image automation API status and safe promotion policy — status: open

- **Question:** What are the current API versions and maturity of the Flux image automation controllers, and what promotion policy do adopters use to keep automatic tag updates out of production?
- **Why it matters:** The dossier read the guide as a digest and says current versions and any beta status should be checked, and automatic tag commits are a documented rollout risk. See [[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the image automation API reference and release notes.
  - [ ] Find adopter write-ups on staging-only or reviewed promotion.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, image-automation, verification
