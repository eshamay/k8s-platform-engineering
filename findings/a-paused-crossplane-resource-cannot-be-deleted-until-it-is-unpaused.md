---
title: A paused Crossplane resource cannot be deleted until it is unpaused
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, paused, finalizers, deletion]
---

# A paused Crossplane resource cannot be deleted until it is unpaused

## Observation

The `crossplane.io/paused` annotation stops Crossplane from reconciling a managed resource, but the same pause also blocks deletion. Crossplane puts a finalizer on the object so that it remains until the external resource is really gone, and a paused resource is not reconciled. The dossier does not spell out the mechanism, but the documented result is that deletion cannot complete while the pause is in place. URL: https://docs.crossplane.io/v1.20/concepts/managed-resources/. [sources/research-pitfalls-and-case-studies](../sources/research-pitfalls-and-case-studies.md)

## Why it matters

A team that pauses a resource to stop a fight with another controller, and later deletes it, will see the object hang in a state that looks like a stuck finalizer. The remedy implied by the documentation is to remove the pause first. Forcing the finalizer off instead would risk orphaning the cloud resource, see [findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md).

## Evidence quality

The claim comes from the Crossplane v1.20 page, which the dossier flags as older than the latest release v2.5, so the behavior should be re-checked. See [comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack](../comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack.md).

## Related

[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing](finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing.md), [entities/crossplane](../entities/crossplane.md), [concepts/pitfalls-and-case-studies](../concepts/pitfalls-and-case-studies.md)
