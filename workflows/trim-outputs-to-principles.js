export const meta = {
  name: 'trim-outputs-to-principles',
  description: 'Trim each of the seven outputs down to principles, design and architecture: remove configuration values, versions, dates, release stages, resolved issues, commits and cross-product comparisons of configuration; verify; check consistency; commit one signed commit per document',
  phases: [
    { title: 'Scan', detail: 'two read-only scanners per document: configuration and version detail; resolved issues and implementation history' },
    { title: 'Edit', detail: 'one editor per document applies the removals and conceptual rewrites in place' },
    { title: 'Verify', detail: 'one adversarial verifier per document, with one more edit round when needed' },
    { title: 'Consistency', detail: 'cross-document leftovers, link check, residual-detail scan' },
    { title: 'Finalize', detail: 'strict build, log entry, one signed commit per output' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = (args && args.today) || '2026-11-27'

const OUTPUT_SLUGS = [
  'part-1-core-architectural-principles',
  'part-2-krm-and-api-machinery',
  'part-3-controller-and-operator-mechanics',
  'part-4-platform-abstractions',
  'part-5-platform-architecture-principles-and-operating-at-scale',
  'flux-ramp-up',
  'crossplane-ramp-up',
]

const PROSE_RULES = 'Prose contract (strict). Write narrative, full-sentence prose in a warm, readable teaching voice. Do not write in caveman or telegraphic style. Do not truncate, condense, or summarize into fragments. Explanations, background, use cases, pitfalls, and comparisons are written as full paragraphs that keep nuance and explain why, not only what. Bullet lists are acceptable only for genuinely list-shaped material such as a glossary or a link roundup. Explain every term the first time it appears, assuming a reader who has real Kubernetes operating experience but no deep knowledge of controllers, API machinery, or platform abstractions. Avoid these banned words entirely: anchored, unanchored, bounded, bounds, canonical, carveout, carveouts, gate/gates as a verb, genuinely, load-bearing, material, materially, shape/shapes as a vague noun (a banned word inside a wikilink slug is allowed). Do not invent facts: when sources disagree or a claim is uncertain, say so in the prose.'

const TIMELESS_RULES = 'Timeless-voice rule (strict, set by the reader). These are ramp-up documents. Readers do not care how the content evolved, only what it says. No sentence in the document, and none of your edits, may refer to the document, the wiki, or the research having been revised, corrected, updated, extended, re-checked or improved; to earlier or later drafts, versions or passes of the document; or to what the wiki "now" holds, "newly" found, "previously" said, "used to" say, "originally" said, "so far", or "at the time of this review". Forbidden example phrases: "earlier drafts", "firmer than before", "the wiki now holds", "was corrected", "has since been revised", "this pass", "as of the last review". Allowed: statements about the technology or the world that are time-dependent in themselves (for example "Crossplane v1 composites were cluster-scoped; v2 composites are namespaced", "alpha in v1.29, beta in v1.31", "as of Kubernetes v1.36", a dated incident). The test: if the sentence describes how a technology, project or event changed, keep it; if it describes how THIS DOCUMENT or THE WIKI changed or what the authors had or had not read earlier, remove or rewrite it. Evidence caveats are kept, but written as plain statements of what named sources show and do not show, for example "Crossplane\'s managed-resources documentation states no default poll interval" instead of "the wiki did not read the page" or "the default is now confirmed". Never write that a claim was verified, confirmed, rechecked or corrected; just state it, with its source.'

const TRIM_RULES = `Purpose of these documents (set by the reader). They ramp a reader up on the principles, design and architecture of Kubernetes platform engineering: the Kubernetes resource model, controllers and operators, and platforms such as Flux, Crossplane and kro. They are not meant to orient readers about specific, nuanced configuration differences between products. The reader is assumed to use the most recent version of every product discussed. The documents teach domain concepts; implementation specifics of a product appear only where a difference highlights a design choice that is substantive to understanding the domain.

REMOVE:
1. Specific configuration values and defaults: poll, sync, resync, retry and requeue intervals, timeouts, burst and worker counts, rate limits, cache sizes, replica counts, memory and CPU figures that are a tool's tuning outcome, and any comparison across products of such values. Names of command-line flags, Helm values, environment variables and controller knobs, together with their values and defaults.
2. Version numbers, release dates, release stages (alpha, beta, GA, deprecated, release candidate, unreleased) and statements about which release introduced, changed, fixed or removed something. Assume everything described is current.
3. Pull request, issue, KEP, commit and changelog references and discussion of them; bugs, regressions and issues that were resolved or are tracked upstream; "fixed in", "shipped in", "since v", "as of v", "first released in".
4. Comparison tables whose cells are configuration values (for example a table of reconcile cadences per tool). Keep tables that compare design, architecture, feature sets or trade-offs.
5. Incident and adopter stories that rest on one product's bug, release or regression. Keep incident and adopter stories that teach an architectural lesson (for example a reconciler faithfully applying a bad desired state, or a service-discovery design that let a service survive cluster loss).

KEEP:
- Principles, mechanisms, architecture, design trade-offs, feature sets, and comparisons of designs between products.
- Named API concepts and features the reader must understand (finalizers, owner references, server-side apply and field ownership, status conditions, composition functions, managementPolicies as a concept, and so on), stated without version, stage or default values.
- Architecturally meaningful scale reasoning: rounded, order-of-magnitude figures that show a structural limit (for example that a shared store is a single point of contention) when the figure is not a tool's tuning outcome.
- Year-level context inside incident stories that are kept; identifiers such as issue numbers, versions and flags inside them go.

WHEN REMOVING: if a removed passage carried a principle that the document does not state elsewhere, state that principle once in plain words with no values (for example: how often a controller re-checks the outside world is a trade-off between how quickly drift is noticed and how many calls are spent on the external API; each tool and provider picks its own cadence). Rewrite the surrounding sentences so the narrative still flows. Fix every reference to removed material ("as the table shows", "the next paragraph", "the figure above", "see section N for the exact default"). Drop wikilink citations that supported only removed text. Never delete or renumber an H2 section; if a section would lose most of its content, keep its conceptual core and expand that. Do not mention that anything was removed, simplified, updated or changed.

EXAMPLES OF TEXT TO REMOVE (from the reader):
(a) A paragraph such as: "First, Crossplane has no single poll interval. Core and the shared crossplane-runtime library default to one minute, but a provider generated with Upjet ... overrides it to ten minutes ... Second, Argo CD changed its default between major versions ... a v3 polling pass lands somewhere between two and three minutes, while v2 polled at a flat three. The change is attributed to pull request 22342, merged 2025-03-13 ..." (keep only the principle that cadence differs per component and trades drift latency against API cost).
(b) "The five-minute wording traces to a documentation commit on 2022-08-10 that replaced an earlier 'every one minute by default' with no stated reason ..."
(c) "The kustomize-controller flag --override-manager-before-dry-run, first shipped in kustomize-controller v1.10.0 and bundled in Flux v2.10.0, moves ownership before the dry run." (keep at most the design idea: which controller takes over field ownership before the dry run matters; no flag, no version.)
(d) "Version v1.14.0 (2023-11-01) shipped beta functions as long-running gRPC servers ... and it broke compatibility with the alpha functions. Functions reached v1 in v1.17.0 (2024-08-29)" (keep the design: composition functions are long-running gRPC servers the package manager deploys.)
(e) "reversed to positive in February 2020, and since June 2020 say neither can be recommended as a general rule"
(f) "while the code at release v1.162.0 (2026-11-23) ships UpdateFailed"
(g) "In Config Connector issue 16444, filed on 2026-11-25 and still open a day later, ..."
(h) "A runtime change merged on 2026-11-20 moves the status write to immediately after the create call, ..."
(i) "The runaway guard in v2 is the circuit breaker on composites (burst 100), and providers define their own flags, which should be checked separately"`

const SCAN_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    passages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          quote: { type: 'string' },
          disposition: { type: 'string', enum: ['delete', 'rewrite-to-principle', 'keep-design-point'] },
          kind: { type: 'string' },
          reason: { type: 'string' },
          replacement: { type: 'string' },
        },
        required: ['quote', 'disposition', 'reason'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['lens', 'passages'],
}

const EDIT_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    removed: { type: 'number' },
    rewritten: { type: 'number' },
    tablesRemoved: { type: 'number' },
    principlesRestated: { type: 'number' },
    judgmentCalls: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['slug', 'removed', 'rewritten', 'judgmentCalls'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fix'] },
    residualHits: { type: 'number' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: { quote: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } },
        required: ['quote', 'problem', 'fix'],
      },
    },
    notes: { type: 'string' },
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

const FINAL_SCHEMA = {
  type: 'object',
  properties: {
    commits: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, sha: { type: 'string' } }, required: ['file', 'sha'] } },
    strictBuild: { type: 'string' },
    problems: { type: 'string' },
  },
  required: ['commits', 'strictBuild'],
}

