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
