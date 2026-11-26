---
title: "Research dossier: gap cluster o9-cadence-and-staleness"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: []
tags: [config-connector, reconcile-interval, controller-kinds, kubernetes, staleness, kep-5647, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: gap cluster o9-cadence-and-staleness

> [!NOTE]
> **Raw file:** `raw/research-gap-o9-cadence-and-staleness.md` (sha256 prefix eb353fed45cd)<br>
> **Kind:** Verified research dossier on Config Connector controller kinds and cadence, and on Kubernetes v1.36 staleness mechanisms, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the Config Connector, drift-cadence, and staleness pages<br>
> **Caveat:** Config Connector counts are the dossier author's own tally of `static_config.go` at master commit 5cce7c7e, not a published list, and the table changes with each release. Kubernetes claims are read at the tags v1.36.0, v1.37.0 and master as stated per claim.

## Summary

The dossier read the Config Connector repository at master (commit 5cce7c7e, committed 2026-11-26, latest release tag v1.162.0 published 2026-11-23) and three Google Cloud documentation pages, and it read Kubernetes source at v1.36.0, v1.37.0 and master together with KEP 5647. Its verification pass applied two corrections inline and removed no claim.

For Config Connector it finds a complete per-kind table in `pkg/controller/resourceconfig/static_config.go` with 814 entries, each naming a default controller and the supported controllers. It also finds that the direct, Terraform-based and DCL-based reconcilers all take their post-success requeue delay from one `JitteredReenqueue` function, so the controller kind alone does not change the default cadence, and that the only per-kind interval overrides are five Terraform service-mapping entries. The drift check is the reconcile itself and not a separate poll.

For Kubernetes it pins the skip counter `stale_sync_skips_total` under four controller subsystems, the informer gauge `informer_store_resource_version`, the per-controller gates, and the state of KEP 5647. It finds that `MonitorInformerStaleness` and a handler-level `BookmarkFunc` are absent from released source and master.

## Key claims

Config Connector controller kind
- `static_config.go` holds a per-GVK table with `DefaultController` and `SupportedControllers`, 814 entries at master 5cce7c7e. VERIFIED, the author's own count.
- By default controller the table has Direct 539, Terraform 206, DCL 65, and 4 IAM-specific (IAMAuditConfig, IAMPartialPolicy, IAMPolicy, IAMPolicyMember). VERIFIED, own count.
- By supported-controller list, 510 kinds support only Direct, 140 only Terraform, and 50 only DCL. 66 kinds default to Terraform and also support Direct, 15 default to DCL and also support Direct, and 29 default to Direct and also support Terraform. None default to Direct and also list DCL. VERIFIED, own count from line patterns.
- The controller-types page says "New resources use the direct controller by default. Existing resources are migrated regularly." VERIFIED, live page 2026-11-26.
- Routing runs from a namespace override in the ConfigConnectorContext (`experiments.controllerOverrides`) to the build-time static default, and a per-resource annotation `alpha.cnrm.cloud.google.com/reconciler` takes `direct`, `tf` or `dcl`. VERIFIED.
- A live CRD shows its controller by labels: `cnrm.cloud.google.com/tf2crd: "true"` means Terraform, `cnrm.cloud.google.com/dcl2crd: "true"` means DCL, and neither means direct. VERIFIED.
- The release in which each kind migrated to direct is UNVERIFIED, because release notes were not read, and no published per-resource list was found.

Config Connector cadence
- The global default mean is `MeanReconcileReenqueuePeriod = 10 * time.Minute`, and the jitter call is `wait.Jitter(mean/2, JitterFactor)` with factor 2.0. VERIFIED, master.
- The Terraform, DCL and direct reconcilers all end a successful reconcile with `RequeueAfter: jitteredPeriod`. VERIFIED.
- The interval resolves from the Terraform service mapping, then DCL metadata, then the IAM constants, then 10 minutes, and the annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` overrides all of them with the same jitter. VERIFIED.
- Service-mapping overrides exist for ComputeSSLCertificate (0), ServiceUsage `Service` (3600), ServiceIdentity (0), BigtableInstance (3600), and BigtableTable (3600). VERIFIED.
- No DCL metadata entry sets `ReconciliationIntervalInSeconds`, and the struct comment says the global default of 600 applies. VERIFIED as absence.
- Of 267 generated reference pages, 262 show 600, 3 show 3600, and 2 show 0 in the row "Config Connector Default Average Reconcile Interval In Seconds". VERIFIED, own tally of repository-generated docs.
- Setting the interval to 0 disables drift correction and "is irreversible", the annotation is available from Config Connector 1.102, and it "does not affect retry intervals when reconciliation fails". VERIFIED.
- Failure backoff starts at 250 ms, doubles, and has a 120-second default ceiling, and the ceiling annotation `cnrm.cloud.google.com/backoff-max-delay-in-seconds` is supported only for direct controllers and needs 1.160.0 or later. VERIFIED.
- Whether a direct-controller kind that also has a Terraform mapping takes the Terraform mapping interval is UNVERIFIED, an inference from the GVK lookup that was not tested. A measured drift latency on a live cluster is UNVERIFIED.

Kubernetes staleness
- The counter `stale_sync_skips_total` (ALPHA, labels `group` and `resource`) is defined under `replicaset_controller`, `statefulset_controller`, `daemonset_controller` and `job_controller`, and the StatefulSet counter was registered at v1.37.0 and not shown registered at v1.36.0. VERIFIED.
- The informer gauge `informer_store_resource_version` is ALPHA, has subsystem `informer`, labels `name`, `group`, `version`, `resource`, and the help "The 15 least significant digits of the resource version of the store." VERIFIED at v1.36.0.
- A 1.38 changelog entry says the gauge no longer reports 0 before a store records a resource version (pull request 143314). VERIFIED.
- At v1.36.0 the per-controller gates for DaemonSet, Job, ReplicaSet and StatefulSet are Beta, default true from 1.36, and depend on client-go `AtomicFIFO`, and `AtomicFIFO` and `UnlockWhileProcessingFIFO` are Beta, default true from 1.36. VERIFIED.
- `StaleControllerConsistencyHPA` is already in v1.37.0 (Beta, default true from 1.37) and master, and it is absent at v1.36.0. VERIFIED, corrected in the dossier's verification pass.
- KEP 5647 `kep.yaml` reads `status: implementable`, stage beta, milestone beta v1.37, with four gates, and the tracking issue is open with `lifecycle/stale` and no milestone. VERIFIED.
- The KEP README says `MonitorInformerStaleness` "requires a direct get to the apiserver to determine staleness every 5 seconds" and names no metrics. VERIFIED.
- `MonitorInformerStaleness` is absent from `kube_features.go` at v1.36.0, v1.37.0 and master, from client-go `known_features.go` at three refs, and from a GitHub code search of kubernetes/kubernetes. VERIFIED as absence.
- `ResourceEventHandlerFuncs` has only AddFunc, UpdateFunc and DeleteFunc at v1.36.0 and master, while the client-go `Store` interface has a different `Bookmark(rv string)` method. VERIFIED.
- The text of the v1.36 blog post was not re-read in this pass, and a possible later release for `MonitorInformerStaleness` or handler `BookmarkFunc` is UNVERIFIED.

## What this settles

The Config Connector controller-kind gap is settled as a checkable mapping with counts, a direction of travel, and a routing rule, and the only thing left open is the migration date of any kind. The reconcile-interval gap is settled for the default and for per-kind overrides, and a measured latency and the Terraform/direct overlap case stay open. The staleness gap is settled for metric names, gate shapes and KEP status, and it shows that two mechanisms the KEP and blog describe are not in released source.

## Pages touched

New pages are [[findings/config-connector-s-static-config-table-lists-814-kinds-and-sets-direct-as-the-default-for-539-of-them]], [[findings/config-connector-routes-a-kind-to-its-controller-by-namespace-override-then-static-default-and-a-live-crd-label-shows-which-one-runs]], [[findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence]], [[findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds]], [[findings/config-connector-has-no-separate-drift-poll-and-the-failure-backoff-annotation-works-only-for-direct-controllers-from-1-160-0]], [[findings/kubernetes-v1-37-0-already-carries-the-horizontal-pod-autoscaler-staleness-gate-and-every-per-controller-gate-depends-on-atomicfifo]], [[findings/monitorinformerstaleness-and-the-handler-bookmarkfunc-are-absent-from-kubernetes-v1-36-0-v1-37-0-and-master-source]], [[findings/kep-5647-is-implementable-with-a-beta-v1-37-target-and-an-open-tracking-issue-labelled-lifecycle-stale]], [[examples/config-connector-computesslcertificate-and-serviceidentity-set-a-reconcile-interval-of-zero-in-their-terraform-service-mappings]], [[examples/config-connector-serviceusage-service-and-bigtable-instance-and-table-reconcile-hourly-by-service-mapping]], [[examples/config-connector-alloydbcluster-and-billingbudgetsbudget-show-kinds-that-support-more-than-one-controller]], [[examples/kubernetes-pull-request-143314-fixed-the-informer-store-resource-version-gauge-reporting-zero-before-a-store-recorded-a-version]], and [[decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource]].

Touched pages are [[entities/config-connector]], [[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]], [[comparisons/drift-detection-mechanisms-across-tools]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[decisions/choosing-a-drift-check-interval-for-external-resources]], [[findings/drift-detection-latency-is-the-interval]], [[findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source]], [[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]], [[findings/stale-cache-and-double-action]], [[concepts/informers-reflectors-and-workqueues]], and [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]].

## Open questions the dossier leaves

The release in which each Config Connector kind moved to direct, a published per-kind controller list, the interval used by a kind that has both a Terraform mapping and a direct controller, a measured drift latency on a live cluster, the later release of `MonitorInformerStaleness` or handler `BookmarkFunc`, and the contents of the v1.36 blog post as re-read this pass are all unanswered.

## Related

[[open-knowledge-gaps]], [[sources/research-gap-g3-reconcile-defaults]], [[sources/research-gap-b1-recheck-flux-k8s]], [[sources/research-gap-g3-k8s-and-controller-runtime]], [[sources/research-gap-o4-config-connector-ack]]
