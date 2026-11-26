---
title: "Research dossier: named adopters of control-plane tools, Flux sharding and APF incidents, and kro scaling and adopters (g1-named-adopters)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: []
tags: [adopters, flux, sharding, apf, kro, crossplane, ack, kcp, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: named adopters of control-plane tools, Flux sharding and APF incidents, and kro scaling and adopters (g1-named-adopters)

> [!NOTE]
> **Raw file:** `raw/research-gap-g1-named-adopters.md` (sha256 prefix 9f6a50098233)<br>
> **Kind:** Verified research dossier for gap cluster g1-named-adopters, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing adopter, Flux sharding, APF, and kro pages<br>
> **Caveat:** Adopter figures are self-reported one-liners in community-maintained files and are not audited. Claims marked SECONDARY-ONLY come from one third-party blog and enter the wiki only with that attribution. UNVERIFIED claims are negative results and appear here only as open questions.

## Summary

The dossier looked for named organizations and reported figures behind three open gaps. The first concerns adopters of control-plane tools such as Crossplane, ACK, and kcp. The second concerns named Flux sharding adopters and published API Priority and Fairness incidents. The third concerns the scaling limits of kro and its named production adopters. Most evidence came from repository files and GitHub issues, because the search tool returned few usable hits.

Crossplane has the richest record, with 87 linked rows in its ADOPTERS file, but every entry is a self-listing and only about eight carry numbers. ACK and kcp have short files. The kcp file marks only Upbound as "Production" and five other organizations as "Development". No adopters file was found for kro or Config Connector, and a code search found none for Cluster API, although that last result is unverified. For Flux sharding, no organization was found that says it runs sharded Flux at a stated scale. Morgan Stanley, the best-known large adopter, lists sharding under "Looking Ahead". No incident ties Flux or sharded Flux to API Priority and Fairness throttling. For kro, the dossier corrects the premise of the gap: the released-docs page describes one shared dynamic controller with a single queue and not a dedicated controller per ResourceGraphDefinition. No kro benchmark and no named production kro adopter was found.

## Key claims

### Adopters of control-plane tools

- The Crossplane ADOPTERS file lists 87 linked rows by the dossier's own count, last committed 2026-10-27, and describes itself as a list of organizations using Crossplane. VERIFIED. https://raw.githubusercontent.com/crossplane/crossplane/main/ADOPTERS.md
- SAP reports "currently 100+ KRM based control planes with Crossplane and other technologies and 1000s of Managed Resources", as of February 2024. VERIFIED as a self-report. See [[examples/sap-reports-more-than-100-crossplane-based-control-planes-and-thousands-of-managed-resources-as-of-february-2024]].
- Consensys reports "managing more than 1,000 resources" and links a KubeCon talk that the dossier did not watch. VERIFIED as a self-report. See [[examples/consensys-reports-managing-more-than-1000-resources-with-crossplane]].
- Built Technologies reports that "at times it has exceeded over 10,000 AWS resources managed by Crossplane" in a developer environment. VERIFIED as a self-report. See [[examples/built-technologies-reports-peaks-above-10000-aws-resources-managed-by-crossplane-in-a-developer-environment]].
- SpareBank 1 Utvikling reports a "migration of over a thousand production microservices, databases and caches". VERIFIED as a self-report. See [[examples/sparebank-1-utvikling-reports-a-self-service-migration-of-over-a-thousand-production-microservices-with-crossplane]].
- Akamai says provider-ceph is "capable orchestrating up to 200k Managed Resources which represent S3 buckets", a capability statement. DKB reports more than 10 EKS clusters and thousands of resources, and Nike reports thousands of resources from development to production. All VERIFIED as self-reports. See [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]].
- The ACK adopters file is "a self-reported list of users", and the first three rows read name Adobe, BT, and Continuum Industries. Adobe lists "Global Kubernetes cluster provisioning, stateful service infrastructure provisioning using multiple ACK controllers". VERIFIED as a self-report; only the first rows were read. See [[examples/adobe-lists-ack-for-global-kubernetes-cluster-provisioning-and-stateful-service-infrastructure]].
- The kcp adopters file marks Upbound "Production" for multi-tenant access to the host cluster in its Cloud Managed Control Planes product, and marks SAP, SNCF Group, Kubermatic, Faros.sh, and KubeStellar "Development". VERIFIED as a self-report. See [[examples/upbound-is-the-only-kcp-adopter-marked-production-in-the-adopters-file]].
- The Flux adopters page describes its list as "a selection of organisations who self-identified as using any of the Flux projects in production", with logos only. The data file `1-flux-v2.yaml` holds 127 `name:` lines by the dossier's count. VERIFIED.
- The Config Connector repository root has no adopters file. VERIFIED. No adopters file was found for Cluster API, but that negative result came from a code search and the root listing was not read. UNVERIFIED.

### Flux sharding, benchmarks, and API Priority and Fairness

