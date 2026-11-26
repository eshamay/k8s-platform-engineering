---
title: Flux
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
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
  - id: research-admission-webhooks-and-cel
    hash: c04dbed76ad9
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
  - id: research-composition
    hash: f57d89652816
    ingested: 2026-11-25
  - id: research-flux-deep-dive
    hash: e640ec8046bc
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
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [Flux CD, FluxCD]
tags: [tool, gitops]
---

# Flux

A GitOps tool that runs in-cluster and pulls KRM manifests from Git, then applies them to the API server. The seed note uses it as the example of [[concepts/gitops-pull-based-delivery]] and of a co-manager that relies on [[concepts/server-side-apply-and-field-ownership]]. [[sources/krm-platform-vocabulary]]

## Components and Kustomization behavior

Flux is a set of single-purpose controllers (source, kustomize, helm, notification, and image automation) that communicate through CRDs. In the documentation's words, "The APIs comprise Kubernetes custom resources, which can be created and updated by a cluster user, or by other automation tooling." The Kustomization API provides `dependsOn` (apply after dependencies are Ready), `prune` (delete objects removed from Git), `healthChecks` and `wait` (readiness gating), and `force` (recreate on immutable-field change, risky for StatefulSets). Drift is corrected on an interval through server-side apply dry runs, and CRDs and their controllers must be reconciled before the custom resources that use them. [[sources/research-universal-control-plane]]

See [[findings/destructive-deletion-of-external-resources]], [[findings/immutable-fields-and-drift-collisions]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], and [[entities/argo-cd]].

## Declarative behavior details

The concepts page defines sources that produce artifacts, which Kustomization and HelmRelease objects apply, with reconciliation on an interval that reverts manual changes unless suspended. The Kustomization API adds a per-object prune opt-out annotation, a deletion policy (MirrorPrune, Delete, WaitForTermination, Orphan), and `force`, which should be set only temporarily because it can cause downtime. The concepts page says the default interval is five minutes, while the Kustomization API page marks `.spec.interval` as required and only recommends a 60 second minimum. Correction 2026-11-26: no controller-side default exists, so the five-minute figure is not a default, see [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]]. [[sources/research-declarative-vs-imperative]] See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]] and [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]].

## Interval, retry, and suspend

The Kustomization `.spec.interval` (required, with a recommended minimum of 60 seconds that the CRD does not enforce) re-fetches, builds, and applies on a schedule, with a server-side apply dry run each cycle for drift detection. `.spec.retryInterval` governs failures, reconcile also runs immediately on source revision or metadata changes, `.spec.suspend` stops applying and drift detection, and `.spec.force` recreates objects on immutable-field conflicts. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]] and [[examples/gitops-reverts-a-hand-edited-deployment]].

## Convergence behavior

Flux re-reconciles a Kustomization at `spec.interval` (required, recommended minimum 60 seconds), uses a server-side apply dry run to detect drift, reconciles immediately when the generation or source revision changes, and separates `retryInterval` for failures. `dependsOn` makes dependents wait for Ready, and `wait` and `healthChecks` define readiness. `force` handles immutable fields at the risk of downtime. [[sources/research-eventual-consistency-and-convergence]] See [[examples/flux-dependson-and-health-checks-gate-rollout]] and [[findings/drift-detection-latency-is-the-interval]].

## Related concepts

[[concepts/declarative-vs-imperative]], [[concepts/self-healing-and-drift-detection]], [[concepts/conditions]]

## To research

Component architecture, multi-tenancy, health checking, dependency ordering, scale behavior, and a ramp-up tutorial. See [[open-knowledge-gaps]] for the lifecycle trace.

## Helm drift detection and field ownership

A HelmRelease has `spec.driftDetection.mode` with `disabled` (the default), `warn`, and `enabled`. The controller runs a server-side dry-run apply of the stored Helm manifest and patches differences, ignore rules take JSON Pointers with optional target selectors, and `.spec.interval` sets the cadence. Since Flux v2.2.0 this is a per-release option and no longer a controller-wide feature gate. The Kustomization `ssa` annotation (`IfNotPresent`, `Ignore`) opts single objects out. A community discussion shows the dry-run failing after a `kubectl edit` of a Service port, with `--override-manager` reported as the fix. [[sources/research-self-healing-and-drift-detection]] See [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]], [[findings/field-ownership-blocks-drift-correction]], [[comparisons/exemption-and-ignore-controls-across-tools]], and [[entities/tofu-controller]].

## Components, sources, and tenancy

