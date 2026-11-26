---
title: "Config Connector known issues record a webhook TLS race before 1.134.1 and direct-reconciler regressions in 1.132.0 and 1.134.0"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [config-connector, known-issues, webhook, upgrade, state-into-spec, first-party]
---

# Config Connector known issues record a webhook TLS race before 1.134.1 and direct-reconciler regressions in 1.132.0 and 1.134.0

## Observation

Google's known-issues page for Config Connector (last updated 2026-11-10) is first-party evidence of version-specific failures. [[sources/research-gap-o4-config-connector-ack]]

- Before 1.134.1, a race in webhook TLS setup could leave the API server rejecting creates: "The Kubernetes API server rejects the request and blocks resource creation." Existing resources kept reconciling while new ones could not be created, which is the failure-policy-fail behavior described in [[findings/config-connector-and-cluster-api-register-many-webhooks-and-every-one-uses-failure-policy-fail]].
- Version 1.134.0 added stricter `state-into-spec` validation that "incorrectly rejected the \"merge\" strategy for `SQLInstance` resources", which wedged `SQLInstance` in Updating until 1.134.2. The merge strategy is the legacy mode discussed in [[findings/config-connector-state-into-spec-merge-populates-unspecified-fields-that-argo-cd-and-config-sync-treat-as-drift-and-absent-is-the-default-from-1-123-1]].
- Version 1.132.0 "introduced issues affecting resources that use the direct reconciler", including a duplicate controller name and a bad label value for `SecretManagerSecret`.

## Why it matters

The page documents upgrade-ordering risk for a tool that otherwise has only issue-level pitfall reports in this wiki. It names no organization and gives no incident timeline, so it is a known-issue list and not a postmortem, see [[findings/no-named-organization-postmortem-was-found-for-kro-config-connector-ack-or-cluster-api]]. Pinning the version matters more for the GKE add-on, which can lag releases, see [[findings/the-gke-config-connector-add-on-can-lag-the-latest-release-by-12-months-or-more-and-google-discourages-it-for-production]].

## Related

[[entities/config-connector]], [[concepts/pitfalls-and-case-studies]]
