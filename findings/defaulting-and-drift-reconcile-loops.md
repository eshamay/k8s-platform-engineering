---
title: Defaulting and drift reconcile loops
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [pitfall, drift, defaulting, config-connector]
---

# Defaulting and drift reconcile loops

## Observation

Servers and clouds mutate fields, so a controller or GitOps tool that treats an older spec as truth can loop forever. [[entities/config-connector]] documents this concretely. Its legacy Merge mode copied unspecified fields into the Kubernetes spec, and this caused endless reconcile loops when Google Cloud auto-updated fields, drift fights with Config Sync because lists are atomic, and HTTP 400 errors from asymmetry between GET and PUT. The fix is Absent mode, which does not populate unspecified fields into the spec and is the default from version 1.123.1. A migration path uses the abandon deletion policy. [[sources/research-declarative-vs-imperative]]

## Related case

Argo CD multi-source applications with self-heal can trigger unexpected syncs, according to its automated sync page. See [[entities/argo-cd]].

## Interpretation

A declared spec must cover only what the user means to own. Copying live values back into the spec turns defaults into false intent. See [[concepts/self-healing-and-drift-detection]] and [[concepts/server-side-apply-and-field-ownership]].

## Caveat

Argo CD `ignoreDifferences` and Flux field-manager behavior were not read. See [[open-knowledge-gaps]].

## Related

[[findings/immutable-fields-and-drift-collisions]]