Flux is built from GitOps Toolkit controllers: source controllers fetch from Git, OCI, Helm repositories, and buckets and expose artifacts; the Kustomize and Helm controllers apply them; the notification controller handles alerts and webhooks; and image automation controllers update manifests. Kustomizations reconcile on the author-set `spec.interval` and revert manual changes unless suspended (the concepts page's "every five minutes by default" is not a controller default, see the correction note at the end of this page). Bootstrap installs Flux and commits its own manifests so Flux manages itself. The Kustomize controller adds SOPS and KMS decryption, health assessment, `dependsOn` ordering, garbage collection, and service-account impersonation for multi-tenant RBAC isolation. In the ControlPlane D2 design, Flux pulls signed OCI artifacts through a FluxInstance and ResourceSet resources so that clusters never connect to Git. [[sources/research-gitops-pull-based-delivery]] See [[comparisons/flux-versus-argo-cd-architecture]], [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]], and [[decisions/git-versus-oci-as-the-canonical-source]].

## Ordering around CRDs and discovery

The Kustomization API orders work with `.spec.dependsOn`, `.spec.healthChecks`, and `.spec.wait`. The documented pattern puts CRD-providing controllers in one Kustomization and the custom resources in another that depends on it, so the dependent is applied only after the referred Kustomizations are ready. Health checks reference resources by apiVersion and kind, so they also depend on discovery. [[sources/research-gvk-and-gvr]] See [[comparisons/missing-crd-handling-flux-versus-argo-cd]], [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]], and [[findings/custom-resources-applied-before-their-crd-exists]].

## CRD policies in HelmRelease

A HelmRelease has `spec.install.crds` and `spec.upgrade.crds` with Skip, Create (the default), and CreateReplace policies, because Helm has no native support for upgrading or deleting CRDs. CreateReplace updates existing CRDs but does not delete removed ones, and `dependsOn` should order CRD-providing releases first. [[sources/research-custom-resource-definition]] See [[examples/flux-helmrelease-crd-policies-createreplace-and-dependson]] and [[findings/helm-does-not-upgrade-or-delete-crds]].

## Status and readiness semantics

Flux HelmRelease status carries the conditions `Ready`, `Reconciling`, `Stalled`, `Released`, and `TestSuccess`, plus `observedGeneration`, failure counters, last-attempted revision, config digest, and release action, `lastHandledReconcileAt`, and a pointer to the generated HelmChart. `Reconciling=True` is normal progress, and an `observedGeneration` below `metadata.generation` means a spec change is pending. Flux relies on kstatus to judge dependency readiness, and it added CEL-based custom health checks for Cluster API after kstatus stopped fitting. [[sources/research-spec-status-split]] See [[examples/flux-helmrelease-status-records-attempts-and-health]], [[examples/cluster-api-readiness-gates-flux-dependents]], and [[entities/kstatus]].

## Server-side apply and field ownership

kustomize-controller applies with server-side apply and runs a server-side dry-run on each interval. Its controls are the `kustomize.toolkit.fluxcd.io/ssa` annotation (`Override`, `Merge`, `IfNotPresent`, `Ignore`), the `force` annotation for immutable-field changes, `.spec.ignore` rules with Strip and Adopt semantics, and the `flux-client-side-apply` manager name that preserves kubectl edits. Moving from client-side apply in Flux 0.17 to server-side apply in 0.18 left removed fields in the cluster, and a stale manager that co-owns a list entry key can make the dry-run fail every reconcile. Issue 1722 was closed through PR 1747 with the opt-in flag `--override-manager-before-dry-run`, which first shipped in kustomize-controller v1.10.0 (2026-10-24) and is bundled in Flux v2.10.0 (2026-10-26). It is a separate list from `--override-manager`, which still takes over the named managers only after a successful dry-run. The new flag transfers all fields of the named managers before the dry-run, prunes fields missing from the source, is not reverted if the apply fails, matches names exactly, and leaves the default managers on the post-dry-run path. The documentation says to use it only to recover stuck objects and to remove it afterwards. Correction: earlier text here said the final semantics were not verified. [[sources/research-server-side-apply-and-field-ownership]] [[sources/research-gap-g3-flux-ssa-helm]] See [[decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager]], [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]], [[findings/flux-documents-its-override-manager-flags-on-the-controller-options-page-and-not-on-the-kustomization-spec-page]], [[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]], [[examples/flux-migration-from-client-side-apply-strands-removed-fields]], and [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]].

## Admission webhooks and dry-run

