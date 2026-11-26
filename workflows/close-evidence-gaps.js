const meta = {
  name: 'close-evidence-gaps',
  description: 'Targeted research pass for the missing-evidence and version-sensitive gap groups: research, adversarially verify, ingest serially, triage gaps, revise affected tutorials',
  phases: [
    { title: 'Research', detail: 'one research then verify chain per gap cluster (14 clusters)' },
    { title: 'Ingest', detail: 'serial sticki-ingest of each verified dossier, one commit each' },
    { title: 'Triage', detail: 'gap-disposition table and list of outputs affected by new evidence' },
    { title: 'Revise', detail: 'revise, adversarially review, and fix each affected tutorial' },
    { title: 'Finalize', detail: 'index, log, todo, lint, final commit' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = (args && args.today) || '2026-11-26'
const BASE_SHA = (args && args.baseSha) || '8b916eb'

const OUTPUT_SLUGS = [
  'part-1-core-architectural-principles',
  'part-2-krm-and-api-machinery',
  'part-3-controller-and-operator-mechanics',
  'part-4-platform-abstractions',
  'part-5-platform-architecture-principles-and-operating-at-scale',
  'flux-ramp-up',
  'crossplane-ramp-up',
]

// Group 3 = version-sensitive or unverified facts. Group 1 = missing real-world evidence.
const CLUSTERS = [
  {
    id: 'g3-crossplane-v2', group: 'version-sensitive facts',
    focus: 'Crossplane v2 (and current v1.x) behavior: claims and XRD scope, namespaced composites, managementPolicies and deletionPolicy, server-side apply and external writers, condition behavior and async Synced signaling, activation policies, Operations maturity and API stability, scaling guidance, deprecated-API scanners and v2 GVKs. Read docs.crossplane.io at the stated version, release notes, design docs, and GitHub issues and PRs.',
    gaps: ['Claim support and scope in Crossplane v2 XRDs', 'Crossplane v2 claims and the concepts pages', 'Crossplane v2 condition behavior and the fix for async Synced signaling', 'Crossplane v2 server-side apply behavior and external writers', 'Crossplane v2 namespaced composites and managementPolicies versus garbage collection', 'Current Crossplane v2 status of deletionPolicy and managementPolicies', 'managementPolicies feature status and the ObserveOnly-to-policy-list mapping', 'Crossplane Operations maturity and API stability', 'Managed resource activation policy mechanism and defaults', 'Current Crossplane v2 scaling guidance', 'Deprecated API scanners and Crossplane v2 GVKs'],
  },
  {
    id: 'g3-kro', group: 'version-sensitive facts',
    focus: 'kro: latest released version, ResourceGraphDefinition and Graph API status, dependency graph and readiness mechanics (readyWhen, includeWhen, forEach), instance status schema and conditions, controller tuning defaults in a RELEASED version, governance (SIG Cloud Provider subproject status) and roadmap. Read kro.run docs at the stated version, GitHub releases, issues and KEPs.',
    gaps: ['kro released-version tuning defaults and instance conditions', 'kro Graph API status and released-version facts', 'kro dependency graph and readiness mechanics', 'kro status schema and Crossplane v2 status propagation', 'kro governance status and the future of the Graph API'],
  },
  {
    id: 'g3-reconcile-defaults', group: 'version-sensitive facts',
    focus: 'Default reconcile and drift-detection intervals across tools and versions: Flux Kustomization and HelmRelease (docs disagree: 5 minutes vs 60-second minimum), Argo CD (timeout.reconciliation, default and changes across versions), Crossplane provider poll interval, ACK resync period, Config Connector reconcile and drift cadence, Cluster API. Cite the exact doc page or source file and version for every number.',
    gaps: ['Flux default reconcile interval and drift-detection wording', 'Argo CD default reconcile interval across versions', 'Reconcile defaults for Crossplane, ACK, and Cluster API', 'Config Connector reconcile interval and drift cadence'],
  },
  {
    id: 'g3-k8s-and-controller-runtime', group: 'version-sensitive facts',
    focus: 'Upstream Kubernetes and library facts: Kubernetes v1.36 staleness mitigation mechanisms and metrics, Mutating Admission Policy release stage, StorageVersionMigration GA details (v1.37 per the gap; verify what is actually released and state versions), and controller-runtime requeue and backoff behavior in the current release (Result.Requeue vs RequeueAfter, rate limiter defaults). Use kubernetes.io docs, KEPs, release notes, CHANGELOGs and the controller-runtime source and docs at a stated version.',
    gaps: ['Kubernetes v1.36 staleness mitigation mechanisms and metrics', 'Mutating Admission Policy release status', 'StorageVersionMigration GA details in Kubernetes v1.37', 'Requeue true backoff behavior in current controller-runtime'],
  },
  {
    id: 'g3-flux-ssa-helm', group: 'version-sensitive facts',
    focus: 'Flux server-side apply and Helm drift: the pre-dry-run manager takeover flag, override-manager behavior, current Flux SSA documentation, helm-controller driftDetection, Helm 4 server-side apply, version in which each landed. Read fluxcd.io docs, Flux release notes, and GitHub issues and discussions.',
    gaps: ['Flux pre-dry-run manager takeover flag and current SSA documentation'],
  },
  {
    id: 'g3-argocd-capi', group: 'version-sensitive facts',
    focus: 'Argo CD sharding algorithm maturity (legacy, round-robin, consistent-hashing) in current releases; Cluster API MachineHealthCheck current behavior, the Ready to Available condition change, and ClusterClass and managed topologies maturity. Read argo-cd.readthedocs.io, Argo CD release notes, cluster-api.sigs.k8s.io, Cluster API release notes and proposals.',
    gaps: ['Argo CD sharding algorithm maturity in current releases', 'Current Cluster API MachineHealthCheck behavior', 'Generic readiness when Cluster API moves from Ready to Available', 'ClusterClass maturity and the managed topologies proposal'],
  },
  {
    id: 'g3-scale-recheck', group: 'version-sensitive facts',
    focus: 'Recheck from RAW pages (not digests) every scale number the wiki quotes: SIG Scalability thresholds, Gardener scalability guidance (etcd, objects, nodes), Upbound per-CRD memory and OOM test, Argo CD processor counts and algorithm labels, Crossplane provider-family CRD and pod estimates, APF and KEP-1040 details, workqueue default limiter values. Read the wiki page findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking.md first, then confirm or correct each number against the source text, quoting the sentence.',
    gaps: ['Scale numbers from model digests need rechecking'],
  },
  {
    id: 'g1-outage-postmortems', group: 'real-world evidence',
    focus: 'Primary-source postmortems of control-plane and admission-webhook outages: the k8s.af entries behind the admission-webhook failure class (read the linked originals), the original OpenAI Kubernetes outage postmortem (not a commentary), and other 2024 to 2026 public postmortems involving Kubernetes control planes, webhooks, controllers or platform tooling. For each: organization, date, trigger, mechanism, mitigation, and URL of the primary write-up.',
    gaps: ['Control-plane-as-platform outage postmortems', 'Contents of the k8s.af admission webhook postmortems', 'Primary OpenAI Kubernetes outage postmortem', 'Recent 2024 to 2026 platform incident evidence'],
  },
  {
    id: 'g1-gitops-drift-incidents', group: 'real-world evidence',
    focus: 'Named GitOps adopters and GitOps-caused outages; production incidents caused by drift correction (for example Flux or Argo CD reverting autoscaler or manual changes, prune deleting resources); how often forced finalizer removal orphans guarded cloud resources (issues, blog posts, postmortems); named end-user case studies of convergence trouble. Use CNCF case studies, ADOPTERS files, conference talks, engineering blogs, and GitHub issues.',
    gaps: ['Named GitOps adopters and GitOps-caused outages', 'Production incidents from drift correction', 'How often forced finalizer removal orphans guarded resources', 'Named end-user case study of convergence trouble'],
  },
  {
    id: 'g1-operator-loop-failures', group: 'real-world evidence',
    focus: 'Operator and controller failures: named operator failure postmortems, runaway or hot reconcile loops, incidents from lost events or edge-triggered design, and named case studies of status problems (stale or missing observedGeneration, wrong Ready semantics). Use postmortems, GitHub issues with root-cause write-ups, and conference talks.',
    gaps: ['Named operator failure postmortems', 'Named postmortems of runaway reconcile loops', 'Incidents caused by lost events or edge-triggered design', 'Named case studies and postmortems for status problems'],
  },
  {
    id: 'g1-leaked-resources-adoption', group: 'real-world evidence',
    focus: 'Cloud-resource lifecycle failures: postmortems or issues about leaked or duplicated cloud resources from ambiguous creates (Crossplane external-name, Config Connector, ACK, Terraform controllers), and production outcomes of adopt-or-create versus explicit import. Use GitHub issues with analysis, provider docs, and blogs with concrete incidents.',
    gaps: ['Postmortems of leaked or duplicated cloud resources from ambiguous creates', 'Production outcomes of adopt-or-create versus explicit import'],
  },
  {
    id: 'g1-named-adopters', group: 'real-world evidence',
    focus: 'Named production adopters and their reported scale: Crossplane and Flux ADOPTERS files, CNCF case studies, KubeCon and FluxCon talks; named Flux sharding adopters and API Priority and Fairness incidents; kro named production adopters and scaling limits of per-RGD controllers. Record what each organization says it runs, the number reported, who reported it, and the date; mark self-reported figures.',
    gaps: ['Named production adopters of control-plane tools', 'Named Flux sharding adopters and API Priority and Fairness incidents', 'Scaling limits of per-RGD kro controllers and named production kro adopters'],
  },
  {
    id: 'g1-named-incident-reports', group: 'real-world evidence',
    focus: 'Primary incident reports and engineering write-ups from Skyscanner, Reddit, Jetstack, and Spotify about Kubernetes platform, GitOps, or control-plane incidents and lessons (for example Reddit Pi Day outage, Skyscanner posts on Kubernetes platform issues, Jetstack and Spotify write-ups). Read the originals, not summaries.',
    gaps: ['Primary incident reports for Skyscanner, Reddit, Jetstack, and Spotify'],
  },
  {
    id: 'g1-other-tool-pitfalls', group: 'real-world evidence',
    focus: 'First-party pitfall and incident evidence for kro, Config Connector, ACK, and Cluster API: issues, release-note breaking changes, upgrade problems, deletion and drift incidents, as described in their own GitHub issues, docs, or maintainer posts.',
    gaps: ['First-party pitfall and incident evidence for kro, Config Connector, ACK, and Cluster API'],
  },
]

const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    dossierWritten: { type: 'boolean' },
    claims: {
      type: 'object',
      properties: {
        verified: { type: 'number' },
        secondaryOnly: { type: 'number' },
        unverified: { type: 'number' },
      },
      required: ['verified', 'secondaryOnly', 'unverified'],
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
    notes: { type: 'string' },
  },
  required: ['id', 'dossierWritten', 'claims', 'gapOutcomes'],
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
          group: { type: 'string' },
          disposition: { type: 'string', enum: ['resolved-candidate', 'partial', 'still-open'] },
          evidencePages: { type: 'array', items: { type: 'string' } },
          note: { type: 'string' },
        },
        required: ['title', 'group', 'disposition'],
      },
    },
    affectedOutputs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          reasons: { type: 'array', items: { type: 'string' } },
        },
        required: ['slug', 'reasons'],
      },
    },
    triagePage: { type: 'string' },
  },
  required: ['dispositions', 'affectedOutputs', 'triagePage'],
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

