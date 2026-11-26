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
