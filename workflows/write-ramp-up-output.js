export const meta = {
  name: 'write-ramp-up-output',
  description: 'Write one new ramp-up document into outputs/ from a topic the wiki covers: evidence map, outline, parallel section drafts, assembly, four review lenses, fix, verify, lint, commit. Follows methodologies/writing-ramp-up-outputs.md. Args: {topic, slug, title, today, seedPages?}',
  phases: [
    { title: 'Scope', detail: 'evidence map of principles, mechanisms, trade-offs, contrasts and lessons from the wiki' },
    { title: 'Outline', detail: 'section outline plus a critic pass' },
    { title: 'Draft', detail: 'one writer per section, in parallel, then assembly into outputs/' },
    { title: 'Review', detail: 'four independent lenses over the assembled document' },
    { title: 'Fix', detail: 'one editor applies the findings, one verifier re-reads' },
    { title: 'Finalize', detail: 'lint, link and site checks, nav and index entries, signed commits' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = (args && args.today) || '2026-11-27'
const TOPIC = args && args.topic
const SLUG = args && args.slug
const TITLE = (args && args.title) || TOPIC
const SEED = (args && args.seedPages) || []
if (!TOPIC || !SLUG) throw new Error('args.topic and args.slug are required')
const OUT = WIKI + '/outputs/' + SLUG + '.md'
const TMP = '/tmp/ramp-' + SLUG
const METHOD = WIKI + '/methodologies/writing-ramp-up-outputs.md'

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

const GROUND = 'Project: a Kubernetes platform-engineering knowledge wiki at ' + WIKI + '. Read ' + WIKI + '/CLAUDE.md and then the methodology ' + METHOD + ' before anything else, and follow the methodology exactly. The reader of the document is an engineer who already works with Kubernetes and needs depth on one subject; the document teaches principles, design and architecture and never the version, date, flag, default, stage, issue or commit trivia of any product. The wiki pages are the evidence; open a page before relying on it.\n\n'

const SCOPE_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          kind: { type: 'string', enum: ['principle', 'mechanism', 'trade-off', 'contrast', 'lesson', 'failure-mode', 'term'] },
          title: { type: 'string' },
          point: { type: 'string' },
          pages: { type: 'array', items: { type: 'string' } },
        },
        required: ['kind', 'title', 'point', 'pages'],
      },
    },
    pages: {
      type: 'array',
      items: { type: 'object', properties: { path: { type: 'string' }, status: { type: 'string' }, why: { type: 'string' } }, required: ['path', 'status'] },
    },
    openDesignQuestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['items', 'pages'],
}

const OUTLINE_SCHEMA = {
  type: 'object',
  properties: {
    intro: { type: 'string' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          n: { type: 'number' },
          title: { type: 'string' },
          role: { type: 'string' },
          thesis: { type: 'string' },
          covers: { type: 'array', items: { type: 'string' } },
          pages: { type: 'array', items: { type: 'string' } },
          terms: { type: 'array', items: { type: 'string' } },
          targetWords: { type: 'number' },
        },
        required: ['n', 'title', 'role', 'thesis', 'covers', 'pages', 'targetWords'],
      },
    },
  },
  required: ['intro', 'sections'],
}

const CRITIC_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'revise'] },
    issues: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'issues'],
}

const SECTION_SCHEMA = {
  type: 'object',
  properties: { n: { type: 'number' }, file: { type: 'string' }, words: { type: 'number' }, notes: { type: 'string' } },
  required: ['n', 'file', 'words'],
}

const ASSEMBLE_SCHEMA = {
  type: 'object',
  properties: { path: { type: 'string' }, words: { type: 'number' }, h2: { type: 'number' }, notes: { type: 'string' } },
  required: ['path', 'words', 'h2'],
}

const ISSUE_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          kind: { type: 'string' },
          quote: { type: 'string' },
          problem: { type: 'string' },
          wikiPage: { type: 'string' },
          replacement: { type: 'string' },
        },
        required: ['severity', 'kind', 'quote', 'problem'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['lens', 'issues'],
}

