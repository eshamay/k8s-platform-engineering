export const meta = {
  name: 'build-k8s-platform-wiki',
  description: 'Research every seeded concept on the web, ingest dossiers into the sticki-wiki, plan and write a 5-part tutorial series plus Flux and Crossplane ramp-ups',
  phases: [
    { title: 'Research', detail: 'one web-research agent per concept and per cross-cutting topic, each writes a raw dossier' },
    { title: 'Ingest', detail: 'serial sticki-ingest of each dossier, one commit per source' },
    { title: 'Plan', detail: 'planner reads the corpus and designs the output set' },
    { title: 'Write', detail: 'parallel tutorial writers, each followed by a prose-and-fact review and fix' },
    { title: 'Finalize', detail: 'index, log, todo, lint, final commit' },
  ],
}

// NOTE: output paths in this script predate the group folders; documents now live in outputs/<group>/<slug>.md (see GROUP_OF in trim-outputs-to-principles.js).
const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = '2026-11-25'

const CONCEPTS = [
  ['universal-control-plane', 'Universal Control Plane', 'Kubernetes API server and etcd as a general control plane for any infrastructure'],
  ['declarative-vs-imperative', 'Declarative vs Imperative', 'declarative end-state management versus imperative scripting in Kubernetes'],
  ['level-triggered-vs-edge-triggered', 'Level-Triggered vs Edge-Triggered', 'level-triggered versus edge-triggered controller design in Kubernetes'],
  ['eventual-consistency-and-convergence', 'Eventual Consistency and Convergence', 'eventual consistency, retries, and convergence in Kubernetes controllers and platform tools'],
  ['self-healing-and-drift-detection', 'Self-Healing and Drift Detection', 'drift detection and correction by controllers for external infrastructure'],
  ['gitops-pull-based-delivery', 'GitOps Pull-Based Delivery', 'GitOps, OpenGitOps principles, pull versus push delivery'],
  ['gvk-and-gvr', 'GVK and GVR', 'Group-Version-Kind and Group-Version-Resource, REST mapping, API discovery'],
  ['custom-resource-definition', 'Custom Resource Definitions', 'CRDs, schemas, versioning, conversion, storage, scale limits'],
  ['spec-status-split', 'Spec vs Status Split', 'spec and status conventions, status subresource, API conventions'],
  ['server-side-apply-and-field-ownership', 'Server-Side Apply and Field Ownership', 'server-side apply, managedFields, conflicts, how GitOps tools use it'],
  ['admission-webhooks-and-cel', 'Admission Webhooks and CEL', 'admission webhooks, ValidatingAdmissionPolicy, CEL validation rules in CRDs'],
  ['operator-pattern', 'Operator Pattern', 'the operator pattern, Operator SDK, Kubebuilder, maturity, anti-patterns'],
  ['reconciliation-loop', 'Reconciliation Loop', 'controller-runtime Reconcile, requeue, backoff, error handling'],
  ['idempotency', 'Idempotency', 'idempotent reconciliation, external-name patterns, safe retries against cloud APIs'],
  ['informers-reflectors-and-workqueues', 'Informers, Reflectors, and Workqueues', 'client-go informers, reflectors, shared caches, rate-limited workqueues'],
  ['finalizers', 'Finalizers', 'finalizers, stuck Terminating objects, deletion policy, safe removal'],
  ['owner-references-and-garbage-collection', 'Owner References and Garbage Collection', 'ownerReferences, cascading deletion, foreground and background GC'],
  ['conditions', 'Conditions', 'status conditions conventions, observedGeneration, Ready and Synced semantics'],
  ['managed-resource', 'Managed Resources', 'Crossplane managed resources, management policies, external names, import'],
  ['composite-resource', 'Composite Resources and Resource Graphs', 'Crossplane XRs, XRDs, claims, kro resource graphs, platform API design'],
  ['composition', 'Compositions', 'Crossplane Compositions, patch-and-transform, composition functions, kro ResourceGraphDefinition'],
  ['provider', 'Providers', 'Crossplane providers, Upjet, provider families, ACK, Config Connector as alternatives'],
]

