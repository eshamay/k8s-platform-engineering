---
title: "Flux Ramp-Up: GitOps Toolkit Architecture, Operation and Design Principles"
type: output
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-reconcile-defaults
    hash: b7be72012393
    ingested: 2026-11-26
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-scale-and-sharding
    hash: d082d1d36d7e
    ingested: 2026-11-25
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: [flux ramp-up, gitops toolkit ramp-up]
tags: [tutorial, flux, gitops, ramp-up, controllers, k8s-platform-engineering]
---

# Flux Ramp-Up: GitOps Toolkit Architecture, Operation and Design Principles

> [!NOTE]
> **Audience:** Engineers who operate Kubernetes (pods, deployments, services, RBAC, kubectl) but have not yet worked with controllers, API machinery or GitOps agents in depth<br>
> **Purpose:** Teach how Flux works from first principles, where it fails in practice, how it compares with neighboring tools, and which of its design choices are worth copying<br>
> **Status:** Draft<br>
> **Created:** 2026-11-25<br>
> **As of:** 2026-11-26<br>
> **Draws on:** [[entities/flux]], [[concepts/gitops-pull-based-delivery]], [[sources/research-flux-deep-dive]], [[concepts/scale-and-sharding]], [[comparisons/flux-versus-argo-cd-architecture]] and the other wiki pages listed under Further reading

## 1. What Flux is and who uses it

Flux is a GitOps tool that runs inside a Kubernetes cluster. You tell it where a set of manifests lives, in a Git repository, an OCI registry (a registry that stores artifacts in the Open Container Initiative artifact format, the same registry format container images use), a Helm repository or an object-storage bucket, and it keeps the cluster matching what it finds there. It does this continuously. If someone edits a live object by hand, Flux notices on its next pass and puts the object back. If someone deletes a manifest from the source, Flux can remove the corresponding object from the cluster. The wiki's definition of the underlying idea, in [[concepts/gitops-pull-based-delivery]], is that the whole desired state is written down declaratively, stored in a versioned and immutable place, and applied by software agents instead of by people or pipelines running commands.

Two words in that definition carry most of the weight, so it is worth unpacking them now. "Declarative" means you describe the end state you want, such as "this Deployment has three replicas and runs this image", and you leave the steps to the system. The alternative, "imperative", means you issue actions, such as `kubectl scale` or a shell script that runs `helm upgrade`. [[concepts/declarative-vs-imperative]] covers the spectrum. "Pull" means the agent lives inside the target cluster and fetches desired state, instead of an outside CI server pushing changes in. The OpenGitOps working group states four principles: the desired state is declarative, it is stored versioned and immutable, agents pull it automatically, and agents continuously observe the real state and try to apply the desired one. The last two principles are what separate GitOps from a CI pipeline that happens to read YAML from Git. A pipeline that pushes once and never looks again does not qualify.

Who uses Flux? The Flux project's adopters page lists more than 200 organizations, including Cisco, SAP, Kong, Grafana Labs, Sonatype, Maersk, Volvo Cars and Axel Springer, though it gives no per-entry detail ([[sources/research-flux-deep-dive]]). The one adopter with a detailed public account in the wiki is Morgan Stanley. A write-up by the Flux team, based on a FluxCon talk, reports "over 500 clusters, over 2,000 nodes, over 100,000 containers, and tens of thousands of Flux resources", and says the firm moved to Flux from push pipelines that suffered from drift and made cluster rebuilds fragile ([[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]]). Because that account was written about the adopter by the project and recounts the adopter's own talk, it is self-reported evidence, not an independent audit. The wiki found no independent postmortem of a Flux outage and no neutral benchmark against Argo CD, and this document repeats that caveat wherever it matters.

The thesis of this ramp-up is that Flux is a set of single-purpose, level-triggered Kubernetes controllers that pull desired state from Git, OCI or Helm sources and converge clusters with server-side apply, and that its design choices (composable controllers, pull delivery, inventory-based pruning, and explicit health and ordering) form a model worth borrowing when you design platforms of your own. The rest of the document earns that claim one layer at a time.

## 2. Mental model: Flux as Kubernetes controllers over KRM objects

To understand Flux you need three ideas that are not specific to Flux: the Kubernetes Resource Model, controllers, and the level-triggered reconcile loop.

The Kubernetes Resource Model, usually shortened to KRM, is the convention that everything in Kubernetes is an object with an identity, a `spec` and a `status`. The `spec` records what a user wants. The `status` records what a controller observed. The wiki's page on the [[concepts/spec-status-split]] explains that users and GitOps tools own `spec`, while controllers own `status`, and the API server enforces the split through a `/status` subresource. This sounds like bookkeeping, but it is the reason a GitOps tool can write a HelmRelease and then read back, from the same object, whether the release succeeded.

A controller is a program that watches objects through the API server and acts to make reality match their `spec`. The Kubernetes documentation calls controllers non-terminating control loops that move current state closer to desired state ([[concepts/reconciliation-loop]]). A Deployment controller makes ReplicaSets match a Deployment. Flux's controllers do the same trick on a higher level, except that the "reality" they converge is the contents of other objects in the cluster, and the "desired state" comes from outside the cluster. Because the cluster's API server, its storage (etcd) and its controller convention have no inherent tie to Pods, the same machinery can manage any declaratively described thing. [[concepts/universal-control-plane]] names this idea, and Flux is an example of using it for delivery.

The third idea is level-triggered reconciliation. An edge-triggered system reacts to an event, such as "a Pod was deleted". A level-triggered system reacts to the current state, such as "three replicas are desired, two exist". If a level-triggered controller misses an event, the next pass still converges, because it recomputes what to do from the state it can see ([[concepts/level-triggered-vs-edge-triggered]]). The wiki records the Kubernetes design stance as "Controllers are level-based to maximize fault tolerance", with watch events used as hints that make the loop faster, never as the source of correctness ([[decisions/events-as-hints-state-as-truth]]). Flux applies this literally. A Kustomization is re-checked on a timer, and events such as a new source revision are an optimization that skips the wait.

Level triggering has three consequences that recur through this document. First, reconcilers must be idempotent, meaning that running them twice leaves the system in the same state as running them once ([[concepts/idempotency]]). Second, the system is eventually consistent. Kubernetes does not promise that the gap between desired and actual state closes instantly, only that it keeps working toward the latest declared state ([[concepts/eventual-consistency-and-convergence]]). Third, the loop is relentless. It will revert intentional manual changes as readily as accidental ones, which [[findings/continuous-loops-override-intentional-changes]] calls the main operational lesson for platform teams.

Finally, Flux sits in the delivery layer of the tooling landscape. The wiki's landscape page ([[concepts/tooling-landscape]]) sorts tools into delivery (get manifests into a cluster and keep them there), provisioning (turn custom resources into cloud API calls) and platform or portal layers (what developers see). Flux and Argo CD are delivery tools. Crossplane, Config Connector, ACK and Cluster API are provisioning tools. Many comparisons go wrong by pitting a delivery tool against a provisioning tool, and section 13 returns to this.

## 3. The GitOps Toolkit: source, kustomize, helm, notification and image controllers

Flux is built from the GitOps Toolkit, which the Flux documentation describes as "a set of specialized tools and Flux Controllers; composable APIs; reusable Go packages for GitOps" ([[examples/flux-splits-gitops-into-single-purpose-controllers]]). Instead of one large operator, Flux ships several small controllers, each of which reconciles its own custom resource definitions (CRDs, the objects that extend the Kubernetes API with new kinds). The controllers communicate only through those custom resources.

