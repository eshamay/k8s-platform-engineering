---
title: No named-organization postmortem was found for kro, Config Connector, ACK, or Cluster API
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [evidence, caveat, postmortems, kro, config-connector, ack, cluster-api]
---

# No named-organization postmortem was found for kro, Config Connector, ACK, or Cluster API

## Observation

The 2026-11-26 dossier searched issue trackers and release notes for kro, Config Connector, ACK, and Cluster API and found no postmortem with a named company, a date, and an outage impact. The evidence is individual reporter issues and reproductions. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md)

## What exists instead

- kro: user reports 1395, 1391, and 886, and issue 1171 from a fault-injection tool. See [findings/a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd](a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd.md).
- Config Connector: issues 16444, 15930, 13335, and 12944. See [findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources](config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources.md).
- ACK: a batch of issues filed on 2026-11-09 by one reporter, plus issue 3122 from a CI run. See [findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource](ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource.md).
- Cluster API: release-note breaking changes and a maintainer-authored webhook-availability issue. See [findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation](cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation.md).

## What was not checked

ACK per-controller release notes, the official KCC deletion-policy and ACK adoption documentation, and maintainer blogs or talks were not read. Almost all issues were open with no maintainer root-cause confirmation, so the absence of a postmortem is weak evidence that none exists.

## Related

[concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md), [findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports](the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports.md), [findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import](no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import.md)

## Update from the o4 dossier

The 2026-11-26 o4 dossier read the official Config Connector deletion documentation and source, ACK deletion and adoption documentation, kro and Cluster API release notes, and the Cluster API troubleshooting page, and again found no named-organization postmortem. It adds first-party documentation and release-note evidence: [findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown](a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown.md), [findings/config-connector-known-issues-record-a-webhook-tls-race-before-1-134-1-and-direct-reconciler-regressions-in-1-132-0-and-1-134-0](config-connector-known-issues-record-a-webhook-tls-race-before-1-134-1-and-direct-reconciler-regressions-in-1-132-0-and-1-134-0.md), [findings/kro-v0-10-0-fixes-partial-apply-cleanup-and-duplicate-rgd-identities-and-pull-request-1445-adds-an-alpha-deletion-policy-behind-an-off-by-default-gate](kro-v0-10-0-fixes-partial-apply-cleanup-and-duplicate-rgd-identities-and-pull-request-1445-adds-an-alpha-deletion-policy-behind-an-off-by-default-gate.md), and [findings/the-ack-old-and-new-documentation-sites-disagree-on-adoption-maturity-and-cross-namespace-references-default-to-blocked-from-2026-10-08-releases](the-ack-old-and-new-documentation-sites-disagree-on-adoption-maturity-and-cross-namespace-references-default-to-blocked-from-2026-10-08-releases.md). ACK issues 3142, 3153, and 3154 share one reporter and have no maintainer root cause, so they are one audit, not independent corroboration. [sources/research-gap-o4-config-connector-ack](../sources/research-gap-o4-config-connector-ack.md)
