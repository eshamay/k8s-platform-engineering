---
title: Config Connector issue 837 Argo CD 2.7.6 kept replacing DNSRecordSet objects until the default annotations were added explicitly
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: [Config Connector issue 837]
tags: [config-connector, argo-cd, drift, annotations, state-into-spec]
---

# Config Connector issue 837 Argo CD 2.7.6 kept replacing DNSRecordSet objects until the default annotations were added explicitly

## Scenario

Config Connector issue 837 was opened on 2023-07-14 by a user (peter-tar) running Argo CD 2.7.6 and is still open with four comments. Argo CD repeatedly "replaced" KCC DNSRecordSet objects and failed with an immutable-field error. URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/837. [[sources/research-gap-o3-gitops-provider-managed]]

## What was said

A Google-affiliated contributor (diviner524) explained, "Config Connector will update the resource's `metadata.annotations` and add a few default values." The reporter then confirmed that adding the three default annotations (`management-conflict-prevention-policy`, `project-id`, and `state-into-spec: merge`) worked around the failure. The dossier's verification pass corrected the attribution: the quoted sentence is from the contributor's reply and not from the reporter.

## Evidence limits

This is SECONDARY-ONLY: a tracker report that no maintainer confirmed as a defect, and the page does not say whether the same behavior occurs on current Config Connector and Argo CD versions. It fits the drift mechanism in [[findings/config-connector-state-into-spec-merge-populates-unspecified-fields-that-argo-cd-and-config-sync-treat-as-drift-and-absent-is-the-default-from-1-123-1]], where the controller writes fields that Git does not hold.

## Related

[[entities/config-connector]], [[entities/argo-cd]], [[findings/defaulting-and-drift-reconcile-loops]]
