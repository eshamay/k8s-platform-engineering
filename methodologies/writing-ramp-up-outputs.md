---
title: Writing ramp-up outputs from the wiki
type: methodology
status: active
created: 2026-11-27
updated: 2026-11-27
sources: []
aliases: [ramp-up output methodology, outputs methodology]
tags: [outputs, method, prose, ramp-up]
---

# Writing ramp-up outputs from the wiki

> **Audience:** People and agents who write new documents into `outputs/`.<br>
> **Purpose:** Turn a topic the wiki already covers into a ramp-up document that teaches principles, design and architecture in narrative prose.<br>
> **Status:** Active<br>
> **Created:** 2026-11-27<br>
> **As of:** 2026-11-27<br>
> **Companions:** `workflows/write-ramp-up-output.js` runs this method; `bin/lint_outputs.py` checks the mechanical rules; `bin/gh_links.py` keeps wiki links clickable.

## 1. Purpose and audience

An output is a ramp-up document for an engineer who already works with Kubernetes and needs depth on one subject: how a part of the platform ecosystem is designed, why it is designed that way, and what follows from that design. The reader knows pods, controllers and manifests. The reader does not know the subject, such as finalizers, resource graphs, or the way a GitOps agent reconciles, and wants to understand it well enough to reason about new situations without a manual.

The reader is not served by product trivia. An output teaches the domain: principles, axioms, mechanisms, trade-offs, the failure modes that follow from the design, and the contrasts between how different stacks make the same design choice. It names products where a contrast shows a substantive design decision, and it assumes the reader uses the newest version of everything.

## 2. What an output is not

An output is not a digest of wiki pages, a changelog, a release-notes summary, a configuration reference, or a record of how the research went. The wiki holds the evidence, including versions, dates, flags, defaults, issue threads and fixed bugs. The output stands on that evidence but does not repeat it. A good output could be read three years from now and still be right about the design.

## 3. The content filter

Write about these:

- Principles and axioms that explain why a system is built the way it is.
- Mechanisms, described by what they do and why, so the reader can predict behavior.
- Design trade-offs and the failure modes that follow from them, such as stale caches, revert loops, retry storms, orphaned external resources, circular dependencies.
- Comparisons of design, architecture and feature sets between products, and the reason each made its choice.
- Named API concepts and features the reader must understand (finalizers, owner references, server-side apply, status conditions, composition functions, management policies), stated without versions, stages or default values.
- Incident and adopter stories that teach an architectural lesson, kept at year-level context, for example a reconciler faithfully applying a bad desired state.
- Rounded, order-of-magnitude scale reasoning that shows a structural limit, such as a shared store being a single point of contention, when the figure is not a tool's tuning outcome.

Never write these:

- Specific configuration values: poll, sync, resync, retry and requeue intervals, timeouts, burst and worker counts, rate limits, replica counts, cache sizes, and any comparison of such values across products. Flags, Helm values, environment variables and controller knobs, with their values and defaults.
- Version numbers, release dates, release stages (alpha, beta, GA, deprecated, release candidate), and statements about which release introduced, changed, fixed or removed something.
- Pull request, issue, KEP, commit and changelog references; resolved bugs and regressions; "fixed in", "shipped in", "since", "as of".
- Comparison tables whose cells are configuration values. Design and trade-off tables are fine.
- Incident stories that rest on one product's bug, release or regression.
- Wording about the document or the research: "earlier drafts", "the wiki now holds", "was corrected", "remaining unknowns", "was not read by", "this pass".

When material you want to cut carries a principle the reader needs, say the principle once in plain words with no values. For example, instead of listing each tool's poll interval, explain that how often a controller re-checks the outside world is a trade-off between how quickly drift is noticed and how many calls are spent on an external API, and that each component picks its own cadence for its own reasons.

## 4. Voice

