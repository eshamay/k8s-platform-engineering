---
title: No named-organization postmortem was found for a GitOps revert loop, a GitOps outage, or controller retry amplification
type: finding
status: contradicted
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: skyscanner-namespace-deletion-postmortem
    hash: 4930a0cb876a
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: []
tags: [evidence-gap, postmortem, gitops, k8s-af, skyscanner, airbnb]
---

# No named-organization postmortem was found for a GitOps revert loop, a GitOps outage, or controller retry amplification

## Observation

The dossier found real incidents but no named organization's primary postmortem for a GitOps revert loop with an autoscaler, a GitOps-caused outage, or Kubernetes controller retry amplification and stale caches. The incidents it did find are anonymous issue reports and one unnamed customer story. [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md)

## Leads that stay unread

The k8s.af index lists a 2021 Skyscanner post as "involved: Gitops, templating, namespace deletion" with a global outage, but the primary Medium page returned empty and a mirror fetch was denied, so the mechanism is unverified and the entry is SECONDARY-ONLY. It lists Airbnb's KubeCon NA 2020 talk with "involved: MutatingAdmissionWebhook, CPU Limits, OOMKill, kube2iam, HPA", also unread and SECONDARY-ONLY. The archive is mostly 2017 to 2021 stories, with 2023 as the newest entry. A page at johal.in that claimed a 2026 postmortem scraped empty, and its claims are not recorded.

## Caveats

The web search tool returned empty results for most queries, so this absence is weak evidence. The evidence that does exist is listed in [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md), and the earlier control-plane postmortems are in [findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm](no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm.md).

## Related

[findings/retry-storms-and-unbounded-retries](retry-storms-and-unbounded-retries.md), [concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md), [findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports](the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports.md), [examples/the-argo-cd-users-file-lists-452-self-reported-adopters](../examples/the-argo-cd-users-file-lists-452-self-reported-adopters.md)

## Update from the operator loop dossier

The 2026-11-26 operator dossier also found no named-organization postmortem of controller retry amplification or stale caches. It did find issue-level cases that touch the same ground, namely [examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold](../examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold.md) for retries and [examples/kubernetes-issue-115658-a-client-go-relist-could-drop-the-delete-event-for-a-short-lived-object](../examples/kubernetes-issue-115658-a-client-go-relist-could-drop-the-delete-event-for-a-short-lived-object.md) for a lost event, and it is recorded in [findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found](no-formal-organization-authored-postmortem-of-an-operator-failure-was-found.md). Source: [sources/research-gap-g1-operator-loop-failures](../sources/research-gap-g1-operator-loop-failures.md).

## Contradictions

> [!WARNING]
> The claim above that no named organization's primary postmortem exists for a GitOps-caused outage is no longer true for Skyscanner.

The Observation and the Leads sections say the Skyscanner 2021 post was unread and SECONDARY-ONLY. On 2026-11-26 the primary post was read in full from a Wayback Machine capture. It is a named-organization, first-party account of a GitOps-caused global outage: a template change was reconciled by Argo CD into deleting 478 services in every region. See [sources/skyscanner-namespace-deletion-postmortem](../sources/skyscanner-namespace-deletion-postmortem.md) and [examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services](../examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services.md). The negative claim still holds for a GitOps revert loop with an autoscaler and for controller retry amplification, and for Airbnb's unread talk. Suggested resolution: narrow the page title and Observation to those remaining cases.