kustomize-controller applies with a server-side dry-run first, so a webhook that does not declare `sideEffects` of `None` or `NoneOnDryRun` makes reconciliation fail with "admission webhook does not support dry run". The cheatsheet says to fix the webhook configuration, not Flux, and it also covers the five-minute health-check timeout and `disableWait`. [[sources/research-admission-webhooks-and-cel]] See [[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]] and [[findings/webhooks-without-sideeffects-declared-break-dry-run-clients]].

## One controller per concern

The Flux components page describes Flux as built from the GitOps Toolkit: specialized controllers for source, kustomize, helm, notification, and image automation, each reconciling its own CRDs, plus composable APIs and reusable Go packages. The operator-pattern dossier cites this as the clearest example of the one-controller-per-concern split. [[sources/research-operator-pattern]] See [[examples/flux-splits-gitops-into-single-purpose-controllers]] and [[concepts/operator-pattern]].

## Interval, retry, and timing in the reconciliation-loop dossier

The Kustomization reference describes `spec.interval` as the required periodic reconcile cadence with a recommended 60 second minimum, `retryInterval` as the delay after failures (defaulting to `interval`), `timeout` as the bound on build, apply, and health-check work, and `suspend` as the switch that pauses reconciliation and drift correction. Jitter can spread many Kustomizations, and a manual reconcile can be requested by annotation. The dossier read only the first 100,000 of about 121,600 characters of the page. [[sources/research-reconciliation-loop]] See [[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]] and [[concepts/reconciliation-loop]].

## Repeated apply as idempotency

The idempotency dossier treats the Kustomization as scheduled, repeated apply: each `.spec.interval` runs a server-side apply dry-run to detect and correct drift, a new revision or generation is handled immediately, `.spec.prune` garbage-collects dropped objects with a `prune: disabled` annotation as protection, `.spec.retryInterval` retries failures, and jitter avoids load spikes. Conflicting field ownership is the signal that another actor changed the object. The dossier's quoted example uses a ten-minute interval, which is an example and not a stated default. [[sources/research-idempotency]] See [[concepts/idempotency]].

## Concurrency and cache knobs

The vertical scaling page says Flux raises parallel reconciles with `--concurrent` flags, caches Helm indexes in the source controller with `--helm-cache-max-size` and `--helm-cache-ttl`, prefers persistent volumes to EmptyDir for artifacts, and warns that tmpfs counts against pod memory. The page describes tuning and not the informer implementation or sharding. [[sources/research-informers-reflectors-and-workqueues]] See [[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]] and [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].

## Deletion policy and finalizers

The Kustomization reference says garbage collection also runs when a Kustomization is deleted. `spec.deletionPolicy` takes MirrorPrune (default), Delete, WaitForTermination, or Orphan, and WaitForTermination waits for children to leave etcd, bounded by the Kustomization timeout, and the finalizer is removed even when the wait fails (correction recorded 2026-11-26). The per-object `kustomize.toolkit.fluxcd.io/prune: disabled` annotation opts an object out of pruning. The finalizer name `finalizers.fluxcd.io` is confirmed from the kustomize-controller source, see [[findings/flux-kustomization-uses-finalizers-fluxcd-io-and-removes-it-even-when-waitfortermination-times-out]]. [[sources/research-gap-m1-finalizers]] [[sources/research-finalizers]] See [[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]] and [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].

## Pruning without owner references

Flux garbage collection is its own mechanism. With `.spec.prune: true`, objects missing from the current source revision are removed using the inventory in `.status.inventory`, the annotation `kustomize.toolkit.fluxcd.io/prune: disabled` exempts an object, and `.spec.deletionPolicy` (MirrorPrune, Delete, WaitForTermination, Orphan) governs deletion of the Kustomization itself. Whether Flux ever relies on owner references was not stated in the part of the page that the dossier read. [[sources/research-owner-references-and-garbage-collection]] See [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].

## Conditions and health checks

Flux's kustomize-controller reports `Ready`, `Reconciling`, and `Stalled` plus `observedGeneration`. It waits for applied resources to become healthy before marking a Kustomization `Ready`, which unblocks Kustomizations that `dependsOn` it. Compatible custom resources are judged through kstatus, and for kinds that do not follow kstatus, `healthCheckExprs` supplies CEL expressions. Flux added CEL checks for Cluster API resources after kstatus misjudged new objects. The dossier read only the first 100 KB of the Kustomization page. [[sources/research-conditions]] See [[concepts/conditions]], [[findings/premature-readiness-in-kstatus-based-tools]], and [[examples/flux-dependson-and-health-checks-gate-rollout]].

