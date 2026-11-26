---
title: Config Connector state-into-spec Merge populates unspecified fields that Argo CD and Config Sync treat as drift, and Absent is the default from 1.123.1
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [config-connector, state-into-spec, drift, argo-cd, config-sync, defaulting]
---

# Config Connector state-into-spec Merge populates unspecified fields that Argo CD and Config Sync treat as drift, and Absent is the default from 1.123.1

## Observation

Config Connector's `cnrm.cloud.google.com/state-into-spec` annotation chooses whether the controller copies live cloud state into unspecified spec fields. In `Merge` mode it populates unspecified fields, including subfields inside lists. The documentation page says that "Both configuration management tools and Config Connector treat list fields as atomic", so a tool such as Config Sync or Argo CD sees the controller's additions as a difference from Git. URL: https://cloud.google.com/config-connector/docs/concepts/ignore-unspecified-fields (undated page, read against Config Connector v1.162.0). [[sources/research-gap-o3-gitops-provider-managed]]

## Correction to the default

The dossier's verification pass corrected the version wording. The page says `Absent` is the default for resources created starting in Config Connector 1.123.1, and that earlier versions defaulted to `Merge`. It does not describe existing resources as changed. The older wiki wording "Absent mode (default from 1.123.1)" on [[entities/config-connector]] is consistent with this, but a cluster whose resources were created before 1.123.1 may still carry `state-into-spec: merge` on those objects, so the version alone does not say what a given object does.

## Reported symptom

Config Connector issue 837 (open, 2023-07-14) is a user report of the same family: Argo CD 2.7.6 repeatedly "replaced" DNSRecordSet objects and failed with an immutable-field error, and adding the controller's default annotations explicitly, including `state-into-spec: merge`, worked around it. See [[examples/config-connector-issue-837-argo-cd-2-7-6-kept-replacing-dnsrecordset-objects-until-the-default-annotations-were-added-explicitly]]. That issue is SECONDARY-ONLY.

## Related

[[findings/defaulting-and-drift-reconcile-loops]], [[findings/late-initialized-fields-create-false-drift]], [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]], [[findings/argo-cd-ignoredifferences-only-affects-the-diff-unless-respectignoredifferences-is-set-and-then-only-for-resources-that-already-exist]]