function docPath(slug) {
  return WIKI + '/outputs/' + slug + '.md'
}

function scanPrompt(slug, lens) {
  const focus = lens === 1
    ? 'Lens 1, configuration and version detail. Find every passage that states a specific configuration value, default, interval, count, limit, flag, knob or numeric tunable; every version number, release date, release stage or mention of when something shipped; every comparison across products of such values; and every table whose cells are configuration values.'
    : 'Lens 2, resolved issues and implementation history. Find every pull request, issue, KEP, commit or changelog reference; every bug, regression or fixed or tracked-upstream problem; every statement that a release introduced, changed, fixed or removed something; release-candidate and unreleased caveats; claims about which version moved a default or a stage; and incident or adopter stories that rest on one product\'s bug, release or regression (mark stories with an architectural lesson keep-design-point).'
  return 'You are scanning one tutorial document of a Kubernetes platform-engineering knowledge wiki at ' + WIKI + ' for an editorial trim. Read ' + WIKI + '/CLAUDE.md first. You are READ-ONLY: edit nothing and run no git command that changes anything. Document: ' + docPath(slug) + '. Read the whole document.\n\n' + TRIM_RULES + '\n\n' + focus + '\n\nFor each passage give a verbatim quote (long enough to locate uniquely; for a whole paragraph or table quote its first sentence or row and say so in the reason), a disposition: delete (remove with no loss to the reader\'s understanding of the domain), rewrite-to-principle (the passage hides a design point; give replacement text stating the principle in full narrative sentences with no values, versions, dates, flags or issue numbers), or keep-design-point (it looks like detail but carries a substantive design or architecture difference; say why). Also report passages you are unsure about with your best judgment and the reason. Do not report text that is already free of such detail.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES
}

