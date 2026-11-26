---
title: "Research dossier: Declarative vs Imperative"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [declarative-vs-imperative, research-dossier, gitops, server-side-apply, pitfalls]
---

# Research dossier: Declarative vs Imperative

> [!NOTE]
> **Raw file:** `raw/research-declarative-vs-imperative.md` (sha256 prefix 570767ba4094)<br>
> **Kind:** Research dossier summarizing 22 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The dossier author read pages through a summarizing fetch tool and only the first 100,000 characters of long Kubernetes pages, so quotes should be re-checked against the live pages before publication.

## Summary

The dossier explains what "declarative" means in Kubernetes and how it differs from imperative management. A declarative workflow stores a record of intent in an object's `spec` and lets controllers drive the world toward it, while an imperative workflow tells the system which action to take now. The official documentation frames this as a spectrum of three kubectl techniques, and the mechanism that makes the declarative end work is the level-triggered controller loop. Higher layers repeat the idea: GitOps tools treat Git as desired state, provider controllers extend it to cloud resources and whole clusters, and composition tools let platform teams define new APIs. The dossier then catalogs the pitfalls, which cluster around multiple writers, unexpected pruning and deletion, drift fighting server-side defaults, and immutable fields. Its main limit is that it names almost no end-user organizations and finds no incident postmortems.

See [[concepts/declarative-vs-imperative]] for the synthesized concept.

## Key claims

### Object management and the declarative model

- Kubernetes defines three object-management techniques: imperative commands, imperative object configuration, and declarative object configuration. Imperative commands have the lowest learning curve but leave no review or audit trail, imperative object configuration suits a single writer in production, and declarative configuration suits multiple writers but is harder to debug because of merge and patch logic. The page warns against mixing techniques on the same object. URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/object-management/. Quote: "Changes made directly to live objects are retained, even if they are not merged back into the configuration files." See [[comparisons/kubectl-object-management-techniques]] and [[findings/mixing-management-techniques-on-one-object]].
- A Kubernetes object is a record of intent, and the spec/status split gives users the `spec` and the system the `status`. URL: https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/. Quote: "A Kubernetes object is a 'record of intent'." See [[concepts/spec-status-split]].
- The `kubectl apply` task tutorial describes a three-way merge between the config file, the live object, and the last-applied annotation, and recommends `kubectl diff` before applying. It warns that `apply --prune` can delete objects created outside the config workflow and recommends explicit `kubectl delete -f`. URL: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/. Quote: "This method retains writes made to live objects without merging the changes back into the object configuration files." See [[findings/unintended-deletion-through-prune]] and [[entities/kubectl]].
- Server-side apply records which manager owns each field, flags a conflict when another manager owns a differing field, and offers force, give-up, and coordinate resolutions. It replaces the client-side `last-applied-configuration` approach. URL: https://kubernetes.io/docs/reference/using-api/server-side-apply/. Quote: "fields that have a different value and are owned by another manager will result in a conflict." See [[concepts/server-side-apply-and-field-ownership]] and [[findings/multiple-writers-on-one-object]].

### Controllers and level triggering