const PROSE_RULES = 'Prose contract (strict). Write narrative, full-sentence prose in a warm, readable teaching voice. Do not write in caveman or telegraphic style. Do not truncate, condense, or summarize into fragments. Explanations, background, use cases, pitfalls, and comparisons are written as full paragraphs that keep nuance and explain why, not only what. Bullet lists are acceptable only for genuinely list-shaped material such as a glossary or a link roundup. Explain every term the first time it appears, assuming a reader who has real Kubernetes operating experience but no deep knowledge of controllers, API machinery, or platform abstractions. Avoid these banned words entirely: anchored, unanchored, bounded, bounds, canonical, carveout, carveouts, gate/gates as a verb, genuinely, load-bearing, material, materially, shape/shapes as a vague noun. Do not invent facts: when sources disagree or a claim is uncertain, say so in the prose.'

function dossierPath(id) {
  return WIKI + '/raw/research-gap-' + id + '.md'
}

function researchPrompt(c) {
  const out = dossierPath(c.id)
  return 'You are doing a targeted evidence pass for a Kubernetes platform-engineering knowledge wiki at ' + WIKI + '. Cluster: ' + c.id + ' (' + c.group + ').\n\nFocus: ' + c.focus + '\n\nGaps this cluster must try to settle (exact titles in open-knowledge-gaps.md; read those entries and their "Possible resolution" notes first, and read the wiki pages they link, so you do not repeat what the wiki already says):\n- ' + c.gaps.join('\n- ') + '\n\nTool notes: the built-in WebSearch tool is DISABLED; do not call it. First call ToolSearch with query "select:mcp__plugin_deep-research_deep-research-docsearch__web_search,mcp__plugin_deep-research_deep-research-docsearch__web_scrape" to load the search and scrape tools. Use web_search to discover URLs and web_scrape to read pages in full; use WebFetch as a fallback for pages web_scrape cannot read. For GitHub material use the gh CLI through Bash (for example gh api repos/OWNER/REPO/releases, gh issue view, gh api repos/OWNER/REPO/contents/PATH) because it returns raw text, not a digest. Your own memory of versions and dates may be out of date: every version, date, default, and number must come from a page you read in this run.\n\nEvidence rules (strict):\n1. Prefer primary sources: official docs at a stated version, release notes, KEPs, design docs, source files, GitHub issues and PRs, the organization\'s own postmortem or engineering blog. Raw text beats digests. If you could only read a summary or a secondary source, say so.\n2. Every claim you record gets a status: VERIFIED (read in a primary source, with URL), SECONDARY-ONLY (reported by someone else), or UNVERIFIED (could not confirm). Never promote a claim by guessing. If a search finds nothing, write "searched X, Y, Z; found nothing" instead of filling the gap.\n3. For each claim record: the exact URL, the version or date of the source, and a short verbatim quote of at most 25 words. Do not paste long passages.\n4. Real incidents and adopters need: organization, date, trigger, mechanism, mitigation or outcome, and who reported it (self-reported figures are labeled as such).\n\nWrite exactly one file with the Write tool at ' + out + ' (under 60 KB). Structure: H1 "Research dossier: gap cluster ' + c.id + '"; a line with the research date ' + TODAY + '; "## Overview" (2 to 4 paragraphs in your own words); then one "## Gap: <exact gap title>" section per gap above containing your findings as paragraphs plus a "Claims" list where each item is: claim, status, URL, version or date, quote; and finally "## Not found" listing what you searched for and could not find. Do not edit any other file and do not run git commands.\n\nReturn the structured result: whether the dossier was written, counts of claims by status, an outcome per gap (answered, partial, or nothing-found) with a one-sentence summary, and brief notes.'
}

