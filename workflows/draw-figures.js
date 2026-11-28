export const meta = {
  name: 'draw-figures',
  description: 'Draw one Excalidraw+SVG figure per approved diagram opportunity (design, independent review, repair), then insert each figure into its document with a figure number, title and caption. Args: {slugs, md, today}',
  phases: [
    { title: 'Design', detail: 'one agent per figure writes a spec, renders it with bin/figure_gen.py, and looks at the preview until it is clean' },
    { title: 'Review', detail: 'an independent agent checks the rendered figure against the quoted text; one repair round if needed' },
    { title: 'Insert', detail: 'one agent per part inserts figures after their driving paragraphs with numbered captions' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const TODAY = (args && args.today) || '2026-11-27'
const MD = (args && args.md) || '/tmp/diagram-opportunities.md'
const SLUGS = (args && args.slugs) || []
if (!SLUGS.length) throw new Error('args.slugs is required')

const DOCS = {
  1: 'k8s-platform-rampup/part-1-core-architectural-principles.md',
  2: 'k8s-platform-rampup/part-2-krm-and-api-machinery.md',
  3: 'k8s-platform-rampup/part-3-controller-and-operator-mechanics.md',
  4: 'k8s-platform-rampup/part-4-platform-abstractions.md',
  5: 'k8s-platform-rampup/part-5-platform-architecture-principles-and-operating-at-scale.md',
}
const partOf = (slug) => Number(slug.slice(1, 2))

const RULES = `Figure rules (strict).
- A figure shows DESIGN and STRUCTURE: components, flows, directions, ownership, stages, comparisons of how designs arrange the same responsibilities. It is a visual guide to the quoted text for a reader who knows Kubernetes but not this subject.
- Every box, arrow and label must be supported by the quoted text or by the surrounding text of the same document section. Do not invent components, steps or arrows. If the text supports only a simple picture, draw the simple picture.
- Never put versions, dates, release stages, flags, default values, intervals, counts of replicas, issue or commit references in a figure. Product names are fine when the text names them. Labels are short (about 2 to 4 words per box; use a second line for detail), written in plain words. No sentences inside boxes.
- Readability: the page shows the figure about 800 pixels wide, so keep the canvas at most about 1000 pixels wide and 700 tall, label text 15 pixels or larger, at most about 14 boxes, and leave clear space for arrow labels. Prefer left-to-right or top-to-bottom flow. Use a legend only when arrows of different kinds appear.
- Palette (keep it consistent across figures): git = Git or any source of truth; hub = a control plane, hub, API server of record or external API; cluster = a dashed region such as a cluster or namespace; controller = a controller or other active component; agent = an agent or client; store = a data store or object in the API; danger = a failure state or hazard; ok = a healthy or finished state; note = an annotation; neutral = anything else; panel = a large background frame. Arrow kinds: pull (gray dashed, fetch or read), apply (blue, write or command), connect (orange, an agent connecting out), flow (dark, ordinary data or control flow), write (green, a status or result written back), delete (red, deletion or teardown), watch (purple dashed, watching or notification).
- Diagram direction must match the text exactly: the arrowhead points to the party being acted on or receiving.`

const DESIGN_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    specPath: { type: 'string' },
    title: { type: 'string' },
    caption: { type: 'string' },
    alt: { type: 'string' },
    anchorQuote: { type: 'string' },
    checkClean: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['slug', 'specPath', 'title', 'caption', 'alt', 'anchorQuote', 'checkClean'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['pass', 'fix'] },
    issues: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'issues'],
}

const INSERT_SCHEMA = {
  type: 'object',
  properties: {
    part: { type: 'number' },
    inserted: { type: 'array', items: { type: 'object', properties: { slug: { type: 'string' }, number: { type: 'string' } }, required: ['slug', 'number'] } },
    lintErrors: { type: 'number' },
    problems: { type: 'string' },
  },
  required: ['part', 'inserted'],
}

function designPrompt(slug, round, issues, prev) {
  const part = partOf(slug)
  return `You are drawing one figure for a Kubernetes platform-engineering tutorial in the wiki at ${WIKI}. Figure slug: ${slug}. Read ${WIKI}/CLAUDE.md first.

1. Read the opportunity for this slug in ${MD}: find the line "## ${slug}" and read until the next "## " heading. It gives the section, the kind of diagram, the diagram idea and the verbatim text that drives the figure. Then read the whole H2 section of ${WIKI}/outputs/${DOCS[part]} that contains that text, so the figure fits the surrounding explanation.
2. Learn the generator: run python3 -I ${WIKI}/bin/figure_gen.py --help and read ${WIKI}/bin/figure_example.spec.json (a worked example spec).
3. Write the spec to ${WIKI}/outputs/figures/${slug}.spec.json (with "slug": "${slug}", a "title", a descriptive "alt", and the elements; add a "legend" when arrows of different kinds appear).
4. Generate and look: from ${WIKI} run python3 -I bin/figure_gen.py outputs/figures/${slug}.spec.json --out outputs/figures --preview, then view the preview PNG it prints with the Read tool. Fix every ERROR and WARN the checker reports, and fix anything you can see is wrong or hard to read: overlapping or clipped text, an arrow that runs through a box, crowded areas, labels that sit on lines. Repeat until the checker is clean and the picture is legible, at most four iterations.

${RULES}

${round > 1 ? `This is a repair round. A reviewer looked at the rendered figure and found these problems; fix each one in the existing spec (${prev || 'the spec at the path above'}) and regenerate:\n${JSON.stringify(issues)}\n` : ''}
Return: the spec path; a figure title in sentence case of at most nine words that names what the picture explains (no number, no trailing period); a caption of one or two full sentences in the document's timeless narrative voice (no versions or dates, no wording about the document having changed) that tells the reader what to look at; alt text of one descriptive sentence; anchorQuote = the LAST 120 characters of the verbatim driving text from ${MD} for this slug (copy them exactly; they are used to find where the figure goes); checkClean = true only if the generator reported 0 errors and 0 warnings on your final run; short notes on anything the picture simplifies.`
}

function reviewPrompt(slug, d) {
  const part = partOf(slug)
  return `You are an independent reviewer of one figure in the wiki at ${WIKI}. READ-ONLY for the repository: do not edit anything under ${WIKI}. Figure slug: ${slug}.

Read the opportunity for this slug in ${MD} (the line "## ${slug}" until the next "## " heading): section, diagram idea, and the verbatim driving text. Then look at the figure: run python3 -I ${WIKI}/bin/figure_gen.py ${WIKI}/outputs/figures/${slug}.spec.json --out /tmp/figreview-${slug} --preview (this writes to /tmp only), and view the preview PNG it prints with the Read tool. Also read the spec.

Check: (1) Fidelity: every box and arrow is supported by the driving text or the same document section; nothing important from the text is missing; no invented component or step; arrow directions match the text (the arrowhead points to the party acted on or receiving). (2) Legibility: no overlapping or clipped text, no arrow through a box, labels readable at about 800 pixels wide, layout easy to follow. (3) Content filter: no versions, dates, release stages, flags, default values, intervals, issue or commit references. (4) Palette and arrow kinds follow the rules below. (5) The title "${d.title}", the caption "${d.caption}" and the alt text "${d.alt}" are accurate to the picture, in plain timeless prose.

${RULES}

Return verdict pass only if nothing needs fixing; otherwise verdict fix with specific, actionable issues (name the box or arrow id and the exact change).`
}

phase('Design')
log('Drawing ' + SLUGS.length + ' figures')
const results = await pipeline(
  SLUGS,
  slug => agent(designPrompt(slug, 1), { label: 'design:' + slug, phase: 'Design', schema: DESIGN_SCHEMA, agentType: 'general-purpose' }),
  (d, slug) =>
    d
      ? agent(reviewPrompt(slug, d), { label: 'review:' + slug, phase: 'Review', schema: REVIEW_SCHEMA, agentType: 'general-purpose' })
          .then(r => ({ slug: slug, design: d, review: r }))
      : null,
  (st, slug) =>
    st && st.review && st.review.verdict === 'fix' && st.review.issues.length
      ? agent(designPrompt(slug, 2, st.review.issues, st.design.specPath), { label: 'repair:' + slug, phase: 'Review', schema: DESIGN_SCHEMA, agentType: 'general-purpose' })
          .then(d2 => Object.assign({}, st, { design: d2 || st.design, repaired: true }))
      : st,
)
const figs = results.filter(Boolean).filter(x => x.design)
const failed = SLUGS.filter(s => !figs.find(x => x.slug === s))
if (failed.length) log('WARNING: no figure for: ' + failed.join(', '))
log('Figures drawn: ' + figs.length + '/' + SLUGS.length + '; repaired ' + figs.filter(x => x.repaired).length + '; checker-clean ' + figs.filter(x => x.design.checkClean).length)

phase('Insert')
const byPart = {}
for (const f of figs) {
  const p = partOf(f.slug)
  ;(byPart[p] = byPart[p] || []).push({ slug: f.slug, title: f.design.title, caption: f.design.caption, alt: f.design.alt, anchorQuote: f.design.anchorQuote })
}
const inserted = await parallel(
  Object.keys(byPart).map(p => () => agent(
    `Insert figures into Part ${p} of the tutorial series in the wiki at ${WIKI}. Read ${WIKI}/CLAUDE.md and ${WIKI}/methodologies/writing-ramp-up-outputs.md (the Figures subsection) first. You may edit ONLY ${WIKI}/outputs/${DOCS[p]}; run no git commands that change anything.

For each figure below, find where it belongs: search the document with rg -F for the anchorQuote (its last 120 characters of the paragraph that drives the figure; if the exact string is not found, search a 60-character slice from inside it). The figure goes DIRECTLY AFTER the end of the paragraph (or the run of adjacent paragraphs, if the quote ends one of several that describe the same thing) that contains the anchorQuote.

Insert, in this order, separated by blank lines: (1) a one-sentence lead-in that refers to the figure by number and says what it shows, in the document's narrative timeless voice (skip the lead-in if the paragraph before already points to the figure); (2) the image line ![alt](../figures/<slug>.svg) using the figure's alt text; (3) the caption line in italics: *Figure ${p}.N. <Title>. <caption>* where the title and caption come from the figure data.

Numbering: figures in this part are numbered ${p}.1, ${p}.2, ... by their position in the document from top to bottom, and this includes the figure that already exists in Part 1 (image gitops-delivery-topologies.svg, caption starting "Figure 1." and a lead-in sentence "Figure 1 shows the four arrangements side by side.") when you are editing Part 1: renumber that existing figure's caption and lead-in to its correct ${p}.N number, changing nothing else about it. Make sure no two figures have the same number and that numbers increase down the page. Do not add, remove or rename any heading. If two figures would sit back to back, keep each with its own lead-in so a paragraph of prose separates them where possible.

The figures for this part (JSON): ${JSON.stringify(byPart[p])}

After editing: check every referenced image exists (ls ${WIKI}/outputs/figures/<slug>.svg), run python3 -I ${WIKI}/bin/lint_outputs.py ${WIKI}/outputs/${DOCS[p]} and make sure it reports no new errors (the document had 0 errors before), and re-read each insertion to confirm the figure follows the paragraph it illustrates and the prose around it still reads smoothly.

Prose rules: full-sentence narrative, timeless voice; no wording about the document having changed; avoid these words entirely: anchored, unanchored, bounded, bounds, canonical, carveout, carveouts, genuinely, load-bearing, material, materially.

Return the part number, the list of {slug, number} you inserted (number like "${p}.2"), the lint error count, and any problem.`,
    { label: 'insert:part-' + p, phase: 'Insert', schema: INSERT_SCHEMA, agentType: 'general-purpose' },
  )),
)

return {
  requested: SLUGS.length,
  drawn: figs.length,
  failed: failed,
  repaired: figs.filter(x => x.repaired).map(x => x.slug),
  notClean: figs.filter(x => !x.design.checkClean).map(x => x.slug),
  reviewIssues: figs.filter(x => x.review && x.review.verdict === 'fix').map(x => ({ slug: x.slug, issues: x.review.issues })),
  inserted: inserted.filter(Boolean),
}
