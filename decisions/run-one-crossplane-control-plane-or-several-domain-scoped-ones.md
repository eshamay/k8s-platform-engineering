---
title: Run one Crossplane control plane or several domain-scoped ones
type: decision
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-crossplane-deep-dive
    hash: 44034359219f
    ingested: 2026-11-25
aliases: []
tags: [decision, crossplane, platform-engineering, blast-radius, v2]
---

# Run one Crossplane control plane or several domain-scoped ones

## Status

Open question framed by one practitioner blog, not an ADR authored by this wiki. The source offers an argument and no outcome data. [sources/research-crossplane-deep-dive](../sources/research-crossplane-deep-dive.md)

## Context

A platform team adopting Crossplane has to decide how many Crossplane installations to run and what each owns. Crossplane v2 compositions can contain any Kubernetes resource, so a single instance can in principle serve infrastructure, applications, networking, and observability APIs for a whole organization. A Polarpoint blog argues that "Teams no longer need a single monolithic Crossplane instance."

## Options

Run one shared control plane that hosts every platform API. Or run several smaller control planes, each scoped to an infrastructure domain, with APIs modeled by domain and not by cloud provider. A middle path keeps one cluster but separates domains by XRD group, namespace, and RBAC.

## Consequences

One control plane is simpler to operate and has one place to look, but the CRD load, provider credentials, and blast radius concentrate there. The scale cost of many CRDs is in [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](../findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md), and credential concentration is in [findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions](../findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions.md) and [findings/blast-radius-and-privilege-centralization](../findings/blast-radius-and-privilege-centralization.md). Several control planes narrow each blast radius and let teams upgrade independently, at the cost of more installations to run, a hosting cluster for each, and cross-domain composition across cluster boundaries. The sources give no numbers for either side.

## Related

See [examples/domain-scoped-crossplane-control-planes-are-proposed-in-place-of-one-monolithic-instance](../examples/domain-scoped-crossplane-control-planes-are-proposed-in-place-of-one-monolithic-instance.md), [decisions/scope-provider-credentials-per-namespace-or-cluster-wide](scope-provider-credentials-per-namespace-or-cluster-wide.md), and [entities/crossplane](../entities/crossplane.md).
