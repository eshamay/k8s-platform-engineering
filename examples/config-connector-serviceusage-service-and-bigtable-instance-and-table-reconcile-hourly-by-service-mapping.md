---
title: "Config Connector ServiceUsage Service and Bigtable instance and table reconcile hourly by service mapping"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [Config Connector 3600 second reconcile interval]
tags: [config-connector, reconcile-interval, service-mapping, bigtable, serviceusage]
---

# Config Connector ServiceUsage Service and Bigtable instance and table reconcile hourly by service mapping

## What the source shows

Three kinds set `reconciliationIntervalInSeconds: 3600` in their Terraform service mappings: ServiceUsage `Service` (`serviceusage.yaml`, around lines 30 and 62), BigtableInstance and BigtableTable (`bigtable.yaml`, around lines 88 and 118). Against a 10-minute global default this makes their mean reconcile interval one hour, with the same 0.5 to 1.5 times jitter, so about 30 to 90 minutes. [[sources/research-gap-o9-cadence-and-staleness]] https://github.com/GoogleCloudPlatform/k8s-config-connector/tree/master/config/servicemappings

The generated reference docs show 3600 on 3 of 267 pages, which matches these three kinds. The dossier does not state why these kinds were given an hour, and the reason is not documented in the material read.

## What it means

A kind with an hour mean has a drift-correction latency of up to an hour and a half, ten times slower than the default on average. The annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` overrides the mapping value for a single resource. See [[findings/config-connector-per-kind-reconcile-intervals-exist-only-as-five-terraform-service-mapping-overrides-and-262-of-267-reference-pages-show-600-seconds]] and [[findings/drift-detection-latency-is-the-interval]].

## Related

[[entities/config-connector]], [[examples/config-connector-computesslcertificate-and-serviceidentity-set-a-reconcile-interval-of-zero-in-their-terraform-service-mappings]]
