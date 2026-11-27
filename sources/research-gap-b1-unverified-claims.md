---
title: "Research dossier: re-check of unverified claims (b1-unverified-claims)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-unverified-claims
    hash: f729a143be31
    ingested: 2026-11-26
aliases: []
tags: [flux, crossplane, argo-cd, controller-runtime, kubernetes, research-dossier, gap-closing, targeted-pass, verification]
---

# Research dossier: re-check of unverified claims (b1-unverified-claims)

> [!NOTE]
> **Raw file:** `raw/research-gap-b1-unverified-claims.md` (sha256 prefix f729a143be31; revised from d152f98abb04, see Revision note)<br>
> **Kind:** Verified research dossier for gap cluster b1-unverified-claims, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the pages that held UNVERIFIED, SECONDARY-ONLY, or UNREADABLE claims<br>
> **Caveat:** Every claim was re-fetched from a primary source (source files at a tag or branch, release notes, GitHub issues and pull requests, curl status checks). GitHub API rate limiting cut off some searches, and absence claims are recorded as "searched X, found nothing", not as proof.

## Summary

The dossier re-checked about 60 claims that earlier dossiers marked UNVERIFIED, SECONDARY-ONLY, or UNREADABLE and settled 21 of them against primary sources. Four earlier uncertainties are now answered: the helm-controller `--override-manager` flag has a dated changelog entry (v1.5.0, 2026-02-20), `legacy` is the default Argo CD sharding method in v3.6.3 even though the docs page dropped the marker, controller-runtime v0.25.0 shipped an experimental read-your-writes option, and the old Crossplane `/latest/concepts/...` URLs return 404 instead of redirecting.

Several questions stay open for structural reasons. Incident-talk contents (Spotify, Airbnb, Skyscanner on Medium) sit behind video pages or an empty scrape, absence claims can only be recorded as a search result, and a handful of lower-consequence claims (kro CNCF status, per-kind Config Connector intervals, press claims about CNCF radar and surveys) were not retried.

## Key claims

- helm-controller added a `--override-manager` flag in v1.5.0 (changelog release date 2026-02-20), a repeatable string-array flag wired to `DisallowedFieldManagers`, for server-side apply drift detection and correction. VERIFIED. https://github.com/fluxcd/helm-controller/blob/main/CHANGELOG.md
- The changelog says helm-controller drift correction is "completely unrelated to Helm v4's server-side apply support, and was implemented long before Helm v4". VERIFIED.
- `/latest/concepts/compositions/` on docs.crossplane.io returns HTTP 404 with no redirect, and so do the old `/latest/concepts/` pages for composition revisions, managed resources, providers, composition functions, and composite resources. The moved equivalents under `/latest/composition/` and `/latest/managed-resources/` return 200. VERIFIED by curl on 2026-11-26.
- `/v1.20/concepts/compositions/` still returns 200. VERIFIED by curl.
- The docs repository `netlify.toml` redirects end-of-life version paths to `/latest/:splat` and warns "These might return 404 if docs have moved around". Some explicit rules still target `/latest/concepts/composition-revisions/`, which is a 404 today. VERIFIED.
- Crossplane issue 7453 (opened 2026-05-31 on v2.3.1) is open with labels `bug` and `stale`. A maintainer (jbw976, 2026-08-27) could not reproduce it and suggested that `kubectl get -o yaml` hides `managedFields`. Pull requests 7783 and 7787 are open and unmerged. VERIFIED. The reporter's claim that the XR controller clears `managedFields` is SECONDARY-ONLY and disputed.
- crossplane-runtime's managed reconciler has `defaultPollInterval = 1 * time.Minute`, Crossplane core's `--poll-interval` defaults to 1m, and provider-upjet-aws defaults `--poll` to 10m and `--sync` to 1h. VERIFIED.
- The docs.crossplane.io managed-resources page (42 KB, read in full) does not state a poll interval default. The page cannot be cited for the number. UNVERIFIED as a docs claim.
- Argo CD v3.6.3's FAQ says the Git poll default is "120 seconds + up to 60 seconds of jitter". Pull request 22342 (merged 2025-03-13) added the 60 second default jitter and says the maximum default stays at 3 minutes. VERIFIED. Why jitter was added beyond keeping the ceiling is UNVERIFIED.
- `DefaultShardingAlgorithm = LegacyShardingAlgorithm` in `common/common.go` at both v3.0.0 and v3.6.3, so legacy is the default sharding method. The v3.6.3 high-availability page lists legacy, round-robin, and consistent-hashing without a "(default)" marker. VERIFIED.
- The CNOE blog of 2023-11-21 reports three new Argo CD sharding algorithms, with "improve CPU utilization by a factor of 3 and reduce application-to-shard rebalancing by a factor of 5". VERIFIED as the authors' own benchmark results.
- Kubernetes master source defines `stale_sync_skips_total` under the `replicaset_controller` and `statefulset_controller` subsystems. VERIFIED for master; the release in which each shipped was not pinned. The 1.36 changelog names the daemonset and job counters.
- controller-runtime v0.25.0 (2026-09-03) "introduces a new experimental `ReadYourWritesConsistency` feature", enabled with `Client.EnableReadYourWritesConsistency`. v0.25.3 (2026-11-16) is the latest release. VERIFIED.
- etcd v3.6 docs: "The default storage size limit is 2 GiB, configurable with `--quota-backend-bytes` flag." VERIFIED.
- Argo Rollouts exposes `--rollout-resync` ("Time period in seconds for rollouts resync."). VERIFIED. That operators use it as a guard against missed events is SECONDARY-ONLY, one user's statement in issue 4140.
- Crossplane's function-to-claim conditions one-pager still says "Status: Draft", so the claim that a fatal function result sets the XR `Synced` condition to False is SECONDARY-ONLY design intent. On main, `--enable-operations` sits under "Alpha Features" in `core.go`.
- The Cluster API repository root has no adopters file. VERIFIED for the root listing only.

