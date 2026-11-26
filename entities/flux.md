---
title: Flux
type: entity
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
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
aliases: [Flux CD, FluxCD]
tags: [tool, gitops]
---

# Flux

A GitOps tool that runs in-cluster and pulls KRM manifests from Git, then applies them to the API server. The seed note uses it as the example of [[concepts/gitops-pull-based-delivery]] and of a co-manager that relies on [[concepts/server-side-apply-and-field-ownership]]. [[sources/krm-platform-vocabulary]]

## Components and Kustomization behavior

Flux is a set of single-purpose controllers (source, kustomize, helm, notification, and image automation) that communicate through CRDs. In the documentation's words, "The APIs comprise Kubernetes custom resources, which can be created and updated by a cluster user, or by other automation tooling." The Kustomization API provides `dependsOn` (apply after dependencies are Ready), `prune` (delete objects removed from Git), `healthChecks` and `wait` (readiness gating), and `force` (recreate on immutable-field change, risky for StatefulSets). Drift is corrected on an interval through server-side apply dry runs, and CRDs and their controllers must be reconciled before the custom resources that use them. [[sources/research-universal-control-plane]]

See [[findings/destructive-deletion-of-external-resources]], [[findings/immutable-fields-and-drift-collisions]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], and [[entities/argo-cd]].

## Declarative behavior details

The concepts page defines sources that produce artifacts, which Kustomization and HelmRelease objects apply, with reconciliation on an interval that reverts manual changes unless suspended. The Kustomization API adds a per-object prune opt-out annotation, a deletion policy (MirrorPrune, Delete, WaitForTermination, Orphan), and `force`, which should be set only temporarily because it can cause downtime. The concepts page says the default interval is five minutes while the API page says the minimum is 60 seconds, which needs verification. [[sources/research-declarative-vs-imperative]] See [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]] and [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]].

## Interval, retry, and suspend

The Kustomization `.spec.interval` (minimum 60 seconds) re-fetches, builds, and applies on a schedule, with a server-side apply dry run each cycle for drift detection. `.spec.retryInterval` governs failures, reconcile also runs immediately on source revision or metadata changes, `.spec.suspend` stops applying and drift detection, and `.spec.force` recreates objects on immutable-field conflicts. [[sources/research-level-triggered-vs-edge-triggered]] See [[comparisons/reconcile-cadence-and-off-switches-across-tools]] and [[examples/gitops-reverts-a-hand-edited-deployment]].

## Convergence behavior

Flux re-reconciles a Kustomization at `spec.interval` (minimum 60 seconds), uses a server-side apply dry run to detect drift, reconciles immediately when the generation or source revision changes, and separates `retryInterval` for failures. `dependsOn` makes dependents wait for Ready, and `wait` and `healthChecks` define readiness. `force` handles immutable fields at the risk of downtime. [[sources/research-eventual-consistency-and-convergence]] See [[examples/flux-dependson-and-health-checks-gate-rollout]] and [[findings/drift-detection-latency-is-the-interval]].

## Related concepts

[[concepts/declarative-vs-imperative]], [[concepts/self-healing-and-drift-detection]], [[concepts/conditions]]

## To research

Component architecture, multi-tenancy, health checking, dependency ordering, scale behavior, and a ramp-up tutorial. See [[open-knowledge-gaps]] for the lifecycle trace.

## Helm drift detection and field ownership

A HelmRelease has `spec.driftDetection.mode` with `disabled` (the default), `warn`, and `enabled`. The controller runs a server-side dry-run apply of the stored Helm manifest and patches differences, ignore rules take JSON Pointers with optional target selectors, and `.spec.interval` sets the cadence. Since Flux v2.2.0 this is a per-release option and no longer a controller-wide feature gate. The Kustomization `ssa` annotation (`IfNotPresent`, `Ignore`) opts single objects out. A community discussion shows the dry-run failing after a `kubectl edit` of a Service port, with `--override-manager` reported as the fix. [[sources/research-self-healing-and-drift-detection]] See [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]], [[findings/field-ownership-blocks-drift-correction]], [[comparisons/exemption-and-ignore-controls-across-tools]], and [[entities/tofu-controller]].

## Components, sources, and tenancy