const EDIT_SCHEMA = {
  type: 'object',
  properties: { applied: { type: 'number' }, skipped: { type: 'number' }, notes: { type: 'string' } },
  required: ['applied', 'skipped'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fix'] },
    lintErrors: { type: 'number' },
    issues: {
      type: 'array',
      items: { type: 'object', properties: { quote: { type: 'string' }, problem: { type: 'string' }, fix: { type: 'string' } }, required: ['quote', 'problem', 'fix'] },
    },
  },
  required: ['verdict', 'issues'],
}

const FINAL_SCHEMA = {
  type: 'object',
  properties: {
    lint: { type: 'string' },
    strictBuild: { type: 'string' },
    commits: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, sha: { type: 'string' } }, required: ['file', 'sha'] } },
    problems: { type: 'string' },
  },
  required: ['lint', 'strictBuild', 'commits'],
}

// ---------- Phase 1: scope ----------
phase('Scope')
const scope = await agent(
  GROUND + 'Task: build an evidence map for a ramp-up document on this topic: "' + TOPIC + '". Search the wiki with rg across concepts/, entities/, comparisons/, decisions/, findings/, examples/ and sources/ (open-knowledge-gaps-archive.md holds closed-gap resolutions that can help). ' + (SEED.length ? 'Start from these pages: ' + SEED.join(', ') + '. ' : '') + 'You are READ-ONLY: edit nothing and run no git command that changes anything.\n\nReturn items of these kinds: principle (an axiom or design principle that explains why systems are built this way), mechanism (how something works and why it is designed that way), trade-off, contrast (how different tools make the same design choice differently, and why), lesson (an incident or adopter story that teaches an architectural lesson, with year-level context only), failure-mode (what goes wrong because of a design property), term (a concept the reader must have defined). Each item has a title, a one or two sentence point stated as a principle or design fact with NO version, date, flag, default, stage, issue or commit, and the supporting wiki pages (paths without .md). Skip any item that is only product trivia. Also return every page you read with its frontmatter status and why it matters (flag pages that are contradicted or superseded and name the correction), and openDesignQuestions: questions the evidence leaves open, phrased as design questions and not as research process.\n\n' + TRIM_RULES,
  { label: 'scope', phase: 'Scope', schema: SCOPE_SCHEMA, agentType: 'general-purpose' },
)
log('Evidence map: ' + scope.items.length + ' items, ' + scope.pages.length + ' pages')

// ---------- Phase 2: outline ----------
phase('Outline')
const outlinePrompt = (extra) =>
  GROUND + 'Task: write the outline for the document "' + TITLE + '" (topic: ' + TOPIC + '). Use the evidence map below. Produce an intro (one paragraph describing what the document covers and who it is for, in the document\'s voice, with no history or process wording) and 9 to 13 numbered sections that follow the section roles in the methodology (why the topic matters; mental model and axioms; one section per mechanism; use cases as architectural lessons; failure modes rooted in the design; how different stacks make the choice differently; design principles to carry forward). Do not include a Further reading section, a getting-started section or a remaining-unknowns section; Further reading is added at assembly. For each section give a title, its role, a thesis stated as a principle, which evidence items it covers (by title), the wiki pages to cite (only pages from the map; exclude contradicted or superseded pages unless citing the correction), the terms to define at first use, and a targetWords figure so the total lands between 7,000 and 12,000. Every evidence item of kind principle, mechanism, contrast, lesson and failure-mode must be covered by some section. You are READ-ONLY; return the structure only.' + (extra || '') + '\n\nEvidence map:\n' + JSON.stringify(scope)
