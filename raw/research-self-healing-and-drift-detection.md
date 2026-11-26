# Research dossier: Self-Healing and Drift Detection

Research date: 2026-11-25

Note on method: pages were read through a fetch tool that returns a model-generated digest of each page, not the raw text. Several long pages (Flux HelmRelease, Flux Kustomization, Kubernetes controller page, Server-Side Apply) were digested only for their first ~100,000 characters. Summaries below are my own words; quotes are short and taken from those digests.

## Overview

Self-healing and drift detection rest on one idea: you declare desired state, and a controller keeps comparing it with observed state and acts to close the gap. Kubernetes frames this as a non-terminating control loop. The loop is level-triggered: it reacts to the current state of an object, not to a particular event. A missed event therefore does not cause permanent divergence, because the next reconcile reads the latest state. Reconcilers must be idempotent, work is deduplicated by object key in a workqueue, and informers periodically resync everything to catch anything a watch stream missed.

For in-cluster objects, "drift" means someone or something changed a live object away from what a source of truth says. Flux (kustomize-controller and helm-controller) and Argo CD detect this by diffing desired manifests against live objects. Flux uses a server-side apply dry-run. Argo CD marks the Application OutOfSync and, if `selfHeal` is on, syncs again. Server-side apply field ownership (`managedFields`) is the mechanism that makes this tractable, and also the source of the nastiest edge cases.

For external infrastructure (cloud databases, buckets, IAM), the same loop calls a provider API. Crossplane treats `spec.forProvider` as the source of truth and reverts external edits. AWS Controllers for Kubernetes (ACK) and Config Connector do similar work, and kro orchestrates graphs of resources through an instance controller. Here the cost of observing is an API call, so frequency is a tradeoff: ACK defaults to a 10-hour drift resync and kro's dynamic controller also resyncs every 10 hours, versus Argo CD's roughly 2-minute refresh. Cluster API extends the idea to machines: a MachineHealthCheck watches Node conditions and replaces unhealthy Machines, with a `maxUnhealthy` brake.

The sources agree that correction is never free of policy. Every stack gives you a way to say "do not fight this field or resource" (Argo `ignoreDifferences`, Flux `driftDetection.ignore` and `ssa` annotations, Crossplane `managementPolicies` and the pause annotation, SSA conflicts). The main failure modes are fights between controllers, false-positive diffs from mutating webhooks and defaulting, expensive polling against rate-limited APIs, and cases where the dry-run itself fails so correction never starts.

## Sources

### 1. Kubernetes controller pattern
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: Defines controllers as non-terminating loops that compare the desired state in an object's spec with current state and push the two together. It distinguishes controllers that act through the API server (the Job controller creating Pods) from ones that control external systems directly (a node autoscaler provisioning machines). That second mode is the conceptual root of Crossplane, ACK and Config Connector. Read only the first ~100,000 characters.
- Quote: "In Kubernetes, controllers are control loops that watch the state of your cluster, then make or request changes where needed."

### 2. Kubernetes reconcile loop explained
- URL: https://www.golinuxcloud.com/kubernetes-reconcile-loop-explained/
- Title: Kubernetes Reconcile Loop Explained: Workqueue, Reconcile() & Code
- Publisher: GoLinuxCloud
- Kind: Tutorial explainer
- Summary: Walks through watch, in-memory cache, workqueue and `Reconcile()`. Covers level-triggered semantics, idempotency, deduplication of keys, return values (`Result{}`, `RequeueAfter`, error with backoff) and the informer resync (default 10 hours) that catches missed drift. A good first read for engineers new to controllers; secondary source, so verify numbers against controller-runtime docs.
- Quote: "Stores the latest version of every watched object in an in-memory cache."

### 3. Server-Side Apply
- URL: https://kubernetes.io/docs/reference/using-api/server-side-apply/
- Title: Server-Side Apply
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Explains `managedFields`, field managers, shared ownership when managers set equal values, and conflicts. A conflicting apply can be forced (ownership transfers), can drop the field, or can abort. This is the foundation for how Flux and Argo CD decide what is "theirs" and why another manager's edits show up as drift or as conflicts. Read only the first ~100,000 characters.
- Quote: "Writes to objects with managed fields can be forced, in which case the value of any conflicted field will be overridden, and the ownership will be transferred."

