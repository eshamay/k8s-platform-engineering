# Research dossier: Conditions

Research date: 2026-11-25

## Overview

A status condition is one entry in a resource's `.status.conditions` list. It is a small, uniform record that a controller writes to say what it has observed about an object. Each entry has a `type` (for example `Ready`), a `status` of `True`, `False` or `Unknown`, a machine-readable `reason`, a human-readable `message`, a `lastTransitionTime`, and an optional `observedGeneration`. The list works like a map keyed by `type`. Conditions are meant to complement the detailed status fields, not replace them. They give generic tools (kubectl, GitOps controllers, dashboards) a common vocabulary without knowing each resource's internals. KEP-1623 turned this into the shared `metav1.Condition` Go type, because earlier APIs each invented their own shape.

`observedGeneration` is what makes a condition trustworthy. `metadata.generation` increases whenever the spec changes. A controller copies the generation it has processed into status (at the top level, on each condition, or both). If `generation` is greater than `observedGeneration`, the status describes an older spec. This matters most for the "abnormal-true" polarity that kstatus describes. Under that pattern, the absence of problem conditions looks healthy, so a stopped or lagging controller looks the same as a healthy one. Comparing generations is the check that breaks that ambiguity. Sources agree that forgetting to set it is the most common mistake.

`Ready` is the conventional top-level summary condition, but its exact meaning differs by stack. In Crossplane, `Ready` and `Synced` are separate: `Synced` says the controller could reconcile desired state against the external system, and `Ready` says the external resource is usable. ACK uses `ACK.ResourceSynced`, `ACK.Terminal` and `ACK.Recoverable` and keeps `Ready` as the roll-up. Config Connector uses a single `Ready` condition with reasons like `UpToDate` and `UpdateFailed`. Flux uses `Ready` plus the kstatus-style `Reconciling` and `Stalled`. kro lets the RGD author define the instance conditions with CEL. Cluster API moved to `metav1.Condition` and split `Available` from `Ready` because one all-encompassing `Ready` was too rigid.

The sources frame conditions as a contract between controllers and observers, and the contract is only partly standardized. The Kubernetes conventions leave many choices open (polarity, how to handle `Unknown`). Consumers such as Argo CD, Flux and kstatus must therefore either rely on a shared convention or carry per-type health logic (Lua, CEL). Most of the real failure modes come from that gap: a condition that is `True` too early, a missing or stale `observedGeneration`, or a summary that hides an in-flight operation.

## Sources

### 1. Kubernetes API conventions (Conditions section)
- URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md
- Title: API Conventions (kubernetes/community, sig-architecture)
- Publisher: Kubernetes SIG Architecture
- Kind: Official API convention document
- Summary: The normative reference for how conditions should look. It defines the condition fields, says the list is treated as a map keyed by `type`, and says that no condition is equivalent to `Unknown`. Controllers should report conditions on first visit, even as `Unknown`, to show they have started work. Names should be short PascalCase adjectives or past-tense verbs that describe observed state rather than transitions. Polarity is left to authors, with advice that humans should find the name easy to read, so `Ready` or `Succeeded` is preferred over `Failed`. It also recommends a top-level summary condition for long-running objects. Only the first ~100 KB of the page was read, so later sections may be missing here.
- Quote: "A negative condition like 'MemoryExhausted' may be easier for humans to understand than 'SufficientMemory.'"

### 2. KEP-1623: Standardize Conditions
- URL: https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/1623-standardize-conditions/README.md
- Title: Standardize Conditions
- Publisher: Kubernetes SIG API Machinery
- Kind: KEP
- Summary: Explains why `metav1.Condition` exists. Existing APIs had inconsistent condition schemas, serialization, and required versus optional fields. The KEP defines six fields, makes `lastTransitionTime` and `reason` required, and provides helper functions (`SetStatusCondition`, `FindStatusCondition` and similar). `observedGeneration` is deliberately a non-pointer integer because `metadata.generation` is never zero. Adoption is voluntary, so older APIs keep their own shapes.
- Quote: "LastTransitionTime is required. Some current implementations allow this to be missing, but this makes it difficult for consumers."