function editPrompt(slug, items, round, label) {
  return 'Edit the tutorial document ' + docPath(slug) + ' of the knowledge wiki at ' + WIKI + ' in place (' + label + ', round ' + round + '). Read ' + WIKI + '/CLAUDE.md and the whole document first. You may edit ONLY this one file. Do not run any git command that changes anything and do not touch any other file.\n\n' + TRIM_RULES + '\n\nYou receive ' + items.length + ' items from independent reviewers (JSON below). They overlap and can be wrong, so judge each yourself against the rules above: delete or rewrite the passages that are configuration values, versions, dates, stages, flags, issue, PR, KEP or commit references, resolved issues, and cross-product comparisons of configuration; keep passages marked keep-design-point when they carry a design or architecture difference. Read the whole document afterwards for anything the reviewers missed, using rg to find version patterns, dates, issue and PR numbers, --flags, "alpha|beta|GA|deprecated|default", and interval or timeout figures. Rewrite so the narrative still reads smoothly, expand the conceptual explanation that remains rather than compressing it, and state a removed passage\'s principle once in plain words when the document lacks it elsewhere. Keep every H2 heading exactly as it is (same text, same order), keep the frontmatter and the metadata header, and update only the header As of line and the frontmatter updated date to ' + TODAY + '.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\nItems (JSON):\n' + JSON.stringify(items) + '\n\nReturn counts of passages removed and rewritten, tables removed, principles restated, and judgmentCalls: one short sentence for each decision a reader of the report may want to question (a measured scale figure kept or removed, an incident story kept or removed, a feature name kept or removed).'
}

