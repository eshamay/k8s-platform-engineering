---
title: "Config Connector per-kind reconcile intervals exist only as five Terraform service-mapping overrides, and 262 of 267 reference pages show 600 seconds"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [Config Connector per-kind reconcile interval, reconciliationIntervalInSeconds]
tags: [config-connector, reconcile-interval, service-mapping, dcl, defaults]
---

# Config Connector per-kind reconcile intervals exist only as five Terraform service-mapping overrides, and 262 of 267 reference pages show 600 seconds

## Observation

Each generated resource reference page carries a row "Config Connector Default Average Reconcile Interval In Seconds". Across the 267 pages in the repository's generated docs the value 600 appears 262 times, 3600 appears 3 times, and 0 appears twice. This is the dossier author's own tally of the repository docs, not of the live site. [[sources/research-gap-o9-cadence-and-staleness]] https://github.com/GoogleCloudPlatform/k8s-config-connector/tree/master/scripts/generate-google3-docs/resource-reference/generated/resource-docs

The reconciliation concept page itself states no number. It says resources reconcile "with every update or after a jitter period with an average based on the preconfigured default interval" and points to that row. https://docs.cloud.google.com/config-connector/docs/concepts/reconciliation

## The five overrides

In `config/servicemappings/*.yaml` the key `reconciliationIntervalInSeconds` is set for ComputeSSLCertificate (0, two entries), ServiceUsage `Service` (3600), ServiceIdentity (0), BigtableInstance (3600) and BigtableTable (3600). The kind was found by scanning for the nearest preceding `kind:` line. The type comment in the service-mapping code says a resource that cannot be read back should set 0 "to avoid repeated creation of the resource". See [[examples/config-connector-computesslcertificate-and-serviceidentity-set-a-reconcile-interval-of-zero-in-their-terraform-service-mappings]] and [[examples/config-connector-serviceusage-service-and-bigtable-instance-and-table-reconcile-hourly-by-service-mapping]]. https://github.com/GoogleCloudPlatform/k8s-config-connector/tree/master/config/servicemappings

## DCL has none

The DCL metadata struct has a `ReconciliationIntervalInSeconds` field (`pkg/dcl/metadata/metadata.go`, line 921), and its comment says "If not explicitly configured a global default value of 600 will be used." A repository-wide ripgrep found no assignment of the field, so every DCL kind uses 10 minutes. This is a verified absence at master and not a guarantee for older releases.

## Related

[[findings/config-connector-direct-terraform-and-dcl-reconcilers-share-one-jittered-requeue-so-the-controller-kind-alone-does-not-change-the-cadence]], [[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]], [[decisions/choosing-a-drift-check-interval-for-external-resources]], [[entities/config-connector]]
