---
title: "Research dossier: Spec vs Status Split"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [spec-status, status-subresource, conditions, observedgeneration, kstatus, research-dossier]
---

# Research dossier: Spec vs Status Split

> [!NOTE]
> **Raw file:** `raw/research-spec-status-split.md` (sha256 prefix 598e6132ea4f)<br>
> **Kind:** Research dossier summarizing 16 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The Kubernetes pages were read only to about 100,000 characters (the API conventions lose their final 15,000), the kstatus page and the kro overview came from brief summaries, the kro ResourceGraphDefinition page returned 404, and no primary source on Config Connector was fetched. The dossier found no conference talks, postmortems, or named end-user case studies.

## Summary

The dossier explains that every managed Kubernetes object is split into `spec`, the desired state written by users, GitOps tools, or other controllers, and `status`, the observed state written by the controller that owns the object. For a CRD the split is enforced by the `/status` subresource: writes to the main resource ignore status, writes to `/status` ignore everything else, and only main-resource changes bump `metadata.generation`. A controller copies the generation it acted on into `observedGeneration`, which is how consumers tell whether status describes the latest spec. The subresource also allows separate RBAC for spec writers and status writers.

The dossier treats status as the integration surface of the ecosystem. Conditions are what Flux, Argo CD, kstatus, Cluster API, and Crossplane read to decide whether something is ready, so generic tooling works where conventions are followed and needs custom code where they are not. The same split recurs at the platform layer, where Crossplane composites and kro graphs define a user-facing spec schema and a status schema that rolls up readiness from composed resources. The pitfalls are reconcile loops from status writes, stale or premature readiness, non-standard fields, and several writers on one object.

See [[concepts/spec-status-split]] for the synthesized concept and [[concepts/conditions]] for the condition format.

## Key claims

### Conventions and mechanics

- Spec is the complete description of desired state, including defaults and modifications by ecosystem components, and status summarizes observed state. Users and controllers write spec, while automated processes write status through a `/status` subresource with its own authorization scope. URL: https://raw.githubusercontent.com/kubernetes/community/master/contributors/devel/sig-architecture/api-conventions.md. Quote: "Condition type names should describe the current observed state of the resource." The dossier read about 100,000 of 115,000 characters. See [[concepts/conditions]].
- The conventions define a condition as a PascalCase `type`, a `True`, `False`, or `Unknown` status, a CamelCase `reason` meant for programs, a human-readable `message`, and `observedGeneration`. They also state level-based semantics: the system need not observe every intermediate value, so status is a recent observation and not an event log. Same URL. See [[concepts/level-triggered-vs-edge-triggered]].
- Enabling `spec.subresources.status: {}` on a CRD makes writes to the main resource ignore `.status`, makes writes to `/status` touch only `.status`, and increments `metadata.generation` only on main-resource changes. URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/. Quote: "The status subresource can be used to separate the specification of the desired state of a resource from the status of the resource observed at any given time." See [[concepts/custom-resource-definition]].
- Nearly every object has `spec` (what you set) and `status` (what Kubernetes reports), and the control plane works continually to make them match. The Deployment example of `replicas: 3` against `readyReplicas` is a good first example. URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/. See [[examples/deployment-status-reports-ready-replicas-against-spec-replicas]].
- Controllers watch desired state, compare it with current state, act, and report back through the API server so other loops can react. URL: https://kubernetes.io/docs/concepts/architecture/controller/. Quote: "Each controller tries to move the current cluster state closer to the desired state." See [[concepts/reconciliation-loop]].

### Implementation guidance

- A Kubebuilder-oriented walkthrough gives the rationale as avoiding races, granular RBAC, and separating validation, and names four pitfalls: using the normal client instead of `Status()`, forgetting RBAC on `/status`, not retrying on resourceVersion conflicts, and not setting `ObservedGeneration`. URL: https://oneuptime.com/blog/post/2026-02-09-operator-status-subresource/view. Quote: "Always use the status client for status updates." This is a tutorial-grade source. See [[findings/status-client-rbac-and-conflict-mistakes]].
- Without the subresource a status write is a write to the whole object, which increments generation and triggers another reconcile. With `+kubebuilder:subresource:status`, `r.Status().Patch()` updates only status. The post contrasts `Update()` (needs a current resourceVersion, conflict-prone) with `Patch()` and warns against updating spec and status in the same call. URL: https://www.farishuskovic.dev/blog/k8s-status-subresource/. Quote: "Keeping them separate is how you avoid infinite reconcile loops." This is an individual author's blog. See [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]].

### Real-world status designs

