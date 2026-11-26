# Index — k8s-platform-engineering

Categorized catalog of every page in the wiki. Updated on every ingest.

## Concepts

### Core architectural principles

- [[concepts/universal-control-plane]] — Kubernetes API and etcd as a control plane for any infrastructure (active)
- [[concepts/declarative-vs-imperative]] — end-state specs versus command sequences, three kubectl techniques (active)
- [[concepts/level-triggered-vs-edge-triggered]] — state-driven versus event-driven controller logic (active)
- [[concepts/eventual-consistency-and-convergence]] — concurrent apply, retry, converge (draft)
- [[concepts/self-healing-and-drift-detection]] — reverting out-of-band changes (draft)
- [[concepts/gitops-pull-based-delivery]] — in-cluster agent pulls from Git (draft)

### KRM and API machinery

- [[concepts/gvk-and-gvr]] — schema and REST coordinates (draft)
- [[concepts/custom-resource-definition]] — registering new API types (draft)
- [[concepts/spec-status-split]] — intent versus observed reality (draft)
- [[concepts/server-side-apply-and-field-ownership]] — managedFields and shared ownership (draft)
- [[concepts/admission-webhooks-and-cel]] — mutate and validate before persistence (draft)

### Controller and operator mechanics

- [[concepts/operator-pattern]] — operational knowledge packaged as controller plus CRDs (draft)
- [[concepts/reconciliation-loop]] — the Reconcile function (draft)
- [[concepts/idempotency]] — safe repeated reconciliation (draft)
- [[concepts/informers-reflectors-and-workqueues]] — watch, cache, queue machinery (draft)
- [[concepts/finalizers]] — block deletion until external cleanup (draft)
- [[concepts/owner-references-and-garbage-collection]] — cascading deletion (draft)
- [[concepts/conditions]] — machine-readable status (draft)

### Platform engineering and abstraction

- [[concepts/managed-resource]] — one-to-one cloud primitive (draft)
- [[concepts/composite-resource]] — opinionated platform API over many resources (draft)
- [[concepts/composition]] — blueprint mapping composite to managed resources (draft)
- [[concepts/provider]] — controller and CRDs for an external API (draft)

## Entities

- [[entities/flux]] — in-cluster GitOps tool (draft)
- [[entities/crossplane]] — control plane framework for external infrastructure (draft)
- [[entities/kro]] — resource-graph based platform API tool (draft)
- [[entities/argo-cd]] — GitOps tool with phase and wave ordering (draft)
- [[entities/config-connector]] — Google Cloud resources as Kubernetes objects (draft)
- [[entities/ack]] — AWS services as Kubernetes objects, one controller per service (draft)
- [[entities/cluster-api]] — management cluster that creates workload clusters (draft)
- [[entities/kcp]] — node-less multi-tenant API workspaces (draft)
- [[entities/kubectl]] — CLI behind imperative and declarative techniques (draft)
- [[entities/kubebuilder]] — controller framework and Reconcile tutorial (draft)
- [[entities/controller-runtime]] — Go controller library and the level-based Reconciler contract (draft)

## Sources

- [[sources/krm-platform-vocabulary]] — seed vocabulary note, 2026-11-25
- [[sources/research-universal-control-plane]] — research dossier on the universal control plane idea, 19 web sources, 2026-11-25
- [[sources/research-declarative-vs-imperative]] — research dossier on declarative versus imperative management, 22 web sources, 2026-11-25
- [[sources/research-level-triggered-vs-edge-triggered]] — research dossier on level-triggered versus edge-triggered reconciliation, 14 web sources, 2026-11-25

## Examples

- [[examples/self-service-gke-cluster-with-kro]] — self-service cluster API (draft)
- [[examples/cluster-fleet-lifecycle-with-cluster-api]] — management cluster and workload clusters (draft)
- [[examples/cloud-services-as-kubernetes-objects]] — ACK and Config Connector (draft)
- [[examples/non-container-appliances-on-the-kubernetes-api]] — Ænix distribution vision (draft)
- [[examples/multi-tenant-api-hosting-with-kcp]] — workspaces for SaaS tenants (draft)
- [[examples/intuit-argo-cd-gitops-origin]] — why Intuit built Argo CD (draft)
- [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]] — Git as desired state (draft)
- [[examples/database-operator-encodes-runbooks]] — SampleDB operator (draft)
- [[examples/platform-team-self-service-apis-with-crossplane-and-kro]] — one object, many resources (draft)
- [[examples/how-core-controllers-handle-cache-lag]] — ReplicaSet, StatefulSet, and Deployment (draft)
- [[examples/gitops-reverts-a-hand-edited-deployment]] — Flux and Argo CD drift reversion (draft)
- [[examples/cloud-console-changes-reverted-by-provider-controllers]] — Config Connector and Crossplane drift reversion (draft)
- [[examples/controller-pattern-for-digital-twins]] — ApeiroRA reference architecture (draft)

## Comparisons

- [[comparisons/tenancy-models-namespaces-vcluster-kcp]] — tenancy trade-offs (draft)
- [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]] — how each tool orders work (draft)
- [[comparisons/kubectl-object-management-techniques]] — three kubectl techniques (draft)
- [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]] — drift and prune behavior (draft)
- [[comparisons/deletion-policies-across-gitops-and-provider-tools]] — retain, abandon, orphan (draft)
- [[comparisons/reconcile-cadence-and-off-switches-across-tools]] — intervals, retries, and pause controls (draft)

## Decisions

- [[decisions/crd-versus-aggregated-api]] — how to serve new API kinds (draft)
- [[decisions/choosing-an-object-management-technique]] — imperative, replace, or apply (draft)
- [[decisions/events-as-hints-state-as-truth]] — level-based correctness with watch-based latency (draft)

## Findings

- [[findings/etcd-scale-limits-of-the-shared-store]] — etcd limits (draft)
- [[findings/destructive-deletion-of-external-resources]] — deleting objects deletes infrastructure (draft)
- [[findings/ordering-and-dependency-failures]] — CRD and dependency ordering (draft)
- [[findings/immutable-fields-and-drift-collisions]] — force, resync, and adoption hazards (draft)
- [[findings/blast-radius-and-privilege-centralization]] — central authority risks (draft)
- [[findings/immature-abstractions-in-the-control-plane-ecosystem]] — pre-1.0 and Sandbox tools (draft)
- [[findings/multiple-writers-on-one-object]] — clobbering and field conflicts (draft)
- [[findings/unintended-deletion-through-prune]] — prune deletes more than expected (draft)
- [[findings/defaulting-and-drift-reconcile-loops]] — endless loops from server defaults (draft)
- [[findings/mixing-management-techniques-on-one-object]] — retained live edits (draft)
- [[findings/stale-cache-and-double-action]] — cache lag causes duplicate work (draft)
- [[findings/event-specific-logic-in-reconcilers]] — branching on events reintroduces fragility (draft)
- [[findings/cost-of-constant-reconciliation]] — repeated reads and API quota (draft)
- [[findings/continuous-loops-override-intentional-changes]] — loops revert manual changes (draft)
- [[findings/failure-retry-loops-and-backoff]] — endless retries and terminal errors (draft)

## Outputs

_(none yet)_
