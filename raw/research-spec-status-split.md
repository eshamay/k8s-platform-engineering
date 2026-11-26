# Research dossier: Spec vs Status Split

Research date: 2026-11-25

## Overview

Every Kubernetes object that represents managed state is split into two stanzas. `spec` is the desired state: what a user, a GitOps tool, or another controller wants. `status` is the observed state: what a controller has measured and concluded. The API conventions describe spec as the complete description of desired state and status as a summary of current state, usually written by automated processes. This split is what lets Kubernetes be declarative. A human or tool states intent once, and independent control loops converge reality toward it and report progress without overwriting that intent.

Mechanically, the split is enforced by the `/status` subresource. For a CRD, enabling `subresources.status` changes the write semantics. PUT or PATCH on the main resource ignores status changes. PUT or PATCH on `/status` ignores everything except status. Only changes to the main resource bump `metadata.generation`. That gives a controller a cheap staleness check: it copies the generation it acted on into `status.observedGeneration` (and, per current conventions, into each condition). Consumers compare the two numbers to know whether the status describes the latest spec. The subresource also allows separate RBAC, so users can hold write access to spec and controllers to status.

The sources frame status as more than a convenience. It is the integration surface for the rest of the ecosystem. Conditions (`type`, `status`, `reason`, `message`, `observedGeneration`) are what Flux, Argo CD, kstatus, Cluster API, and Crossplane read to decide whether a resource is ready or healthy. Where conventions are followed, generic tooling works. Where they are not (ACK lacks `observedGeneration` on conditions, some CRDs have no standard health shape), every consumer needs custom code. The API conventions also stress level-based behavior. Status is a recent observation, not an event log, and controllers should be able to rebuild it.

For platform abstractions such as Crossplane composites and kro graphs, the split recurs at a higher level. The platform author defines a spec schema for users and a status schema that surfaces rolled-up readiness or selected fields from the composed resources. The usual failure modes are infinite reconcile loops when status writes bump generation, stale or misleading readiness (a resource that looks ready before the controller has acted), and non-standard fields like free text in `reason`.

## Sources

### 1. Kubernetes API Conventions
- URL: https://raw.githubusercontent.com/kubernetes/community/master/contributors/devel/sig-architecture/api-conventions.md
- Title: API Conventions (kubernetes/community, sig-architecture)
- Publisher: Kubernetes SIG Architecture
- Kind: official design / convention document
- Read: first ~100,000 of ~115,000 characters (via WebFetch). Final ~15,000 not read.
- Summary: The canonical definition. Spec is the complete desired state, including defaults and modifications by ecosystem components. Status summarizes observed state. Users and controllers write spec, while automated processes write status through a `/status` subresource with its own authorization scope. It sets out the conditions format: PascalCase `type` naming current observed state, a `True`/`False`/`Unknown` status, a CamelCase `reason` meant for programs, a human `message`, and `observedGeneration`. It also explains level-based semantics: the system need not observe every intermediate value.
- Quote: "Condition type names should describe the current observed state of the resource."

### 2. Extend the Kubernetes API with CustomResourceDefinitions
- URL: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
- Title: Extend the Kubernetes API with CustomResourceDefinitions
- Publisher: Kubernetes documentation
- Kind: official task documentation
- Read: first ~100,000 of ~170,000 characters (via WebFetch). The remainder was not read.
- Summary: Shows how to enable `spec.subresources.status: {}` on a CRD and what that changes. Writes to the main resource ignore `.status`, writes to `/status` touch only `.status`, and `metadata.generation` increments only on main-resource changes. This is the mechanical foundation for `observedGeneration` and for controllers that avoid retriggering themselves.
- Quote: "The status subresource can be used to separate the specification of the desired state of a resource from the status of the resource observed at any given time."

### 3. Kubernetes Objects: spec and status
- URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/
- Title: Objects In Kubernetes
- Publisher: Kubernetes documentation
- Kind: official concept documentation
- Read: first ~100,000 of ~103,000 characters.
- Summary: Beginner-level framing. Nearly every object has `spec` (what you set) and `status` (what Kubernetes reports), and the control plane continually works to make them match. The Deployment example (`replicas: 3` against `readyReplicas`) is a good first example for tutorials.
- Quote: none verbatim of note; paraphrase only.

### 4. Controllers (Kubernetes architecture concepts)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes documentation
- Kind: official architecture documentation
- Read: first ~100,000 of ~101,000 characters.
- Summary: Explains control loops with the thermostat analogy. Controllers watch desired state, compare it with current state, and act, reporting back through the API server so other loops can react. It places spec and status inside the wider reconcile model and is the right prerequisite for the more specific sources.
- Quote: "Each controller tries to move the current cluster state closer to the desired state."

