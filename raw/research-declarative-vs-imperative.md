# Research dossier: Declarative vs Imperative

Research date: 2026-11-25

Method note: pages were read through a scrape/fetch tool that returns a model-condensed view, and long pages (Kubernetes docs) were only read in the first ~100,000 characters. Quotes below are as returned by that tooling.

## Overview

In Kubernetes, "declarative" means you store a record of intent (an object whose `spec` says what you want) and let controllers drive the world toward it. "Imperative" means you tell the system which action to take now (`kubectl create`, `kubectl scale`, a shell script). The official object-management page frames this as a spectrum of three techniques: imperative commands, imperative object configuration (`kubectl replace -f`), and declarative object configuration (`kubectl apply -f dir/`). The trade is simplicity and low learning curve against reviewability, auditability and tolerance of multiple writers.

Mechanically, the declarative model works because of the controller pattern. An object has `spec` (desired) and `status` (observed). Controllers run non-terminating control loops that compare the two and act, like a thermostat. The API conventions and several explainers stress that Kubernetes is level-based rather than edge-based: a controller reacts to the current full state, not to the history of changes, so missed or coalesced events do not cause permanent divergence. Even though controllers use list-watch events for efficiency, they still re-list and reconcile full state.

Higher layers apply the same idea. Flux and Argo CD treat Git as the desired state and reconcile the cluster to it, reverting manual drift when configured to. Crossplane, Config Connector, ACK and Cluster API extend the model to cloud resources and whole clusters as custom resources. kro and Crossplane compositions let platform teams define new APIs that expand into many resources. The operator pattern packages human operational knowledge into controllers for custom resources.

The sources agree on the core idea but differ on how strict "pure declarative" is in practice. Kubernetes itself keeps imperative commands for development and one-offs, and tools expose escape hatches (suspend, retain/orphan deletion policies, force, abandon) because declarative reconciliation can be dangerous when ownership, deletion, or drift semantics are misunderstood. Most pitfalls fall into: multiple writers fighting over fields, pruning/deleting things unexpectedly, drift correction fighting server-defaulted values, and immutable fields that cannot be patched.

## Sources

### 1. Kubernetes Object Management
- URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/object-management/
- Title: Kubernetes Object Management
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: Defines three techniques for managing objects: imperative commands (lowest learning curve, no review or audit trail, suited to development), imperative object configuration (files plus explicit verbs like replace, suited to single-writer production), and declarative object configuration (`kubectl apply` on directories, suited to multiple writers, harder to debug because of merge and patch logic). Best starting page for the vocabulary used throughout the wiki. Warns not to mix techniques on the same object.
- Quote: "Changes made directly to live objects are retained, even if they are not merged back into the configuration files."

### 2. Controllers (Kubernetes concepts)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Introduces the control loop and the thermostat analogy. Controllers watch cluster state and make or request changes to move current state toward desired state. The page stresses that many small controllers each own one aspect, that controllers may fail so the design tolerates it, and that the cluster need not ever be "stable". It also covers ownership via labels so controllers do not fight. Useful for explaining why declarative works at all.
- Quote: "controllers are control loops that watch the state of your cluster, then make or request changes where needed."

### 3. Kubernetes Objects (spec and status)
- URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/
- Title: Objects In Kubernetes
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Describes objects as records of intent and explains the spec/status split: users write spec, the system writes status, and the control plane works to make status match spec. Uses a Deployment with replicas as the worked example. Foundational for tutorials introducing desired state.
- Quote: "A Kubernetes object is a 'record of intent'."

### 4. Server-Side Apply
- URL: https://kubernetes.io/docs/reference/using-api/server-side-apply/
- Title: Server-Side Apply
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Explains managed fields: the API server records which manager owns each field, flags conflicts when another manager owns a differing field, and offers resolutions (force, give up the field, coordinate). It replaces the client-side `last-applied-configuration` annotation approach with true field ownership. Explains how several appliers (humans, Flux, HPA, other controllers) can share one object safely. Central to understanding why modern GitOps tools use SSA.
- Quote: "fields that have a different value and are owned by another manager will result in a conflict."