- The Flux sharding page advises sharding "when Flux is managing tens of thousands of applications" and says extra replicas add no capacity. VERIFIED. https://fluxcd.io/flux/installation/configuration/sharding/
- Morgan Stanley reports over 500 clusters, over 2,000 nodes, over 100,000 containers, and tens of thousands of Flux resources, and lists "Exploring sharding Flux controllers" under "Looking Ahead", so it is not a documented sharding user. VERIFIED. The blog post is dated 2026-03-15 and the talk was at FluxCon NA 2025. See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].
- Sharding by `--watch-label-selector` was proposed by Stefan Prodan in flux2 issue 3731, opened 2023-03-29. VERIFIED.
- A maintainer wrote in kustomize-controller issue 1174 (2024-05-29) that "A single kustomize-controller instance can do 1K reconciliation in about 3m", replying to an unnamed user with over 300 namespaces who saw 5-minute delays. VERIFIED. See [[examples/an-unnamed-user-with-300-namespaces-saw-5-minute-delays-and-a-flux-maintainer-cited-1k-kustomizations-in-about-3-minutes]].
- Cross-shard `dependsOn` failed for a user of webhook-assigned shard labels (kustomize-controller issue 1175, 2024-05-30, closed 2024-09-26 by PR 1248). VERIFIED. See [[findings/a-flux-dependson-across-shards-failed-with-dependency-not-found-until-a-2024-fix]].
- A hub-and-spoke user reported reconciliation storms in nightly deploy windows (flux2 issue 5470, 2025-08-05), and a maintainer suggested sharding among other options. VERIFIED. See [[examples/a-hub-and-spoke-flux-user-reported-nightly-reconciliation-storms-and-was-told-to-shard-or-tune]].
- Objects that leave a shard keep stale artifacts on the old source-controller shard (source-controller issue 2150, 2026-09-07, open), and the unnamed reporter says they "also hit it in production". VERIFIED as an anonymous self-report. See [[findings/objects-that-leave-a-flux-shard-keep-stale-artifacts-on-the-old-source-controller]].
- On Flux v2.10.0, 1000 Kustomizations reconcile in 4m13s using 297Mi at most, with a 2 CPU, 1Gi kustomize-controller at concurrency 20 on a 3-node Kind cluster. VERIFIED as a project benchmark. See [[examples/the-flux-benchmark-reconciles-1000-kustomizations-in-4-minutes-13-seconds-on-flux-v2-10-0]].
- Flux controllers have been APF-aware since mid-2022, and fluxcd/pkg PR 270 disables client-side throttling when APF is enabled. PR 1118 (closed 2026-02-16) fixed a custom-kubeconfig path that still rate limited on the client. VERIFIED. See [[findings/flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026]].
- No published incident or postmortem ties Flux sharding to APF throttling. UNVERIFIED, because it is an absence of evidence from searches of the fluxcd GitHub issues and the web.

### kro scaling and adopters

- kro's controller tuning page on main describes an RGD reconciler, a dynamic controller, and a Graph controller, with a "single shared queue", lazy informers started per registered RGD, and metadata-only watches. VERIFIED.
- The same page says "the shared queue could be replaced with per-RGD queues in future versions". VERIFIED. This corrects the earlier wording that each RGD starts a dedicated controller.
- Defaults on main include 1 dynamic-controller worker, 1 RGD worker, a rate limit of 10 events per second with burst 100, a 36000 second resync, 20 retries, a 30 second `watchSyncTimeout`, `rgd.maxCollectionSize` 1000, and `applyConcurrency` 20. VERIFIED against main-branch docs that may differ from tagged releases.
- A maintainer proposed weighted queues in kro issue 198 (2025-01-11) because a single queue "can lead to resource starvation". VERIFIED as a proposal. See [[findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues]].
- kro issue 610 (2025-07-23) asks for continuous performance testing and posts no results. VERIFIED from the issue body only.
- kro issue 1464 (2026-09-30, closed) reports that a hard apply failure on a Graph discarded the watches and hot-looped without backoff, and that on a large collection each rebuild re-issues a full WatchList that "drives apiserver memory up". VERIFIED as a reporter's observation. See [[findings/a-kro-hard-apply-failure-discarded-watches-and-hot-looped-while-large-collections-re-listed-against-the-apiserver]].
- kro has no ADOPTERS.md at the repository root. VERIFIED.
- A bex.co blog of 2026-07-29 says the CNCF and SlashData Q1 2026 Platform Engineering Radar placed kro in "Adopt", from a Q4 2025 survey of 400 or more developers, that the API is still `v1alpha1`, and that AWS's EKS documentation ships a kro concepts page. SECONDARY-ONLY: the radar and the AWS page were not read.
- Named production kro adopters with reported scale were not found. UNVERIFIED.

## Not found

- A named organization that says it runs sharded Flux, with a shard count or object count.
- A published incident or postmortem linking APF throttling to Flux or sharded Flux.
- Talks by named sharding users. The FluxCon Europe 2026 post mentions speakers from KLM, NatWest Group, and Orange, and no talk content was read.
- A kro adopters file, production case study, or benchmark of controller throughput, memory, or object counts.
- Named Cluster API and Config Connector adopters with object counts, the full ACK adopters list, the CNCF case study pages, and the Consensys talk recording.

## Pages this source updated

[[entities/crossplane]], [[entities/ack]], [[entities/kcp]], [[entities/flux]], [[entities/kro]], [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]], [[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[examples/kro-shared-queue-tunes-throughput]], [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]], [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]], [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]], [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]], [[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]], [[concepts/scale-and-sharding]].
