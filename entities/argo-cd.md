---
title: Argo CD
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: skyscanner-namespace-deletion-postmortem
    hash: 4930a0cb876a
    ingested: 2026-11-26
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
  - id: research-reconciliation-loop
    hash: df7d66206baf
    ingested: 2026-11-25
  - id: research-idempotency
    hash: 4704ffd77903
    ingested: 2026-11-25
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g3-argocd-capi
    hash: c3d485fa58ae
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-capi-argocd
    hash: 832b86e20750
    ingested: 2026-11-26
aliases: [ArgoCD]
tags: [tool, gitops]
---

# Argo CD

Argo CD is a CNCF GitOps delivery tool, listed in the dossier alongside [[entities/flux]] as a controller layer that keeps the API server's contents in sync with Git. [[sources/research-universal-control-plane]]

## Ordering model

Argo CD orders a sync by phase (PreSync, Sync, PostSync), then by wave number, then by kind and name, and it advances to the next wave only when the current wave is healthy. If any resource in a wave fails, the whole sync stops and is marked failed. Flux expresses ordering differently, through `dependsOn` between objects. See [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Pitfalls

Hooks run on every sync, so they must be idempotent (see [[concepts/idempotency]]). Correction note, 2026-11-26: one CNCF blog author reports that a self-heal run is a partial sync that skips hooks, so a hook is not guaranteed to run on every reconciliation, see [[findings/argo-cd-self-heal-runs-a-partial-sync-that-skips-hooks-according-to-one-author-so-a-migration-hook-can-be-missed]]. A PreSync hook can run before the ConfigMaps or Secrets it needs, and a long migration can hit a timeout while it is still running. See [[findings/ordering-and-dependency-failures]].

## Automated sync policy

Automated sync applies Git state when an application is OutOfSync. Pruning and self-heal are off by default, a failed sync is not retried for the same commit and parameters, allow-empty protection prevents pruning everything, and rollback is blocked while auto-sync is on. Multi-source applications with self-heal can trigger unexpected syncs. Intuit built Argo CD to manage deployment complexity in an auditable way. [[sources/research-declarative-vs-imperative]] See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[examples/intuit-argo-cd-gitops-origin]], and [[findings/defaulting-and-drift-reconcile-loops]].

## Polling interval and jitter

Argo CD polls on `timeout.reconciliation` in the `argocd-cm` ConfigMap, which the documentation gives as 120 seconds plus up to 60 seconds of jitter in v3.0.0 and later (v2.x defaulted to a flat 180 seconds, see [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]). With self-heal enabled it reverts manual `kubectl edit` changes, and it does not retry a failed automated sync of the same commit and parameters. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]] and [[examples/gitops-reverts-a-hand-edited-deployment]].

## To research

The dossier read the sync-waves page only through a summarizing fetch. Drift detection and self-heal behavior, application sets, and multi-cluster scale were not covered. See [[open-knowledge-gaps]].

## Convergence behavior

Self-heal syncs after a default delay of about 5 seconds when live state drifts from Git, prune is off by default, retries use configurable exponential backoff with unlimited retries possible, and a failed sync of the same commit and parameters is not retried unless self-heal is on. Sync order is phase, wave, kind, then name, and each wave must be Healthy before the next. [[sources/research-eventual-consistency-and-convergence]] See [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]] and [[comparisons/retry-and-backoff-controls-across-tools]].

## Self-heal, diffing, and incremental adoption

`selfHeal` re-syncs after a default 5-second timeout, a sync runs only when the app is OutOfSync, and rollback is disallowed under automated sync. The diffing customization page explains false OutOfSync status from mutating webhooks, HPA field rewrites, non-deterministic Helm templates, and dropped unknown fields, and offers `ignoreDifferences` by JSON pointer, JQ path, or `managedFieldsManagers`. Akuity describes manual sync for risky workloads during adoption and self-heal for stateless apps. [[sources/research-self-healing-and-drift-detection]] See [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]], [[examples/incremental-gitops-adoption-with-manual-sync-and-self-heal]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], and [[comparisons/exemption-and-ignore-controls-across-tools]].

## Architecture and best practices

