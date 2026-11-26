---
title: Upbound is the only kcp adopter marked production in the adopters file
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-named-adopters
    hash: 9f6a50098233
    ingested: 2026-11-26
aliases: [kcp adopters file]
tags: [kcp, adopters, upbound, self-reported, maturity]
---

# Upbound is the only kcp adopter marked production in the adopters file

## Scenario

The kcp project keeps an ADOPTERS.md with a maturity label for each organization. [[sources/research-gap-g1-named-adopters]]

## What the file says

The dossier counted 8 table lines, including header lines. Upbound is labeled "Production" with the statement "We use kcp within our Cloud Managed Control Planes product to provide multi-tenant access to the underlying hostcluster." SAP (ApeiroRA Platform Mesh), SNCF Group, Kubermatic, Faros.sh, and KubeStellar are labeled "Development". No object counts are given. URL: https://raw.githubusercontent.com/kcp-dev/kcp/main/ADOPTERS.md, main branch at read time.

## How to read it

The labels are self-assigned, but they are the only maturity signal in any adopters file the wiki has read, and they show kcp is in production at one named organization and in development elsewhere. That fits the Sandbox maturity recorded in [[entities/kcp]], and it leaves the gap on independent scale benchmarks for kcp open.

## Related

[[entities/kcp]], [[comparisons/tenancy-models-namespaces-vcluster-kcp]], [[examples/multi-tenant-api-hosting-with-kcp]]
