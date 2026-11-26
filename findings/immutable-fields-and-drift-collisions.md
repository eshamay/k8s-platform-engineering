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
aliases: []
tags: [pitfall, drift, immutability]
---

# Immutable fields and drift collisions

## Observation

Drift correction and adoption each have a sharp edge. Flux `force` recreates an object when an immutable field changes, which is risky for StatefulSets, and Flux corrects drift on an interval using server-side apply dry runs. [[entities/ack]] resyncs periodically (default stated as 10 hours), and [[entities/config-connector]] adopts a cloud resource when the manifest name matches. As a result, out-of-band cloud changes can be reverted, can linger for hours, or can collide with existing resources. [[sources/research-universal-control-plane]]

## Interpretation

Self-healing is helpful when the spec is right and harmful when the live change was intentional or when recreate is destructive. See [[concepts/self-healing-and-drift-detection]] and [[concepts/server-side-apply-and-field-ownership]].

## Caveat

The ACK resync default may have changed and should be verified. The dossier also notes that failure-mode details such as Flux server-side-apply conflicts deserve a direct read of the docs.

## Related

[[findings/destructive-deletion-of-external-resources]]
