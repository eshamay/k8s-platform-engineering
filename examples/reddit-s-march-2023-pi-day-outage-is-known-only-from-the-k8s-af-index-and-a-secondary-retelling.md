---
title: Reddit's March 2023 Pi-Day outage is known only from the k8s.af index and a secondary retelling
type: example
status: superseded
superseded_by: [[examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected]]
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-incident-reports
    hash: 3c7df7bb12f1
    ingested: 2026-11-26
aliases: [Reddit Pi-Day outage]
tags: [postmortem, reddit, calico, upgrade, labels, secondary-only]
---

# Reddit's March 2023 Pi-Day outage is known only from the k8s.af index and a secondary retelling

## Scenario

Reddit's engineering blog published a post titled "You Broke Reddit: The Pi-Day Outage" at https://www.reddit.com/r/RedditEng/comments/11xx5o0/you_broke_reddit_the_piday_outage/. No tool available to the research pass could read it, so the wiki has not seen Reddit's own account. [sources/research-gap-g1-named-incident-reports](../sources/research-gap-g1-named-incident-reports.md)

## What the secondary sources say

The k8s.af index lists the incident as "involved: Calico CNI, Upgrades, labels", with global outage impact. URL: https://k8s.af/. A third-party article on Kubezilla dates the outage to 14 March 2023 and describes a Kubernetes 1.23 to 1.24 upgrade in which a Calico route reflector selected nodes with the label `node-role.kubernetes.io/master`, a label the upgrade removed. Its selector quote is "nodeSelector: node-role.kubernetes.io/master == 'true'". URL: https://kubezilla.io/kubernetes-horror-story-reddits-314-minute-pi-day-outage/. Both sources are attributed here as secondary, and the main mechanism matches between them. [sources/research-gap-g1-named-incident-reports](../sources/research-gap-g1-named-incident-reports.md)

## What is not established

The Kubezilla figures of 314 minutes and 52 million users are not confirmed against Reddit. Its pod listings, command output, and minute-by-minute timeline appear to be reconstructed and are deliberately not reproduced. Whether the label removal was part of the 1.24 upgrade itself, as the retelling says, is an open question until Reddit's post is read. The gap on primary incident reports stays open for this incident.

## Related

[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports](../findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports.md) and [concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md).

## Superseded

On 2026-11-26 the primary Reddit post was read in full from a Wayback Machine capture. This page, which described the incident from the k8s.af index and a secondary retelling, is superseded by [examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected](reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected.md). The page is kept as the record of what was known before the primary was read.
