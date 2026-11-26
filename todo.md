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
- [[#decide-on-the-23-partial-and-4-still-open-gaps-from-the-evidence-pass]] — open
- [[#batch-2-p3-other-tool-coverage-research-pass]] — open
- [[#batch-2-p3b-residual-partial-gaps-from-the-targeted-pass]] — open
- [[#batch-3-p4-benchmarks-and-scale-by-controller-gaps]] — open
- [[#batch-3-p4b-turn-design-choice-evidence-into-decision-pages]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck-of-cluster-api-and-argo-cd]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck-of-kro-and-crossplane]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck-of-flux-and-kubernetes]] — open
- [[#close-the-resolved-candidate-gaps-from-the-mechanics-and-accuracy-pass]] — open
- [[#decide-on-the-26-partial-and-3-still-open-mechanics-gaps]] — open
- [[#fetch-the-sources-the-mechanics-and-accuracy-pass-could-not-read]] — open
- [[#recheck-cluster-api-machinehealthcheck-and-clusterclass-once-v1150-final-ships]] — open
- [[#review-the-unrevised-passages-that-kept-their-caveats-in-the-seven-outputs]] — open

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

## Decide on the 23 partial and 4 still-open gaps from the evidence pass — status: open

- **What:** Review the partial gaps (a named remainder exists) and the four still-open gaps (forced-finalizer orphaning rate, named end-user convergence case study, named operator postmortems, named Flux sharding adopter or APF incident) in [[findings/evidence-and-fact-check-pass-gap-dispositions]]. Decide which need another targeted pass and which should be closed as unanswerable with current sources.
- **Why:** The Skyscanner, Reddit and Spotify primaries were unreadable with the tools available, so those need a different retrieval route.
- **Acceptance:** Each gap has a decision recorded.
- **Drafted by:** agent on 2026-11-26

## Batch 2 (P3): other-tool coverage research pass — status: open

- **What:** Research the roughly 30 open gaps about other tools: Argo CD versus Flux head to head, secrets in GitOps agents, Git versus OCI as the source, ApplicationSets and hub-and-spoke, Config Connector versus Crossplane, Kratix, Radius, Score, the KRM function specification, tofu-controller and the Terraform operator, Backstage, and how Flux and Argo CD handle provider-managed resources.
- **Why:** Adds breadth to Parts 4 and 5 and the landscape comparisons. Not blocking accuracy, so it follows Batch 1.
- **Acceptance:** Verified dossiers ingested, comparison pages written or updated, and affected tutorial passages revised.
- **Drafted by:** agent on 2026-11-26

## Batch 2 (P3b): residual partial gaps from the targeted pass — status: open

- **What:** Settle the narrow remainders that Batch 1 does not cover: Crossplane v2 scaling guidance and function-runner history, Config Connector per-kind reconcile cadence, ReplicaSet and StatefulSet staleness metric names, kro-to-Crossplane status propagation, Upjet runtime cost, and package dependency and upgrade policy.
- **Why:** Each is a named caveat inside a closed or partial gap.
- **Acceptance:** Each remainder is settled with a primary source or recorded as unanswerable.
- **Drafted by:** agent on 2026-11-26

## Batch 3 (P4): benchmarks and scale-by-controller gaps — status: open

- **What:** Look for independent benchmarks for etcd, vcluster, kcp and the Argo CD footprint, and measured scaling for kro, ACK, Cluster API and Config Connector controllers. Expect many to be recorded as unanswerable with current public sources.
- **Why:** Needs measurements that may not exist, so it is lower value per token.
- **Acceptance:** Each gap has independent numbers or a recorded reason none exist.
- **Drafted by:** agent on 2026-11-26

## Batch 3 (P4b): turn design-choice evidence into decision pages — status: open

- **What:** After Batch 1 lands, write `decisions/` pages with options, evidence and a recommendation for the user to accept or change: the default SSA conflict policy for GitOps beside in-cluster controllers, force-conflicts versus strip-or-adopt, Git versus OCI, condition polarity, and operator framework choice.
- **Why:** These are judgment calls, so the user decides; research only supplies evidence.
- **Acceptance:** Each decision page exists with a status the user sets; the matching gaps can then be closed with `sticki-gaps`.
- **Drafted by:** agent on 2026-11-26

## Review closed gap resolutions refined by the b1 recheck — status: open

- **What:** Closed gaps were not edited. Two closed Resolutions carry statements the b1 recheck refines: "Argo CD sharding algorithm maturity in current releases" says the default is unconfirmed (the default is `legacy`, confirmed in source), and "Argo CD default reconcile interval across versions" says the reason for the jitter is unverified (pull request 22342 explains only that the 3 minute ceiling was kept). Pages were updated instead, see [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]] and [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]. A human decides whether to reopen either gap or leave the Resolution as a record of what was known at close.
- **Why:** Closed Resolutions stay as the reasoning trail, and the reader should know which statements were later refined. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Review closed gap resolutions refined by the b1 recheck of Cluster API and Argo CD — status: open

- **What:** Closed gaps were not edited. Four closed Resolutions carry statements the recheck refines. "Current Cluster API MachineHealthCheck behavior" and "ClusterClass maturity and the managed topologies proposal" say a recheck is needed at v1.15.0 final, which still does not exist, and `main` matches rc.0 on the fields checked. "Argo CD sharding algorithm maturity in current releases" says the default is unconfirmed, and the default is `legacy` in code at v3.6.3. "Argo CD default reconcile interval across versions" says the v2.1 to v2.4 values were not found, and they are 180 seconds. Pages were updated instead, see [[findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim]] and [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]. A human decides whether to reopen any of them or leave the Resolution as a record of what was known at close.
- **Why:** Closed Resolutions stay as the reasoning trail, and the reader should know which statements were later refined. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-capi-argocd]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Review closed gap resolutions refined by the b1 recheck of kro and Crossplane — status: open

- **What:** Closed gaps were not edited. Two closed Resolutions carry statements the recheck refines. "kro released-version tuning defaults and instance conditions" says the v0.9.4 rate-limiter table was not fully read and conditions come from docs (both are now read from source, and the `FAILED` state is a deprecated legacy constant). "Crossplane v2 condition behavior and the fix for async Synced signaling" says the body of PR 8080 was not read (it is read: it fixes stale XR condition replay and not async Synced). Review whether the user wants to reopen or annotate them through `sticki-gaps`.
- **Why:** Closed Resolutions stay as the reasoning trail, and the reader should know which statements were later refined. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-kro-crossplane]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Review closed gap resolutions refined by the b1 recheck of Flux and Kubernetes — status: open

- **What:** Closed gaps were not edited. Six closed Resolutions carry "Not settled" statements the recheck refines: "Flux default reconcile interval and drift-detection wording" (the jitter value is 5 percent and the wording originated in a 2022-08-10 docs commit), "Flux pre-dry-run manager takeover flag and current SSA documentation" (the helm-controller flag and Helm 4 server-side apply are now read), "Mutating Admission Policy release status" (the v1.30 docs figure is explained by the gate registration), "StorageVersionMigration GA details in Kubernetes v1.37" (the progress layout is text in the `Running` message), "Requeue true backoff behavior in current controller-runtime" (issue 808 never claims an immediate requeue), and "Scale numbers from model digests need rechecking" (the KEP-1040 residual is now read). Review whether the user wants to annotate them through `sticki-gaps`.
- **Why:** Closed Resolutions stay as the reasoning trail, and the reader should know which statements were later refined. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-flux-k8s]] supplies the evidence.
- **Acceptance:** User decision recorded for each closed gap.
- **Drafted by:** agent on 2026-11-26

## Close the resolved-candidate gaps from the mechanics and accuracy pass — status: open

- **What:** Run `sticki-gaps` to review and close the 14 gaps marked resolved-candidate in [[findings/mechanics-and-accuracy-pass-gap-dispositions]]. Start with the ones whose remainder is a single named detail: the Argo CD and Flux finalizer gaps, Cluster API issue 1514, informer resync, CEL cost limits, the conversion webhook and garbage collection gap, and Config Connector conflict handling.
- **Why:** Only the user closes gaps. The pass added possible-resolution notes and closed none.
- **Acceptance:** Each resolved-candidate gap is closed with a Resolution paragraph or left open with a reason.
- **Drafted by:** agent on 2026-11-26

## Decide on the 26 partial and 3 still-open mechanics gaps — status: open

- **What:** Review the 26 partial and 3 still-open rows in [[findings/mechanics-and-accuracy-pass-gap-dispositions]]. Two still-open gaps ("best default conflict policy" and "criteria for choosing an operator framework") are decisions the user can make without more research, using [[decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field]] and the operator-framework decision page.
- **Why:** Each needs a user decision: another targeted pass, close as unanswerable with current sources, or accept the decision page.
- **Acceptance:** Each gap has a decision recorded.
- **Drafted by:** agent on 2026-11-26

## Fetch the sources the mechanics and accuracy pass could not read — status: open

- **What:** Save the pages listed under "Needs manual fetch" in [[findings/mechanics-and-accuracy-pass-gap-dispositions]] into `raw/`, then ingest them. They include the Skyscanner Medium post, the Crossplane Pods guide page, the kro KREP-004 and KREP-014 documents, the Config Connector ways-to-install and resource-acquisition pages, Crossplane runtime issue 1150 in full, and the OneUptime and Kubernetes finalizer blogs whose URLs were not found.
- **Why:** The scrape tools returned empty bodies or no results, and some remainders in partial gaps depend on these pages.
- **Acceptance:** Each source is saved and ingested, or recorded as unavailable.
- **Drafted by:** agent on 2026-11-26

## Recheck Cluster API MachineHealthCheck and ClusterClass once v1.15.0 final ships — status: open

- **What:** Cluster API v1.15.0 final did not exist on 2026-11-26; every v1.15 statement in Part 1, Part 4 and the Cluster API pages is a release-candidate claim (see [[findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim]]). When it ships, recheck the MachineHealthCheck threshold and the `ClusterTopology` gate.
- **Why:** The outputs now state these as release-candidate claims and need the final-release check.
- **Acceptance:** Pages and outputs corrected or confirmed against the final release.
- **Drafted by:** agent on 2026-11-26

## Review the unrevised passages that kept their caveats in the seven outputs — status: open

- **What:** The diff check found no output todo left unapplied, but several revised passages keep caveats the dossiers could not settle (for example unread KREP documents, the Airbnb webhook talk, Config Connector direct controllers, and managed-distribution defaults for the owner-reference admission plugin). Read each output once for these and decide whether to keep the caveat or reopen research.
- **Why:** The outputs are still `draft`, and a delivery review is the point at which leftover caveats should be accepted or removed.
- **Acceptance:** Each remaining caveat is accepted, researched, or dropped.
- **Drafted by:** agent on 2026-11-26

## Done

## Update crossplane-ramp-up for the v2.5 verification pass — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, revise four passages. (1) Section 5, the paragraph beginning "The v2 scope matters for tenancy" lists `LegacyCluster` as a v2 alternative scope, but it exists only on the v1 XRD API, so cite [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]]. (2) Section 7, the paragraph beginning "Two failure patterns", should say the async `Synced` problem is unfixed (issue closed as stale) and cite [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]]. (3) Section 12 and the "Modularity of providers" principle describe activation policies without maturity or the default, so cite [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]] and state they are alpha. (4) The closing unknowns paragraph says the default poll interval, claim support, and Operations details are unconfirmed, so cite [[sources/research-gap-g3-crossplane-v2]] and [[findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references]]. Also the `managementPolicies` passage in section 4 should note it is beta, citing [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].
- **Why:** The 2026-11-26 verification pass corrected or settled these claims. Outputs are not edited by ingest.
- **Acceptance:** The passages are revised through `sticki-summarize` or by hand, each citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-4 for the v2.5 verification pass — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, revise the scope paragraph in section 4 (beginning "The scope field leads to the v1 and v2 difference") to say that `LegacyCluster` is a v1 XRD scope and that v2 XRDs reject claims, citing [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]]. Revise the `managementPolicies` paragraph (beginning "The `managementPolicies` list is the main safety lever") to state it is beta and to cite [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]]. Revise the provider-families packaging paragraph to mention that activation policies are alpha, citing [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]].
- **Why:** The dossier ingested on 2026-11-26 verified these points against v2.5 sources.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 3 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 for the v2.5 verification pass — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, revise the Crossplane scale paragraph (beginning "For Crossplane the dominant scale problem is CRD count") to mark activation policies alpha and the default Helm install as activating everything, citing [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]]. Revise the reconcile-load paragraph that says present managed-resource poll defaults are unknown to cite the v2.5 Pods guide figures (one-minute polling, hourly re-check) from [[sources/research-gap-g3-crossplane-v2]]. In the conditions section, state that the async `Synced` pitfall is unfixed, citing [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]]. The real incident to cite is provider-aws issue 2287, see [[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]].
- **Why:** The 2026-11-26 verification pass corrected or settled these claims.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-3 for the kro v0.10.0 verification pass — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, revise three places that treat kro's tuning values as unreleased. The paragraph on failure retries that says kro, "according to its unreleased documentation", combines exponential backoff from 200 milliseconds to 1000 seconds with a token bucket; the "How they time the loop" paragraph that says "kro's unreleased documentation lists a full resync every 10 hours"; and the source list entry `https://kro.run/next/docs/advanced/controller-tuning`. The released v0.10.0 page (2026-11-10) lists the same values, so the passages can cite the released version, and the kro instance requeue interval (3 seconds, exponential backoff capped at five minutes) can be added. Cite [[examples/kro-shared-queue-tunes-throughput]] and [[sources/research-gap-g3-kro]].
- **Why:** The 2026-11-26 kro dossier verified the defaults at a released version, so the unreleased-docs caveat no longer applies.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-4 for the kro v0.10.0 verification pass — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, revise two passages. (1) The readiness paragraph in the kro section (beginning "Ordering and readiness are two separate mechanisms") should name the four built-in instance conditions (`InstanceManaged`, `GraphResolved`, `ResourcesReady`, `Ready`), say that only `Ready` is a stable contract, and say that the RGD condition set has five members including `GraphRevisionsResolved`; cite [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]] and [[findings/a-kro-includewhen-on-a-volatile-upstream-status-field-makes-resources-flip-flop]]. (2) The maturity paragraph (beginning "Rollout and maturity matter too") says kro runs on one shared queue "per its unreleased documentation"; it should cite the released v0.10.0 values, and it can add that the Graph API is alpha with no compatibility guarantee, has no revisions, and needs a manual CRD apply ([[findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates]], [[findings/enabling-the-kro-graph-api-needs-a-manual-crd-apply-because-helm-does-not-update-crds-on-upgrade]]). Governance, if mentioned, should say kro is a Kubernetes SIG Cloud Provider subproject ([[entities/kro]]).
- **Why:** The 2026-11-26 kro dossier corrected and extended these facts against the v0.10.0 documentation.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 for the kro v0.10.0 verification pass — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, revise the paragraph beginning "The same split-by-key idea appears outside GitOps". It says "unreleased kro documentation gives a default of 20 retries" and "Treat all of these as unreleased-doc values that may differ in released versions". The v0.10.0 release documents the same values, so drop the caveat, cite the released version, and optionally add the documented note that per-RGD queues may replace the shared queue and the collection limit of 1000 items ([[findings/a-kro-foreach-collection-above-the-1000-item-default-limit-gets-stuck-during-deletion]]). Cite [[examples/kro-shared-queue-tunes-throughput]] and [[sources/research-gap-g3-kro]].
- **Why:** The 2026-11-26 kro dossier verified the defaults at a released version.
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-1 for the reconcile defaults verification pass — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, revise three places. (1) In the detection-cadence table, the Flux Kustomization row says "`interval`, minimum 60 seconds" and should say the interval is required with no default and 60 seconds is a recommended minimum; the Argo CD row should say 120 seconds plus up to 60 seconds of jitter in v3.x and 180 seconds in v2.x; the Crossplane row says "Configurable poll interval; default not confirmed" and should give 1 minute in core and runtime and 10 minutes in Upjet providers; the ACK row can drop "About". (2) The sentence beginning "The wiki notes that Flux's concepts page gives a five-minute default interval" should say the interval is required, has no controller-side default, and the five-minute figure is documentation shorthand. (3) The provider-controller paragraph on Config Connector cadence can add the 10 minute mean with jitter. Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]], [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]], [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]], and [[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-2 for the reconcile defaults verification pass — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the cloud add-ons paragraph says ACK has "a periodic resync that the dossier states as ten hours by default (flagged for re-verification)". The 10 hour default is now verified against the ACK drift-recovery page and the runtime constant, so the re-verification flag can be dropped. Cite [[entities/ack]] and [[sources/research-gap-g3-reconcile-defaults]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-3 for the reconcile defaults verification pass — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the "How they time the loop" paragraph says Flux uses `spec.interval` "with a minimum of 60 seconds" and that Argo CD polls on "a 120 second cadence with up to 60 seconds of jitter". Revise it to say the Flux interval is required with a recommended 60 second minimum and no controller default, and that Argo CD's 120 plus 60 second figure is the v3.x default (v2.x was a flat 180 seconds). It can also add the Crossplane 1 minute and 10 minute poll defaults and Config Connector's 10 minute jittered mean. Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]], [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]], and [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 for the reconcile defaults verification pass — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, revise two passages. The Flux Kustomization paragraph says "the Kustomization page gives a minimum of 60 seconds" and should say the interval is required with a recommended 60 second minimum. The delivery-layer paragraph says Argo CD polls "on a 120-second cadence with up to 60 seconds of jitter" and should name v3.x (180 seconds in v2.x). Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]] and [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update the Flux ramp-up for the reconcile defaults verification pass — status: done

- **What:** In `outputs/flux-ramp-up.md`, revise three passages. The interval paragraph ("the Kustomization API page documents a minimum of 60 seconds, though the wiki's sources disagree about the default") and the following "A note on defaults" paragraph, which says the wiki flags the default as needing verification, should now say that `.spec.interval` is required, no controller-side default exists, the 60 second minimum is a recommendation, and the five-minute figure on the concepts page is shorthand; the advice to set the interval explicitly stays. The unknowns paragraph near the end that says the default is "stated as five minutes on one page and has a 60 second minimum on another" should be corrected the same way. Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]] and [[entities/flux]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update the Crossplane ramp-up for the reconcile defaults verification pass — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the reconcile-load paragraph says the managed resource poll interval "is the one the wiki did not confirm from the sources it read", and the unknowns paragraph says "The default poll interval and backoff values for managed resources were not confirmed". The poll interval is now verified at 1 minute in crossplane-runtime and core and 10 minutes in Upjet providers (with a 1 hour sync period, `--max-reconcile-rate` 100, and 5 percent jitter), and the per-resource `crossplane.io/poll-interval` annotation is implemented. Backoff values remain unverified. Cite [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]] and [[entities/upjet]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-1 for the Kubernetes and controller-runtime verification pass — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, revise the reconcile-return-values passage (around line 133) that says "the sources disagree about whether `Requeue: true` backs off ... an issue thread describes an immediate one". At controller-runtime v0.25.3 it is a rate-limited requeue with per-item exponential backoff, and `RequeueAfter` forgets the failure history before waiting.
- **Why:** The 2026-11-26 dossier read the v0.25.3 source and settled the conflict, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]].
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-2 for the Kubernetes and controller-runtime verification pass — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, revise two passages. The storage migration paragraph (around line 191) says one uncross-checked blog reports StorageVersionMigration as GA in 1.37 and that automatic triggering is unknown, and it should say the API is GA and on by default in v1.37 and is triggered by a user-created object. The admission paragraph (around line 263) says one digest reports MutatingAdmissionPolicy as stable since 1.36 and asks for a cross-check, and it should say it is GA and enabled by default since v1.36, with Alpha 1.32 and Beta 1.34 from the gate table.
- **Why:** The 2026-11-26 dossier verified both against CHANGELOGs and feature-gate tables, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[concepts/crd-versioning-and-storage-migration]], [[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]], and [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-3 for the Kubernetes and controller-runtime verification pass — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, revise two passages. The `Result{Requeue: true}` paragraph (around line 183) says sources disagree and that an issue summary reads it as immediate, and it should say it is a rate-limited requeue with exponential backoff at v0.25.3. The cache-lag paragraph (around line 153) can now add the v1.36 built-in fix, in which four kube-controller-manager controllers skip a sync until the cache has seen their own write.
- **Why:** The 2026-11-26 dossier verified both against controller-runtime v0.25.3 and the Kubernetes v1.36 and v1.37 CHANGELOGs, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]] and [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 for the Kubernetes and controller-runtime verification pass — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the controller-mechanics paragraph (around line 290) says `Requeue: true` is "deprecated and described inconsistently across sources", and it should say the behavior is settled at controller-runtime v0.25.3 (rate-limited, exponential backoff).
- **Why:** The 2026-11-26 dossier read the v0.25.3 source, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]].
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update flux-ramp-up for the verified pre-dry-run takeover flag — status: done