## Prune cascades into managed resource deletion

With `spec.prune: true`, a Kustomization deletes objects that disappeared from Git, tracked through `.status.inventory`, and the annotation `kustomize.toolkit.fluxcd.io/prune: disabled` exempts an object. For managed resources a Git removal becomes a prune of the object followed by a provider delete of the cloud resource, unless Delete is excluded from `managementPolicies`. The dossier read only the first 100,000 of about 121,000 characters of the Flux page. [[sources/research-managed-resource]] See [[findings/unintended-deletion-through-prune]] and [[decisions/choose-management-policies-for-an-imported-resource]].

## Ordering and pruning of manifest sets in the Compositions dossier

The Compositions dossier presents Flux as handling ordering, health, and garbage collection at the level of whole manifest sets, without defining a new API. `dependsOn` applies a Kustomization only after the referenced ones are Ready, `healthChecks`, `wait`, and CEL `healthCheckExprs` define readiness (a wrong CEL expression stalls until timeout), and `prune: true` garbage-collects objects removed from Git with a deletion policy for composed children that should be orphaned or retained. [[sources/research-composition]] See [[examples/flux-dependson-and-health-checks-gate-rollout]] and [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Architecture, tenancy, and scale in the Flux deep dive

The Flux deep dive describes the GitOps Toolkit as source, kustomize, helm, notification, and image automation controllers that communicate only through custom resources, with the source controller packaging Git, OCI, Helm, and bucket content as tar.gz artifacts that downstream controllers consume in-cluster. Because the API types are Go packages, the controllers are ordinary controller-runtime programs, and anyone can use them with a controller-runtime client. The operational knobs are `dependsOn`, `healthChecks` and `wait` with CEL expressions, `prune`, `retryInterval`, `timeout`, Helm remediation, tenant ServiceAccount impersonation with the `--default-service-account`, `--no-cross-namespace-refs`, and `--no-remote-bases` flags, and label-based sharding with `sharding.fluxcd.io/key`. Extra replicas are failover standbys because only the elected leader reconciles. [[sources/research-flux-deep-dive]]

Morgan Stanley reports more than 500 clusters, a self-service onboarding platform, S3 buckets as the artifact source, and tuned intervals and concurrency, with sharding and OCI artifacts on the roadmap. The adopters page lists more than 200 organizations. See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]], [[examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation]], [[examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging]], [[examples/teams-replace-helm-upgrade-in-ci-with-flux-helmrelease-objects]], [[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[examples/flux-notification-receivers-start-reconciliation-without-waiting-for-the-poll-interval]], [[entities/flux-operator]], [[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]], [[comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog]], and [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]].

The pitfalls the dossier names are covered in [[findings/without-lockdown-flags-a-flux-kustomization-applies-with-the-controllers-own-identity]], [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]], [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]], [[findings/circular-dependson-chains-between-flux-resources-never-reconcile]], [[findings/without-prune-flux-leaves-removed-manifests-running-as-orphans]], [[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]], and [[findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent]]. The dossier found no independent Flux postmortem and no verified relationship with Crossplane, kro, Config Connector, ACK, or Cluster API beyond the inference that Flux deploys their custom resources.

## Position in the tooling landscape

Flux is the toolkit-style option in the delivery layer of [[concepts/tooling-landscape]]. Its documentation describes source controllers that fetch from Git, OCI, Helm repositories, and buckets, kustomize and helm controllers that apply, a notification controller, and image automation controllers, each owning a CRD, under the tagline "composable APIs, reusable Go packages for GitOps" (https://fluxcd.io/flux/components/). Akuity says Flux uses native Kubernetes RBAC with a lockdown mode, has a lower and more predictable footprint, suits air-gapped setups, relies on CI or Flagger for promotion, and gets its official UI from the Flux Operator, all from a vendor that sells Argo CD. See [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]] and [[entities/tofu-controller]] for the Flux-family Terraform controller. [[sources/research-landscape]]

## Sharding and vertical scaling in the scale dossier

The scale dossier describes two ways to add capacity to Flux. Vertical scaling raises `--concurrent` to a suggested 10 to 20, raises CPU and memory limits for the kustomize, helm, and source controllers, puts `/tmp` on a memory-backed `emptyDir` to speed up Kustomize builds, tunes the Helm index cache flags, and uses persistent volumes so artifacts survive restarts. Sharding runs several instances of the source, kustomize, and helm controllers, each started with a `--watch-label-selector`, and assigns objects to a shard through the label `sharding.fluxcd.io/key`. Notification-controller and source-watcher cannot be sharded. Multi-tenant platforms are the typical sharding scenario, and the dossier names no organization running Flux shards. See [[concepts/scale-and-sharding]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]], and [[sources/research-scale-and-sharding]]. URLs: https://fluxcd.io/flux/installation/configuration/sharding/ and https://fluxcd.io/flux/installation/configuration/vertical-scaling/.