### 3. kstatus README (cli-utils)
- URL: https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md
- Title: kstatus
- Publisher: kubernetes-sigs/cli-utils
- Kind: Library design README
- Summary: Describes the library that tools use to decide whether an applied resource has finished reconciling. It computes statuses (InProgress, Failed, Current, Terminating, NotFound, Unknown) and defines the standard `Reconciling` and `Stalled` conditions under the abnormal-true pattern. It states the pattern's weakness (a dead controller looks healthy) and fixes it with `observedGeneration`. For types without those conditions it falls back to `Ready`, and it lists corner cases: a `Ready` condition that only appears once `True` is invisible, and a controller that hasn't yet written conditions is treated as reconciled.
- Quote: "If the controller is not running... it will look like it is in a good state when that is not true."

### 4. Kubernetes operator best practices: Implementing observedGeneration
- URL: https://alenkacz.medium.com/kubernetes-operator-best-practices-implementing-observedgeneration-250728868792
- Title: Kubernetes operator best practices: Implementing observedGeneration
- Publisher: Alena Varkockova (Medium)
- Kind: Engineering blog / explainer
- Summary: A short beginner-friendly argument for `observedGeneration`. Spec and status are written by different actors through different calls, so status can lag or be stale after a controller restart. A generation counter lets any reader tell stale from current. It points to core controllers such as StatefulSet and `kubectl rollout status` as the model to copy. (Fetched through WebFetch because the scraper returned empty content.)
- Quote: "Generation is a monotonically increasing number that gets bumped every time you update your resource."

### 5. Crossplane Managed Resources (v1.20)
- URL: https://docs.crossplane.io/v1.20/concepts/managed-resources/
- Title: Managed Resources
- Publisher: Crossplane (CNCF)
- Kind: Official documentation
- Summary: Defines the two Crossplane condition types. `Ready` reflects whether the external resource is operational, with reasons `Available`, `Creating`, `Unavailable`, `Deleting`. `Synced` reflects whether the provider's reconcile succeeded, with reasons `ReconcileSuccess`, `ReconcileError`, `ReconcilePaused`. The troubleshooting guidance reads the pair together: `Synced=False` points to credentials, config or provider problems, while `Ready=False` with `Synced=True` points to the cloud-side resource. It also mentions an `AsyncOperation` condition for Upjet-based providers. Only a summary of the page (via WebFetch) was read, not the full text.
- Quote: "Provider created and is monitoring the managed resource" (description of ReconcileSuccess).

### 6. provider-aws issue 2287: Synced stays True during async operations
- URL: https://github.com/crossplane-contrib/provider-aws/issues/2287
- Title: [Bug]: `Synced` condition remains `True` during ongoing async operation
- Publisher: crossplane-contrib community
- Kind: GitHub issue / failure-mode report
- Summary: A concrete failure case. During a long MSK cluster update (60+ minutes) the Upjet-based controller reports "up to date", and crossplane-runtime then overwrites the pending state with `ReconcileSuccess`. Alerts on `Synced=False` never fire, and automation polling `Synced` sees false convergence. An `AsyncOperation=False/Ongoing` condition exists but is not part of normal alert conventions. The fix needs changes in both upjet and crossplane-runtime.

### 7. cluster-api issue 9299: kstatus "resource is ready" race
- URL: https://github.com/kubernetes-sigs/cluster-api/issues/9299
- Title: Improve compatibility with kstatus: avoid "resource is ready" race
- Publisher: Cluster API maintainers and community
- Kind: GitHub issue
- Summary: Shows how a brand-new CR with no `status.conditions`, and `observedGeneration` equal to `generation`, is judged ready by kstatus before the controller has done anything. Flux can then act on dependents too early. A suggested workaround was defaulting `observedGeneration` to -1 via a kubebuilder default marker. The issue was later made moot when CAPI changed its conditions, and Flux uses CEL health checks for CAPI resources.
- Quote: "Custom resources without status are considered ready by kstatus, while Kubernetes built-in resources handle this differently."