let outline = await agent(outlinePrompt(), { label: 'outline', phase: 'Outline', schema: OUTLINE_SCHEMA, agentType: 'general-purpose' })
const critic = await agent(
  GROUND + 'Critique this outline for the document "' + TITLE + '". READ-ONLY. Check: (1) coverage: every principle, mechanism, contrast, lesson and failure-mode item in the evidence map is covered by a section; (2) the content filter: no section is organized around versions, dates, configuration values, flags, resolved bugs or one product\'s bug; (3) each section would teach a Kubernetes-fluent reader something they lack, by explaining why and not listing facts; (4) 9 to 13 sections, totalling 7,000 to 12,000 words, with roles in a sensible teaching order, and no getting-started or remaining-unknowns section; (5) cited pages exist (check with ls or rg) and none is contradicted or superseded. Return verdict pass or revise with specific issues.\n\nOutline:\n' + JSON.stringify(outline) + '\n\nEvidence map:\n' + JSON.stringify(scope),
  { label: 'outline-critic', phase: 'Outline', schema: CRITIC_SCHEMA, agentType: 'general-purpose' },
)
if (critic && critic.verdict === 'revise' && critic.issues.length) {
  outline = await agent(outlinePrompt('\n\nA critic found these problems with the first outline; fix them: ' + JSON.stringify(critic.issues) + '\n\nFirst outline:\n' + JSON.stringify(outline)), { label: 'outline-revise', phase: 'Outline', schema: OUTLINE_SCHEMA, agentType: 'general-purpose' })
}
log('Outline: ' + outline.sections.length + ' sections, ' + outline.sections.reduce((n, s) => n + s.targetWords, 0) + ' target words')

// ---------- Phase 3: draft sections in parallel, then assemble ----------
phase('Draft')
const pad = (n) => (n < 10 ? '0' + n : '' + n)
const drafted = await parallel(
  outline.sections.map((sec, i) => () => {
    const prev = i > 0 ? outline.sections[i - 1] : null
    const next = i < outline.sections.length - 1 ? outline.sections[i + 1] : null
    return agent(
      GROUND + 'Task: write section ' + sec.n + ' of the document "' + TITLE + '". Create the directory ' + TMP + ' if it does not exist and write the section with the Write tool to ' + TMP + '/section-' + pad(sec.n) + '.md. Write ONLY that file; do not touch the repository.\n\nThe file starts with the heading line "## ' + sec.n + '. ' + sec.title + '" (use exactly that text) and then the section body in full-sentence narrative prose, about ' + sec.targetWords + ' words. Role: ' + sec.role + '. Thesis: ' + sec.thesis + '. Cover: ' + sec.covers.join('; ') + '. Terms to define at first use: ' + (sec.terms || []).join('; ') + '. Open and read these wiki pages and rely on them: ' + sec.pages.join(', ') + '. Cite the pages that support a paragraph with wikilinks in the form [[folder/slug]] placed at the end of the relevant sentence or paragraph, and only cite pages you have opened and that say what the sentence says. ' + (prev ? 'The previous section is "' + prev.title + '" (' + prev.thesis + '); do not repeat it, build on it. ' : 'This is the first section; the intro paragraph is added separately. ') + (next ? 'The next section is "' + next.title + '" (' + next.thesis + '); end so that it follows naturally.' : 'This is the last numbered section.') + ' Do not use ### sub-headings unless a section clearly needs them. Do not write tables of configuration values. Where the evidence is thin, say in plain words which kinds of source support the claim, with no research-process wording.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\n' + TRIM_RULES + '\n\nReturn the section number, the file path and the word count.',
      { label: 'draft:' + pad(sec.n), phase: 'Draft', schema: SECTION_SCHEMA, agentType: 'general-purpose' },
    )
  }),
)
const sectionFiles = drafted.filter(Boolean)
if (sectionFiles.length !== outline.sections.length) log('WARNING: ' + (outline.sections.length - sectionFiles.length) + ' sections failed to draft')

