---
title: Older claims and patch-and-transform material no longer matches current Crossplane
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-composite-resource
    hash: 8640896d06b9
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, terminology, version-churn, learning-material]
---

# Older claims and patch-and-transform material no longer matches current Crossplane

## Observation

Crossplane v2 removed native patch-and-transform and the claim concept for new-style XRDs, and the dossier notes that older tutorials relying on claims or `mode: Resources` no longer match current behavior. Several of the dossier's own best sources are older: the XRD and claims pages are the v1.20 versions, and the organizational design blog dates from 2023. The comparison blog adds a `LegacyCluster` scope as a fallback for v1-style XRDs, a detail the dossier could not confirm in a primary v2 page. [[sources/research-composite-resource]]

## Why it matters

Readers who follow older material will write claims and native compositions that current releases reject or treat as legacy. Writers of tutorials have the opposite problem, because many existing Git repositories still use claims and learners need to recognize them.

## Mitigations

Check the version of every Crossplane page before using it, prefer the latest pages for mechanics, and use the v1.20 pages only to read legacy material. See [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]], [[findings/crossplane-v2-removed-features-and-offers-no-automated-migration-for-v1-composites]], and the terminology gap on [[open-knowledge-gaps]]. See also [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]] for a similar drift at the managed-resource layer.