## Ignore rules for drift fights in the pitfalls dossier

The pitfalls dossier reports that kustomize-controller reverts any field another controller changes, such as HPA replicas or a cainjector-written `caBundle`, and that a Flux user hit a SEV2 when Flux, the HPA, and the cluster autoscaler looped. Flux added a Kustomization `.spec.ignore` list of JSON Pointer paths with an optional target selector. Flux strips the field when another server-side apply manager owns it and adopts the live value when it is the sole owner. Ignored fields do not trigger reconciliation, `flux diff` honours the rules, and Git changes to an ignored field are no longer applied. See [[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]], [[findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied]], [[concepts/pitfalls-and-case-studies]], and [[sources/research-pitfalls-and-case-studies]]. URL: https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/.

## Interval default and drift wording in the reconcile-defaults dossier

The 2026-11-26 verification settles the default question. `.spec.interval` is required on both the Kustomization and the HelmRelease, the CRD Go type carries only a duration-format pattern with no default and no minimum, and the reference says "The minimum value should be 60 seconds", which is a recommendation. The `flux create` command's global `--interval` flag defaults to one minute, which is the only default found. The concepts page's "every five minutes by default" therefore matches no controller behavior, and the ten-minute figure in the reference is an example of drift-check cadence. Drift correction happens on the interval (the reference says reconciliation applies the Kustomization "correcting any existing drift"), source or spec changes are handled instantly outside the interval, `retryInterval` defaults to `.spec.interval`, and the controller can be configured with jitter whose value was not read. A guide example uses `interval: 60m0s` with the comment "detect drift and undo kubectl edits every hour". [[sources/research-gap-g3-reconcile-defaults]] See [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]] and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].

## Incident from the GitOps incidents dossier

Flux issue 2514 (2022) reports replicas dropping to 1 on the first reconciliation over an HPA-managed Deployment, see [[examples/flux-issue-2514-the-first-reconciliation-over-an-hpa-managed-deployment-reset-replicas-to-one]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].

## Adopters page re-read

Correction note: the adopters sentence above says the page lists more than 200 organizations. The 2026-11-26 dossier read the data file `1-flux-v2.yaml` and counted 127 `name:` lines, a few of which may not be companies, and the page front matter calls the list "a selection of organisations who self-identified as using any of the Flux projects in production". The earlier figure was not reproduced from that file, so treat it as unverified. The dossier also found that Morgan Stanley lists sharding as future work and that no organization was found running sharded Flux. See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]]. [[sources/research-gap-g1-named-adopters]]

## Interval jitter, five-minute wording, and helm-controller from the Flux and Kubernetes recheck

Correction note, 2026-11-26: the sentence in the components section that Kustomizations reconcile every 5 minutes by default was wrong as a controller statement, because `.spec.interval` is required and no controller supplies a default. It is replaced in place above. The controller does apply jitter: `--interval-jitter-percentage` defaults to 5 and is symmetric, so every requeue varies by plus or minus 5 percent of the interval, in both kustomize-controller and helm-controller ([[findings/flux-controllers-jitter-reconcile-intervals-by-plus-or-minus-5-percent-by-default]]). The concepts page's five-minute sentence replaced "one minute" in a docs commit on 2022-08-10 with no stated reason ([[findings/the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason]]). The earlier line that the jitter value was not read is now answered. The kustomize-controller options page documents both `--override-manager` (takes over only after a successful dry-run) and `--override-manager-before-dry-run`. The helm-controller `--override-manager` flag is confirmed since v1.5.0 (2026-02-20), HelmRelease install defaults to server-side apply, and drift detection stays disabled by default ([[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]]). The statement that drift detection has been a per-release option since Flux v2.2.0 was not rechecked and stays unverified. [[sources/research-gap-b1-recheck-flux-k8s]]

## Condition and generation practice in the m3 dossier

Flux's condition setter stamps the current generation on every condition, its Kustomization status also keeps a top-level `observedGeneration`, and it mixes abnormal-true `Stalled` and `Reconciling` with a positive `Ready`. [[sources/research-gap-m3-status-conditions]] See [[examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration]] and [[entities/kstatus]].
