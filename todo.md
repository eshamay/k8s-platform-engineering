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
- [[#update-part-4-for-the-v25-verification-pass]] — open
- [[#update-part-2-for-the-jetstack-webhook-postmortem]] — open
- [[#update-part-1-unintended-deletion-passage-with-the-gitops-prune-incidents]] — open
- [[#update-part-5-failure-mode-evidence-note-with-the-operator-loop-incidents]] — open
- [[#update-crossplane-ramp-up-adoption-passage-with-the-reproduced-adopt-or-create-failures]] — open
- [[#update-part-3-ambiguous-create-and-adoption-passages-with-the-2026-incident-evidence]] — open
- [[#decide-on-the-23-partial-and-4-still-open-gaps-from-the-evidence-pass]] — open
- [[#review-claims-still-unverified-after-the-evidence-pass]] — open
- [[#finish-the-outputs-the-revise-phase-did-not-reach]] — open
- [[#recheck-release-candidate-and-unread-items-noted-in-the-closed-gap-resolutions]] — open
- [[#update-part-5-and-part-1-evidence-notes-with-the-skyscanner-and-reddit-primary-postmortems]] — open
- [[#batch-1-p0-to-p2-run-the-mechanics-and-accuracy-pass-workflow]] — open
- [[#batch-2-p3-other-tool-coverage-research-pass]] — open
- [[#batch-2-p3b-residual-partial-gaps-from-the-targeted-pass]] — open
- [[#batch-3-p4-benchmarks-and-scale-by-controller-gaps]] — open
- [[#batch-3-p4b-turn-design-choice-evidence-into-decision-pages]] — open
- [[#update-flux-ramp-up-field-ownership-passage-with-the-confirmed-helm-controller-flag]] — open
- [[#update-part-3-staleness-passage-with-the-replicaset-and-statefulset-metrics-and-the-read-your-writes-release]] — open
- [[#update-part-5-argo-cd-sharding-passage-with-the-confirmed-legacy-default]] — open
- [[#update-crossplane-ramp-up-unknowns-passage-with-the-docs-page-and-url-findings]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck]] — open

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

## Update crossplane-ramp-up for the v2.5 verification pass — status: done

- **What:** In `outputs/crossplane-ramp-up.md`, revise four passages. (1) Section 5, the paragraph beginning "The v2 scope matters for tenancy" lists `LegacyCluster` as a v2 alternative scope, but it exists only on the v1 XRD API, so cite [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]]. (2) Section 7, the paragraph beginning "Two failure patterns", should say the async `Synced` problem is unfixed (issue closed as stale) and cite [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]]. (3) Section 12 and the "Modularity of providers" principle describe activation policies without maturity or the default, so cite [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]] and state they are alpha. (4) The closing unknowns paragraph says the default poll interval, claim support, and Operations details are unconfirmed, so cite [[sources/research-gap-g3-crossplane-v2]] and [[findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references]]. Also the `managementPolicies` passage in section 4 should note it is beta, citing [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].
- **Why:** The 2026-11-26 verification pass corrected or settled these claims. Outputs are not edited by ingest.
- **Acceptance:** The passages are revised through `sticki-summarize` or by hand, each citing the page named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-4 for the v2.5 verification pass — status: open

- **What:** In `outputs/part-4-platform-abstractions.md`, revise the scope paragraph in section 4 (beginning "The scope field leads to the v1 and v2 difference") to say that `LegacyCluster` is a v1 XRD scope and that v2 XRDs reject claims, citing [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]]. Revise the `managementPolicies` paragraph (beginning "The `managementPolicies` list is the main safety lever") to state it is beta and to cite [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]]. Revise the provider-families packaging paragraph to mention that activation policies are alpha, citing [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]].
- **Why:** The dossier ingested on 2026-11-26 verified these points against v2.5 sources.
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

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

## Update part-2 for the Jetstack webhook postmortem — status: open

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the "Webhook outages" paragraph (around line 291) says the k8s.af index lists several webhook postmortems and that the linked posts were not opened. It should say the Jetstack 2019 post was read (an OPA validating webhook blocked the API server's own `kube-system` ConfigMap write during a GKE master upgrade, and node auto-repair then looped) and that the index has only two webhook-tagged entries, Jetstack and Airbnb, with the Airbnb talk still unread.
- **Why:** See [[sources/research-gap-g1-outage-postmortems]]. Cite [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]] and [[findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

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

## Update part-1 unintended-deletion passage with the GitOps prune incidents — status: open

- **What:** In `outputs/part-1-core-architectural-principles.md`, the "Unintended deletion" paragraph (around line 270) is based on documentation warnings. It can now cite real reports, such as Argo CD issue 15441 (a namespace recreated when its manifest was removed under `CreateNamespace=true`) and ACK issue 2911 (an Argo CD prune stranding a CR on its finalizer), and the self-heal incident in which a migration hook was skipped.
- **Why:** See [[sources/research-gap-g1-gitops-drift-incidents]]. Cite [[findings/unintended-deletion-through-prune]], [[examples/argo-cd-issue-15441-removing-a-namespace-manifest-under-createnamespace-deleted-and-recreated-the-namespace]], and [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-3 evidence note with the operator loop incidents — status: done

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the evidence paragraph (around line 318) says the wiki found no named-company postmortem for several mechanics, such as runaway reconcile loops, and that the pitfalls rest on documentation and not incident reports. It should add that issue-level reports with root causes now exist for runaway loops (Cluster API provider RKE2 issue 905, Longhorn issue 13831, kube-shard issue 121, Crossplane issue 7221), a retry loop that grew controller memory about 25 times (Longhorn issue 14121), and lost events (Kubernetes issue 115658, NVSentinel issue 1542), while no formal organization-authored operator postmortem was found and every figure is self-reported.
- **Why:** See [[sources/research-gap-g1-operator-loop-failures]]. Cite [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object]], and [[findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: revised in the evidence and fact-check pass (Revise phase); the output now cites the verified pages. Remaining unverified passages, if any, are tracked in the follow-up todos below.

## Update part-5 failure-mode evidence note with the operator loop incidents — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the fourth evidence paragraph (around line 292) says the wiki found no named-company postmortem of a runaway reconcile loop. It should say that no named-company postmortem was found, and that named issue-level incidents exist with reporter-measured rates (about 10, 6, and 13 reconciles per second in three projects).
- **Why:** See [[sources/research-gap-g1-operator-loop-failures]]. Cite [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm]], and [[findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

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

## Update crossplane-ramp-up adoption passage with the reproduced adopt-or-create failures — status: open

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "Other tools answer the same two questions" (around line 270) says adopt-or-create "can take over a look-alike resource" as a general warning. It can now cite reproduced cases: ACK issue 3149 (two custom resources overwrote one IAM role and deleting either deleted it, run against moto) and Config Connector issue 14236 (acquisition removed settings the CRD does not model, a reporter claim). It should also say that no production comparison of the policies exists.
- **Why:** See [[sources/research-gap-g1-leaked-resources-adoption]]. Cite [[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]] and [[findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-3 ambiguous-create and adoption passages with the 2026 incident evidence — status: open

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the "Crossplane case" paragraph (around line 116) describes the pending marker and says failing safe does not scale but mentions neither the runtime opt-out nor any dated incident, and the "How they handle ambiguous creates and existing resources" paragraph (around line 328) presents ACK adopt-or-create as making a retried create converge. They can now say that the runtime opt-out shipped but upjet providers do not set it, that an ACK audit counts 48 resources in 22 controllers where a lost create response duplicates the resource or wedges the custom resource (author's audit, not an incident count), and that a CI run created a duplicate VPC endpoint. Convergence under adopt-or-create holds only if the identifier was recorded.
- **Why:** See [[sources/research-gap-g1-leaked-resources-adoption]]. Cite [[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]], [[examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours]], and [[findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

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

## Decide on the 23 partial and 4 still-open gaps from the evidence pass — status: open

- **What:** Review the partial gaps (a named remainder exists) and the four still-open gaps (forced-finalizer orphaning rate, named end-user convergence case study, named operator postmortems, named Flux sharding adopter or APF incident) in [[findings/evidence-and-fact-check-pass-gap-dispositions]]. Decide which need another targeted pass and which should be closed as unanswerable with current sources.
- **Why:** The Skyscanner, Reddit and Spotify primaries were unreadable with the tools available, so those need a different retrieval route.
- **Acceptance:** Each gap has a decision recorded.
- **Drafted by:** agent on 2026-11-26

## Review claims still UNVERIFIED after the evidence pass — status: open

- **What:** List the claims the dossiers marked UNVERIFIED or secondary-only (for example the helm-controller `--override-manager` passage in the Flux ramp-up, whether old Crossplane concepts URLs redirect, the Reddit Pi-day outage details, and Crossplane issue 7453) and decide whether to re-research or keep the caveat.
- **Why:** These caveats remain in the pages and outputs and are the main accuracy risk left.
- **Acceptance:** Each UNVERIFIED claim is re-researched, caveated in place, or dropped.
- **Drafted by:** agent on 2026-11-26

## Finish the outputs the Revise phase did not reach — status: open

- **What:** Six output todos above still show no edit citing their evidence pages: part-4 v2.5 pass, part-2 Jetstack webhook, part-1 GitOps prune passage, part-5 operator-loop failure-mode note, crossplane-ramp-up adoption passage, and part-3 ambiguous-create and adoption passages. Several done todos also cover only some of their cited pages, so re-check them against their What lines.
- **Why:** The seven outputs were revised in the working tree but not every drafted todo was applied.
- **Acceptance:** Remaining passages revised, or todos dropped with a reason.
- **Drafted by:** agent on 2026-11-26

## Recheck release-candidate and unread items noted in the closed-gap resolutions — status: open

- **What:** Recheck the items the 22 newly closed gap Resolutions mark as not settled: Cluster API MachineHealthCheck and ClusterClass at v1.15.0 final (read at rc.0); kro v0.9.4 rate-limiter table and instance conditions from Go source; the body of Crossplane PR 8080 for async Synced signaling; KEP-1040 in full; helm-controller driftDetection and Helm 4 server-side apply; whether old Crossplane concepts URLs redirect; and the Kubernetes docs-versus-code stage discrepancies for Mutating Admission Policy and StorageVersionMigration.
- **Why:** The gaps are closed with their caveats written into the Resolution, so these remainders now live only in prose and would be easy to lose.
- **Acceptance:** Each item is rechecked and the affected pages corrected, or dropped with a reason.
- **Drafted by:** agent on 2026-11-26

## Update part-5 and part-1 evidence notes with the Skyscanner and Reddit primary postmortems — status: open

- **What:** Part 5 section 10 and Part 1's evidence note say the Skyscanner, Reddit and Spotify incidents are index-level or secondary-only and that no named-organization GitOps outage postmortem was found. Skyscanner (2021, Argo CD deleted 478 services) and Reddit (2023, Kubernetes 1.24 label removal and Calico route reflectors) are now primary sources. Spotify (2018 to 2019 cluster deletions through the console and Terraform, no end-user impact) is also now a primary source. Revise those passages and cite [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]] and the Reddit example page.
- **Why:** The outputs currently understate the evidence and name Skyscanner as unread.
- **Acceptance:** The passages cite the primary pages and no longer call these incidents index-only.
- **Drafted by:** agent on 2026-11-26

## Batch 1 (P0 to P2): run the mechanics-and-accuracy-pass workflow — status: open

- **What:** Run `workflows/mechanics-and-accuracy-pass.js`: finish the pending tutorial revisions (P0), re-research UNVERIFIED claims and recheck release-candidate items (P1), and research seven clusters of mechanics gaps (finalizers, ownership and GC, status and conditions, SSA and conflict policy, informers and caches, admission and CRDs, operators and idempotency) (P2).
- **Why:** The tutorials still understate the wiki's own evidence, and the mechanics gaps are the core of Parts 2 and 3.
- **Acceptance:** Twelve verified dossiers ingested serially, a triage page, the seven tutorials revised and reviewed, a cross-document consistency pass, and a final commit.
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

## Done

## Run build-wiki workflow — status: done

- **What:** Run `workflows/build-wiki.js` to fan out web research per concept, ingest sources, plan outputs, and draft the tutorial series.
- **Outcome:** 2026-11-25: 28 research dossiers plus the seed vocabulary were ingested (29 sources), producing 493 content pages, and the five-part series plus the Flux and Crossplane ramp-ups were drafted in `outputs/` (about 66,000 words). Review and delivery are tracked separately.

## Close the resolved-candidate gaps from the evidence and fact-check pass — status: done

- **What:** Run `sticki-gaps` to review and close the 22 gaps marked resolved-candidate in [[findings/evidence-and-fact-check-pass-gap-dispositions]]. Start with the Crossplane v2 status gaps, the reconcile-default and controller-runtime gaps, and the OpenAI postmortem gap.
- **Why:** Only the user closes gaps. The pass added possible-resolution notes and closed none.
- **Acceptance:** Each resolved-candidate gap is closed with a Resolution paragraph or left open with a reason.
- **Drafted by:** agent on 2026-11-26
- **Outcome:** 2026-11-26: closed all 22 resolved-candidate gaps with Resolution paragraphs the user confirmed in three batches (Closed by Eric Shamay); each Resolution states what remains unsettled. 102 gaps remain open.

## Update flux-ramp-up field ownership passage with the confirmed helm-controller flag — status: open

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "**Field ownership blocks drift correction.**" says the `--override-manager=kubectl-edit` fix is "stated as available since helm-controller v1.5.0, but it comes from a community member, not a maintainer, so verify it". The helm-controller CHANGELOG confirms the flag in its 1.5.0 section (2026-02-20) and says it is unrelated to Helm v4 server-side apply. Cite [[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]] and drop the verify-it caveat, keeping the note that the before-or-after-dry-run behavior was not checked.
- **Why:** The ramp-up still presents a confirmed flag as unverified. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Update part-3 staleness passage with the ReplicaSet and StatefulSet metrics and the read-your-writes release — status: open

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the paragraph beginning "When a DaemonSet or Job sync is deferred" says the wiki found no changelog names for the ReplicaSet and StatefulSet counters. Master source defines `stale_sync_skips_total` under the `replicaset_controller` and `statefulset_controller` subsystems (not pinned to a release). Cite [[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]]. Also add that controller-runtime v0.25.0 shipped an experimental, opt-in read-your-writes client option, citing [[findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client]], wherever the part says no controller-runtime release gives that behavior.
- **Why:** The part states the metric names as unknown and may state the read-your-writes release as unconfirmed. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Update part-5 Argo CD sharding passage with the confirmed legacy default — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the paragraph beginning "Argo CD shards by destination cluster" says the current default is unconfirmed because the v3.6.3 high-availability page drops the "(default)" marker. The source sets `DefaultShardingAlgorithm = LegacyShardingAlgorithm` at v3.0.0 and v3.6.3, so the default is `legacy`. Cite [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]].
- **Why:** The part leaves a settled default as unconfirmed. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Update crossplane-ramp-up unknowns passage with the docs page and URL findings — status: open

- **What:** In `outputs/crossplane-ramp-up.md`, the paragraph beginning "The wiki is honest about what it does not know" says the managed-resource poll interval was verified from source "although backoff values and the docs page were not read". The docs page was read and states no poll interval default, so it cannot be cited for the number. Cite [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]]. If the ramp-up links any old `/latest/concepts/...` Crossplane URL, replace it using [[findings/the-old-crossplane-latest-concepts-urls-return-404-and-the-docs-redirect-rules-only-cover-end-of-life-versions]].
- **Why:** The ramp-up understates what was checked about the docs page. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Review closed gap resolutions refined by the b1 recheck — status: open

- **What:** Closed gaps were not edited. Two closed Resolutions carry statements the b1 recheck refines: "Argo CD sharding algorithm maturity in current releases" says the default is unconfirmed (the default is `legacy`, confirmed in source), and "Argo CD default reconcile interval across versions" says the reason for the jitter is unverified (pull request 22342 explains only that the 3 minute ceiling was kept). Pages were updated instead, see [[findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker]] and [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]]. A human decides whether to reopen either gap or leave the Resolution as a record of what was known at close.
- **Why:** Closed Resolutions stay as the reasoning trail, and the reader should know which statements were later refined. The 2026-11-26 dossier [[sources/research-gap-b1-unverified-claims]] supplies the evidence.
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Dropped
