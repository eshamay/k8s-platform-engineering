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