### 4. Flux HelmRelease drift detection
- URL: https://fluxcd.io/flux/components/helm/helmreleases/
- Title: Helm Releases (drift detection section)
- Publisher: Flux project (fluxcd.io)
- Kind: Official documentation
- Summary: `spec.driftDetection.mode` has three values: `disabled` (the default), `warn` (emit events only) and `enabled` (detect and correct). The controller does a server-side dry-run apply of the stored Helm manifest against the cluster and patches differences. Ignore rules take JSON Pointers with optional target selectors. `.spec.interval` sets how often detection runs. Read only the first ~100,000 of ~130,000 characters.
- Quote: "the controller will attempt to correct the drift by creating and patching the resources based on the server-side dry-run apply result."

### 5. Flux Helm drift detection configuration page
- URL: https://fluxcd.io/flux/installation/configuration/helm-drift-detection/
- Title: Flux drift detection for Helm Releases
- Publisher: Flux project
- Kind: Official documentation (stub)
- Summary: Now only a pointer: drift detection became a per-HelmRelease option since Flux v2.2.0 instead of a controller-wide feature gate. Useful mainly as version history; the real content is on the HelmRelease page.
- Quote: "drift detection for Helm releases is available as a configuration option on the HelmRelease itself"

### 6. Flux Kustomization
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomizations
- Publisher: Flux project
- Kind: Official documentation
- Summary: kustomize-controller applies manifests with server-side apply and runs an apply dry-run at every interval to find and fix drift. Covers `interval` (minimum 60s), `retryInterval`, `prune` (garbage collection of objects no longer in the source), `force` (recreate on immutable-field changes, to be used temporarily) and the `kustomize.toolkit.fluxcd.io/ssa` annotation with `IfNotPresent` and `Ignore` for per-object opt-outs. Read only the first ~100,000 of ~121,000 characters.
- Quote: "only apply the Kubernetes resources if they are not present on the cluster"

### 7. Flux discussion 6068: Helm drift cannot recover from a modified Service port
- URL: https://github.com/fluxcd/flux2/discussions/6068
- Title: Helm drift detection cannot recover from modified Service port
- Publisher: Flux community (GitHub discussion, Sep to Oct 2026)
- Kind: Community issue and maintainer-style answer
- Summary: A user edits a Service port with `kubectl edit`. The SSA dry-run then fails with duplicate port names, because `Service.spec.ports` is a list-map keyed by port and protocol, and the `kubectl-edit` manager still owns the edited entry. helm-controller stops at "unable to determine cluster state" and never corrects. `driftDetection.ignore` does not help because ignores apply after the dry-run. The reported fix is running helm-controller with `--override-manager=kubectl-edit` (stated as available since helm-controller v1.5.0), which transfers those fields before diffing. The thread links the same class of bug in Argo CD server-side diff (issue 17717) and Kubernetes issue 130292. A concrete, current demonstration of how field ownership can block self-healing. The answer is from a community member, not an official maintainer statement.
- Quote: "Drift detection does a dry-run apply of the release manifest" (paraphrase of thread text; check the thread for exact wording)

### 8. Argo CD automated sync policy
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Title: Automated Sync Policy
- Publisher: Argo project
- Kind: Official documentation
- Summary: Automated sync applies Git changes without CI needing cluster credentials. `selfHeal` re-syncs when live state deviates (default 5-second timeout, configurable). `prune` is off by default. `retry` uses exponential backoff. Caveats: rollback is disallowed with automated sync, a sync runs only if the app is OutOfSync, and the same commit and parameters are not retried unless self-heal is active. Default refresh is 120 seconds plus up to 60 seconds of jitter.
- Quote: "An automated sync will only be performed if the application is OutOfSync."

### 9. Argo CD diffing customization
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/
- Title: Diffing Customization
- Publisher: Argo project
- Kind: Official documentation
- Summary: Explains why healthy apps show OutOfSync and how to suppress it: `ignoreDifferences` by JSON pointer, JQ path expression or `managedFieldsManagers`, applied per app or system-wide. Lists the usual causes: mutating webhooks, controllers rewriting fields (HPA metrics ordering), non-deterministic Helm templates, and fields dropped for being unknown to the API. Essential for avoiding revert loops with other controllers.
- Quote: "A controller or mutating webhook is altering the object after it was submitted to Kubernetes so it differs from the one in Git."