The source controller fetches content from outside the cluster. It handles the kinds GitRepository, OCIRepository, HelmRepository, HelmChart and Bucket, fetches "on-demand and on-a-schedule", and packages the result as an archive (tar.gz or yaml) that other controllers read from inside the cluster. The consequence is that downstream controllers never talk to Git themselves. If you decide to move from Git to an OCI registry, you change the source object and leave the delivery objects alone ([[sources/research-flux-deep-dive]]).

The kustomize controller reads an artifact from a source, builds it with Kustomize (a template-free tool that customizes plain YAML with overlays and patches, described in [[entities/kustomize]]), and applies the result to the cluster. It also handles decryption of secrets with SOPS (a tool that encrypts the values in a file) using age, OpenPGP or cloud KMS keys, post-build variable substitution, health assessment, ordering, garbage collection and ServiceAccount impersonation. The helm controller does similar work for Helm releases. Helm, the Kubernetes package manager ([[entities/helm]]), normally runs as a command on a laptop or CI runner. Flux's helm controller instead uses the Helm SDK directly, so there is no Tiller-style server in the cluster, and a HelmRelease object declares what you want the SDK to do.

The notification controller works in two directions. Providers push events to chat systems and other endpoints, Alerts choose which events to send by severity and by involved object, and Receivers accept webhooks from Git hosts, registries and CI so that reconciliation starts at once instead of waiting for the next poll ([[examples/flux-notification-receivers-start-reconciliation-without-waiting-for-the-poll-interval]]). The image automation controllers scan registries for new tags and write the chosen tag back into Git, which section 9 covers.

The API types are published as Go packages, including `github.com/fluxcd/pkg/apis/meta`, and the controllers are ordinary controller-runtime programs, so anyone can read Flux objects with a standard client. That is a quiet but important property. A toolkit whose objects are plain Kubernetes objects can be observed with kubectl, queried by dashboards, composed by other controllers, and tested the way any other API is tested.

There is one more piece worth naming. The Flux Operator, a ControlPlane project, installs and manages Flux through a FluxInstance resource, so the Flux controllers themselves become declaratively managed objects, and it can also declare shards ([[entities/flux-operator]]). Separately, `flux bootstrap` installs Flux and commits its own manifests to the repository so that Flux manages itself from then on ([[concepts/gitops-pull-based-delivery]]).

## 4. Sources and artifacts: Git, OCI, Helm and Bucket, and choosing Git versus OCI

A source object tells the source controller where to fetch from and how often. Here is a minimal GitRepository, followed by the Kustomization that consumes it. The pair is the smallest useful Flux configuration.

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: platform-config
  namespace: flux-system
spec:
  interval: 5m
  url: https://git.example.com/platform/config
  ref:
    branch: main
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: apps
  namespace: flux-system
spec:
  interval: 10m
  sourceRef:
    kind: GitRepository
    name: platform-config
  path: ./apps/production
  prune: true
```

The first object asks the source controller to check the repository every five minutes and publish an artifact whenever the branch tip changes. The second asks the kustomize controller to take the `./apps/production` directory from that artifact, build it, apply it, and re-check the result every ten minutes. The two objects are decoupled. The Kustomization does not know that the artifact came from Git, only that a source named `platform-config` produced one. This is what the Flux deep dive means when it says a team can change where manifests come from without changing how they are applied. The URL, names and intervals above are illustrative.

The four source kinds fit different situations. Git is the familiar choice: review happens in pull requests, history is the audit trail, and every engineer already knows the workflow. OCI registries store the same manifests as immutable, optionally signed artifacts. Helm repositories serve packaged charts. Buckets, meaning S3-style object storage, serve a directory of manifests. Morgan Stanley moved its source of truth from a self-hosted Git provider to S3 buckets, which the write-up gives as an availability and compliance choice, and it lists OCI artifacts as roadmap work ([[decisions/git-versus-oci-as-the-canonical-source]]).

The choice between Git and OCI is open in the wiki's sources, and the decision page frames it without resolving it. Pulling directly from Git gives the simplest mental model and a review workflow people already use. But each cluster then needs network access and credentials to the Git host, and branches and remote references are mutable. Pulling signed OCI artifacts decouples source control from deployment control. CI builds and signs the artifacts, pushes them to a registry, and clusters pull only what they can verify. The cost is an extra build step and registry infrastructure. ControlPlane's D2 reference architecture takes this path for regulated, multi-tenant fleets: three repositories (fleet, infrastructure and applications) are built and signed by CI, each cluster runs a FluxInstance, and ResourceSet templates generate per-tenant resources. ControlPlane summarizes the effect as having "decoupled source control from deployment control, while improving auditability and reducing risk" ([[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]]). The claim comes from the vendor and was not independently verified, so treat it as a design rationale, not a measured result.

A related hazard applies whichever source you choose. If a manifest points at a moving remote reference, such as a Helm chart tag that can be re-pushed or a Kustomize remote base at `HEAD`, the same commit can render differently over time. The OpenGitOps requirement that desired state be versioned and immutable assumes that a revision identifies exactly one desired state, and a floating reference quietly breaks that assumption ([[findings/mutable-remote-references-change-what-a-commit-renders]]). Pin remote references to tags or digests, and change them through reviewed commits.

## 5. Kustomization and HelmRelease: the reconcile loop, intervals, retries and server-side apply

The Kustomization and the HelmRelease are where the work happens, so their timing and apply behavior deserve careful attention.

Every `spec.interval` (a field the Kustomization and HelmRelease references both mark as required, with a recommended minimum of 60 seconds, as the note below explains), the kustomize controller fetches the artifact, builds the manifests, applies them with server-side apply and detects drift. If a run fails, `spec.retryInterval` sets the delay before the next attempt, defaulting to the value of `interval`. `spec.timeout` limits the time spent on build, apply and health checks in one run. Jitter, which is a small random offset added to each timer so many objects do not fire at the same instant, can spread many Kustomizations so they do not all hit the API server together. `spec.suspend` pauses both reconciliation and drift correction, and an annotation can request a manual reconcile ([[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]]). Reconciliation also starts at once when the source revision or relevant metadata changes, so the interval is a safety net and a change is picked up sooner.

A note on defaults, because Flux's own documentation is inconsistent here. The Flux concepts page says reconciliation "runs every five minutes by default", but the Kustomization reference calls `.spec.interval` "a required field" and says the minimum value should be 60 seconds, and the HelmRelease reference also calls it required. The wiki's follow-up check of the Kustomization custom resource type in the kustomize-controller source found the field marked required, with only a duration-format pattern and no default value. A required field has no controller-side default, so a manifest that omits `interval` is rejected and never quietly falls back to five minutes. The 60 seconds is a recommendation phrased as "should" in the prose, and nothing in the type enforces it. The only default the wiki found is on the `flux create` command, whose global `--interval` flag defaults to one minute and applies only when the command generates a manifest for you. The five-minute figure probably circulates because most example manifests use `5m`, though the wiki did not trace where the concepts-page wording came from, and it did not read the value of the controller's jitter setting. The practical consequence is that the drift-correction latency you get is whatever you wrote in the manifest, so set an interval explicitly on every object ([[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]], [[entities/flux]]).

Here is a fuller Kustomization showing the common operational fields.

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: team-a-apps
  namespace: team-a
spec:
  interval: 10m
  retryInterval: 2m
  timeout: 5m
  sourceRef:
    kind: GitRepository
    name: team-a-repo
  path: ./production
  prune: true
  wait: true
  serviceAccountName: team-a-reconciler
```

Reading it from the top: re-check every ten minutes; after a failure, try again after two minutes instead of waiting for the full interval; give each run five minutes; use the `production` directory from the team's repository; delete objects that have disappeared from the source; wait for the applied objects to become healthy before reporting Ready; and perform every write as the named ServiceAccount. The last line matters more than it looks, and section 8 explains why.