### 5. Declarative Management of Kubernetes Objects Using Configuration Files
- URL: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/
- Title: Declarative Management of Kubernetes Objects Using Configuration Files
- Publisher: Kubernetes project
- Kind: Official task tutorial
- Summary: Hands-on kubectl apply walkthrough. Describes the three-way merge between the config file, the live object and the last-applied annotation, and recommends `kubectl diff` before applying. Warns that `apply --prune` can delete objects created outside the config workflow, and recommends explicit `kubectl delete -f` for deletions. Good for pitfalls tutorials.
- Quote: "This method retains writes made to live objects without merging the changes back into the object configuration files."

### 6. Kubernetes API Conventions
- URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md
- Title: API Conventions
- Publisher: Kubernetes SIG Architecture
- Kind: Design/conventions document
- Summary: Normative guidance for API authors. Spec is a complete description of desired state, status reports observation, and they can have separate authorization. The system is level-based, not edge-based, so it drives toward the latest spec regardless of intermediate values. Fields should express desired outcomes, not actions. Conditions (type, status, reason, message) provide uniform higher-level status. Essential for anyone designing CRDs.
- Quote: "the system's behavior is level-based rather than edge-based."

### 7. Level Triggering and Reconciliation in Kubernetes
- URL: https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d
- Title: Level Triggering and Reconciliation in Kubernetes
- Publisher: HackerNoon (blog explainer)
- Kind: Tutorial explainer
- Summary: Explains edge versus level triggering with a replica-scaling example showing how edge-triggered handling can reach the wrong end state after missed events, while level-triggered comparison of full states converges. Attributes the "forgiving" framing to Joe Beda. Useful as an intuitive entry point.
- Quote: "If you are level triggered the pattern is very forgiving." (attributed to Joe Beda)

### 8. Kubernetes Controllers: are they loops or events? (Tim Hockin)
- URL: https://speakerdeck.com/thockin/kubernetes-controllers-are-they-loops-or-events
- Title: Kubernetes Controllers - are they loops or events?
- Publisher: Tim Hockin (Kubernetes co-founder), Speaker Deck
- Kind: Conference-style talk slides
- Summary: Contrasts a naive polling loop with the list-watch cache model. Events update a local cache, yet controllers still reconcile state, and should re-list periodically because software has bugs. Explains why Kubernetes combines event efficiency with level-triggered robustness. Slides are terse, so pair with source 7.
- Quote: "The cache is updated by events (edges) but we are still reconciling state."

### 9. Kubebuilder Book: Implementing a Controller
- URL: https://book.kubebuilder.io/cronjob-tutorial/controller-implementation.html
- Title: Implementing a controller (CronJob tutorial)
- Publisher: Kubernetes SIGs / Kubebuilder
- Kind: Source-code walkthrough / tutorial
- Summary: Walks through a real Reconcile function: fetch the object, list owned children, clean up, compute the next action, create children, and requeue. Teaches idempotency (rebuild status from the observed world, not from prior status), owner references for garbage collection and re-triggering, and updating status through the status subresource to avoid spec conflicts and allow separate RBAC.
- Quote: "move the current state of the cluster closer to the desired state."

### 10. Operator Pattern
- URL: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/
- Title: Operator pattern
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Defines operators as custom-resource-driven controllers that encode a human operator's knowledge (deploying, backups, upgrades, failover). The SampleDB example shows a user editing a custom resource while the operator creates PVCs, StatefulSets and Jobs. Bridges plain controllers and platform abstractions.
- Quote: "Operators are clients of the Kubernetes API that act as controllers for a Custom Resource."

### 11. Flux Core Concepts
- URL: https://fluxcd.io/flux/concepts/
- Title: Core Concepts
- Publisher: Flux (CNCF)
- Kind: Official documentation
- Summary: Defines GitOps and reconciliation. Sources produce artifacts, and Kustomization and HelmRelease objects apply them. Kustomizations are reconciled on an interval (default five minutes in this page), reverting manual changes unless suspended. Establishes the vocabulary for tutorials on drift correction.
- Quote: "Ensuring that a given state ... matches a desired state declaratively defined somewhere."