### 10. Argo CD issue 14591
- URL: https://github.com/argoproj/argo-cd/issues/14591
- Title: App of apps drifts out of sync immediately after syncing
- Publisher: Argo CD community (GitHub)
- Kind: Issue report
- Summary: An app-of-apps looked perpetually out of sync because argocd-image-updater rewrote child Application specs and dropped fields such as `selfHeal`. The cause was another automation tool, not Argo CD. Illustrates that "drift" is often two writers disagreeing, and that diagnosing means finding the second writer.
- Quote: "Confirmed this is an issue in `argocd-image-updater`, not `argo-cd`."

### 11. How GitOps sync and drift detection work (Akuity)
- URL: https://akuity.io/blog/what-is-argo-cd-features-and-business-benefits
- Title: How GitOps Sync and Drift Detection Work
- Publisher: Akuity (vendor founded by Argo creators)
- Kind: Vendor engineering blog
- Summary: Plain-language description of the Application Controller comparing live and target state, with `syncPolicy`, `selfHeal` and `prune` as the response; detection every 120 seconds or near-immediate with Git webhooks. Lists use cases: strict Git-as-truth for stateless apps, manual sync for risky production workloads during adoption, multi-environment promotion with Kargo, and `ignoreDifferences` for resources owned by other controllers. Vendor material, so treat claims as descriptive, not benchmarked.
- Quote: "Argo CD continuously compares the target state of a Kubernetes cluster with the live state present in the Git repository."

### 12. Crossplane managed resources
- URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/
- Title: Managed Resources (Crossplane v2.4)
- Publisher: Crossplane / CNCF
- Kind: Official documentation
- Summary: `Ready` and `Synced` conditions separate "it exists" from "last reconcile succeeded". `spec.forProvider` is the source of truth and external changes are reverted. `managementPolicies` (Observe, Create, Update, Delete, LateInitialize) scope what the controller may do; Observe gives read-only adoption. Poll interval is configurable, the `crossplane.io/paused` annotation stops reconciliation, and finalizers delete external resources before the Kubernetes object. Read via digest only.
- Quote: "Crossplane considers the `forProvider` field of a managed resource the 'source of truth' for external resources"

### 13. Crossplane managed resource API design
- URL: https://github.com/crossplane/crossplane/blob/main/design/one-pager-managed-resource-api-design.md
- Title: Managed Resource API Design one-pager
- Publisher: Crossplane maintainers
- Kind: Design document
- Summary: Defines the spec/status split (`forProvider` versus `atProvider`), external naming (`crossplane.io/external-name`), drift detection by comparing spec to observed state, and late initialization: provider-defaulted fields should be optional in spec so the controller can fill them without causing false drift. Explains why the Crossplane pattern is shaped as it is.
- Quote: "Spec fields must be configurable at any point in the resource lifecycle; Status must be reproducible when deleted." (digest wording)

### 14. ACK drift recovery
- URL: https://aws-controllers-k8s.github.io/community/docs/user-docs/drift-recovery/
- Title: Recovering from Drift
- Publisher: AWS Controllers for Kubernetes project
- Kind: Official documentation
- Summary: After a resource reaches `ResourceSynced = true`, ACK controllers keep reconciling at much longer intervals, defaulting to about 10 hours, to limit AWS API cost and throttling. Helm values `reconcile.defaultResyncPeriod` and `reconcile.resourceResyncPeriods` shorten it for specific kinds (stateful jobs given as an example). This is the clearest statement of the freshness-versus-API-cost tradeoff.
- Quote: "ACK controllers detect drift by continuing to reconcile resources after they have reached their desired state, but with much longer delays."

### 15. Config Connector controller types
- URL: https://docs.cloud.google.com/config-connector/docs/concepts/controller-types
- Title: Config Connector controller types
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Config Connector has direct controllers (Go SDKs), Terraform-based, DCL-based and IAM controllers, behind a routing controller whose namespace-level overrides beat build-time defaults. Direct controllers reduce CPU and memory and give better latency and status. The page says nothing about reconcile intervals or drift cadence, so that remains a gap.
- Quote: "Direct controllers don't have the CPU and memory overhead associated with running and translation of Terraform-based or DCL-based states."