const assembled = await agent(
  GROUND + 'Task: assemble the document and write it to ' + OUT + ' with the Write tool. The section files are ' + TMP + '/section-NN.md (read them all, in numeric order). Build: (1) frontmatter per the methodology: title "' + TITLE + '", type output, status draft, created ' + TODAY + ', updated ' + TODAY + ', sources list (for each wiki source page, under sources/, that the cited pages draw on or that supports the section content: the id equals the page file name without .md, hash and ingested copied from that source page\'s own frontmatter), aliases [], tags [outputs]; (2) a single H1 with the title; (3) the metadata blockquote header with Audience (an engineer fluent in Kubernetes who needs depth on this subject), Purpose, Status (Draft), Created ' + TODAY + ', As of ' + TODAY + ', and Draws on lines, EVERY line ending in <br>; (4) this intro paragraph, lightly polished: ' + JSON.stringify(outline.intro) + '; (5) the sections in order, unchanged in their headings; (6) a final "## Further reading" section with the wiki pages the document relies on, as wikilinks grouped on one line each by kind (Concepts, Entities, Comparisons, Decisions, Findings, Examples), only pages that exist. Then read the whole assembled document as a reader and harmonize in place: consistent voice and terminology, every term defined at first use and not twice, smooth transitions, remove repetition between sections, fix any wikilink that does not resolve, and make sure no sentence carries a version, date, flag, default, release stage, issue or commit reference or revision wording. Do not run git. Do not change H2 headings. Return the path, word count and number of H2 sections.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\n' + TRIM_RULES,
  { label: 'assemble', phase: 'Draft', schema: ASSEMBLE_SCHEMA, agentType: 'general-purpose' },
)
log('Assembled ' + assembled.words + ' words, ' + assembled.h2 + ' H2 sections')

// ---------- Phase 4: review (4 independent lenses) ----------
phase('Review')
const REVIEW_COMMON = GROUND + 'You are reviewing the document ' + OUT + ' (title "' + TITLE + '"). You are READ-ONLY: edit nothing and run no git command that changes anything. Return structured issues with a verbatim quote, the problem, the wiki page that supports a fix (path without .md) and exact replacement text in the document\'s narrative style. Report real problems only.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\n'
const lenses = [
  { key: 'A', text: 'Lens A, citation fidelity. For every [[wikilink]] citation and every factual sentence, open the cited wiki page and check that the sentence matches it: mechanisms, names, attributions, design claims, any figure. Flag sentences that overstate, understate or misattribute, citations that do not support their sentence, factual sentences with no support that a wiki page settles, and cited pages that are contradicted or superseded.' },
  { key: 'B', text: 'Lens B, content filter. Run python3 -I ' + WIKI + '/bin/lint_outputs.py ' + OUT + ' and judge every finding (errors and warnings). Then read the document for passages that are product trivia and not design: stated defaults, intervals, flags, stages, versions, dates, issue or commit references, fixed-bug history, comparisons of configuration values, incident stories that rest on one product\'s bug, and any remaining-unknowns or getting-started section. Report each with a replacement that states the principle in plain narrative sentences.' },
  { key: 'C', text: 'Lens C, reader comprehension. Read as the stated reader: fluent in Kubernetes, new to this subject. Report undefined terms and terms defined too late, missing prerequisites, sections that list facts instead of explaining why, abrupt jumps between sections, claims that a reader cannot follow without outside material, and missing examples that would make an abstract point concrete. Offer replacement or insertion text.' },
  { key: 'D', text: 'Lens D, prose, voice and structure. Check the prose contract (full sentences, no fragments or telegraphic bullets, bullets only for list-shaped content), banned words, timeless voice, exactly one H1, the metadata header with every line ending in <br>, frontmatter with type output and status draft, 9 to 13 numbered H2 sections plus Further reading, a total length between 7,000 and 12,000 words, and wikilinks that do not resolve to a file under ' + WIKI + '.' },
]
const reviews = await parallel(lenses.map(l => () => agent(REVIEW_COMMON + l.text, { label: 'review' + l.key, phase: 'Review', schema: ISSUE_SCHEMA, agentType: 'general-purpose' })))
const issues = reviews.filter(Boolean).flatMap(r => (r.issues || []).map(i => Object.assign({ lens: r.lens }, i)))
log('Review: ' + reviews.filter(Boolean).length + '/4 lenses returned, ' + issues.length + ' issues')