function verifyPrompt(slug) {
  return 'Adversarially verify the trimmed document ' + docPath(slug) + ' of the knowledge wiki at ' + WIKI + '. You are READ-ONLY: edit nothing and run no git command that changes anything (git show and git diff are fine). Read ' + WIKI + '/CLAUDE.md and then the whole document. The previous version is available with git show HEAD:outputs/' + slug + '.md.\n\n' + TRIM_RULES + '\n\nChecks. (1) Residual detail: run rg over the document for version patterns (v[0-9]+\\.[0-9]+), ISO dates (20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]), issue, pull request, KEP and commit references, command-line flags (--[a-z]), release-stage words (alpha|beta|GA|deprecated|release candidate), default values (default|defaults to), and interval, timeout, burst, replica or worker figures; read every hit and judge it by the rules. Allowed: incident-story context that teaches an architectural lesson, and conceptual uses with no value. Report each remaining violation with a verbatim quote and a concrete fix. (2) Lost design: compare with the previous version and report any design, architecture or trade-off point that was lost and should be restated (quote where it belonged and give replacement text). (3) Coherence: orphaned references to removed material, dangling transitions, sentences that now make no sense, sections reduced to fragments (expand them with the conceptual content), wikilinks that do not resolve to a file under ' + WIKI + ', banned words and telegraphic fragments, wording that refers to the document having been changed. (4) The H2 headings must be identical to the previous version (rg -n \'^## \' on both). Return verdict pass only when nothing needs fixing; otherwise fix with the issues.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES
}

// ---------- Phases 1 to 3: scan, edit, verify, per document ----------
phase('Scan')
log('Trimming ' + OUTPUT_SLUGS.length + ' documents to principles and design')
const results = await pipeline(
  OUTPUT_SLUGS,
  slug =>
    parallel([
      () => agent(scanPrompt(slug, 1), { label: 'scan1:' + slug, phase: 'Scan', schema: SCAN_SCHEMA, agentType: 'general-purpose' }),
      () => agent(scanPrompt(slug, 2), { label: 'scan2:' + slug, phase: 'Scan', schema: SCAN_SCHEMA, agentType: 'general-purpose' }),
    ]).then(rs => {
      const ok = rs.filter(Boolean)
      const passages = ok.flatMap(r => r.passages || [])
      log(slug + ': ' + ok.length + '/2 scanners, ' + passages.length + ' passages')
      return { slug: slug, passages: passages }
    }),
  scan =>
    agent(editPrompt(scan.slug, scan.passages, 1, 'trim'), { label: 'edit:' + scan.slug, phase: 'Edit', schema: EDIT_SCHEMA, agentType: 'general-purpose' })
      .then(ed => ({ scan: scan, edit: ed })),
  (st, slug) =>
    st && st.edit
      ? agent(verifyPrompt(slug), { label: 'verify:' + slug, phase: 'Verify', schema: VERIFY_SCHEMA, agentType: 'general-purpose' })
          .then(v => Object.assign({}, st, { verify: v }))
      : st,
  (st, slug) =>
    st && st.verify && st.verify.verdict === 'fix' && st.verify.issues.length
      ? agent(editPrompt(slug, st.verify.issues, 2, 'apply verifier fixes'), { label: 'refix:' + slug, phase: 'Verify', schema: EDIT_SCHEMA, agentType: 'general-purpose' })
          .then(e2 => Object.assign({}, st, { edit2: e2 }))
      : st,
)
const docs = results.filter(Boolean).filter(d => d.edit)
const failedDocs = OUTPUT_SLUGS.filter(s => !docs.find(d => d.scan.slug === s))
if (failedDocs.length) log('WARNING: no completed trim for: ' + failedDocs.join(', '))
log('Trimmed ' + docs.length + '/' + OUTPUT_SLUGS.length + ' documents')