function verifyPrompt(c) {
  const out = dossierPath(c.id)
  return 'Adversarially verify the research dossier at ' + out + ' for a Kubernetes knowledge wiki. If the file does not exist, report dossierExists false and stop; do not create it. Your job is to REFUTE, not to confirm: assume the researcher may have misread a page, mixed up versions, or filled a gap from memory.\n\nTool notes: WebSearch is DISABLED. Load search and scrape tools by calling ToolSearch with query "select:mcp__plugin_deep-research_deep-research-docsearch__web_search,mcp__plugin_deep-research_deep-research-docsearch__web_scrape". Use WebFetch as a fallback and the gh CLI through Bash for GitHub (gh api, gh issue view) to get raw text.\n\nMethod: pick every claim marked VERIFIED that states a number, default, version, date, release stage (alpha, beta, GA), named organization, or incident mechanism, plus at least ten other claims, and re-fetch the cited URL yourself. Check that the quote exists and supports the claim as worded, and that the stated version or date matches. Then: CONFIRMED if reproduced; CORRECTED if the page says something different (edit the dossier in place to the correct statement and note the change inline as "[corrected in verification: ...]"); UNSUPPORTED if you cannot reproduce it or the URL does not say it (delete the claim from the dossier and add one line to a final "## Removed in verification" section). Downgrade VERIFIED to SECONDARY-ONLY or UNVERIFIED when the source was not primary. Also fix any broken URLs you can resolve. Edit only ' + out + ' using Edit or Write; do not touch other files and do not run git commands. Return counts and brief notes.'
}