### 8. kro ResourceGraphDefinition API reference
- URL: https://kro.run/api/crds/resourcegraphdefinition/
- Title: resourcegraphdefinition | kro (v0.10.0)
- Publisher: kro (Kubernetes SIG Cloud Provider)
- Kind: Official API reference
- Summary: Documents `readyWhen` (CEL expressions that decide when a child resource counts as ready; default is "exists"), `includeWhen`, and the RGD's own `status.conditions` (types such as `Ready`, `GraphAccepted`, `KindReady`, `ControllerReady`). Each condition's `observedGeneration` is described precisely: it is the generation the condition was based on, so generation 12 versus 9 means the condition is stale.
- Quote: "If not specified, the resource is considered ready when it exists."

### 9. kro Custom Status Conditions
- URL: https://kro.run/docs/concepts/rgd/status-conditions/
- Title: Custom Status Conditions
- Publisher: kro
- Kind: Official documentation
- Summary: RGD authors can declare their own conditions with CEL (`runtime.newCondition()`). When they do, kro hides its four built-in conditions and the author owns the whole surface, including composing a `Ready` from kro's `ResourcesReady` plus domain signals. Expression errors set `state: Error` and keep the previous conditions. This is a different design from Crossplane, where the provider fixes the condition semantics. (The kro Instances page was fetched but returned no usable content, so instance built-in condition names are only inferred here.)
- Quote: "only the author's conditions appear on `.status.conditions[]`."

### 10. ACK concepts
- URL: https://aws-controllers-k8s.github.io/docs/concepts/
- Title: AWS Controllers for Kubernetes: Concepts
- Publisher: AWS Controllers for Kubernetes project
- Kind: Official documentation
- Summary: ACK separates error types by condition. `ACK.Recoverable` marks transient issues (throttling, service unavailable) that may self-heal. `ACK.Terminal` marks errors that need a spec change. `ACK.ResourceSynced` says the AWS resource matches the spec, `ACK.Adopted` marks adopted resources, and `ACK.ReferencesResolved` marks resolved cross-resource references. `Ready` is the top-level indicator. Splitting terminal from recoverable errors lets humans and automation decide whether to wait or intervene.
- Quote: "Unrecoverable error - spec must be updated before sync can continue."

### 11. Config Connector reconcile-status design
- URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/docs/designs/reconcile-status.md
- Title: Technical design: reconcile status
- Publisher: Google Cloud Platform (k8s-config-connector)
- Kind: Design doc
- Summary: Config Connector uses one `Ready` condition. `Ready=False` with reason `Updating` is set while it calls Google APIs, and the message names the first changed field. `Ready=True/UpToDate` means done, and `Ready=False/UpdateFailure` carries the error. Only one `Ready` entry exists at a time, `observedGeneration` is set on status update, and the doc floats putting long-running operation IDs in the reason for resumability after controller restarts.
- Quote: "Resource is up to date" (message for Ready=True, reason UpToDate).

### 12. Flux Kustomization API
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization | Flux
- Publisher: Flux (CNCF)
- Kind: Official documentation
- Summary: Flux's kustomize-controller reports `Ready`, `Reconciling` and `Stalled`, plus `observedGeneration`. Health checks wait for applied resources to become healthy, using kstatus for compatible CRs. For resources that do not follow kstatus, `healthCheckExprs` supplies CEL expressions. This is the main consumer example of conditions driving dependency ordering (`dependsOn`) in GitOps. Only the first ~100 KB of the page was read.
- Quote: "CEL expressions define custom logic for performing health checks on custom resources."

### 13. How to Implement CRD Status Conditions Following Kubernetes Conventions
- URL: https://oneuptime.com/blog/post/2026-02-09-crd-status-conditions-conventions/view
- Title: How to Implement CRD Status Conditions Following Kubernetes Conventions
- Publisher: OneUptime blog
- Kind: Tutorial
- Summary: A practical walk-through for controller authors: evaluate conditions on every reconcile, use `meta.SetStatusCondition`, set `observedGeneration`, pair `Ready` with `Available` and `Progressing`. Lists pitfalls: vague messages, too many conditions, inconsistent types across CRDs, bumping `lastTransitionTime` on every loop (a "heartbeat"), and a missing `observedGeneration`. Secondary vendor blog, so treat it as explanatory rather than authoritative.

