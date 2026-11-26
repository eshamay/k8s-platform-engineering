---
title: A Config Connector StorageBucket location edit reported UpToDate while the bucket did not move
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [config-connector, immutable-fields, drift, status, storagebucket, pitfall]
---

# A Config Connector StorageBucket location edit reported UpToDate while the bucket did not move

## Observation

Config Connector issue 12944 (2026-09-15) says that editing `spec.location` on a StorageBucket reconciles to Ready and UpToDate while the real bucket stays where it was. The reporter says the immutability check was removed in KCC 1.132.0 and calls the result "silent drift with a green status". The reporter ran KCC 1.155.1 and says they now reject such edits in their own validation layer. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/12944

## Why it matters

A bucket location cannot change in place on Google Cloud, so the desired spec and the real resource disagree permanently while the status says they match. This is the Config Connector instance of the pattern in [[findings/immutable-fields-and-drift-collisions]] and [[findings/misleading-readiness-and-stale-status]]: when a controller ignores or swallows an immutable-field change, the condition stops being evidence of convergence.

## Evidence limits

One reporter's account, not reproduced by the dossier, and the removal of the immutability check in 1.132.0 is the reporter's attribution. The behavior at v1.162.0 was not checked. Cross-check with [[findings/crossplane-does-not-delete-and-recreate-to-change-immutable-fields]], which describes a different tool with a similar outcome.

## Related

[[entities/config-connector]], [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]], [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]]
