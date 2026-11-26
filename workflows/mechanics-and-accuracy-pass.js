export const meta = {
  name: 'mechanics-and-accuracy-pass',
  description: 'Batch 1: re-research unverified and release-candidate claims, research seven mechanics gap clusters, ingest serially, triage, revise all seven tutorials, check cross-document consistency',
  phases: [
    { title: 'Research', detail: 'research then adversarially verify, one chain per cluster (11 clusters)' },
    { title: 'Ingest', detail: 'serial sticki-ingest of each verified dossier, one commit each' },
    { title: 'Triage', detail: 'gap dispositions, affected outputs, and the manual-fetch list' },
    { title: 'Revise', detail: 'revise, adversarially review and fix each of the seven tutorials' },
    { title: 'Consistency', detail: 'cross-document consistency and link check over all outputs' },
    { title: 'Finalize', detail: 'index, log, todo, lint, final commit' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = (args && args.today) || '2026-11-26'
const BASE_SHA = (args && args.baseSha) || '8ada735'

const OUTPUT_SLUGS = [
  'part-1-core-architectural-principles',
  'part-2-krm-and-api-machinery',
  'part-3-controller-and-operator-mechanics',
  'part-4-platform-abstractions',
  'part-5-platform-architecture-principles-and-operating-at-scale',
  'flux-ramp-up',
  'crossplane-ramp-up',
]

// P1 = accuracy fixes, P2 = mechanics gaps. Gap titles are exact H2 titles in open-knowledge-gaps.md
// (open or closed; closed entries carry a Resolution with a "Not settled" remainder to re-check).
const CLUSTERS = [
  {
    id: 'b1-unverified-claims', group: 'accuracy (P1a)',
    focus: 'Find every claim still marked UNVERIFIED, SECONDARY-ONLY or UNREADABLE in the wiki and settle it against a primary source. Start by running grep (rg) for UNVERIFIED and SECONDARY-ONLY across raw/research-gap-*.md, raw/research-*.md, sources/, findings/ and outputs/. Known examples: the helm-controller --override-manager passage in the Flux ramp-up, whether old Crossplane concepts URLs redirect to the v2 docs, Crossplane issue 7453 (external writer losing a field), the default poll interval in Crossplane managed resources. Triage the list, then re-research the 15 to 25 most consequential claims; record the rest as still unverified with the reason.',
    gaps: [],
  },
  {
    id: 'b1-recheck-capi-argocd', group: 'accuracy (P1b)',
    focus: 'Recheck items read only from a release candidate or an older page: Cluster API MachineHealthCheck and ClusterClass maturity at the FINAL v1.15.0 release (or the newest release you can read), and whether Ready-to-Available affects kstatus-style tools; Argo CD sharding algorithm default and maturity at the newest release, and the Argo CD default reconcile interval for v2.1 to v2.4 and the reason for the v3.0 change.',
    gaps: ['Current Cluster API MachineHealthCheck behavior', 'ClusterClass maturity and the managed topologies proposal', 'Generic readiness when Cluster API moves from Ready to Available', 'Argo CD sharding algorithm maturity in current releases', 'Argo CD default reconcile interval across versions'],
  },
  {
    id: 'b1-recheck-kro-crossplane', group: 'accuracy (P1b)',
    focus: 'Recheck kro and Crossplane items: the kro v0.9.4 rate-limiter table and instance conditions read from Go source (not only docs) at the newest release; Crossplane PR 8080 body and status for async Synced signaling; Crossplane v2 server-side apply behavior and issue 7453 (try to reproduce from source); Crossplane v2 scaling guidance; how a composition function per-resource readiness becomes the XR Ready condition.',
    gaps: ['kro released-version tuning defaults and instance conditions', 'kro status schema and Crossplane v2 status propagation', 'Crossplane v2 condition behavior and the fix for async Synced signaling', 'Crossplane v2 server-side apply behavior and external writers', 'Current Crossplane v2 scaling guidance'],
  },
  {
    id: 'b1-recheck-flux-k8s', group: 'accuracy (P1b)',
    focus: 'Recheck Flux and upstream items: the Flux reconcile jitter value and the origin of the five-minute wording; helm-controller driftDetection and Helm 4 server-side apply; KEP-1040 (API Priority and Fairness) read in full; Mutating Admission Policy first-available version and the docs-versus-code discrepancy; StorageVersionMigration progress-condition field layout; controller-runtime issue 808 (the older immediate-requeue claim); Kubernetes v1.36 staleness metric names for ReplicaSet and StatefulSet and KEP 5647.',
    gaps: ['Flux default reconcile interval and drift-detection wording', 'Flux pre-dry-run manager takeover flag and current SSA documentation', 'Mutating Admission Policy release status', 'StorageVersionMigration GA details in Kubernetes v1.37', 'Requeue true backoff behavior in current controller-runtime', 'Kubernetes v1.36 staleness mitigation mechanisms and metrics', 'Scale numbers from model digests need rechecking'],
  },
  {
    id: 'm1-finalizers', group: 'mechanics (P2)',
    focus: 'Finalizers across tools: Argo CD finalizer variants (resources-finalizer.argocd.argoproj.io and its foreground and background forms) and non-cascading deletes; the Flux Kustomization finalizer name and behavior (finalizers.fluxcd.io, deletion policy values); resolution of Crossplane issue 7801 on credential protection; how ACK, Config Connector and kro name and remove their finalizers; Cluster API issue 1514 on blocking deletion with a finalizer or annotation.',
    gaps: ['Argo CD finalizer variants and non-cascading deletes', 'Flux Kustomization finalizer name and behavior', 'Resolution of Crossplane issue 7801 on credential protection', 'How ACK, Config Connector, and kro name and remove their finalizers', 'Cluster API issue 1514 on blocking deletion with a finalizer or annotation'],
  },
  {
    id: 'm2-ownership-gc', group: 'mechanics (P2)',
    focus: 'Owner references and garbage collection: how kro sets ownership and labels on child resources; Argo CD PrunePropagationPolicy and resource tracking methods (label, annotation, annotation+label); what happens when blockOwnerDeletion is set without permission on the owner finalizers subresource (the OwnerReferencesPermissionEnforcement admission plugin); KEPs on cross-namespace ownership and garbage collector performance; adoption and orphaning behavior in Cluster API, kro and controller-runtime operators; namespaced v2 Crossplane managed resources when the namespace is deleted while the provider is down.',
    gaps: ['How kro sets ownership and labels on child resources', 'Argo CD PrunePropagationPolicy and resource tracking methods', 'What happens when blockOwnerDeletion is set without finalizers permission', 'KEPs on cross-namespace ownership and garbage collector performance', 'Adoption and orphaning behavior in Cluster API, kro, and controller-runtime operators', 'Behavior of namespaced v2 managed resources when a namespace is deleted while the provider is down', 'Crossplane v2 namespaced composites and managementPolicies versus garbage collection'],
  },
  {
    id: 'm3-status-conditions', group: 'mechanics (P2)',
    focus: 'Status and conditions: kstatus rules for combining observedGeneration and conditions (read the cli-utils kstatus source and docs); where observedGeneration should live (status vs per-condition) per the API conventions and KEPs; how a platform should choose condition polarity (normal-true vs abnormal-true) with sources; Config Connector and Argo CD status semantics beyond health checks; which parts of the Config Connector reconcile-status design shipped.',
    gaps: ['kstatus rules for combining observedGeneration and conditions', 'Where observedGeneration should live', 'How a platform should choose condition polarity', 'Config Connector and Argo CD status semantics beyond health checks', 'Which parts of the Config Connector reconcile-status design shipped'],
  },
  {
    id: 'm4-ssa-conflict-policy', group: 'mechanics (P2)',
    focus: 'Server-side apply and field ownership in other tools: SSA behavior in kro, ACK, Config Connector and Helm 4; Cluster API field ownership rules and Argo CD Server-Side Diff stability; helm-controller override-manager and dry-run failure recovery; gather EVIDENCE (not a decision) for the best default conflict policy when GitOps runs beside in-cluster controllers and for force-conflicts versus strip-or-adopt, with named sources on each side.',
    gaps: ['Server-side apply behavior in kro, ACK, Config Connector, and Helm 4', 'Cluster API field ownership rules and Argo CD Server-Side Diff stability', 'Flux helm-controller override-manager and dry-run failure recovery', 'Best default conflict policy for teams running GitOps and in-cluster controllers', 'Force-conflicts versus strip-or-adopt when two controllers co-own a field'],
  },
  {
    id: 'm5-informers-caches', group: 'mechanics (P2)',
    focus: 'Informers, caches and resource keys: informer resync semantics (what resync does and does not do); the origin of the level-driven, not edge-driven guidance (Kubernetes design docs and talks); cache narrowing options in controller-runtime (ByObject, label and field selectors, DisableFor, transforms); Flux shared caches and Crossplane performance guidance; informer and cache choices of kro, Config Connector, ACK and Cluster API; informer and cache behavior keyed by GVR; the controller-runtime v0.3.0 dynamic mapper claim and aggregated discovery rationale; how Argo CD, Config Connector, ACK and Cluster API key resources by GVK.',
    gaps: ['Informer resync semantics', 'Origin of the Level driven, not edge driven guidance', 'Cache narrowing options in controller-runtime', 'Flux shared caches and Crossplane performance guidance', 'Informer and cache choices of kro, Config Connector, ACK, and Cluster API', 'Informer and cache behavior keyed by GVR', 'controller-runtime v0.3.0 dynamic mapper claim and aggregated discovery rationale', 'How Argo CD, Config Connector, ACK, and Cluster API key resources by GVK'],
  },
  {
    id: 'm6-admission-crds', group: 'mechanics (P2)',
    focus: 'Admission and CRDs: admission behavior of Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API and Gatekeeper (which ship webhooks, failure policies, namespaces excluded); Kyverno webhook failure modes and availability guidance; CEL cost limits and per-request budgets (the estimated cost limit, runtime cost budget, and how CRD authors hit them); CRD scale limits (documented limits and measured behavior); the status of the conversion webhook and garbage collection problem; CRD handling in Cluster API, Config Connector, ACK and Backstage.',
    gaps: ['Admission behavior of Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, and Gatekeeper', 'Kyverno webhook failure modes and availability', 'CEL cost limits and per-request budgets', 'CRD scale limits', 'Status of the conversion webhook and garbage collection problem', 'CRD handling in Cluster API, Config Connector, ACK, and Backstage'],
  },
  {
    id: 'm7-operators-idempotency', group: 'mechanics (P2)',
    focus: 'Operators and idempotency: criteria for choosing an operator framework or language (Kubebuilder, Operator SDK, kopf, Java Operator SDK, shell-operator, metacontroller); Operator SDK capability levels and how they apply to composition-based operators; Argo CD and Config Connector as operators; Backstage and the operator pattern; kro and Cluster API idempotency for external and infrastructure creates; per-provider external-name defaults in Crossplane providers; how Config Connector handles two objects that target one cloud resource.',
    gaps: ['Criteria for choosing an operator framework or language', 'Operator SDK capability levels for composition-based operators', 'Argo CD and Config Connector as operators', 'Backstage and the operator pattern', 'kro and Cluster API idempotency for external and infrastructure creates', 'Per-provider external-name defaults', 'Config Connector conflict handling when two objects target one cloud resource'],
  },
]

const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    dossierWritten: { type: 'boolean' },
    claims: {
      type: 'object',
      properties: { verified: { type: 'number' }, secondaryOnly: { type: 'number' }, unverified: { type: 'number' }, unreadable: { type: 'number' } },
      required: ['verified', 'secondaryOnly', 'unverified', 'unreadable'],
    },
    gapOutcomes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          outcome: { type: 'string', enum: ['answered', 'partial', 'nothing-found'] },
          summary: { type: 'string' },
        },
        required: ['title', 'outcome'],
      },
    },
    unreadableSources: {
      type: 'array',
      items: { type: 'object', properties: { url: { type: 'string' }, why: { type: 'string' } }, required: ['url', 'why'] },
    },
    notes: { type: 'string' },
  },
  required: ['id', 'dossierWritten', 'claims', 'gapOutcomes', 'unreadableSources'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    dossierExists: { type: 'boolean' },
    confirmed: { type: 'number' },
    corrected: { type: 'number' },
    unsupportedRemoved: { type: 'number' },
    notes: { type: 'string' },
  },
  required: ['id', 'dossierExists', 'confirmed', 'corrected', 'unsupportedRemoved'],
}