Argo CD has three components: an API server that serves the UI, CLI, and CI systems and handles RBAC, credentials, and webhooks; a repository server that caches Git and renders manifests; and an application controller that compares live to target state, flags OutOfSync, optionally corrects it, and runs PreSync, Sync, and PostSync hooks. Its best practices recommend separate repositories for config and application source, pinning remote Helm and Kustomize references to tags or SHAs, and leaving fields owned by other controllers (such as HPA replica counts) out of Git. Rollback is blocked while automated sync is on. Hosting Crossplane needs custom Lua health checks and annotation tracking. [[sources/research-gitops-pull-based-delivery]] See [[comparisons/flux-versus-argo-cd-architecture]], [[findings/rollback-is-blocked-while-automated-sync-is-on]], [[findings/mutable-remote-references-change-what-a-commit-renders]], and [[examples/crossplane-resources-hosted-by-argo-cd]].

## Missing CRDs and sync waves

Argo CD users who hit "no matches for kind" when a Helm or GitOps deployment applies a custom resource before its CRD reach for sync waves and for skipping dry-run on missing resources. These Argo-specific details come from search-result titles only, because the pages could not be read, so treat them as unverified. How Argo CD's own resource tracking keys resources by GVK across API version changes was not established. [[sources/research-gvk-and-gvr]] See [[comparisons/missing-crd-handling-flux-versus-argo-cd]] and [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]].

## Large CRDs and client-side apply

The ApplicationSets CRD grew large enough that its `last-applied-configuration` annotation exceeded the 262,144-byte limit under client-side apply. The reported workarounds are the `ServerSideApply=true` sync option and, for Kustomize, `ClientSideApplyMigration=false`. [[sources/research-custom-resource-definition]] See [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]] and [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]].

## Health assessment from resource status

Argo CD derives health from `status`: built-in checks for core types and Lua scripts that read `obj.status` for CRDs, with results Healthy, Progressing, Degraded, or Suspended, and application health as the worst of the immediate children. Without a script, CRD health cannot be derived reliably. Argo CD maintainers also described comparing managed-field timestamps as a fragile workaround for ACK conditions that lack `observedGeneration`. Argo CD's own status semantics beyond health checks were not read at primary-source depth. [[sources/research-spec-status-split]] See [[examples/argo-cd-rolls-up-child-health-with-lua-checks]] and [[findings/missing-observedgeneration-hides-stale-status]].

## Server-side apply and Server-Side Diff

Argo CD applies with client-side `kubectl apply` by default. `ServerSideApply=true`, set per Application or per resource, runs `kubectl apply --server-side --force-conflicts` under the manager `argocd-controller`. `Replace=true` takes precedence over it and `Force=true` is ignored under it. A client-side apply migration feature moves ownership to Argo CD's manager, and adopting a namespace with `managedNamespaceMetadata` needs a prior upgrade to server-side apply. Applying and diffing are separate: Server-Side Diff (`ServerSideDiff=true`) avoids false OutOfSync caused by server defaults. SSA support arrived in Argo CD v2.5.0 according to one personal blog. [[sources/research-server-side-apply-and-field-ownership]] See [[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]], [[findings/diff-is-not-apply-server-defaults-look-like-drift]], and [[comparisons/ssa-conflict-policy-across-tools]].

## Coverage gap in the operator-pattern dossier

The operator-pattern dossier fetched no page on Argo CD, so how its controllers handle failures and how it maps onto the one-controller-per-concern guidance is not covered by that source. [[sources/research-operator-pattern]] See [[open-knowledge-gaps]].

## Reconcile timing and failure policy in the reconciliation-loop dossier

Automated sync polls on `timeout.reconciliation`, default 120 seconds plus 60 seconds of jitter (v2.x and some stale pages say 3 minutes, see [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]), self-heal re-syncs on divergence with a default 5 second delay, and prune is off by default. Automated sync does not retry a failed sync of the same commit and parameters unless retry is configured, which differs from the controller-runtime default of retrying with backoff. [[sources/research-reconciliation-loop]] See [[examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured]].

## Self-heal and retry as idempotency

The automated sync page says self-heal is off by default, pruning is blocked from leaving an application empty unless `allowEmpty` is set, and a failed sync can retry with exponential backoff using `limit`, `duration`, `factor`, and `maxDuration`. In multi-source applications, disabling self-heal does not guarantee that live changes persist. [[sources/research-idempotency]] See [[concepts/idempotency]] and [[findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent]].

## Cluster cache, sharding, and processor counts