### 12. Flux Kustomization API
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomizations
- Publisher: Flux (CNCF)
- Kind: Official API reference
- Summary: Detailed behavior: prune (garbage collection of objects removed from source, per-object opt-out annotation), force (recreate on immutable-field changes, to be used only temporarily because it can cause downtime), wait and health checks, drift detection via server-side apply dry-run each interval (minimum 60 seconds), suspend, and a deletion policy (MirrorPrune, Delete, WaitForTermination, Orphan). Core source for pitfalls.
- Quote: "Force... should be set temporarily... not left enabled on the long run" (paraphrased from page text; check original wording before quoting).

### 13. Argo CD Automated Sync Policy
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Title: Automated Sync Policy
- Publisher: Argo Project (CNCF)
- Kind: Official documentation
- Summary: Automated sync applies Git state when the app is OutOfSync. Pruning is off by default, self-heal (reverting live changes) is off by default, and safeguards exist: no retry of a failed sync for the same commit and parameters, an allow-empty protection against pruning everything, and rollback blocked while auto-sync is on. Warns that multi-source apps with self-heal can trigger unexpected syncs.
- Quote: "automatically sync an application when it detects differences between the desired manifests in Git, and the live state in the cluster."

### 14. Argo CD Cluster Management
- URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-management/
- Title: Cluster Management
- Publisher: Argo Project
- Kind: Official documentation
- Summary: Mostly CLI-oriented, pointing to declarative setup as the preferred route. Little on app-of-apps, so thin as a source. Notes the in-cluster entry cannot be removed through this path, and must be disabled through configuration.
- Quote: none.

### 15. GitOps with Argo CD (Red Hat podcast)
- URL: https://www.redhat.com/en/technically-speaking/ArgoCD
- Title: GitOps with Argo CD
- Publisher: Red Hat (Technically Speaking)
- Kind: Podcast/interview write-up
- Summary: Includes Intuit's account of why it built Argo CD: manage deployment complexity in a controlled, auditable way. States the GitOps principle that desired state is declarative, versioned, immutable, pulled automatically and continuously reconciled. Also mentions Argo Rollouts for canary and blue-green delivery. A named real-world origin story.
- Quote: "continuously reconciled."

### 16. Crossplane Compositions
- URL: https://docs.crossplane.io/latest/composition/compositions/
- Title: Compositions
- Publisher: Crossplane (CNCF)
- Kind: Official documentation
- Summary: A Composition composes individual resources into a reusable solution. A Composite Resource Definition (XRD) defines the XR schema. Composition functions are gRPC servers in a pipeline that compute desired composed resources, and Crossplane continuously reconciles observed against desired. Shows platform-team abstractions built declaratively.
- Quote: "A Composition composes individual resources together into a larger, reusable, solution."

### 17. Introducing Crossplane
- URL: https://blog.crossplane.io/introducing-crossplane/
- Title: Introducing Crossplane
- Publisher: Crossplane project blog (Upbound founders)
- Kind: Design/motivation blog
- Summary: Original motivation: a multicloud control plane with a universal declarative API for cloud services. Early model separated developer-facing resource claims from admin-defined resource classes, giving portable requests. Note this is the early design (claims and classes); current docs use XRs, compositions and functions.
- Quote: "a universal declarative-style API for cloud computing"

### 18. kro: What is kro?
- URL: https://kro.run/docs/overview
- Title: What is kro?
- Publisher: kro (Kubernetes SIG Cloud Provider subproject)
- Kind: Official documentation
- Summary: kro turns a ResourceGraphDefinition (schema plus resource templates plus CEL expressions) into a generated CRD and controller. Infers dependency order from expressions, waits on not-yet-existing status values, supports conditionals and forEach collections, and validates definitions at apply time. CEL is deliberately non-Turing-complete so definitions terminate and are auditable. Shows an ACK S3 bucket plus Deployment composed behind one WebApp API. Docs showed version 0.10.0 with a Graph feature in alpha.
- Quote: "kro turns that definition into a CRD, watches for instances of that API, and reconciles the underlying resources."

