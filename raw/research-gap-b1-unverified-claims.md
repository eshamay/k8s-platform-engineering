# Research dossier: gap cluster b1-unverified-claims

Research date: 2026-11-26

## Overview

This pass triaged every claim marked UNVERIFIED, SECONDARY-ONLY or UNREADABLE in raw/research-gap-*.md. About 60 such markers exist, concentrated in the g1 incident and adopter dossiers and the g3 Crossplane, Argo CD, kro and controller-runtime dossiers. I picked the claims that carry the most weight in the wiki's outputs (flux-ramp-up, crossplane-ramp-up, reconcile-defaults) and that a primary source could plausibly settle: source files at a tag, docs source, release notes, GitHub issues and PRs.

Twenty-one claim statements ended VERIFIED against a primary source. Several earlier "UNVERIFIED" entries turned out to be answerable. The Argo CD sharding default and the 120s+60s jitter default are both in source and docs. The skip-counter metric names are in master source. The helm-controller `--override-manager` flag has a dated changelog entry. Read-your-writes did ship in controller-runtime v0.25.0, as experimental opt-in. The old Crossplane `/latest/concepts/...` URLs do not redirect: they return 404.

Some claims stay open for structural reasons. Incident-talk contents (Spotify, Airbnb, Skyscanner) sit behind video pages or a Medium page that returned empty content. Absence claims (no postmortem, no named adopters, no beta date) can only be recorded as "searched X, found nothing". Several limits apply: GitHub API rate limiting cut off some searches mid-run; GitHub CLI results were read through `gh`; HTTP status checks on docs.crossplane.io were made with curl, not web_scrape (web_scrape returned empty content for the 404 page).

## Finding: helm-controller --override-manager (Flux ramp-up passage)

The wiki's flux dossier said the helm-controller `--override-manager` claim, "available since helm-controller v1.5.0", was unverified. The helm-controller CHANGELOG now settles it: the flag is in the 1.5.0 section (release date 2026-02-20), and main.go registers it as a repeatable string-array flag that feeds `DisallowedFieldManagers`. The changelog also says this drift correction predates and is unrelated to Helm v4 server-side apply. The release list confirms v1.5.0 was published 2026-02-20. This is distinct from the kustomize-controller flag `--override-manager-before-dry-run` (v1.10.0), which is already verified elsewhere.

Claims
- helm-controller has a `--override-manager` flag, added in v1.5.0 for SSA drift detection and correction. Status: VERIFIED. URL: https://github.com/fluxcd/helm-controller/blob/main/CHANGELOG.md (section 1.5.0, release date 2026-02-20; also `gh release list` shows v1.5.0 on 2026-02-20). Quote: "The `--override-manager=<manager>` flag has been added for server-side apply drift detection and correction."
- The flag can be passed multiple times and is wired as the disallowed field managers list. Status: VERIFIED. URL: https://github.com/fluxcd/helm-controller/blob/main/main.go (main branch, read 2026-11-26). Quote: "List of field managers to override during drift detection."
- helm-controller drift detection is unrelated to Helm v4 SSA. Status: VERIFIED. URL: same CHANGELOG. Quote: "completely unrelated to Helm v4's server-side apply support, and was implemented long before Helm v4"

## Finding: Old Crossplane concepts URLs and the v2 docs