The application controller maintains a lightweight cluster cache from watch APIs. The high availability page scales it by sharding clusters across replicas (`legacy`, `round-robin`, `consistent-hashing`), by tuning `--status-processors` and `--operation-processors` (defaults 20 and 10 as extracted), and by setting `GOMEMLIMIT` to 80 to 90 percent of the container limit. [[sources/research-informers-reflectors-and-workqueues]] See [[examples/argo-cd-application-controller-shards-clusters-and-tunes-processor-counts]] and [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]].

## Application finalizer and deletion cascade

The `resources-finalizer.argocd.argoproj.io` finalizer on an Application makes deleting the Application also delete its deployed resources. Deleting an ApplicationSet cascades to its Applications, `--cascade=orphan` leaves Applications whose finalizer still deletes workloads later, and `syncPolicy.preserveResourcesOnDeletion` stops the finalizer from being added. Correction recorded 2026-11-26: the finalizer has three spellings (the bare name, `/foreground`, and `/background`), and a non-cascading delete removes it, see [[findings/argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer]]. [[sources/research-gap-m1-finalizers]] [[sources/research-finalizers]] See [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]] and [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].

## Application finalizer instead of owner references

Argo CD cascades an Application delete to its managed resources only when the Application carries the `resources-finalizer.argocd.argoproj.io` finalizer. Cascade uses foreground propagation by default, and background and non-cascading deletes are also selectable. The `PrunePropagationPolicy` sync option governs pruning during a sync and not Application deletion, see [[findings/argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer]]. The tracking methods were not read. [[sources/research-owner-references-and-garbage-collection]] See [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].

## Health from conditions

Argo CD assigns each resource Healthy, Progressing, Degraded, Suspended, Missing, or Unknown, takes the worst health among an application's immediate children, and needs custom Lua checks (`resource.customizations.health.<group>_<kind>`) for CRDs because status formats are not standardized. [[sources/research-conditions]] See [[examples/argo-cd-rolls-up-child-health-with-lua-checks]] and [[concepts/conditions]].

## Hosting Crossplane managed resources

Crossplane's integration guide says Argo CD should use annotation-based resource tracking because label tracking collides with Crossplane's own labels on composed resources, should have custom Lua health checks that read the `Ready` and `Synced` conditions, should hide ProviderConfigUsage objects, and may need `ARGOCD_K8S_CLIENT_QPS` raised to 300 as CRDs multiply. [[sources/research-managed-resource]] See [[examples/crossplane-resources-hosted-by-argo-cd]] and [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]].

## Hosting composite resources

For composite resources, Argo CD's default foreground deletion makes Crossplane ignore its composite deletion policy and emit a warning event, and the fix is the `PrunePropagationPolicy=background` sync option with a background finalizer. For kro instances, every templated child needs an ownerReference and an `argocd.argoproj.io/tracking-id` annotation so Argo CD tracks it. [[sources/research-composite-resource]] See [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]] and [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]]. This partly informs the open question on `PrunePropagationPolicy` in [[open-knowledge-gaps]].

## Ordering and tuning for generated resources

Argo CD orders resources with hooks (PreSync, Sync, PostSync, SyncFail, Skip, PreDelete, PostDelete) and sync waves within a phase. A failed PreSync hook stops the sync, wave order is reversed during pruning, and `ttlSecondsAfterFinished` on hook Jobs is discouraged because Argo CD must read the Job outcome. Compared with kro, Argo CD ordering is explicit and annotation-based while kro's is inferred from data references. For Crossplane it needs annotation-based tracking, custom Lua health checks, and a higher Kubernetes client QPS, and for kro each templated resource needs a tracking-id annotation and an owner reference. [[sources/research-composition]] See [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]] and [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]].

## Contrast with Flux in the Flux deep dive

A vendor comparison in the Flux deep dive describes Argo CD as centralized, with sync phases (pre-sync, sync, post-sync) for ordering and Projects for tenant isolation, whereas Flux uses distributed controllers, `dependsOn`, and namespaces with RBAC. The source is a vendor blog, and its claim that Flux lacks a native UI is flagged as dated. [[sources/research-flux-deep-dive]] See [[comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog]].

## Delivery agent in the JFrog self-service pattern