Flux is built from GitOps Toolkit controllers: source controllers fetch from Git, OCI, Helm repositories, and buckets and expose artifacts; the Kustomize and Helm controllers apply them; the notification controller handles alerts and webhooks; and image automation controllers update manifests. Kustomizations reconcile every 5 minutes by default and revert manual changes unless suspended. Bootstrap installs Flux and commits its own manifests so Flux manages itself. The Kustomize controller adds SOPS and KMS decryption, health assessment, `dependsOn` ordering, garbage collection, and service-account impersonation for multi-tenant RBAC isolation. In the ControlPlane D2 design, Flux pulls signed OCI artifacts through a FluxInstance and ResourceSet resources so that clusters never connect to Git. [[sources/research-gitops-pull-based-delivery]] See [[comparisons/flux-versus-argo-cd-architecture]], [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]], and [[decisions/git-versus-oci-as-the-canonical-source]].

## Ordering around CRDs and discovery

The Kustomization API orders work with `.spec.dependsOn`, `.spec.healthChecks`, and `.spec.wait`. The documented pattern puts CRD-providing controllers in one Kustomization and the custom resources in another that depends on it, so the dependent is applied only after the referred Kustomizations are ready. Health checks reference resources by apiVersion and kind, so they also depend on discovery. [[sources/research-gvk-and-gvr]] See [[comparisons/missing-crd-handling-flux-versus-argo-cd]], [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]], and [[findings/custom-resources-applied-before-their-crd-exists]].

## CRD policies in HelmRelease

A HelmRelease has `spec.install.crds` and `spec.upgrade.crds` with Skip, Create (the default), and CreateReplace policies, because Helm has no native support for upgrading or deleting CRDs. CreateReplace updates existing CRDs but does not delete removed ones, and `dependsOn` should order CRD-providing releases first. [[sources/research-custom-resource-definition]] See [[examples/flux-helmrelease-crd-policies-createreplace-and-dependson]] and [[findings/helm-does-not-upgrade-or-delete-crds]].

## Status and readiness semantics

Flux HelmRelease status carries the conditions `Ready`, `Reconciling`, `Stalled`, `Released`, and `TestSuccess`, plus `observedGeneration`, failure counters, last-attempted revision, config digest, and release action, `lastHandledReconcileAt`, and a pointer to the generated HelmChart. `Reconciling=True` is normal progress, and an `observedGeneration` below `metadata.generation` means a spec change is pending. Flux relies on kstatus to judge dependency readiness, and it added CEL-based custom health checks for Cluster API after kstatus stopped fitting. [[sources/research-spec-status-split]] See [[examples/flux-helmrelease-status-records-attempts-and-health]], [[examples/cluster-api-readiness-gates-flux-dependents]], and [[entities/kstatus]].

## Server-side apply and field ownership

kustomize-controller applies with server-side apply and runs a server-side dry-run on each interval. Its controls are the `kustomize.toolkit.fluxcd.io/ssa` annotation (`Override`, `Merge`, `IfNotPresent`, `Ignore`), the `force` annotation for immutable-field changes, `.spec.ignore` rules with Strip and Adopt semantics, and the `flux-client-side-apply` manager name that preserves kubectl edits. Moving from client-side apply in Flux 0.17 to server-side apply in 0.18 left removed fields in the cluster, and a stale manager that co-owns a list entry key can make the dry-run fail every reconcile. Issue 1722 was closed through PR 1747 with an opt-in pre-dry-run takeover flag, whose final semantics were not verified. [[sources/research-server-side-apply-and-field-ownership]] See [[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]], [[examples/flux-migration-from-client-side-apply-strands-removed-fields]], and [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]].

## Admission webhooks and dry-run

kustomize-controller applies with a server-side dry-run first, so a webhook that does not declare `sideEffects` of `None` or `NoneOnDryRun` makes reconciliation fail with "admission webhook does not support dry run". The cheatsheet says to fix the webhook configuration, not Flux, and it also covers the five-minute health-check timeout and `disableWait`. [[sources/research-admission-webhooks-and-cel]] See [[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]] and [[findings/webhooks-without-sideeffects-declared-break-dry-run-clients]].

## One controller per concern

The Flux components page describes Flux as built from the GitOps Toolkit: specialized controllers for source, kustomize, helm, notification, and image automation, each reconciling its own CRDs, plus composable APIs and reusable Go packages. The operator-pattern dossier cites this as the clearest example of the one-controller-per-concern split. [[sources/research-operator-pattern]] See [[examples/flux-splits-gitops-into-single-purpose-controllers]] and [[concepts/operator-pattern]].