### 14. Argo CD resource health
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/health/
- Title: Resource Health
- Publisher: Argo Project (CNCF)
- Kind: Official documentation
- Summary: Argo CD assigns each resource Healthy, Progressing, Degraded, Suspended, Missing or Unknown and takes the worst of an app's immediate children. For CRDs it needs custom Lua checks (`resource.customizations.health.<group>_<kind>`) because status formats are not standardized. This shows the cost of non-uniform conditions.
- Quote: "The App health will be the worst health of its immediate child resources."

### 15. Kubernetes Deployments
- URL: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- Title: Deployments | Kubernetes
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: The built-in reference example. Deployments publish `Progressing`, `Available` and `ReplicaFailure` conditions and an `observedGeneration`. `progressDeadlineSeconds` (default 600) leads to `Progressing=False` with reason `ProgressDeadlineExceeded` when a rollout stalls, which is how `kubectl rollout status` knows to fail. Good for explaining that conditions describe state over time, not just binary health. Only the first ~100 KB was read.

### 16. Cluster API proposal: improve status in CAPI resources
- URL: https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240916-improve-status-in-CAPI-resources.md
- Title: Improve status in CAPI resources
- Publisher: Cluster API maintainers (SIG Cluster Lifecycle)
- Kind: Design proposal
- Summary: Explains why CAPI abandoned its custom condition model (mandatory `Ready` that summarized everything, a custom `Severity` field, divergence from API conventions). The new model uses `metav1.Condition`, adds `Available` as a separate signal, and adds operation conditions like `ScalingUp` and `Remediating`. Good case study of an ecosystem converging on the Kubernetes convention. Only about 95% of the page was read.
- Quote: "higher level abstractions in Cluster API are designed to remain operational during lifecycle operations."

## Real-world use cases

Deployments and StatefulSets are the everyday case. Tools like `kubectl rollout status` and Helm's `--wait` read `observedGeneration` and conditions to know when a rollout is done (https://kubernetes.io/docs/concepts/workloads/controllers/deployment/, https://alenkacz.medium.com/kubernetes-operator-best-practices-implementing-observedgeneration-250728868792).

GitOps ordering is a major use. Flux's kustomize-controller applies resources, then waits for health before marking a Kustomization `Ready` and unblocking those that `dependsOn` it. Compatible custom resources are judged through kstatus, and others through CEL health expressions (https://fluxcd.io/flux/components/kustomize/kustomizations/, https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md). Argo CD uses Lua health checks over the same data to aggregate application health (https://argo-cd.readthedocs.io/en/stable/operator-manual/health/).

