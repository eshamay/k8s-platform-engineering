---
title: "The KEP-1040 README history stops at v1.26 while its kep.yaml records stable in v1.29"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
aliases: [KEP-1040 lifecycle record, APF stage history]
tags: [kubernetes, apf, kep-1040, priority-and-fairness, lifecycle, documentation-conflict, scale, verified]
---

# The KEP-1040 README history stops at v1.26 while its kep.yaml records stable in v1.29

## Observation

API Priority and Fairness (APF) is tracked in KEP-1040, and the two files in the KEP directory record different amounts of its history. `kep.yaml` (read 2026-11-26) gives status `implemented`, stage `stable`, latest milestone v1.30, alpha v1.18, beta v1.20, stable v1.29, and the gate `APIPriorityAndFairness` with `disable-supported: true`. The README's Implementation History stops at "v1.26: introduce concurrency borrowing between priority levels", and the GA entry for v1.29 appears only in `kep.yaml`. The last README commit is dated 2024-05-08. [[sources/research-gap-b1-recheck-flux-k8s]] https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/1040-priority-and-fairness/kep.yaml

## Graduation criteria and tests

The README (3,337 lines, 153 KB, fetched in full and read by section) checks every GA criterion: borrowing, LIST and WATCH satisfaction, "APF allows us to disable client-side rate limiting without causing the apiservers to wedge/crash", tunability, and deep disable through `--enable-priority-and-fairness=false`. The test plan records coverage as of 2023-02-02: bootstrap 100 percent, flowcontrol util 76, fairqueuing 80.9, queueset 81.6, request 87.5, and filter 90.6. The named integration tests are `TestConcurrencyIsolation`, `TestConditionIsolation`, `TestConfigConsumerFight`, and `TestPriorityLevelIsolation`. The README's Test Plan upgrade and downgrade text is blank template text.

## Production readiness

The production readiness answers on scalability say new self-requests and new API types are added, that "a non-negligible latency is added to API calls to kube-apiserver", and that CPU and memory use rise slightly.

## Why it matters

A reader who takes the README alone would conclude APF was last changed in v1.26 and may not know it graduated, and a reader who takes `kep.yaml` alone would miss that the README's coverage figures date from 2023. Cite the stage from `kep.yaml` and the release notes, and cite design and test details from the README with its date. The earlier digest-based figures in [[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]] left the rest of the README unread, and this pass reads it.

## Related

[[findings/apf-fair-queuing-allocates-seats-equally-and-a-slow-reader-can-hold-hand-size-times-ten-seats]], [[concepts/scale-and-sharding]], [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]], [[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]]
