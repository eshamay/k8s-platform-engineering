---
title: Skyscanner Engineering, How a couple of characters brought down our site
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: skyscanner-namespace-deletion-postmortem
    hash: 4930a0cb876a
    ingested: 2026-11-26
aliases: [Skyscanner 2021 outage postmortem]
tags: [postmortem, gitops, argo-cd, skyscanner, templating, namespace-deletion]
---

# Skyscanner Engineering, How a couple of characters brought down our site

> [!NOTE]
> **Raw file:** `raw/skyscanner-namespace-deletion-postmortem.md`<br>
> **Kind:** First-party engineering postmortem, read in full from a Wayback Machine capture of the Medium page (2026-11-17)<br>
> **Author:** Stuart Davidson, Engineering Director, Skyscanner Production Platform Tribe (per the page)<br>
> **Published:** 2021-11-11; incident date 2021-08-25<br>
> **Ingested:** 2026-11-26

## Summary

Skyscanner describes a four-hour-plus global outage that began when an engineer merged what was meant to be a no-op change to the templating of its infrastructure provisioning system. The change removed template markers from a root configuration file, so every namespace that used it was reapplied in a corrupted form, and Argo CD then deleted every service in every namespace in every region. The post also explains how GitOps made recovery possible and lists the lessons the team took from the incident review. This is the first primary account of a GitOps-caused outage in this wiki; it replaces the earlier index-only entry from k8s.af.

## Key claims

- On 25 August 2021 Skyscanner suffered a "four-and-a-half hour full global outage", and the website and apps were unavailable. The post's own TL;DR calls it a four-hour outage, so the duration is stated two ways inside one document. [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]]
- Skyscanner runs a cells architecture: a cell is in a single region and holds several Kubernetes clusters in each availability zone, services are deployed "n+2" so one cluster can be down and one drained, and workloads run on AWS spot instances.
- At about 1530 GMT an engineer submitted a change to the templating system that was intended to be a no-op. It was peer reviewed, merged to master, and rolled out automatically. The file sat at the root of the cells configuration, changed very rarely, and rolled out regional configuration, so it was pushed globally and immediately.
- The change lacked the `{{ }}` markers, so templating no longer applied, and all namespaces that used the configuration (all of them) were reapplied and corrupted.
- At 1600 GMT Argo CD tried to reconcile the clusters. With no valid namespaces in the new configuration it began mass deletion of all 478 services in all namespaces across all availability zones and regions, "ultimately because we told it to".
- Recovery relied on GitOps pull: once the configuration was back in place a cluster reconfigured itself to the correct state. The team restored a single region and critical services first, so skyscanner.net was serving travelers again by about 2030 GMT from one region, and the remaining regions and non-critical services were restored over the next two days.
- The incident review produced seven lessons, including do not deploy global configuration changes, treat templated configuration as code that needs testing and linting, plan for worse disaster scenarios, verify backup and restore (an IAM policy change had made the backups hard to obtain), refactor runbooks, and recognize that automation can go too far. [[findings/templated-configuration-that-looks-like-config-is-code-and-needs-tests-and-a-regional-rollout-before-a-gitops-controller-applies-it-globally]]

## Limits of this source

The capture holds the article text only. The change itself was shown as an image that was not captured, so the exact edit is known only from the prose. The post does not describe Argo CD sync policy, pruning settings, or finalizer behavior, so it does not establish why the delete was not blocked. Reader responses on the page are not treated as evidence.
