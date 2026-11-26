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
- [[#update-part-4-for-the-scale-figures-recheck]] — open
- [[#update-part-5-for-the-scale-figures-recheck]] — open
- [[#update-part-1-for-the-reconcile-defaults-verification-pass]] — open
- [[#update-part-2-for-the-reconcile-defaults-verification-pass]] — open
- [[#update-part-3-for-the-reconcile-defaults-verification-pass]] — open
- [[#update-part-5-for-the-reconcile-defaults-verification-pass]] — open
- [[#update-flux-ramp-up-for-the-reconcile-defaults-verification-pass]] — open
- [[#update-crossplane-ramp-up-for-the-reconcile-defaults-verification-pass]] — open
- [[#update-part-1-for-the-kubernetes-and-controller-runtime-verification-pass]] — open
- [[#update-part-2-for-the-kubernetes-and-controller-runtime-verification-pass]] — open
- [[#update-part-3-for-the-kubernetes-and-controller-runtime-verification-pass]] — open
- [[#update-part-5-for-the-kubernetes-and-controller-runtime-verification-pass]] — open

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

## Update part-1 for the reconcile defaults verification pass — status: open

- **What:** In `outputs/part-1-core-architectural-principles.md`, revise three places. (1) In the detection-cadence table, the Flux Kustomization row says "`interval`, minimum 60 seconds" and should say the interval is required with no default and 60 seconds is a recommended minimum; the Argo CD row should say 120 seconds plus up to 60 seconds of jitter in v3.x and 180 seconds in v2.x; the Crossplane row says "Configurable poll interval; default not confirmed" and should give 1 minute in core and runtime and 10 minutes in Upjet providers; the ACK row can drop "About". (2) The sentence beginning "The wiki notes that Flux's concepts page gives a five-minute default interval" should say the interval is required, has no controller-side default, and the five-minute figure is documentation shorthand. (3) The provider-controller paragraph on Config Connector cadence can add the 10 minute mean with jitter. Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]], [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]], [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]], and [[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-2 for the reconcile defaults verification pass — status: open

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, the cloud add-ons paragraph says ACK has "a periodic resync that the dossier states as ten hours by default (flagged for re-verification)". The 10 hour default is now verified against the ACK drift-recovery page and the runtime constant, so the re-verification flag can be dropped. Cite [[entities/ack]] and [[sources/research-gap-g3-reconcile-defaults]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-3 for the reconcile defaults verification pass — status: open

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, the "How they time the loop" paragraph says Flux uses `spec.interval` "with a minimum of 60 seconds" and that Argo CD polls on "a 120 second cadence with up to 60 seconds of jitter". Revise it to say the Flux interval is required with a recommended 60 second minimum and no controller default, and that Argo CD's 120 plus 60 second figure is the v3.x default (v2.x was a flat 180 seconds). It can also add the Crossplane 1 minute and 10 minute poll defaults and Config Connector's 10 minute jittered mean. Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]], [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]], and [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-5 for the reconcile defaults verification pass — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, revise two passages. The Flux Kustomization paragraph says "the Kustomization page gives a minimum of 60 seconds" and should say the interval is required with a recommended 60 second minimum. The delivery-layer paragraph says Argo CD polls "on a 120-second cadence with up to 60 seconds of jitter" and should name v3.x (180 seconds in v2.x). Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]] and [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update the Flux ramp-up for the reconcile defaults verification pass — status: open

- **What:** In `outputs/flux-ramp-up.md`, revise three passages. The interval paragraph ("the Kustomization API page documents a minimum of 60 seconds, though the wiki's sources disagree about the default") and the following "A note on defaults" paragraph, which says the wiki flags the default as needing verification, should now say that `.spec.interval` is required, no controller-side default exists, the 60 second minimum is a recommendation, and the five-minute figure on the concepts page is shorthand; the advice to set the interval explicitly stays. The unknowns paragraph near the end that says the default is "stated as five minutes on one page and has a 60 second minimum on another" should be corrected the same way. Cite [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]] and [[entities/flux]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update the Crossplane ramp-up for the reconcile defaults verification pass — status: open

- **What:** In `outputs/crossplane-ramp-up.md`, the reconcile-load paragraph says the managed resource poll interval "is the one the wiki did not confirm from the sources it read", and the unknowns paragraph says "The default poll interval and backoff values for managed resources were not confirmed". The poll interval is now verified at 1 minute in crossplane-runtime and core and 10 minutes in Upjet providers (with a 1 hour sync period, `--max-reconcile-rate` 100, and 5 percent jitter), and the per-resource `crossplane.io/poll-interval` annotation is implemented. Backoff values remain unverified. Cite [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]] and [[entities/upjet]].
- **Why:** The 2026-11-26 reconcile defaults dossier corrected or settled the cadence figures this passage states, see [[sources/research-gap-g3-reconcile-defaults]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-1 for the Kubernetes and controller-runtime verification pass — status: open

- **What:** In `outputs/part-1-core-architectural-principles.md`, revise the reconcile-return-values passage (around line 133) that says "the sources disagree about whether `Requeue: true` backs off ... an issue thread describes an immediate one". At controller-runtime v0.25.3 it is a rate-limited requeue with per-item exponential backoff, and `RequeueAfter` forgets the failure history before waiting.
- **Why:** The 2026-11-26 dossier read the v0.25.3 source and settled the conflict, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]].
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Update part-2 for the Kubernetes and controller-runtime verification pass — status: open

- **What:** In `outputs/part-2-krm-and-api-machinery.md`, revise two passages. The storage migration paragraph (around line 191) says one uncross-checked blog reports StorageVersionMigration as GA in 1.37 and that automatic triggering is unknown, and it should say the API is GA and on by default in v1.37 and is triggered by a user-created object. The admission paragraph (around line 263) says one digest reports MutatingAdmissionPolicy as stable since 1.36 and asks for a cross-check, and it should say it is GA and enabled by default since v1.36, with Alpha 1.32 and Beta 1.34 from the gate table.
- **Why:** The 2026-11-26 dossier verified both against CHANGELOGs and feature-gate tables, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[concepts/crd-versioning-and-storage-migration]], [[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]], and [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-3 for the Kubernetes and controller-runtime verification pass — status: open

- **What:** In `outputs/part-3-controller-and-operator-mechanics.md`, revise two passages. The `Result{Requeue: true}` paragraph (around line 183) says sources disagree and that an issue summary reads it as immediate, and it should say it is a rate-limited requeue with exponential backoff at v0.25.3. The cache-lag paragraph (around line 153) can now add the v1.36 built-in fix, in which four kube-controller-manager controllers skip a sync until the cache has seen their own write.
- **Why:** The 2026-11-26 dossier verified both against controller-runtime v0.25.3 and the Kubernetes v1.36 and v1.37 CHANGELOGs, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]] and [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-5 for the Kubernetes and controller-runtime verification pass — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the controller-mechanics paragraph (around line 290) says `Requeue: true` is "deprecated and described inconsistently across sources", and it should say the behavior is settled at controller-runtime v0.25.3 (rate-limited, exponential backoff).
- **Why:** The 2026-11-26 dossier read the v0.25.3 source, see [[sources/research-gap-g3-k8s-and-controller-runtime]]. Cite [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]].
- **Acceptance:** Passage revised and citing the page named above.
- **Drafted by:** agent on 2026-11-26

## Update flux-ramp-up for the verified pre-dry-run takeover flag — status: open

- **What:** In `outputs/flux-ramp-up.md`, the client-side to server-side migration paragraph (around line 255) says the issue 1722 flag "runs takeover before the dry run, which a maintainer called dangerous; the shipped semantics were not verified in the wiki". It should name `--override-manager-before-dry-run`, say it first shipped in kustomize-controller v1.10.0 (2026-10-24) and Flux v2.10.0 (2026-10-26), and say that it is a separate opt-in list that transfers all fields of the named managers, prunes fields missing from the source, is not reverted on failure, and should be removed after recovery. The open-questions passage (around line 340) should drop the unverified caveat for this flag.
- **Why:** The 2026-11-26 dossier verified the flag against PR 1747 and the v1.10.0 source and docs, see [[sources/research-gap-g3-flux-ssa-helm]]. Cite [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]] and [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]]. The helm-controller `--override-manager` passage (around line 257) is not affected and stays unverified.
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-1 for the Cluster API v1beta2 MachineHealthCheck behavior — status: open

- **What:** In `outputs/part-1-core-architectural-principles.md`, the brake paragraph (around line 222) says Cluster API's `maxUnhealthy` "short-circuits remediation", and the Cluster API paragraph (around line 322) says the v0.4 book is the source and "current behavior may differ". Both should use the v1beta2 name `remediation.triggerIf.unhealthyLessThanOrEqualTo` (v1.11.0 onward, `maxUnhealthy` deprecated) and say the brake is off by default, with a default threshold of 100 percent.
- **Why:** The 2026-11-26 dossier read the v1beta2 types and guide at v1.15.0-rc.0, see [[sources/research-gap-g3-argocd-capi]]. Cite [[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]] and [[findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names]].
- **Acceptance:** Both passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-4 for ClusterClass maturity — status: open

- **What:** In `outputs/part-4-platform-abstractions.md`, the cluster provisioning paragraph (around line 263) says the Cluster API landing page "labels the feature experimental" and that the label "may be out of date". It should say the `ClusterTopology` gate is Beta and enabled by default as of v1.15.0-rc.0 (2026-11-24), that v1.14.4 docs still say alpha, and that v1.15.0 final was not yet released.
- **Why:** The 2026-11-26 dossier read the v1.15.0-rc.0 docs and feature-gates table, see [[sources/research-gap-g3-argocd-capi]]. Cite [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]] and [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-5 for the Argo CD sharding maturity recheck — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, the Argo CD sharding paragraph (around line 224) says the non-legacy algorithms "were labelled experimental in the digest". It should say they are still labelled experimental (Alpha) in the Argo CD v3.6.3 docs, with the same wording since v2.14.0, and that the current default method is unconfirmed.
- **Why:** The 2026-11-26 dossier read the high-availability and feature-maturity pages at v3.6.3, see [[sources/research-gap-g3-argocd-capi]]. Cite [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]] and [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-4 for the scale figures recheck — status: open

- **What:** In `outputs/part-4-platform-abstractions.md`, the paragraph beginning "The most instructive operational story in this area is about counts" (around line 94) says Upbound found "several MiB of memory per CRD" and that "The figures came through digests of the posts, so check them against the originals before quoting". It should say "a little over 4 MiB" of resident memory per CRD, described as an Upbound self-report, and drop the digest caveat for these figures.
- **Why:** The 2026-11-26 dossier reread the Upbound post and the Crossplane design doc and blog from raw text, see [[sources/research-gap-g3-scale-recheck]]. Cite [[examples/upbound-tested-a-multi-cloud-control-plane-of-about-2000-managed-resources-and-upstreamed-kubernetes-fixes]] and [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]].
- **Acceptance:** Passage revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Update part-5 for the scale figures recheck — status: open

- **What:** In `outputs/part-5-platform-architecture-principles-and-operating-at-scale.md`, three passages need revision. The CRD paragraph (around line 214) says "several MiB per CRD" and that the details "came through a digest and the numbers need checking"; it should say "a little over 4 MiB" per CRD (an Upbound self-report) and note the figures were rechecked against the raw post. The cluster-envelope paragraph (around line 202) should add that the SIG Scalability table covers built-in types only and says its thresholds are not hard limits. The open-questions paragraph (around line 288) says the scale dossier relies on digests for most numbers; it should say the quoted figures were rechecked on 2026-11-26 and only parts of KEP-1040 remain unread. The workqueue discussion (around line 206) may also note that controller-runtime's default limiter has no overall token bucket when its priority queue is on.
- **Why:** The 2026-11-26 dossier reread these sources from raw text, see [[sources/research-gap-g3-scale-recheck]]. Cite [[findings/the-sig-scalability-thresholds-cover-built-in-types-only-and-are-not-hard-limits]], [[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]], [[findings/the-default-workqueue-rate-limiter-differs-between-client-go-and-controller-runtime]], and [[findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements]].
- **Acceptance:** Passages revised and citing the pages named above.
- **Drafted by:** agent on 2026-11-26

## Done

## Run build-wiki workflow — status: done

- **What:** Run `workflows/build-wiki.js` to fan out web research per concept, ingest sources, plan outputs, and draft the tutorial series.
- **Outcome:** 2026-11-25: 28 research dossiers plus the seed vocabulary were ingested (29 sources), producing 493 content pages, and the five-part series plus the Flux and Crossplane ramp-ups were drafted in `outputs/` (about 66,000 words). Review and delivery are tracked separately.

## Dropped
