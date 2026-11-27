---
title: "Config Connector ships 883 CRD files and the largest is 579 KB because it has one CRD per Google Cloud resource kind"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: []
tags: [config-connector, crd, scale, size, verified]
---

# Config Connector ships 883 CRD files and the largest is 579 KB because it has one CRD per Google Cloud resource kind

## Observation

On master (read 2026-11-26, latest release v1.162.0) `config/crds/resources` holds 883 CRD files. The largest is `monitoringdashboards` at 579,353 bytes, then `dialogflowpages` at 355,824 and `dlpdeidentifytemplates` at 289,767. The webhook binary restricts its cache ListWatch of CRDs: "Create a selector to restrict the cache's ListWatch to KCC CRDs." The count and sizes follow from one CRD per Google Cloud resource kind. https://github.com/GoogleCloudPlatform/k8s-config-connector/tree/master/config/crds/resources and https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/cmd/webhook/main.go [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Why it matters

The count sits above the roughly 700 and 1,900 CRD points reported in [findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit](crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit.md), and the largest file is over twice the 262144-byte annotation limit discussed in [findings/large-crds-exceed-the-client-side-apply-annotation-limit](large-crds-exceed-the-client-side-apply-annotation-limit.md). The dossier does not say how a cluster behaves with all 883 installed.

## Related

[entities/config-connector](../entities/config-connector.md) and [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md).