// ---------- Phase 4: cross-document pass ----------
phase('Consistency')
const consistency = await agent(
  'Cross-document pass over the seven tutorials in ' + WIKI + '/outputs/ (' + OUTPUT_SLUGS.join(', ') + '), edited in place; edit only files under outputs/ and run no git command that changes anything. Read ' + WIKI + '/CLAUDE.md and all seven documents in full. Remove cross-document leftovers of the trim: a later part that recalls a number, default, version, date or flag that an earlier part no longer states; pointers such as "see Part 2 for the exact default"; summaries that still list removed detail; terminology that now differs between documents; terms used before they are explained. Then run rg over all seven for version patterns, ISO dates, issue, PR, KEP and commit references, --flags, and release-stage words, and judge every hit by the rules below, fixing violations in place. Keep every H2 heading unchanged. Also write a small Python script to /tmp/linkcheck_trim.py (standard library only) that extracts every [[target]] (strip |alias and #anchor) from the seven documents and reports targets with no matching file under ' + WIKI + '; run it with python3 -I and fix any dangling link.\n\n' + TRIM_RULES + '\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\nReturn counts of issues found and fixed and any that remain.',
  { label: 'consistency', phase: 'Consistency', schema: CONSISTENCY_SCHEMA, agentType: 'general-purpose' },
)

// ---------- Phase 5: finalize ----------
phase('Finalize')
const summary = docs.map(d => ({
  slug: d.scan.slug,
  passagesFlagged: d.scan.passages.length,
  removed: d.edit.removed + (d.edit2 ? d.edit2.removed : 0),
  rewritten: d.edit.rewritten + (d.edit2 ? d.edit2.rewritten : 0),
  tablesRemoved: (d.edit.tablesRemoved || 0) + (d.edit2 ? d.edit2.tablesRemoved || 0 : 0),
  principlesRestated: (d.edit.principlesRestated || 0) + (d.edit2 ? d.edit2.principlesRestated || 0 : 0),
  judgmentCalls: d.edit.judgmentCalls.concat(d.edit2 ? d.edit2.judgmentCalls : []),
  verifyVerdict: d.verify ? d.verify.verdict : 'none',
}))
const final = await agent(
  'Finalize the trim of the seven outputs for the knowledge wiki at ' + WIKI + '. Read CLAUDE.md. Do these steps in order. 1. Run python3 ' + WIKI + '/bin/build_site.py --strict from ' + WIKI + ' and report the result (it writes only build/, which is gitignored). 2. Append to ' + WIKI + '/log.md an entry "## [' + TODAY + '] outputs | trimmed to principles and design" with a short list of per-document counts (passages removed, rewritten, tables removed) and the judgment calls below, written in full sentences; the log is the only place that mentions what was trimmed. 3. Commit serially, staging explicit paths only, never git add -A, never --no-verify, never push. For each output with a diff (git diff --quiet -- outputs/<slug>.md), run git add outputs/<slug>.md then git commit -m "outputs: trim <slug> to principles and design"; then one more commit "log: outputs trimmed to principles and design" with log.md. Commits are signed automatically; do not change git config. Report each commit sha and any problem plainly.\n\nPer-document results:\n' + JSON.stringify(summary) + '\n\nCross-document and link results:\n' + JSON.stringify(consistency),
  { label: 'finalize', phase: 'Finalize', schema: FINAL_SCHEMA, agentType: 'general-purpose' },
)

return {
  documents: docs.length,
  failedDocs: failedDocs,
  perDocument: summary.map(s => ({ slug: s.slug, flagged: s.passagesFlagged, removed: s.removed, rewritten: s.rewritten, tables: s.tablesRemoved, verify: s.verifyVerdict })),
  judgmentCalls: summary.flatMap(s => s.judgmentCalls.map(j => s.slug + ': ' + j)),
  consistency: consistency,
  final: final,
}
