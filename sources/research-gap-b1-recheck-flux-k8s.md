---
title: "Research dossier: recheck of Flux and Kubernetes gaps (b1-recheck-flux-k8s)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: 636010fe6081
    ingested: 2026-11-26
aliases: []
tags: [flux, helm, kubernetes, controller-runtime, research-dossier, gap-closing, targeted-pass, verification, source-code]
---

# Research dossier: recheck of Flux and Kubernetes gaps (b1-recheck-flux-k8s)

> [!NOTE]
> **Raw file:** `raw/research-gap-b1-recheck-flux-k8s.md` (sha256 prefix 636010fe6081; revised from c78dc9a9635e, see Revision note)<br>
> **Kind:** Verified research dossier for gap cluster b1-recheck-flux-k8s, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the Flux, Helm, Kubernetes, and controller-runtime pages that earlier dossiers left under "Not settled"<br>
> **Caveat:** The evidence is Go source at tagged refs, Markdown documentation, KEP files, changelogs, and issue and pull request threads read through the gh CLI, plus three scraped pages. No cluster was run, so behavior inferred from code (such as the unregistered StatefulSet metric at v1.36.0) was not tested live.

## Summary

The dossier rechecked seven gaps by reading raw text. For Flux it settles that the controller jitter default is plus or minus 5 percent, set by the `--interval-jitter-percentage` flag from the shared fluxcd/pkg runtime, and that the concepts page's "five minutes by default" sentence replaced "one minute" in a single docs commit on 2022-08-10 with no stated reason. It confirms the helm-controller `--override-manager` flag (v1.5.0, 2026-02-20), documents how Helm 4 and helm-controller choose server-side apply, and confirms that the kustomize-controller options page documents both takeover flags.

For Kubernetes it explains why the Mutating Admission Policy docs say v1.30 (the gate was registered as an inert Alpha placeholder in v1.30.0, the usable API arrived in v1.32), shows that StorageVersionMigration reports progress only as text in the `Running` condition message, and records the v1.36 staleness mechanisms, including a StatefulSet skip metric that was defined but not registered at v1.36.0. For controller-runtime it finds that issue 808 never claims `Requeue: true` is immediate. For scale it reads the rest of KEP-1040 (API Priority and Fairness).

## Key claims