const CROSS = [
  ['flux-deep-dive', 'Flux deep dive', 'Flux architecture: source-controller, kustomize-controller, helm-controller, notification-controller, image automation, multi-tenancy, dependency ordering, health checks, sharding, real-world adoption'],
  ['crossplane-deep-dive', 'Crossplane deep dive', 'Crossplane architecture: core, providers, XRDs, Compositions, functions, claims, packages, Upbound, upgrades, real-world adoption and platform-team stories'],
  ['kro-and-abstraction-models', 'kro and abstraction models', 'kro ResourceGraphDefinition versus Crossplane Compositions, plus Helm, Kustomize, KRM functions, Score, Radius as abstraction approaches'],
  ['landscape', 'Tooling landscape', 'Argo CD, Flux, Config Connector, AWS ACK, Azure Service Operator, Cluster API, Terraform controllers (Flux tf-controller, Terraform operator), Backstage, Port, Kratix, Cozystack; positioning and trade-offs'],
  ['scale-and-sharding', 'Scale and sharding', 'controller scale limits, informer memory, workqueue rate limiting, API priority and fairness, sharding Flux and Crossplane providers, cloud API rate limits, CRD count pressure'],
  ['pitfalls-and-case-studies', 'Pitfalls and case studies', 'postmortems, anti-patterns and industry case studies: stuck finalizers, SSA conflicts, drift fights, deletion cascades that destroyed infrastructure, upgrade breakage, platform-team lessons'],
]

const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    dossierPath: { type: 'string' },
    sourceCount: { type: 'number' },
    notes: { type: 'string' },
  },
  required: ['slug', 'dossierPath', 'sourceCount'],
}

const INGEST_SCHEMA = {
  type: 'object',
  properties: {
    dossierPath: { type: 'string' },
    commit: { type: 'string' },
    pagesCreated: { type: 'array', items: { type: 'string' } },
    pagesTouched: { type: 'array', items: { type: 'string' } },
    problems: { type: 'string' },
  },
  required: ['dossierPath', 'commit'],
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    docs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          title: { type: 'string' },
          kind: { type: 'string' },
          thesis: { type: 'string' },
          sectionOutline: { type: 'array', items: { type: 'string' } },
          wikiPages: { type: 'array', items: { type: 'string' } },
        },
        required: ['slug', 'title', 'kind', 'thesis', 'sectionOutline', 'wikiPages'],
      },
    },
  },
  required: ['docs'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fix'] },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          location: { type: 'string' },
          problem: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['category', 'problem', 'fix'],
      },
    },
  },
  required: ['verdict', 'issues'],
}

const PROSE_RULES = `Prose contract (strict). Write narrative, full-sentence prose in a warm, readable teaching voice. Do not write in caveman or telegraphic style. Do not truncate, condense, or summarize into fragments. Explanations, background, use cases, pitfalls, and comparisons are written as full paragraphs that keep nuance and explain why, not only what. Bullet lists are acceptable only for genuinely list-shaped material such as a glossary or a link roundup. Explain every term the first time it appears, assuming a reader who has real Kubernetes operating experience (pods, deployments, services, RBAC, kubectl) but no deep knowledge of controllers, API machinery, or platform abstractions. Avoid these banned words entirely: anchored, unanchored, bounded, bounds, canonical, carveout, carveouts, gate/gates as a verb, genuinely, load-bearing, material, materially, shape/shapes as a vague noun. Do not invent facts: when sources disagree or a claim is uncertain, say so in the prose.`