Why does Flux apply with server-side apply (SSA)? In the older client-side apply, the kubectl client computes a three-way merge using a `last-applied-configuration` annotation on the object. In server-side apply the API server merges a partial object into the live one and records, for each field, which manager owns it in `metadata.managedFields` ([[concepts/server-side-apply-and-field-ownership]]). The comparison page ([[comparisons/client-side-apply-versus-server-side-apply]]) lists the benefits: no annotation size cap that large CRDs exceed, conflicts that are detected instead of silently lost, and merge behavior defined by schema markers. SSA reached general availability in Kubernetes 1.22. For a GitOps agent the key benefit is that it can co-manage an object with other actors. Flux owns the fields it sets, an autoscaler can own `replicas`, and the API server knows who is who.

Flux uses SSA in two ways. It applies with SSA, and it runs an SSA dry run on each interval to detect drift: the server computes what would change if the manifest were applied, and a non-empty answer means the live object has diverged. This is elegant, because the diff is computed by the same server logic as a real apply, so server defaults are not mistaken for drift. [[findings/diff-is-not-apply-server-defaults-look-like-drift]] shows the contrary case in Argo CD, whose default diff compares inside its own process and therefore reports server-defaulted fields as differences until Server-Side Diff is enabled.

The HelmRelease adds Helm's own lifecycle. It covers `dependsOn`, install and upgrade remediation (retry, roll back or uninstall on failure), optional Helm tests, `valuesFrom` to pull values from ConfigMaps and Secrets, `chartRef` to an OCIRepository or HelmChart, CEL health checks, and a CRD policy ([[sources/research-flux-deep-dive]]). Its status records an audit trail alongside machine-readable health. The conditions are `Ready`, `Reconciling`, `Stalled`, `Released` and `TestSuccess`, and fields such as `observedGeneration`, failure counters, `lastAttemptedRevision` and `lastHandledReconcileAt` say what the controller tried ([[examples/flux-helmrelease-status-records-attempts-and-health]]). The reading rules are simple. `Ready` is the headline. `Reconciling=True` is normal progress. `Stalled` means the release will not advance without a change. And an `observedGeneration` lower than `metadata.generation` means a spec change is still waiting to be processed ([[concepts/conditions]]). Remember that a suspended resource keeps its last condition and can look healthy while doing nothing.

Helm drift detection is off by default. A HelmRelease has `spec.driftDetection.mode` with `disabled` (the default), `warn` (emit events only) and `enabled` (correct the drift). Since Flux v2.2.0 it is a per-release option, no longer a controller-wide feature gate. This three-step ladder is a model for staged adoption, which section 10 returns to.

## 6. Ordering, health checks and dependsOn

Kubernetes applies objects concurrently and lets failures retry until dependencies appear. For many cases that is fine. But some orderings are not self-healing in a pleasant way: a custom resource applied before its CRD exists fails with "no matches for kind", and an application started before its database operator exists may log errors for minutes. The wiki treats CRD ordering as a recurring theme ([[findings/custom-resources-applied-before-their-crd-exists]], [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]]).

Flux handles ordering with three tools. `dependsOn` makes one Kustomization (or HelmRelease) wait until the objects it names are Ready. `wait` and `healthChecks` define what Ready means, so readiness covers the applied objects actually becoming healthy, and not only the apply call returning. Optional CEL expressions (a small expression language, the same one the API server uses for validation) allow custom readiness conditions. The documented pattern for CRDs is to put the CRD-providing controllers in one Kustomization and the custom resources in a second that depends on the first ([[examples/flux-dependson-and-health-checks-gate-rollout]]):

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: monitoring-config
  namespace: flux-system
spec:
  interval: 10m
  sourceRef:
    kind: GitRepository
    name: platform-config
  path: ./monitoring/config
  dependsOn:
    - name: monitoring-operator
  prune: true
