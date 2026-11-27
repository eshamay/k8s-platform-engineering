export const meta = {
  name: 'review-outputs-against-wiki',
  description: 'Review each of the seven outputs against the current wiki for correctness, completeness and contradictions, fix them in place in a timeless voice, verify, check cross-document consistency, write a findings page, commit one signed commit per document',
  phases: [
    { title: 'Review', detail: 'six read-only reviewers per document: citation fidelity (3 section slices), status and contradiction sweep, completeness and currency, timeless voice and prose' },
    { title: 'Fix', detail: 'one fixer per document applies verified fixes in place' },
    { title: 'Verify', detail: 'one adversarial verifier per document, with one more fix round when needed' },
    { title: 'Consistency', detail: 'cross-document consistency, link check, full-text scan for evolution language' },
    { title: 'Finalize', detail: 'findings page, index, log, todos, strict build, one signed commit per output' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = (args && args.today) || '2026-11-26'
const BASE_SHA = (args && args.baseSha) || '1fc1d27'

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

const ISSUE_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    sectionsReviewed: { type: 'number' },
    claimsChecked: { type: 'number' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          kind: { type: 'string', enum: ['wrong-fact', 'contradicted-source', 'superseded-source', 'unsupported', 'missing', 'stale', 'evolution-language', 'process-language', 'banned-word', 'prose', 'broken-link', 'structure'] },
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

const FIX_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    applied: { type: 'number' },
    appliedChanges: {
      type: 'array',
      items: {
        type: 'object',
        properties: { location: { type: 'string' }, summary: { type: 'string' }, wikiPage: { type: 'string' } },
        required: ['location', 'summary'],
      },
    },
    skipped: {
      type: 'array',
      items: { type: 'object', properties: { quote: { type: 'string' }, reason: { type: 'string' } }, required: ['reason'] },
    },
    needsUserDecision: {
      type: 'array',
      items: { type: 'object', properties: { location: { type: 'string' }, conflict: { type: 'string' }, pages: { type: 'string' } }, required: ['location', 'conflict'] },
    },
    wikiProblems: {
      type: 'array',
      items: { type: 'object', properties: { page: { type: 'string' }, problem: { type: 'string' } }, required: ['page', 'problem'] },
    },
    notes: { type: 'string' },
  },
  required: ['slug', 'applied', 'appliedChanges', 'skipped', 'needsUserDecision'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fix'] },
    passagesChecked: { type: 'number' },
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
        required: ['quote', 'problem'],
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

const FINAL_SCHEMA = {
  type: 'object',
  properties: {
    findingsPage: { type: 'string' },
    commits: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, sha: { type: 'string' } }, required: ['file', 'sha'] } },
    strictBuild: { type: 'string' },
    todosAdded: { type: 'number' },
    problems: { type: 'string' },
  },
  required: ['findingsPage', 'commits', 'strictBuild'],
}

function docPath(slug) {
  return WIKI + '/outputs/' + slug + '.md'
}

const COMMON = 'You are reviewing one tutorial document of a Kubernetes platform-engineering knowledge wiki at ' + WIKI + '. Read ' + WIKI + '/CLAUDE.md first. You are READ-ONLY: do not edit, create or delete any file and do not run any git command that changes anything (git diff, git log, git show and rg are fine). The wiki pages are the source of truth for this review; the document must say what the wiki pages say, and nothing the wiki contradicts. Do not rely on memory for any fact; open the wiki page. Return structured issues. For every issue give a verbatim quote of the passage as it appears in the document (short enough to be unique, long enough to locate), a plain description of the problem, the wiki page (path without .md, for example findings/some-page) that supports the fix, and exact replacement text written in the document\'s narrative style and obeying both rule blocks below. Report only real problems; report nothing when the document is right. If a sentence is right but could be longer or richer, that is not an issue unless the wiki holds a verified fact that is missing.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\n'

function lensA(slug, k) {
  return COMMON + 'Document: ' + docPath(slug) + '\nLens A, citation fidelity, slice ' + k + ' of 3. Read the whole document for context, but review only the sections whose H2 heading index (counting from 1 in order of appearance; the text before the first H2 counts as index 1) satisfies index mod 3 == ' + k + '. In those sections, for EVERY [[wikilink]] citation and every factual sentence: open the cited wiki page and check that the sentence matches it exactly, including numbers, versions, defaults, release stages (alpha, beta, GA), field, flag and finalizer names, dates, named organizations and incidents, and what is attributed to whom. Flag a sentence that overstates, understates, or misattributes its source; one that cites a page that does not support it; and factual sentences with no citation that a wiki page settles (give the page). Report counts of sections reviewed and claims checked.'
}

function lensB(slug) {
  return COMMON + 'Document: ' + docPath(slug) + '\nLens B, status and contradiction sweep. Step 1: run rg \'^status: (contradicted|superseded)\' over the wiki folders concepts, entities, sources, examples, comparisons, decisions and findings to list every page marked contradicted or superseded, and read each one including its Contradictions block and superseded_by successor. Step 2: list every wikilink target in the document (rg -o) and read the frontmatter status of each; flag every claim that rests on a contradicted, superseded, stale or draft page that the wiki itself says is wrong or unreliable, and give the page that holds the correct statement. Step 3: pick the 25 most consequential factual claims in the document (versions, defaults, numbers, release stages, tool behaviors, incident facts) and rg the wiki for each key term to find pages that disagree with the document even though the document does not cite them; open them and decide which side the better-sourced pages support. When two wiki pages genuinely conflict and you cannot tell which is right, report it with kind contradicted-source and say so in the problem, and leave replacement empty.'
}

function lensC(slug) {
  return COMMON + 'Document: ' + docPath(slug) + '\nLens C, completeness and currency. Build the list of wiki pages added or changed since commit ' + BASE_SHA + ' with: git diff --name-only ' + BASE_SHA + '..HEAD (and git log --oneline ' + BASE_SHA + '..HEAD). Also read the Resolution paragraphs of the closed gaps in ' + WIKI + '/open-knowledge-gaps-archive.md and the Closed gaps section of ' + WIKI + '/open-knowledge-gaps.md, and the findings and comparisons pages dated 2026-11-26. Decide which of these bear on THIS document\'s topics. Report (kind missing or stale) each verified fact the wiki holds that the document omits, states less precisely, or states with an out-of-date value: named adopters and incidents with dates, defaults and release stages, mechanisms, comparisons that would help a reader. Use only claims the wiki marks as verified or clearly attributed secondary claims; never invent. Give the page that holds each fact and written replacement or insertion text (say where it goes). Prioritize the facts a reader of this document would most want; do not pad with trivia, and do not propose additions that would repeat what the document already says well.'
}

function lensD(slug) {
  return COMMON + 'Document: ' + docPath(slug) + '\nLens D, timeless voice and prose contract. Read the whole document. Report: (1) every sentence that breaks the timeless-voice rule (kind evolution-language); (2) every sentence that talks about the research process, such as what the wiki or its authors read or did not read, found or did not find, verified or rechecked (kind process-language), with a rewrite that states what the named source shows or does not show; (3) banned words (kind banned-word); (4) passages that break the prose contract (kind prose): telegraphic fragments, bullets standing in for explanation, undefined jargon at first use; (5) structure problems (kind structure or broken-link): more than one H1, a metadata header whose lines do not end with <br>, missing frontmatter, wikilinks that do not resolve to a file under ' + WIKI + ' (check each target exists). Use rg to find candidate phrases across the whole file, for example: earlier|previous|originally|now |newly|since then|corrected|revised|updated|this pass|the wiki|was not read|were not read|could not be read|confirmed|verified|rechecked. Judge each hit by the test in the timeless-voice rule; do not flag technical history.'
}

function fixPrompt(slug, issues, round) {
  return 'Apply review fixes to ' + docPath(slug) + ' in the knowledge wiki at ' + WIKI + '. Read CLAUDE.md and the whole document first. You may edit ONLY this one file. Do not run any git command that changes anything and do not touch any other file.\n\nYou receive ' + issues.length + ' issues from independent reviewers (round ' + round + '). Many may overlap. For each one: (a) open the wiki page the issue names and check it yourself, because reviewers can be wrong; (b) if the issue is real, edit the passage in place, using the suggested replacement as a starting point but writing it in the document\'s own narrative style and fitting it into the surrounding paragraphs; (c) if the wiki itself holds conflicting statements and you cannot tell which is right, make no edit, and list it under needsUserDecision with the page names; (d) if the issue is wrong, list it under skipped with the reason. For missing or stale facts, add them where a reader would expect them, as full paragraphs, expanding the text rather than compressing it; keep every existing section, heading, the frontmatter and the metadata header intact. Update the metadata header line As of and the frontmatter updated date to ' + TODAY + ' and change nothing else in them. After editing, re-read the changed passages and make sure no edited sentence breaks either rule block below. Also record any wiki page that is itself wrong, thin or inconsistent (under wikiProblems); do NOT edit wiki pages.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\nIssues (JSON):\n' + JSON.stringify(issues) + '\n\nReturn: slug, the number applied, one appliedChanges entry per distinct edit (location by section heading, a one-line summary phrased as a neutral description of the content change, and the wiki page), skipped, needsUserDecision, wikiProblems.'
}

function verifyPrompt(slug, applied) {
  return 'Adversarially verify the edited document ' + docPath(slug) + ' of the knowledge wiki at ' + WIKI + '. You are READ-ONLY: edit nothing and run no git command that changes anything. Read CLAUDE.md, then the git diff of the file against the commit before the review (git diff HEAD -- outputs/' + slug + '.md shows uncommitted edits). The fixer reports these edits: ' + JSON.stringify(applied) + '.\n\nTasks: (1) open at least ten of the changed or added passages and check each against the wiki page it cites or relies on: numbers, versions, stages, names, attributions; (2) check that no edit introduces a claim the wiki marks as contradicted, unverified or draft-only, and that no edit asserts more than the wiki page does; (3) scan the whole document with rg for evolution language and process language (earlier|previous|originally|now |newly|since then|corrected|revised|updated|this pass|the wiki|was not read|were not read|verified|confirmed|rechecked) and judge each hit by the timeless-voice test below; (4) scan for banned words and fragments; (5) confirm every wikilink target exists as a file under ' + WIKI + ' and that the document still has frontmatter, one H1 and a metadata header whose lines end with <br>. Return verdict pass only when nothing needs fixing; otherwise verdict fix with each issue (verbatim quote, problem, wiki page, exact replacement).\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES
}

// ---------- Phases 1 to 3: review, fix, verify, per document ----------
phase('Review')
log('Reviewing ' + OUTPUT_SLUGS.length + ' documents against the wiki at HEAD; base ' + BASE_SHA)
const results = await pipeline(
  OUTPUT_SLUGS,
  slug =>
    parallel([
      () => agent(lensA(slug, 1), { label: 'reviewA1:' + slug, phase: 'Review', schema: ISSUE_SCHEMA, agentType: 'general-purpose' }),
      () => agent(lensA(slug, 2), { label: 'reviewA2:' + slug, phase: 'Review', schema: ISSUE_SCHEMA, agentType: 'general-purpose' }),
      () => agent(lensA(slug, 0), { label: 'reviewA3:' + slug, phase: 'Review', schema: ISSUE_SCHEMA, agentType: 'general-purpose' }),
      () => agent(lensB(slug), { label: 'reviewB:' + slug, phase: 'Review', schema: ISSUE_SCHEMA, agentType: 'general-purpose' }),
      () => agent(lensC(slug), { label: 'reviewC:' + slug, phase: 'Review', schema: ISSUE_SCHEMA, agentType: 'general-purpose' }),
      () => agent(lensD(slug), { label: 'reviewD:' + slug, phase: 'Review', schema: ISSUE_SCHEMA, agentType: 'general-purpose' }),
    ]).then(rs => {
      const ok = rs.filter(Boolean)
      const issues = ok.flatMap(r => (r.issues || []).map(i => Object.assign({ lens: r.lens }, i)))
      log(slug + ': ' + ok.length + '/6 reviewers returned, ' + issues.length + ' issues')
      return { slug: slug, reviewers: ok.length, claimsChecked: ok.reduce((n, r) => n + (r.claimsChecked || 0), 0), issues: issues }
    }),
  rev =>
    agent(fixPrompt(rev.slug, rev.issues, 1), { label: 'fix:' + rev.slug, phase: 'Fix', schema: FIX_SCHEMA, agentType: 'general-purpose' })
      .then(fix => ({ rev: rev, fix: fix })),
  (stage2, slug) =>
    stage2 && stage2.fix
      ? agent(verifyPrompt(slug, stage2.fix.appliedChanges), { label: 'verify:' + slug, phase: 'Verify', schema: VERIFY_SCHEMA, agentType: 'general-purpose' })
          .then(v => Object.assign({}, stage2, { verify: v }))
      : stage2,
  (stage3, slug) =>
    stage3 && stage3.verify && stage3.verify.verdict === 'fix' && stage3.verify.issues.length
      ? agent(fixPrompt(slug, stage3.verify.issues, 2), { label: 'refix:' + slug, phase: 'Verify', schema: FIX_SCHEMA, agentType: 'general-purpose' })
          .then(f2 => Object.assign({}, stage3, { fix2: f2 }))
      : stage3,
)
const docs = results.filter(Boolean).filter(d => d.fix)
const failedDocs = OUTPUT_SLUGS.filter(s => !docs.find(d => d.rev.slug === s))
if (failedDocs.length) log('WARNING: no completed review for: ' + failedDocs.join(', '))
log('Reviewed and fixed: ' + docs.length + '/' + OUTPUT_SLUGS.length + ' documents; applied ' + docs.reduce((n, d) => n + d.fix.applied + (d.fix2 ? d.fix2.applied : 0), 0) + ' edits')

// ---------- Phase 4: cross-document consistency (sequential, edits outputs/) ----------
phase('Consistency')
const consistency = await agent(
  'Check the seven tutorials in ' + WIKI + '/outputs/ for cross-document consistency and fix problems in place. Read ' + WIKI + '/CLAUDE.md, then all seven documents (' + OUTPUT_SLUGS.join(', ') + ') in full. Find places where two documents state different versions, defaults, numbers, release stages (alpha, beta, GA), field, flag or finalizer names, tool behaviors, or definitions of the same term; places where one part says something was not found or not stated while another part states it; and terms used in an earlier part before they are explained. Known item to check: Part 2 and Part 4 list finalizer names; the Crossplane managed-resource finalizer is named in the Crossplane ramp-up and should be named consistently wherever finalizer names are listed. Resolve each conflict by opening the wiki page that holds the sourced fact, then edit the affected document(s). Edit only files under outputs/; no git commands that change anything. Keep the narrative full-sentence style and expand rather than compress.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\nReturn counts of issues found and fixed and any that remain.',
  { label: 'consistency', phase: 'Consistency', schema: CONSISTENCY_SCHEMA, agentType: 'general-purpose' },
)
const links = await agent(
  'Final checks on the seven tutorials in ' + WIKI + '/outputs/ (' + OUTPUT_SLUGS.join(', ') + '). (1) Write a small Python script to /tmp/linkcheck_outputs_review.py (standard library only) that extracts every [[target]] (strip any |alias and #anchor) and reports targets with no matching file under ' + WIKI + ' (target + .md, or the exact path); run it with python3 -I; fix each dangling link by pointing it at the correct existing page or, if none exists, by rewriting the sentence to state the claim without the link. (2) Run rg -n -i over the seven files for: earlier (draft|version|revision|pass)|previously|was corrected|corrected in|revised|this pass|the wiki now|newly|used to say|originally|since then|rechecked|was not read|were not read. Judge each hit with the timeless-voice rule below (technical history is kept; history of the document or the wiki is rewritten) and rewrite each offending sentence in place. (3) rg for the banned words in the prose contract and fix any hit outside a wikilink slug. (4) Confirm each document keeps its frontmatter, one real H1 (ignore # comment lines inside fenced code blocks) and a metadata header whose lines end with <br>. Edit only files under outputs/; no git commands that change anything.\n\n' + PROSE_RULES + '\n\n' + TIMELESS_RULES + '\n\nReturn counts found and fixed and any that remain.',
  { label: 'linkcheck-and-scan', phase: 'Consistency', schema: CONSISTENCY_SCHEMA, agentType: 'general-purpose' },
)

// ---------- Phase 5: finalize ----------
phase('Finalize')
const summary = docs.map(d => ({
  slug: d.rev.slug,
  reviewers: d.rev.reviewers,
  claimsChecked: d.rev.claimsChecked,
  issuesReported: d.rev.issues.length,
  applied: d.fix.applied + (d.fix2 ? d.fix2.applied : 0),
  appliedChanges: d.fix.appliedChanges.concat(d.fix2 ? d.fix2.appliedChanges : []),
  skipped: d.fix.skipped.length + (d.fix2 ? d.fix2.skipped.length : 0),
  needsUserDecision: d.fix.needsUserDecision.concat(d.fix2 ? d.fix2.needsUserDecision : []),
  wikiProblems: (d.fix.wikiProblems || []).concat(d.fix2 && d.fix2.wikiProblems ? d.fix2.wikiProblems : []),
  verifyVerdict: d.verify ? d.verify.verdict : 'none',
}))
const final = await agent(
  'Finalize the review of the seven outputs for the sticki-wiki at ' + WIKI + '. Read CLAUDE.md. The per-document results of the review are below as JSON. Do these steps in order.\n\n1. Write the wiki page ' + WIKI + '/findings/outputs-review-' + TODAY + '.md for the reader of the documents. Frontmatter: title "Outputs review against the wiki, ' + TODAY + '", type overview, status active, created and updated ' + TODAY + ', sources: [] , aliases: [], tags [review, outputs]. One H1 and a metadata callout with <br> line endings per the markdown hygiene rule. Sections: (a) one paragraph on scope and method; (b) a per-document table (document, claims checked, issues reported, edits applied, skipped, verdict); (c) per document, a list of the applied changes as neutral content descriptions (location, what the document now says, supporting wiki page as a [[wikilink]]); (d) a section "Needs a decision" listing every needsUserDecision item with the conflicting pages; (e) a section "Wiki problems found" listing the wikiProblems, and the cross-document consistency and link-scan results: ' + JSON.stringify({ consistency: consistency, links: links }) + '. Do NOT put any of this commentary into the outputs themselves. Write in full sentences outside the tables and avoid the banned words (anchored, unanchored, bounded, bounds, canonical, carveout, gate as a verb, genuinely, load-bearing, material, materially, shape as a vague noun).\n2. Add the page to index.md under the right section, append a log.md entry "## [' + TODAY + '] outputs | review against the wiki" summarizing the counts, and for each distinct wiki problem and each needsUserDecision item append one open todo to todo.md (status open, with What, Why, Acceptance, Drafted by agent) and add it to the Index of open todos. Do not edit any wiki page other than these anchor files and the findings page; never close a gap; never edit irrefutable-facts.md or purpose.md.\n3. Run python3 ' + WIKI + '/bin/build_site.py --strict from ' + WIKI + ' and report the result (it writes only build/, which is gitignored).\n4. Commit serially, staging explicit paths only, never git add -A, never --no-verify, never push. For each output that has a diff (git diff --quiet -- outputs/<slug>.md), run: git add outputs/<slug>.md then git commit -m "outputs: review <slug> against the wiki". Then one more commit "findings: outputs review against the wiki" with the findings page, index.md, log.md and todo.md. Commits are signed automatically; do not change git config. Report each commit sha.\n\nReturn the structured result and any problem, stated plainly.\n\nPer-document results:\n' + JSON.stringify(summary),
  { label: 'finalize', phase: 'Finalize', schema: FINAL_SCHEMA, agentType: 'general-purpose' },
)

return {
  documents: docs.length,
  failedDocs: failedDocs,
  perDocument: summary.map(s => ({ slug: s.slug, claimsChecked: s.claimsChecked, issues: s.issuesReported, applied: s.applied, skipped: s.skipped, needsUserDecision: s.needsUserDecision.length, wikiProblems: s.wikiProblems.length, verify: s.verifyVerdict })),
  consistency: consistency,
  links: links,
  final: final,
}