- Narrative, full-sentence prose in a warm teaching voice. No caveman or telegraphic style. Paragraphs carry the nuance and explain why, not only what.
- Bullet lists only for genuinely list-shaped content such as a glossary or a link roundup. Explanations, background, use cases and pitfalls are paragraphs.
- Explain every term the first time it appears, assuming real Kubernetes operating experience and no prior knowledge of the subject.
- Timeless voice. Nothing says "now", "newly", "previously", "since revised" about the document or the wiki. Describe how a technology differs from another, never how this document or its evidence changed.
- Evidence caveats stay, but as plain statements about named sources: "the managed-resources documentation states no default" and never "the default was not found". A claim that rests on one source says so by naming the kind of source.
- No banned words from the voice-rules list: anchored, unanchored, bounded, bounds, canonical, carveout, carveouts, gate or gates as a verb, genuinely, load-bearing, material, materially, shape or shapes as a vague noun. A banned word inside a link slug is allowed.
- Do not invent facts. When sources disagree, say what the disagreement is in design terms and cite both.

## 5. Evidence handling

Every factual claim comes from a wiki page, and the wiki page comes from a source. Cite with wikilinks to the pages that support the paragraph, as `[[findings/some-page]]`; outputs keep wikilinks because the Pages build resolves them. Open the page before citing it and make sure it says what the sentence says. Prefer pages with `status: active`; check pages marked `contradicted` or `superseded` and cite the successor or the correction instead. When two pages conflict and the conflict is about design, state the disagreement. When it is about a number or a version, leave the number out.

A sentence that needs a citation to be believable and has none is a claim to remove or to source before it ships.

## 6. Document skeleton

A document has one H1, a metadata header, and 9 to 13 numbered H2 sections followed by `Further reading`. Aim for 7,000 to 12,000 words. Section roles, learned from the existing series:

1. **Why this topic matters.** The problem the design answers, who runs into it, and what the reader will be able to do after reading.
2. **The mental model and the axioms.** The two or three ideas everything else follows from, defined carefully with an example the reader can picture.
3. **Mechanisms, one section each.** For each: the principle, how it works, why it was designed that way, and what follows from it for someone building or operating on top of it.
4. **Use cases framed as architectural lessons.** Named incidents and adopters, year-level only, each tied to the design point it illustrates.
5. **Failure modes rooted in the design.** What goes wrong and which design property causes it; how different stacks address it.
6. **How different stacks make the choice differently.** A comparison of design and trade-offs across the tools the wiki covers, never of values.
7. **Design principles to carry forward.** The distilled guidance a platform builder takes away.
8. **Further reading.** Wikilinks to the pages relied on, grouped by kind (concepts, entities, comparisons, decisions, findings, examples).

Do not add a "getting started" or "remaining unknowns" section: the first teaches configuration, the second talks about the research. If a step-by-step orientation helps, write it as a narrative section about how to approach the subject in practice, stated as design guidance.

H2 headings are stable once a document is published: they are cross-referenced by number and listed in the site sidebar.

### Where the file goes

Outputs live in group folders, and each group is a top-level section of the published site: `outputs/k8s-platform-rampup/` (the five-part ramp-up series), `outputs/products/` (one ramp-up guide per product, such as Flux and Crossplane), and `outputs/topics/` (stand-alone deep dives on a design topic; the default for a new document). The path is `outputs/<group>/<slug>.md`. A page's public URL stays `/outputs/<slug>/` whatever its group, and `output_groups` in `.sticki-publish.json` sets each group's sidebar title and order. A new group is a new folder plus an entry in that list.

## 7. Frontmatter and header

```yaml
---
title: "<human-readable title>"
type: output
status: draft          # draft until the owner has read it; the site publishes only active
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources:               # the wiki source pages relied on, with id, hash and ingested date
  - id: <slug>
    hash: <12 chars>
    ingested: YYYY-MM-DD
aliases: []
tags: []
---
```

