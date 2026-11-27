# TODOs / Followups — k8s-platform-engineering

Concrete actions for this wiki. Distinct from `open-knowledge-gaps.md`:

- **Gaps** = "we don't know X yet" (knowledge work).
- **TODOs** = "we know what to do, do it" (execution work).

Write authority: agent-may-write. Agents may add entries, transition status (`open → in-progress → done | dropped`), and record outcomes.

H2 slug is the anchor for each entry; refer to entries with `[[#slug]]`.

## Index of open todos

- [[#promote-draft-pages-to-active]] — open
- [[#add-sticki-lint-to-the-recurring-routine]] — open
- [[#deepen-the-dossiers-that-rest-on-model-digests]] — open
- [[#decide-on-the-23-partial-and-4-still-open-gaps-from-the-evidence-pass]] — open
- [[#batch-3-p4-benchmarks-and-scale-by-controller-gaps]] — open
- [[#batch-3-p4b-turn-design-choice-evidence-into-decision-pages]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck-of-cluster-api-and-argo-cd]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck-of-kro-and-crossplane]] — open
- [[#review-closed-gap-resolutions-refined-by-the-b1-recheck-of-flux-and-kubernetes]] — open
- [[#decide-on-the-26-partial-and-3-still-open-mechanics-gaps]] — open
- [[#fetch-the-sources-the-mechanics-and-accuracy-pass-could-not-read]] — open
- [[#recheck-cluster-api-machinehealthcheck-and-clusterclass-once-v1-15-0-final-ships]] — open
- [[#review-the-unrevised-passages-that-kept-their-caveats-in-the-seven-outputs]] — open
- [[#update-flux-ramp-up-waitfortermination-passage-with-the-timeout-behavior]] — open
- [[#decide-on-the-19-partial-and-5-still-open-other-tool-gaps]] — open
- [[#review-the-radius-single-blog-finding-that-the-other-tool-pass-marked-contradicted]] — open
- [[#fetch-the-flux-ocirepository-docs-from-the-controller-repository]] — open
- [[#fetch-the-flux-changelog-and-adopters-list]] — open
- [[#fetch-the-argo-cd-resource-hooks-and-applicationset-docs]] — open
- [[#find-named-flux-versus-argo-cd-migration-case-studies]] — open
- [[#fetch-the-crossplane-composition-functions-docs-page]] — open
- [[#find-the-function-kro-engine-and-crossplane-package-revision-source-files]] — open
- [[#read-the-kro-crossplane-eks-idp-lab-repository]] — open
- [[#add-the-speaker-s-account-of-kcp-workspaces-to-the-part-1-kcp-passage]] — open

## Open

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

## Decide on the 23 partial and 4 still-open gaps from the evidence pass — status: open

- **What:** Review the partial gaps (a named remainder exists) and the four still-open gaps (forced-finalizer orphaning rate, named end-user convergence case study, named operator postmortems, named Flux sharding adopter or APF incident) in [[findings/evidence-and-fact-check-pass-gap-dispositions]]. Decide which need another targeted pass and which should be closed as unanswerable with current sources.
- **Why:** The Skyscanner, Reddit and Spotify primaries were unreadable with the tools available, so those need a different retrieval route.
- **Acceptance:** Each gap has a decision recorded.
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
- **Outcome:** 2026-11-26: partly done. The Kubernetes finalizers blog was fetched and ingested as [[sources/kubernetes-finalizers-blog]] (seq 80). The other listed sources are still unread.

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

## Update flux-ramp-up WaitForTermination passage with the timeout behavior — status: open

- **What:** In `outputs/flux-ramp-up.md`, the paragraph beginning "The `spec.deletionPolicy` takes four values" says WaitForTermination waits for the children to leave etcd. It should add that the wait is bounded by `.spec.timeout`, after which the controller logs an error and lets the Kustomization be deleted, which matters for provider-managed resources with finalizers.
- **Why:** The passage predates the dossier [[sources/research-gap-o4-config-connector-ack]].
- **Acceptance:** Passage revised and citing [[findings/a-flux-waitfortermination-deletion-policy-gives-up-at-spec-timeout-and-lets-the-kustomization-be-deleted-while-a-provider-resource-may-still-be-finalizing]].
- **Drafted by:** agent on 2026-11-26

## Decide on the 19 partial and 5 still-open other-tool gaps — status: open

- **What:** Review the 19 partial and 5 still-open rows in [[findings/other-tool-coverage-pass-gap-dispositions]]. Anything needing a neutral third party (an independent Argo CD versus Flux benchmark, a neutral Config Connector versus Crossplane study, a named kro adopter) or a measured number (Flux shard outcomes, Upjet memory and CPU, Crossplane capacity limits) is unlikely to be found with current public sources.
- **Why:** Each needs a user decision: another targeted pass, close as unanswerable with current sources, or accept the relevant decision page.
- **Acceptance:** Each gap has a decision recorded.
- **Drafted by:** agent on 2026-11-26

## Review the Radius single-blog finding that the other-tool pass marked contradicted — status: open

- **What:** [[findings/radius-maturity-and-governance-claims-rest-on-a-single-third-party-blog]] moved to `contradicted` because primary listings now settle Radius status and governance. Decide whether to narrow it to the Bicep-dependency claim, which still rests on one blog, or archive it, and resolve its Contradictions block.
- **Why:** The contradiction is documented, but the lifecycle transition is a judgment call.
- **Acceptance:** The page is `active` (narrowed) or `archived`, with the Contradictions block resolved.
- **Drafted by:** agent on 2026-11-26

## Fetch the Flux OCIRepository docs from the controller repository — status: open

- **What:** The path `content/en/flux/components/source/ocirepositories.md` in fluxcd/website returned 404, so the Flux side of the Git versus OCI comparison rests on other pages. Find where the OCIRepository documentation now lives (the source-controller repository docs or fluxcd.io), save it into `raw/`, and ingest it.
- **Why:** Flux's own OCIRepository behavior (provenance, signature verification, polling) is the Flux half of the gap 'Git versus OCI as the canonical GitOps source'. It is listed under "Needs manual fetch" in [[findings/other-tool-coverage-pass-gap-dispositions]] (cluster o1-argocd-flux-gitops).
- **Acceptance:** The source is saved in `raw/` and ingested, or recorded as unavailable with the reason.
- **Drafted by:** agent on 2026-11-26

## Fetch the Flux changelog and adopters list — status: open

- **What:** The paths CHANGELOG.md, docs/adopters.md and ADOPTERS.md in fluxcd/flux2 all returned 404. Locate the current adopters file and release history (it may sit in the fluxcd/community repository or on fluxcd.io), save them into `raw/`, and ingest them.
- **Why:** Named adopters and release dates are the missing evidence for 'Named GitOps adopters and GitOps-caused outages' and for Flux release-cadence claims. It is listed under "Needs manual fetch" in [[findings/other-tool-coverage-pass-gap-dispositions]] (cluster o1-argocd-flux-gitops).
- **Acceptance:** The source is saved in `raw/` and ingested, or recorded as unavailable with the reason.
- **Drafted by:** agent on 2026-11-26

## Fetch the Argo CD resource hooks and ApplicationSet docs — status: open

- **What:** The paths docs/user-guide/resource_hooks.md and docs/operator-manual/applicationset.md in argoproj/argo-cd returned 404 (the docs may have moved under docs/operator-manual/applicationset/ or to a new site). Find the current locations, save the pages into `raw/`, and ingest them.
- **Why:** Hooks and ApplicationSet generators are the Argo CD half of the hub-and-spoke and Argo CD versus Flux gaps. It is listed under "Needs manual fetch" in [[findings/other-tool-coverage-pass-gap-dispositions]] (cluster o1-argocd-flux-gitops).
- **Acceptance:** The source is saved in `raw/` and ingested, or recorded as unavailable with the reason.
- **Drafted by:** agent on 2026-11-26

## Find named Flux-versus-Argo-CD migration case studies — status: open

- **What:** A web search for 'Flux vs Argo CD comparison CNCF case study migrated adopter' returned zero results. Try CNCF case studies, KubeCon talk write-ups and vendor engineering blogs with different queries; save any primary account into `raw/` and ingest it.
- **Why:** Named adopters who moved between the two tools are the evidence the head-to-head gap lacks. It is listed under "Needs manual fetch" in [[findings/other-tool-coverage-pass-gap-dispositions]] (cluster o1-argocd-flux-gitops).
- **Acceptance:** The source is saved in `raw/` and ingested, or recorded as unavailable with the reason.
- **Drafted by:** agent on 2026-11-26

## Fetch the Crossplane composition functions docs page — status: open

- **What:** https://docs.crossplane.io/latest/concepts/composition-functions/ returned an empty body; the pass read the same content from the crossplane/docs repository through gh instead. Save the rendered page into `raw/` only if the rendered text differs from the repository source, otherwise record the substitution as sufficient.
- **Why:** The rendered page is what readers see and what the tutorials cite. It is listed under "Needs manual fetch" in [[findings/other-tool-coverage-pass-gap-dispositions]] (cluster o7-krm-functions).
- **Acceptance:** The source is saved in `raw/` and ingested, or recorded as unavailable with the reason.
- **Drafted by:** agent on 2026-11-26

## Find the function-kro engine and Crossplane package revision source files — status: open

- **What:** The contents API returned 404 for crossplane-contrib/function-kro `engine.go` and crossplane/crossplane `apis/pkg/v1/revision.go`; the files were probably renamed or moved. List the repository trees, find the current paths, read them, and ingest the findings (function-kro feature parity, package revision activation).
- **Why:** The two source files settle function-kro parity with standalone kro and the package revision and upgrade policy. It is listed under "Needs manual fetch" in [[findings/other-tool-coverage-pass-gap-dispositions]] (cluster o8-crossplane-residuals).
- **Acceptance:** The source is saved in `raw/` and ingested, or recorded as unavailable with the reason.
- **Drafted by:** agent on 2026-11-26

## Read the kro-crossplane-eks-idp-lab repository — status: open

- **What:** https://github.com/suzuki0430/kro-crossplane-eks-idp-lab was found by search and not read. Read its README and manifests; if it shows kro and Crossplane used together, record it as a third-party example with the caveat that it is a lab, not a production use.
- **Why:** It may show how kro status feeds a Crossplane composite, which the residual gap on status propagation asks about. It is listed under "Needs manual fetch" in [[findings/other-tool-coverage-pass-gap-dispositions]] (cluster o8-crossplane-residuals).
- **Acceptance:** The source is saved in `raw/` and ingested, or recorded as unavailable with the reason.
- **Drafted by:** agent on 2026-11-26

## Add the speaker's account of kcp workspaces to the part-1 kcp passage — status: open

- **What:** In `outputs/part-1-core-architectural-principles.md`, the paragraph beginning "At the far edge of the idea is a project like kcp" could add that a KubeCon speaker describes a workspace as a Kubernetes API without nodes, created in about a second, and say plainly that the figure is an unmeasured spoken estimate. Outputs are not edited by ingest.
- **Why:** The passage predates the ingest of the KubeCon kcp talk transcript. The addition is optional because the speaker's description agrees with the passage.
- **Acceptance:** Passage revised through `sticki-summarize` or by hand, citing [[examples/a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour]] and [[entities/kcp]].
- **Drafted by:** agent on 2026-11-26

## Done

Done and dropped todos are archived in [[todo-archive]] (118 done, 2 dropped as of 2026-11-26). Move a todo there once it is marked done or dropped.