- **What:** In `outputs/flux-ramp-up.md`, the client-side to server-side migration paragraph (around line 255) says the issue 1722 flag "runs takeover before the dry run, which a maintainer called dangerous; the shipped semantics were not verified in the wiki". It should name `--override-manager-before-dry-run`, say it first shipped in kustomize-controller v1.10.0 (2026-10-24) and Flux v2.10.0 (2026-10-26), and say that it is a separate opt-in list that transfers all fields of the named managers, prunes fields missing from the source, is not reverted on failure, and should be removed after recovery. The open-questions passage (around line 340) should drop the unverified caveat for this flag.
- **Why:** The 2026-11-26 dossier verified the flag against PR 1747 and the v1.10.0 source and docs, see [[sources/research-gap-g3-flux-ssa-helm]]. Cite [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]] and [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]]. The helm-controller `--override-manager` passage (around line 257) is not affected and stays unverified.
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-1 for the Cluster API v1beta2 MachineHealthCheck behavior — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, the brake paragraph (around line 222) says Cluster API's `maxUnhealthy` "short-circuits remediation", and the Cluster API paragraph (around line 322) says the v0.4 book is the source and "current behavior may differ". Both should use the v1beta2 name `remediation.triggerIf.unhealthyLessThanOrEqualTo` (v1.11.0 onward, `maxUnhealthy` deprecated) and say the brake is off by default, with a default threshold of 100 percent.
- **Why:** The 2026-11-26 dossier read the v1beta2 types and guide at v1.15.0-rc.0, see [[sources/research-gap-g3-argocd-capi]]. Cite [[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]] and [[findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-4 for ClusterClass maturity — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, the cluster provisioning paragraph (around line 263) says the Cluster API landing page "labels the feature experimental" and that the label "may be out of date". It should say the `ClusterTopology` gate is Beta and enabled by default as of v1.15.0-rc.0 (2026-11-24), that v1.14.4 docs still say alpha, and that v1.15.0 final was not yet released.
- **Why:** The 2026-11-26 dossier read the v1.15.0-rc.0 docs and feature-gates table, see [[sources/research-gap-g3-argocd-capi]]. Cite [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]] and [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 for the Argo CD sharding maturity recheck — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the Argo CD sharding paragraph (around line 224) says the non-legacy algorithms "were labelled experimental in the digest". It should say they are still labelled experimental (Alpha) in the Argo CD v3.6.3 docs, with the same wording since v2.14.0, and that the current default method is unconfirmed.
- **Why:** The 2026-11-26 dossier read the high-availability and feature-maturity pages at v3.6.3, see [[sources/research-gap-g3-argocd-capi]]. Cite [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]] and [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-4 for the scale figures recheck — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, the paragraph beginning "The most instructive operational story in this area is about counts" (around line 94) says Upbound found "several MiB of memory per CRD" and that "The figures came through digests of the posts, so check them against the originals before quoting". It should say "a little over 4 MiB" of resident memory per CRD, described as an Upbound self-report, and drop the digest caveat for these figures.
- **Why:** The 2026-11-26 dossier reread the Upbound post and the Crossplane design doc and blog from raw text, see [[sources/research-gap-g3-scale-recheck]]. Cite [[examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes]] and [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 for the scale figures recheck — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, three passages need revision. The CRD paragraph (around line 214) says "several MiB per CRD" and that the details "came through a digest and the numbers need checking"; it should say "a little over 4 MiB" per CRD (an Upbound self-report) and note the figures were rechecked against the raw post. The cluster-envelope paragraph (around line 202) should add that the SIG Scalability table covers built-in types only and says its thresholds are not hard limits. The open-questions paragraph (around line 288) says the scale dossier relies on digests for most numbers; it should say the quoted figures were rechecked on 2026-11-26 and only parts of KEP-1040 remain unread. The workqueue discussion (around line 206) may also note that controller-runtime's default limiter has no overall token bucket when its priority queue is on.
- **Why:** The 2026-11-26 dossier reread these sources from raw text, see [[sources/research-gap-g3-scale-recheck]]. Cite [[findings/the-sig-scalability-thresholds-cover-built-in-types-only-and-are-not-hard-limits]], [[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]], [[findings/the-default-workqueue-rate-limiter-differs-between-client-go-and-controller-runtime]], and [[findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 for the control-plane outage postmortems — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, three passages need revision. The OpenAI paragraph (around line 212, beginning "The failure that ties this together") says the wiki read only a commentary and not the primary postmortem; it should cite the primary status-page post-mortem of 2024-12-11 (every node ran expensive API operations, DNS depended on the control plane, engineers were locked out) and drop the caveat, and the webhook sentence there should note that Jetstack's 2019 postmortem is now a verified case. The webhook paragraph (around line 254) says the wiki read only index-level descriptions; it should describe the Jetstack mechanism. The evidence paragraph (around line 292) says no control-plane-as-platform outage postmortem was found and the k8s.af webhook postmortems were not read; it should say OpenAI, Jetstack, and Neon were read, the Airbnb talk is still unread, and no CRD deletion cascade or etcd quota alarm postmortem was found.
- **Why:** The 2026-11-26 dossier read three primary postmortems, see [[sources/research-gap-g1-outage-postmortems]]. Cite [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]], [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]], [[examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query]], and [[findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-2 for the Jetstack webhook postmortem — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the "Webhook outages" paragraph (around line 291) says the k8s.af index lists several webhook postmortems and that the linked posts were not opened. It should say the Jetstack 2019 post was read (an OPA validating webhook blocked the API server's own `kube-system` ConfigMap write during a GKE master upgrade, and node auto-repair then looped) and that the index has only two webhook-tagged entries, Jetstack and Airbnb, with the Airbnb talk still unread.
- **Why:** See [[sources/research-gap-g1-outage-postmortems]]. Cite [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]] and [[findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-1 for the primary OpenAI postmortem — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, the "Control-plane overload" paragraph (around line 276) and its source list (around line 366, which cites only the ahmet.im commentary) rest on the commentary. The paragraph should describe the OpenAI outage from the primary post-mortem and the source list should add https://status.openai.com/incidents/ctrsv3lwd797. The paragraph's etcd quota figure of about 2 GB matches the CNCF blog's "2GiB" default, which is SECONDARY-ONLY.
- **Why:** See [[sources/research-gap-g1-outage-postmortems]]. Cite [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]] and [[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]].
- **Acceptance:** Passage and source list revised.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 and part-3 evidence passages for the GitOps incidents dossier — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the evidence paragraph (around lines 288 to 292) says named production adopters are mostly self-reported and that the wiki found no named-company postmortem of an accidental prune. It should say named adopter lists exist (Argo CD USERS.md with 452 self-reported entries, the Subaru case study) and that reporter-level prune and cascade incidents were found (Argo CD issues 6046, 20440, and 15441, and ACK issue 2911), while no named organization's postmortem was found. In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph around line 318 says no named-company postmortem exists for stuck-finalizer data loss. It should add that no rate for orphaning after forced finalizer removal was found and that primary issues document orphaning by other routes.
- **Why:** See [[sources/research-gap-g1-gitops-drift-incidents]]. Cite [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]], [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]], and [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-1 unintended-deletion passage with the GitOps prune incidents — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, the "Unintended deletion" paragraph (around line 270) is based on documentation warnings. It can now cite real reports, such as Argo CD issue 15441 (a namespace recreated when its manifest was removed under `CreateNamespace=true`) and ACK issue 2911 (an Argo CD prune stranding a CR on its finalizer), and the self-heal incident in which a migration hook was skipped.
- **Why:** See [[sources/research-gap-g1-gitops-drift-incidents]]. Cite [[findings/unintended-deletion-through-prune]], [[examples/argo-cd-issue-15441-removing-a-namespace-manifest-under-createnamespace-deleted-and-recreated-the-namespace]], and [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 3 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 evidence note with the operator loop incidents — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the evidence paragraph (around line 318) says the wiki found no named-company postmortem for several mechanics, such as runaway reconcile loops, and that the pitfalls rest on documentation and not incident reports. It should add that issue-level reports with root causes now exist for runaway loops (Cluster API provider RKE2 issue 905, Longhorn issue 13831, kube-shard issue 121, Crossplane issue 7221), a retry loop that grew controller memory about 25 times (Longhorn issue 14121), and lost events (Kubernetes issue 115658, NVSentinel issue 1542), while no formal organization-authored operator postmortem was found and every figure is self-reported.
- **Why:** See [[sources/research-gap-g1-operator-loop-failures]]. Cite [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object]], and [[findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 failure-mode evidence note with the operator loop incidents — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the fourth evidence paragraph (around line 292) says the wiki found no named-company postmortem of a runaway reconcile loop. It should say that no named-company postmortem was found, and that named issue-level incidents exist with reporter-measured rates (about 10, 6, and 13 reconciles per second in three projects).
- **Why:** See [[sources/research-gap-g1-operator-loop-failures]]. Cite [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm]], and [[findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 3 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 observedGeneration passage with the 2026 early-Ready cases — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "Missing `observedGeneration` has a different cost" (around line 211) rests on ACK issue 1583 alone. It can now add three dated 2026 cases: CloudNativePG issue 11390, restate-operator issue 216 (Flux `wait: true` marking a release healthy about 37 seconds early), and Argo CD issue 30373 (the built-in ACK health check).
- **Why:** See [[sources/research-gap-g1-operator-loop-failures]]. Cite [[findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed]] and [[examples/restate-operator-issue-216-ready-true-before-a-statefulset-rollout-finished-let-flux-mark-the-release-healthy]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update crossplane-ramp-up ambiguous-create paragraph with the shipped opt-out and the upjet gap — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the "Ambiguous create" paragraph (around line 306) says the issue 3037 proposal to let deterministic-identifier resources opt out "was closed as not planned". The opt-out now exists in crossplane-runtime as `WithDeterministicExternalName`, and provider-upjet-aws issue 2251 reports that upjet controllers do not set it. The paragraph can also cite the reporter-measured cost case, provider-upjet-aws issue 2199 (about $155 over 15 days, self-reported). The "closed as not planned" wording is not restated by the new dossier and should be rechecked before it is kept.
- **Why:** See [[sources/research-gap-g1-leaked-resources-adoption]]. Cite [[findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error]] and [[examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update crossplane-ramp-up adoption passage with the reproduced adopt-or-create failures — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "Other tools answer the same two questions" (around line 270) says adopt-or-create "can take over a look-alike resource" as a general warning. It can now cite reproduced cases: ACK issue 3149 (two custom resources overwrote one IAM role and deleting either deleted it, run against moto) and Config Connector issue 14236 (acquisition removed settings the CRD does not model, a reporter claim). It should also say that no production comparison of the policies exists.
- **Why:** See [[sources/research-gap-g1-leaked-resources-adoption]]. Cite [[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]] and [[findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 ambiguous-create and adoption passages with the 2026 incident evidence — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the "Crossplane case" paragraph (around line 116) describes the pending marker and says failing safe does not scale but mentions neither the runtime opt-out nor any dated incident, and the "How they handle ambiguous creates and existing resources" paragraph (around line 328) presents ACK adopt-or-create as making a retried create converge. They can now say that the runtime opt-out shipped but upjet providers do not set it, that an ACK audit counts 48 resources in 22 controllers where a lost create response duplicates the resource or wedges the custom resource (author's audit, not an incident count), and that a CI run created a duplicate VPC endpoint. Convergence under adopt-or-create holds only if the identifier was recorded.
- **Why:** See [[sources/research-gap-g1-leaked-resources-adoption]]. Cite [[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]], [[examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours]], and [[findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 3 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update flux-ramp-up adopters and sharding passages with the named-adopters evidence — status: done

- **What:** In `outputs/flux-ramp-up.md`, the adopters paragraph (around line 49) says the adopters page lists "more than 200 organizations", which the 2026-11-26 dossier could not reproduce (127 `name:` lines in the data file), and the sharding and Morgan Stanley passages can now state that no organization was found running sharded Flux and that Morgan Stanley lists sharding as future work.
- **Why:** See [[sources/research-gap-g1-named-adopters]]. Cite [[entities/flux]], [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]], and [[findings/a-flux-dependson-across-shards-failed-with-dependency-not-found-until-a-2024-fix]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 scale passages with adopter, sharding, APF, and kro evidence — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the Flux sharding paragraph (around line 220) says no source states a threshold, but the sharding docs advise sharding at "tens of thousands of applications" and the project benchmark gives 1000 Kustomizations in 4m13s. The open-evidence paragraph (around line 288) can cite named self-reported adopters, the missing sharded-Flux adopter, the APF-aware Flux change, and the kro corrections. The kro queue paragraph (around line 226) can cite the starvation proposal.
- **Why:** See [[sources/research-gap-g1-named-adopters]]. Cite [[examples/the-flux-benchmark-reconciles-1000-kustomizations-in-4-minutes-13-seconds-on-flux-v2-10-0]], [[findings/flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026]], and [[findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update crossplane-ramp-up and part-4 adopter passages with the numeric entries — status: done

- **What:** In `outputs/crossplane-ramp-up.md` (around line 60) and `outputs/part-4-platform-abstractions.md` (around line 265), the adopter paragraphs can name Consensys, Built Technologies, and SpareBank 1 Utvikling with their self-reported figures. The kro paragraph in `outputs/crossplane-ramp-up.md` (around line 346) can note that kro has no adopters file and no named production adopter.
- **Why:** See [[sources/research-gap-g1-named-adopters]]. Cite [[examples/built-technologies-reports-peaks-above-10000-aws-resources-managed-by-crossplane-in-a-developer-environment]] and [[entities/kro]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 webhook-outage paragraph with the Jetstack primary post — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "Webhook outages are a recurring class in the k8s.af index" (around line 254) says the wiki read only index-level descriptions. The Jetstack post has now been read in full, and the paragraph should say so, name its mechanism, and avoid attributing any `failurePolicy` advice to Jetstack.
- **Why:** See [[sources/research-gap-g1-named-incident-reports]]. Cite [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]].
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-1 evidence note with the other-tool pitfall reports — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, the evidence note near line 280 says the wiki "found no pitfalls specif..." to kro, Config Connector, ACK, or Cluster API. It should say that first-party issue-level reports now exist for all four, as open reporter claims with no named-organization postmortem.
- **Why:** See [[sources/research-gap-g1-other-tool-pitfalls]]. Cite [[findings/no-named-organization-postmortem-was-found-for-kro-config-connector-ack-or-cluster-api]].
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-4 kro passages with the breaking-change gate reports — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, the rollout and maturity paragraph near line 239 (beginning "Rollout and maturity matter too") says breaking schema changes are blocked unless the override annotation is set. It should add that two September 2026 user reports say the error did not name the annotation and that an added enum or CEL marker was not patched into the live CRD, plus the issue 886 shared-failure-domain report.
- **Why:** See [[sources/research-gap-g1-other-tool-pitfalls]]. Cite [[findings/a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd]] and [[findings/one-unhealthy-kro-resource-graph-definition-blocked-updates-to-every-other-definition]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 deletion guardrails with the ACK and Config Connector reports — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the deletion paragraphs near lines 172 and 174 and the guardrails paragraph near line 266 say ACK and Config Connector offer retain and abandon opt-outs. They should note the open 2026 reports that the ACK namespace retain annotation is ignored in single-namespace installs, that a pruned ACK CR deletes the AWS resource irreversibly, that Config Connector `abandon` does not release stuck Direct-controller resources, and that a stale deletion can run after leader failover.
- **Why:** See [[sources/research-gap-g1-other-tool-pitfalls]]. Cite [[findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs]], [[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]], and [[findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Review claims still UNVERIFIED after the evidence pass — status: done

- **What:** List the claims the dossiers marked UNVERIFIED or secondary-only (for example the helm-controller `--override-manager` passage in the Flux ramp-up, whether old Crossplane concepts URLs redirect, the Reddit Pi-day outage details, and Crossplane issue 7453) and decide whether to re-research or keep the caveat.
- **Why:** These caveats remain in the pages and outputs and are the main accuracy risk left.
- **Acceptance:** Each UNVERIFIED claim is re-researched, caveated in place, or dropped.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: the b1 dossiers re-researched the named claims. The helm-controller `--override-manager` flag is confirmed (v1.5.0), the old Crossplane concepts URLs return 404 with redirects only for end-of-life versions, the Reddit and Skyscanner postmortems are now primary sources, and Crossplane issue 7453 was source-read (not reproduced). Remaining caveats are recorded in [[findings/mechanics-and-accuracy-pass-gap-dispositions]] and in the manual-fetch todo.

## Finish the outputs the Revise phase did not reach — status: done

- **What:** Six output todos above still show no edit citing their evidence pages: part-4 v2.5 pass, part-2 Jetstack webhook, part-1 GitOps prune passage, part-5 operator-loop failure-mode note, crossplane-ramp-up adoption passage, and part-3 ambiguous-create and adoption passages. Several done todos also cover only some of their cited pages, so re-check them against their What lines.
- **Why:** The seven outputs were revised in the working tree but not every drafted todo was applied.
- **Acceptance:** Remaining passages revised, or todos dropped with a reason.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: the second Revise phase applied the six named todos and the later b1 and m1 to m7 todos. Each was checked by confirming that every page cited in its Acceptance line appears in the added lines of the diff of the output it names. Per-passage checks of the still-caveated wording are left to the delivery review.

## Recheck release-candidate and unread items noted in the closed-gap resolutions — status: done

- **What:** Recheck the items the 22 newly closed gap Resolutions mark as not settled: Cluster API MachineHealthCheck and ClusterClass at v1.15.0 final (read at rc.0); kro v0.9.4 rate-limiter table and instance conditions from Go source; the body of Crossplane PR 8080 for async Synced signaling; KEP-1040 in full; helm-controller driftDetection and Helm 4 server-side apply; whether old Crossplane concepts URLs redirect; and the Kubernetes docs-versus-code stage discrepancies for Mutating Admission Policy and StorageVersionMigration.
- **Why:** The gaps are closed with their caveats written into the Resolution, so these remainders now live only in prose and would be easy to lose.
- **Acceptance:** Each item is rechecked and the affected pages corrected, or dropped with a reason.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: rechecked in the four b1 dossiers (kro rate-limiter table and conditions from source, PR 8080 body, KEP-1040 README, helm-controller flag and Helm 4 SSA, Mutating Admission Policy and StorageVersionMigration stages). Cluster API v1.15.0 final still does not exist, so that one item moved to the todo "Recheck Cluster API MachineHealthCheck and ClusterClass once v1.15.0 final ships"; the closed Resolutions themselves are tracked in the "Review closed gap resolutions" todos.

## Update part-5 and part-1 evidence notes with the Skyscanner and Reddit primary postmortems — status: done

- **What:** Part 5 section 10 and Part 1's evidence note say the Skyscanner, Reddit and Spotify incidents are index-level or secondary-only and that no named-organization GitOps outage postmortem was found. Skyscanner (2021, Argo CD deleted 478 services) and Reddit (2023, Kubernetes 1.24 label removal and Calico route reflectors) are now primary sources. Spotify (2018 to 2019 cluster deletions through the console and Terraform, no end-user impact) is also now a primary source. Revise those passages and cite [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]] and the Reddit example page.
- **Why:** The outputs currently understate the evidence and name Skyscanner as unread.
- **Acceptance:** The passages cite the primary pages and no longer call these incidents index-only.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Batch 1 (P0 to P2): run the mechanics-and-accuracy-pass workflow — status: done

- **What:** Run `workflows/mechanics-and-accuracy-pass.js`: finish the pending tutorial revisions (P0), re-research UNVERIFIED claims and recheck release-candidate items (P1), and research seven clusters of mechanics gaps (finalizers, ownership and GC, status and conditions, SSA and conflict policy, informers and caches, admission and CRDs, operators and idempotency) (P2).
- **Why:** The tutorials still understate the wiki's own evidence, and the mechanics gaps are the core of Parts 2 and 3.
- **Acceptance:** Twelve verified dossiers ingested serially, a triage page, the seven tutorials revised and reviewed, a cross-document consistency pass, and a final commit.
- **Drafted by:** agent on 2026-11-26
- **Paused:** 2026-11-26 at the user's request, mid-run (run `wf_449f204e-c5c`, 11 clusters). Done and committed: research and verify for all but the SSA cluster, and serial ingests through seq 54 (the four accuracy clusters and m1-finalizers). Written but not yet ingested (untracked in `raw/`): the m2, m3, m5, m6 and m7 dossiers. Not yet run: m4 (SSA and conflict policy) research or verify, the remaining ingests, triage, the tutorial revisions, the consistency check, and finalize. The working tree was clean when paused.
- **Resume:** run the Workflow tool with `scriptPath` `workflows/mechanics-and-accuracy-pass.js`, `resumeFromRunId` `wf_449f204e-c5c`, and `args` `{"today":"2026-11-26","baseSha":"09d4014"}`. Finished research, verify and ingest calls replay from cache; the in-flight calls rerun. If the cache is gone, relaunch without `resumeFromRunId`, but first move the five untracked dossiers aside or delete them so the researchers do not overwrite verified text, and skip the clusters already ingested (edit `CLUSTERS` to drop the b1 clusters and m1).
- **Outcome:** 2026-11-26: the workflow ran to completion. Eleven dossiers were ingested serially (b1-unverified-claims, three b1 rechecks, m1 to m7), creating 142 pages; the triage page [[findings/mechanics-and-accuracy-pass-gap-dispositions]] records 14 resolved-candidate, 26 partial and 3 still-open gaps out of 43; the seven outputs were revised and each output todo above was checked against the diff. No gap was closed.

## Run build-wiki workflow — status: done

- **What:** Run `workflows/build-wiki.js` to fan out web research per concept, ingest sources, plan outputs, and draft the tutorial series.
- **Outcome:** 2026-11-25: 28 research dossiers plus the seed vocabulary were ingested (29 sources), producing 493 content pages, and the five-part series plus the Flux and Crossplane ramp-ups were drafted in `outputs/` (about 66,000 words). Review and delivery are tracked separately.

## Close the resolved-candidate gaps from the evidence and fact-check pass — status: done

- **What:** Run `sticki-gaps` to review and close the 22 gaps marked resolved-candidate in [[findings/evidence-and-fact-check-pass-gap-dispositions]]. Start with the Crossplane v2 status gaps, the reconcile-default and controller-runtime gaps, and the OpenAI postmortem gap.
- **Why:** Only the user closes gaps. The pass added possible-resolution notes and closed none.
- **Acceptance:** Each resolved-candidate gap is closed with a Resolution paragraph or left open with a reason.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: closed all 22 resolved-candidate gaps with Resolution paragraphs the user confirmed in three batches (Closed by Eric Shamay); each Resolution states what remains unsettled. 102 gaps remain open.

## Update flux-ramp-up field ownership passage with the confirmed helm-controller flag — status: done

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "**Field ownership blocks drift correction.**" says the `--override-manager=kubectl-edit` fix is "stated as available since helm-controller v1.5.0, but it comes from a community member, not a maintainer, so verify it". The helm-controller CHANGELOG confirms the flag in its 1.5.0 section (2026-02-20) and says it is unrelated to Helm v4 server-side apply. Cite [[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]] and drop the verify-it caveat, keeping the note that the before-or-after-dry-run behavior was not checked.
- **Why:** The ramp-up still presents a confirmed flag as unverified. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 staleness passage with the ReplicaSet and StatefulSet metrics and the read-your-writes release — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "When a DaemonSet or Job sync is deferred" says the wiki found no changelog names for the ReplicaSet and StatefulSet counters. Master source defines `stale_sync_skips_total` under the `replicaset_controller` and `statefulset_controller` subsystems (not pinned to a release). Cite [[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]]. Also add that controller-runtime v0.25.0 shipped an experimental, opt-in read-your-writes client option, citing [[findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client]], wherever the part says no controller-runtime release gives that behavior.
- **Why:** The part states the metric names as unknown and may state the read-your-writes release as unconfirmed. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 Argo CD sharding passage with the confirmed legacy default — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "Argo CD shards by destination cluster" says the current default is unconfirmed because the v3.6.3 high-availability page drops the "(default)" marker. The source sets `DefaultShardingAlgorithm = LegacyShardingAlgorithm` at v3.0.0 and v3.6.3, so the default is `legacy`. Cite [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]].
- **Why:** The part leaves a settled default as unconfirmed. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update crossplane-ramp-up unknowns passage with the docs page and URL findings — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "The wiki is honest about what it does not know" says the managed-resource poll interval was verified from source "although backoff values and the docs page were not read". The docs page was read and states no poll interval default, so it cannot be cited for the number. Cite [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]]. If the ramp-up links any old `/latest/concepts/...` Crossplane URL, replace it using [[findings/the-old-crossplane-latest-concepts-urls-return-404-and-the-docs-redirect-rules-only-cover-end-of-life-versions]].
- **Why:** The ramp-up understates what was checked about the docs page. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-4 ClusterClass maturity passage with the unreleased v1.15.0 final and the main branch check — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, the paragraph beginning "Cluster provisioning is a second major use case" calls the Beta label a release-candidate claim. Add that `main` carries the same Beta, default-true gate, that the newest stable release is v1.14.4, and that no source calls ClusterClass GA. Cite [[findings/cluster-api-v1-15-0-final-was-not-released-on-2026-11-26-so-every-v1-15-statement-is-a-release-candidate-claim]].
- **Why:** The passage predates the check of `main` and the newest stable release. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-capi-argocd]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update flux-ramp-up kstatus passage with the unknown-kind fallback — status: done

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "Health judgment is a harder problem than it looks" says kstatus only works where conventions are followed. State what kstatus does with an unknown kind that has no `Ready` condition (it assumes the kind is always reconciled), and that whether this hides `Available=False` on a v1beta2 Cluster is an unverified inference. Cite [[findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled]].
- **Why:** The passage describes the failure only as a premature-ready race. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-capi-argocd]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update crossplane-ramp-up max-reconcile-rate passage with the v2 worker pool meaning — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "Level-triggered correction with a budget" and the paragraph beginning "The second pressure is reconcile load" describe `--max-reconcile-rate` as a per-second control. State that v2.1.0 renamed it to `--max-concurrent-reconciles` and that v2.5.0 treats it as a worker pool size (default 100), with the XR circuit breaker (burst 100) as the runaway guard. Cite [[findings/the-crossplane-v2-5-docs-describe-max-reconcile-rate-as-a-rate-but-source-treats-it-as-a-worker-pool-size-alias]]. The same wording appears in `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, in the paragraph beginning "The sixth principle is that every loop has a budget".
- **Why:** The passages describe the 1.6-era flag as the current v2 control. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-kro-crossplane]] supplies the source evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update crossplane-ramp-up external writers passage with the v2.5.0 source reading — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "External writers on a composite" should add that a v2.5.0 source read found no path that prunes a spec field owned by another manager (finalizer and claim paths untraced), that no one reproduced issue 7453, and that pull requests 7783 and 7787 are open and unmerged. Cite [[examples/crossplane-pull-requests-7783-and-7787-say-fromstruct-drops-managedfields-on-the-composite-resource]].
- **Why:** The passage predates the source reading. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-kro-crossplane]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-4 readiness passage with how a Crossplane function ready signal becomes XR Ready — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, the paragraph beginning "Ordering and readiness are two separate mechanisms" describes kro readiness. Add the Crossplane side: an XR is Ready only when functions set `READY_TRUE` for every composed resource (an unspecified value counts as not ready), shown as `Creating` with an "Unready resources" message, and `function-auto-ready` supplies the signal. Note that kro computes instance `Ready` itself and that its `FAILED` state is a deprecated legacy constant absent at v0.10.0. Cite [[findings/a-crossplane-composed-resource-counts-as-ready-only-when-the-function-sets-ready-true-so-unspecified-readiness-leaves-the-xr-creating]] and [[findings/the-kro-docs-disagree-on-whether-an-instance-state-of-failed-exists]].
- **Why:** The passage covers only the kro half. The 2026-11-26 dossier [[sources/research-gap-b1-recheck-kro-crossplane]] supplies the Crossplane mechanism.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update flux-ramp-up defaults and caveats passages with the Flux jitter default and the origin of the five-minute wording — status: done

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "A note on defaults, because Flux's own documentation is inconsistent here" and the caveats paragraph beginning "Some questions the wiki cannot answer" say the origin of the five-minute wording is unknown and do not give the jitter. State that controllers jitter every requeue by plus or minus 5 percent by default (`--interval-jitter-percentage`) and that the concepts page's sentence replaced "one minute" in a docs commit on 2022-08-10 with no stated reason. Cite [[findings/flux-controllers-jitter-reconcile-intervals-by-plus-or-minus-5-percent-by-default]] and [[findings/the-flux-concepts-page-five-minute-sentence-replaced-one-minute-in-an-august-2022-docs-commit-with-no-stated-reason]].
- **Why:** The passages predate the jitter and history readings in [[sources/research-gap-b1-recheck-flux-k8s]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 staleness passage with the StatefulSet metric registration gap at v1.36.0 — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "When a DaemonSet or Job sync is deferred" should add that the StatefulSet skip counter was defined but not registered at v1.36.0 and registered from v1.37 (pull request 138451), that the ReplicaSet counter was registered at both tags, and that KEP 5647 lists a different gate shape from the code. Cite [[findings/the-statefulset-stale-sync-skip-metric-was-defined-but-not-registered-in-v1-36-0-and-registered-in-v1-37]] and [[findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source]].
- **Why:** The passage names only the DaemonSet and Job counters. The dossier [[sources/research-gap-b1-recheck-flux-k8s]] pins all five names to release tags.
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 requeue passage with the issue 808 and pull request 3107 findings — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "Sources once disagreed about `Result{Requeue: true}`" says a summary of issue 808 read it as immediate. Add that the issue thread, read in full, never makes that claim, that source at v0.4.0, v0.7.0, and v0.15.0 already used a rate-limited add, and that pull request 3107 deprecated the field on 2025-02-24. Cite [[findings/controller-runtime-issue-808-is-a-documentation-request-and-does-not-claim-that-requeue-true-is-immediate]].
- **Why:** The passage leaves the origin of the immediate reading open. The dossier [[sources/research-gap-b1-recheck-flux-k8s]] shows the issue does not support it.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 StorageVersionMigration passage with the progress message layout — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "The more important point is that \"enabled by default\" describes the API and the controller" should add that progress is text in the `Running` condition message and that scripts should wait on the `Succeeded` condition. Cite [[findings/storageversionmigration-reports-progress-as-text-in-the-running-condition-message-and-has-no-numeric-progress-field]].
- **Why:** The passage does not describe how migration progress is reported. The dossier [[sources/research-gap-b1-recheck-flux-k8s]] reads it from v1.37.0 source.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 APF passage with the KEP-1040 fair-queuing limits — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "Two throttling layers are easy to confuse" should add that the KEP-1040 README describes its fair queuing as approximate (equal seat allocation, not max-min) and names a slow-reader failure mode that can hold hand size times 10 seats. Cite [[findings/apf-fair-queuing-allocates-seats-equally-and-a-slow-reader-can-hold-hand-size-times-ten-seats]].
- **Why:** The passage describes APF without its documented limits. The dossier [[sources/research-gap-b1-recheck-flux-k8s]] reads the full KEP-1040 README.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update Flux ramp-up WaitForTermination passage with the confirmed finalizer name and timeout behavior — status: done

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "The `spec.deletionPolicy` takes four values" says WaitForTermination blocks until the children have left etcd, so Flux's own deletion waits on every finalizer its children carry, and says the finalizer name is not stated. Revise it to say the finalizer is `finalizers.fluxcd.io` and that the wait is bounded by the Kustomization timeout, after which Flux logs an error and removes its finalizer anyway. Also revise the matching sentence in the deletion paragraph of `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md` that ends "One unconfirmed detail: the wiki did not establish from a primary source what Flux names its own finalizer", and add the three Argo CD finalizer spellings to its Argo CD sentence.
- **Why:** The passage predates the dossier [[sources/research-gap-m1-finalizers]], which read the source and the issue thread.
- **Acceptance:** Passage revised and citing [[findings/flux-kustomization-uses-finalizers-fluxcd-io-and-removes-it-even-when-waitfortermination-times-out]] and [[findings/argo-cd-applications-use-three-cascade-finalizer-names-and-a-non-cascading-delete-removes-the-finalizer]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update Crossplane ramp-up issue 7801 passage with the open state and the merged ProviderConfig protection — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "Related ordering problems: a credentials Secret with no finalizer" says the final resolution of issue 7801 was not confirmed. Revise it to say the issue is open on 2026-11-26 with no maintainer reply, that ProviderConfig protection (crossplane-runtime pull request 1113) merged on 2026-09-08, and that the Secret behind the ProviderConfig is still unprotected.
- **Why:** The passage predates the dossier [[sources/research-gap-m1-finalizers]], which read the source and the issue thread.
- **Acceptance:** Passage revised and citing [[findings/crossplane-protects-providerconfigs-while-managed-resources-terminate-but-the-credentials-secret-behind-them-is-still-unprotected]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 blockOwnerDeletion passage with the admission plugin permission rule — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "The snippet shows the reference a controller writes on a child it creates" explains `blockOwnerDeletion: true` but omits the permission rule. Add that where the `OwnerReferencesPermissionEnforcement` admission plugin is enabled, a write that adds the flag needs `update` on the owner's `finalizers` subresource and otherwise fails with Forbidden, and that upstream kube-apiserver does not enable the plugin by default. Cite [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]].
- **Why:** The passage predates the dossier [[sources/research-gap-m2-ownership-gc]], which read the plugin source.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-4 kro deletion passage with the label set and the RGD owner references — status: done

- **What:** In `outputs/part-4-platform-abstractions.md`, the paragraph beginning "Deletion is where kro made a deliberate departure" says kro tracks children with an ApplySet and that the FAQ tells Argo CD users to add an owner reference and a tracking-id annotation. Add that kro labels each child (`kro.run/owned`, instance identity labels, `applyset.kubernetes.io/part-of`), that it does set an owner reference on the generated CRD and on GraphRevisions, and that the FAQ example uses `controller: false` and `blockOwnerDeletion: true` and warns of out-of-order garbage collection. Cite [[findings/kro-sets-no-owner-references-on-instance-children-and-tracks-them-with-labels-and-an-applyset-inventory]].
- **Why:** The passage predates the dossier [[sources/research-gap-m2-ownership-gc]], which read the v0.10.0 docs and source.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 Config Connector condition passage with the shipped UpdateFailed reason — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the bullet beginning "Config Connector uses one `Ready` condition whose reason carries the phase" says the reasons are `Updating`, `UpToDate`, or `UpdateFailure`. Revise it to the shipped `UpdateFailed` and say the design document's `UpdateFailure` did not ship.
- **Why:** The passage predates the dossier [[sources/research-gap-m3-status-conditions]], which read the source.
- **Acceptance:** Passage revised and citing [[findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 polarity passage with the conventions history — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "Polarity is a more subtle trap" says the API conventions and the Cluster API proposal lean toward positive names. Revise it to say the conventions recommended abnormal-true, then positive in February 2020, and since June 2020 recommend neither, and that the wiki records options without a recommendation.
- **Why:** The passage predates the dossier [[sources/research-gap-m3-status-conditions]], which read the source.
- **Acceptance:** Passage revised and citing [[findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update Crossplane ramp-up Config Connector condition passage with the shipped UpdateFailed reason — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "Other stacks draw this line differently" says Config Connector uses reasons `Updating`, `UpToDate` and `UpdateFailure`. Revise `UpdateFailure` to the shipped `UpdateFailed`.
- **Why:** The passage predates the dossier [[sources/research-gap-m3-status-conditions]], which read the source.
- **Acceptance:** Passage revised and citing [[findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 Config Connector condition passage with the shipped UpdateFailed reason — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "Other stacks use different vocabularies for the same job" says Config Connector's `Ready` reasons move through `Updating`, `UpToDate` and `UpdateFailure`. Revise `UpdateFailure` to the shipped `UpdateFailed`.
- **Why:** The passage predates the dossier [[sources/research-gap-m3-status-conditions]], which read the source.
- **Acceptance:** Passage revised and citing [[findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 observedGeneration passage with the three coexisting placements — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "The generation counter gives controllers a cheap staleness check" says a controller writes the generation into each condition under current conventions and that sources are not settled. Revise it to say the conventions describe both placements, kstatus and Argo CD read only the top-level field, and Flux writes both.
- **Why:** The passage predates the dossier [[sources/research-gap-m3-status-conditions]], which read the source.
- **Acceptance:** Passage revised and citing [[decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update Flux ramp-up field-ownership passage with the helm-controller flag order and confirmed version — status: done

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "Field ownership blocks drift correction" says the reported fix `--override-manager=kubectl-edit` comes from a community member and should be verified. Revise it to say the flag and its v1.5.0 version are confirmed by the changelog, and that helm-controller takes the fields over before its dry-run diff, unlike kustomize-controller's default flag.
- **Why:** The passage predates the dossier [[sources/research-gap-m4-ssa-conflict-policy]], which read the helm-controller source.
- **Acceptance:** Passage revised and citing [[findings/helm-controller-takes-over-override-manager-fields-before-its-dry-run-diff-the-reverse-of-kustomize-controller]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update Flux ramp-up second-writer table and paragraph with the confirmed Strip and Adopt rules — status: done

- **What:** In `outputs/flux-ramp-up.md`, the table row "Second writer on a field" marks `.spec.ignore` Strip and Adopt as "single-blog claim, unverified", and the paragraph beginning "The table is a quick reference" describes the two policies without evidence. Revise both to say the kustomize-controller specification confirms Strip and Adopt, and that no source compares force with strip-or-adopt.
- **Why:** The passage predates the dossier [[sources/research-gap-m4-ssa-conflict-policy]], which read the Flux specification and the Kubernetes server-side apply reference.
- **Acceptance:** Passage revised and citing [[decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 conflicts and false drift passage with the Server-Side Diff stability evidence and helm-controller order — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "Conflicts and false drift" describes the Flux community case and Argo CD Server-Side Diff without noting that Server-Side Diff is documented stable since v3.1.0 while many issues are open, or that helm-controller's override flag acts before its dry-run. Add both, and the limit that a forced apply failed in Kubernetes issue 130292.
- **Why:** The passage predates the dossier [[sources/research-gap-m4-ssa-conflict-policy]], which read the Argo CD documentation, tracker, and helm-controller source.
- **Acceptance:** Passage revised and citing [[findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 RESTMapper passage with the confirmed v0.3.0 default and the KEP-3352 rationale — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "The key operational fact is that discovery is a snapshot" needs revision: it says the v0.3.0 default "comes from a summarized issue thread and should be checked against release notes", and the release notes and the v0.3.0 tag source now confirm it. Add the KEP-3352 rationale for aggregated discovery.
- **Why:** The passage predates the dossier [[sources/research-gap-m5-informers-caches]].
- **Acceptance:** Passage revised and citing [[findings/the-dynamic-restmapper-is-confirmed-as-the-controller-runtime-default-at-v0-3-0-from-the-release-notes-and-tag-source]] and [[findings/aggregated-discovery-exists-because-per-group-version-discovery-caused-a-request-storm]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 informer cache passage with the cache narrowing options and their costs — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "Inside a controller there are four limits" needs revision: it says the informer cache has no eviction but does not name the narrowing options (selectors, transforms, metadata-only informers, `DisableFor`) or their costs.
- **Why:** The passage predates the dossier [[sources/research-gap-m5-informers-caches]].
- **Acceptance:** Passage revised and citing [[findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update flux-ramp-up scaling passage with Flux per-controller caches and the watch label selector — status: done

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "Scale in a controller is several separate limits" needs revision: it describes the informer cache in general terms and does not say that each Flux controller runs its own cache narrowed by a watch label selector, or that Secrets and ConfigMaps are uncached unless a feature gate is on.
- **Why:** The passage predates the dossier [[sources/research-gap-m5-informers-caches]].
- **Acceptance:** Passage revised and citing [[findings/flux-controllers-keep-separate-caches-narrowed-by-a-watch-label-selector-and-leave-secrets-and-configmaps-uncached-by-default]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update crossplane-ramp-up informer cache passage with the core cache transform and the missing performance guide — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "Informer caches add a fourth, general Kubernetes pressure" needs revision: it treats the cache pressure generally and does not note that Crossplane core strips CRD schemas from one cache and does not cache Secrets, or that no Crossplane performance or sharding guide was found.
- **Why:** The passage predates the dossier [[sources/research-gap-m5-informers-caches]].
- **Acceptance:** Passage revised and citing [[findings/crossplane-core-strips-crd-schemas-from-its-cache-and-no-crossplane-performance-or-sharding-guide-was-found]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-1 resync cadence table row with the kro and Cluster API resync mechanisms — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, the cadence table rows for kro ("10-hour full resync") and Cluster API ("10-minute `--sync-period`") needs revision: it does not say that kro's interval is a replay of cached objects through its metadata informers and that ACK's ten hours is a `RequeueAfter`, which are different mechanisms.
- **Why:** The passage predates the dossier [[sources/research-gap-m5-informers-caches]].
- **Acceptance:** Passage revised and citing [[findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 conversion webhook passage with the Kubernetes 1.32 garbage collector fix — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "The risk with webhook conversion is that it puts a network service in the path of reads" says the issue was closed as a duplicate and the proposed direction was a partially synced informer. It needs revision: the fix merged in Kubernetes 1.32 (PR 125796), with the blockOwnerDeletion caveat.
- **Why:** The passage predates the dossier [[sources/research-gap-m6-admission-crds]].
- **Acceptance:** Passage revised and citing [[findings/since-kubernetes-1-32-the-garbage-collector-proceeds-after-a-failed-cache-sync-but-cannot-see-block-owner-deletion-owners-of-the-unsynced-type]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 Kyverno policy engine passage with the Kyverno failure policy defaults and HA minimum — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "Policy engines sit on top" ends by saying the wiki did not read Kyverno's webhook failure policy or availability. It needs the Fail default, 10 second timeout, three-replica HA minimum and the all-pods-down recovery.
- **Why:** The passage predates the dossier [[sources/research-gap-m6-admission-crds]].
- **Acceptance:** Passage revised and citing [[findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-2 Kyverno entry with the Gatekeeper fail-open default — status: done

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the paragraph beginning "Kyverno sits on the admission contract" says the wiki read no primary Gatekeeper source. It needs the Gatekeeper Ignore default, the fail-closed deadlock exit and the contrast with Kyverno.
- **Why:** The passage predates the dossier [[sources/research-gap-m6-admission-crds]].
- **Acceptance:** Passage revised and citing [[findings/gatekeeper-defaults-its-webhooks-to-fail-open-and-documents-a-fail-closed-deadlock-with-an-emergency-delete-of-the-webhook-configuration]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 etcd passage with the correct etcd storage default — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "Underneath is the shared store" says etcd has "an 8 GB default cap". etcd documents a 2 GiB default with 8 GiB as a suggested maximum.
- **Why:** The passage predates the dossier [[sources/research-gap-m6-admission-crds]].
- **Acceptance:** Passage revised and citing [[findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-1 control-plane overload passage with the confirmed etcd limits — status: done

- **What:** In `outputs/part-1-core-architectural-principles.md`, the "Control-plane overload" paragraph hedges that the secondary source states 8 GB as the default and says to verify. The etcd documentation now confirms 2 GiB default and 8 GiB suggested maximum, so the hedge can be replaced with a citation.
- **Why:** The passage predates the dossier [[sources/research-gap-m6-admission-crds]].
- **Acceptance:** Passage revised and citing [[findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 frameworks passage with the capability-level delegation rule and the framework self-descriptions — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "Frameworks exist so that nobody writes the plumbing by hand" says it is unclear how strictly the capability levels apply to composition-based operators. The Operator SDK page says delegating operators remain at Level 1 and does not mention composition tools, and the paragraph can cite the options laid out without a ranking.
- **Why:** The passage predates the dossier [[sources/research-gap-m7-operators-idempotency]].
- **Acceptance:** Passage revised and citing [[findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools]] and [[comparisons/operator-frameworks-by-self-description-kubebuilder-operator-sdk-java-operator-sdk-kopf-shell-operator-and-metacontroller]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-3 ambiguous-create passage with the per-kind external-name default and Config Connector conflict policy — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "How they handle ambiguous creates and existing resources" says Crossplane defaults the external name to the object name for many kinds or an ID the cloud assigns, and that Config Connector acquires a same-named resource automatically. It needs the upjet mechanism (name initializer, disabled for provider-assigned IDs) and the opt-in lease policy that defaults to none.
- **Why:** The passage predates the dossier [[sources/research-gap-m7-operators-idempotency]].
- **Acceptance:** Passage revised and citing [[findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids]] and [[findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 idempotency passage with kro and Cluster API mechanisms — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "This is where idempotency stops being a theoretical virtue" lists four answers and does not mention kro or Cluster API. It needs kro's intent record in `status.managedResources` before apply and Cluster API's provider-owned tags guidance.
- **Why:** The passage predates the dossier [[sources/research-gap-m7-operators-idempotency]].
- **Acceptance:** Passage revised and citing [[findings/kro-records-the-resources-it-is-about-to-create-in-status-before-applying-them-and-applies-without-force]] and [[findings/cluster-api-tells-providers-not-to-use-a-derived-name-as-the-only-lookup-key-and-states-no-lost-create-algorithm]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 2 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update crossplane-ramp-up Config Connector acquisition passage with the conflict policy — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "Other tools answer the same two questions" says Config Connector acquires a resource implicitly and can take over something never meant to be managed. It needs the opt-in management conflict policy (default none) and its label and resourceID limits.
- **Why:** The passage predates the dossier [[sources/research-gap-m7-operators-idempotency]].
- **Acceptance:** Passage revised and citing [[findings/config-connector-conflict-prevention-defaults-to-none-so-two-objects-can-manage-one-cloud-resource-unless-a-lease-policy-is-set]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Update part-5 portal passage with how Backstage reads operator-managed custom resources — status: done

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "The platform and portal layer defines what application teams see" names Backstage as a catalog and portal. It can add that the Kubernetes plugin reads configured custom resources by entity label and that no Backstage document describes an operator pattern.
- **Why:** The passage predates the dossier [[sources/research-gap-m7-operators-idempotency]].
- **Acceptance:** Passage revised and citing [[findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern]].
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the mechanics and accuracy pass (Revise phase); the diff of the output shows all 1 cited page(s) in the added text. Caveats the dossier left open stay in the passage.

## Dropped
