---
title: "Config Connector's static config table lists 814 kinds and sets direct as the default for 539 of them"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [Config Connector controller kind per resource, ControllerConfigStatic]
tags: [config-connector, controllers, direct, terraform, dcl, static-config, mapping]
---

# Config Connector's static config table lists 814 kinds and sets direct as the default for 539 of them

## Observation

The authoritative answer to "which Config Connector kind uses which controller" is a Go table named `ControllerConfigStatic` in `pkg/controller/resourceconfig/static_config.go`. At master commit 5cce7c7e (committed 2026-11-26, latest release tag v1.162.0 published 2026-11-23) it has 814 entries, and each entry names a `DefaultController` and a list of `SupportedControllers`. A typical entry reads `{DefaultController: k8s.ReconcilerTypeDirect, SupportedControllers: []k8s.ReconcilerType{k8s.ReconcilerTypeDirect}}`. [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md) https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/resourceconfig/static_config.go

## The counts

The dossier author counted entries with ripgrep line patterns, so the figures are an own tally, and they sum to 814, which matches the entry count. They could miss an entry that wraps across lines.

| Measure | Direct | Terraform | DCL | IAM-specific |
|---|---|---|---|---|
| Default controller | 539 | 206 | 65 | 4 |
| Supports only this controller | 510 | 140 | 50 | not counted |

The four IAM-specific defaults are IAMAuditConfig, IAMPartialPolicy, IAMPolicy and IAMPolicyMember. Some kinds support more than one controller: 66 default to Terraform and also support Direct, 15 default to DCL and also support Direct, and 29 default to Direct and also support Terraform. None default to Direct and also list DCL. The reconciler type strings in `pkg/k8s/defaulter.go` are `direct`, `tf`, `dcl`, `iampolicy`, `iampartialpolicy`, `iampolicymember` and `iamauditconfig`. See [examples/config-connector-alloydbcluster-and-billingbudgetsbudget-show-kinds-that-support-more-than-one-controller](../examples/config-connector-alloydbcluster-and-billingbudgetsbudget-show-kinds-that-support-more-than-one-controller.md).

## Direction of travel

The controller-types page says "New resources use the direct controller by default. Existing resources are migrated regularly." It adds that direct controllers avoid Terraform and DCL translation overhead, report structured diffs in logs, and populate `status.observedState`. https://docs.cloud.google.com/config-connector/docs/concepts/controller-types

## Limits

The table exists only in source and is not published as a per-resource document, and it changes with each release, so cite the commit or tag and do not hard-code the counts as permanent. The release in which any given kind switched its default is unverified, because release notes and the file history were not read.

## Related

[entities/config-connector](../entities/config-connector.md), [findings/config-connector-routes-a-kind-to-its-controller-by-namespace-override-then-static-default-and-a-live-crd-label-shows-which-one-runs](config-connector-routes-a-kind-to-its-controller-by-namespace-override-then-static-default-and-a-live-crd-label-shows-which-one-runs.md), [decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource](../decisions/accept-the-build-time-controller-for-a-config-connector-kind-or-override-it-per-namespace-or-per-resource.md)