### 5. Implementing and Using the Status Subresource in Kubernetes Operators
- URL: https://oneuptime.com/blog/post/2026-02-09-operator-status-subresource/view
- Title: Implementing and Using the Status Subresource in Kubernetes...
- Publisher: OneUptime blog
- Kind: tutorial explainer
- Read: full (via WebFetch summarizing the article).
- Summary: A practical Kubebuilder-oriented walkthrough. It covers the rationale (avoiding races, granular RBAC, separating validation), the marker to enable the subresource, and controller patterns for updating status and conditions. Pitfalls named: using the normal client instead of `Status()`, forgetting RBAC on `/status`, not retrying on resourceVersion conflicts, and not setting `ObservedGeneration` so consumers cannot tell stale from fresh.
- Quote: "Always use the status client for status updates."

### 6. The Status Subresource in Kubernetes Controllers
- URL: https://www.farishuskovic.dev/blog/k8s-status-subresource/
- Title: The Status Subresource in Kubernetes Controllers
- Publisher: farishuskovic.dev (individual author)
- Kind: blog tutorial
- Read: full (via WebFetch summary).
- Summary: Explains the reconcile-loop problem concretely. Without the status subresource, a status write is a write to the whole object, which increments generation and triggers another reconcile. With `+kubebuilder:subresource:status`, `r.Status().Patch()` updates only status. It also contrasts `Update()` (needs a current resourceVersion, conflict-prone) with `Patch()`, and warns against updating spec and status in the same call.
- Quote: "Keeping them separate is how you avoid infinite reconcile loops."

### 7. Status subresource for Prometheus operator workload CRDs
- URL: https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/
- Title: Status subresource for Prometheus operator Workload CRDs
- Publisher: Prometheus Operator project
- Kind: design proposal (implemented)
- Read: full (via WebFetch summary).
- Summary: A real design doc showing a project adding status after the fact. Motivation: users could not tell whether a Prometheus resource was available without querying the operator. The design adds status to `Prometheus`, `Alertmanager`, `PrometheusAgent`, and `ThanosRuler`, with replica and availability counts and `Available` and `Reconciled` conditions. Prometheus also gets per-shard status. It deliberately excludes config-style objects (`ServiceMonitor`, `PodMonitor`, `PrometheusRule`) because multiple reconcilers would write to them.
- Quote: "Define the structure of the status subresource for custom resource definitions that materialize as Pod objects."

### 8. Composite Resources (Crossplane)
- URL: https://docs.crossplane.io/latest/composition/composite-resources/
- Title: Composite Resources, Crossplane v2.4
- Publisher: Crossplane project (CNCF)
- Kind: official documentation
- Read: full (via WebFetch summary).
- Summary: Describes an XR as a set of resources presented as a single object. Spec carries composition selection and pinning (`compositionRef`, `compositionSelector`, `compositionUpdatePolicy`, revision refs) plus operational annotations such as pause and poll interval. Status uses two conditions: `Synced` (Crossplane could reconcile) and `Ready` (the function pipeline reports all composed resources ready). Two separate conditions let an operator tell "the platform is broken" from "the cloud resource is still coming up".
- Quote: "A composite resource, or XR, represents a set of Kubernetes resources as a single Kubernetes object."