function researchPrompt(slug, title, topic, kind) {
  return `You are researching one ${kind} for a Kubernetes platform-engineering knowledge wiki at ${WIKI}. Topic: "${title}" (${topic}).

Goal: collect a wide range of descriptive and architectural material that later writers will use to build ramp-up tutorials. The audience is engineers who run Kubernetes but do not yet know controllers, API machinery, and platform abstractions in depth.

Method:
1. The built-in WebSearch tool is DISABLED in this session; do not call it. First call ToolSearch with query "select:mcp__plugin_deep-research_deep-research-docsearch__web_search,mcp__plugin_deep-research_deep-research-docsearch__web_scrape" to load the search and scrape tools, then use web_search (limit 5 to 10, optionally with whitelisted_sites such as kubernetes.io, fluxcd.io, docs.crossplane.io, kro.run, cncf.io) to discover URLs and web_scrape to read pages. WebFetch is a fallback for pages web_scrape cannot read. If a tool errors, switch to the other rather than giving up. Find at least 10 distinct, high-quality sources, aiming for 12 to 15. Mix kinds: official Kubernetes, Flux, Crossplane, kro, and CNCF documentation; KEPs and design docs; API conventions and architecture docs; source-code walkthroughs; conference talks and their write-ups; engineering blogs and case studies from real organizations; postmortems; and good tutorial explainers. Prefer primary sources. Actually fetch each page and read it before summarizing it; do not summarize from the search snippet alone. Skip sources you cannot read.
2. Cover three needs explicitly: (a) what the concept is and how it works mechanically, (b) real-world use cases from industry or typical projects, named where possible, and (c) pitfalls, failure modes, and how different tool stacks (Flux, Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, plain controllers, and so on) handle or avoid them.
3. Write one dossier file at ${WIKI}/raw/research-${slug}.md. Use the Write tool. Keep it under 50 KB. Structure:
   - H1 title "Research dossier: ${title}" and a line stating the research date ${TODAY}.
   - "## Overview" with 3 to 5 paragraphs in your own words describing the concept and how the sources frame it.
   - "## Sources" with one H3 per source. Each source entry has: the exact URL, the page title, the publisher or author, the kind of source, a paragraph-length summary in your own words of what it says and why it is useful, and any short verbatim quote of at most 25 words marked as a quote. Never paste long passages.
   - "## Real-world use cases" with paragraphs naming concrete organizations, projects, or typical scenarios, each tied back to a source URL.
   - "## Pitfalls and how tools address them" in paragraphs, each tied to sources.
   - "## Tutorial and explainer links" listing the best ramp-up material with one sentence each.
   - "## Open questions" for things the sources left unclear or that conflict.
4. Write only that one file. Do not edit any other file, and do not run git commands.

Return the structured result with the dossier path, the number of sources you actually read, and brief notes on gaps.`
}

// ---------- Phase 1: research ----------
phase('Research')
const topics = [
  ...CONCEPTS.map(([slug, title, topic]) => ({ slug, title, topic, kind: 'concept' })),
  ...CROSS.map(([slug, title, topic]) => ({ slug, title, topic, kind: 'cross-cutting topic' })),
]
log(`Research fan-out: ${topics.length} agents (${CONCEPTS.length} concepts + ${CROSS.length} cross-cutting topics)`)

// args.skipResearch: slugs whose raw/research-<slug>.md dossier already exists on disk.
// Research agents must be able to Write, so use general-purpose (the web-researcher type has no Write tool).
const skip = new Set((args && args.skipResearch) || [])
const toResearch = topics.filter(t => !skip.has(t.slug))
if (skip.size) log(`Skipping research for ${skip.size} existing dossiers; researching ${toResearch.length}`)

const research = (await parallel(
  toResearch.map(t => () =>
    agent(researchPrompt(t.slug, t.title, t.topic, t.kind), {
      label: `research:${t.slug}`,
      phase: 'Research',
      schema: RESEARCH_SCHEMA,
      agentType: 'general-purpose',
    }),
  ),
)).filter(Boolean)

const missing = toResearch.filter(t => !research.find(r => r.slug === t.slug))
if (missing.length) log(`WARNING: no research result for: ${missing.map(m => m.slug).join(', ')}`)
log(`Research complete: ${research.length}/${toResearch.length} new dossiers, ${research.reduce((n, r) => n + (r.sourceCount || 0), 0)} sources read`)