Cloud-resource controllers use conditions to bridge asynchronous external APIs. Crossplane managed resources (for example AWS MSK in the provider-aws issue) expose `Synced` and `Ready` (https://docs.crossplane.io/v1.20/concepts/managed-resources/, https://github.com/crossplane-contrib/provider-aws/issues/2287). ACK distinguishes terminal from recoverable AWS errors (https://aws-controllers-k8s.github.io/docs/concepts/). Config Connector reports Google Cloud updates through `Ready` reasons (https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/docs/designs/reconcile-status.md).

Platform APIs built from other resources use conditions to summarize a graph. kro lets the platform team define the instance `Ready` from child readiness plus domain checks (https://kro.run/docs/concepts/rgd/status-conditions/, https://kro.run/api/crds/resourcegraphdefinition/). Cluster API uses `Available` and `Ready` across Cluster, MachineDeployment and Machine so users can see state during upgrades (https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240916-improve-status-in-CAPI-resources.md).

## Pitfalls and how tools address them

Stale or missing `observedGeneration`. If a controller never records it, observers cannot tell current from outdated status. The Kubernetes conventions, KEP-1623 and kro's API docs all make it a first-class field, and the CRD-conditions tutorial calls its omission a top pitfall (https://oneuptime.com/blog/post/2026-02-09-crd-status-conditions-conventions/view, https://kro.run/api/crds/resourcegraphdefinition/).

Premature readiness on new objects. kstatus treats a resource with no conditions as reconciled, so GitOps tools can proceed before a controller acts. Cluster API hit this with Flux. Mitigations: default `observedGeneration` to -1 in the CRD, write an initial `Unknown` condition at first sight (as the conventions recommend), or use CEL health checks as Flux does (https://github.com/kubernetes-sigs/cluster-api/issues/9299, https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md).

Abnormal-true polarity hides a dead controller. kstatus acknowledges this and leans on generation comparison. Positive `Ready` conditions avoid some of the ambiguity but cannot say whether `False` means progressing or doomed, which is why kstatus pairs them with `Reconciling` and `Stalled` (https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md).

Summary conditions that mask in-flight work. In Crossplane, `Synced=True` stayed set through a 60-minute async update, so alerts on `Synced=False` stayed quiet. The `AsyncOperation` condition exists but is outside normal alert practice (https://github.com/crossplane-contrib/provider-aws/issues/2287).

An all-powerful `Ready`. CAPI found one mandatory `Ready` summarizing everything too rigid and introduced `Available` and per-operation conditions (https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240916-improve-status-in-CAPI-resources.md). kro hands this decision to the RGD author (https://kro.run/docs/concepts/rgd/status-conditions/).

Error classification. ACK's `Terminal` versus `Recoverable` and Crossplane's `ReconcileError` messages tell operators whether to wait or edit the spec (https://aws-controllers-k8s.github.io/docs/concepts/, https://docs.crossplane.io/v1.20/concepts/managed-resources/).

Nonuniform schemas. Argo CD requires Lua per CRD because status formats vary. `metav1.Condition` reduces but does not remove this (https://argo-cd.readthedocs.io/en/stable/operator-manual/health/, https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/1623-standardize-conditions/README.md).

Noisy status writes. Updating `lastTransitionTime` on every reconcile (heartbeats) breaks the field's meaning and adds API traffic (https://oneuptime.com/blog/post/2026-02-09-crd-status-conditions-conventions/view).

## Tutorial and explainer links

- https://alenkacz.medium.com/kubernetes-operator-best-practices-implementing-observedgeneration-250728868792 - the clearest short explanation of why `observedGeneration` exists.
- https://oneuptime.com/blog/post/2026-02-09-crd-status-conditions-conventions/view - hands-on guide to writing conditions in a controller.
- https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/README.md - concise explanation of how tools infer "done" from conditions.
- https://docs.crossplane.io/v1.20/concepts/managed-resources/ - best entry point for Synced versus Ready.
- https://kro.run/docs/concepts/rgd/status-conditions/ - shows authored conditions in a newer platform-API tool.
- https://kubernetes.io/docs/concepts/workloads/controllers/deployment/ - the built-in model to compare everything against.

## Open questions

- The Crossplane page read was v1.20. Condition behavior in Crossplane v2 and the fix status of upjet/crossplane-runtime async signaling (provider-aws issue 2287) were not confirmed.
- The kro instance-level built-in condition names and `state` semantics were not directly read (the Instances page returned no usable content).
- The Flux kstatus and CAPI sources conflict on polarity advice: kstatus favors abnormal-true (`Reconciling`/`Stalled`), while the CAPI proposal and Kubernetes conventions lean toward positive `Ready`/`Available`. How a platform should choose is left to authors.
- Whether `observedGeneration` belongs at top-level status, per condition, or both is not settled in the sources read. The Kubernetes conventions allow either, KEP-1623 puts it on each condition, and kstatus checks the top-level field.
- No postmortem or conference talk was found in this pass (search backend returned errors on later queries). Argo CD, Flux, ACK and Config Connector were each read through a single page, so real-world named adopters (organizations) are thin and mostly inferred from project docs.
- Not read: the Kubernetes API conventions page past ~100 KB, Flux and Deployment pages past ~100 KB, and the last ~5 KB of the CAPI proposal.