- Crossplane core's `--max-reconcile-rate` is an alias of the `MaxConcurrentReconciles` field (flag `--max-concurrent-reconciles`, default 100, "worker pool size"), not a rate limit. VERIFIED (correction made in the dossier's second verification pass). Core's other flag defaults stay as stated: `--poll-interval` 1m, `--sync-interval` 1h, `--min-poll-interval` 1s.

## Revision note

The raw file was revised on 2026-11-26 after a second-pass adversarial verification that re-fetched about 30 claims and reproduced all of them, with one correction, the core `--max-reconcile-rate` alias above. The ReplicaSet and StatefulSet metrics claim stays release-unpinned. Pages written from the first revision (hash d152f98abb04) keep that hash in their `sources` entry. Only the Crossplane poll-interval finding was affected by the correction.

## Not found

- No reason for the Argo CD 60 second jitter beyond preserving the 3 minute maximum (pull request 22342, 2.14 to 3.0 upgrade notes).
- No Crossplane operations beta plan (issue titles searched for "operations beta") and no claims deprecation date (issues searched for "claims deprecate").
- No full read of controller-runtime issue 808; the 13 comments were only keyword-filtered.

## Pages updated from this source

[findings/field-ownership-blocks-drift-correction](../findings/field-ownership-blocks-drift-correction.md), [examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port](../examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port.md), [comparisons/exemption-and-ignore-controls-across-tools](../comparisons/exemption-and-ignore-controls-across-tools.md), [findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method](../findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method.md), [findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental](../findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental.md), [comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding](../comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding.md), [entities/argo-cd](../entities/argo-cd.md), [findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes](../findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes.md), [examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it](../examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it.md), [entities/controller-runtime](../entities/controller-runtime.md), [findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md), [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](../findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md), [examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write](../examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write.md), [findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm](../findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm.md), [findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers](../findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers.md), [examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource](../examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource.md), [findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane](../findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane.md), [entities/crossplane](../entities/crossplane.md), [entities/cluster-api](../entities/cluster-api.md), [findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references](../findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references.md), [findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs](../findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs.md).

## Pages created from this source

[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply](../findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply.md), [findings/the-old-crossplane-latest-concepts-urls-return-404-and-the-docs-redirect-rules-only-cover-end-of-life-versions](../findings/the-old-crossplane-latest-concepts-urls-return-404-and-the-docs-redirect-rules-only-cover-end-of-life-versions.md), [findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client](../findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client.md), [findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker](../findings/argo-cd-v3-6-3-still-defaults-to-legacy-sharding-because-the-source-says-so-even-though-the-docs-page-dropped-the-marker.md).
