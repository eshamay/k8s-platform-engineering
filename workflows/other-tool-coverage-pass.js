export const meta = {
  name: 'other-tool-coverage-pass',
  description: 'Batch 2: research nine clusters of other-tool coverage gaps and residual partials (Argo CD vs Flux, Config Connector, kro, Kratix, Radius, KRM functions, Crossplane residuals), verify, ingest serially, triage, revise all seven tutorials, check cross-document consistency',
  phases: [
    { title: 'Research', detail: 'research then adversarially verify, one chain per cluster (9 clusters)' },
    { title: 'Ingest', detail: 'serial sticki-ingest of each verified dossier, one commit each' },
    { title: 'Triage', detail: 'gap dispositions, affected outputs, and the manual-fetch list' },
    { title: 'Revise', detail: 'revise, adversarially review and fix each of the seven tutorials' },
    { title: 'Consistency', detail: 'cross-document consistency and link check over all outputs' },
    { title: 'Finalize', detail: 'index, log, todo, lint, final commit' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = (args && args.today) || '2026-11-26'
const BASE_SHA = (args && args.baseSha) || 'e744fc0'

const OUTPUT_SLUGS = [
  'part-1-core-architectural-principles',
  'part-2-krm-and-api-machinery',
  'part-3-controller-and-operator-mechanics',
  'part-4-platform-abstractions',
  'part-5-platform-architecture-principles-and-operating-at-scale',
  'flux-ramp-up',
  'crossplane-ramp-up',
]

// P3 = other-tool coverage gaps, P3b = residual partial gaps. Gap titles are exact H2 titles in open-knowledge-gaps.md
// (open or closed; closed entries carry a Resolution with a "Not settled" remainder to re-check).
const CLUSTERS = [
  {
    id: 'o1-argocd-flux-gitops', group: 'other tools (P3)',
    focus: 'Argo CD versus Flux and GitOps agent design: a head-to-head of behavior that both tools document (sync and health model, drift handling, pruning, multi-tenancy, notifications, UI and CLI, release cadence), with primary sources and named adopter write-ups on each side; Argo CD multi-cluster hub-and-spoke topologies and ApplicationSets generators (cluster, git, matrix, pull-request, progressive sync) with their documented limits; how GitOps agents handle secrets (SOPS, sealed-secrets, external-secrets, Vault plugins, ksops) and the documented tradeoffs; Git versus OCI artifacts as the source of truth (Flux OCIRepository, Argo CD OCI support, what each documents about provenance, signing and rate limits); adoption, observe-only and ignore-differences controls in both tools.',
    gaps: ['Argo CD versus Flux head-to-head behavior', 'Argo CD multi-cluster hub-and-spoke and ApplicationSets', 'Secret management in GitOps agents', 'Git versus OCI as the canonical GitOps source', 'Adoption, observe-only, and ignore-differences controls'],
  },
  {
    id: 'o2-flux-internals', group: 'other tools (P3)',
    focus: 'Flux internals and edges: source-controller internals (artifact storage and serving, the in-pod file server, what happens to artifact serving under leader election and during restarts); Flux sharding in production (the sharding.fluxcd.io/key label, the HelmChart labeling rule, any named adopter); Flux image automation API status (ImageRepository, ImagePolicy, ImageUpdateAutomation: API version, maturity, and safe promotion policy guidance); how Flux handles composite resources produced by Crossplane and instances produced by kro (health checks, kstatus, dependsOn, prune interaction). Read fluxcd.io docs, the fluxcd GitHub repos, and release notes.',
    gaps: ['Flux source-controller internals and artifact serving under leader election', 'Flux sharding in production and the HelmChart labeling rule', 'Flux image automation API status and safe promotion policy', 'Flux handling of composite resources and kro instances'],
  },
  {
    id: 'o3-gitops-provider-managed', group: 'other tools (P3)',
    focus: 'GitOps agents meeting provider-managed resources: how Config Connector and ACK behave under Flux and Argo CD (health assessment, drift, deletion, pruning, finalizers, sync waves, ownership of status and spec defaults); how Flux and Argo CD handle provider-managed resources in general (Crossplane managed resources, ACK resources, Config Connector resources, CAPI objects); how Config Connector and ACK behave when wrapped inside Crossplane compositions or kro graphs; and named GitOps adopters and GitOps-caused outages with organization, date, mechanism and outcome from first-party write-ups.',
    gaps: ['Config Connector and ACK behavior under a GitOps agent', 'Flux and Argo CD handling of provider-managed resources', 'Config Connector and ACK behavior when wrapped by compositions', 'Named GitOps adopters and GitOps-caused outages'],
  },
  {
    id: 'o4-config-connector-ack', group: 'other tools (P3)',
    focus: 'Config Connector and ACK in depth: Config Connector namespaced versus cluster mode, the deletion-policy annotation and what each setting does; a direct, evidence-based comparison of Config Connector and Crossplane (architecture, scope, resource model, drift behavior, cost of ownership) using the vendors\' own docs and neutral write-ups; direct reads of the failure modes of Argo CD, Flux, ACK and Config Connector from their docs, source and issue trackers; and first-party pitfall and incident evidence for kro, Config Connector, ACK and Cluster API (maintainer-written issues, release notes about regressions, official troubleshooting pages).',
    gaps: ['Config Connector namespaced versus cluster mode and deletion policies', 'Direct comparison of Config Connector and Crossplane', 'Direct reads of Argo CD, Flux, ACK, and Config Connector failure modes', 'First-party pitfall and incident evidence for kro, Config Connector, ACK, and Cluster API'],
  },
  {
    id: 'o5-kro-ecosystem', group: 'other tools (P3)',
    focus: 'kro and its ecosystem: kro governance and project status (CNCF or SIG status, who maintains it, the roadmap and the future of the Graph API or ResourceGraphDefinition API); scaling limits of per-RGD kro controllers and named production kro adopters; feature parity between function-kro (the Crossplane function) and standalone kro; community direction for the Kubernetes-as-a-kernel distribution model (kcp, vcluster, k0s-like minimal distributions, API-server-only deployments) with primary sources such as project docs, KubeCon talks with transcripts, and KEPs.',
    gaps: ['kro governance status and the future of the Graph API', 'Scaling limits of per-RGD kro controllers and named production kro adopters', 'Feature parity of function-kro with standalone kro', 'Community direction for the Kubernetes-as-a-kernel distribution model'],
  },
  {
    id: 'o6-platform-landscape', group: 'other tools (P3)',
    focus: 'The wider platform-orchestration landscape: primary-source status of Radius and Score (governance, maturity level, release history, what each actually does); Kratix Destination and GitStateStore mechanics (how Promises, Destinations and state stores work, per Kratix docs and source); Backstage and the operator pattern (the Kubernetes plugin, Scaffolder, any operator-style integrations, read from Backstage docs and community plugin sources); neutral comparisons of Crossplane with Terraform and with single-cloud operators (independent analyses, not vendor marketing; mark vendor claims); maintenance status of tofu-controller and the Terraform Operator (last release, commit activity, archived or deprecated state, maintainers, with dates).',
    gaps: ['Primary-source status of Radius and Score', 'Kratix Destination and GitStateStore mechanics', 'Backstage and the operator pattern', 'Neutral comparisons of Crossplane with Terraform and single-cloud operators', 'Maintenance status of tofu-controller and Terraform Operator'],
  },
  {
    id: 'o7-krm-functions', group: 'other tools (P3)',
    focus: 'KRM functions and Crossplane function runners: the KRM Functions specification (the functions spec in kubernetes-sigs/kustomize, kpt functions, ResourceList input and output, exec and container runtime requirements, how it differs from Crossplane composition functions with their gRPC RunFunction interface); the history and architecture of the Crossplane function runner (how functions run as packages and pods, the move away from patch-and-transform and from in-core composition, function revision handling), read from Crossplane docs, design documents and release notes.',
    gaps: ['KRM function specification and runtime requirements', 'Crossplane function runner architecture history'],
  },
  {
    id: 'o8-crossplane-residuals', group: 'residuals (P3b)',
    focus: 'Residual Crossplane questions: current Crossplane v2 scaling guidance (any official numbers, flags, performance notes, or maintainer statements; the crossplane/docs repo and release notes); the Upjet runtime execution model and cost (how Terraform provider code runs inside Upjet providers, per-resource process or in-process model, memory and CPU data in docs or issues); Crossplane package dependency resolution, revision activation and upgrade policy (Package, Configuration, Provider, Function lock file, automatic versus manual activation, dependency constraints); and how kro status and Crossplane v2 status propagate when a kro-style resource graph feeds a Crossplane composite.',
    gaps: ['Current Crossplane v2 scaling guidance', 'Upjet runtime execution model and cost', 'Crossplane package dependency resolution, revision activation, and upgrade policy', 'kro status schema and Crossplane v2 status propagation'],
  },
  {
    id: 'o9-cadence-and-staleness', group: 'residuals (P3b)',
    focus: 'Residual cadence and staleness questions: Config Connector reconcile interval and drift cadence (documented defaults, the per-kind controller type, direct versus Terraform-based versus DCL-based controllers and how each polls), which Config Connector resource kinds use which controller kind; and Kubernetes v1.36 staleness mitigation (the exact metric names exposed for the ReplicaSet, StatefulSet and other controllers, KEP 5647 and its status, whether a MonitorInformerStaleness gate exists in released source).',
    gaps: ['Config Connector controller kind per resource', 'Config Connector reconcile interval and drift cadence', 'Kubernetes v1.36 staleness mitigation mechanisms and metrics'],
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
  return 'Ingest one source into the sticki-wiki at ' + WIKI + '. Invoke the Skill tool with skill "sticki-wiki:sticki-ingest" and follow it exactly, with the source file ' + out + '. If that file does not exist, make no changes and report the problem; never invent a dossier. Treat this verified research dossier as ONE markdown source. Notes:\n- It is already in raw/. Compute its hash and use its filename slug as the source id. Do not refuse on size; it is under 60 KB.\n- Only claims marked VERIFIED, or SECONDARY-ONLY with clear attribution, may enter wiki pages as fact. UNVERIFIED and UNREADABLE claims may appear only as open questions.\n- This is a TARGETED pass over existing pages. Find the existing concept, entity, example, finding, comparison and decision pages the dossier bears on and update them. Where the dossier CORRECTS a claim the wiki already makes (a default, version, stage, number, mechanism), fix the page and mark any page that stated the old claim as fact status contradicted with a ## Contradictions block quoting both, or update it and keep a one-line correction note. Promote well-sourced draft pages to active.\n- Create examples/ pages for each named incident or adopter and findings/ pages for each confirmed pitfall or mechanism, with real names, dates and URLs. Create decisions/ pages only for genuine architecture decision points, presented as options with evidence and NO recommendation for evidence-only gaps.\n- For each of these gaps add a "Possible resolution from [[sources/<this source slug>]]" note stating plainly what the dossier settled or did not: ' + (c.gaps.length ? c.gaps.join('; ') : '(none; this cluster re-checks unverified claims, so update the pages that held those claims and correct or re-caveat them)') + '. For an OPEN gap add the note under its entry in open-knowledge-gaps.md; for a CLOSED gap leave the closed entry untouched and instead update the wiki pages and append a todo. NEVER close a gap and never edit irrefutable-facts.md or purpose.md.\n- Do NOT edit outputs/. If the new evidence affects a tutorial passage, append one open todo to todo.md naming the output file, the passage, and the wiki page that should be cited; a later phase revises the outputs.\n- Fan out sticki-page-writer subagents only if the touch budget exceeds about 8 pages; otherwise draft inline. Follow the markdown hygiene rule and frontmatter contract in ' + WIKI + '/CLAUDE.md and write pages in clear full sentences.\n- Before the commit, run python3 -I bin/gh_links.py --write from the wiki root so every [[wikilink]] you wrote becomes a relative markdown link that GitHub renders (it never touches raw/ or outputs/), then run python3 -I bin/gh_links.py --check and fix anything it reports; stage the files it changed that belong to this ingest. Complete the whole procedure including index.md, log.md, .sticki/events.jsonl, .sticki/state.json, and the git commit "ingest: <title> (seq N)", staging only this ingest\'s paths. Ingests run one at a time. Never use --no-verify.\nReturn the commit short SHA, pages created, pages touched, pages marked contradicted, and any problems.'
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
const targeted = CLUSTERS.flatMap(c => c.gaps.map(g => ({ title: g, cluster: c.id })))
const triage = await agent(
  'Triage the other-tool coverage pass for the sticki-wiki at ' + WIKI + '. Read CLAUDE.md and open-knowledge-gaps.md, the dossiers raw/research-gap-o*.md, and the wiki pages changed since commit ' + BASE_SHA + ' (git diff --name-only ' + BASE_SHA + '..HEAD; git log --oneline ' + BASE_SHA + '..HEAD).\n\nFor each of these ' + targeted.length + ' gaps decide a disposition: resolved-candidate (the evidence answers it well enough that the user could close it), partial (progress with a named remainder), still-open (nothing found), or needs-different-source (the answer exists but only in material the tools could not read, such as video, login-walled or blocked pages). Give evidence pages and a one-sentence note. You must NOT close any gap or edit open-knowledge-gaps.md; only the user closes gaps.\nGaps: ' + JSON.stringify(targeted) + '\n\nWrite one wiki page at ' + WIKI + '/findings/other-tool-coverage-pass-gap-dispositions.md with frontmatter type overview, status active, created and updated ' + TODAY + ', tags including triage, an H1, then: (1) the disposition table (columns: gap, cluster, disposition, evidence pages, note); (2) a section "Corrections made" listing each existing wiki claim the new dossiers corrected, confirmed, or left caveated, and each page marked contradicted; (3) a section "Needs manual fetch" as a table of unreadable sources (cluster, URL, reason) built from this list: ' + JSON.stringify(unreadable) + ' so the user can save the pages or transcripts into raw/; (4) two or three paragraphs of prose on what changed, what could not be found, and which gaps the user is best placed to close next. Edit nothing else. Return the structured result.',
  { label: 'triage', phase: 'Triage', schema: TRIAGE_SCHEMA, agentType: 'general-purpose' },
)
log('Triage: ' + (triage ? triage.dispositions.length : 0) + ' gap dispositions')

// ---------- Phase 4: revise all seven tutorials ----------
phase('Revise')
const revised = await pipeline(
  OUTPUT_SLUGS,
  slug =>
    agent(
      'Revise the tutorial ' + WIKI + '/outputs/' + slug + '.md in place using all evidence added since the last revision. Inputs: (a) every open todo in ' + WIKI + '/todo.md that names this output file or its passages (including the ones the ingests of this pass appended); (b) the wiki pages changed since commit ' + BASE_SHA + ' (git diff --name-only ' + BASE_SHA + '..HEAD) that bear on the document; (c) ' + WIKI + '/findings/other-tool-coverage-pass-gap-dispositions.md, ' + WIKI + '/findings/mechanics-and-accuracy-pass-gap-dispositions.md and ' + WIKI + '/findings/evidence-and-fact-check-pass-gap-dispositions.md.\n\nEdit only the passages the evidence changes: correct versions, defaults, stages and numbers; replace hedges about unverified or unread material with the verified fact where the wiki now supports it; add real named incidents and adopters (organization, date, mechanism, outcome) where the document said none were found, citing the wiki page with a [[wikilink]]; use the new other-tool findings (Argo CD versus Flux behavior, ApplicationSets and hub-and-spoke, secrets and OCI sources in GitOps, Flux internals and image automation, Config Connector and ACK under GitOps and compositions, kro governance and scale, Kratix, Radius, Score, Backstage, tofu-controller, KRM functions and the function runner, Crossplane package and scaling guidance) to deepen explanations and to add landscape comparisons where the document was thin; add named adopters and incidents with a [[wikilink]] only where the wiki holds the evidence. Where evidence is still thin keep the honest hedge. Keep every existing section, the structure and the metadata header, and update the As of date to ' + TODAY + '. Expand text rather than compress it.\n\n' + PROSE_RULES + '\n\nEdit only this one file; no git commands. Return a one-line summary of what changed.',
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
  'Finalize the other-tool coverage pass for the sticki-wiki at ' + WIKI + '.\n1. Read CLAUDE.md. Make sure index.md lists every page under concepts/, entities/, sources/, examples/, comparisons/, decisions/, findings/ and outputs/ (use ls to verify; fix drift), including findings/other-tool-coverage-pass-gap-dispositions.md.\n2. Append one log.md entry "## [' + TODAY + '] outputs | other-tool coverage pass" listing dossiers ingested, pages created, outputs revised, consistency fixes, and gap disposition counts.\n3. Update todo.md: mark the output-revision todos that the Revise phase handled as done with an outcome (check each against the diff of the output it names); mark "Batch 2 (P3): other-tool coverage research pass" and "Batch 2 (P3b): residual partial gaps from the targeted pass" done with an outcome (or leave open with a precise reason naming what remains); add open todos for follow-ups (resolved-candidate gaps the user can close with sticki-gaps, sources the user must fetch manually, unrevised outputs). Rebuild the Index of open todos so it lists exactly the open entries.\n4. Invoke the Skill tool with skill "sticki-wiki:sticki-lint" and apply only the safe automatic transitions; do not change irrefutable-facts.md or purpose.md and do not close any gap. Record a one-paragraph lint summary in log.md.\n5. Append a .sticki/events.jsonl line with op "lint" and bump .sticki/state.json revision (read the last seq first).\n6. First run python3 -I bin/gh_links.py --write from the wiki root so every [[wikilink]] you wrote becomes a relative markdown link that GitHub renders (it never touches raw/ or outputs/), then run python3 -I bin/gh_links.py --check and fix anything it reports; then stage explicit paths only (raw sources concepts entities examples comparisons decisions findings outputs index.md log.md todo.md open-knowledge-gaps.md .sticki workflows .gitignore) and commit with message "outputs: other-tool coverage pass (seq N)". No remote, no push, no --no-verify.\nReturn: commit SHA, page counts by folder, lint findings left for the user, and any problems.',
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