The wiki had "whether the old /latest/concepts/compositions/ URL redirects" as not checked. I requested the URL directly: 404 with zero redirects. The same holds for /latest/concepts/composition-revisions/, /managed-resources/, /providers/, /composition-functions/ and /composite-resources/. Moved equivalents return 200: /latest/composition/compositions/, /latest/composition/composition-revisions/, /latest/managed-resources/managed-resources/. The docs repo netlify.toml explains the design: a catch-all rule sends EOL version paths (/:version/*) to /latest/:splat, and its own comment warns "These might return 404 if docs have moved around". Netlify does not redirect a page that exists, so /v1.20/concepts/compositions/ still returns 200 and is not redirected. Several explicit rules in the same file still target /latest/concepts/composition-revisions/ and /latest/concepts/connection-details/; the composition-revisions target 404s today, so those redirects are stale.

Claims
- /latest/concepts/compositions/ does not redirect to the v2 docs; it returns 404. Status: VERIFIED (HTTP observation by curl, 2026-11-26; web_scrape returned empty content for the same URL). URL: https://docs.crossplane.io/latest/concepts/compositions/. Version: docs site as of 2026-11-26. Quote: none (HTTP 404, 0 redirects).
- /v1.20/concepts/compositions/ still serves 200. Status: VERIFIED (curl). URL: https://docs.crossplane.io/v1.20/concepts/compositions/. Quote: none (HTTP 200).
- Redirect design: EOL-version paths redirect to /latest, may 404 when pages moved. Status: VERIFIED. URL: https://github.com/crossplane/docs/blob/master/netlify.toml (master, read 2026-11-26). Quote: "These might return 404 if docs have moved around, but for many docs the redirect will work."
- Some explicit redirect targets are stale (/latest/concepts/composition-revisions/ is 404). Status: VERIFIED (netlify.toml target plus curl). URL: same plus https://docs.crossplane.io/latest/concepts/composition-revisions/. Quote: `to = "/latest/concepts/composition-revisions/"`

## Finding: Crossplane issue 7453 (external writer loses a field)

Issue 7453 was opened 2026-05-31 against Crossplane v2.3.1 and is still OPEN with labels bug and stale. The reporter claims the XR controller clears `metadata.managedFields` each reconcile, wiping a field applied by an external SSA manager with ForceOwnership. Maintainer jbw976 (2026-08-27) could not reproduce on v2.3.1 for a namespaced XR or a legacy claim, and suggested `kubectl get -o yaml` hides managedFields by default. A stale-bot comment on 2026-11-26 says it closes in 14 days without activity. PR 7783 ("fix(composite): preserve managed fields during composition") is open, updated 2026-11-26; PR 7787 ("preserve managedFields in composite resource SSA patches (#7453)") is open, last updated 2026-08-28. The reporter's own account remains unreproduced, so the wiki should present the bug as reported, not confirmed.

Claims
- Issue 7453 is open, labelled bug and stale, no fix merged. Status: VERIFIED. URL: https://github.com/crossplane/crossplane/issues/7453. Date: state read 2026-11-26. Quote: "Crossplane does not currently have enough maintainers to address every issue and pull request."
- A maintainer could not reproduce it. Status: VERIFIED. URL: same. Date: 2026-08-27. Quote: "I couldn't reproduce this just now on v2.3.1, with either a namespaced XR or a legacy v1 style claim."
- Maintainer hypothesis: managedFields hidden by default in kubectl output. Status: VERIFIED (as the maintainer's statement; not tested here). URL: same. Quote: "`kubectl get -o yaml` hides `managedFields` unless you pass `--show-managed-fields`"
- Reporter says the controller wipes externally set spec fields and managedFields becomes empty. Status: SECONDARY-ONLY (reporter's account, unreproduced; the maintainer disputes it). URL: same. Date: 2026-05-31. Quote: "appears to clear `metadata.managedFields` on XR objects during each reconcile"
- PRs 7783 and 7787 are open and unmerged. Status: VERIFIED. URL: https://github.com/crossplane/crossplane/pull/7783 and https://github.com/crossplane/crossplane/pull/7787. Date: read 2026-11-26. Quote: "fix(composite): preserve managed fields during composition"

## Finding: Crossplane managed-resource default poll interval

Three values exist and the wiki should name which. crossplane-runtime's managed reconciler declares a 1 minute default; core's `--poll-interval` flag defaults to 1m (with `--sync-interval` 1h, `--min-poll-interval` 1s, `--max-reconcile-rate` 100). [corrected in verification: in core.go `--max-reconcile-rate` is an alias of the `MaxConcurrentReconciles` field (flag `--max-concurrent-reconciles`, default 100, "worker pool size"), not a rate limit.] provider-upjet-aws's flags default `--poll` to 10m and `--sync` to 1h, with 5 percent jitter on the poll interval in the log setup. The `defaultPollIntervalHook` just returns the interval, so no hidden multiplier applies in the runtime. I scraped the docs page for managed resources (42 KB) and searched it for poll and minute terms; the poll default is not stated there, so the docs page cannot be used as a source for the number.

Claims
- crossplane-runtime managed reconciler default poll interval is 1 minute. Status: VERIFIED. URL: https://github.com/crossplane/crossplane-runtime/blob/main/pkg/reconciler/managed/reconciler.go (main, 2026-11-26). Quote: `defaultPollInterval = 1 * time.Minute`
- Crossplane core `--poll-interval` default is 1m. Status: VERIFIED. URL: https://github.com/crossplane/crossplane/blob/main/cmd/crossplane/core/core.go. Quote: `PollInterval time.Duration `default:"1m"``
- Provider-upjet-aws defaults `--poll` to 10m and `--sync` to 1h. Status: VERIFIED. URL: https://github.com/crossplane-contrib/provider-upjet-aws/blob/main/cmd/provider/ec2/zz_main.go. Quote: `Default("10m").Duration()`
- The docs.crossplane.io managed-resources page states the poll interval default. Status: UNVERIFIED (page read in full via scrape, no poll-interval statement found). URL: https://docs.crossplane.io/latest/managed-resources/managed-resources/. Date: 2026-11-26. Quote: none.

## Finding: Argo CD polling default and sharding default

Argo CD v3.6.3's FAQ says the Git poll default is 3 minutes, computed as 120 seconds plus up to 60 seconds of jitter. PR 22342 ("chore!: add 60s default jitter", merged 2025-03-13) did this; its body says it was not added to the 2.14 to 3.0 migration guide "because the maximum default is the same (at least every 3 minutes)". So the stated motivation (preserving the 3-minute ceiling) is in the PR, but the reason for adding jitter itself is not stated. For sharding, the v3.6.3 HA page lists legacy, round-robin and consistent-hashing without a "(default)" marker (v3.0.0 had "legacy (default)"), but `common.go` at both v3.0.0 and v3.6.3 sets `DefaultShardingAlgorithm = LegacyShardingAlgorithm`, and the `--sharding-method` flag uses it. The default is legacy; only the docs omit the marker. The CNOE blog the docs cite is readable: dated November 21, 2023, it reports 3x CPU utilization improvement and 5x fewer rebalancings from three new sharding algorithms developed with Red Hat.

Claims
- Argo CD default poll is 120s plus up to 60s jitter (3 minutes max). Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/faq.md. Version: v3.6.3. Quote: "This default interval is calculated as 120 seconds + up to 60 seconds of jitter"
- PR 22342 added the 60s default jitter and did not change the 3 minute maximum. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/pull/22342. Date: merged 2025-03-13. Quote: "the maximum default is the same (at least every 3 minutes)"
- Why jitter was added (rationale beyond keeping the 3 minute maximum). Status: UNVERIFIED (PR body is one sentence; the 2.14-3.0 upgrade notes at v3.0.0 contain no jitter text). URL: https://github.com/argoproj/argo-cd/pull/22342. Quote: none.
- The default sharding algorithm in v3.6.3 is legacy. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/common/common.go. Version: v3.6.3. Quote: `DefaultShardingAlgorithm = LegacyShardingAlgorithm`
- The v3.6.3 HA page omits the "(default)" marker. Status: VERIFIED. URL: https://github.com/argoproj/argo-cd/blob/v3.6.3/docs/operator-manual/high_availability.md. Quote: "`legacy` mode uses an `uid` based distribution (non-uniform)."
- CNOE benchmarks show benefit from the new sharding algorithms. Status: VERIFIED (blog read; results are the authors' own benchmarks). URL: https://cnoe.io/blog/argo-cd-application-scalability. Date: 2023-11-21. Quote: "improve CPU utilization by a factor of 3 and reduce application-to-shard rebalancing by a factor of 5"

## Finding: Kubernetes and controller-runtime items

The skip-counter names were not in CHANGELOG-1.36 under those words for ReplicaSet and StatefulSet, but master source defines them: `stale_sync_skips_total` under subsystems `replicaset_controller` and `statefulset_controller`; the 1.36 changelog covers daemonset and job explicitly (`daemonset_controller_stale_sync_skips_total`, `job_controller_stale_sync_skips_total`, behind `StaleControllerConsistencyDaemonSet` and `...Job` gates). Whether ReplicaSet and StatefulSet shipped in a given release was not confirmed; the source reading is master only. controller-runtime v0.25.0 (2026-09-03) introduced an experimental `ReadYourWritesConsistency`, enabled with `Client.EnableReadYourWritesConsistency`; v0.25.3 (2026-11-16) is the latest release. etcd's docs state the default quota is 2 GiB, settling the CNCF-blog-only claim. The contents of issue 808's comment thread were only partly checked: it is open with 13 comments, and the one comment matching "requeue" or "immediate" is a 2020 note about where to document backoff.

Claims
- ReplicaSet and StatefulSet controllers have `stale_sync_skips_total` metrics. Status: VERIFIED (master source; release not pinned). URL: https://github.com/kubernetes/kubernetes/blob/master/pkg/controller/replicaset/metrics/metrics.go and .../statefulset/metrics/metrics.go. Date: read 2026-11-26. Quote: `Name: "stale_sync_skips_total"`
- Daemonset and job controllers defer sync on stale cache, with metrics. Status: VERIFIED. URL: https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md. Version: 1.36. Quote: "`daemonset_controller_stale_sync_skips_total` metric is incremented"
- controller-runtime ships read-your-writes behavior. Status: VERIFIED (experimental, opt-in, v0.25.0). URL: https://github.com/kubernetes-sigs/controller-runtime/releases/tag/v0.25.0. Date: 2026-09-03. Quote: "introduces a new experimental `ReadYourWritesConsistency` feature"
- etcd default storage quota is 2 GiB. Status: VERIFIED. URL: https://github.com/etcd-io/website/blob/main/content/en/docs/v3.6/dev-guide/limit.md. Version: v3.6 docs. Quote: "The default storage size limit is 2 GiB, configurable with `--quota-backend-bytes` flag."
- Issue 808 comments support or contradict "immediate" requeue. Status: UNVERIFIED (13 comments; only keyword-filtered, not read in full). URL: https://github.com/kubernetes-sigs/controller-runtime/issues/808. Quote: none.

## Finding: Smaller Crossplane, Argo and Cluster API claims

Crossplane's draft one-pager on function-to-claim conditions still says Status: Draft; I found no shipped-behavior page, so the Synced=False claim stays design-only. On main, `--enable-operations` sits under "Alpha Features" in core.go, and a title search for "operations beta" found no issue, so a beta plan is not found. A search of crossplane/crossplane issues for claims deprecation returned only unrelated issues (5522 native secret stores, 4627 cross resource references). Argo Rollouts exposes `--rollout-resync` ("Time period in seconds for rollouts resync."), but the claim that operators use it as a guard against missed events remains a user statement. Cluster API's repository root listing has no adopters file (root names read; subdirectories not searched).

Claims
- Function-fatal results set XR Synced False and claim messages need user-defined fields. Status: SECONDARY-ONLY (Draft design one-pager, not shipped behavior). URL: https://github.com/crossplane/crossplane/blob/main/design/one-pager-fn-claim-conditions.md. Date: main, read 2026-11-26. Quote: "Status: Draft"
- Operations is alpha on main; no beta graduation plan found. Status: VERIFIED for alpha flag grouping; plan UNVERIFIED (searched issue titles for "operations beta"; found nothing). URL: https://github.com/crossplane/crossplane/blob/main/cmd/crossplane/core/core.go. Quote: `EnableOperations bool `group:"Alpha Features:"``
- A date or plan to deprecate or remove Crossplane claims. Status: UNVERIFIED (searched issues for "claims deprecate"; found nothing relevant). URL: https://github.com/crossplane/crossplane/issues. Quote: none.
- Argo Rollouts `--rollout-resync` exists. Status: VERIFIED. URL: https://github.com/argoproj/argo-rollouts/blob/master/cmd/rollouts-controller/main.go. Quote: "Time period in seconds for rollouts resync."
- Operators run it as a guard against stuck rollouts. Status: SECONDARY-ONLY (user statement in issue 4140). URL: https://github.com/argoproj/argo-rollouts/issues/4140. Date: 2025-02-19. Quote: "ArgoRollouts is running with the flag `--rollout-resync=60` to prevent rollouts from getting stuck due to missed events." [corrected in verification: issue 4140 re-read; the quote exists in the reporter's text. Status stays SECONDARY-ONLY because it is one user's statement, not a project recommendation.]
- Cluster API has no adopters file at repo root. Status: VERIFIED (root directory listing only). URL: https://github.com/kubernetes-sigs/cluster-api. Date: read 2026-11-26. Quote: none (absence).

## Triage of the remaining markers (still unverified)

Left unchanged, with reasons:
- Reddit Pi-Day (Kubezilla retelling, 314 minutes, 1.24 label detail): SECONDARY-ONLY; Reddit's own post was not located in this pass.
- Skyscanner mechanism, Spotify and Airbnb talk contents: primary is a Medium page (empty scrape) or a YouTube page with no transcript; see Unreadable sources.
- Postmortems for CRD deletion cascade, etcd quota alarm, GitOps revert loop, retry storms: absence claims; no new search run here.
- Rate of orphaning after forced finalizer removal, Flux sharding vs APF throttling incident, named production kro adopters: absence claims.
- kro CNCF status, kro v0.9.4 rate-limiter table, per-kind Config Connector intervals, ACK/NVSentinel/Argo CD 18151 closure details, PodIdentityAssociation cost figures (reporter's own estimate): deprioritized as lower consequence or needing deep source reading.
- bex.co claims about CNCF radar and AWS kro docs, aijourn survey claim: secondary press; the CNCF radar and survey originals were not located.

## Unreadable sources

- https://medium.com/@SkyscannerEng/how-a-couple-of-characters-brought-down-our-site-356ccaf1fbc3: web_scrape returned empty content (success status, empty body), likely JS-rendered or gated.
- https://docs.crossplane.io/latest/concepts/compositions/: web_scrape returned empty content; curl showed HTTP 404, so the page does not exist at that path (not a block).

## Not found

- Searched argo-cd 2.14-3.0 upgrade notes at v3.0.0 and master for "jitter", "polling", "reconciliation"; found nothing about why jitter was added.
- Searched crossplane/crossplane issues for "claims deprecate" and "operations beta"; found no deprecation date and no beta plan.
- Searched v3.6.3 docs and the managed-resources docs page for a poll default; Argo CD's is in faq.md, Crossplane's is not in the docs page.
- Searched Cluster API repository root for an adopters file; found nothing (root only).
- GitHub API rate limiting stopped some code searches mid-run; any claim not listed above was not retried.

## Removed in verification

- None removed. Second-pass adversarial verification (2026-11-26) re-fetched about 30 claims via gh raw text, curl and WebFetch; all were reproduced, with one correction (core `--max-reconcile-rate` is an alias for max concurrent reconciles). The ReplicaSet/StatefulSet metrics claim stays release-unpinned. Previously: all re-fetched claims were reproduced (helm-controller changelog/main.go, Crossplane docs HTTP status and netlify.toml, issue 7453 and PRs 7783/7787, Crossplane poll defaults, Argo CD faq/PR 22342/common.go/HA page, CNOE blog, k8s 1.36 changelog and metrics sources, controller-runtime v0.25.0, etcd limit.md, Argo Rollouts flag, one-pager draft status, Cluster API root listing, issue 808 state and comment count). Verified 2026-11-26 via gh API raw text and curl.