// ---------- Phase 5: fix then verify ----------
phase('Fix')
const fixPrompt = (items, round) =>
  GROUND + 'Edit the document ' + OUT + ' in place (round ' + round + '). You may edit ONLY this one file; run no git command that changes anything. Judge each issue yourself by opening the wiki page it names before editing, since reviewers can be wrong. Apply real fixes with narrative full-sentence prose that fits the surrounding paragraphs; expand rather than compress; keep every H2 heading, the frontmatter fields and the metadata header lines (each ending in <br>); set updated and As of to ' + TODAY + '. Add missing explanations the comprehension lens asked for. Make no wording that refers to the document having changed.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\n' + TRIM_RULES + '\n\nIssues (JSON):\n' + JSON.stringify(items) + '\n\nReturn the number applied and skipped.'
const fixed = await agent(fixPrompt(issues, 1), { label: 'fix', phase: 'Fix', schema: EDIT_SCHEMA, agentType: 'general-purpose' })
const verify = await agent(
  GROUND + 'Adversarially verify the document ' + OUT + '. You are READ-ONLY. Run python3 -I ' + WIKI + '/bin/lint_outputs.py ' + OUT + ' and judge every finding. Re-read the whole document as the stated reader and check: every cited page exists and supports its sentence (open at least ten); no product trivia remains (version, date, flag, default, interval, stage, issue, commit, fixed-bug history, configuration comparison); no research-process or revision wording; each section explains why and not only what; the H2 headings are numbered 1..N in order followed by Further reading; the length is between 7,000 and 12,000 words. Return verdict pass only when nothing needs fixing, else fix with issues (quote, problem, fix).\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\n' + TRIM_RULES,
  { label: 'verify', phase: 'Fix', schema: VERIFY_SCHEMA, agentType: 'general-purpose' },
)
let refixed = null
if (verify && verify.verdict === 'fix' && verify.issues.length) {
  refixed = await agent(fixPrompt(verify.issues, 2), { label: 'refix', phase: 'Fix', schema: EDIT_SCHEMA, agentType: 'general-purpose' })
}

// ---------- Phase 6: finalize ----------
phase('Finalize')
const final = await agent(
  'Finalize the new output ' + OUT + ' for the wiki at ' + WIKI + '. Read ' + WIKI + '/CLAUDE.md. Steps in order. 1. Run python3 -I ' + WIKI + '/bin/lint_outputs.py ' + OUT + ' and fix remaining errors in that one file by editing it (keep narrative prose; no revision wording); report the final result. 2. Run python3 -I ' + WIKI + '/bin/gh_links.py --check and python3 ' + WIKI + '/bin/build_site.py --strict from ' + WIKI + ' and report both (the document is status draft, so the site omits it; that is expected). 3. Add the slug "' + SLUG + '" to the end of the nav_order_stems list in ' + WIKI + '/.sticki-publish.json (keep valid JSON). 4. Add the page to ' + WIKI + '/index.md under the outputs section in the same style as the other outputs, noting it is a draft, and append to ' + WIKI + '/log.md an entry "## [' + TODAY + '] outputs | ' + TITLE + '" saying the document was written with the ramp-up methodology, its word count and section count. 5. Commit serially, staging explicit paths only, never git add -A, never --no-verify, never push: first git add outputs/' + SLUG + '.md and commit "outputs: add ' + SLUG + ' (draft)"; then git add index.md log.md .sticki-publish.json and commit "outputs: index and nav entries for ' + SLUG + '". Commits are signed automatically; do not change git config. Report the commit shas and any problem plainly.',
  { label: 'finalize', phase: 'Finalize', schema: FINAL_SCHEMA, agentType: 'general-purpose' },
)

return {
  topic: TOPIC,
  slug: SLUG,
  evidenceItems: scope.items.length,
  sections: outline.sections.length,
  assembled: assembled,
  reviewIssues: issues.length,
  fix: fixed,
  verify: verify,
  refix: refixed,
  final: final,
}