```

This Kustomization applies the monitoring custom resources, but only after the Kustomization named `monitoring-operator` reports Ready. If that first Kustomization uses `wait: true` or health checks, "Ready" means the operator Deployment is actually available, so the CRDs and their controller exist. The practitioner blog cited in the dossier recommends layering infrastructure, platform and applications this way. The important insight, stated in the wiki's example page, is that Flux does not abandon eventual consistency to get ordering. It adds health-checked dependencies so that the retry-until-ready behavior happens in a controlled sequence instead of as a burst of transient errors.

Health judgment is a harder problem than it looks, because Flux has to decide whether arbitrary custom resources are healthy. It relies on kstatus, a Go package in `sigs.k8s.io/cli-utils` that computes a generic status for any resource that follows the status conventions, using `observedGeneration` and the `Ready`, `Reconciling` and `Stalled` conditions ([[entities/kstatus]]). The weakness is that kstatus only works where conventions are followed. Cluster API issue 9299 shows the failure: a new object with `observedGeneration` set but no conditions yet can look ready, so Flux can start dependents too early. The proposed fix of defaulting `observedGeneration` to `-1` was closed as not planned in May 2025, partly because Cluster API is moving from `Ready` to `Available` and partly because Flux added CEL health checks for Cluster API ([[findings/premature-readiness-in-kstatus-based-tools]], [[examples/cluster-api-readiness-gates-flux-dependents]]). The lesson is general: generic readiness depends on every provider following one convention, and when a project changes its vocabulary, consumers need explicit per-kind checks again.

Argo CD faces the same problem and answers it differently. It orders a sync by phase (PreSync, Sync, PostSync), then wave number, then kind and name, and advances only when the current wave is healthy, and for custom resources it runs Lua scripts over `status`, noting that "CRDs do not follow a consistent or standardized status format" ([[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]], [[examples/argo-cd-rolls-up-child-health-with-lua-checks]]). kro derives ordering from references between resources inside one graph, and Crossplane lets composition functions withhold dependents until observed state allows them ([[comparisons/ordering-models-flux-argo-cd-kro-crossplane]]). The distinction is that Flux and Argo CD order objects that a pipeline or Git delivers, while kro and Crossplane order resources inside one abstraction.

## 7. Drift, pruning, ignore rules and deletion policies

Drift is the gap between what the source says and what the cluster holds. It arises when a human edits a live object, when another controller rewrites a field, or when the API server fills in defaults. Flux's detection mechanism is the SSA dry run on each interval, so, as [[findings/drift-detection-latency-is-the-interval]] puts it, the worst-case detection latency equals the interval. Webhook Receivers shorten the time to notice new commits but do not change how often live drift is checked.

Pruning is the other half of convergence. With `prune: true`, objects that were applied earlier but are missing from the current source revision are removed. Flux knows which objects it applied through an inventory recorded in the Kustomization's `.status.inventory`, not through Kubernetes owner references ([[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]]). The distinction matters. Owner references link a child object to a parent in the same namespace so that deleting the parent cascades ([[concepts/owner-references-and-garbage-collection]]). A GitOps agent applies objects it did not create through a parent object, so it needs its own inventory plus a finalizer (a token in `metadata.finalizers` that holds an object in a deleting state until a controller finishes cleanup, see [[concepts/finalizers]]) on its own top-level object. The wiki's comparison of garbage collection mechanisms makes the same point for Argo CD, Crossplane and Cluster API ([[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]]).

Prune is a double-edged switch. Without it, "Git is the only source of truth. Without prune, deleted manifests leave orphaned resources", in the practitioner blog's words, which quietly breaks the claim that Git describes the cluster ([[findings/without-prune-flux-leaves-removed-manifests-running-as-orphans]]). With it, a bad edit to Git can delete real objects, and for provider-managed resources a prune followed by a provider delete can remove cloud infrastructure ([[findings/unintended-deletion-through-prune]]). Flux's controls are an annotation, `kustomize.toolkit.fluxcd.io/prune: disabled`, that exempts a single object, and a deletion policy for the case where the Kustomization itself is deleted.

The `spec.deletionPolicy` takes four values. MirrorPrune, the default, follows the `prune` setting. Delete removes the deployed objects. WaitForTermination removes them and blocks until the children have left etcd, which means Flux's own deletion waits on every finalizer its children carry. Orphan leaves them running, the GitOps equivalent of `kubectl delete --cascade=orphan` ([[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]]). The wiki's dossier read about 100 KB of a 121 KB reference page and did not confirm the name of Flux's own finalizer from a primary source, so this document does not state one.

Ignore rules address the most common drift problem, which is a second writer that legitimately owns a field. A team runs Flux against workloads scaled by a HorizontalPodAutoscaler (HPA), and against CRDs whose `caBundle` is injected by cert-manager's cainjector (the cert-manager component that writes certificate authority bundles into CRDs). Flux reverts both. The Flux project's own blog tells of a SEV2 in which Flux kept resetting replicas to a high value, the HPA kept lowering it, and the cluster autoscaler added and removed nodes in a loop, with "the two controllers ping-pong indefinitely" ([[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]]). According to that blog post, Flux then added a Kustomization `.spec.ignore` list of JSON Pointer paths with an optional target selector. A caution is needed here: the wiki read this field only through that single blog post and did not confirm it against the Kustomization API reference, so check the current Kustomization API for the field name and the release that introduced it. The better-documented mechanism is `driftDetection.ignore` on the HelmRelease, together with the per-object `ssa` annotation described below, and you should prefer those when the Kustomization-level field cannot be verified. With that caveat, the blog describes the behavior this way. If another SSA manager owns the field, Flux strips it from its own apply payload ("Strip"). If Flux is the sole owner, it keeps the live value ("Adopt"), so edits made with `kubectl patch` or `kubectl edit` survive. The blog also says ignored fields do not trigger reconciliation and that `flux diff` honours the rules, neither of which the wiki confirmed from another source. There is also a per-object `kustomize.toolkit.fluxcd.io/ssa` annotation with values `Override`, `Merge`, `IfNotPresent` and `Ignore` ([[examples/flux-ssa-annotations-and-ignore-rules-share-fields-with-other-controllers]]).

The price of ignoring is easy to forget. Git changes to an ignored field are no longer applied, so if a team later wants Git to set the replica count, nothing will do it ([[findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied]]). Ignore only fields that another controller rewrites on purpose.

Where does Flux sit among SSA conflict policies? Like Argo CD, it force-applies its own intent by default and then offers escape hatches. The Kubernetes maintainers argue that controllers should force conflicts on objects they own, while CD systems are "more like users" and should surface conflicts to humans. Kluctl takes a third route and decides per field: it overwrites changes from known interactive managers such as kubectl and k9s, leaves fields it lost to other managers alone, and exposes `kluctl.io/force-apply-field` for single fields ([[comparisons/ssa-conflict-policy-across-tools]], [[examples/kluctl-decides-field-level-conflicts-with-known-manager-heuristics]]). The wiki's decision page concludes that the sources do not settle the best default for platforms that run GitOps and in-cluster controllers on the same objects ([[decisions/force-conflicts-or-surface-them-to-humans]]).

## 8. Multi-tenancy, impersonation and security lockdown

Pull delivery changes the security picture. A push pipeline holds credentials for every environment it deploys to, so a breached build server exposes all targets. A pull agent needs only read access to the source and uses in-cluster identity to write ([[comparisons/push-versus-pull-delivery]]). But the agent becomes powerful itself. By default the kustomize controller applies with its own identity, which is cluster-admin, so anyone who can commit a manifest to a repository Flux watches can create anything the controller can ([[findings/without-lockdown-flags-a-flux-kustomization-applies-with-the-controllers-own-identity]]).

Flux's answer is impersonation. A Kustomization or HelmRelease can name a ServiceAccount in `spec.serviceAccountName`, and the controller performs every write as that account, so ordinary Kubernetes RBAC decides what the tenant's repository may create. Platform administrators then start the controllers with three flags: `--no-cross-namespace-refs=true`, which stops a tenant from pointing at sources in other namespaces; `--no-remote-bases=true`, which stops Kustomize from fetching remote bases that could smuggle in content; and `--default-service-account=default`, so objects with no `serviceAccountName` use the `default` account in the tenant's namespace. If that account has no RBAC, deployments simply fail until a Role and RoleBinding are added.

The `fluxcd/flux2-multi-tenancy` reference repository shows the pattern. A fleet repository has `clusters/` for per-cluster entry points, `policies/` for cluster-wide resources, and `tenants/` for the provisioning manifests the administrators own. Each tenant's repository carries a `base/` directory and `staging/` and `production/` overlays. The repository states that "Sharing namespaces between tenants is not supported, as it would break the isolation guarantees" ([[examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation]]). A manifest that tries to create a ClusterRole or write into another namespace is rejected by the API server, not by Flux.

Morgan Stanley's version adds a self-service onboarding platform. It checks the requester's entitlements, registers the service in a configuration management database, primes the new namespace with a GitRepository and a Kustomization, and scaffolds the team's repository. The firm relied on ServiceAccount impersonation with Kubernetes RBAC, so a team's Kustomization can only create what its ServiceAccount is allowed to create.

Two caveats are worth carrying forward. First, the wiki found no incident report of tenant escalation, so the risk rests on documentation. Second, blast radius is a general property of control planes. [[findings/blast-radius-and-privilege-centralization]] observes that a controller concentrating authority is a target, whether it is Flux, a Cluster API management cluster, or a Crossplane provider with a shared cloud credential. The D2 design reduces the exposure further by removing cluster-to-Git connections altogether. A vendor blog about Argo CD says it isolates tenants with Projects, while Flux uses namespaces and RBAC, but that comparison is opinion and should be read as such ([[comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog]]).

## 9. Use cases: fleet management, multi-cluster, image automation, replacing helm upgrade in CI

**Fleet management and multi-cluster delivery.** The strongest evidence is the Morgan Stanley case above: more than 500 clusters, per-tenant impersonation, intervals raised and concurrency tuned, a source of truth moved to S3, a central Grafana dashboard built from kube-state-metrics, and notification-controller events fed to developer tools so tenants can see the outcome of their own deployments. The company listed sharding, OCI artifacts and Flagger (a progressive-delivery tool from the Flux project) as roadmap items, so the wiki holds no production sharding numbers, and a later targeted search found no organization that says it runs sharded Flux ([[sources/research-gap-g1-named-adopters]]). The same pattern generalizes. A fleet repository has a directory per cluster, each cluster's Flux instance points at its own directory, and shared bases carry what is common.

Flux also pairs well with Cluster API for fleet lifecycle. Cluster API is a SIG Cluster Lifecycle project where a management cluster reconciles Cluster, Machine, MachineDeployment and MachineHealthCheck objects into real clusters ([[examples/cluster-fleet-lifecycle-with-cluster-api]]). Flux can deliver those objects from Git and hold back dependent Kustomizations until the Cluster API objects report ready, which is exactly where kstatus and CEL checks mattered in section 6. The management cluster, as the wiki notes, concentrates authority and becomes a single point of failure.

**Image automation.** A team wants patch releases and CVE fixes to reach clusters without anyone editing a manifest, while keeping Git as the record. The image update guide describes the aim as to "automatically deploy application patches (CVEs and bug fixes), and keep a record of all deployments in Git history". Three objects split the job: an ImageRepository scans a registry for tags, an ImagePolicy picks one using semver (semantic versioning, where numbers like 1.4.2 encode major, minor and patch changes), calver (calendar versioning, where the version is a date such as 2026.11) or regex rules, and an ImageUpdateAutomation edits YAML at `$imagepolicy` marker comments, commits and pushes. The ordinary loop then fetches the new revision and applies it, so the cluster still changes only through Git. The multi-tenancy reference repository enables this only for the staging overlay ([[examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging]]). The risk is that a loose regex or a wide semver range can promote a release nobody reviewed ([[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]]). The wiki's dossier read this guide as a digest, so check the current API versions and any beta status before depending on it.

**Replacing `helm upgrade` in CI.** A Helm-heavy team runs `helm upgrade` from a CI job. A failed upgrade leaves the release in a bad state until someone notices, and nothing corrects the release if an operator edits a live object. The Flux guide for Helm users frames the alternative this way: "While the Helm client commands let you imperatively do things, Flux Helm Custom Resources let you declare what you want the Helm SDK to do automatically." A HelmRelease names a chart, supplies values inline or from ConfigMaps and Secrets, remediates failures by retrying, rolling back or uninstalling, optionally runs Helm tests, and can detect and correct drift ([[examples/teams-replace-helm-upgrade-in-ci-with-flux-helmrelease-objects]]). The deeper change is from a one-shot push to a continuous loop, which is the same difference the OpenGitOps principles draw.

**Delivering infrastructure custom resources.** Flux and Argo CD both deliver Config Connector, ACK and Crossplane objects from Git. This is the two-layer loop: the GitOps agent reconciles Git into the Kubernetes API, and a domain controller reconciles the API into reality ([[concepts/gitops-pull-based-delivery]]). On Google Cloud, Config Connector then acts with its own IAM service account, so developer permissions are decoupled from cloud rights, but anyone who can create a resource gains the controller's rights ([[examples/google-cloud-shops-deliver-config-connector-resources-from-git-while-the-controller-s-own-identity-makes-the-cloud-calls]]). The wiki's dossier found no verified Flux relationship with Crossplane, kro, Config Connector, ACK or Cluster API beyond the inference that Flux deploys their custom resources.

## 10. Design principles to take from Flux

Flux is useful to learn for its own sake, but its design is more valuable as a set of choices you can reuse. Each principle below states a reason, not only a preference.

**One controller per concern.** Flux separates fetching, rendering, Helm management, notification and image updates. The wiki cites it as the clearest example of the single-responsibility split, and compares it with ACK (split by AWS service) and Cluster API (core versus provider controllers). The three cut along different axes, function, external API and portability, and the wiki offers no performance comparison among them ([[comparisons/how-flux-ack-and-cluster-api-split-controllers]]). The reason to prefer small controllers is that each has a narrow API, a narrow failure mode and independent upgrade and scaling choices. Sharding in section 12 works only because the controllers are separable.

**Communicate through objects, not calls.** The controllers meet only in custom resources, so every handoff is visible in the API, inspectable with kubectl, and replaceable. When the source layer is separate from the delivery layer, changing from Git to OCI is a one-object edit.

**Level-triggered with events as hints.** The periodic pass guarantees correctness, and webhooks and revision changes only reduce latency. This is the design in [[decisions/events-as-hints-state-as-truth]], and it is the reason a lost webhook produces delay, not divergence.

**Pull, not push.** An agent inside the target holds its own credentials and needs only read access to the source. The reasoning is credential locality: compromising a build server should not hand over every environment. The principle has a price, which is that the agent becomes a powerful identity that must be constrained, and Flux supplies impersonation and lockdown flags for exactly that purpose.

**Inventory-based pruning.** Because Flux records what it applied, it can delete exactly that set when it disappears from the source. Owner references cannot do the job for objects a controller did not create through a parent, and labels alone are fragile. The inventory is an explicit ledger, and the cost is that you must decide what a missing entry means, which is what `prune`, the opt-out annotation and `deletionPolicy` are for.

**Explicit health and ordering.** Flux makes readiness and dependency visible in configuration (`wait`, `healthChecks`, `dependsOn`) instead of hoping retries sort things out. It admits that generic health is hard and provides CEL for kinds that do not follow kstatus.

**Separate detection from correction.** Helm drift detection offers `disabled`, `warn` and `enabled`. The wiki's decision page on staged adoption recommends exactly this ladder: observe first, correct selectively for well-understood workloads, then enforce broadly with documented ignore rules ([[decisions/staged-adoption-of-automated-drift-correction]]). Argo CD's manual sync, Crossplane's Observe policy and tofu-controller's detection-only mode follow the same idea. The principle is that a team should see drift before it lets software act on it.

**Make every dangerous action opt-in and every loop pausable.** Prune, force, drift correction and image automation are switches. `suspend` stops the loop, and the wiki notes that every tool in its dossier ships an off-switch for the same reason: continuous loops override intentional changes ([[comparisons/reconcile-cadence-and-off-switches-across-tools]]). The corollary is that an off-switch needs monitoring, or a forgotten suspension becomes silent drift.

**Compensate for upstream limits, and say so.** Helm will not upgrade or delete CRDs "due to unintentional data loss dangers". Flux's `spec.install.crds` and `spec.upgrade.crds` offer Skip, Create (the default) and CreateReplace, and CreateReplace updates existing CRDs but deliberately does not delete removed ones, leaving cleanup to a human ([[examples/flux-helmrelease-crd-policies-createreplace-and-dependson]], [[findings/helm-does-not-upgrade-or-delete-crds]]). A good wrapper improves on the tool beneath it without hiding its safety choices.

## 11. Pitfalls: orphans, prune accidents, SSA migration, silent suspended failures, circular dependencies, HPA fights

The wiki's evidence on pitfalls comes from documentation, issue trackers and one practitioner blog. It found no independent Flux postmortem, so severity is inferred and each item below says what kind of evidence stands behind it.

**Orphans and prune accidents.** These are the two sides of the same switch, covered in section 7. Mitigations are to enable `prune` together with `healthChecks`, run `flux diff` or `kubectl diff` before merging risky changes, annotate objects that must never be pruned, and pick `Orphan` for critical resources. For managed cloud resources, a Git removal becomes a prune followed by a provider delete unless Delete is excluded from the provider's management policies ([[findings/unintended-deletion-through-prune]]). Argo CD defaults to no prune and adds an allow-empty guard, and its own `Replace=true` and `Force=true` options can recreate resources and cause outages ([[findings/argo-cd-replace-and-force-sync-options-can-recreate-resources-and-cause-outages]]). Flux's `force` recreates objects on immutable-field changes and should be set only temporarily because it can cause downtime.

**Client-side to server-side apply migration.** Flux 0.17 applied through client-side apply, and 0.18 moved kustomize-controller to server-side apply. Users who upgraded, and users who adopted hand-applied resources, found that fields removed from Git stayed in the cluster. Issue 486 records the cause: the old manager still co-owned the fields, and force cannot take ownership of a field that no longer appears in the applied object, in the maintainer's phrase "you can't force ownerships for non existing fields". The workaround was to delete the offending `metadata.managedFields` entry, and an `--override-manager` flag later reclaimed named managers, but only after a successful dry run ([[examples/flux-migration-from-client-side-apply-strands-removed-fields]], [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]]). A related case, issue 1722, shows a legacy controller co-owning a container entry's key, so that removing the container left a half-removed object and the dry run failed on every reconcile. The issue was opened on 2026-08-06 and closed through kustomize-controller PR 1747, merged on 2026-10-23, which added an opt-in flag that runs the takeover before the dry run. The flag is named `--override-manager-before-dry-run`, and it first shipped in kustomize-controller v1.10.0 on 2026-10-24 and in Flux v2.10.0 on 2026-10-26. A maintainer had called this kind of takeover dangerous, and the shipped documentation bears that out. The takeover transfers all fields owned by the managers you list, not only the field that wedged the dry run, it prunes fields missing from the source, and the `managedFields` change is not reverted if the apply then fails. Manager names are matched exactly rather than by prefix, and the default managers such as kubectl stay on the ordinary post-dry-run path. The documentation says to use the flag only to recover stuck objects and to remove it once they reconcile ([[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]], [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]], [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]]). Crossplane hit the same class of problem moving composed resources to composition functions, and Argo CD automates a migration to its `argocd-controller` manager.

**Field ownership blocks drift correction.** A community discussion shows a HelmRelease with drift detection enabled and a Service port edited by `kubectl edit`. `Service.spec.ports` is a list keyed by port and protocol, and the `kubectl-edit` manager still owns the entry, so the dry run fails with duplicate port names and helm-controller stops at "unable to determine cluster state". Ignore rules do not help because they apply after the dry run. The reported fix is `--override-manager=kubectl-edit`, stated as available since helm-controller v1.5.0, but it comes from a community member, not a maintainer, so verify it ([[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]]). The lesson is that self-healing depends on the diff succeeding, and the diff depends on clean field ownership.

**Webhooks without dry-run support.** Because Flux dry-runs first, an admission webhook (a call the API server makes to an external service to validate or modify an object before storing it) that does not declare `sideEffects` of `None` or `NoneOnDryRun` makes the apply fail with "admission webhook does not support dry run". The fix belongs on the webhook configuration, not in Flux ([[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]]).

**Silent failures.** The practitioner blog lists three ways Flux looks healthy while not delivering: a suspended resource stops reconciling and drift builds up unnoticed; without webhook Receivers, a change waits for the next poll; and running `flux reconcile` without `--with-source` reconciles against the source's last fetched revision, so the command succeeds without picking up the new commit. It recommends alerting on `gotk_reconcile_error_total` and `gotk_suspend_status` ([[findings/suspended-resources-polling-lag-and-a-missing-with-source-flag-make-flux-failures-silent]]). This is a secondary source, but the failure modes follow directly from the design in section 2.

**Circular dependencies.** The HelmRelease reference says circular dependencies "must be avoided, otherwise the interdependent HelmRelease resources will never be reconciled". Each waits for the other to be Ready, so neither starts, and the failure is a stall, not an error. The wiki's dossier does not say whether Flux detects the cycle at admission. kro, in contrast, rejects cycles at definition time ([[findings/circular-dependson-chains-between-flux-resources-never-reconcile]]).

**HPA fights.** Covered in section 7. The general diagnosis, from [[findings/controllers-fighting-over-fields-cause-revert-loops]], is that drift is often two writers disagreeing, and the first step is to find the second writer. Argo CD saw the same pattern when argocd-image-updater rewrote child Application specs ([[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]]).

**Failure and retry defaults differ across tools.** Flux keeps retrying on `retryInterval`. Argo CD does not retry a failed sync of the same commit and parameters unless retry is configured ("Automatic sync will not reattempt a sync if the previous sync attempt against the same commit-SHA and parameters had failed"), while controller-runtime retries forever with exponential backoff ([[examples/argo-cd-does-not-retry-a-failed-sync-of-the-same-commit-unless-retry-is-configured]], [[comparisons/retry-and-backoff-controls-across-tools]]). Retrying without limit risks amplification, and refusing to retry risks silent non-convergence.

**A cross-tool summary.** The table lists how each stack deals with the problems above.

| Problem | Flux | Argo CD | Others in the wiki |
|---|---|---|---|
| Second writer on a field | `.spec.ignore` Strip and Adopt (single-blog claim, unverified), `driftDetection.ignore` on HelmRelease, `ssa` annotation | `ignoreDifferences`, Server-Side Diff | Crossplane `initProvider` and `managementPolicies`; Kluctl per-field force |
| Removal from source | `prune` plus inventory, `deletionPolicy` | Prune off by default, resources finalizer on the Application | ACK retain policy; Config Connector `abandon` annotation |
| Ordering | `dependsOn`, `healthChecks`, `wait`, CEL | Phases and waves, Lua health | kro graph references; Crossplane function readiness |
| Readiness of custom kinds | kstatus plus CEL | Lua per CRD | Crossplane `Synced` and `Ready`; Cluster API moving to `Available` |
| Pause | `suspend` | Disable automated sync | Crossplane pause annotation; Config Connector interval "0" |

Every cell comes from the comparison pages cited in this section and in sections 6 and 7 ([[comparisons/exemption-and-ignore-controls-across-tools]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]]). Not every cell was checked against a primary page. The Flux `.spec.ignore` entry is unverified for the reason given in section 7, and the entries in the "Others in the wiki" column, such as the Crossplane `initProvider` and pause annotation, the ACK retain policy and the Config Connector `abandon` annotation and interval "0", come from comparison pages whose underlying dossiers did not read every source page in full.

The table is a quick reference, and the reasons behind it matter more than the cells. For a second writer on a field, Flux and Argo CD both start from a force-everything stance and then offer escape hatches. Flux lets you strip or adopt fields per object or per path, while Argo CD's `ignoreDifferences` hides differences from its comparison and its Server-Side Diff makes the comparison use the server's own merge logic. The provisioning tools approach it from the other side, because they expect other writers (cloud defaults, other controllers) and so give each resource a policy for which fields to leave alone. The trade-off is between predictability and surprise. A tool that always reverts is simple to reason about but fights every legitimate co-owner, and a tool with per-field rules is flexible but needs a human to decide which fields are safe to ignore.

For removal from the source, Argo CD defaults to the non-destructive choice, since prune is off until you enable it, whereas Flux asks you to set `prune` and then offers explicit switches (the opt-out annotation and `deletionPolicy`) for the dangerous cases. Provider tools differ again, because deleting the Kubernetes object can delete real cloud infrastructure, so their policies (ACK retain, Config Connector `abandon`, Crossplane management policies) exist to separate the life of the object from the life of the cloud resource. Ordering and readiness follow the same logic. Flux and Argo CD order objects delivered from outside and need generic or scripted health checks to know when a custom kind is ready, while kro and Crossplane order resources inside one abstraction and can read readiness from their own graph. Pause is the simplest row, since every tool has an off switch, and the cost of each is that a forgotten pause quietly becomes drift.

## 12. Scaling Flux: intervals, concurrency, sharding and memory

Scale in a controller is several separate limits, not a single number. The wiki's scale page lists four constraints inside a client-go controller: the informer cache holds every watched object, so memory grows with what is watched; the workqueue never processes one key concurrently, so throughput depends on the worker count and the time per reconcile; the client rate limiter throttles requests before they reach the server; and leader election (replicas of a controller agree on one active instance via a lock object, and the rest wait as standbys) means only one replica reconciles ([[concepts/scale-and-sharding]], [[concepts/informers-reflectors-and-workqueues]]). The informer cache is an in-memory copy of everything watched, and the Kubernetes blog says it has no eviction ([[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]]).

Flux's documented order of response is to tune before you split.

**Lengthen intervals.** Fewer scheduled reconciles mean less API load, at the cost of slower drift correction. Morgan Stanley did this.

**Raise concurrency and resources.** The `--concurrent` flags raise the number of parallel reconciles, which are the workqueue workers. The scale dossier states a suggested 10 to 20, along with higher CPU and memory limits for the source, kustomize and helm controllers, a memory-backed `emptyDir` on `/tmp` to speed Kustomize builds, and persistent volumes so artifacts survive restarts. The source controller can cache Helm indexes with `--helm-cache-max-size` and `--helm-cache-ttl`. The vertical scaling page warns that "tmpfs will count against the controller's pod memory usage" ([[examples/flux-controllers-expose-worker-concurrency-and-helm-cache-size-as-tuning-knobs]]). Raising concurrency shifts load onto the API server or onto pod memory.

**Do not add replicas for capacity.** "Extra replicas of a Flux controller are failover standbys. Only the elected leader reconciles." Going from one replica to three buys availability, not throughput ([[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]]).

**Shard when one instance cannot keep up.** Sharding runs several copies of a controller under unique names, such as `source-controller-shard1`. Each starts with `--watch-label-selector` set to its own value of the label `sharding.fluxcd.io/key` and reconciles only objects carrying that label, while the default controllers skip labeled objects so nothing is handled twice. Source, kustomize and helm controllers can be sharded, but the notification controller cannot be sharded. The scale dossier also lists a further component it calls the source-watcher as unshardable; the wiki does not otherwise describe that component, so treat it as unverified ([[sources/research-scale-and-sharding]] says only that it cannot be sharded).

```yaml
# Illustrative: a HelmRelease placed on a shard by label
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: tenant-b-ingress
  namespace: tenant-b
  labels:
    sharding.fluxcd.io/key: shard1