function ingestPrompt(c) {
  const out = dossierPath(c.id)
  return 'Ingest one source into the sticki-wiki at ' + WIKI + '. Invoke the Skill tool with skill "sticki-wiki:sticki-ingest" and follow it exactly, with the source file ' + out + '. If that file does not exist, make no changes and report the problem; never invent a dossier. Treat this verified research dossier as ONE markdown source. Notes:\n- It is already in raw/. Compute its hash and use its filename slug as the source id. Do not refuse on size; it is under 60 KB.\n- Only claims marked VERIFIED, or SECONDARY-ONLY with clear attribution, may enter wiki pages. Never write UNVERIFIED claims as fact; at most mention them as open questions.\n- This is a TARGETED pass over existing pages. Find the existing concept, entity, example, finding, comparison and decision pages the dossier bears on and update them. Where the dossier CORRECTS a claim the wiki already makes (a default, a version, a stage, a number), fix the page and, if the old claim was stated as fact elsewhere, mark the affected page status contradicted with a ## Contradictions block quoting both, or update it and keep a one-line correction note. Promote well-sourced draft pages to active.\n- Create examples/ pages for each named incident or adopter and findings/ pages for each confirmed pitfall or failure mechanism, each with real names, dates and URLs from the dossier. Create decisions/ pages only for genuine architecture decision points.\n- For each of these gaps, add a "Possible resolution from [[sources/<this source slug>]]" note under the gap entry stating plainly what the dossier settled or did not: ' + c.gaps.join('; ') + '. NEVER set a gap to closed and never edit irrefutable-facts.md or purpose.md. If the dossier answers a gap fully, say so in the note; the user closes gaps.\n- If the new evidence affects text in the tutorials under outputs/ (a version, default, stage, number, or a claim now corrected, or a gap now answerable with a real incident), do NOT edit outputs/. Instead append one open todo to todo.md naming the output file, the passage, and the new wiki page that should be cited.\n- Fan out sticki-page-writer subagents only if the touch budget exceeds about 8 pages; otherwise draft inline. Follow the markdown hygiene rule and frontmatter contract in ' + WIKI + '/CLAUDE.md, and write pages in clear full sentences.\n- Complete the whole procedure including index.md, log.md, .sticki/events.jsonl, .sticki/state.json, and the git commit "ingest: <title> (seq N)", staging only this ingest\'s paths (do not stage the untracked .obsidian/ directory). Ingests run one at a time. Never use --no-verify.\nReturn the commit short SHA, pages created, pages touched, pages marked contradicted, and any problems.'
}