- The `--interval-jitter-percentage` default is 5, and the jitter is symmetric, plus or minus the percentage. VERIFIED. https://github.com/fluxcd/pkg/blob/main/runtime/jitter/interval.go ("defaultIntervalJitterPercentage = 5") and https://fluxcd.io/flux/components/kustomize/options/
- kustomize-controller and helm-controller both bind the flag and call `SetGlobalJitter`, and kustomize-controller wraps its success requeue in `jitter.JitteredIntervalDuration(obj.GetRequeueAfter())`. VERIFIED. https://github.com/fluxcd/kustomize-controller/blob/main/internal/controller/kustomization_controller.go
- The jitter default became plus or minus 5 percent on 2023-08-07 (fluxcd/pkg commit b73ba327). VERIFIED.
- Jitter is not applied when the percentage is 0 or 100 or more. VERIFIED from the package source.
- A code comment in the jitter package uses "requeue every 5 minutes" as a worked example. That this example feeds the five-minute folklore is the dossier's inference and is UNVERIFIED.
- fluxcd/website commit 962bf6f9 (2022-08-10, "Add OCIRepository docs", by Stefan Prodan) changed "The reconciliation runs every one minute by default" to "every five minutes by default" in the concepts page. VERIFIED. https://github.com/fluxcd/website/commit/962bf6f9
- The commit message gives no reason for the change, and no issue or pull request discussion was located. The reason is UNVERIFIED.
- The sentence is unchanged on the current website main branch (content/en/flux/concepts.md, line 90). VERIFIED.
- The Kustomization reference says `.spec.interval` "is a required field", that "The minimum value should be 60 seconds", and that source or spec changes are handled "instantly outside the interval window". VERIFIED. https://github.com/fluxcd/kustomize-controller/blob/main/docs/spec/v1/kustomizations.md
- The kustomize-controller options page documents `--override-manager` as taking over "only after a successful server-side apply dry-run" and `--override-manager-before-dry-run` as taking over "before the dry-run". VERIFIED. https://fluxcd.io/flux/components/kustomize/options/
- helm-controller defines `--override-manager` as a string-array flag ("List of field managers to override during drift detection"), added in v1.5.0 (release date 2026-02-20, PR 1365). VERIFIED. https://github.com/fluxcd/helm-controller/blob/main/CHANGELOG.md
- The helm-controller changelog says its drift detection "is completely unrelated to Helm v4's server-side apply support". v1.5.0 also moved the controller to Helm v4 and defaulted new HelmReleases to server-side apply. VERIFIED.
- The HelmRelease `driftDetection` mode "defaults to DiffModeDisabled" (values `enabled`, `warn`, `disabled`), uses a server-side dry-run apply, and with `enabled` corrects by creating and patching resources. VERIFIED. https://github.com/fluxcd/helm-controller/blob/main/docs/spec/v2/helmreleases.md
- The helm.sh overview says Helm 4 defaults to server-side apply for new releases and that releases created by Helm 3 stay on client-side apply after the upgrade. The `helm` CLI takes `--server-side` with true, false, or auto, and `--force-conflicts` is mutually exclusive with `--force-replace` and the deprecated `force`. VERIFIED. https://helm.sh/docs/overview/
- HelmRelease `.spec.install.serverSideApply` defaults to true (false under the `UseHelm3Defaults` gate), the upgrade and rollback equivalents take `enabled`, `disabled`, or `auto` with default `auto`, and `force` "is ignored for server-side apply". VERIFIED.
- That drift detection became a per-release option "since Flux v2.2.0" was not rechecked. UNVERIFIED.
- The Mutating Admission Policy docs say "Stable since Kubernetes v1.36; enabled by default" and "It was first available in the v1.30 release". VERIFIED as page text. https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy/
- The gate `MutatingAdmissionPolicy` was registered in v1.30.0 as Alpha with default false (PR 123425, merged 2024-02-22), the `v1alpha1` API was introduced in v1.32, and the v1.36.0 gate table reads Alpha 1.32, Beta 1.34, GA 1.36 with default true. KEP 3962 gives alpha v1.32, beta v1.34, stable v1.36. VERIFIED.
- That the "first available in v1.30" sentence is generated by the `feature-state` shortcode and absent from the page's Markdown source is SECONDARY-ONLY, an inference from the source file because the shortcode implementation was not read.
- Whether the `admissionregistration.k8s.io/v1` group for MAP is served by default beyond the gate default was not checked. UNVERIFIED.
- At v1.37.0 the `storagemigration.k8s.io/v1` type has an immutable `spec.resource` and a `status` with `conditions` (types `Running`, `Succeeded`, `Failed`) and `resourceVersion`, and no numeric progress field. VERIFIED. https://github.com/kubernetes/kubernetes/blob/v1.37.0/staging/src/k8s.io/api/storagemigration/v1/types.go
- Progress is text in the `Running` condition message: "The migration is running", then ", N/M objects not yet migrated" or ", M objects verified migrated", plus "; transient error: <err>" when one occurred. On completion `Running` becomes False with reason `MigrationCompleted`, and `Succeeded` becomes True with reason `StorageVersionMigrationSucceeded` and message "Migration completed". VERIFIED from `util.go`, `storageversionmigrator.go`, and `migrationrunner.go` at v1.37.0.
- For CRDs the controller sets a `StorageMigrating` condition, and PR 135297 (merged 2026-03-11) removes old stored versions from the CRD status after migration. PR 138560 ("Promote SVM to GA") merged 2026-07-08. VERIFIED.
- The SVM GA blog and the KEP 4192 text for the progress layout were not read. UNVERIFIED.
- controller-runtime issue 808 (opened 2020-02-20, still open, 13 comments, all read) is a documentation request and does not say that `Requeue: true` is immediate. VERIFIED. https://github.com/kubernetes-sigs/controller-runtime/issues/808
- Issue 617 (2019-09-30) states that with `result.Requeue` true the request "is added to the queue with the same exponential backoff logic used when an error is returned", and source at v0.4.0, v0.7.0, and v0.15.0 calls `c.Queue.AddRateLimited(req)` for `result.Requeue`. VERIFIED.
- Pull request 3107 (merged 2025-02-24) deprecated `Requeue` with the rationale "There is no good reason to use this setting, either an error or `RequeueAfter` should be used instead." Pull request 3574, which says "Fixes #808" by documenting the behavior, is open and unmerged. VERIFIED.
- The origin of the "immediate requeue" reading was not found. UNVERIFIED.
- The v1.36 blog (2026-04-28) lists four controllers (DaemonSet, StatefulSet, ReplicaSet, Job), the gates `StaleControllerConsistency<API type>`, and the metrics `stale_sync_skips_total` and `store_resource_version`. VERIFIED. https://kubernetes.io/blog/2026/04/28/kubernetes-v1-36-staleness-mitigation-for-controllers/
- At v1.36.0 the four per-controller gates are Beta with default true from 1.36 and each depends on client-go `AtomicFIFO` (Beta, default true from 1.36). v1.37.0 adds `StaleControllerConsistencyHPA`. VERIFIED.
- The skip counter is `stale_sync_skips_total` (ALPHA, labels `group` and `resource`) under per-controller subsystems, giving `replicaset_controller_stale_sync_skips_total`, `statefulset_controller_stale_sync_skips_total`, `daemonset_controller_...`, `job_controller_...`, and from v1.37 `horizontal_pod_autoscaler_controller_...`. VERIFIED from source at v1.36.0 and v1.37.0.
- At v1.36.0 the StatefulSet `Register()` registered only `MaxUnavailable` and `UnavailableReplicas`, so the StatefulSet skip metric was defined but not registered. PR 138451 (merged 2026-04-23, milestone v1.37) fixed it. VERIFIED by code reading and the CHANGELOG-1.37 line, not tested on a running cluster.
- `informer_store_resource_version` is an ALPHA gauge in subsystem `informer` with labels name, group, version, resource, and the help text "The 15 least significant digits of the resource version of the store." VERIFIED. The blog's `store_resource_version` is the name without the subsystem prefix.
- KEP 5647's README (858 lines, title "Stale Controller Detection and Mitigation"; kep.yaml title "Stale Controller Handling") adds `BookmarkFunc func(resourceVersion string)` to `ResourceEventHandlerFuncs`, requeues a skipped object "the same way as if an error occurred", and proposes circuit breaking for node-lifecycle. Its monitoring section is template text, so the KEP names no metrics. VERIFIED.
- kep.yaml for KEP 5647 reads stage beta, milestone v1.37 (no alpha entry), and four gates (`StaleControllerConsistency`, `MonitorInformerStaleness`, `AtomicFIFO`, `UnlockWhileProcessingFIFO`), while the code has per-controller gates at Beta in v1.36. VERIFIED as a mismatch.
- `MonitorInformerStaleness` and `BookmarkFunc` in shipped code at v1.36.0, and any controller-runtime release that ships read-your-writes, are UNVERIFIED in this pass.
- KEP-1040 kep.yaml reads status implemented, stage stable, alpha v1.18, beta v1.20, stable v1.29, and the README's Implementation History ends at "v1.26: introduce concurrency borrowing between priority levels". VERIFIED.
- The KEP-1040 README says the fair-queuing solution "allocating the available seats equally rather than with max-min fairness" sometimes "pretends that a queue uses more seats than it can". It gives `width_approx(n) = min(A, ceil(N / E))` with E = 1 / B, a back-of-envelope memory-dominance point of about 400,000 objects, and an unfinished "[TODO: describe how `N` is estimated.]". VERIFIED.
- The KEP-1040 README names a failure mode in which a client that does not finish reading a large response can occupy "(hand size) X (max width = 10) seats" (linked to Kubernetes issue 115409), and its production readiness review says "a non-negligible latency is added to API calls". VERIFIED.
- The earlier scale figures (SIG Scalability, Gardener, Upbound, Argo CD processors, Crossplane) were not reread in this pass and stand as recorded. UNVERIFIED here.