const INGEST_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    commit: { type: 'string' },
    pagesCreated: { type: 'array', items: { type: 'string' } },
    pagesTouched: { type: 'array', items: { type: 'string' } },
    pagesMarkedContradicted: { type: 'array', items: { type: 'string' } },
    problems: { type: 'string' },
  },
  required: ['id', 'commit'],
}

const TRIAGE_SCHEMA = {
  type: 'object',
  properties: {
    dispositions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          cluster: { type: 'string' },
          disposition: { type: 'string', enum: ['resolved-candidate', 'partial', 'still-open', 'needs-different-source'] },
          evidencePages: { type: 'array', items: { type: 'string' } },
          note: { type: 'string' },
        },
        required: ['title', 'cluster', 'disposition'],
      },
    },
    triagePage: { type: 'string' },
  },
  required: ['dispositions', 'triagePage'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fix'] },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: { category: { type: 'string' }, location: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } },
        required: ['category', 'problem', 'fix'],
      },
    },
  },
  required: ['verdict', 'issues'],
}

const CONSISTENCY_SCHEMA = {
  type: 'object',
  properties: {
    issuesFound: { type: 'number' },
    issuesFixed: { type: 'number' },
    remaining: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['issuesFound', 'issuesFixed', 'remaining'],
}

const PROSE_RULES = 'Prose contract (strict). Write narrative, full-sentence prose in a warm, readable teaching voice. Do not write in caveman or telegraphic style. Do not truncate, condense, or summarize into fragments. Explanations, background, use cases, pitfalls, and comparisons are written as full paragraphs that keep nuance and explain why, not only what. Bullet lists are acceptable only for genuinely list-shaped material such as a glossary or a link roundup. Explain every term the first time it appears, assuming a reader who has real Kubernetes operating experience but no deep knowledge of controllers, API machinery, or platform abstractions. Avoid these banned words entirely: anchored, unanchored, bounded, bounds, canonical, carveout, carveouts, gate/gates as a verb, genuinely, load-bearing, material, materially, shape/shapes as a vague noun (a banned word inside a wikilink slug is allowed). Do not invent facts: when sources disagree or a claim is uncertain, say so in the prose.'

function dossierPath(id) {
  return WIKI + '/raw/research-gap-' + id + '.md'
}

function researchPrompt(c) {
  const out = dossierPath(c.id)
  const gapBlock = c.gaps.length
    ? 'Gaps this cluster must try to settle (exact H2 titles in open-knowledge-gaps.md; entries may be open or already closed. Read each entry, including any Resolution paragraph and its "Not settled" remainder and any "Possible resolution" notes, and read the wiki pages they link, so you do not repeat what the wiki already says):\n- ' + c.gaps.join('\n- ')
    : 'This cluster has no fixed gap list; follow the focus above.'
  return 'You are doing a targeted evidence pass for a Kubernetes platform-engineering knowledge wiki at ' + WIKI + '. Cluster: ' + c.id + ' (' + c.group + ').\n\nFocus: ' + c.focus + '\n\n' + gapBlock + '\n\nTool notes: the built-in WebSearch tool is DISABLED; do not call it. First call ToolSearch with query "select:mcp__plugin_deep-research_deep-research-docsearch__web_search,mcp__plugin_deep-research_deep-research-docsearch__web_scrape" to load the search and scrape tools. Use web_search to discover URLs and web_scrape to read pages in full; WebFetch is a fallback for pages web_scrape cannot read. For GitHub material use the gh CLI through Bash (gh api repos/OWNER/REPO/releases, gh issue view, gh pr view, gh api repos/OWNER/REPO/contents/PATH) because it returns raw text, and read Go source files directly when a claim is about behavior. Your own memory of versions and dates may be out of date: every version, date, default, and number must come from a page you read in this run. If a page cannot be read (empty scrape, domain refused, login wall, permission denied), record it as UNREADABLE with the URL and the reason, do not try to bypass a block (no proxies, mirrors, or archive services unless the tool permits them), and move on.\n\nEvidence rules (strict):\n1. Prefer primary sources: official docs at a stated version, release notes, KEPs, design docs, source files, GitHub issues and PRs, the project or organization\'s own write-up. Raw text beats digests.\n2. Every claim gets a status: VERIFIED (read in a primary source, with URL), SECONDARY-ONLY (reported by someone else), UNVERIFIED (could not confirm), or UNREADABLE (source exists but could not be read). Never promote a claim by guessing. If a search finds nothing, write "searched X, Y, Z; found nothing".\n3. For each claim record the exact URL, the version or date of the source, and a short verbatim quote of at most 25 words. Do not paste long passages.\n4. For evidence-only gaps (conflict policy, framework choice, polarity) present the options and the sources on each side and do not recommend; the user decides.\n\nWrite exactly one file with the Write tool at ' + out + ' (under 60 KB). Structure: H1 "Research dossier: gap cluster ' + c.id + '"; a line with the research date ' + TODAY + '; "## Overview" (2 to 4 paragraphs in your own words); then one "## Gap: <exact gap title>" section per gap (or one "## Finding: <topic>" section per topic for a cluster with no gap list) containing your findings as paragraphs plus a "Claims" list where each item is: claim, status, URL, version or date, quote; then "## Unreadable sources" (URL and reason) and "## Not found". Do not edit any other file and do not run git commands.\n\nReturn the structured result: whether the dossier was written, claim counts by status, an outcome per gap (answered, partial, or nothing-found) with a one-sentence summary, the unreadable sources, and brief notes.'
}

function verifyPrompt(c) {
  const out = dossierPath(c.id)
  return 'Adversarially verify the research dossier at ' + out + ' for a Kubernetes knowledge wiki. If the file does not exist, report dossierExists false and stop; do not create it. Your job is to REFUTE, not to confirm: assume the researcher may have misread a page, mixed up versions, or filled a gap from memory.\n\nTool notes: WebSearch is DISABLED. Load search and scrape tools by calling ToolSearch with query "select:mcp__plugin_deep-research_deep-research-docsearch__web_search,mcp__plugin_deep-research_deep-research-docsearch__web_scrape". Use WebFetch as a fallback and the gh CLI through Bash for GitHub to get raw text. Do not try to bypass a block; if a page cannot be read, leave the claim as is and note it.\n\nMethod: pick every claim marked VERIFIED that states a number, default, version, date, release stage, field or flag name, or mechanism, plus at least ten other claims, and re-fetch the cited URL yourself. Check that the quote exists and supports the claim as worded, and that the stated version or date matches. Then: CONFIRMED if reproduced; CORRECTED if the page says something different (edit the dossier in place and note "[corrected in verification: ...]"); UNSUPPORTED if you cannot reproduce it or the URL does not say it (delete the claim and add one line to a final "## Removed in verification" section). Downgrade VERIFIED to SECONDARY-ONLY or UNVERIFIED when the source was not primary. Edit only ' + out + '; no other files, no git commands. Return counts and brief notes.'
}

function ingestPrompt(c) {
  const out = dossierPath(c.id)
  return 'Ingest one source into the sticki-wiki at ' + WIKI + '. Invoke the Skill tool with skill "sticki-wiki:sticki-ingest" and follow it exactly, with the source file ' + out + '. If that file does not exist, make no changes and report the problem; never invent a dossier. Treat this verified research dossier as ONE markdown source. Notes:\n- It is already in raw/. Compute its hash and use its filename slug as the source id. Do not refuse on size; it is under 60 KB.\n- Only claims marked VERIFIED, or SECONDARY-ONLY with clear attribution, may enter wiki pages as fact. UNVERIFIED and UNREADABLE claims may appear only as open questions.\n- This is a TARGETED pass over existing pages. Find the existing concept, entity, example, finding, comparison and decision pages the dossier bears on and update them. Where the dossier CORRECTS a claim the wiki already makes (a default, version, stage, number, mechanism), fix the page and mark any page that stated the old claim as fact status contradicted with a ## Contradictions block quoting both, or update it and keep a one-line correction note. Promote well-sourced draft pages to active.\n- Create examples/ pages for each named incident or adopter and findings/ pages for each confirmed pitfall or mechanism, with real names, dates and URLs. Create decisions/ pages only for genuine architecture decision points, presented as options with evidence and NO recommendation for evidence-only gaps.\n- For each of these gaps add a "Possible resolution from [[sources/<this source slug>]]" note stating plainly what the dossier settled or did not: ' + (c.gaps.length ? c.gaps.join('; ') : '(none; this cluster re-checks unverified claims, so update the pages that held those claims and correct or re-caveat them)') + '. For an OPEN gap add the note under its entry in open-knowledge-gaps.md; for a CLOSED gap leave the closed entry untouched and instead update the wiki pages and append a todo. NEVER close a gap and never edit irrefutable-facts.md or purpose.md.\n- Do NOT edit outputs/. If the new evidence affects a tutorial passage, append one open todo to todo.md naming the output file, the passage, and the wiki page that should be cited; a later phase revises the outputs.\n- Fan out sticki-page-writer subagents only if the touch budget exceeds about 8 pages; otherwise draft inline. Follow the markdown hygiene rule and frontmatter contract in ' + WIKI + '/CLAUDE.md and write pages in clear full sentences.\n- Complete the whole procedure including index.md, log.md, .sticki/events.jsonl, .sticki/state.json, and the git commit "ingest: <title> (seq N)", staging only this ingest\'s paths. Ingests run one at a time. Never use --no-verify.\nReturn the commit short SHA, pages created, pages touched, pages marked contradicted, and any problems.'
}

// ---------- Phase 1: research then verify ----------
phase('Research')
log('Research and verify chains: ' + CLUSTERS.length + ' clusters')
const chains = await pipeline(
  CLUSTERS,
  c => agent(researchPrompt(c), { label: 'research:' + c.id, phase: 'Research', schema: RESEARCH_SCHEMA, agentType: 'general-purpose' }),
  (research, c) =>
    agent(verifyPrompt(c), { label: 'verify:' + c.id, phase: 'Research', schema: VERIFY_SCHEMA, agentType: 'general-purpose' })
      .then(v => ({ cluster: c, research, verify: v })),
)
const ready = chains.filter(Boolean).filter(x => x.verify && x.verify.dossierExists)
const failed = CLUSTERS.filter(c => !ready.find(x => x.cluster.id === c.id))
if (failed.length) log('WARNING: no verified dossier for: ' + failed.map(c => c.id).join(', '))
const unreadable = ready.flatMap(x => (x.research && x.research.unreadableSources ? x.research.unreadableSources.map(u => ({ cluster: x.cluster.id, url: u.url, why: u.why })) : []))
log('Verified dossiers: ' + ready.length + '/' + CLUSTERS.length + '; confirmed ' + ready.reduce((n, x) => n + x.verify.confirmed, 0) + ', corrected ' + ready.reduce((n, x) => n + x.verify.corrected, 0) + ', removed ' + ready.reduce((n, x) => n + x.verify.unsupportedRemoved, 0) + '; unreadable sources ' + unreadable.length)

// ---------- Phase 2: serial ingest ----------
phase('Ingest')
const ingested = []
for (const x of ready) {
  const res = await agent(ingestPrompt(x.cluster), { label: 'ingest:' + x.cluster.id, phase: 'Ingest', schema: INGEST_SCHEMA, agentType: 'general-purpose' })
  if (res) ingested.push(res)
  else log('WARNING: ingest failed or skipped for ' + x.cluster.id)
}
log('Ingest complete: ' + ingested.length + '/' + ready.length + ' dossiers committed')

// ---------- Phase 3: triage ----------
phase('Triage')
const targeted = CLUSTERS.filter(c => c.id.startsWith('m')).flatMap(c => c.gaps.map(g => ({ title: g, cluster: c.id })))
const triage = await agent(
  'Triage the mechanics and accuracy pass for the sticki-wiki at ' + WIKI + '. Read CLAUDE.md and open-knowledge-gaps.md, the dossiers raw/research-gap-b1-*.md and raw/research-gap-m*.md, and the wiki pages changed since commit ' + BASE_SHA + ' (git diff --name-only ' + BASE_SHA + '..HEAD; git log --oneline ' + BASE_SHA + '..HEAD).\n\nFor each of these ' + targeted.length + ' mechanics gaps decide a disposition: resolved-candidate (the evidence answers it well enough that the user could close it), partial (progress with a named remainder), still-open (nothing found), or needs-different-source (the answer exists but only in material the tools could not read, such as video, login-walled or blocked pages). Give evidence pages and a one-sentence note. You must NOT close any gap or edit open-knowledge-gaps.md; only the user closes gaps.\nGaps: ' + JSON.stringify(targeted) + '\n\nWrite one wiki page at ' + WIKI + '/findings/mechanics-and-accuracy-pass-gap-dispositions.md with frontmatter type overview, status active, created and updated ' + TODAY + ', tags including triage, an H1, then: (1) the disposition table (columns: gap, cluster, disposition, evidence pages, note); (2) a section "Accuracy recheck outcomes" listing, for the b1 clusters, each item rechecked and whether the wiki page was corrected, confirmed, or left caveated; (3) a section "Needs manual fetch" as a table of unreadable sources (cluster, URL, reason) built from this list: ' + JSON.stringify(unreadable) + ' so the user can save the pages or transcripts into raw/; (4) two or three paragraphs of prose on what changed, what could not be found, and which gaps the user is best placed to close next. Edit nothing else. Return the structured result.',
  { label: 'triage', phase: 'Triage', schema: TRIAGE_SCHEMA, agentType: 'general-purpose' },
)
log('Triage: ' + (triage ? triage.dispositions.length : 0) + ' gap dispositions')

// ---------- Phase 4: revise all seven tutorials ----------
phase('Revise')
const revised = await pipeline(
  OUTPUT_SLUGS,
  slug =>
    agent(
      'Revise the tutorial ' + WIKI + '/outputs/' + slug + '.md in place using all evidence added since the last revision. Inputs: (a) every open todo in ' + WIKI + '/todo.md that names this output file or its passages (the earlier unreached revisions and the ones the ingests appended, including the Skyscanner, Reddit and Spotify primary postmortems for Part 1 and Part 5 section 10); (b) the wiki pages changed since commit ' + BASE_SHA + ' (git diff --name-only ' + BASE_SHA + '..HEAD) that bear on the document; (c) ' + WIKI + '/findings/mechanics-and-accuracy-pass-gap-dispositions.md and ' + WIKI + '/findings/evidence-and-fact-check-pass-gap-dispositions.md.\n\nEdit only the passages the evidence changes: correct versions, defaults, stages and numbers; replace hedges about unverified or unread material with the verified fact where the wiki now supports it; add real named incidents and adopters (organization, date, mechanism, outcome) where the document said none were found, citing the wiki page with a [[wikilink]]; use the new mechanics findings (finalizer names, ownership and tracking, kstatus and condition polarity, SSA behavior, informer and cache options, admission and CEL limits, operator framework criteria) to deepen explanations where the document was thin. Where evidence is still thin keep the honest hedge. Keep every existing section, the structure and the metadata header, and update the As of date to ' + TODAY + '. Expand text rather than compress it.\n\n' + PROSE_RULES + '\n\nEdit only this one file; no git commands. Return a one-line summary of what changed.',
      { label: 'revise:' + slug, phase: 'Revise', agentType: 'general-purpose' },
    ),
  (_r, slug) =>
    agent(
      'Review the revised document ' + WIKI + '/outputs/' + slug + '.md adversarially. Read it fully, then check: (1) prose contract: ' + PROSE_RULES + ' Flag telegraphic fragments, bullets standing in for explanation, and banned words; (2) the passages changed in this pass (git diff ' + BASE_SHA + '..HEAD -- outputs/' + slug + '.md and the working tree): each new or corrected fact must be supported by the wiki page it cites, so open at least six of those pages and check; (3) no section was dropped and the frontmatter, single H1 and <br> metadata header are intact; (4) every wikilink resolves to a real file under ' + WIKI + '. Do not edit any file. Return verdict pass only when nothing needs fixing; otherwise fix with specific issues, each with location, problem and exact fix.',
      { label: 'review:' + slug, phase: 'Revise', schema: REVIEW_SCHEMA, agentType: 'general-purpose' },
    ),
  (review, slug) =>
    review && review.verdict === 'fix' && review.issues.length
      ? agent(
          'Apply review fixes to ' + WIKI + '/outputs/' + slug + '.md. Read the file, then fix each issue by editing in place, keeping the narrative full-sentence style (expand, never compress). Issues: ' + JSON.stringify(review.issues) + '. ' + PROSE_RULES + ' Edit only this file; no git commands. Return a one-line summary.',
          { label: 'fix:' + slug, phase: 'Revise', agentType: 'general-purpose' },
        ).then(() => ({ slug: slug, fixed: review.issues.length }))
      : { slug: slug, fixed: 0 },
)
log('Revise complete: ' + revised.filter(Boolean).length + '/' + OUTPUT_SLUGS.length + ' outputs')

// ---------- Phase 5: cross-document consistency (sequential, both edit outputs) ----------
phase('Consistency')
const consistency = await agent(
  'Check the seven tutorials in ' + WIKI + '/outputs/ for cross-document consistency and fix problems in place. Read all seven (' + OUTPUT_SLUGS.join(', ') + ') in full. Find places where two documents state different versions, defaults, numbers, stages (alpha, beta, GA), field or flag names, tool behaviors, or definitions of the same term (for example the Flux interval wording, the Crossplane v2 claims status, managementPolicies stage, Argo CD default interval, finalizer names, condition polarity), where one part contradicts another about what was found or unread, and where a term is used in an earlier part before it is explained in a later one. Resolve each by checking the wiki page that holds the verified fact, then edit the affected document(s). Keep the narrative full-sentence style; expand, never compress. ' + PROSE_RULES + ' Edit only files under outputs/; no git commands. Return counts of issues found and fixed and any that remain.',
  { label: 'consistency', phase: 'Consistency', schema: CONSISTENCY_SCHEMA, agentType: 'general-purpose' },
)
const links = await agent(
  'Check every wikilink and citation in the seven tutorials in ' + WIKI + '/outputs/ (' + OUTPUT_SLUGS.join(', ') + '). Write a small Python script to /tmp/linkcheck_outputs.py (stdlib only) that extracts every [[target]] (strip any |alias and #anchor), and reports targets with no matching file under ' + WIKI + ' (target + ".md", or the exact path). Run it with python3 -I. Fix each dangling link by pointing it at the correct existing page (search the wiki for the intended page) or, if no page exists, rewrite the sentence to state the claim without a link. Also confirm each document still has frontmatter, one H1, and a metadata header with <br> line endings. Edit only files under outputs/; no git commands. Return counts found and fixed and any that remain.',
  { label: 'linkcheck', phase: 'Consistency', schema: CONSISTENCY_SCHEMA, agentType: 'general-purpose' },
)

// ---------- Phase 6: finalize ----------
phase('Finalize')
const final = await agent(
  'Finalize the mechanics and accuracy pass for the sticki-wiki at ' + WIKI + '.\n1. Read CLAUDE.md. Make sure index.md lists every page under concepts/, entities/, sources/, examples/, comparisons/, decisions/, findings/ and outputs/ (use ls to verify; fix drift), including findings/mechanics-and-accuracy-pass-gap-dispositions.md.\n2. Append one log.md entry "## [' + TODAY + '] outputs | mechanics and accuracy pass" listing dossiers ingested, pages created, outputs revised, consistency fixes, and gap disposition counts.\n3. Update todo.md: mark the output-revision todos that the Revise phase handled as done with an outcome (check each against the diff of the output it names); mark "Batch 1 (P0 to P2): run the mechanics-and-accuracy-pass workflow" done with an outcome; mark "Review claims still UNVERIFIED after the evidence pass", "Recheck release-candidate and unread items noted in the closed-gap resolutions", "Finish the outputs the Revise phase did not reach" and "Update part-5 and part-1 evidence notes with the Skyscanner and Reddit primary postmortems" done or leave open with a precise reason; add open todos for follow-ups (resolved-candidate gaps the user can close with sticki-gaps, sources the user must fetch manually, unrevised outputs). Rebuild the Index of open todos so it lists exactly the open entries.\n4. Invoke the Skill tool with skill "sticki-wiki:sticki-lint" and apply only the safe automatic transitions; do not change irrefutable-facts.md or purpose.md and do not close any gap. Record a one-paragraph lint summary in log.md.\n5. Append a .sticki/events.jsonl line with op "lint" and bump .sticki/state.json revision (read the last seq first).\n6. Stage explicit paths only (raw sources concepts entities examples comparisons decisions findings outputs index.md log.md todo.md open-knowledge-gaps.md .sticki workflows .gitignore) and commit with message "outputs: mechanics and accuracy pass (seq N)". No remote, no push, no --no-verify.\nReturn: commit SHA, page counts by folder, lint findings left for the user, and any problems.',
  { label: 'finalize', phase: 'Finalize', agentType: 'general-purpose' },
)

return {
  clusters: CLUSTERS.length,
  verifiedDossiers: ready.length,
  claims: ready.map(x => ({ id: x.cluster.id, research: x.research && x.research.claims, verify: { confirmed: x.verify.confirmed, corrected: x.verify.corrected, removed: x.verify.unsupportedRemoved } })),
  ingestsCommitted: ingested.length,
  failedClusters: failed.map(c => c.id),
  unreadableSources: unreadable,
  dispositions: triage ? triage.dispositions.reduce((acc, d) => { acc[d.disposition] = (acc[d.disposition] || 0) + 1; return acc }, {}) : null,
  outputsRevised: revised.filter(Boolean),
  consistency: consistency,
  links: links,
  finalize: final,
}