// ---------- Phase 1: research then verify, one chain per cluster ----------
phase('Research')
log('Research and verify chains: ' + CLUSTERS.length + ' clusters (' + CLUSTERS.filter(c => c.group === 'version-sensitive facts').length + ' version-sensitive, ' + CLUSTERS.filter(c => c.group === 'real-world evidence').length + ' real-world evidence)')

const chains = await pipeline(
  CLUSTERS,
  c =>
    agent(researchPrompt(c), {
      label: 'research:' + c.id,
      phase: 'Research',
      schema: RESEARCH_SCHEMA,
      agentType: 'general-purpose',
    }),
  (research, c) =>
    agent(verifyPrompt(c), {
      label: 'verify:' + c.id,
      phase: 'Research',
      schema: VERIFY_SCHEMA,
      agentType: 'general-purpose',
    }).then(v => ({ cluster: c, research, verify: v })),
)

const ready = chains.filter(Boolean).filter(x => x.verify && x.verify.dossierExists)
const failed = CLUSTERS.filter(c => !ready.find(x => x.cluster.id === c.id))
if (failed.length) log('WARNING: no verified dossier for: ' + failed.map(c => c.id).join(', '))
log('Verified dossiers: ' + ready.length + '/' + CLUSTERS.length + '; claims confirmed ' + ready.reduce((n, x) => n + x.verify.confirmed, 0) + ', corrected ' + ready.reduce((n, x) => n + x.verify.corrected, 0) + ', removed as unsupported ' + ready.reduce((n, x) => n + x.verify.unsupportedRemoved, 0))