- Controllers are non-terminating control loops, explained with a thermostat analogy. Many small controllers each own one aspect, controllers may fail so the design tolerates it, and the cluster need not ever be stable. URL: https://kubernetes.io/docs/concepts/architecture/controller/. Quote: "controllers are control loops that watch the state of your cluster, then make or request changes where needed." See [[concepts/reconciliation-loop]].
- The API conventions say that spec is a complete description of desired state, that status reports observation, that fields should express desired outcomes rather than actions, and that the system drives toward the latest spec regardless of intermediate values. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md. Quote: "the system's behavior is level-based rather than edge-based." See [[concepts/level-triggered-vs-edge-triggered]] and [[concepts/conditions]].
- A HackerNoon explainer shows with a replica-scaling example that edge-triggered handling can reach the wrong end state after missed events, while level-triggered comparison of full states converges, and it attributes the "forgiving" framing to Joe Beda. URL: https://hackernoon.com/level-triggering-and-reconciliation-in-kubernetes-1f17fe30333d. Quote: "If you are level triggered the pattern is very forgiving."
- Tim Hockin's slides contrast a naive polling loop with the list-watch cache: events update a local cache, controllers still reconcile full state, and they should re-list periodically because software has bugs. URL: https://speakerdeck.com/thockin/kubernetes-controllers-are-they-loops-or-events. Quote: "The cache is updated by events (edges) but we are still reconciling state." See [[concepts/informers-reflectors-and-workqueues]].
- The Kubebuilder CronJob tutorial walks through a real Reconcile function: fetch the object, list owned children, clean up, compute the next action, create children, and requeue. It teaches idempotency by rebuilding status from the observed world, owner references for garbage collection, and the status subresource to avoid spec conflicts. URL: https://book.kubebuilder.io/cronjob-tutorial/controller-implementation.html. Quote: "move the current state of the cluster closer to the desired state." See [[entities/kubebuilder]], [[concepts/idempotency]], and [[concepts/owner-references-and-garbage-collection]].
- Operators are custom-resource-driven controllers that encode a human operator's knowledge; the SampleDB example has a user edit a custom resource while the operator creates PVCs, StatefulSets, and Jobs. URL: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/. Quote: "Operators are clients of the Kubernetes API that act as controllers for a Custom Resource." See [[concepts/operator-pattern]] and [[examples/database-operator-encodes-runbooks]].

### GitOps delivery

- Flux defines GitOps as reconciliation of a state to a declaratively defined desired state. Sources produce artifacts, Kustomization and HelmRelease objects apply them, and Kustomizations reconcile on an interval, reverting manual changes unless suspended. The concepts page states a default of five minutes. URL: https://fluxcd.io/flux/concepts/. Quote: "Ensuring that a given state ... matches a desired state declaratively defined somewhere." See [[entities/flux]].
- The Flux Kustomization API provides prune with a per-object opt-out annotation, force (recreate on immutable-field changes, to be used only temporarily because it can cause downtime), wait and health checks, drift detection through a server-side apply dry run each interval (minimum 60 seconds), suspend, and a deletion policy with MirrorPrune, Delete, WaitForTermination, and Orphan. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/. The dossier marks its quote as a paraphrase, so no verbatim quote is recorded here. See [[findings/immutable-fields-and-drift-collisions]].
- Argo CD automated sync applies Git state when an application is OutOfSync. Pruning and self-heal are both off by default, a failed sync is not retried for the same commit and parameters, an allow-empty protection stops pruning everything, rollback is blocked while auto-sync is on, and multi-source applications with self-heal can trigger unexpected syncs. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/. Quote: "automatically sync an application when it detects differences between the desired manifests in Git, and the live state in the cluster." See [[entities/argo-cd]] and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].
- The Argo CD cluster management page is mostly CLI-oriented, prefers declarative setup, and says the in-cluster entry cannot be removed through that path. The dossier calls this page thin. URL: https://argo-cd.readthedocs.io/en/stable/operator-manual/cluster-management/.
- A Red Hat interview records Intuit's account of why it built Argo CD: to manage deployment complexity in a controlled, auditable way. It states the GitOps principle that desired state is declarative, versioned, immutable, pulled automatically, and continuously reconciled, and it mentions Argo Rollouts for canary and blue-green delivery. URL: https://www.redhat.com/en/technically-speaking/ArgoCD. Quote: "continuously reconciled." See [[examples/intuit-argo-cd-gitops-origin]] and [[concepts/gitops-pull-based-delivery]].

### Abstractions and provider layers

