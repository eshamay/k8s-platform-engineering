---
title: "Research dossier: gap cluster o5-kro-ecosystem"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: []
tags: [kro, function-kro, graph-api, governance, scale, kcp, aenix, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: gap cluster o5-kro-ecosystem

> [!NOTE]
> **Raw file:** `raw/research-gap-o5-kro-ecosystem.md` (sha256 prefix 7905031da128)<br>
> **Kind:** Verified research dossier for gap cluster o5-kro-ecosystem, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing kro, function-kro, kcp, and Cozystack pages<br>
> **Caveat:** Evidence is mostly first-party repository text read through the gh CLI, plus scraped pages from kro.run, kcp.io, cncf.io, and Aenix. The dossier's web search tool returned mostly titles. Latest releases seen were kro v0.10.0 (2026-11-10), function-kro v0.4.0 (2026-11-26), kcp v0.33.6 (2026-11-04), and vCluster v0.38.0 (2026-11-17).

## Summary

The dossier covers four open gaps. On governance, every first-party source agrees that kro is a subproject of Kubernetes SIG Cloud Provider, and none calls it a CNCF project in its own right. The Graph API shipped alpha and off by default in v0.10.0. Its design document says a ResourceGraphDefinition "internally is a graph" and that Graph "does not replace or deprecate the RGD Kind". No promotion timeline was found, and the live kro.run roadmap still lists v0.10.0 as "Next".

On scale, kro's tuning page and source describe one shared, rate-limited queue in one dynamic controller, with one worker by default, while the docs FAQ separately says kro deploys "a dedicated controller" per RGD. The code supports the shared-queue description. No benchmark, measured limit, ADOPTERS file, or named production adopter was found. A third-party consultancy article reports controller memory growth, but it uses outdated names and cites no customer.

On function-kro, the README claims "full feature parity", yet the v0.4.0 repository ships `patches/UPSTREAM_DIFFERENCES.md` listing concrete behavioral differences. v0.4.0, released 2026-11-26, moved onto kro v0.10.0's graph engine, so parity is best read as the same engine with documented gaps.

On the Kubernetes-as-a-kernel distribution model, the only direct source is Aenix's own post, which describes kuberoot as a small, lab-tested project. No SIG charter, KEP, or talk adopting a distribution model was found. Adjacent signals are kcp (CNCF Sandbox), kcp's generic-controlplane (explicitly not production-ready), and API-machinery KEPs that help API-server-only deployments without naming the model.

The verification pass removed nothing and corrected two items: PR 1159 was opened 2026-03-17 and closed unmerged on 2026-08-11, and the Perun article says "many" instances, not "hundreds". Nothing in the dossier contradicts a claim the wiki states as fact. Several wiki pages carried the project's own parity claim as unverified, which the dossier refines and does not reverse.

## Key claims

kro governance and the Graph API
- kro is a subproject of Kubernetes SIG Cloud Provider, per the kro README, the SIG README, and the kro.run footer. VERIFIED. The kro.run sentence "Kubernetes is a CNCF graduated project." is about Kubernetes.
- OWNERS approvers are the SIG leads and kro-maintainers (a-hilaly, jakobmoellerdev, jlbutler). VERIFIED. The repository had 3,102 stars when read.
- v0.10.0 was published 2026-11-10 with "RGD on Graph — unifying the composition engine (Implementation of KREP-024)". VERIFIED.
- The Graph design document says Graph "does not replace or deprecate the RGD Kind". VERIFIED.
- The Graph API is "alpha and disabled by default", gate `GraphKind`, and the kro API is `v1alpha1` with possible breaking changes. VERIFIED.
- The in-repo roadmap is dated 2026-04-03 and says it is "not intended to be a timeline"; the live roadmap shows v0.10.0 as "Next" with 8 KREPs. VERIFIED, and the live snapshot may be cached.
- A newer proposal, KREP-026 propagation control (issue 1510), was opened 2026-11-13 and is open. VERIFIED.
- A Graph promotion timeline and kro's absence from the CNCF project list are UNVERIFIED.

kro scaling and adopters
- kro runs one shared rate-limited queue ("dynamic-controller-queue") and the docs say per-RGD queues may come later. VERIFIED against the tuning page and the v0.10.0 source.
- Defaults are 1 worker, 10 events per second with burst 100, a 10-hour resync, 20 retries, and a 30 second watch sync timeout. VERIFIED.
- The docs FAQ still says kro "deploys a dedicated controller", which contradicts the tuning page. VERIFIED as wording.
- Issue 198 (weighted queues, opened 2025-01-11) and issue 610 (continuous performance testing, opened 2025-07-23) are open. VERIFIED.
- PR 1159 (opened 2026-03-17, closed unmerged 2026-08-11) said "At large scale this adds unnecessary latency" about deletion convergence. VERIFIED.
- Graph collections apply with a default concurrency of 20. VERIFIED.
- Perun Engineering (2026-07-19) lists controller memory exhaustion with many instances. SECONDARY-ONLY and low reliability.
- A measured scaling limit and any named production adopter are UNVERIFIED.

function-kro parity
- The README claims "full feature parity". VERIFIED as a claim.
- `patches/UPSTREAM_DIFFERENCES.md` at v0.4.0 lists differences: a fatal run on an unrenderable existing resource, dependents seeing rendered values a pass earlier, no XRD status validation, inferred resource scope, approximated built-in conditions (`GraphResolved` always True), and skipped RGD creation-time validation. VERIFIED.
- v0.4.0 (2026-11-26) runs "kro's own graph engine" and holds a resource back until every referenced resource is ready. VERIFIED.
- The sole maintainer in OWNERS.md is Jared Watts. VERIFIED. Earlier releases were v0.3.0 (2026-06-14) and v0.2.1 (2026-04-13).
- Whether the SSA desired-state issue is fixed in v0.4.0, independent production reports, and the mapping of GraphRevision to CompositionRevision are UNVERIFIED.

Kubernetes-as-a-kernel
- Aenix describes its project as "tested in our own lab, not in someone else's production" and contrasts it with k3s and k0s. VERIFIED.
- The Cozystack CNCF Sandbox application (issue 87) was closed 2024-08-20. VERIFIED.
- kcp was accepted to CNCF Sandbox on 2023-09-19 and "intentionally only knows generic APIs"; its million-workspace figure is an ambition. VERIFIED.
- kcp generic-controlplane is "not yet ready for production use" and aims at use "without Kubernetes". VERIFIED.
- KEP-3157 watch-list targets stable in v1.38 and KEP-5866 sharded list and watch targets beta in v1.38. VERIFIED from kep.yaml values.
- Tim Hockin's 2023 talk content is SECONDARY-ONLY, as summarized in the Aenix post.
- A SIG discussion, KEP, or talk endorsing a distribution model, and k0s direction, are UNVERIFIED.

## Open questions the dossier leaves

When Graph leaves alpha, whether kro is listed by CNCF, any measured kro scaling limit, any named production kro adopter, whether function-kro fixed its SSA ownership problem, how GraphRevision maps to CompositionRevision, and whether any SIG or KEP adopts the distribution model. Unread sources: the KubeCon EU 2024 kcp talk video, the AWS EKS kro page and blog, the bex.co radar article, and the platformcon session.

## Pages touched

New pages are [findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps](../findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps.md), [findings/the-kro-docs-faq-says-a-dedicated-controller-per-rgd-while-the-tuning-page-and-source-describe-one-shared-queue](../findings/the-kro-docs-faq-says-a-dedicated-controller-per-rgd-while-the-tuning-page-and-source-describe-one-shared-queue.md), [findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter](../findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter.md), [findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post](../findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post.md), [examples/function-kro-v0-4-0-moved-onto-the-kro-v0-10-0-graph-engine-on-2026-11-26-with-one-listed-maintainer](../examples/function-kro-v0-4-0-moved-onto-the-kro-v0-10-0-graph-engine-on-2026-11-26-with-one-listed-maintainer.md), [examples/aenix-describes-kuberoot-as-a-small-lab-tested-distribution-positioned-against-k3s-and-k0s](../examples/aenix-describes-kuberoot-as-a-small-lab-tested-distribution-positioned-against-k3s-and-k0s.md), [examples/the-cozystack-cncf-sandbox-application-issue-87-was-closed-on-2024-08-20-over-governance-and-adopter-concerns](../examples/the-cozystack-cncf-sandbox-application-issue-87-was-closed-on-2024-08-20-over-governance-and-adopter-concerns.md), [examples/kcp-generic-controlplane-aims-at-an-api-server-without-kubernetes-and-says-it-is-not-ready-for-production](../examples/kcp-generic-controlplane-aims-at-an-api-server-without-kubernetes-and-says-it-is-not-ready-for-production.md), and [decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api](../decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api.md). Updated pages are [entities/kro](../entities/kro.md), [entities/function-kro](../entities/function-kro.md), [entities/kcp](../entities/kcp.md), [entities/cozystack](../entities/cozystack.md), [examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step](../examples/function-kro-runs-a-kro-resource-graph-as-a-crossplane-pipeline-step.md), [examples/non-container-appliances-on-the-kubernetes-api](../examples/non-container-appliances-on-the-kubernetes-api.md), [comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models](../comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models.md), [decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer](../decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer.md), [findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues](../findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues.md), and [findings/the-kro-in-repo-roadmap-predates-the-v0-10-0-release-and-gives-no-graph-promotion-timeline](../findings/the-kro-in-repo-roadmap-predates-the-v0-10-0-release-and-gives-no-graph-promotion-timeline.md).
