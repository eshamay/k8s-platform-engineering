# Log — k8s-platform-engineering

Append-only journal of every operation. Header format: `## [YYYY-MM-DD] <op> | <subject>`.

## [2026-11-25] bootstrap | k8s-platform-engineering

Decisions made during the interview:

- **Domain:** Kubernetes platform engineering principles: core architecture, KRM and API machinery, controller and operator mechanics, abstractions; architecture beneath Flux and Crossplane.
- **Scenario template:** Research.
- **Expected volume:** Large (500 or more sources).
- **Source types:** markdown and URL.
- **Page taxonomy:** concepts, sources, entities, examples, comparisons, decisions, findings, outputs (outputs on).
- **Seeded facts:** none.
- **Seeded gaps:** three (lifecycle trace, Compositions vs kro, scale and sharding).

Closing summary:

- Folders created: `raw/`, `concepts/`, `sources/`, `entities/`, `examples/`, `comparisons/`, `decisions/`, `findings/`, `outputs/`, `workflows/`, `.sticki/`.
- Staleness threshold: 180 days.
- `tier_threshold_sources`: 300.
- Write-authority table emitted to `CLAUDE.md`.
- Purpose template applied: Research.

## [2026-11-25] ingest | KRM and Platform Engineering Vocabulary (seed note)
- source: [[sources/krm-platform-vocabulary]]
- raw: `raw/krm-platform-vocabulary.md` (sha256: 731a6941f9db)
- pages touched: [[index]]
- new pages: 22 concept pages under `concepts/`, [[entities/flux]], [[entities/crossplane]], [[entities/kro]], [[sources/krm-platform-vocabulary]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 0 (three seeded gaps at bootstrap map to the note's closing follow-ups)
- rationale: Seed vocabulary decomposed one concept per bullet, each as a draft page awaiting external sources from the research workflow. Drafted inline rather than via page-writer fan-out because every page derives from one small source.

## [2026-11-25] ingest | Research dossier: Universal Control Plane
- source: [[sources/research-universal-control-plane]]
- raw: `raw/research-universal-control-plane.md` (sha256: 037575049a4c)
- pages touched: [[concepts/universal-control-plane]], [[entities/flux]], [[entities/crossplane]], [[entities/kro]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-universal-control-plane]], entities ([[entities/argo-cd]], [[entities/config-connector]], [[entities/ack]], [[entities/cluster-api]], [[entities/kcp]]), examples (5), findings (6), comparisons (2), [[decisions/crd-versus-aggregated-api]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 6 (plus possible-resolution notes under all three seeded gaps)
- rationale: The dossier summarizes 19 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The universal-control-plane concept was promoted from draft to active because it now has a primary-source layered account. Backstage is not mentioned in the dossier, so no page was created. Drafted inline because the page-writer subagent is not available in this session.

## [2026-11-25] ingest | Research dossier: Declarative vs Imperative
- source: [[sources/research-declarative-vs-imperative]]
- raw: `raw/research-declarative-vs-imperative.md` (sha256: 570767ba4094)
- pages touched: [[concepts/declarative-vs-imperative]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/server-side-apply-and-field-ownership]], [[concepts/self-healing-and-drift-detection]], [[concepts/gitops-pull-based-delivery]], [[concepts/operator-pattern]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/kro]], [[entities/config-connector]], [[entities/ack]], [[entities/cluster-api]], [[findings/destructive-deletion-of-external-resources]], [[findings/immutable-fields-and-drift-collisions]], [[examples/cluster-fleet-lifecycle-with-cluster-api]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-declarative-vs-imperative]], entities ([[entities/kubectl]], [[entities/kubebuilder]]), examples (4), findings (4), comparisons (3), [[decisions/choosing-an-object-management-technique]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 4 (plus possible-resolution notes under all three seeded gaps)
- rationale: The dossier summarizes 22 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The declarative-vs-imperative concept was promoted from draft to active because it now has primary-source support for the three-technique spectrum, the level-based mechanism, and the pitfall taxonomy. Argo CD, Config Connector, ACK, and Cluster API already had entity pages from the previous ingest, so they were updated; Backstage is not mentioned in the dossier, so no page was created. The Flux interval wording discrepancy is recorded as a gap and not as a contradiction because the two pages describe default and minimum separately. Drafted inline (touch budget exceeded 8 pages, but the pages are small and share one source).

## [2026-11-25] ingest | Research dossier: Level-Triggered vs Edge-Triggered
- source: [[sources/research-level-triggered-vs-edge-triggered]]
- raw: `raw/research-level-triggered-vs-edge-triggered.md` (sha256: 27a34aa0de59)
- pages touched: [[concepts/level-triggered-vs-edge-triggered]], [[concepts/reconciliation-loop]], [[concepts/informers-reflectors-and-workqueues]], [[concepts/idempotency]], [[concepts/self-healing-and-drift-detection]], [[concepts/eventual-consistency-and-convergence]], [[concepts/gitops-pull-based-delivery]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/config-connector]], [[entities/ack]], [[entities/cluster-api]], [[findings/immutable-fields-and-drift-collisions]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-level-triggered-vs-edge-triggered]], [[entities/controller-runtime]], [[examples/how-core-controllers-handle-cache-lag]], [[examples/gitops-reverts-a-hand-edited-deployment]], [[examples/cloud-console-changes-reverted-by-provider-controllers]], [[examples/controller-pattern-for-digital-twins]], [[findings/stale-cache-and-double-action]], [[findings/event-specific-logic-in-reconcilers]], [[findings/cost-of-constant-reconciliation]], [[findings/continuous-loops-override-intentional-changes]], [[findings/failure-retry-loops-and-backoff]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[decisions/events-as-hints-state-as-truth]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 4 (plus possible-resolution notes under all three seeded gaps)
- rationale: The dossier summarizes 14 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The level-triggered concept was promoted from draft to active because it now has a primary-source rationale, a worked contrast, author rules, and a catalog of costs. Argo CD, Config Connector, ACK, Cluster API, Flux, and Crossplane were updated, and controller-runtime became a new entity; Backstage is not mentioned in the dossier, so no page was created. ACK and Cluster API behavior was unconfirmed in the dossier and is recorded as a gap. Drafted inline because the page-writer subagent is not available in this session.

## [2026-11-25] ingest | Research dossier: Eventual Consistency and Convergence
- source: [[sources/research-eventual-consistency-and-convergence]]
- raw: `raw/research-eventual-consistency-and-convergence.md` (sha256: bb35eafbd239)
- pages touched: [[concepts/eventual-consistency-and-convergence]], [[concepts/reconciliation-loop]], [[concepts/idempotency]], [[concepts/informers-reflectors-and-workqueues]], [[concepts/conditions]], [[concepts/self-healing-and-drift-detection]], [[concepts/level-triggered-vs-edge-triggered]], [[concepts/gitops-pull-based-delivery]], [[concepts/composite-resource]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/kro]], [[entities/controller-runtime]], [[findings/stale-cache-and-double-action]], [[findings/ordering-and-dependency-failures]], [[findings/failure-retry-loops-and-backoff]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-eventual-consistency-and-convergence]], [[entities/kube-rs]], [[examples/deployment-replica-changes-converge-to-the-final-count]], [[examples/flux-dependson-and-health-checks-gate-rollout]], [[examples/argo-cd-sync-waves-order-crds-operators-and-workloads]], [[examples/crossplane-database-claim-reports-synced-and-ready]], [[examples/kro-shared-queue-tunes-throughput]], [[findings/errors-used-as-timers-in-reconcilers]], [[findings/retry-storms-and-unbounded-retries]], [[findings/duplicate-work-from-replicas-without-leader-election]], [[findings/misleading-readiness-and-stale-status]], [[findings/drift-detection-latency-is-the-interval]], [[comparisons/retry-and-backoff-controls-across-tools]], [[decisions/single-replica-versus-leader-election]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 3 (plus possible-resolution notes under all three seeded gaps)
- rationale: The dossier summarizes 15 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The eventual-consistency concept was promoted from draft to active because it now has a precise guarantee statement, a mechanism, and a sourced catalog of costs and mitigations. Argo CD, Flux, Crossplane, and kro entity pages were updated, and kube-rs became a new entity. Config Connector, ACK, Cluster API, and Backstage are not sourced in the dossier (the Cluster API fetch returned 404), so those pages were not touched. The GitHub retry-storm account is recorded with a warning that it is a secondary, non-Kubernetes source. Drafted inline because no page-writer subagent is available in this session.

## [2026-11-25] ingest | Research dossier: Self-Healing and Drift Detection
- source: [[sources/research-self-healing-and-drift-detection]]
- raw: `raw/research-self-healing-and-drift-detection.md` (sha256: 98edc2019c6b)
- pages touched: [[concepts/self-healing-and-drift-detection]], [[concepts/server-side-apply-and-field-ownership]], [[concepts/gitops-pull-based-delivery]], [[concepts/managed-resource]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/kro]], [[entities/config-connector]], [[entities/ack]], [[entities/cluster-api]], [[findings/multiple-writers-on-one-object]], [[findings/defaulting-and-drift-reconcile-loops]], [[findings/drift-detection-latency-is-the-interval]], [[findings/cost-of-constant-reconciliation]], [[findings/immature-abstractions-in-the-control-plane-ecosystem]], [[findings/continuous-loops-override-intentional-changes]], [[findings/immutable-fields-and-drift-collisions]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]], [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[examples/cloud-console-changes-reverted-by-provider-controllers]], [[examples/gitops-reverts-a-hand-edited-deployment]], [[examples/cluster-fleet-lifecycle-with-cluster-api]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-self-healing-and-drift-detection]], [[entities/tofu-controller]], examples (7: [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]], [[examples/argo-cd-app-of-apps-out-of-sync-from-image-updater]], [[examples/incremental-gitops-adoption-with-manual-sync-and-self-heal]], [[examples/cluster-api-machine-health-check-replaces-failed-nodes]], [[examples/tofu-controller-detects-terraform-drift-without-applying]], [[examples/ack-resync-period-tuning-for-stateful-resources]], [[examples/crossplane-managed-resource-enforces-forprovider-and-observes-adopted-resources]]), findings (4: [[findings/field-ownership-blocks-drift-correction]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[findings/remediation-can-amplify-an-outage]], [[findings/late-initialized-fields-create-false-drift]]), comparisons (2: [[comparisons/drift-detection-mechanisms-across-tools]], [[comparisons/exemption-and-ignore-controls-across-tools]]), decisions (2: [[decisions/staged-adoption-of-automated-drift-correction]], [[decisions/choosing-a-drift-check-interval-for-external-resources]])
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 5 (plus possible-resolution notes under the three seeded gaps, and under the adoption-controls and reconcile-defaults gaps)
- rationale: The dossier summarizes 19 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The self-healing concept was promoted from draft to active because it now has a primary-source mechanism, tool-by-tool controls, a cadence and cost model, and a sourced failure-mode catalog. Argo CD, Config Connector, ACK, Cluster API, Flux, Crossplane, and kro entity pages were updated and tofu-controller became a new entity; Backstage is not mentioned in the dossier, so no page was created. The Flux override-manager claim comes from a community reply and is recorded as a gap. Drafted inline because the page-writer subagent is not available in this session.