- A Crossplane Composition composes individual resources into a reusable solution, a CompositeResourceDefinition defines the composite resource schema, and composition functions are gRPC servers in a pipeline that compute desired composed resources while Crossplane reconciles observed against desired. URL: https://docs.crossplane.io/latest/composition/compositions/. Quote: "A Composition composes individual resources together into a larger, reusable, solution." See [[entities/crossplane]].
- The original Crossplane announcement describes a multicloud control plane with a universal declarative API and an early model of developer-facing resource claims and admin-defined resource classes. The dossier warns this is the early design and current docs use composite resources, compositions, and functions. URL: https://blog.crossplane.io/introducing-crossplane/. Quote: "a universal declarative-style API for cloud computing".
- kro turns a ResourceGraphDefinition (schema, resource templates, and CEL expressions) into a generated CRD and controller. It infers dependency order from expressions, waits on status values that do not exist yet, supports conditionals and forEach collections, and validates definitions at apply time. CEL is deliberately non-Turing-complete so definitions terminate and are auditable. The page showed version 0.10.0 with a Graph feature in alpha. URL: https://kro.run/docs/overview. Quote: "kro turns that definition into a CRD, watches for instances of that API, and reconciles the underlying resources." See [[entities/kro]] and [[examples/platform-team-self-service-apis-with-crossplane-and-kro]].
- Cluster API manages the create, scale, upgrade, and destroy lifecycle of clusters through a declarative API. URL: https://cluster-api.sigs.k8s.io/. Quote: "manage the lifecycle (create, scale, upgrade, destroy) of Kubernetes-conformant clusters using a declarative API." See [[entities/cluster-api]].
- In Cluster API, a management cluster reconciles workload clusters through Cluster, Machine, and MachineDeployment resources, and Machines are immutable, so changes replace machines rather than update them, in the way a Deployment replaces Pods. URL: https://cluster-api.sigs.k8s.io/user/concepts. Quote: "All Machines are immutable: once they are created, they are never updated (except for labels, annotations and status), only deleted." See [[examples/cluster-fleet-lifecycle-with-cluster-api]].
- ACK deletes the AWS resource by default when the custom resource is deleted, and a `retain` policy (annotation, namespace annotation, or controller flag) keeps the cloud resource. Adoption of existing resources is a separate feature that the dossier did not read. URL: https://aws-controllers-k8s.github.io/community/docs/user-docs/deletion-policy/. Quote: "the underlying AWS resource is first deleted before deleting its Kubernetes custom resource." See [[entities/ack]] and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].
- Config Connector has an Absent mode (default from 1.123.1) that does not copy unspecified fields into the spec, and a legacy Merge mode that caused endless reconcile loops when Google Cloud auto-updates fields, drift fights with Config Sync because lists are atomic, and HTTP 400 errors from GET/PUT asymmetry. A migration path uses the abandon deletion policy. URL: https://docs.cloud.google.com/config-connector/docs/concepts/ignore-unspecified-fields. Quote: "Config Connector doesn't populate unspecified fields into the Kubernetes resource spec field." See [[entities/config-connector]] and [[findings/defaulting-and-drift-reconcile-loops]].

### Dossier-level synthesis

- Pure declarative management is not absolute in practice. Kubernetes keeps imperative commands for development and one-offs, and tools expose escape hatches (suspend, retain or orphan deletion policies, force, abandon) because declarative reconciliation is dangerous when ownership, deletion, or drift semantics are misunderstood. See [[decisions/choosing-an-object-management-technique]].
- The dossier found named real-world use only for Intuit's creation of Argo CD, plus documentation-level use cases for Cluster API, Crossplane, kro, GitOps tools, and operators. See [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]].

## Open questions raised by the dossier

- No postmortems or incident write-ups were found for declarative failures such as accidental prune, mass deletion, or controller storms. See [[open-knowledge-gaps]].
- The Flux concepts page states a default five-minute interval, while the Kustomization API page states a minimum of 60 seconds, so the default needs verification.
- Crossplane's early claims-and-classes model differs from the current composite resource, composition, and function model.
- ACK adoption, Crossplane management policies (observe-only), Argo CD `ignoreDifferences`, Flux field-manager details, and direct Argo CD versus Flux comparisons were not read.

## Related

[[concepts/declarative-vs-imperative]], [[sources/research-universal-control-plane]]