// ---------- Phase 2: serial ingest, one source one commit ----------
phase('Ingest')
const ingested = []
for (const x of ready) {
  const res = await agent(ingestPrompt(x.cluster), {
    label: 'ingest:' + x.cluster.id,
    phase: 'Ingest',
    schema: INGEST_SCHEMA,
    agentType: 'general-purpose',
  })
  if (res) ingested.push(res)
  else log('WARNING: ingest failed or skipped for ' + x.cluster.id)
}
log('Ingest complete: ' + ingested.length + '/' + ready.length + ' dossiers committed')

// ---------- Phase 3: triage ----------
phase('Triage')
const allGaps = CLUSTERS.flatMap(c => c.gaps.map(g => ({ title: g, group: c.group, cluster: c.id })))
const triage = await agent(
  'Triage the targeted evidence pass for the sticki-wiki at ' + WIKI + '. Read CLAUDE.md and open-knowledge-gaps.md, the research dossiers raw/research-gap-*.md, and the wiki pages changed since commit ' + BASE_SHA + ' (run git diff --name-only ' + BASE_SHA + '..HEAD and git log --oneline ' + BASE_SHA + '..HEAD).\n\nFor each of these ' + allGaps.length + ' targeted gaps decide a disposition: resolved-candidate (the evidence answers the gap well enough that the user could close it), partial (some progress, a named remainder), or still-open (nothing found or only unverified material). Give the evidence pages (wiki paths) and a one-sentence note stating what is settled and what remains. You must NOT close any gap or edit open-knowledge-gaps.md; only the user closes gaps.\nGaps: ' + JSON.stringify(allGaps) + '\n\nAlso decide which of the seven tutorials in outputs/ (' + OUTPUT_SLUGS.join(', ') + ') are affected by the new evidence: for each affected output list concrete reasons (a version, default, stage, number now corrected; a pitfall or section that can now cite a real named incident or adopter; a claim marked unverified that is now verified). Use the todo.md entries the ingests appended as input. Only include slugs from that list.\n\nWrite one wiki page at ' + WIKI + '/findings/evidence-and-fact-check-pass-gap-dispositions.md with frontmatter type overview, status active, created and updated ' + TODAY + ', tags including triage, then an H1, then the disposition table (columns: gap, group, disposition, evidence pages, note) followed by two or three paragraphs of prose summarizing what the pass changed, what it could not find, and which gaps the user is best placed to close next. Edit nothing else. Return the structured result with the page path in triagePage.',
  { label: 'triage', phase: 'Triage', schema: TRIAGE_SCHEMA, agentType: 'general-purpose' },
)
const affected = triage && triage.affectedOutputs ? triage.affectedOutputs.filter(a => OUTPUT_SLUGS.includes(a.slug)) : []
log('Triage: ' + (triage ? triage.dispositions.length : 0) + ' gap dispositions; ' + affected.length + ' outputs affected: ' + affected.map(a => a.slug).join(', '))

