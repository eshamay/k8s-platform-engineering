# Index — k8s-platform-engineering

Categorized catalog of every page in the wiki. Updated on every ingest.

## Concepts

### Core architectural principles

- [[concepts/universal-control-plane]] — Kubernetes API and etcd as a control plane for any infrastructure (active)
- [[concepts/declarative-vs-imperative]] — end-state specs versus command sequences, three kubectl techniques (active)
- [[concepts/level-triggered-vs-edge-triggered]] — state-driven versus event-driven controller logic (active)
- [[concepts/eventual-consistency-and-convergence]] — concurrent apply, retry, converge, with costs and mitigations (active)
- [[concepts/self-healing-and-drift-detection]] — reverting out-of-band changes, with tool controls and failure modes (active)
- [[concepts/gitops-pull-based-delivery]] — four principles, pull versus push, and the two-layer loop (active)

### KRM and API machinery

- [[concepts/gvk-and-gvr]] — type versus endpoint coordinates, mapping, lifecycle, and failure classes (active)
- [[concepts/api-discovery-and-restmapper]] — discovery documents and the GVK-to-GVR translator (draft)
- [[concepts/crd-versioning-and-storage-migration]] — served and storage versions, conversion, retirement (draft)
- [[concepts/custom-resource-definition]] — registering new API types, schema, versions, costs, and pitfalls (active)
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
- [[entities/kube-rs]] — Rust controller library and single-replica availability guidance (draft)
- [[entities/tofu-controller]] — Terraform and OpenTofu from Flux-style resources, detection-only model (draft)
- [[entities/client-go]] — Go client library with the discovery client and RESTMapper constructors (draft)
- [[entities/helm]] — package manager whose charts do not upgrade or delete CRDs (draft)

## Sources

- [[sources/krm-platform-vocabulary]] — seed vocabulary note, 2026-11-25
- [[sources/research-universal-control-plane]] — research dossier on the universal control plane idea, 19 web sources, 2026-11-25
- [[sources/research-declarative-vs-imperative]] — research dossier on declarative versus imperative management, 22 web sources, 2026-11-25
- [[sources/research-level-triggered-vs-edge-triggered]] — research dossier on level-triggered versus edge-triggered reconciliation, 14 web sources, 2026-11-25
- [[sources/research-eventual-consistency-and-convergence]] — research dossier on eventual consistency and convergence, 15 web sources, 2026-11-25
- [[sources/research-self-healing-and-drift-detection]] — research dossier on self-healing and drift detection, 19 web sources, 2026-11-25
- [[sources/research-gitops-pull-based-delivery]] — research dossier on GitOps pull-based delivery, 15 web sources, 2026-11-25
- [[sources/research-gvk-and-gvr]] — research dossier on GVK and GVR, 18 web sources, 2026-11-25
- [[sources/research-custom-resource-definition]] — CRD mechanics, schema and CEL, versions and conversion, tool handling, and failure modes (active)

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
- [[examples/deployment-replica-changes-converge-to-the-final-count]] — last declared state wins (draft)
- [[examples/flux-dependson-and-health-checks-gate-rollout]] — health-gated ordering in Flux (draft)
- [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]] — self-heal and waves (draft)
- [[examples/crossplane-database-claim-reports-synced-and-ready]] — Synced and Ready during slow provisioning (draft)
- [[examples/kro-shared-queue-tunes-throughput]] — kro queue and rate-limit numbers (draft)
- [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]] — dry-run failure stops correction (draft)
- [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]] — a second writer looks like drift (draft)
- [[examples/incremental-gitops-adoption-with-manual-sync-and-self-heal]] — staged enforcement with Argo CD (draft)
- [[examples/cluster-api-machine-health-check-replaces-failed-nodes]] — machine-level self-healing (draft)
- [[examples/tofu-controller-detects-terraform-drift-without-applying]] — detection-only Terraform drift (draft)
- [[examples/ack-resync-period-tuning-for-stateful-resources]] — freshness versus AWS API cost (draft)
- [[examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources]] — enforce, observe, or pause (draft)
- [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]] — signed OCI artifacts replace Git pulls (draft)
- [[examples/crossplane-resources-hosted-by-argo-cd]] — health checks and tracking for the seam (draft)
- [[examples/gitops-agent-on-non-kubernetes-targets]] — GitOps as a pattern beyond Kubernetes (draft)
- [[examples/hpa-scales-any-workload-through-the-scale-subresource]] — one Kind served at many resources (draft)
- [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]] — custom resource applied before its CRD (draft)
- [[examples/xrd-and-rgd-declare-platform-gvks]] — Crossplane and kro as GVK factories (draft)
- [[examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26]] — PSP, HPA v2beta2, and flowcontrol removals (draft)
- [[examples/kubebuilder-domain-flag-for-ambiguous-external-gvks]] — GVK is not always a unique key (draft)
- [[examples/postgrescluster-custom-resource-reconciled-into-child-objects]] — custom resource plus controller (draft)
- [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]] — in-schema validation (draft)
- [[examples/kubebuilder-hub-and-spoke-conversion-for-multi-version-crds]] — conversion webhook organization (draft)
- [[examples/flux-helmrelease-crd-policies-createreplace-and-dependson]] — chart CRD handling in Flux (draft)
- [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]] — annotation size limit (draft)
- [[examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd]] — apiserver and etcd scale tuning (draft)

