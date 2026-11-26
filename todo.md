# TODOs / Followups — k8s-platform-engineering

Concrete actions for this wiki. Distinct from `open-knowledge-gaps.md`:

- **Gaps** = "we don't know X yet" (knowledge work).
- **TODOs** = "we know what to do, do it" (execution work).

Write authority: agent-may-write. Agents may add entries, transition status (`open → in-progress → done | dropped`), and record outcomes.

H2 slug is the anchor for each entry; refer to entries with `[[#slug]]`.

## Index of open todos

- [[#review-and-deliver-the-seven-outputs]] — open
- [[#promote-draft-pages-to-active]] — open
- [[#add-sticki-lint-to-the-recurring-routine]] — open
- [[#deepen-the-dossiers-that-rest-on-model-digests]] — open
- [[#build-the-study-guide-from-the-corpus]] — open
- [[#update-crossplane-ramp-up-for-the-v2-5-verification-pass]] — open
- [[#update-part-4-for-the-v2-5-verification-pass]] — open
- [[#update-part-5-for-the-v2-5-verification-pass]] — open
- [[#update-part-3-for-the-kro-v0-10-0-verification-pass]] — open
- [[#update-part-4-for-the-kro-v0-10-0-verification-pass]] — open
- [[#update-part-5-for-the-kro-v0-10-0-verification-pass]] — open

## Open

## Review and deliver the seven outputs — status: open

- **What:** Read the five tutorial parts and the Flux and Crossplane ramp-ups, check them against the prose style contract and the banned-phrases list, then set `delivered:` and promote them from draft.
- **Why:** All seven are `status: draft` and unreviewed; delivered outputs are frozen and exempt from staleness checks.
- **Acceptance:** Each output reviewed by a human, status active, `delivered:` set.

## Promote draft pages to active — status: open

- **What:** 421 of 493 pages are `draft`. Triage the ones backed by official documentation, and promote or revise them.
- **Why:** Draft-heavy corpora hide which claims have been checked. Single-digest and vendor-sourced findings should stay draft until re-verified.
- **Acceptance:** Draft count reduced, with promotions logged.

## Add sticki-lint to the recurring routine — status: open

- **What:** Re-run lint after each batch of ingests and after the 180-day staleness horizon (first pages cross it around 2027-05).
- **Why:** All pages were created on 2026-11-25, so staleness and stuck-gap checks (60 days, around 2027-01-24) have not yet been able to fire.
- **Acceptance:** Lint entry appended to `log.md` each cycle.

## Deepen the dossiers that rest on model digests — status: open

- **What:** Read primary sources for `research-scale-and-sharding`, `research-pitfalls-and-case-studies`, and `research-landscape`, which the wiki's own findings flag as relying on summarizing fetches, vendor posts, or older versions.
- **Why:** Numeric scale limits, incident details, and landscape comparisons need rechecking before the outputs lean on them.
- **Acceptance:** Findings that flag the caveats updated or closed out with primary citations.

## Build the study guide from the corpus — status: open

- **What:** Run `study-guide:build` against this wiki once the outputs are reviewed.
- **Why:** The wiki is large (493 pages) and a guided pathway would help readers; the output is gitignored under `study-guide/`.
- **Acceptance:** `study-guide/` tree exists and `.sticki/derived.json` registers it.

## Update crossplane-ramp-up for the v2.5 verification pass — status: open

- **What:** In `outputs/crossplane-ramp-up.md`, revise four passages. (1) Section 5, the paragraph beginning "The v2 scope matters for tenancy" lists `LegacyCluster` as a v2 alternative scope, but it exists only on the v1 XRD API, so cite [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]]. (2) Section 7, the paragraph beginning "Two failure patterns", should say the async `Synced` problem is unfixed (issue closed as stale) and cite [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]]. (3) Section 12 and the "Modularity of providers" principle describe activation policies without maturity or the default, so cite [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]] and state they are alpha. (4) The closing unknowns paragraph says the default poll interval, claim support, and Operations details are unconfirmed, so cite [[sources/research-gap-g3-crossplane-v2]] and [[findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references]]. Also the `managementPolicies` passage in section 4 should note it is beta, citing [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].
- **Why:** The 2026-11-26 verification pass corrected or settled these claims. Outputs are not edited by ingest.
- **Acceptance:** The passages are revised through `sticki-summarize` or by hand, each citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Update part-4 for the v2.5 verification pass — status: open

- **What:** In `outputs/part-4-platform-abstractions.md`, revise the scope paragraph in section 4 (beginning "The scope field leads to the v1 and v2 difference") to say that `LegacyCluster` is a v1 XRD scope and that v2 XRDs reject claims, citing [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]]. Revise the `managementPolicies` paragraph (beginning "The `managementPolicies` list is the main safety lever") to state it is beta and to cite [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]]. Revise the provider-families packaging paragraph to mention that activation policies are alpha, citing [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]].
- **Why:** The dossier ingested on 2026-11-26 verified these points against v2.5 sources.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-5 for the v2.5 verification pass — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, revise the Crossplane scale paragraph (beginning "For Crossplane the dominant scale problem is CRD count") to mark activation policies alpha and the default Helm install as activating everything, citing [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]]. Revise the reconcile-load paragraph that says present managed-resource poll defaults are unknown to cite the v2.5 Pods guide figures (one-minute polling, hourly re-check) from [[sources/research-gap-g3-crossplane-v2]]. In the conditions section, state that the async `Synced` pitfall is unfixed, citing [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]]. The real incident to cite is provider-aws issue 2287, see [[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]].
- **Why:** The 2026-11-26 verification pass corrected or settled these claims.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-3 for the kro v0.10.0 verification pass — status: open

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, revise three places that treat kro's tuning values as unreleased. The paragraph on failure retries that says kro, "according to its unreleased documentation", combines exponential backoff from 200 milliseconds to 1000 seconds with a token bucket; the "How they time the loop" paragraph that says "kro's unreleased documentation lists a full resync every 10 hours"; and the source list entry `https://kro.run/next/docs/advanced/controller-tuning`. The released v0.10.0 page (2026-11-10) lists the same values, so the passages can cite the released version, and the kro instance requeue interval (3 seconds, exponential backoff capped at five minutes) can be added. Cite [[examples/kro-shared-queue-tunes-throughput]] and [[sources/research-gap-g3-kro]].
- **Why:** The 2026-11-26 kro dossier verified the defaults at a released version, so the unreleased-docs caveat no longer applies.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-4 for the kro v0.10.0 verification pass — status: open

- **What:** In `outputs/part-4-platform-abstractions.md`, revise two passages. (1) The readiness paragraph in the kro section (beginning "Ordering and readiness are two separate mechanisms") should name the four built-in instance conditions (`InstanceManaged`, `GraphResolved`, `ResourcesReady`, `Ready`), say that only `Ready` is a stable contract, and say that the RGD condition set has five members including `GraphRevisionsResolved`; cite [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]] and [[findings/a-kro-includewhen-on-a-volatile-upstream-status-field-makes-resources-flip-flop]]. (2) The maturity paragraph (beginning "Rollout and maturity matter too") says kro runs on one shared queue "per its unreleased documentation"; it should cite the released v0.10.0 values, and it can add that the Graph API is alpha with no compatibility guarantee, has no revisions, and needs a manual CRD apply ([[findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates]], [[findings/enabling-the-kro-graph-api-needs-a-manual-crd-apply-because-helm-does-not-update-crds-on-upgrade]]). Governance, if mentioned, should say kro is a Kubernetes SIG Cloud Provider subproject ([[entities/kro]]).
- **Why:** The 2026-11-26 kro dossier corrected and extended these facts against the v0.10.0 documentation.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-5 for the kro v0.10.0 verification pass — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, revise the paragraph beginning "The same split-by-key idea appears outside GitOps". It says "unreleased kro documentation gives a default of 20 retries" and "Treat all of these as unreleased-doc values that may differ in released versions". The v0.10.0 release documents the same values, so drop the caveat, cite the released version, and optionally add the documented note that per-RGD queues may replace the shared queue and the collection limit of 1000 items ([[findings/a-kro-foreach-collection-above-the-1000-item-default-limit-gets-stuck-during-deletion]]). Cite [[examples/kro-shared-queue-tunes-throughput]] and [[sources/research-gap-g3-kro]].
- **Why:** The 2026-11-26 kro dossier verified the defaults at a released version.
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Done

## Run build-wiki workflow — status: done

- **What:** Run `workflows/build-wiki.js` to fan out web research per concept, ingest sources, plan outputs, and draft the tutorial series.
- **Outcome:** 2026-11-25: 28 research dossiers plus the seed vocabulary were ingested (29 sources), producing 493 content pages, and the five-part series plus the Flux and Crossplane ramp-ups were drafted in `outputs/` (about 66,000 words). Review and delivery are tracked separately.

## Dropped