### 16. kro controller tuning
- URL: https://kro.run/docs/advanced/controller-tuning/
- Title: Controller Tuning
- Publisher: kro project (Kubernetes SIGs)
- Kind: Official documentation
- Summary: kro's dynamic controller resyncs all instances every 36,000 seconds (10 hours) to find drift, with `dynamicControllerConcurrentReconciles` defaulting to 1. A single rate-limited queue shields the API server; instances waiting on dependencies requeue with exponential backoff. Tells operators where self-healing latency comes from in kro.
- Quote: "All resource events flow through one rate-limited queue, preventing any single RGD from overwhelming the system"

### 17. kro issue 753
- URL: https://github.com/kubernetes-sigs/kro/issues/753
- Title: Resource state drift not reconciled
- Publisher: kro community (GitHub)
- Kind: Issue report
- Summary: Reported that kro did not reconcile drift in managed resources after initial creation. Closed as completed on 2025-11-04 as a duplicate of issue 323 with fixing commits. The digest's quoted sentence reads like a post-fix statement rather than the original report, so treat the exact history as unverified. Shows that drift handling in younger projects has matured recently.
- Quote: "The KRO controller continuously monitors managed resources and reconciles any drift between the desired and actual state." (digest wording)

### 18. Cluster API MachineHealthCheck
- URL: https://release-0-4.cluster-api.sigs.k8s.io/tasks/healthcheck
- Title: Configure a MachineHealthCheck (Cluster API Book, v0.4)
- Publisher: Cluster API project (Kubernetes SIGs)
- Kind: Official documentation (older release)
- Summary: A MachineHealthCheck evaluates Node conditions against timeouts and remediates unhealthy Machines, typically by replacement. `maxUnhealthy` short-circuits remediation when too many machines look bad (to avoid making an outage worse). Only machines owned by a MachineSet or KubeadmControlPlane are supported. This is the v0.4 book, so details may differ in current releases.
- Quote: "If any of these conditions are met for the duration of the timeout, the Machine will be remediated."

### 19. tofu-controller
- URL: https://github.com/flux-iac/tofu-controller
- Title: tofu-controller (OpenTofu and Terraform GitOps controller)
- Publisher: flux-iac project
- Kind: Project README
- Summary: Runs Terraform or OpenTofu from Flux-style resources. The README mentions a drift-detection-only model where you keep a state file and use GitOps to detect drift while deciding later whether to act. The README digest gave no detail on approval modes or intervals; the project docs site would be the next read.
- Quote: "you'd like to use GitOps just for drift detection, so you can decide to do things later when a drift occurs."

## Real-world use cases

Flux users running Helm-packaged infrastructure (for example, installing the Flux operator itself through a HelmRelease with `driftDetection.mode: enabled`) get automatic reversal of manual `kubectl edit` changes, as shown in the community case at https://github.com/fluxcd/flux2/discussions/6068. The same thread shows where this breaks down.

