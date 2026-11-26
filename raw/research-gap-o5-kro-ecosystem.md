# Research dossier: gap cluster o5-kro-ecosystem

Research date: 2026-11-26

## Overview

This pass looked at four open gaps around kro and its neighbours. Every version, date and number below comes from a page or API response read in this run (GitHub raw files and releases through the gh CLI, plus web_scrape for kro.run, kcp.io, cncf.io and Aenix). The web_search tool returned mostly titles without content, so most evidence is first-party repository text.

Governance: the primary sources agree that kro is a subproject of Kubernetes SIG Cloud Provider (README, SIG README, kro.run footer, OWNERS files), and none of them calls it a CNCF project in its own right. The new fact since the earlier dossier is that the Graph API shipped in v0.10.0 (2026-11-10) as alpha and off by default, and the Graph design document now says RGD "internally is a graph": every RGD compiles to GraphRevision objects and runs on the shared graph engine, while Graph is "additive at the API surface" and does not replace or deprecate RGD. No promotion timeline for Graph from alpha was found. The live kro.run/roadmap page still lists v0.10.0 as "Next", so it lags the release, and the in-repo roadmap is dated 2026-04-03.

Scaling and adopters: kro's own docs describe a single shared, rate-limited queue in one dynamic controller (default 1 worker), and the docs FAQ separately says kro deploys "a dedicated controller" per RGD. Both statements sit in the same docs tree, so the wording conflicts, and the controller source supports the shared-queue description. No measured scaling number, no benchmark, and no named production adopter appears in kro's repository (no ADOPTERS file turned up). An open "continuous performance testing" issue (#610) and an open weighted-queue issue (#198) are the closest primary evidence. One third-party article lists production failure patterns but reads as generic and uses non-current terminology, so it is weak evidence.

function-kro parity: the README still claims "full feature parity", but the v0.4.0 repository ships a file, patches/UPSTREAM_DIFFERENCES.md, that lists concrete behavioral differences (fatal run on unrenderable existing resources, dependents seeing rendered values a pass earlier, no XRD status validation, inferred resource scope, approximated built-in conditions, skipped RGD-creation validation). v0.4.0 (2026-11-26) moved onto kro v0.10.0's graph engine, so the parity claim is best read as "same engine, documented gaps". Kubernetes-as-a-kernel: the only direct source is Ænix's own post, which describes kuberoot as a small, lab-tested project; no SIG discussion or KEP adopting a "distribution" model was found. Adjacent real signals are kcp (CNCF Sandbox, "beyond compute" goal), kcp's new generic-controlplane (explicitly not production-ready), and API-machinery KEPs such as watch-list streaming and server-side sharded list/watch that benefit any API-server-only deployment but do not mention the distribution model.

## Gap: kro governance status and the future of the Graph API

Findings. Governance is a SIG Cloud Provider subproject. The kro README opens with that statement, the SIG's own README lists kro under its subprojects, and the OWNERS file makes the SIG leads approvers alongside kro-maintainers. The kro.run footer says "kro is a subproject of Kubernetes SIG Cloud Provider. Kubernetes is a CNCF graduated project." That second sentence is about Kubernetes and does not make kro a CNCF project. This run did not check the CNCF landscape or project list for kro, so "not a CNCF project" is only supported by the absence of any first-party claim.

Maintainers (OWNERS_ALIASES on main): maintainers a-hilaly, jakobmoellerdev, jlbutler; reviewers michaelhtm, cheeseandcereal, NicholasBlaskey, Skarlso; an emeritus list includes people from several companies. The repo was pushed on 2026-11-26 and had 3,102 stars at read time; top contributor a-hilaly has 420 contributions.

Graph API future. The KREP-024 design document states that Graph and RGD "are no longer sibling engines" and that "RGD remains a user-facing Kind with unchanged external behavior, but internally it is a graph". It also says Graph "does not replace or deprecate the RGD Kind". The docs FAQ says the Graph API "is alpha and disabled by default", and the feature-gate table lists GraphKind as default false, Alpha, since v0.10.0. The gate controls only the Graph controller; RGDs behave the same with it on or off. No promotion date to beta appears in any page read. The in-repo v1 roadmap (last updated 2026-04-03) predates Graph, and the live kro.run/roadmap page (scraped today) shows v0.10.0 as "Next" with 8 KREPs, and v0.11.0, v0.12.0 and v1.0.0 lanes with 0 KREPs, so neither roadmap gives a Graph timeline. A newer proposal, KREP-026 propagation control (issue 1510), was opened 2026-11-13 and is still open. Per kro's FAQ the API is v1alpha1 and breaking changes may occur.

Option framing for the user (no recommendation): treat RGD as the stable surface and Graph as an experiment (docs wording supports this), or track Graph as the eventual primitive (design doc says RGD is built on it). Evidence for each is in the claims below.

Claims
- kro is a subproject of Kubernetes SIG Cloud Provider. VERIFIED. https://github.com/kubernetes-sigs/kro (README, main, read 2026-11-26). Quote: "kro is a subproject of Kubernetes SIG Cloud Provider."
- The SIG Cloud Provider README lists kro as an owned subproject. VERIFIED. https://github.com/kubernetes/community/blob/master/sig-cloud-provider/README.md (read via gh api, 2026-11-26). Quote: "The following subprojects are owned by sig-cloud-provider" followed by a "### kro" heading.
- kro.run footer ties kro to the SIG and says Kubernetes (not kro) is CNCF graduated. VERIFIED. https://kro.run/roadmap (scraped 2026-11-26). Quote: "Kubernetes is a CNCF graduated project."
- OWNERS: approvers are sig-cloud-provider-leads and kro-maintainers. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/main/OWNERS and OWNERS_ALIASES (2026-11-26). Quote: "kro-maintainers: - a-hilaly - jakobmoellerdev - jlbutler".
- Latest release is v0.10.0, published 2026-11-10. VERIFIED. https://github.com/kubernetes-sigs/kro/releases/tag/v0.10.0. Quote: "RGD on Graph — unifying the composition engine (Implementation of KREP-024)".
- Graph is additive and RGD runs on the graph engine. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/main/docs/design/proposals/graph.md (last commit touching it 2026-10-06). Quote: "does not replace or deprecate the RGD Kind".
- Graph API is alpha and off by default. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/faq.md and docs/advanced/02-feature-gates.md (main, 2026-11-26). Quote: "The Graph API is alpha and disabled by default."
- kro's API is v1alpha1 and may break. VERIFIED. FAQ above. Quote: "kro's API is currently at `v1alpha1`. As kro evolves, we may introduce breaking changes".
- In-repo roadmap is dated 2026-04-03 and says it is not a timeline. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/main/docs/v1-roadmap.md. Quote: "It is not intended to be a timeline for planning purposes."
- Live roadmap still shows v0.10.0 as "Next" after the release. VERIFIED (page snapshot may be cached or stale). https://kro.run/roadmap, 2026-11-26. Quote: "v0.10.0Next8 KREPs".
- A Graph promotion timeline from alpha. UNVERIFIED. Searched the roadmap, graph.md, FAQ, release notes and feature-gate docs; found nothing.
- kro is absent from the CNCF project list. UNVERIFIED. No CNCF page for kro was read.

## Gap: Scaling limits of per-RGD kro controllers and named production kro adopters

Findings. Premise correction (already partly in the wiki) is confirmed and sharpened. The controller-tuning doc shows one dynamic controller with a "Single shared queue", lazy informers, parent and child watches and metadata-only watches, with the note that "the shared queue could be replaced with per-RGD queues in future versions". Source at v0.10.0 (pkg/dynamiccontroller/dynamic_controller.go) builds one rate-limited queue named "dynamic-controller-queue" and its header comment says it orchestrates "parent watches (one per RGD)". Defaults in the docs: 1 worker, rate limit 10 events per second with burst 100, 10-hour resync (36000 s), 20 max retries, 30s watch sync timeout, 1 concurrent RGD reconcile, 1 concurrent Graph reconcile. The FAQ in the same docs tree still says kro "deploys a dedicated controller" and calls it a "microcontroller", so the docs disagree with themselves; the code and tuning page match the shared model.

Scale-related items in the repository: issue 198 (open since 2025-01-11) proposes weighted queues because a single queue "can lead to resource starvation"; issue 610 (open since 2025-07-23) asks for continuous performance testing; a PR (1159, opened 2026-03-17, closed unmerged 2026-08-11) [corrected in verification: the findings text previously gave 2026-03-17 as the close date] says "At large scale this adds unnecessary latency" for deletion convergence; v0.10.0 includes a cycle-detection optimization (PR 1449) and a fix to stop an informer churn hot loop after a hard apply failure (PR 1465). The roadmap's KREP-005 and KREP-023 (level-based and wavefront controllers) are described as aimed at large RGDs ("Reconciliation time becomes proportional to dependency graph depth rather than total resource count") but were Draft status in the April 2026 roadmap snapshot. Graph design text says collection instances apply in bounded parallel (default ApplyConcurrency 20).

No measured limit, benchmark or latency table was found. For adopters: no ADOPTERS file was found in the repository root listing, and a code search for "adopters" returned nothing. Searches for production case studies returned only vendor docs and blogs (AWS open source blog and EKS docs page appear in results but were not read in this run). A third-party consultancy article (Perun Engineering, 2026-07-19) lists five "production failure patterns" including controller memory growth with many instances; it uses outdated names (ResourceGroup, kro validate, kro diff), cites no named customer and no data, so treat it as low-reliability and uncorroborated by kro sources.

Claims
- kro runs a single shared rate-limited queue with N workers, not a controller per RGD. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/advanced/03-controller-tuning.md (main, 2026-11-26). Quote: "Single shared queue - All resource events flow through one rate-limited queue".
- Per-RGD queues are a possible future change. VERIFIED. Same page. Quote: "the shared queue could be replaced with per-RGD queues in future versions."
- Source matches: one named queue at v0.10.0. VERIFIED. https://github.com/kubernetes-sigs/kro/blob/v0.10.0/pkg/dynamiccontroller/dynamic_controller.go. Quote: `Name: "dynamic-controller-queue"`.
- Defaults: 1 worker, 10 events/s, burst 100, 10 h resync. VERIFIED. Controller tuning page. Quote: "`config.dynamicControllerRateLimiterRateLimit` | ... | 10 | Events per second".
- Docs FAQ says kro deploys a dedicated controller per RGD. VERIFIED (as wording; contradicts the tuning page). https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/faq.md. Quote: "kro then deploys a dedicated controller to respond to instance events on the CRD."
- Weighted-queue proposal exists, still open. VERIFIED. https://github.com/kubernetes-sigs/kro/issues/198 (opened 2025-01-11). Quote: "the DynamicController uses a single queue for all GVRs".
- Continuous performance testing is not in place. VERIFIED that an issue is open. https://github.com/kubernetes-sigs/kro/issues/610 (2025-07-23). Quote: "We need some sort of automation to execute performance testing for kro".
- Large initial lists can exceed the default watch sync timeout. VERIFIED. Controller tuning page. Quote: "If a resource has very many objects (tens of thousands), its initial list can take longer than the default".
- Deletion convergence latency at scale was raised in a PR. VERIFIED. https://github.com/kubernetes-sigs/kro/pull/1159 (opened 2026-03-17, closed 2026-08-11, not merged). [corrected in verification: previously worded as motivating a fix; the PR was closed without merging.] Quote: "At large scale this adds unnecessary latency".
- Graph collections apply with default concurrency 20. VERIFIED. graph.md (see governance gap). Quote: "default ApplyConcurrency=20".
- A measured per-controller or per-RGD scaling limit. UNVERIFIED. Searched kro issues/docs for scale, performance, benchmark; found nothing quantitative.
- Named production adopters. UNVERIFIED. Searched repo for ADOPTERS and "adopters", and the web for case studies; found nothing first-party.
- kro controller memory exhaustion on clusters with many instances, OOMKilled restarts. SECONDARY-ONLY. https://perun.au/insights/kro-production/ (2026-07-19). Quote: "Kro controller manager memory exhaustion on clusters with many ResourceGroup instances". [corrected in verification: page says "many", not "hundreds"/"large numbers".] Low reliability.
- bex.co "Adopt" radar article and AWS EKS kro page. UNVERIFIED in this run (appeared in search results, not read); earlier wiki dossier lists them as secondary.

## Gap: Feature parity of function-kro with standalone kro

Findings. The function-kro README claims it "natively embeds KRO's graph builder, CEL evaluator, and runtime engine with full feature parity". The repository's own difference list contradicts "full" in practice and is the best primary evidence. Release v0.4.0 (2026-11-26, today) moved to kro v0.10.0 by importing kro as a Go module and runs "kro's own graph engine", vendoring only the executor. Prior release v0.3.0 was 2026-06-14, v0.2.1 2026-04-13. The sole listed maintainer in OWNERS.md is Jared Watts, so bus factor is one named person (the file may not reflect all contributors; the release shows several PR authors).

Differences listed in patches/UPSTREAM_DIFFERENCES.md (v0.4.0): an existing resource that cannot be rendered fails the whole run with a fatal result and the XR goes Synced=False, where upstream keeps the resource and retries; a resource waiting on dependencies still receives template updates; a hard error in one resource fails the whole run; dependents see rendered values one function pass before server-set values; XR status is not checked against the XRD; resource scope is inferred rather than asked of the API server; Crossplane-owned condition types cannot be set by authors; `runtime.condition` reads approximations of built-in conditions (`GraphResolved` always True, `InstanceManaged` empty); and RGD creation-time validation is skipped (reserved IDs, non-lowerCamelCase IDs, `kro.run/` annotations). It also omits things Crossplane does instead of kro (applying, watching, deleting, XR schema). Readiness: v0.4.0 now holds a resource back until all referenced resources are ready, "matching upstream kro", and a `readyWhen` that never turns true blocks dependents. Revisions: the README attributes safe rollouts to Crossplane CompositionRevisions, which is a Crossplane layer rather than kro GraphRevisions; kro's own GraphRevision feature (v0.9) was not mapped to function-kro in any page read. The spec-desired-ssa.md design note documents an SSA ownership problem where the function returned the observed XR as desired state, with a proposed fix; whether it is fixed in v0.4.0 was not checked.

No independent production reports were found (searched web and function-kro issues listing was not exhaustively read).

Claims
- README asserts full parity. VERIFIED (as claim). https://github.com/crossplane-contrib/function-kro/blob/main/README.md (2026-11-26). Quote: "with full feature parity."
- Repo documents behavioral differences from upstream. VERIFIED. https://github.com/crossplane-contrib/function-kro/blob/v0.4.0/patches/UPSTREAM_DIFFERENCES.md. Quote: "This document lists where a ResourceGraph behaves differently than the same RGD would in kro".
- Existing unrenderable resource fails the run. VERIFIED. Same file. Quote: "function-kro returns a fatal result. Crossplane then applies nothing".
- Built-in conditions are approximated. VERIFIED. Same file. Quote: "`GraphResolved` is always `True`".
- Status not validated against XRD. VERIFIED. Same file. Quote: "function-kro doesn't check the ResourceGraph's status fields against it."
- Creation-time RGD validation is skipped. VERIFIED. Same file. Quote: "function-kro skips that step, because it requires upstream code that isn't public."
- v0.4.0 upgrades to kro v0.10.0 and runs kro's graph engine. VERIFIED. https://github.com/crossplane-contrib/function-kro/releases/tag/v0.4.0 (published 2026-11-26). Quote: "runs kro's own graph engine, so its behavior matches upstream kro much more closely."
- v0.4.0 dependency gating matches upstream. VERIFIED. Same release. Quote: "A resource is now held back until every resource it references is ready, matching upstream kro."
- XR custom conditions supported, read-only context supported. VERIFIED. Same release. Quote: "The context is read only, and writing to it isn't supported yet."
- Sole maintainer listed. VERIFIED. https://github.com/crossplane-contrib/function-kro/blob/main/OWNERS.md. Quote: "Jared Watts <jared@upbound.io> (jbw976)".
- SSA desired-state design note exists. VERIFIED (document only). https://github.com/crossplane-contrib/function-kro/blob/main/spec-desired-ssa.md. Quote: "This causes the function to claim SSA ownership of every field in the observed XR".
- SSA issue fixed in v0.4.0. UNVERIFIED.
- Independent production reports of function-kro. UNVERIFIED; searched web and repo, found nothing.
- Mapping of kro GraphRevision to Crossplane CompositionRevision behavior. UNVERIFIED.

## Gap: Community direction for the Kubernetes-as-a-kernel distribution model

Findings. The Ænix post (https://aenix.io/blog/2026/10/kubernetes-as-the-linux-kernel/) is a single-vendor proposal. It frames the idea as a corollary of Tim Hockin's KubeCon Chicago 2023 complexity-budget talk (the post's account, not a transcript read here). It describes kuberoot as built "in our spare time by a very small team" and "tested in our own lab, not in someone else's production", with no independent security audit. It also says the project differs from k3s and k0s, which are "installed on top of someone else's operating system". It names Cozystack as Ænix's own project; the Cozystack CNCF Sandbox application (issue 87) was closed 2024-08-20 with TOC concerns about business separation, adopters, maintainer diversity and governance. I found no SIG charter, KEP, or talk that adopts a "distribution" model for Kubernetes.

Related community directions that do exist. kcp is a CNCF Sandbox project (accepted 2023-09-19 per cncf.io); its homepage states "kcp intentionally only knows generic APIs, no pods or related resources" and "does not replace Kubernetes", with ambitions of 1 million workspaces and 10,000 shards (goals). Its latest release read was v0.33.6 (2026-11-04). The kcp-dev/generic-controlplane repo (40 stars) says it is "not yet ready for production use" and aims at a control plane "that can be used without Kubernetes", with API groups as opt-in "batteries" and the long-run plan to make the default server resource-free. vCluster (loft-sh) describes itself as tenant clusters each with their own API server, running on an existing cluster "or standalone on bare metal", latest v0.38.0 (2026-11-17). k0s is described as "The Zero Friction Kubernetes" (repo description only; no direction doc read). In upstream, API-machinery KEPs that help API-server-centric deployments are in flight: KEP-3157 watch-list streaming (kep.yaml shows alpha v1.27, beta v1.32, stable v1.38 target, stage stable) and KEP-5866 server-side sharded list and watch (alpha v1.36, beta v1.38). Neither mentions the distribution model. KubeCon talk transcripts were not located; the kcp homepage links the KubeCon EU 2024 talk "Why Kubernetes is Inappropriate for Platforms, and How to Make it Better", but the video was not read.

Evidence-only framing: for "community direction", supporting sources are kcp (CNCF-hosted, beyond-compute goal) and the generic-controlplane project; sources against or neutral are the absence of any SIG or KEP naming the model, the Ænix post's own caveats, and the early-stage disclaimers. No recommendation is made.

Claims
- Ænix is a single-vendor, lab-tested, small-team project. VERIFIED. https://aenix.io/blog/2026/10/kubernetes-as-the-linux-kernel/ (Oct 2026). Quote: "tested in our own lab, not in someone else's production."
- Ænix positions against k3s and k0s as on-top-of-OS distributions. VERIFIED. Same post. Quote: "they are Kubernetes distributions installed on top of someone else's operating system".
- Cozystack's CNCF Sandbox application was closed. VERIFIED. https://github.com/cncf/sandbox/issues/87 (closed 2024-08-20). Quote: "Closing this application in favor of a future application to sandbox".
- kcp is a CNCF Sandbox project accepted 2023-09-19. VERIFIED. https://www.cncf.io/projects/kcp/. Quote: "kcp was accepted to CNCF on September 19, 2023 at the Sandbox maturity".
- kcp targets non-container control planes. VERIFIED. https://www.kcp.io/. Quote: "kcp intentionally only knows generic APIs, no pods or related resources."
- kcp scale figures are ambitions. VERIFIED (as stated ambition). Same page. Quote: "Our ambitions are to eventually reach 1 million workspaces and 10,000 shards."
- generic-controlplane is not production-ready. VERIFIED. https://github.com/kcp-dev/generic-controlplane (README, 2026-11-26). Quote: "is not yet ready for production use."
- generic-controlplane aims at APIs without Kubernetes. VERIFIED. Same README. Quote: "can be used **without Kubernetes**".
- vCluster supports standalone bare metal. VERIFIED (repo description). https://github.com/loft-sh/vcluster, 2026-11-26. Quote: "runs on an existing cluster or standalone on bare metal."
- KEP-3157 watch-list targets stable in v1.38. VERIFIED (kep.yaml values). https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3157-watch-list/kep.yaml. Quote: `stable: "v1.38"`.
- KEP-5866 sharded list/watch: alpha v1.36, beta v1.38. VERIFIED. .../5866-server-side-sharded-list-and-watch/kep.yaml. Quote: `beta: "v1.38"`.
- A SIG discussion, KEP or KubeCon talk endorsing a Kubernetes "distribution" model. UNVERIFIED; searched kubernetes/enhancements for nodeless/"without nodes"/"generic control plane" and found no relevant KEP, plus web searches; found nothing.
- Tim Hockin's 2023 talk content. SECONDARY-ONLY (as summarized in the Ænix post). Same URL. Quote: "treating complexity as a budget".
- k0s direction on minimal or API-only deployments. UNVERIFIED; only repo description read.

## Unreadable sources

- https://www.cncf.io/projects/kcp/ : first scrape returned an oversize result saved to file; read via jq from the saved file (readable, not truly unreadable).
- https://aenix.io/blog/2026/10/kubernetes-as-the-linux-kernel/ : same oversize handling, read via jq in full for the relevant sections (intro, comparison, risks); the middle technical sections were only grep-scanned.
- KubeCon EU 2024 kcp talk video (linked from kcp.io): not read; video, no transcript tool used.
- AWS EKS kro page, AWS open-source kro blog, bex.co radar article, platformcon session page: appeared in search results with null content; not scraped in this run.

## Not found

- kro governance: any CNCF project or sandbox listing for kro; any promotion timeline for the Graph API from alpha.
- kro scale: a benchmark, measured per-RGD or per-controller limit, ADOPTERS file, or named production adopter with a primary source.
- function-kro: independent production reports; confirmation that the SSA desired-state issue is fixed; a mapping of GraphRevision to CompositionRevision semantics.
- Kernel model: SIG charter or KEP endorsing a Kubernetes distribution model; KubeCon transcripts for it; direction documents for k0s.
- Searches run: "kro ... adopters production", "kro ... case study KubeCon", "kcp generic control plane CNCF sandbox", "Kubernetes as a kernel distribution API server only ...", GitHub issue and code searches in kubernetes-sigs/kro and kubernetes/enhancements.

## Removed in verification

- None removed. Corrections above: PR 1159 dates and merge status; Perun memory-growth wording. All other checked claims (release dates, defaults, OWNERS, KEP milestones, kcp quotes, function-kro v0.4.0 and difference-list quotes, Aenix quotes, issue dates, star count 3,102, 420 contributions) reproduced. Not re-checked: kro.run/roadmap snapshot, jq-read oversize pages, vCluster description, function-kro README parity quote.
