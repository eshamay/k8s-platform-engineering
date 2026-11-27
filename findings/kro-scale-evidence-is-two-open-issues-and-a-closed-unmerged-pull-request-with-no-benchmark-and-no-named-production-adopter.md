---
title: kro scale evidence is two open issues and a closed unmerged pull request with no benchmark and no named production adopter
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: bex-co-kro-radar-post
    hash: 748c0bc7495e
    ingested: 2026-11-26
  - id: research-gap-o5-kro-ecosystem
    hash: 7905031da128
    ingested: 2026-11-26
aliases: [kro scaling evidence]
tags: [kro, scale, adopters, benchmarks, evidence-gap]
---

# kro scale evidence is two open issues and a closed unmerged pull request with no benchmark and no named production adopter

## Observation

The dossier read kro's docs, source, and issue tracker on 2026-11-26 and found no measured scaling limit, no benchmark, no latency table, no ADOPTERS file, and no named production adopter. The closest primary evidence is the following. Issue 198 (open since 2025-01-11) proposes weighted queues because the DynamicController "uses a single queue for all GVRs". Issue 610 (open since 2025-07-23) says "We need some sort of automation to execute performance testing for kro". Pull request 1159 (opened 2026-03-17, closed unmerged on 2026-08-11) said "At large scale this adds unnecessary latency" about deletion convergence, and since it was not merged it does not show a shipped fix. The tuning page warns that a resource with tens of thousands of objects can exceed the default 30 second watch sync timeout. v0.10.0 includes a cycle-detection optimization (PR 1449) and a fix for an informer churn hot loop (PR 1465). [[sources/research-gap-o5-kro-ecosystem]] URLs: https://github.com/kubernetes-sigs/kro/issues/198, https://github.com/kubernetes-sigs/kro/issues/610, and https://github.com/kubernetes-sigs/kro/pull/1159.

The roadmap items KREP-005 and KREP-023 (level-based and wavefront controllers) aim at large RGDs, with the stated goal that reconciliation time becomes proportional to dependency graph depth and not resource count, but they were Draft in the April 2026 roadmap snapshot. Graph collections apply with a default concurrency of 20.

## Secondary evidence

A Perun Engineering article (2026-07-19, https://perun.au/insights/kro-production/) lists five production failure patterns, including "Kro controller manager memory exhaustion on clusters with many ResourceGroup instances". It uses outdated names (ResourceGroup, kro validate, kro diff), cites no customer and no data, and is not corroborated by kro sources, so it is low reliability. The bex.co radar article and the AWS EKS kro page are covered in [[entities/kro]] as secondary-only and were not read in this pass.

## Why it matters

Capacity for kro must be tested, because nothing first-party states how many RGDs or instances one controller handles. The single worker default and the shared queue are the knobs to examine first. See [[findings/the-kro-docs-faq-says-a-dedicated-controller-per-rgd-while-the-tuning-page-and-source-describe-one-shared-queue]], [[findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues]], and [[examples/kro-shared-queue-tunes-throughput]].

## The bex.co radar post adds no adopter

The bex.co post of 2026-07-29 is now read in full. It reports a CNCF and SlashData survey rating for kro, which is developer sentiment, and it names no organization running kro in production and gives no scale number. The finding's conclusion of no named production adopter stands. See [[findings/one-blog-reports-that-the-cncf-and-slashdata-q1-2026-radar-rated-kro-adopt-from-a-survey-of-more-than-400-developers]]. [[sources/bex-co-kro-radar-post]]