Teams adopting GitOps incrementally commonly keep Argo CD on manual sync for risky production workloads and turn on `selfHeal` for stateless apps; Akuity describes this and the Kargo promotion pairing (https://akuity.io/blog/what-is-argo-cd-features-and-business-benefits). Argo CD also commonly coexists with HPA and mutating webhooks, which is why `ignoreDifferences` exists (https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/).

Cloud infrastructure from Kubernetes: platform teams use Crossplane to expose databases or buckets as managed resources whose `forProvider` spec is enforced (https://docs.crossplane.io/latest/managed-resources/managed-resources/); AWS shops use ACK with longer resync periods (https://aws-controllers-k8s.github.io/community/docs/user-docs/drift-recovery/); GCP shops use Config Connector (https://docs.cloud.google.com/config-connector/docs/concepts/controller-types). No source here names a specific company running these in production, which is a gap.

Fleet and node lifecycle: Cluster API operators use MachineHealthCheck to replace failed nodes automatically (https://release-0-4.cluster-api.sigs.k8s.io/tasks/healthcheck). Terraform users who want drift visibility without auto-apply use tofu-controller in a detection-only mode (https://github.com/flux-iac/tofu-controller).

## Pitfalls and how tools address them

Field-ownership conflicts. When another manager owns a field, server-side apply can block or distort correction. The Flux discussion shows a dry-run failure that prevents any correction, mitigated by overriding specific managers (https://github.com/fluxcd/flux2/discussions/6068). The Kubernetes SSA docs explain force and conflict semantics (https://kubernetes.io/docs/reference/using-api/server-side-apply/). Argo CD offers `managedFieldsManagers` to ignore chosen managers (https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/).

Controllers fighting each other. A mutating webhook, HPA or image updater rewriting fields leads to endless OutOfSync or revert loops. Argo CD answers with `ignoreDifferences`; Flux with `driftDetection.ignore` and the `ssa` annotation (`Ignore`, `IfNotPresent`) (https://fluxcd.io/flux/components/kustomize/kustomizations/). Issue 14591 shows the other-writer diagnosis pattern (https://github.com/argoproj/argo-cd/issues/14591). Crossplane scopes what it does with `managementPolicies` and can be paused (https://docs.crossplane.io/latest/managed-resources/managed-resources/).

Safe adoption and dangerous correction. Flux offers a `warn` mode before `enabled` (https://fluxcd.io/flux/components/helm/helmreleases/). Argo CD leaves `prune` off by default and blocks rollback under auto sync (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/). Crossplane's `Observe` policy imports without modifying. Flux `force` recreates objects on immutable-field changes and the docs say to use it temporarily (https://fluxcd.io/flux/components/kustomize/kustomizations/).

Polling cost against external APIs. Frequent drift checks on cloud APIs cost money and hit throttles. ACK defaults to long resync (10 hours) and exposes per-resource overrides; kro likewise uses 10 hours with a shared rate-limited queue (https://kro.run/docs/advanced/controller-tuning/). Argo CD's 120-second refresh is cheaper because it reads the Kubernetes API and Git, not a cloud API.

Remediation making an outage worse. Cluster API's `maxUnhealthy` short-circuit stops mass node replacement when many machines look unhealthy at once (https://release-0-4.cluster-api.sigs.k8s.io/tasks/healthcheck).

Late-initialized and defaulted fields. Crossplane's design keeps provider-defaulted fields optional in spec and uses a `LateInitialize` policy to avoid fake drift (https://github.com/crossplane/crossplane/blob/main/design/one-pager-managed-resource-api-design.md).

Maturity of newer controllers. kro had a reported missing-drift-reconciliation bug, closed late 2025 (https://github.com/kubernetes-sigs/kro/issues/753). Check version before assuming self-healing.

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/architecture/controller/ — the canonical, short introduction to control loops and desired versus current state.
- https://www.golinuxcloud.com/kubernetes-reconcile-loop-explained/ — step-by-step reconcile loop with workqueue, requeue and resync behavior.
- https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/ — the clearest short description of self-heal, prune and retry.
- https://akuity.io/blog/what-is-argo-cd-features-and-business-benefits — readable overview of sync and drift detection with use cases.
- https://aws-controllers-k8s.github.io/community/docs/user-docs/drift-recovery/ — short page that makes the drift-check frequency tradeoff concrete.
- https://fluxcd.io/flux/components/helm/helmreleases/ — Flux drift detection modes (long page; search for driftDetection).
- https://github.com/fluxcd/flux2/discussions/6068 — worked example of debugging a drift correction failure.

Candidates seen in search results but not read: https://www.fortros.dev/notes/level-triggered-reconciliation, https://runbook.academy/courses/kubernetes/lessons/kubernetes-iv-06-level-vs-edge-triggered/, https://blog.ogenki.io/post/terraform-controller/, https://deepwiki.com/kubernetes-sigs/kro/4.4-instance-controller.

## Open questions

- Flux helm-controller recovery: the `--override-manager` flag and the "since v1.5.0" claim come from a community reply, not the official docs digest I read. Verify against helm-controller docs.
- Argo CD refresh interval: the auto-sync page says 120 seconds with 60 seconds jitter; Akuity says 120 seconds. Consistent, but jitter was not mentioned by Akuity.
- Config Connector: the page read did not state reconcile intervals or drift cadence. The `cnrm.cloud.google.com/state-into-spec` and reconcile-interval behavior need another source.
- kro issue 753: the digest's description of history (reported bug, duplicate of 323, closed 2025-11-04) and its quote are internally inconsistent; read the thread directly before citing.
- ACK and kro both say 10 hours, but whether these are comparable mechanisms (informer resync versus explicit requeue) is not stated.
- Cluster API source is the v0.4 book; current behavior (remediation templates, newer fields) is not covered.
- Missing: named production case studies or postmortems of drift-correction incidents (for example, a revert loop causing an outage), a KEP on controller resync or SSA, Crossplane drift pitfalls (for example, conflicts with autoscalers), and Terraform-in-cluster drift handling beyond the tofu-controller README.
