---
title: "Research dossier: Self-Healing and Drift Detection"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [self-healing, drift-detection, research-dossier, gitops, controllers, pitfalls]
---

# Research dossier: Self-Healing and Drift Detection

> [!NOTE]
> **Raw file:** `raw/research-self-healing-and-drift-detection.md` (sha256 prefix 98edc2019c6b)<br>
> **Kind:** Research dossier summarizing 19 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** Pages were read through a fetch tool that returns a model-generated digest, and several long pages (Flux HelmRelease, Flux Kustomization, the Kubernetes controller page, Server-Side Apply) were digested only for their first 100,000 characters. Quotes and values should be re-verified against the live pages before publication.

## Summary

The dossier explains self-healing as one idea applied at several layers: you declare desired state, and a level-triggered controller keeps comparing it with observed state and acts to close the gap. For in-cluster objects, drift means a live object was changed away from its source of truth. Flux and Argo CD detect this by diffing desired manifests against live objects, and server-side apply field ownership is the mechanism that makes the diff tractable and also the source of the hardest edge cases. For external infrastructure the same loop calls a provider API, so frequency becomes a cost trade-off, and Cluster API extends the idea to machines with health checks.

The dossier's main conclusion is that correction is never free of policy. Every stack offers a way to say "do not fight this field or resource", and the main failure modes are controllers fighting each other, false-positive diffs from webhooks and defaulting, expensive polling against rate-limited APIs, and dry-run failures that stop correction before it starts. It found no named production company running these tools and no postmortem of a drift-correction incident.

See [[concepts/self-healing-and-drift-detection]] for the synthesized concept.

## Key claims

### Control-loop foundations

- Kubernetes controllers are non-terminating loops that compare an object's spec with current state and push the two together. Some act through the API server (the Job controller creating Pods) and some control external systems directly, which is the conceptual root of Crossplane, ACK, and Config Connector. URL: https://kubernetes.io/docs/concepts/architecture/controller/. Quote: "In Kubernetes, controllers are control loops that watch the state of your cluster, then make or request changes where needed." See [[concepts/reconciliation-loop]].
- A secondary tutorial walks through watch, in-memory cache, workqueue, and `Reconcile()`, covering level-triggered semantics, idempotency, key deduplication, return values, and an informer resync (default 10 hours) that catches missed drift. The dossier says to verify its numbers against controller-runtime documentation. URL: https://www.golinuxcloud.com/kubernetes-reconcile-loop-explained/. Quote: "Stores the latest version of every watched object in an in-memory cache." See [[concepts/informers-reflectors-and-workqueues]].
- Server-side apply tracks field ownership in `managedFields`, allows shared ownership when managers set equal values, and resolves conflicts by forcing (ownership transfers), dropping the field, or aborting. This is how Flux and Argo CD decide what is theirs, and why another manager's edits appear as drift or as conflicts. URL: https://kubernetes.io/docs/reference/using-api/server-side-apply/. Quote: "Writes to objects with managed fields can be forced, in which case the value of any conflicted field will be overridden, and the ownership will be transferred." See [[concepts/server-side-apply-and-field-ownership]].

### Flux

- `spec.driftDetection.mode` on a HelmRelease has three values: `disabled` (the default), `warn` (events only), and `enabled` (detect and correct). The controller runs a server-side dry-run apply of the stored Helm manifest and patches differences, ignore rules use JSON Pointers with optional target selectors, and `.spec.interval` sets how often detection runs. URL: https://fluxcd.io/flux/components/helm/helmreleases/. Quote: "the controller will attempt to correct the drift by creating and patching the resources based on the server-side dry-run apply result." See [[entities/flux]] and [[decisions/staged-adoption-of-automated-drift-correction]].
- Helm drift detection became a per-HelmRelease option in Flux v2.2.0 instead of a controller-wide feature gate, and the old configuration page is now only a pointer. URL: https://fluxcd.io/flux/installation/configuration/helm-drift-detection/. Quote: "drift detection for Helm releases is available as a configuration option on the HelmRelease itself".
- The Kustomization controller applies with server-side apply and runs a dry-run at every interval (minimum 60 seconds). It offers `retryInterval`, `prune`, `force` (recreate on immutable-field changes, to be used temporarily), and the `kustomize.toolkit.fluxcd.io/ssa` annotation with `IfNotPresent` and `Ignore` for per-object opt-outs. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/. Quote: "only apply the Kubernetes resources if they are not present on the cluster". See [[comparisons/exemption-and-ignore-controls-across-tools]].
- A community discussion reports that after a `kubectl edit` of a Service port, the server-side dry-run fails with duplicate port names, helm-controller stops at "unable to determine cluster state", and correction never starts. `driftDetection.ignore` does not help because ignores apply after the dry-run. The reported fix is `--override-manager=kubectl-edit` on helm-controller (stated as available since v1.5.0), and the thread links the same bug class in Argo CD server-side diff (issue 17717) and Kubernetes issue 130292. The answer is from a community member, not an official maintainer statement. URL: https://github.com/fluxcd/flux2/discussions/6068. See [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]] and [[findings/field-ownership-blocks-drift-correction]].

