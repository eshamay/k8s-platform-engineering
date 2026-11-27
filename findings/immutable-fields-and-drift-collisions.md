---
title: Immutable fields and drift collisions
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
  - id: research-level-triggered-vs-edge-triggered
    hash: 27a34aa0de59
    ingested: 2026-11-25
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, drift, immutability]
---

# Immutable fields and drift collisions

## Observation

Drift correction and adoption each have a sharp edge. Flux `force` recreates an object when an immutable field changes, which is risky for StatefulSets, and Flux corrects drift on an interval using server-side apply dry runs. [entities/ack](../entities/ack.md) resyncs periodically (default stated as 10 hours), and [entities/config-connector](../entities/config-connector.md) adopts a cloud resource when the manifest name matches. As a result, out-of-band cloud changes can be reverted, can linger for hours, or can collide with existing resources. [sources/research-universal-control-plane](../sources/research-universal-control-plane.md)

## Interpretation

Self-healing is helpful when the spec is right and harmful when the live change was intentional or when recreate is destructive. See [concepts/self-healing-and-drift-detection](../concepts/self-healing-and-drift-detection.md) and [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).

## Caveat

The ACK resync default may have changed and should be verified. The dossier also notes that failure-mode details such as Flux server-side-apply conflicts deserve a direct read of the docs.

## Unreadable and immutable fields

Level-triggered drift correction cannot fix what it cannot read or change. Config Connector actuates unreadable fields only on spec change and needs recreation for immutable ones, and Flux offers `force` to replace objects on immutable conflicts. [sources/research-level-triggered-vs-edge-triggered](../sources/research-level-triggered-vs-edge-triggered.md) See [comparisons/reconcile-cadence-and-off-switches-across-tools](../comparisons/reconcile-cadence-and-off-switches-across-tools.md).

## Related

[findings/destructive-deletion-of-external-resources](destructive-deletion-of-external-resources.md)

## Additional evidence

Flux `force` recreates objects when immutable fields change and should be used only temporarily because it can cause downtime. Cluster API avoids the problem by making Machines immutable and replacing them. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md) See [findings/defaulting-and-drift-reconcile-loops](defaulting-and-drift-reconcile-loops.md).

## Verification of the ACK default

The ACK drift-recovery page states the roughly 10-hour default directly, so the caveat above is partly resolved, although the dossier read it through a digest. Flux `force` is documented as something to use temporarily. [sources/research-self-healing-and-drift-detection](../sources/research-self-healing-and-drift-detection.md) See [entities/ack](../entities/ack.md).