## Comparisons

- [[comparisons/tenancy-models-namespaces-vcluster-kcp]] — tenancy trade-offs (draft)
- [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]] — how each tool orders work (draft)
- [[comparisons/kubectl-object-management-techniques]] — three kubectl techniques (draft)
- [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]] — drift and prune behavior (draft)
- [[comparisons/deletion-policies-across-gitops-and-provider-tools]] — retain, abandon, orphan (draft)
- [[comparisons/reconcile-cadence-and-off-switches-across-tools]] — intervals, retries, and pause controls (draft)
- [[comparisons/retry-and-backoff-controls-across-tools]] — backoff, caps, and waiting states (draft)
- [[comparisons/drift-detection-mechanisms-across-tools]] — what each tool compares, and how often (draft)
- [[comparisons/exemption-and-ignore-controls-across-tools]] — ignore, observe, and pause controls (draft)
- [[comparisons/push-versus-pull-delivery]] — credentials, reach, and reconciliation (draft)
- [[comparisons/flux-versus-argo-cd-architecture]] — controllers versus three components (draft)
- [[comparisons/gvk-versus-gvr]] — type versus endpoint (draft)
- [[comparisons/restmapper-strategies-static-deferred-and-dynamic]] — how mappers react to new CRDs (draft)
- [[comparisons/missing-crd-handling-flux-versus-argo-cd]] — dependsOn versus sync waves (draft)
- [[comparisons/cel-validation-rules-versus-validating-webhooks]] — in-schema rules versus external services (draft)
- [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]] — how versions convert (draft)
- [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]] — two CRD factories (draft)

## Decisions

- [[decisions/crd-versus-aggregated-api]] — how to serve new API kinds (draft)
- [[decisions/choosing-an-object-management-technique]] — imperative, replace, or apply (draft)
- [[decisions/events-as-hints-state-as-truth]] — level-based correctness with watch-based latency (draft)
- [[decisions/single-replica-versus-leader-election]] — controller availability trade-off (draft)
- [[decisions/staged-adoption-of-automated-drift-correction]] — observe, correct selectively, then enforce (draft)
- [[decisions/choosing-a-drift-check-interval-for-external-resources]] — freshness versus API cost (draft)
- [[decisions/git-versus-oci-as-the-canonical-source]] — where the cluster pulls desired state from (draft)
- [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]] — shipping breaking API changes (draft)
- [[decisions/validate-with-cel-rules-or-a-validating-webhook]] — where CRD validation runs (draft)

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
- [[findings/errors-used-as-timers-in-reconcilers]] — errors for waiting states (draft)
- [[findings/retry-storms-and-unbounded-retries]] — retry amplification (draft)
- [[findings/duplicate-work-from-replicas-without-leader-election]] — racing replicas (draft)
- [[findings/misleading-readiness-and-stale-status]] — Ready versus Synced and observedGeneration (draft)
- [[findings/drift-detection-latency-is-the-interval]] — interval as correction latency (draft)
- [[findings/field-ownership-blocks-drift-correction]] — dry-run conflicts stop correction (draft)
- [[findings/controllers-fighting-over-fields-cause-revert-loops]] — webhooks, HPAs, and image updaters (draft)
- [[findings/remediation-can-amplify-an-outage]] — mass replacement and the maxUnhealthy brake (draft)
- [[findings/late-initialized-fields-create-false-drift]] — provider defaults and LateInitialize (draft)
- [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]] — Lua checks and tracking for CRDs (draft)
- [[findings/rollback-is-blocked-while-automated-sync-is-on]] — rollback requires a Git revert (draft)
- [[findings/mutable-remote-references-change-what-a-commit-renders]] — pin tags or SHAs (draft)
- [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]] — GitOps loop over domain loop (draft)
- [[findings/stale-restmapper-hides-newly-installed-crds]] — mapper built once cannot see later CRDs (draft)
- [[findings/custom-resources-applied-before-their-crd-exists]] — no matches for kind (draft)
- [[findings/group-and-plural-names-are-effectively-permanent]] — immutable names (draft)
- [[findings/crd-version-removal-without-migration-strands-stored-objects]] — conversion and migration hazards (draft)
- [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]] — upstream removals (draft)
- [[findings/a-down-conversion-webhook-can-stall-garbage-collection]] — webhook outage blast radius (draft)
- [[findings/admission-webhook-outages-are-a-recurring-failure-class]] — index-level postmortem evidence (draft)
- [[findings/unknown-fields-are-silently-pruned-under-structural-schemas]] — undeclared fields vanish (draft)
- [[findings/helm-does-not-upgrade-or-delete-crds]] — chart CRD lifecycle gap (draft)
- [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]] — 262,144-byte annotation cap (draft)
- [[findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind]] — data loss on CRD removal (draft)

## Outputs

_(none yet)_