In JFrog's self-service environments, Argo CD sits between Git and Crossplane. Developers' requests become custom resources committed to Git, Argo CD syncs them, and Crossplane creates the cloud resources, so Argo CD sees the platform-level resources and not each cloud resource beneath them. [[sources/research-crossplane-deep-dive]] See [[examples/jfrog-delivers-self-service-cloud-environments-through-jenkins-git-argo-cd-and-crossplane]] and [[examples/crossplane-resources-hosted-by-argo-cd]].

## Tracking kro children and the EKS capability

The kro FAQ gives an Argo CD recipe: add an owner reference and an `argocd.argoproj.io/tracking-id` annotation to each templated resource so Argo CD can track the children that kro creates, and the FAQ documents risks with the approach. The Amazon EKS guide lists Argo CD as a managed EKS capability that can deploy kro custom resources across clusters. Kustomize's site also lists Argo CD as an integrator. See [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]], [[findings/default-owner-references-delete-out-of-order-and-cannot-link-namespaced-to-cluster-scoped-objects-so-kro-uses-applysets]], and [[entities/kustomize]]. [[sources/research-kro-and-abstraction-models]]

## Position in the tooling landscape

Argo CD sits in the delivery layer of [[concepts/tooling-landscape]]. The architecture documentation describes an API server (gRPC and REST for the UI, CLI, CI, RBAC, and webhooks), a repository server that caches repositories and renders manifests from URL, revision, path, and template settings, and an application controller that "continuously monitors running applications and compares the current, live state against the desired target state" (https://argo-cd.readthedocs.io/en/stable/operator-manual/architecture/). The excerpt did not cover ApplicationSet or app-of-apps. Akuity, an Argo CD vendor, reports that it runs in nearly 60% of clusters according to the 2025 Argo CD End User Survey, that AppProjects give per-tenant RBAC, and that Kargo handles promotion, and it calls Argo CD's footprint heavier than Flux's. These are vendor claims, see [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]]. A practitioner also reports that Argo CD deletes Config Connector children without ordering, see [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]]. [[sources/research-landscape]]

## Cluster sharding and queue sizing in the scale dossier

The scale dossier adds that Argo CD shards by destination cluster across application-controller replicas, with `ARGOCD_CONTROLLER_REPLICAS` giving each replica the total and a choice of legacy, round-robin, or consistent-hashing assignment. The digest described the last two as experimental, and the legacy algorithm can be uneven. Correction 2026-11-26: the label is confirmed current, since the v3.6.3 docs still call both non-legacy algorithms experimental (see below). A cluster can be pinned to a shard through its cluster secret. Each replica uses two queues, one for reconciliation that takes milliseconds and one for syncing that takes seconds, sized by `--status-processors` and `--operation-processors`. See [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[concepts/scale-and-sharding]], and [[sources/research-scale-and-sharding]]. URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/.


## Guard rails against destructive syncs in the pitfalls dossier

The pitfalls dossier catalogues Argo CD's sync options against accidental damage: `Prune=false` and `Prune=confirm`, `Delete=false` and `Delete=confirm` (confirmation recommended for Namespaces), a `PrunePropagationPolicy` that is foreground by default, `PruneLast`, `FailOnSharedResource`, and `ApplyOutOfSyncOnly`. `Replace=true` and `Force=true` can recreate resources and cause outages. With `ServerSideApply=true` Argo CD runs `--force-conflicts` and moves client-side apply managers to `argocd-controller`, and `RespectIgnoreDifferences` makes `ignoreDifferences` apply at sync time. See [[findings/argo-cd-replace-and-force-sync-options-can-recreate-resources-and-cause-outages]], [[findings/unintended-deletion-through-prune]], [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]], and [[sources/research-pitfalls-and-case-studies]]. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/.

## Default polling across versions in the reconcile-defaults dossier

The default `timeout.reconciliation` was 180 seconds from v2.5.0 through v2.14.0 (the `timeout.reconciliation.jitter` key appears from v2.10.0 with default 0) and is 120 seconds plus 60 seconds of jitter from v3.0.0 through v3.6.0, in both the manifest example and the controller constants. The v3.0.0 FAQ calls it a "default maximum polling interval ... 3 minutes (120 seconds + 60 seconds jitter)", so a polling pass lands between 120 and 180 seconds in v3.x, and the v3.2.0 high-availability page still says 3m. The reason for the change is not verified, and a pull request merged on 2026-07-31 changes how a value of 0 is handled (title only read). [[sources/research-gap-g3-reconcile-defaults]] See [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]].

## Sharding algorithm maturity at v3.6.3