The metadata header is a blockquote with `Audience`, `Purpose`, `Status`, `Created`, `As of` and `Draws on` lines, each ending in `<br>`, followed by a short orienting paragraph. `Created` stays fixed; `As of` is bumped when the text changes.

### Figures

A figure is a diagram that shows topology or design, never versions or values. Each figure is two files in `outputs/figures/`: an editable `<name>.excalidraw` (open it at excalidraw.com or in Obsidian) and the `<name>.svg` render that the document embeds, both produced from one layout script so they cannot drift. Validate the `.excalidraw` JSON with `jq` (unique ids, bindings that resolve) and look at a rendered preview before inserting it. In the document, introduce the figure in a sentence of prose, embed it with a relative path and descriptive alt text, and give it a caption on the next line in the form `*Figure N. ...*`, numbered in order within the document. The site build copies embedded images into the published site.

## 8. Process

1. **Scope.** Search the wiki for the topic and build an evidence map: principles, mechanisms, design choices, trade-offs, design contrasts between tools, incidents with an architectural lesson, each with its supporting pages, plus the questions the evidence leaves open, framed as design questions.
2. **Outline.** One line per section: its thesis, the pages that support it, the terms to define. A reviewer checks that the outline covers the evidence map, passes the content filter, and teaches something the audience lacks.
3. **Draft.** Write each section as full-sentence prose from its outline entry and its pages. Assemble the sections, then read the whole for voice, transitions, repetition and term definitions at first use.
4. **Review.** Four independent lenses: citation fidelity against the pages; the content filter (run `bin/lint_outputs.py`, then judge every hit and any passage that is product trivia rather than design); reader comprehension for the stated audience; prose, voice and structure.
5. **Fix, then verify.** One editor applies the findings; an independent verifier re-reads the whole document and the lint output.
6. **Publish.** Keep `status: draft` until the owner reads it, then change it to `active`, put the file in its group folder, add the slug to `nav_order_stems` in `.sticki-publish.json`, and add it to `index.md` and `log.md`. Commit signed; push only when the owner says so.

## 9. Definition of done

- `python3 -I bin/lint_outputs.py outputs/<group>/<slug>.md` reports no errors, and each warning has been read and judged.
- Every wikilink resolves; every cited page says what the sentence says.
- Each section teaches a principle and explains why; none is a list of facts.
- A Kubernetes-fluent reader with no prior knowledge of the subject could follow it from the first section to the last without outside material.
- No version, date, flag, default, stage, issue or commit appears, outside incident-story years.
- No sentence refers to the document having changed, or to what the research did or did not read.
- `python3 bin/build_site.py --strict` is clean.

## 10. Passages to avoid, and what to write instead

| Avoid | Write instead |
|---|---|
| A paragraph listing each tool's poll interval and noting that one changed its default between major releases. | One paragraph on the trade-off between drift-detection latency and external API cost, and that each component and provider chooses its own cadence. |
| "The kustomize-controller flag ... first shipped in release X moves ownership before the dry run." | The design idea: which controller takes ownership of a field before the dry run decides whether two writers fight, and why the order matters. |
| "Functions reached v1 in release X and broke compatibility with the alpha functions." | Composition functions are long-running gRPC servers that the package manager deploys, so the pipeline is code the platform team versions and ships like any other service. |
| "In issue N, filed on a date and still open, ..." | Remove, or if the underlying failure is architectural, describe the failure mode and the design property that causes it. |
| "A runtime change merged on a date moves the status write to immediately after the create call." | Why the status write must happen immediately after a non-idempotent create: a lost create must be recoverable from what the controller recorded. |
| "Reversed to positive polarity in one month and since another month recommend neither." | State the trade-off between abnormal-true and normal-true condition polarity in design terms. |
| "The runaway guard is a circuit breaker with burst 100; providers define their own flags." | A platform needs a guard against a reconcile loop that runs away; Crossplane's composites have one and providers have their own, so a builder checks each layer. |
