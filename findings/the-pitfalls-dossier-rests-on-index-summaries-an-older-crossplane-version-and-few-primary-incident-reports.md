---
title: The pitfalls dossier rests on index summaries, an older Crossplane version, and few primary incident reports
type: finding
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [source-quality, evidence, postmortems, crossplane, caveat]
---

# The pitfalls dossier rests on index summaries, an older Crossplane version, and few primary incident reports

## Observation

Only three first-party postmortems were read in full: Zalando, Grafana, and loveholidays. The Skyscanner, Reddit, Spotify, Jetstack, Monzo, and Airbnb cases appear only as k8s.af index summaries, because the scraper returned empty pages or the reports were not fetched. The Crossplane documentation page is v1.20 while the latest was v2.5, and issue 5283 on `deletionPolicy` was still open with an unknown outcome. The official Kubernetes finalizers and server-side apply pages were too large to read. The failure index is mostly 2017 to 2021 and its source repository was archived in 2020, and the Flux blog is the only 2026 primary source. [[sources/research-pitfalls-and-case-studies]] URLs: https://k8s.af/ and https://github.com/hjacobs/kubernetes-failure-stories

## Why it matters

Claims about deletion cascades and webhook outages in the unread cases are second-hand, and current-version Crossplane behavior may differ. Other pages should treat these cases as leads and not as established evidence. See [[findings/admission-webhook-outages-are-a-recurring-failure-class]] and [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].

## Related

[[open-knowledge-gaps]], [[concepts/pitfalls-and-case-studies]]