### 19. Cluster API Introduction
- URL: https://cluster-api.sigs.k8s.io/
- Title: Introduction (The Cluster API Book)
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: Official documentation
- Summary: Goal is to manage create, scale, upgrade and destroy of clusters via a declarative API, operating infrastructure the way developers operate workloads. Users include platform operators with many clusters and infrastructure providers (AWS, Azure, vSphere).
- Quote: "manage the lifecycle (create, scale, upgrade, destroy) of Kubernetes-conformant clusters using a declarative API."

### 20. Cluster API Concepts
- URL: https://cluster-api.sigs.k8s.io/user/concepts
- Title: Concepts (The Cluster API Book)
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: Official documentation
- Summary: A management cluster runs CAPI and providers to reconcile workload clusters. Cluster, Machine and MachineDeployment resources declare infrastructure, with provider controllers provisioning hosts. Machines are immutable: changes replace machines rather than update them, a deliberate declarative-rollout design (like Pod versus Deployment).
- Quote: "All Machines are immutable: once they are created, they are never updated (except for labels, annotations and status), only deleted."

### 21. ACK Deletion Policy
- URL: https://aws-controllers-k8s.github.io/community/docs/user-docs/deletion-policy/
- Title: Deletion Policy
- Publisher: AWS Controllers for Kubernetes (ACK)
- Kind: Official documentation
- Summary: Deleting an ACK custom resource deletes the AWS resource by default. A `retain` policy (annotation, namespace annotation or controller flag) keeps the cloud resource, useful for migrations or removing ACK management. Shows the danger that declarative deletion semantics propagate to real infrastructure. Adoption of existing resources exists as a separate feature, which I did not read.
- Quote: "the underlying AWS resource is first deleted before deleting its Kubernetes custom resource."

### 22. Config Connector: Ignore unspecified fields
- URL: https://docs.cloud.google.com/config-connector/docs/concepts/ignore-unspecified-fields
- Title: Ignore unspecified fields (state-into-spec)
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Explains two modes: Absent (does not copy unspecified fields into spec; default from 1.123.1) and legacy Merge. Merge caused endless reconcile loops when Google Cloud auto-updates fields, drift fights with Config Sync because lists are atomic, and HTTP 400s from GET/PUT asymmetry. Gives a migration path using the abandon deletion policy. A concrete case of declarative drift pitfalls on cloud APIs.
- Quote: "Config Connector doesn't populate unspecified fields into the Kubernetes resource spec field."

## Real-world use cases