// ---------- Phase 2: serial ingest (one source, one commit) ----------
phase('Ingest')
const ingested = []
const skipIngest = new Set((args && args.skipIngest) || [])
for (const topic of topics) {
  if (skipIngest.has(topic.slug)) continue
  const r = { slug: topic.slug, dossierPath: `${WIKI}/raw/research-${topic.slug}.md` }
  const res = await agent(
    `Ingest one source into the sticki-wiki at ${WIKI}. Invoke the Skill tool with skill "sticki-wiki:sticki-ingest" and follow it exactly, with the source file ${r.dossierPath}. If that file does not exist, do not invent it: make no changes and report the problem. Treat this research dossier as ONE markdown source (it summarizes many web pages, each with a URL). Notes for this ingest:
- The file is already in raw/. Do not duplicate it; compute its hash and use its filename slug as the source id.
- The size override rule does not apply; do not refuse on size. The dossier is under 50 KB.
- The wiki is large-volume and already holds draft concept pages for ${CONCEPTS.length} seeded concepts and entity pages for Flux, Crossplane, and kro. Update the matching concept page(s) for "${topic.title}" with the new claims and promote them from draft to active when well sourced. Create new pages where warranted: examples/ pages for each distinct real-world use case, findings/ pages for each distinct pitfall or failure mode, comparisons/ pages for tool-versus-tool analyses, decisions/ pages only for genuine architecture decision points, and extra entities/ pages for tools such as Argo CD, Config Connector, ACK, Cluster API, Backstage. Create one sources/ page per web URL cited in the dossier only when it is rich enough to deserve its own page; otherwise cite the dossier source page and give URLs in its Key claims.
- Fan out sticki-page-writer subagents only if the touch budget exceeds about 8 pages; otherwise draft inline.
- Never edit irrefutable-facts.md or purpose.md. Never close a gap; draft new gaps for unanswered questions, and add "Possible resolution" notes under the three seeded gaps when the source helps.
- Follow the markdown hygiene rule and the frontmatter contract in ${WIKI}/CLAUDE.md. Pages are written in clear full sentences, not telegraphic fragments.
- Before the commit, run python3 -I bin/gh_links.py --write from the wiki root so every [[wikilink]] you wrote becomes a relative markdown link that GitHub renders (it never touches raw/ or outputs/), then run python3 -I bin/gh_links.py --check and fix anything it reports; stage the files it changed that belong to this ingest. Complete the whole procedure including index.md, log.md, .sticki/events.jsonl, .sticki/state.json, and the git commit "ingest: <title> (seq N)", staging only this ingest's paths. Other ingests run one at a time, so there is no concurrent writer, but never batch two sources into one commit. If git commit fails, stop and report the error; never use --no-verify.
Return the commit short SHA, pages created, pages touched, and any problems.`,
    { label: `ingest:${r.slug}`, phase: 'Ingest', schema: INGEST_SCHEMA, agentType: 'general-purpose' },
  )
  if (res) ingested.push(res)
  else log(`WARNING: ingest failed or skipped for ${r.slug}`)
}
log(`Ingest complete: ${ingested.length}/ dossiers committed`)