### Argo CD

- Automated sync applies Git changes without CI needing cluster credentials. `selfHeal` re-syncs when live state deviates (default 5-second timeout), `prune` is off by default, `retry` uses exponential backoff, rollback is disallowed under automated sync, a sync runs only when the app is OutOfSync, and the same commit and parameters are not retried unless self-heal is active. Default refresh is 120 seconds plus up to 60 seconds of jitter. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/. Quote: "An automated sync will only be performed if the application is OutOfSync." See [[entities/argo-cd]].
- Diffing customization explains why healthy apps show OutOfSync and how to suppress it with `ignoreDifferences` by JSON pointer, JQ path expression, or `managedFieldsManagers`, per app or system-wide. Usual causes are mutating webhooks, controllers rewriting fields such as HPA metrics ordering, non-deterministic Helm templates, and fields dropped as unknown to the API. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/. Quote: "A controller or mutating webhook is altering the object after it was submitted to Kubernetes so it differs from the one in Git." See [[findings/controllers-fighting-over-fields-cause-revert-loops]].
- An app-of-apps looked perpetually out of sync because argocd-image-updater rewrote child Application specs and dropped fields such as `selfHeal`. The cause was another automation tool, not Argo CD. URL: https://github.com/argoproj/argo-cd/issues/14591. Quote: "Confirmed this is an issue in `argocd-image-updater`, not `argo-cd`." See [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]].
- An Akuity vendor blog describes the Application Controller comparing live and target state, with detection every 120 seconds or near-immediate with Git webhooks, and lists use cases: strict Git-as-truth for stateless apps, manual sync for risky production workloads during adoption, multi-environment promotion with Kargo, and `ignoreDifferences` for resources owned by other controllers. It is vendor material and not benchmarked. URL: https://akuity.io/blog/what-is-argo-cd-features-and-business-benefits. Quote: "Argo CD continuously compares the target state of a Kubernetes cluster with the live state present in the Git repository." See [[examples/incremental-gitops-adoption-with-manual-sync-and-self-heal]].

### Crossplane, ACK, Config Connector, and kro

