---
title: "Config Connector ComputeSSLCertificate and ServiceIdentity set a reconcile interval of zero in their Terraform service mappings"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [ComputeSSLCertificate reconcile interval 0, ServiceIdentity reconcile interval 0]
tags: [config-connector, reconcile-interval, service-mapping, compute, serviceusage, drift]
---

# Config Connector ComputeSSLCertificate and ServiceIdentity set a reconcile interval of zero in their Terraform service mappings

## What the source shows

Two kinds are configured with `reconciliationIntervalInSeconds: 0` in `config/servicemappings`. ComputeSSLCertificate has the value in two entries of `compute.yaml` (around lines 1719 and 2401), and ServiceIdentity has it in `serviceusage.yaml`. The dossier found the kinds by scanning for the nearest preceding `kind:` line. [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md) https://github.com/GoogleCloudPlatform/k8s-config-connector/tree/master/config/servicemappings

## Why zero

The service-mapping type comment says a resource that cannot be read back should set 0 "to avoid repeated creation of the resource". The dossier does not state which of these kinds has that property, so the reason for these two kinds is the comment's general rule and not a documented statement about them.

## What it means

For these kinds periodic drift correction is off from the start, which is the same state an operator reaches by annotating a resource with 0, a change the docs call irreversible ([findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible](../findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible.md)). The reference docs show the 0 on two pages. See [findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds](../findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds.md).

## Related

[entities/config-connector](../entities/config-connector.md), [examples/config-connector-serviceusage-service-and-bigtable-instance-and-table-reconcile-hourly-by-service-mapping](config-connector-serviceusage-service-and-bigtable-instance-and-table-reconcile-hourly-by-service-mapping.md)