## [2026-11-25] ingest | Research dossier: GitOps Pull-Based Delivery
- source: [[sources/research-gitops-pull-based-delivery]]
- raw: `raw/research-gitops-pull-based-delivery.md` (sha256: 335ba8f50b2b)
- pages touched: [[concepts/gitops-pull-based-delivery]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/kro]], [[entities/config-connector]], [[entities/cluster-api]], [[findings/unintended-deletion-through-prune]], [[findings/blast-radius-and-privilege-centralization]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-gitops-pull-based-delivery]], [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]], [[examples/crossplane-resources-hosted-by-argo-cd]], [[examples/gitops-agent-on-non-kubernetes-targets]], [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]], [[findings/rollback-is-blocked-while-automated-sync-is-on]], [[findings/mutable-remote-references-change-what-a-commit-renders]], [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]], [[comparisons/push-versus-pull-delivery]], [[comparisons/flux-versus-argo-cd-architecture]], [[decisions/git-versus-oci-as-the-canonical-source]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 5 (plus possible-resolution notes under the three seeded gaps)
- rationale: The dossier summarizes 15 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The GitOps concept was promoted from draft to active because it now has the four OpenGitOps principles, a push-versus-pull security rationale, the controller mechanics, the two-layer loop, and a sourced pitfall catalog. Flux, Argo CD, Crossplane, kro, Config Connector, and Cluster API entity pages were updated. Backstage is not mentioned in the dossier and ACK is not covered, so no new entity pages were created and ACK was not touched. The Flux D2 claims come from a vendor write-up and are marked as such. Drafted inline because the touch budget used simple appended sections and no page-writer subagent is available in this session.

## [2026-11-25] ingest | Research dossier: GVK and GVR
- source: [[sources/research-gvk-and-gvr]]
- raw: `raw/research-gvk-and-gvr.md` (sha256: 5c56bb1e05a8)
- pages touched: [[concepts/gvk-and-gvr]], [[concepts/custom-resource-definition]], [[entities/flux]], [[entities/crossplane]], [[entities/kro]], [[entities/argo-cd]], [[entities/kubebuilder]], [[entities/controller-runtime]], [[findings/ordering-and-dependency-failures]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-gvk-and-gvr]], [[concepts/api-discovery-and-restmapper]], [[concepts/crd-versioning-and-storage-migration]], [[entities/client-go]], [[examples/hpa-scales-any-workload-through-the-scale-subresource]], [[examples/servicemonitor-no-matches-for-kind-in-helm-and-argo-cd]], [[examples/xrd-and-rgd-declare-platform-gvks]], [[examples/cluster-upgrades-remove-beta-gvks-in-1-25-and-1-26]], [[examples/kubebuilder-domain-flag-for-ambiguous-external-gvks]], [[findings/stale-restmapper-hides-newly-installed-crds]], [[findings/custom-resources-applied-before-their-crd-exists]], [[findings/group-and-plural-names-are-effectively-permanent]], [[findings/crd-version-removal-without-migration-strands-stored-objects]], [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]], [[comparisons/gvk-versus-gvr]], [[comparisons/restmapper-strategies-static-deferred-and-dynamic]], [[comparisons/missing-crd-handling-flux-versus-argo-cd]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 4 (plus possible-resolution notes under the three seeded gaps)
- rationale: The dossier summarizes 18 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The GVK and GVR concept was promoted from draft to active because it now has a definition, the mapping and its exceptions, the translation machinery, lifecycle rules, and a sourced failure catalog. Flux, Crossplane, kro, Argo CD, Kubebuilder, and controller-runtime entity pages were updated and client-go became a new entity. Config Connector, ACK, Cluster API, and Backstage are not covered by readable sources in the dossier, so those pages were not touched and a gap was drafted instead. The Argo CD ordering details are unverified in the dossier and are marked as such. Drafted inline because the page-writer subagent is not available in this session.

## [2026-11-25] ingest | Research dossier: Custom Resource Definitions
- source: [[sources/research-custom-resource-definition]]
- raw: `raw/research-custom-resource-definition.md` (sha256: 6c26f7f89147)
- pages touched: [[concepts/custom-resource-definition]], [[concepts/crd-versioning-and-storage-migration]], [[concepts/admission-webhooks-and-cel]], [[concepts/operator-pattern]], [[concepts/spec-status-split]], [[entities/flux]], [[entities/argo-cd]], [[entities/crossplane]], [[entities/kro]], [[entities/kubebuilder]], [[findings/etcd-scale-limits-of-the-shared-store]], [[findings/crd-version-removal-without-migration-strands-stored-objects]], [[findings/custom-resources-applied-before-their-crd-exists]], [[decisions/crd-versus-aggregated-api]], [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]], [[open-knowledge-gaps]], [[index]]
- new pages: [[sources/research-custom-resource-definition]], [[entities/helm]], [[examples/postgrescluster-custom-resource-reconciled-into-child-objects]], [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]], [[examples/kubebuilder-hub-and-spoke-conversion-for-multi-version-crds]], [[examples/flux-helmrelease-crd-policies-createreplace-and-dependson]], [[examples/argo-cd-applicationsets-crd-too-large-for-client-side-apply]], [[examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd]], [[findings/a-down-conversion-webhook-can-stall-garbage-collection]], [[findings/admission-webhook-outages-are-a-recurring-failure-class]], [[findings/unknown-fields-are-silently-pruned-under-structural-schemas]], [[findings/helm-does-not-upgrade-or-delete-crds]], [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]], [[findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind]], [[comparisons/cel-validation-rules-versus-validating-webhooks]], [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]], [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]]
- contradictions raised: 0
- fact conflicts: 0
- gaps drafted: 5 (plus possible-resolution notes under the three seeded gaps)
- rationale: The dossier summarizes 16 web pages, so URLs are cited in the source page's Key claims and no per-URL source pages were created. The CRD concept was promoted from draft to active because it now has a definition, API conventions, schema and CEL mechanics, versioning, platform-tool treatment, and a sourced pitfall catalog. Helm became a new entity because the dossier documents its CRD limits. Cluster API, Config Connector, ACK, and Backstage are not covered by the dossier, so no pages were created or extended for them and a gap was drafted instead. The v1.37 StorageVersionMigration GA claim and the 1.5 MB object limit are single-source and are marked as such. Drafted inline because the page-writer subagent is not available in this session.
