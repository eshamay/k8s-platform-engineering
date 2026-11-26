---
title: No named-organization postmortem was found for kro, Config Connector, ACK, or Cluster API
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [evidence, caveat, postmortems, kro, config-connector, ack, cluster-api]
---

# No named-organization postmortem was found for kro, Config Connector, ACK, or Cluster API

## Observation

The 2026-11-26 dossier searched issue trackers and release notes for kro, Config Connector, ACK, and Cluster API and found no postmortem with a named company, a date, and an outage impact. The evidence is individual reporter issues and reproductions. [[sources/research-gap-g1-other-tool-pitfalls]]

## What exists instead

- kro: user reports 1395, 1391, and 886, and issue 1171 from a fault-injection tool. See [[findings/a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd]].
- Config Connector: issues 16444, 15930, 13335, and 12944. See [[findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources]].
- ACK: a batch of issues filed on 2026-11-09 by one reporter, plus issue 3122 from a CI run. See [[findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource]].
- Cluster API: release-note breaking changes and a maintainer-authored webhook-availability issue. See [[findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation]].

## What was not checked

ACK per-controller release notes, the official KCC deletion-policy and ACK adoption documentation, and maintainer blogs or talks were not read. Almost all issues were open with no maintainer root-cause confirmation, so the absence of a postmortem is weak evidence that none exists.

## Related

[[concepts/pitfalls-and-case-studies]], [[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports]], [[findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import]]