Intuit created Argo CD to give developers a controlled, auditable path to production using declarative Git-driven deployment; it later pursued progressive delivery with Argo Rollouts (https://www.redhat.com/en/technically-speaking/ArgoCD).

Platform operators with many clusters use Cluster API's management-cluster model to create, upgrade and scale workload clusters declaratively across AWS, Azure and vSphere, with immutable Machines turning upgrades into rolling replacement (https://cluster-api.sigs.k8s.io/ and https://cluster-api.sigs.k8s.io/user/concepts).

Platform teams exposing infrastructure as self-service APIs use Crossplane XRDs and compositions, or kro ResourceGraphDefinitions, so an application team files one object (a WebApp, a database) that expands into Deployments, Services and cloud resources such as ACK S3 buckets (https://docs.crossplane.io/latest/composition/compositions/, https://kro.run/docs/overview).

Typical GitOps setups use Flux Kustomizations or Argo CD Applications to reconcile a cluster from Git, with Git history serving as the audit trail and automatic reversion of manual edits (https://fluxcd.io/flux/concepts/, https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/).

Database and stateful-service operators (the SampleDB example in the Kubernetes docs) turn runbook steps such as backup and upgrade into controllers (https://kubernetes.io/docs/concepts/extend-kubernetes/operator/).

Gap: no named large-scale case studies beyond Intuit's origin story were read; search for Flux and Crossplane end-user case studies returned weak or archived results.

## Pitfalls and how tools address them

Multiple writers on one object. Client-side apply with the last-applied annotation can silently clobber other writers. Server-side apply tracks field ownership and raises conflicts, with force as an explicit override (https://kubernetes.io/docs/reference/using-api/server-side-apply/). Flux's drift detection uses a server-side apply dry-run (https://fluxcd.io/flux/components/kustomize/kustomizations/).

Unintended deletion through prune. `kubectl apply --prune` can remove objects created outside the config workflow, so the docs recommend explicit deletes (https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/). Argo CD defaults to no prune and no self-heal, and adds allow-empty protection (https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/). Flux prunes when enabled, offers a per-object disable annotation, and a deletion policy including Orphan.

Cloud resource deletion. Removing a Kubernetes object can delete a real database or bucket. ACK defaults to delete with a retain option (https://aws-controllers-k8s.github.io/community/docs/user-docs/deletion-policy/). Config Connector uses an abandon annotation, used in its migration path (source 22).

Drift and defaulting fights. Servers or clouds mutate fields, so a controller or GitOps tool that treats an older spec as truth can loop forever. Config Connector's Merge mode is the cited example, and Absent mode is its fix (https://docs.cloud.google.com/config-connector/docs/concepts/ignore-unspecified-fields). Argo CD multi-source self-heal can cause unexpected syncs.

Immutable fields. Patches fail on immutable fields. Flux offers force replacement, with a warning that it can cause downtime; Cluster API avoids the problem by making Machines immutable and replacing them (https://cluster-api.sigs.k8s.io/user/concepts).

Missed events and bugs. Level-triggered reconciliation and periodic re-list avoid dependence on any one event (https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d, https://speakerdeck.com/thockin/kubernetes-controllers-are-they-loops-or-events). Controllers should be idempotent and rebuild status from observed state (https://book.kubebuilder.io/cronjob-tutorial/controller-implementation.html).

Abstraction correctness. kro validates schemas, expressions and references before reconciliation and uses a non-Turing-complete expression language; Crossplane uses functions (gRPC pipeline) for flexible composition (sources 16 and 18).

Intentional pause. Flux suspend stops both new revisions and drift correction, which is the escape hatch for incident work, and Argo CD blocks rollback while auto-sync is on.

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/overview/working-with-objects/object-management/ : clearest side-by-side of imperative, imperative config and declarative.
- https://kubernetes.io/docs/concepts/architecture/controller/ : thermostat analogy for control loops.
- https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d : intuitive level versus edge explanation.
- https://speakerdeck.com/thockin/kubernetes-controllers-are-they-loops-or-events : Tim Hockin on loops, caches and re-lists.
- https://book.kubebuilder.io/cronjob-tutorial/controller-implementation.html : annotated Reconcile function.
- https://kro.run/docs/overview : fastest way to see a platform abstraction end to end.
- https://fluxcd.io/flux/concepts/ : GitOps vocabulary.
- https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/ : hands-on kubectl apply and diff.

## Open questions

- No postmortems or incident write-ups were found for declarative failures (accidental prune, mass deletion, controller storms). The wiki may need to source these separately (public cloud or vendor incident reports).
- Real-world case studies for Flux, Crossplane, kro and Config Connector at named organizations were not retrieved.
- The Flux concepts page describes a default five-minute interval, while the Kustomization API page describes a minimum of 60 seconds; the Kustomization interval is user-set, so verify defaults before writing.
- The Flux concepts page did not explicitly mention drift detection or pruning, though the Kustomization page does; reconcile wording.
- Crossplane's early claims/classes model differs from current XR/composition/function model; verify current docs before using the 2018-era blog terminology.
- ACK resource adoption and Crossplane's management-policy options (observe-only) were not read, and neither were Argo CD ignoreDifferences, Flux SSA field-manager details, or Argo CD vs Flux comparisons.
- Quote in source 12 is a paraphrase and should be verified before use; quotes in sources 15 and 17 are short fragments from tool-condensed text.
- Page content for Kubernetes docs was read only in the first ~100,000 characters via a summarizing fetcher, so details in the tails were not checked.