- Crossplane managed resources use `Ready` and `Synced` conditions to separate "it exists" from "the last reconcile succeeded". `spec.forProvider` is the source of truth and external changes are reverted, `managementPolicies` (Observe, Create, Update, Delete, LateInitialize) scope what the controller may do with Observe giving read-only adoption, the poll interval is configurable, the `crossplane.io/paused` annotation stops reconciliation, and finalizers delete external resources first. URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/. Quote: "Crossplane considers the `forProvider` field of a managed resource the 'source of truth' for external resources". See [[entities/crossplane]] and [[examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources]].
- The Crossplane managed-resource design one-pager defines the `forProvider` versus `atProvider` split, external naming, drift detection by comparing spec to observed state, and late initialization: provider-defaulted fields should be optional in spec so the controller can fill them without causing false drift. URL: https://github.com/crossplane/crossplane/blob/main/design/one-pager-managed-resource-api-design.md. Quote (digest wording): "Spec fields must be configurable at any point in the resource lifecycle; Status must be reproducible when deleted." See [[findings/late-initialized-fields-create-false-drift]].
- ACK controllers keep reconciling after a resource reaches `ResourceSynced = true`, but with much longer delays, defaulting to about 10 hours, to limit AWS API cost and throttling. Helm values `reconcile.defaultResyncPeriod` and `reconcile.resourceResyncPeriods` shorten it for specific kinds. URL: https://aws-controllers-k8s.github.io/community/docs/user-docs/drift-recovery/. Quote: "ACK controllers detect drift by continuing to reconcile resources after they have reached their desired state, but with much longer delays." See [[examples/ack-resync-period-tuning-for-stateful-resources]] and [[entities/ack]].
- Config Connector has direct (Go SDK), Terraform-based, DCL-based, and IAM controllers behind a routing controller whose namespace-level overrides beat build-time defaults. Direct controllers use less CPU and memory and give better latency and status. The page says nothing about reconcile intervals or drift cadence. URL: https://docs.cloud.google.com/config-connector/docs/concepts/controller-types. Quote: "Direct controllers don't have the CPU and memory overhead associated with running and translation of Terraform-based or DCL-based states." See [[entities/config-connector]].
- kro's dynamic controller resyncs all instances every 36,000 seconds (10 hours) to find drift, with `dynamicControllerConcurrentReconciles` defaulting to 1, one shared rate-limited queue, and exponential backoff for instances waiting on dependencies. URL: https://kro.run/docs/advanced/controller-tuning/. Quote: "All resource events flow through one rate-limited queue, preventing any single RGD from overwhelming the system". See [[entities/kro]].
- A kro issue reported that drift in managed resources was not reconciled after creation. It was closed as completed on 2025-11-04 as a duplicate of issue 323 with fixing commits, but the digest's quoted sentence reads like a post-fix statement and the exact history is unverified. URL: https://github.com/kubernetes-sigs/kro/issues/753. See [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

### Machines and Terraform

- A Cluster API MachineHealthCheck evaluates Node conditions against timeouts and remediates unhealthy Machines, typically by replacement. `maxUnhealthy` short-circuits remediation when too many machines look bad, and only machines owned by a MachineSet or KubeadmControlPlane are supported. The page is the v0.4 book, so details may differ in current releases. URL: https://release-0-4.cluster-api.sigs.k8s.io/tasks/healthcheck. Quote: "If any of these conditions are met for the duration of the timeout, the Machine will be remediated." See [[examples/cluster-api-machine-health-check-replaces-failed-nodes]] and [[findings/remediation-can-amplify-an-outage]].
- tofu-controller runs Terraform or OpenTofu from Flux-style resources, and its README mentions a drift-detection-only model. The digest gave no detail on approval modes or intervals. URL: https://github.com/flux-iac/tofu-controller. Quote: "you'd like to use GitOps just for drift detection, so you can decide to do things later when a drift occurs." See [[entities/tofu-controller]] and [[examples/tofu-controller-detects-terraform-drift-without-applying]].

### Limits of the evidence

- The `--override-manager` flag and its "since v1.5.0" claim come from a community reply, not official documentation. Config Connector's reconcile interval and drift cadence were not stated on the page read. Whether ACK's and kro's 10-hour figures are comparable mechanisms (informer resync versus explicit requeue) is not stated. The Cluster API source is the older v0.4 book. See [[open-knowledge-gaps]].
- Missing from the dossier are named production case studies or postmortems of drift-correction incidents, a KEP on controller resync or server-side apply, Crossplane drift pitfalls such as conflicts with autoscalers, and Terraform-in-cluster drift handling beyond the tofu-controller README. Candidate pages seen but not read include https://www.fortros.dev/notes/level-triggered-reconciliation, https://runbook.academy/courses/kubernetes/lessons/kubernetes-iv-06-level-vs-edge-triggered/, https://blog.ogenki.io/post/terraform-controller/, and https://deepwiki.com/kubernetes-sigs/kro/4.4-instance-controller.

## Related

[[concepts/self-healing-and-drift-detection]], [[sources/research-level-triggered-vs-edge-triggered]], [[sources/research-eventual-consistency-and-convergence]], [[sources/research-declarative-vs-imperative]], [[sources/research-universal-control-plane]]
