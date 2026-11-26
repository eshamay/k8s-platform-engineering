---
title: "Research dossier: GitOps adopters, drift-correction incidents, and finalizer orphaning (g1-gitops-drift-incidents)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [gitops, argo-cd, flux, prune, self-heal, finalizers, adopters, postmortem, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: GitOps adopters, drift-correction incidents, and finalizer orphaning (g1-gitops-drift-incidents)

> [!NOTE]
> **Raw file:** `raw/research-gap-g1-gitops-drift-incidents.md` (sha256 prefix 0a1a75f3cab5)<br>
> **Kind:** Verified research dossier for gap cluster g1-gitops-drift-incidents, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over existing GitOps, prune, drift, and finalizer pages<br>
> **Caveat:** Adopter and incident claims are self-reported, issue reporters are anonymous, the web search tool returned mostly empty results, and Medium-hosted postmortems could not be read, so the "not found" list is weak evidence of absence.

## Summary

The dossier looked for named GitOps adopters, incidents caused by drift correction or prune, evidence on how often forced finalizer removal orphans guarded resources, and a named end-user case study of convergence trouble. Most evidence came from GitHub issues, plus a primary CNCF blog post dated 2026-11-20.

It found the largest primary adopter list (Argo CD's USERS.md with 452 self-reported entries), one CNCF case study (Subaru, no outage), a customer incident in which Argo CD self-heal skipped a migration hook on two of five regional Applications, and several anonymous issues in which prune, an app-of-apps deletion, or an HPA handoff removed or reset live resources. It found no rate for orphaning after forced finalizer removal, no named organization's postmortem for a GitOps revert loop, and no named end-user postmortem of controller retry amplification.

## Key claims

### Adopters (self-reported)

- Argo CD's USERS.md lists 452 organizations by the dossier's count of numbered entries, and the file last changed on 2026-11-23. It opens with "Currently, the following organizations are **officially** using Argo CD". VERIFIED as self-reported. https://github.com/argoproj/argo-cd/blob/master/USERS.md
- Subaru adopted Argo CD with Helmfile, replacing Helm scripts, and the CNCF case study reports no outage. VERIFIED from keyword-filtered excerpts only. https://www.cncf.io/case-studies/subaru/
- A press repost of a CNCF release says "Nearly 60% of Kubernetes clusters managed by survey respondents now rely on Argo CD". SECONDARY-ONLY, and the survey year label could not be reproduced from the page. https://aijourn.com/cncf-end-user-survey-finds-argo-cd-as-majority-adopted-gitops-solution-for-kubernetes/
- The k8s.af index lists a 2021 Skyscanner post as "involved: Gitops, templating, namespace deletion" with a global outage. SECONDARY-ONLY, because the primary Medium page returned empty and the mechanism is unverified. https://k8s.af

### Outage and incident reports

- On 2026-11-20 a CNCF blog post described a customer incident in which Argo CD self-heal, after a deny sync window closed, skipped a migration hook on two of five regional Applications, leaving 36 to 44 minutes of code and schema mismatch. VERIFIED as a published account, with an unnamed customer and secondhand figures. The post's phrase is "healing drift never runs hooks". https://www.cncf.io/blog/2026/11/20/when-a-sync-window-closes-how-argo-cd-self-heal-skipped-the-migration-hook/
- The author's mechanism is that "the last compared revision is mistaken for the last synced one" by a level-1 refresh, so self-heal runs a partial sync that skips hooks. VERIFIED as the author's claim only, not confirmed in Argo CD source.
- The author's mitigation is turning self-heal off, at the cost that "Anyone who edits a resource by hand now leaves it OutOfSync". VERIFIED from the author's lab.
- Argo CD issue 6046 (2021-04-15, v1.8.1 and v1.8.7 on EKS): after reinstalling Argo CD into a wiped namespace, "Argocd now started deleting all the apps under it's management". VERIFIED as the reporter's account. https://github.com/argoproj/argo-cd/issues/6046
- Argo CD issue 20440 (v2.6.6, comments through 2024-11-10, still open when read): "All of the resources that were deployed by ArgoCD (from other applications) are suddenly deleted". VERIFIED as the reporter's account, with no root cause found. https://github.com/argoproj/argo-cd/issues/20440
- Argo CD issue 15441 (2023-09-11): removing an explicit Namespace manifest in favor of CreateNamespace "actually deletes the namespace and recreates it during the Sync". VERIFIED as the reporter's account. https://github.com/argoproj/argo-cd/issues/15441
- Flux issue 2514 (2022-03-08 to 2022-03-10): "my pods replicas went down to 1, and then back to the previous number of replicas" on the first Flux reconciliation over an HPA-managed Deployment. A maintainer said a replicas field in Git conflicts with the HPA, since "every time Flux does a reconciliation overrides it". VERIFIED. https://github.com/fluxcd/flux2/issues/2514
- ACK issue 2911 (2026-06-04, wafv2 controller v1.3.2 per the reporter): an Argo CD prune deleted a WAFv2 WebACL CR, AWS WAF was removed, and "The CR sits in `Terminating` indefinitely until the finalizer is patched off manually." A maintainer confirmed the cause and a fix through an exception-code mapping. VERIFIED. https://github.com/aws-controllers-k8s/community/issues/2911
- Argo CD issue 30398 (opened 2026-10-23, closed): an Application stays OutOfSync when an `ignoreDifferences` entry covers a field whose live value differs from Git, under ServerSideDiff=true with IncludeMutationWebhook=true on an HPA-managed field, where `metadata.generation` is the only diff. VERIFIED as an issue. https://github.com/argoproj/argo-cd/issues/30398

### Finalizer removal and orphaning

- The Kubernetes finalizers page says "forcefully removing them can lead to issues in your cluster" and gives no orphan frequency. VERIFIED, with the absence check limited to a text search of the page. https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/
- Kubernetes issue 53451 (2017-10-04): "service controller can leave orphaned load balancers after services are deleted". The issue proposed a finalizer on all Services. VERIFIED. https://github.com/kubernetes/kubernetes/issues/53451
- Pull request 54569 ("Add finalizer support to service controller to ensure cleanup on delete", opened 2017-10-25) was closed without merging on 2019-06-04, so it is not the shipped fix. VERIFIED, corrected in the dossier's verification step. https://github.com/kubernetes/kubernetes/pull/54569
- Kubernetes issue 43730 (2017-03-28, v1.5.3, Azure): "There are resource leaks in the cloud with respect to PublicIp and LoadBalancer Frontend Ip Pool". VERIFIED as the reporter's account. https://github.com/kubernetes/kubernetes/issues/43730
- Cluster API issue 8172 (2023-02-24, v1.3.0): when objects are deleted before the controller adds its finalizer, "the resources created by these objects get orphaned". VERIFIED. https://github.com/kubernetes-sigs/cluster-api/issues/8172
- A rate of orphaning after forced removal is UNVERIFIED. The dossier searched the docs and issues on kubernetes, cluster-api, crossplane, and ACK and found nothing.

### Convergence case studies

- The k8s.af index lists Airbnb's KubeCon NA 2020 talk "10 More Weird Ways to Blow Up Your Kubernetes" with "involved: MutatingAdmissionWebhook, CPU Limits, OOMKill, kube2iam, HPA". SECONDARY-ONLY. https://k8s.af
- The k8s.af archive is mostly 2017 to 2021 stories, and the newest entry listed is 2023. VERIFIED.
- A named-company primary postmortem of controller retry storms or stale caches is UNVERIFIED, since none was found.

## Pages that cite this source

- Incidents and adopters: [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]], [[examples/argo-cd-issue-6046-reinstalling-argo-cd-into-a-wiped-namespace-started-deleting-every-app-it-managed]], [[examples/argo-cd-issue-20440-an-applicationset-generated-application-was-deleted-with-its-namespaces-and-argo-cd-itself]], [[examples/argo-cd-issue-15441-removing-a-namespace-manifest-under-createnamespace-deleted-and-recreated-the-namespace]], [[examples/flux-issue-2514-the-first-reconciliation-over-an-hpa-managed-deployment-reset-replicas-to-one]], [[examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone]], [[examples/the-argo-cd-users-file-lists-452-self-reported-adopters]], [[examples/subaru-adopted-argo-cd-with-helmfile-to-replace-manual-deployment-procedures]]
- Orphaning evidence: [[examples/kubernetes-issues-53451-and-43730-service-deletions-leaked-cloud-load-balancers-and-public-ips]], [[examples/cluster-api-issue-8172-deleting-parents-before-the-controller-adds-its-finalizer-orphans-their-resources]]
- Findings: [[findings/argo-cd-self-heal-runs-a-partial-sync-that-skips-hooks-according-to-one-author-so-a-migration-hook-can-be-missed]], [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]], [[findings/pruning-a-custom-resource-whose-controller-does-not-map-a-not-found-error-leaves-it-terminating-on-its-finalizer]], [[findings/handing-replicas-between-git-and-an-hpa-can-reset-the-count-or-leave-an-application-permanently-out-of-sync]], [[findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late]], [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]], [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]]
- Decision: [[decisions/make-a-migration-a-managed-resource-or-turn-self-heal-off]]