spec:
  interval: 15m
  chart:
    spec:
      chart: ingress-nginx
      sourceRef:
        kind: HelmRepository
        name: tenant-b-charts
```

The label places the release on the controller instance watching `shard1`. The catch is that the HelmRepository it references, and the HelmChart generated from it, need matching labels too, otherwise the pieces land on different controllers. The wiki's finding notes that the exact HelmChart labeling rule was not verified. A parent Kustomization can bulk-label children through `commonMetadata` and patches, and the Flux Operator removes the manual work by declaring shards in the FluxInstance spec, though the labels still have to be applied ([[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]], [[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]]).

Is sharding needed yet? The Flux sharding page advises it when Flux is managing "tens of thousands of applications", though the wiki's decision page notes that no source states a precise threshold. A targeted search for named adopters found no organization that says it runs sharded Flux with a shard count or object count. Morgan Stanley, the best-known large adopter, lists "Exploring sharding Flux controllers" under "Looking Ahead", so it is not a documented sharding user. The evidence that does exist is thinner and mostly anonymous: a hub-and-spoke user reported reconciliation storms during nightly deploy windows in flux2 issue 5470 (August 2025) and a maintainer suggested sharding among other options ([[examples/a-hub-and-spoke-flux-user-reported-nightly-reconciliation-storms-and-was-told-to-shard-or-tune]]), a cross-shard `dependsOn` failure was fixed in 2024 ([[findings/a-flux-dependson-across-shards-failed-with-dependency-not-found-until-a-2024-fix]]), and an unnamed reporter of source-controller issue 2150 said they hit stale artifacts after objects left a shard "in production" ([[findings/objects-that-leave-a-flux-shard-keep-stale-artifacts-on-the-old-source-controller]]). These show that people shard, but none is a named adopter with numbers. The reasonable reading, which no source states as a rule, is to tune first and shard when one instance reaches its limits ([[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]], [[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]]). Argo CD partitions by destination cluster instead of by label, with `legacy`, `round-robin` and `consistent-hashing` assignment, a legacy algorithm that can be uneven, and the others described as experimental in the digest the wiki read. Cluster sharding fits hub-and-spoke setups (one central cluster running the delivery tool and pushing to many smaller workload clusters) but cannot divide one very large cluster, whereas label sharding can separate tenants inside one cluster at the price of label discipline ([[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]]).

A word on API Priority and Fairness (APF), the API server feature that queues and prioritizes incoming requests by flow so that no single client can starve the rest. Flux's June 2022 update says all its controllers conform to APF, and the change behind it turns off the controllers' own client-side throttling when the server has APF enabled, because client-go honors the `Retry-After` header the APF filter sets. A pull request closed in February 2026 (fluxcd/pkg PR 1118) fixed a path where a custom kubeconfig still used client-side rate limiting even when APF was available; the wiki records that the pull request was closed but does not say it was merged, so the exact release that carries the fix is unconfirmed. Until that fix,  the two throttling layers can disagree inside one tool ([[findings/flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026]]). The wiki found no published incident or postmortem that ties Flux, sharded or not, to APF throttling. Searches of the fluxcd issues and the web came back empty, but those searches were limited, so read this as an open question and not as proof that no such incident happened.

Finally, remember that constant reconciliation costs something. Level triggering means repeated work, and for controllers that manage external systems every cycle can be a quota-consuming API call. Flux and Argo CD read the Kubernetes API and Git, so seconds-to-minutes cadences are cheap, while ACK and kro default to about ten hours for cloud resources ([[findings/cost-of-constant-reconciliation]], [[decisions/choosing-a-drift-check-interval-for-external-resources]]).

## 13. How Flux compares with Argo CD, Kluctl and push-based CI, and its relationship to Crossplane and Cluster API

**Argo CD.** Both are CNCF GitOps delivery tools. Flux is "controllers all the way down": separate controllers with their own CRDs, a Kubernetes-API-and-custom-resource interface, and reconciliation on a schedule. Argo CD is more centralized, with an API server serving UI, CLI and CI, a repository server that caches Git and renders manifests, and an application controller that diffs live against target state ([[comparisons/flux-versus-argo-cd-architecture]]). Their defaults differ in a revealing way. Argo CD ships with destructive actions off: prune off, self-heal off, allow-empty protection, and manual sync as a middle stage. Flux exposes explicit switches and policies for each, such as `prune`, `deletionPolicy` and drift-detection modes ([[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]]). Argo CD's default repository polling interval is a few minutes with added jitter, so check the version you run, and Flux's interval is chosen per object, with the default unresolved as noted in section 5. Argo CD blocks rollback while automated sync is on, so rollback becomes a Git revert ([[findings/rollback-is-blocked-while-automated-sync-is-on]]). One more caution about this comparison: much of the comparative claim-making comes from vendors. Akuity, which sells Argo CD, says Flux has a lower and more predictable footprint and suits air-gapped setups, and relies on the Flux Operator for its official UI. Devtron, a vendor built around Argo CD, says Flux lacks a native UI, which the wiki marks as dated. None of these were independently benchmarked ([[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]]). Treat the UI and scale claims as opinion.

**Kluctl.** Kluctl is a deployment tool whose author moved it from shelling out to kubectl with client-side apply to calling server-side apply directly, after hitting the annotation size limit on large CRDs. Its distinctive feature is per-field conflict decisions ([[entities/kluctl]]). Compared with Flux, which force-applies its intent and provides ignore rules, Kluctl is the one tool in the wiki that makes a field-level decision by default. The source is the tool's own maintainer writing on the Kubernetes blog.

**Push-based CI.** A push pipeline runs `kubectl apply` or `helm upgrade` once and stops. It holds credentials for every target, fails the "continuously reconciled" principle if it never re-checks, and tends to accumulate drift. The Morgan Stanley account describes exactly this experience. The comparison is not absolute: Flux itself supports push-style triggers through webhooks, and the pull agent is a powerful identity that needs constraining ([[comparisons/push-versus-pull-delivery]]). INNOQ argues that the pull pattern does not require Kubernetes, since an operator inside any target can read desired state from Git and reconcile, though the wiki found no named production deployment of that idea ([[examples/gitops-agent-on-non-kubernetes-targets]]).

**Crossplane, Config Connector, ACK and kro.** These are provisioning or abstraction tools, so the relationship with Flux is layered, not competitive. Flux delivers their custom resources, and they reconcile the real world. Crossplane lets a platform team publish its own typed API through an XRD and Composition with a pipeline of functions. kro does something similar with a resource graph and CEL. Config Connector and ACK expose roughly one CRD per cloud resource. Because these tools reach into clouds, prune and deletion semantics propagate: ACK's default is to delete the AWS resource, Config Connector's `abandon` annotation keeps it, and Flux's `Orphan` and `prune: disabled` keep the Kubernetes objects ([[comparisons/deletion-policies-across-gitops-and-provider-tools]]). A render-time tool such as Helm or Kustomize produces manifests once and needs something like Flux for continuous correction, while Crossplane and kro are themselves live control loops ([[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]]). The wiki reports that the Argo CD guide for Crossplane needs custom Lua health checks, annotation-based tracking and a raised client QPS, because a generic GitOps agent cannot judge custom-resource health unaided ([[findings/generic-gitops-agents-cannot-judge-custom-resource-health]]). Flux faces the same issue and answers with kstatus plus CEL. A tool-by-tool comparison of Flux with Crossplane, kro, Config Connector or ACK was not found in the sources, so the relationship here is an inference from how each tool is documented.

**Cluster API.** Cluster API is the clearest case of Kubernetes managing Kubernetes, and Flux's role is to deliver its objects and wait for them. The kstatus episode in section 6 is the concrete point of contact, and it shows how a change in a provider's condition vocabulary (`Ready` moving toward `Available`) forced Flux to add explicit CEL checks ([[comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api]]).

## 14. Getting started checklist and remaining unknowns

If you are starting from zero, an order that follows the wiki's evidence is the following. Bootstrap Flux against a test cluster so that it commits its own manifests and manages itself. Create one GitRepository and one Kustomization, with an explicit `interval`, and watch the status conditions, then hand-edit a Deployment and watch it revert. Turn on `prune` with a deliberately throwaway manifest and confirm what disappears, and learn the `prune: disabled` annotation before you need it. Add `wait` or `healthChecks`, then a `dependsOn` edge for a CRD-and-operator pair. Move one `helm upgrade` job into a HelmRelease, leaving drift detection at `warn` until you have read the drift events. Add webhook Receivers and an Alert so that failures and new commits are not silent. Decide on tenancy before the second team arrives: set the three lockdown flags, create a ServiceAccount per tenant with namespace-scoped RBAC, and keep one tenant per namespace. Add alerts on `gotk_reconcile_error_total` and `gotk_suspend_status`. Only after that, consider ignore rules, image automation (staging only to begin with), and sharding.

Some questions the wiki cannot answer, and a few where its sources disagree, belong in your plan as caveats. The Flux concepts page still says five minutes by default, but the reference pages and the controller's type definition show `interval` is required with no default, so that wording is best treated as a documentation inconsistency whose origin the wiki did not trace. The Kustomization-level `.spec.ignore` list with Strip and Adopt modes was read only through a single blog post and not confirmed against the Kustomization API reference, whereas `driftDetection.ignore` on the HelmRelease is better documented. Most Flux documentation pages were read through summarizing fetches, and the Kustomization and HelmRelease pages were read without their last 20 to 23 percent, so quoted field names should be checked against the live pages. The name of Flux's own finalizer was not confirmed. Whether Flux detects circular `dependsOn` chains at admission is not stated. The pre-dry-run takeover flag from issue 1722 is now verified as `--override-manager-before-dry-run`, shipped in kustomize-controller v1.10.0 and Flux v2.10.0, but the helm-controller `--override-manager` flag and its reported version of v1.5.0 still rest on a community post. The current status of the image automation APIs was not confirmed. No independent Flux postmortem or neutral Argo CD benchmark exists in the wiki, and no organization is named as running Flux shards or as having had an APF incident with Flux, even after a targeted search. Finally, the best default for platforms that run GitOps and other controllers on the same objects remains unsettled in the sources ([[decisions/force-conflicts-or-surface-them-to-humans]]). These items are tracked in the wiki's open-knowledge-gaps file.

## Further reading

Wiki pages relied on:

- Entities: [[entities/flux]], [[entities/flux-operator]], [[entities/argo-cd]], [[entities/kustomize]], [[entities/helm]], [[entities/kluctl]], [[entities/kstatus]], [[entities/crossplane]], [[entities/cluster-api]]
- Concepts: [[concepts/gitops-pull-based-delivery]], [[concepts/universal-control-plane]], [[concepts/reconciliation-loop]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/eventual-consistency-and-convergence]], [[concepts/idempotency]], [[concepts/server-side-apply-and-field-ownership]], [[concepts/finalizers]], [[concepts/owner-references-and-garbage-collection]], [[concepts/conditions]], [[concepts/spec-status-split]], [[concepts/informers-reflectors-and-workqueues]], [[concepts/scale-and-sharding]], [[concepts/declarative-vs-imperative]], [[concepts/tooling-landscape]]
- Decisions: [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]], [[decisions/git-versus-oci-as-the-canonical-source]], [[decisions/staged-adoption-of-automated-drift-correction]], [[decisions/force-conflicts-or-surface-them-to-humans]], [[decisions/events-as-hints-state-as-truth]], [[decisions/choosing-a-drift-check-interval-for-external-resources]]
- Comparisons: [[comparisons/flux-versus-argo-cd-architecture]], [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], [[comparisons/ssa-conflict-policy-across-tools]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], [[comparisons/push-versus-pull-delivery]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]]
- Sources: [[sources/research-flux-deep-dive]], [[sources/research-gitops-pull-based-delivery]], [[sources/research-scale-and-sharding]], [[sources/research-landscape]], [[sources/research-server-side-apply-and-field-ownership]], [[sources/research-self-healing-and-drift-detection]], [[sources/research-pitfalls-and-case-studies]]

Primary URLs cited through those pages (the wiki read these through summarizing fetches, as section 14 notes):

- https://fluxcd.io/flux/components/
- https://fluxcd.io/flux/components/source/
- https://fluxcd.io/flux/components/kustomize/kustomizations/
- https://fluxcd.io/flux/components/helm/helmreleases/
- https://fluxcd.io/flux/components/notification/
- https://fluxcd.io/flux/guides/image-update/
- https://fluxcd.io/flux/installation/configuration/multitenancy/
- https://fluxcd.io/flux/installation/configuration/sharding/
- https://fluxcd.io/flux/installation/configuration/vertical-scaling/
- https://fluxcd.io/flux/use-cases/helm/
- https://fluxcd.io/blog/2026/03/stairway-to-gitops-morgan-stanley/
- https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/
- https://fluxcd.io/adopters/
- https://github.com/fluxcd/flux2-multi-tenancy
- https://github.com/fluxcd/kustomize-controller/issues/486
- https://github.com/fluxcd/kustomize-controller/issues/1722
- https://github.com/fluxcd/flux2/discussions/6068
- https://github.com/kubernetes-sigs/cluster-api/issues/9299
- https://fluxoperator.dev/docs/instance/sharding/
- https://control-plane.io/posts/d2-reference-architecture-guide/
- https://argo-cd.readthedocs.io/en/stable/operator-manual/high_availability/
- https://kubernetes.io/blog/2022/11/04/live-and-let-live-with-kluctl-and-ssa/
- https://codingprotocols.com/blog/fluxcd-gitops-production (secondary practitioner source)
