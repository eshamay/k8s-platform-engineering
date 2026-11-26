---
title: The pitfalls dossier rests on index summaries, an older Crossplane version, and few primary incident reports
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-named-incident-reports
    hash: 3c7df7bb12f1
    ingested: 2026-11-26
aliases: []
tags: [source-quality, evidence, postmortems, crossplane, caveat]
---

# The pitfalls dossier rests on index summaries, an older Crossplane version, and few primary incident reports

## Observation

Only three first-party postmortems were read in full: Zalando, Grafana, and loveholidays. The Skyscanner, Reddit, Spotify, Jetstack, Monzo, and Airbnb cases appear only as k8s.af index summaries, because the scraper returned empty pages or the reports were not fetched. The Crossplane documentation page is v1.20 while the latest was v2.5, and issue 5283 on `deletionPolicy` was still open with an unknown outcome. The official Kubernetes finalizers and server-side apply pages were too large to read. The failure index is mostly 2017 to 2021 and its source repository was archived in 2020, and the Flux blog is the only 2026 primary source. [[sources/research-pitfalls-and-case-studies]] URLs: https://k8s.af/ and https://github.com/hjacobs/kubernetes-failure-stories

Correction, 2026-11-26: the Jetstack case was read in full in a later dossier, so it is no longer index-only. The k8s.af index was also checked on its Codeberg copy, which lists 78 entries with the newest dated 2023 (Reddit), so the statement that the index is mostly 2017 to 2021 is incomplete. The claim that the repository was archived in 2020 was not rechecked. The Airbnb talk is still unread. See [[sources/research-gap-g1-outage-postmortems]] and [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]].

## Why it matters

Claims about deletion cascades and webhook outages in the unread cases are second-hand, and current-version Crossplane behavior may differ. Other pages should treat these cases as leads and not as established evidence. See [[findings/admission-webhook-outages-are-a-recurring-failure-class]] and [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].

## Related

[[open-knowledge-gaps]], [[concepts/pitfalls-and-case-studies]]

## Update from the GitOps incidents dossier

The 2026-11-26 GitOps dossier adds reporter-level incident evidence but still no named-organization postmortem, and the Skyscanner 2021 GitOps outage remains known only from the k8s.af index. See [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]] and [[sources/research-gap-g1-gitops-drift-incidents]].

## Update from the named-incident dossier

The 2026-11-26 named-incident pass tried to read the Skyscanner, Reddit, Spotify, and Jetstack primaries. Only Jetstack could be read. Reddit is now known from a secondary retelling that matches the index on the Calico and label mechanism, and Skyscanner and Spotify remain index-only because the scraper returned empty pages and some fetch routes were blocked. See [[sources/research-gap-g1-named-incident-reports]] and [[examples/reddit-s-march-2023-pi-day-outage-is-known-only-from-the-k8s-af-index-and-a-secondary-retelling]].