## Revision note

The raw file was revised on 2026-11-26 after a second adversarial verification pass. It re-fetched the Flux jitter source, the helm-controller changelog and flags, the Mutating Admission Policy gate history, the StorageVersionMigration source at v1.37.0, the controller-runtime requeue source, the staleness gates and metrics, and the KEP 5647 and KEP-1040 claims through `gh`, and every one reproduced. No claim changed and no correction was needed beyond the four already recorded. The pass did not re-fetch the rendered kubernetes.io and fluxcd.io pages or the helm.sh overview, and it left unchecked the KEP-1040 test-coverage figures beyond the queueset line, the ReplicaSet `Register` call at both tags, the body of pull request 3574 beyond "Fixes #808", and the `MonitorInformerStaleness` code search. The pages written at seq 53 keep their original hash because none of their claims changed.

## Not found

- The reason for the 2022-08-10 change from "one minute" to "five minutes" in the Flux concepts page.
- The origin of the claim that `Result{Requeue: true}` requeues immediately.
- A `MonitorInformerStaleness` gate in Kubernetes code (it appears only in the KEP 5647 kep.yaml and blog-derived material).
- A structured numeric progress field on StorageVersionMigration status.
- The kubernetes.io StorageVersionMigration task page and the SVM GA blog (not read in this pass).

## Wiki pages built from this source

[[findings/flux-controllers-jitter-reconcile-intervals-by-plus-or-minus-5-percent-by-default]], [[findings/the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason]], [[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]], [[findings/the-mutating-admission-policy-gate-was-registered-in-v1-30-as-an-inert-alpha-placeholder-and-the-usable-api-arrived-in-v1-32]], [[findings/storageversionmigration-reports-progress-as-text-in-the-running-condition-message-and-has-no-numeric-progress-field]], [[findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate]], [[findings/the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37]], [[findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source]], [[findings/the-kep-1040-readme-history-stops-at-v1-26-while-its-kep-yaml-records-stable-in-v1-29]], [[findings/apf-fair-queuing-allocates-seats-equally-and-a-slow-reader-can-hold-hand-size-times-ten-seats]], [[examples/controller-runtime-pull-request-3107-deprecated-requeue-true-on-2025-02-24-and-pull-request-3574-to-document-it-is-still-open]], [[examples/kubernetes-pull-request-138451-registered-the-statefulset-stale-sync-skip-metric-in-v1-37]]