// ---------- Phase 3: plan outputs ----------
phase('Plan')
const plan = await agent(
  `Plan the tutorial deliverables for the sticki-wiki at ${WIKI}. First read CLAUDE.md, purpose.md, index.md, open-knowledge-gaps.md, then read the concept, entity, example, finding, and comparison pages you need. Do not write outside outputs/.

Design exactly seven documents:
1. A 5-part tutorial series, parts 1 to 5, for readers who have real Kubernetes experience but no deep knowledge of these concepts. Required coverage: Part 1 core architectural principles (universal control plane, declarative, level-triggered, eventual consistency, self-healing and drift, GitOps pull); Part 2 KRM and API machinery (GVK/GVR, CRDs, spec and status, server-side apply, admission and CEL); Part 3 controller and operator mechanics (operator pattern, reconcile loop, idempotency, informers and workqueues, finalizers, owner references, conditions); Part 4 platform abstractions (managed resources, composites, compositions, providers, kro, tradeoffs across abstraction models); Part 5 principles of good platform architecture and operating at scale (lifecycle trace from a Flux Git commit through SSA, finalizers, and conditions; scale and sharding; pitfalls; the tooling landscape; remaining gaps).
2. A standalone ramp-up tutorial for Flux.
3. A standalone ramp-up tutorial for Crossplane.
The author is especially interested in the principles that lead to good architecture when building platforms like Flux and Crossplane, so every document, and the two tool tutorials in particular, must include a section drawing out those design principles.
Each document must include: background that ramps up the concepts, concrete example use cases from industry or typical projects, pitfalls and problems that arise, and how different tool stacks handle or have addressed those problems.

Slugs must be: part-1-<topic>, part-2-<topic>, part-3-<topic>, part-4-<topic>, part-5-<topic>, flux-ramp-up, crossplane-ramp-up. Return for each document: slug, title, kind ("series-part" or "tool-ramp-up"), a one-sentence thesis, a section outline of 8 to 12 section titles, and the list of wiki page paths (relative to the wiki root, e.g. concepts/finalizers) its writer must read. Be generous with wikiPages: include every relevant concept, example, finding, comparison, entity, and source page that exists.`,
  { label: 'plan-outputs', phase: 'Plan', schema: PLAN_SCHEMA, agentType: 'general-purpose' },
)
if (!plan || !plan.docs || plan.docs.length === 0) {
  log('Planner returned no documents; stopping before Write phase')
  return { research: research.length, ingested: ingested.length, plan: null }
}
log(`Plan: ${plan.docs.length} documents`)