// ---------- Phase 4: revise affected outputs, review, fix ----------
phase('Revise')
const revised = await pipeline(
  affected,
  a =>
    agent(
      'Revise the tutorial ' + WIKI + '/outputs/' + a.slug + '.md in place using the new evidence from the targeted pass. Reasons this document is affected: ' + JSON.stringify(a.reasons) + '.\n\nFirst read the document, then the wiki pages changed since commit ' + BASE_SHA + ' (git diff --name-only ' + BASE_SHA + '..HEAD) that bear on those reasons, and ' + WIKI + '/findings/evidence-and-fact-check-pass-gap-dispositions.md. Edit only the passages the evidence changes: correct versions, defaults, stages and numbers; replace statements that were hedged as unverified with the verified fact where the wiki now supports it; add real named incidents and adopters (organization, date, mechanism, outcome) where the document previously said none were found, citing the new wiki page with a [[wikilink]]. Keep every existing section, the structure, and the metadata header (update the As of date to ' + TODAY + '). Where evidence is still thin, keep the honest hedge. Expand text rather than compress it.\n\n' + PROSE_RULES + '\n\nEdit only this one file; no git commands. Return a one-line summary of what changed.',
      { label: 'revise:' + a.slug, phase: 'Revise', agentType: 'general-purpose' },
    ),
  (_r, a) =>
    agent(
      'Review the revised document ' + WIKI + '/outputs/' + a.slug + '.md adversarially. Read it fully, then check: (1) prose contract: ' + PROSE_RULES + ' Flag telegraphic fragments, bullets standing in for explanation, and banned words (a banned word inside a wikilink slug is allowed); (2) the passages changed in this pass (compare with git diff ' + BASE_SHA + '..HEAD -- outputs/' + a.slug + '.md): each new or corrected fact must be supported by the wiki page it cites, so open those pages and check at least six of them; (3) no section was dropped and frontmatter, one H1, and the <br> metadata header are intact; (4) every wikilink resolves to a real file under ' + WIKI + '. Do not edit any file. Return verdict pass only when nothing needs fixing; otherwise fix with specific issues, each with location, problem, and exact fix.',
      { label: 'review:' + a.slug, phase: 'Revise', schema: REVIEW_SCHEMA, agentType: 'general-purpose' },
    ),
  (review, a) =>
    review && review.verdict === 'fix' && review.issues.length
      ? agent(
          'Apply review fixes to ' + WIKI + '/outputs/' + a.slug + '.md. Read the file, then fix each issue by editing in place, keeping the narrative full-sentence style (expand, never compress). Issues: ' + JSON.stringify(review.issues) + '. ' + PROSE_RULES + ' Edit only this file; no git commands. Return a one-line summary.',
          { label: 'fix:' + a.slug, phase: 'Revise', agentType: 'general-purpose' },
        ).then(() => ({ slug: a.slug, fixed: review.issues.length }))
      : { slug: a.slug, fixed: 0 },
)
log('Revise complete: ' + revised.filter(Boolean).length + '/' + affected.length + ' outputs')

// ---------- Phase 5: finalize ----------
phase('Finalize')
const final = await agent(
  'Finalize the targeted evidence pass for the sticki-wiki at ' + WIKI + '.\n1. Read CLAUDE.md. Make sure index.md lists every page under concepts/, entities/, sources/, examples/, comparisons/, decisions/, findings/ and outputs/ (use ls to verify; fix drift), including the new findings/evidence-and-fact-check-pass-gap-dispositions.md.\n2. Append one log.md entry "## [' + TODAY + '] outputs | evidence and fact-check pass" listing dossiers ingested, pages created, outputs revised, and gap dispositions counts.\n3. Update todo.md: mark the output-revision todos the ingests added as done where the Revise phase handled them; add open todos for follow-ups (gaps with disposition resolved-candidate that the user can close with sticki-gaps, claims still UNVERIFIED, outputs not revised).\n4. Invoke the Skill tool with skill "sticki-wiki:sticki-lint" and apply only the safe automatic transitions; do not change irrefutable-facts.md or purpose.md and do not close any gap. Record a one-paragraph lint summary in log.md.\n5. Append a .sticki/events.jsonl line with op "lint" and bump .sticki/state.json revision (read the last seq first).\n6. Stage explicit paths only (raw sources concepts entities examples comparisons decisions findings outputs index.md log.md todo.md open-knowledge-gaps.md .sticki workflows) and never the untracked .obsidian/ directory. Commit with message "outputs: evidence and fact-check pass (seq N)". No remote, no push, no --no-verify.\nReturn: commit SHA, page counts by folder, lint findings left for the user, and any problems.',
  { label: 'finalize', phase: 'Finalize', agentType: 'general-purpose' },
)

return {
  clusters: CLUSTERS.length,
  verifiedDossiers: ready.length,
  claims: ready.map(x => ({ id: x.cluster.id, research: x.research && x.research.claims, verify: { confirmed: x.verify.confirmed, corrected: x.verify.corrected, removed: x.verify.unsupportedRemoved } })),
  ingestsCommitted: ingested.length,
  failedClusters: failed.map(c => c.id),
  dispositions: triage ? triage.dispositions.reduce((acc, d) => { acc[d.disposition] = (acc[d.disposition] || 0) + 1; return acc }, {}) : null,
  outputsRevised: revised.filter(Boolean),
  finalize: final,
}