## Interval, retry, and timing in the reconciliation-loop dossier

The Kustomization reference describes `spec.interval` as the periodic reconcile cadence with a 60 second minimum, `retryInterval` as the delay after failures (defaulting to `interval`), `timeout` as the bound on build, apply, and health-check work, and `suspend` as the switch that pauses reconciliation and drift correction. Jitter can spread many Kustomizations, and a manual reconcile can be requested by annotation. The dossier read only the first 100,000 of about 121,600 characters of the page. [[sources/research-reconciliation-loop]] See [[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]] and [[concepts/reconciliation-loop]].

## Repeated apply as idempotency

The idempotency dossier treats the Kustomization as scheduled, repeated apply: each `.spec.interval` runs a server-side apply dry-run to detect and correct drift, a new revision or generation is handled immediately, `.spec.prune` garbage-collects dropped objects with a `prune: disabled` annotation as protection, `.spec.retryInterval` retries failures, and jitter avoids load spikes. Conflicting field ownership is the signal that another actor changed the object. The dossier's quoted example uses a ten-minute interval, which is an example and not a stated default. [[sources/research-idempotency]] See [[concepts/idempotency]].

## Concurrency and cache knobs

The vertical scaling page says Flux raises parallel reconciles with `--concurrent` flags, caches Helm indexes in the source controller with `--helm-cache-max-size` and `--helm-cache-ttl`, prefers persistent volumes to EmptyDir for artifacts, and warns that tmpfs counts against pod memory. The page describes tuning and not the informer implementation or sharding. [[sources/research-informers-reflectors-and-workqueues]] See [[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]] and [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].

## Deletion policy and finalizers

The Kustomization reference says garbage collection also runs when a Kustomization is deleted. `spec.deletionPolicy` takes MirrorPrune (default), Delete, WaitForTermination, or Orphan, and WaitForTermination blocks until children have left etcd, so Flux's own finalizer waits on the finalizers of its children. The per-object `kustomize.toolkit.fluxcd.io/prune: disabled` annotation opts an object out of pruning. The dossier read about 100 KB of a page of about 121 KB and did not confirm the name `finalizers.fluxcd.io` from a primary source. [[sources/research-finalizers]] See [[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]] and [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].

## Pruning without owner references

Flux garbage collection is its own mechanism. With `.spec.prune: true`, objects missing from the current source revision are removed using the inventory in `.status.inventory`, the annotation `kustomize.toolkit.fluxcd.io/prune: disabled` exempts an object, and `.spec.deletionPolicy` (MirrorPrune, Delete, WaitForTermination, Orphan) governs deletion of the Kustomization itself. Whether Flux ever relies on owner references was not stated in the part of the page that the dossier read. [[sources/research-owner-references-and-garbage-collection]] See [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].

## Conditions and health checks

Flux's kustomize-controller reports `Ready`, `Reconciling`, and `Stalled` plus `observedGeneration`. It waits for applied resources to become healthy before marking a Kustomization `Ready`, which unblocks Kustomizations that `dependsOn` it. Compatible custom resources are judged through kstatus, and for kinds that do not follow kstatus, `healthCheckExprs` supplies CEL expressions. Flux added CEL checks for Cluster API resources after kstatus misjudged new objects. The dossier read only the first 100 KB of the Kustomization page. [[sources/research-conditions]] See [[concepts/conditions]], [[findings/premature-readiness-in-kstatus-based-tools]], and [[examples/flux-dependson-and-health-checks-gate-rollout]].

## Prune cascades into managed resource deletion

With `spec.prune: true`, a Kustomization deletes objects that disappeared from Git, tracked through `.status.inventory`, and the annotation `kustomize.toolkit.fluxcd.io/prune: disabled` exempts an object. For managed resources a Git removal becomes a prune of the object followed by a provider delete of the cloud resource, unless Delete is excluded from `managementPolicies`. The dossier read only the first 100,000 of about 121,000 characters of the Flux page. [[sources/research-managed-resource]] See [[findings/unintended-deletion-through-prune]] and [[decisions/choose-management-policies-for-an-imported-resource]].
