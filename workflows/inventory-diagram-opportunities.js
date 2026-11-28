export const meta = {
  name: 'inventory-diagram-opportunities',
  description: 'Read-only: scan Parts 1 to 5 for passages that describe an architecture, components, a flow, a lifecycle, or a comparison of system designs that a diagram would clarify; return candidates with verbatim driving text for human review',
  phases: [
    { title: 'Scan', detail: 'one read-only scanner per part, five in parallel' },
  ],
}

const WIKI = '/Users/eshamay/dev/wikis/k8s-platform-engineering'
const PARTS = [
  { n: 1, file: 'k8s-platform-rampup/part-1-core-architectural-principles.md' },
  { n: 2, file: 'k8s-platform-rampup/part-2-krm-and-api-machinery.md' },
  { n: 3, file: 'k8s-platform-rampup/part-3-controller-and-operator-mechanics.md' },
  { n: 4, file: 'k8s-platform-rampup/part-4-platform-abstractions.md' },
  { n: 5, file: 'k8s-platform-rampup/part-5-platform-architecture-principles-and-operating-at-scale.md' },
]

const SCHEMA = {
  type: 'object',
  properties: {
    part: { type: 'number' },
    opportunities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          section: { type: 'string' },
          kind: { type: 'string', enum: ['architecture', 'components', 'flow', 'lifecycle', 'comparison', 'layering'] },
          why: { type: 'string' },
          quote: { type: 'string' },
          rank: { type: 'number' },
        },
        required: ['slug', 'section', 'kind', 'why', 'quote'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['part', 'opportunities'],
}

function prompt(p) {
  return 'You are scanning one tutorial document of a Kubernetes platform-engineering knowledge wiki at ' + WIKI + ' to find places where a diagram would help the reader. Read ' + WIKI + '/CLAUDE.md for context, then read the WHOLE document ' + WIKI + '/outputs/' + p.file + ' (Part ' + p.n + '). You are READ-ONLY: edit and create nothing, run no command that changes anything.\n\n' +
    'The document currently has no diagrams except, in Part 1 only, a figure of the four GitOps delivery topologies (hub-applies-to-remotes, agents connecting out, controllers in every cluster, a Kustomization targeting a remote cluster); do not propose that again.\n\n' +
    'Find passages where the text describes: an architecture or component layout (what pieces exist and how they connect); a data or control flow (what talks to what, in which direction, in which order); a lifecycle or state sequence (stages an object or process moves through); a comparison of two or more system designs (how different tools or approaches arrange the same responsibilities); or a layering or ownership model (what owns what). A good candidate is a paragraph or a few adjacent paragraphs where the reader has to build a picture in their head from words.\n\n' +
    'Rules: (1) One candidate per distinct idea; do not propose several diagrams for the same paragraphs. (2) Skip passages that are only lists of configuration values, version details, or product trivia, and skip passages that are pure argument with no structure to draw. (3) Propose about 4 to 8 candidates, ranked (rank 1 = a picture would help the most). (4) For each candidate return: slug (unique, form p' + p.n + '-<short-topic>, lowercase words joined by hyphens, for example p' + p.n + '-reconcile-loop), the H2 heading it sits in (copy the heading text exactly, including its number), kind, one sentence saying what the diagram would show (components, flows, directions), and quote: the exact text that would drive the diagram, copied VERBATIM and character for character from the document (one paragraph or a few adjacent paragraphs, separated by a blank line; do not paraphrase, shorten with ellipses, or reflow; keep any [[wikilinks]] and inline code as written). Before returning, verify each quote by searching for a distinctive 80-character slice of it in the file with rg -F so you know it is present exactly.\n\nReturn the structured result.'
}

phase('Scan')
const results = await parallel(
  PARTS.map(p => () => agent(prompt(p), { label: 'scan:part-' + p.n, phase: 'Scan', schema: SCHEMA, agentType: 'general-purpose' })),
)

return {
  parts: PARTS.map(p => p.n),
  results: results.filter(Boolean),
  failed: PARTS.filter((p, i) => !results[i]).map(p => p.n),
}
