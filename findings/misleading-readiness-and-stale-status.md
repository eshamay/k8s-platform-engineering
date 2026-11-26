---
title: Misleading readiness and stale status
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, conditions, observedgeneration, status]
---

# Misleading readiness and stale status

## Observation

Readiness is easy to confuse with "the controller is working," and status can describe an older spec than the one the user just wrote. The dossier names two defenses. Crossplane separates `Synced` (the provider can reconcile the resource) from `Ready` (the resource is available). The Kubernetes API conventions define a standard conditions structure and `observedGeneration`, so a reader can tell whether a status reflects the latest spec generation. URLs: https://docs.crossplane.io/latest/managed-resources/managed-resources/ and https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md. [[sources/research-eventual-consistency-and-convergence]]

## Why it matters under eventual consistency

Because convergence takes time, there is always a window in which the spec has changed and the status has not. A status that says Ready with an `observedGeneration` behind `metadata.generation` is a statement about the past. Tools that gate on readiness, such as Flux `dependsOn` and Argo CD waves, depend on these signals being honest. See [[examples/crossplane-database-claim-reports-synced-and-ready]].

## Mitigations

Compare `observedGeneration` to `metadata.generation` before trusting a condition, and read both `Synced` and `Ready` on Crossplane objects. See [[concepts/conditions]] and [[concepts/spec-status-split]].

## Related

[[concepts/eventual-consistency-and-convergence]], [[findings/ordering-and-dependency-failures]]

## Further sources of stale and premature readiness

The spec and status dossier adds three concrete cases. ACK conditions lack `observedGeneration`, so a stale `ResourceSynced=True` cannot be told from a current one. A Cluster API resource with `observedGeneration` but no conditions can look ready to kstatus, and Flux may proceed to dependents too early. A suspended Flux resource keeps its last condition and can look healthy. [[sources/research-spec-status-split]] See [[findings/missing-observedgeneration-hides-stale-status]], [[findings/premature-readiness-in-kstatus-based-tools]], and [[examples/flux-helmrelease-status-records-attempts-and-health]].