The 2026-11-26 dossier read the high-availability and feature-maturity pages at Argo CD v3.6.3 (released 2026-11-24). Both `round-robin` and `consistent-hashing` are still described as "an experimental feature", and the maturity page lists them as Alpha, introduced in v2.8.0 and v2.12.0. The warning text is the same as at v2.14.0 and v3.0.0, so no graduation happened across that span. The `legacy` method is "uid based distribution (non-uniform)". The v3.6.3 page no longer marks `legacy` as the default, but the source default is still `legacy` (correction 2026-11-26, [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]]). Dynamic Cluster Distribution is a separate Alpha feature from v2.9.0. The docs cite a CNOE benchmark blog with "encouraging results" for consistent hashing, which a later pass read: the authors report 3x better CPU utilization and 5x fewer rebalancings (their own benchmark, [[sources/research-gap-b1-unverified-claims]]). See [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]], and [[sources/research-gap-g3-argocd-capi]].

## Incidents and adopters from the GitOps incidents dossier

Argo CD's USERS.md lists 452 self-reported organizations ([[examples/the-argo-cd-users-file-lists-452-self-reported-adopters]]), and CNCF documents Subaru's move to Argo CD with Helmfile ([[examples/subaru-adopted-argo-cd-with-helmfile-to-replace-manual-deployment-procedures]]). Reported incidents include a self-heal run that skipped a migration hook ([[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]]) and cascading deletes ([[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]]). Source: [[sources/research-gap-g1-gitops-drift-incidents]].


## Reports from the operator loop dossier

Argo CD issue 18151 reports that the 2.11 upgrade raised the application controller's PATCH rate to Application objects on about 10 clusters, with no confirmed root cause and later user diagnoses ([[examples/argo-cd-issue-18151-the-2-11-upgrade-raised-the-application-patch-rate-on-every-cluster]]). Issue 30373 reports that the built-in ACK health check added in v3.6.0-rc1 reports Healthy before the ACK controller observes a spec change ([[examples/argo-cd-issue-30373-the-built-in-ack-health-check-reports-healthy-before-the-controller-observes-a-spec-change]]). Both are reporter accounts. Source: [[sources/research-gap-g1-operator-loop-failures]].

## Skyscanner 2021 outage

In Skyscanner's published account, Argo CD reconciled clusters against an incorrect configuration with no valid namespaces and deleted all 478 services across every availability zone and region. The post does not describe the sync policy or prune settings in use, so it establishes the behavior and not a specific misconfiguration. See [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]].

## Polling jitter

Pull request 22342 (merged 2025-03-13) added the 60 second default jitter and states that the maximum default stays at 3 minutes. The v3.6.3 FAQ gives the default as 120 seconds plus up to 60 seconds of jitter. The reason for the jitter beyond keeping that ceiling is not stated. See [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]] and [[sources/research-gap-b1-unverified-claims]].

## Recheck on 2026-11-26

The `legacy` default sharding algorithm is confirmed in code at v3.6.3 (the constant and the controller flag default), and round-robin and consistent-hashing are still experimental there. v3.6.3 is the newest 3.6.x release, and v3.5.9 was published later the same day on a maintenance branch. `timeout.reconciliation` was 180 seconds at v2.1.0 through v2.4.0 as well, so the 180 second era covers v2.1.0 through v2.14.0. See [[examples/argo-cd-pull-request-22342-added-a-60-second-default-jitter-while-keeping-the-three-minute-maximum]] and [[sources/research-gap-b1-recheck-capi-argocd]].

## Resource tracking and prune propagation

Argo CD tracks the resources an Application owns with `application.resourceTrackingMethod`: `annotation` (default, `argocd.argoproj.io/tracking-id`), `annotation+label`, or `label`. In `annotation+label` the instance label is informational only and truncated at 63 characters, and label mode collides with other tools that write the same label. A tracking annotation that does not reference its own resource keeps the resource out of sync status and pruning. Pruned resources use foreground deletion by default, and `PrunePropagationPolicy` accepts background, foreground, and orphan. Docs were read from `master`, and the latest release was v3.6.3. [[sources/research-gap-m2-ownership-gc]] See [[findings/argo-cd-tracks-resources-by-annotation-by-default-and-label-mode-truncates-and-collides-with-other-tools]] and [[decisions/choose-an-argo-cd-resource-tracking-method-annotation-annotation-plus-label-or-label]].