### 9. Crossplane issue 4094: Claim "Ready" condition has free text in reason
- URL: https://github.com/crossplane/crossplane/issues/4094
- Title: Claim "Ready" condition has a free text message in reason field
- Publisher: Crossplane GitHub (issue by a user, answered by a maintainer)
- Kind: bug report and community discussion
- Read: full.
- Summary: A concrete convention violation. Claim status put a sentence in `reason` instead of a programmatic CamelCase identifier, as the apimachinery condition type requires. A maintainer agreed it was a slip and it was fixed in v1.13 (PR #4125). It shows why the reason/message distinction matters: tooling switches on `reason`, so free text breaks it.
- Quote: "what is in the `reason` field right now should be in `message`."

### 10. Flux HelmRelease API (Status section)
- URL: https://fluxcd.io/flux/components/helm/helmreleases/
- Title: Helm Releases
- Publisher: Flux project (CNCF)
- Kind: official API documentation
- Read: first ~100,000 of ~130,000 characters.
- Summary: Shows a mature controller status. Conditions `Ready`, `Reconciling`, `Stalled`, `Released`, `TestSuccess`; `observedGeneration`; failure counters; `lastAttemptedRevision`, `lastAttemptedConfigDigest`, and `lastAttemptedReleaseAction`; `lastHandledReconcileAt` (answers the `reconcile.fluxcd.io/requestedAt` annotation); and a pointer to the generated HelmChart. It is a good model of status as audit trail plus machine-readable health.
- Quote: none usable beyond field names.

### 11. How to Understand Flux CD Ready Conditions and Status Messages
- URL: https://oneuptime.com/blog/post/2026-03-05-flux-cd-ready-conditions-status/view
- Title: How to Understand Flux CD Ready Conditions and Status Messages
- Publisher: OneUptime blog
- Kind: tutorial explainer
- Read: full (via WebFetch summary).
- Summary: A reader's guide to Flux conditions. `Ready` is the headline. `Reconciling=True` is normal progress, not failure. `Stalled` means it will not advance without a change. If `observedGeneration` is below `metadata.generation`, a spec change is still pending. Pitfalls: misreading suspended resources (they keep their last condition), ignoring `DependencyNotReady` chains, and treating `Reconciling` as an error.
- Quote: "The `Ready` condition with its status, reason, and message fields tells you at a glance whether reconciliation succeeded."

### 12. kstatus package (cli-utils)
- URL: https://pkg.go.dev/sigs.k8s.io/cli-utils/pkg/kstatus/status
- Title: status package, sigs.k8s.io/cli-utils/pkg/kstatus/status
- Publisher: Kubernetes SIGs (cli-utils)
- Kind: library documentation
- Read: the WebFetch summary was brief and detailed rules were not extracted.
- Summary: kstatus computes a generic status (InProgress, Current, Failed, Terminating, NotFound, Unknown) for any resource that follows the conventions, using `observedGeneration`, `Ready`/`Reconciling`/`Stalled` conditions and the "abnormal-true" idea. It is the reason conventions matter: Flux and other tools use it to decide whether a dependency is ready without per-kind logic.
- Quote: "Package kstatus contains functionality for computing the status of Kubernetes resources"

### 13. Cluster API issue 9299: kstatus "resource is ready" race
- URL: https://github.com/kubernetes-sigs/cluster-api/issues/9299
- Title: Improve compatibility with kstatus: avoid "resource is ready" race
- Publisher: Cluster API GitHub
- Kind: issue and design discussion
- Read: full (via WebFetch summary).
- Summary: A resource with `observedGeneration` set but no conditions yet can look ready to kstatus right after creation, so Flux can proceed to dependents too early. The proposed fix was defaulting `status.observedGeneration` to `-1`. In April 2025 it was reopened, then closed "not planned" in May 2025 because CAPI is moving from the `Ready` condition to `Available`, defaults on status lack a clear convention basis, and Flux added CEL-based custom health checks for CAPI.
- Quote: "Given the Ready condition is replaced with Available, Flux can't rely on kstatus for ClusterAPI anymore."

### 14. Argo CD Resource Health
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/health/
- Title: Resource Health
- Publisher: Argo CD project (CNCF)
- Kind: official documentation
- Read: full (via WebFetch summary).
- Summary: Argo CD assigns health with built-in checks for core types and Lua scripts that read `obj.status` for CRDs. Results are Healthy, Progressing, Degraded, or Suspended. An application's health is the worst of its immediate children. For CRDs without a script, health cannot be derived reliably because status shapes are not standardized, so controllers must expose usable status.
- Quote: "CRDs do not follow a consistent or standardized status format."

### 15. ACK issue 1583: Add ObservedGeneration to status conditions
- URL: https://github.com/aws-controllers-k8s/community/issues/1583
- Title: Add `ObservedGeneration` to status (conditions)
- Publisher: AWS Controllers for Kubernetes GitHub
- Kind: issue and community discussion
- Read: full (via WebFetch summary).
- Summary: Without `observedGeneration`, consumers cannot tell a stale `ResourceSynced=True` from a current one. Argo CD maintainers described working around it by comparing managed-field timestamps, which they called fragile. Maintainers discussed multi-writer concerns, and the thread argues conditions with `observedGeneration` remain compatible with Server-Side Apply. As of the fetch the issue was open with a frozen label.
- Quote: "Publishing `False` at reconciliation start would let consumers require both `ResourceSynced=True` and matching generation."

### 16. What is kro?
- URL: https://kro.run/docs/overview/
- Title: What is kro?
- Publisher: kro project (Kubernetes SIGs)
- Kind: official documentation
- Read: overview only. The ResourceGraphDefinition concept page URL returned 404, so kro status-schema details were not read.
- Summary: kro turns a set of resources into a reusable API. You define a schema (spec the user fills in), describe the resources, and wire them with CEL expressions that reference user spec and the status of underlying resources, which also determines dependency order.
- Quote: "kro lets you turn a set of Kubernetes resources into a reusable API."

## Real-world use cases

Deployments and other built-in workloads are the baseline: `replicas` in spec versus `readyReplicas` and `updatedReplicas` in status, which operators and rollout tools read (https://kubernetes.io/docs/concepts/overview/working-with-objects/). Prometheus Operator retrofitted status onto `Prometheus`, `Alertmanager`, `PrometheusAgent`, and `ThanosRuler` so users stop querying the operator out of band (https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/).

GitOps controllers use status as the contract. Flux HelmRelease status records the last attempted revision and action, and Flux uses readiness of dependencies to gate ordering (https://fluxcd.io/flux/components/helm/helmreleases/, https://oneuptime.com/blog/post/2026-03-05-flux-cd-ready-conditions-status/view). Argo CD aggregates child health into application health using Lua scripts over `obj.status` (https://argo-cd.readthedocs.io/en/stable/operator-manual/health/).

Platform abstractions use the split at a higher layer. Crossplane XRs take composition selection in spec and report `Synced` and `Ready` (https://docs.crossplane.io/latest/composition/composite-resources/). kro exposes a user-facing schema and uses CEL to pull status from composed resources (https://kro.run/docs/overview/). Cluster API infrastructure provider objects feed readiness into Flux ordering (https://github.com/kubernetes-sigs/cluster-api/issues/9299). ACK controllers manage AWS resources and publish `ResourceSynced` (https://github.com/aws-controllers-k8s/community/issues/1583).

## Pitfalls and how tools address them

Reconcile loops from status writes. Without the status subresource, writing status bumps generation and retriggers the controller. Enabling the subresource and writing through the status client avoids this, and tutorials also recommend `Patch` over `Update` to reduce conflicts (https://www.farishuskovic.dev/blog/k8s-status-subresource/, https://oneuptime.com/blog/post/2026-02-09-operator-status-subresource/view). Forgetting RBAC on `/status` is a related operational trap (same OneUptime source).

Stale status. If `observedGeneration` is missing or not tied to conditions, consumers cannot tell fresh from stale. ACK's issue is the clearest example, and the proposed mitigation is to publish `ResourceSynced=False` at reconcile start (https://github.com/aws-controllers-k8s/community/issues/1583). Flux exposes the generation comparison directly (https://oneuptime.com/blog/post/2026-03-05-flux-cd-ready-conditions-status/view).

Premature readiness. A newly created resource with partial status can look ready to kstatus-based tools. Cluster API discussed defaulting `observedGeneration` to `-1` but dropped it, and Flux moved toward CEL health checks (https://github.com/kubernetes-sigs/cluster-api/issues/9299, https://pkg.go.dev/sigs.k8s.io/cli-utils/pkg/kstatus/status).

Non-standard status. Argo CD cannot infer health for arbitrary CRDs and needs per-kind Lua scripts (https://argo-cd.readthedocs.io/en/stable/operator-manual/health/). Crossplane's free-text `reason` bug shows how a small convention slip breaks consumers (https://github.com/crossplane/crossplane/issues/4094).

Multiple writers. Prometheus Operator left config-like CRDs without status because several reconcilers could write conflicting data (https://prometheus-operator.dev/docs/proposals/implemented/status-subresource/). Separating `Synced` from `Ready`, as Crossplane does, keeps controller-health and resource-readiness signals apart (https://docs.crossplane.io/latest/composition/composite-resources/).

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/overview/working-with-objects/ : gentlest introduction to spec and status.
- https://kubernetes.io/docs/concepts/architecture/controller/ : control-loop framing for desired versus current state.
- https://www.farishuskovic.dev/blog/k8s-status-subresource/ : short explanation of why the subresource prevents reconcile loops.
- https://oneuptime.com/blog/post/2026-02-09-operator-status-subresource/view : Kubebuilder-style implementation walkthrough with pitfalls.
- https://oneuptime.com/blog/post/2026-03-05-flux-cd-ready-conditions-status/view : how to read Flux conditions.
- https://raw.githubusercontent.com/kubernetes/community/master/contributors/devel/sig-architecture/api-conventions.md : the authoritative reference for deeper readers.

## Open questions

- Reference material for kro status schema and Crossplane v2 function-pipeline status propagation was not read; a later pass should fetch the kro ResourceGraphDefinition docs (the guessed URL returned 404) and the Crossplane composition-function docs.
- The kstatus package page summary did not yield exact rules for how `observedGeneration` and conditions are combined; read the cli-utils source or docs directly.
- Config Connector and Argo CD's own status semantics were not read at primary-source depth beyond health checks; no primary source on Config Connector was fetched.
- Whether `observedGeneration` should live at the top level of status, in each condition, or both is not settled across sources (conventions say per condition; Flux and CAPI use a top-level field).
- CAPI is moving from `Ready` to `Available` while kstatus expects `Ready`; how generic tools should cope is unresolved.
- The Kubernetes sources were read only partially (first ~100,000 characters); conventions beyond that point (final ~15,000 characters of API conventions) were not examined.
- No conference talks, postmortems, or named end-user case studies were found; use cases are drawn from project docs and issues.
