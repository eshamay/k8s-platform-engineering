---
title: "A portal alone gives visibility but not provisioning, so ticket queues can persist, according to a Kratix vendor"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [pitfall, portal, backstage, kratix, vendor-claim]
---

# A portal alone gives visibility but not provisioning, so ticket queues can persist, according to a Kratix vendor

## Observation

Backstage's own documentation describes a catalog, templates, and TechDocs, which is a user interface and metadata layer and not a provisioner (https://backstage.io/docs/overview/what-is-backstage). Syntasso adds the claim that a portal gives only visibility, so developers still wait on tickets unless a provisioning layer sits behind it, and that Kratix Promises and workflows fill that role (https://www.syntasso.io/post/kratix-backstage-upgrade-your-portal-to-a-platform). [sources/research-landscape](../sources/research-landscape.md)

## Evidence strength

The first half is documented fact, and the second half is a vendor claim from the company that sells the proposed fix. The dossier's advice is to pair a portal with a provisioning layer. Backstage templates can also call a GitOps repository or a pipeline, so the claim should be read as an argument and not a measured result.

## Related

[entities/backstage](../entities/backstage.md), [entities/kratix](../entities/kratix.md), [comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers](../comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers.md), [concepts/tooling-landscape](../concepts/tooling-landscape.md)