// ---------- Phase 4: write -> review -> fix, per document, pipelined ----------
phase('Write')
const written = await pipeline(
  plan.docs,
  doc =>
    agent(
      `Write one deliverable for the sticki-wiki at ${WIKI}: "${doc.title}" (${doc.kind}). Output file: ${WIKI}/outputs/${doc.slug}.md.

Read first: ${WIKI}/CLAUDE.md, purpose.md, and every page listed here (relative to the wiki root): ${doc.wikiPages.join(', ')}. You may also read other wiki pages and raw/research-*.md dossiers for evidence. Only state facts the wiki supports; where the wiki is thin you may use well-established Kubernetes knowledge but must keep it conservative.

Thesis: ${doc.thesis}
Section outline to follow (you may add sections but not drop any): ${doc.sectionOutline.map((s, i) => `${i + 1}. ${s}`).join(' ')}

Required content in this document: background that ramps up each concept it covers from first principles; example use cases from industry or typical projects; pitfalls and problems that arise in practice; how different tool stacks (Flux, Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, plain controllers, and so on) handle or have addressed them; and a section on the architectural principles that make this area of platform design good, with reasoning. Include a short "Further reading" section listing the wiki pages and source URLs relied on. Cite wiki pages with [[wikilinks]] inline where claims come from them, such as [[concepts/finalizers]].

Length: this is a long-form tutorial. Aim for roughly 4,000 to 7,000 words. Use code or YAML snippets where they teach, each introduced and then explained in prose afterward.

Format: frontmatter per the CLAUDE.md contract with type: output, status: draft, created ${TODAY}, updated ${TODAY}, tags including tutorial; then one H1 title; then a metadata header following the voice-rules markdown-doc-headers rule: a "> [!NOTE]" block with fields Audience, Purpose, Status, Created, As of, Draws on, each on its own line ending with <br> except the last. Then the body.

${PROSE_RULES}

Write only this one file. Do not edit index.md, log.md, or any other file, and do not run git commands; a finalizer does that. Return a one-line confirmation.`,
      { label: `write:${doc.slug}`, phase: 'Write', agentType: 'general-purpose' },
    ),
  (_w, doc) =>
    agent(
      `Review the document ${WIKI}/outputs/${doc.slug}.md ("${doc.title}") adversarially. Read it fully, then check: (1) prose contract: ${PROSE_RULES} Flag any passage written as telegraphic fragments, over-condensed bullets standing in for explanation, or banned words; (2) coverage: it must contain ramp-up background, industry or typical-project use cases, pitfalls, how different tool stacks handle them, and a section on architectural principles; every outline section from this list must exist: ${doc.sectionOutline.join(' | ')}; (3) factual accuracy: spot-check at least eight concrete claims against the wiki pages and raw/research dossiers they cite, and use your own Kubernetes knowledge to catch errors in API names, field names, controller names, and behaviors; (4) structure: frontmatter correct, one H1, metadata header uses <br> line endings, wikilinks resolve to real files under ${WIKI}. Do not edit any file. Return verdict "pass" only when there are no issues worth fixing; otherwise "fix" with specific issues, each with location, problem, and exact fix.`,
      { label: `review:${doc.slug}`, phase: 'Write', schema: REVIEW_SCHEMA, agentType: 'general-purpose' },
    ),
  (review, doc) =>
    review && review.verdict === 'fix' && review.issues.length
      ? agent(
          `Apply review fixes to ${WIKI}/outputs/${doc.slug}.md. Read the file, then fix each issue below by editing it in place, keeping the narrative full-sentence prose style (never compress text to fix a problem; expand instead where needed). Issues: ${JSON.stringify(review.issues)}. ${PROSE_RULES} Edit only this file; no git commands. Return a one-line summary of what changed.`,
          { label: `fix:${doc.slug}`, phase: 'Write', agentType: 'general-purpose' },
        ).then(() => ({ slug: doc.slug, fixed: review.issues.length }))
      : { slug: doc.slug, fixed: 0 },
)
log(`Write complete: ${written.filter(Boolean).length}/${plan.docs.length} documents; fixes applied: ${JSON.stringify(written.filter(Boolean))}`)

// ---------- Phase 5: finalize ----------
phase('Finalize')
const final = await agent(
  `Finalize the build for the sticki-wiki at ${WIKI}.
1. Read CLAUDE.md. List every file under outputs/. Add each output to index.md under "## Outputs" with a one-line description; also make sure index.md lists every page under concepts/, entities/, sources/, examples/, comparisons/, decisions/, and findings/ (use ls to verify; fix drift).
2. Append one log.md entry: "## [${TODAY}] outputs | tutorial series and tool ramp-ups" listing the seven output pages and the number of dossiers ingested.
3. Update todo.md: mark "Run build-wiki workflow" done with an outcome line (move it under Done and update the index of open todos); add open todos for follow-ups you discover (for example thin concept pages, stale-risk pages, sources worth a deeper read).
4. Invoke the Skill tool with skill "sticki-wiki:sticki-lint" and apply only the safe automatic transitions it permits; do not change irrefutable-facts.md or purpose.md and do not close any gap. Record a one-paragraph lint summary in log.md.
5. Append a .sticki/events.jsonl line with op "lint" and bump .sticki/state.json revision accordingly (read the last seq first).
6. Stage everything except gitignored trees and commit with message "outputs: tutorial series and ramp-up guides (seq N)". No remote, no push. Do not use --no-verify.
Return: the commit SHA, counts of pages by folder, lint findings left for the user, and any problems.`,
  { label: 'finalize', phase: 'Finalize', agentType: 'general-purpose' },
)

return {
  dossiers: topics.length,
  sourcesRead: research.reduce((n, r) => n + (r.sourceCount || 0), 0),
  ingestsCommitted: ingested.length,
  documents: plan.docs.map(d => d.slug),
  fixes: written.filter(Boolean),
  finalize: final,
  missingResearch: missing.map(m => m.slug),
}