- Prometheus Operator added status to `Prometheus`, `Alertmanager`, `PrometheusAgent`, and `ThanosRuler` because users could not tell whether a resource was available without querying the operator. The design uses replica and availability counts, `Available` and `Reconciled` conditions, and per-shard status for Prometheus, and it excludes `ServiceMonitor`, `PodMonitor`, and `PrometheusRule` because several reconcilers would write to them. URL: https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/. Quote: "Define the structure of the status subresource for custom resource definitions that materialize as Pod objects." See [[examples/prometheus-operator-retrofits-status-onto-workload-crds]], [[decisions/which-crds-get-a-status-subresource]], and [[entities/prometheus-operator]].
- A Crossplane composite resource presents a set of resources as one object. Its spec carries composition selection and pinning (`compositionRef`, `compositionSelector`, `compositionUpdatePolicy`, revision refs) and operational annotations such as pause and poll interval. Its status has `Synced` (Crossplane could reconcile) and `Ready` (the function pipeline reports all composed resources ready). URL: https://docs.crossplane.io/latest/composition/composite-resources/. Quote: "A composite resource, or XR, represents a set of Kubernetes resources as a single Kubernetes object." The page documents Crossplane v2.4. See [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]].
- Flux HelmRelease status carries the conditions `Ready`, `Reconciling`, `Stalled`, `Released`, and `TestSuccess`, plus `observedGeneration`, failure counters, `lastAttemptedRevision`, `lastAttemptedConfigDigest`, `lastAttemptedReleaseAction`, `lastHandledReconcileAt` (which answers the `reconcile.fluxcd.io/requestedAt` annotation), and a pointer to the generated HelmChart. URL: https://fluxcd.io/flux/components/helm/helmreleases/. The dossier read about 100,000 of 130,000 characters and records no usable quote. See [[examples/flux-helmrelease-status-records-attempts-and-health]].
- A reader's guide to Flux conditions says `Ready` is the headline, `Reconciling=True` is normal progress and not failure, `Stalled` means no progress without a change, and an `observedGeneration` below `metadata.generation` means a spec change is pending. It names the pitfalls of misreading suspended resources (they keep their last condition), ignoring `DependencyNotReady` chains, and treating `Reconciling` as an error. URL: https://oneuptime.com/blog/post/2026-03-05-flux-cd-ready-conditions-status/view. Quote: "The `Ready` condition with its status, reason, and message fields tells you at a glance whether reconciliation succeeded." See [[entities/flux]].
- kro lets a platform author define a schema (the spec users fill in), describe the resources, and wire them with CEL expressions that reference user spec and the status of underlying resources, which also determines dependency order. URL: https://kro.run/docs/overview/. Quote: "kro lets you turn a set of Kubernetes resources into a reusable API." The dossier read only the overview, so kro's status-schema details are unknown. See [[entities/kro]].

### Generic tooling and its failures

- kstatus computes a generic status (InProgress, Current, Failed, Terminating, NotFound, Unknown) for any resource that follows the conventions, using `observedGeneration`, the `Ready`, `Reconciling`, and `Stalled` conditions, and the abnormal-true idea. Flux and other tools use it to judge dependencies without per-kind logic. URL: https://pkg.go.dev/sigs.k8s.io/cli-utils/pkg/kstatus/status. Quote: "Package kstatus contains functionality for computing the status of Kubernetes resources". The dossier did not extract the exact combination rules. See [[entities/kstatus]].
- A Cluster API resource with `observedGeneration` set but no conditions yet can look ready to kstatus right after creation, so Flux can proceed to dependents too early. Defaulting `status.observedGeneration` to `-1` was proposed, reopened in April 2025, and closed "not planned" in May 2025 because Cluster API is moving from `Ready` to `Available`, defaults on status lack a clear convention basis, and Flux added CEL-based custom health checks. URL: https://github.com/kubernetes-sigs/cluster-api/issues/9299. Quote: "Given the Ready condition is replaced with Available, Flux can't rely on kstatus for ClusterAPI anymore." See [[findings/premature-readiness-in-kstatus-based-tools]] and [[examples/cluster-api-readiness-gates-flux-dependents]].
- Argo CD gives core types built-in health checks and uses Lua scripts that read `obj.status` for CRDs. Results are Healthy, Progressing, Degraded, or Suspended, and an application's health is the worst of its immediate children. URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/health/. Quote: "CRDs do not follow a consistent or standardized status format." See [[examples/argo-cd-rolls-up-child-health-with-lua-checks]] and [[comparisons/health-and-readiness-models-across-tools]].
- ACK conditions lack `observedGeneration`, so consumers cannot tell a stale `ResourceSynced=True` from a current one. Argo CD maintainers described comparing managed-field timestamps as a fragile workaround, and the thread argues that conditions with `observedGeneration` stay compatible with Server-Side Apply. The issue was open with a frozen label at fetch time. URL: https://github.com/aws-controllers-k8s/community/issues/1583. Quote: "Publishing `False` at reconciliation start would let consumers require both `ResourceSynced=True` and matching generation." See [[findings/missing-observedgeneration-hides-stale-status]] and [[decisions/publish-synced-false-at-reconcile-start]].
- Crossplane issue 4094 reported that a claim's `Ready` condition put a sentence in `reason` instead of a CamelCase identifier. A maintainer agreed it was a slip, and it was fixed in v1.13 (PR 4125). URL: https://github.com/crossplane/crossplane/issues/4094. Quote: "what is in the `reason` field right now should be in `message`." See [[findings/free-text-in-a-condition-reason-breaks-consumers]].

### Pitfall synthesis in the dossier

- The dossier groups the pitfalls as reconcile loops from status writes, stale status from missing `observedGeneration`, premature readiness, non-standard status, and multiple writers, and it credits Crossplane's separation of `Synced` from `Ready` with keeping controller health apart from resource readiness. See [[findings/config-style-crds-with-several-reconcilers-get-no-status]] and [[findings/misleading-readiness-and-stale-status]].

### Open questions in the dossier

- Whether `observedGeneration` belongs at the top level of status, in each condition, or both is not settled: the conventions say per condition, while Flux and Cluster API use a top-level field. See [[comparisons/observedgeneration-top-level-versus-per-condition]].
- How generic tools should cope with Cluster API moving from `Ready` to `Available` while kstatus expects `Ready` is unresolved.
- The kro status schema, Crossplane v2 function-pipeline status propagation, the exact kstatus rules, and Config Connector and Argo CD status semantics beyond health checks were not read at primary-source depth.
