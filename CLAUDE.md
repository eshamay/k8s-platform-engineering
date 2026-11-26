# k8s-platform-engineering — wiki schema

A persistent, LLM-maintained knowledge base on Kubernetes platform engineering. It covers the Kubernetes Resource Model (KRM), API machinery, controller and operator mechanics, and the abstraction layers that tools such as Flux, Crossplane, and kro build on top of them. The goal is to understand the architecture and principles beneath Kubernetes resource-management platforms so that their use cases, strengths, tooling, pitfalls, gaps, and surrounding landscape can be explored and taught.

Built on Andrej Karpathy's LLM-wiki pattern and the sticki-wiki v2-synthesis design (three layers: `raw/` sources, LLM-owned wiki pages, this schema file).

## How this wiki is laid out

```
k8s-platform-engineering/
├── CLAUDE.md                   # this file: wiki schema, read order, contracts
├── index.md                    # categorized catalog of every page
├── log.md                      # append-only journal of every operation
├── irrefutable-facts.md        # human-only-edit operational axioms
├── open-knowledge-gaps.md      # structured open questions; agents draft, humans close
├── purpose.md                  # directional intent ("what is this wiki FOR?")
├── todo.md                     # concrete followups; agent-managed lifecycle
├── concepts/                   # one concept per page (reconciliation loop, CRD, finalizer, ...)
├── sources/                    # summary pages, one per raw item
├── entities/                   # tools and projects (Flux, Crossplane, kro, Argo CD, ...)
├── examples/                   # real-world use cases and worked examples
├── comparisons/                # side-by-side analyses (Compositions vs kro, Flux vs Argo CD, ...)
├── decisions/                  # architecturally significant design choices (Nygard ADR template)
├── findings/                   # observations, pitfalls, and measurements
├── outputs/                    # user-facing deliverables (tutorial series, ramp-up guides)
├── workflows/                  # re-runnable workflow scripts that build and extend this wiki
├── raw/                        # immutable source documents
└── .sticki/                    # git-tracked machine-readable change surface
```

## Write authority

Four classes. The contract is enforced by skill scoping and by warning headers in the affected files. A user prompt asking an agent to violate either is refused.

| Authority class | Files | Operations |
|---|---|---|
| **Human-only-edit** | `irrefutable-facts.md` | Agents read; agents draft proposed facts via gap entries; humans add via the `sticki-facts` skill. Agents never edit this file. |
| **Human-only-edit, agent-may-suggest** | `purpose.md` | Agents read on every operation; agents may propose updates via `todo.md` entries. Agents never edit `purpose.md` directly. |
| **Append-only** | `log.md`, `.sticki/events.jsonl` | Agents append new entries; nobody mutates past ones. `log.md` uses the greppable `## [YYYY-MM-DD] <op> \| <subject>` header. |
| **Agent-may-write** | `index.md`, `todo.md`, `open-knowledge-gaps.md` (drafts only; `closed` is human-only via `sticki-gaps`), `.sticki/state.json`, all content folders | Per the lifecycle rules. `.sticki/derived.json` is consumer-owned. |

## Read order on every operation

1. This file (`CLAUDE.md`).
2. `irrefutable-facts.md`.
3. `purpose.md`.
4. `index.md`.
5. `open-knowledge-gaps.md`.
6. Specific pages relevant to the operation.

## Frontmatter contract

Every content page carries:

```yaml
---
title: <human-readable title>
type: concept | entity | source | example | comparison | overview | thesis | methodology | finding | decision | output
status: draft | active | stale | contradicted | superseded | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources:
  - id: <slug matching raw/<id> or raw/<id>/>
    hash: <12-char SHA-256 prefix>
    ingested: YYYY-MM-DD
aliases: []
tags: []
superseded_by: [[<successor-page>]]   # only when status: superseded
---
```

The six anchor files use their own header conventions and are exempt from the frontmatter contract.

## Page types (11)

| Type | Use |
|---|---|
| `concept` | Idea or pattern (one concept per page) |
| `entity` | Tool, project, organization, or person (Flux, Crossplane, kro, ...) |
| `source` | Summary of one raw item; verbatim quotes in `## Key claims` |
| `example` | Worked example or real-world use case |
| `comparison` | Side-by-side analysis |
| `overview` | Filed-back synthesis answer |
| `thesis` | Argument or position the wiki is making |
| `methodology` | Procedure, protocol, or method |
| `finding` | Empirical result, observation, or pitfall |
| `decision` | One architecturally significant choice (Nygard ADR template) |
| `output` | User-facing deliverable shared with an external audience; frozen at delivery |

## Lifecycle states (6)

```
draft → active → stale → active
              → contradicted → active (resolved)
                            → archived
              → superseded ─→ (frozen, references successor via superseded_by:)
              → archived
```

## Schema configuration

```yaml
staleness_days: 180                    # the Kubernetes ecosystem moves quickly; re-check older pages twice a year
auto_archive_orphans: false
contradiction_block_required: true
output_language: auto

retrieval:
  tier_threshold_sources: 300          # large wiki expected (500+ sources); switch retrieval tier earlier
  vector_index_enabled: false
  rrf_k: 60

graph:
  weights:
    direct_link: 3.0
    source_overlap: 4.0
    adamic_adar: 1.5
    type_affinity: 1.0
  louvain_min_cohesion: 0.15
  bridge_node_min_clusters: 3
  isolated_node_max_degree: 1

bounded_write_authority:
  human_only_edit: [irrefutable-facts.md]
  human_only_edit_agent_may_suggest: [purpose.md]
  append_only: [log.md]
  agent_may_write:
    - index.md
    - todo.md
    - open-knowledge-gaps.md           # drafts only; closed status is human-only via sticki-gaps
    - <all content folders>

ingest:
  two_step_cot: true
  multi_format_handlers: [markdown, url]
  language_consistency_required: false
  evergreen_density_min_outbound_wikilinks: 3
  stuck_gap_threshold_days: 60
```

## The `.sticki/` change surface

Hidden, git-tracked directory holding `events.jsonl` (append-only, one JSON object per write-op), `state.json` (current revision), and `derived.json` (consumer registry, created lazily). `sticki-ingest` commits each ingest as `ingest: <title> (seq <N>)`. Derived output trees `study-guide/` and `build/` are gitignored. Full contract lives in the sticki-wiki plugin's own `wiki/CLAUDE.md`.

## Prose style contract for `outputs/`

Tutorials and ramp-up documents in `outputs/` are written as narrative, full-sentence prose. They do not truncate, condense, or compress text into fragments or telegraphic bullets. Bullet lists are acceptable only for genuinely list-shaped content such as a glossary or a link roundup; explanations, background, use cases, and pitfalls are written as paragraphs that carry the nuance. Every output also follows the voice-rules banned-phrases list.

## Companion skills

`sticki-bootstrap`, `sticki-ingest`, `sticki-lint`, `sticki-query`, `sticki-summarize` (the only writer to `outputs/`), `sticki-facts`, `sticki-gaps`, `sticki-todo`. Companion agent: `sticki-page-writer`.

## Bootstrap metadata

- Bootstrapped: 2026-11-25
- Domain: Kubernetes platform engineering (KRM, API machinery, controllers, operators, abstractions; Flux, Crossplane, kro)
- Scenario template: Research
- Volume: large (500 or more sources expected)
- Source types: markdown, URL
- Taxonomy: concepts, sources, entities, examples, comparisons, decisions, findings, outputs
