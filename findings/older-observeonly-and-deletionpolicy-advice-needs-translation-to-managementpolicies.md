---
title: Older ObserveOnly and deletionPolicy advice needs translation to managementPolicies
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: []
tags: [pitfall, crossplane, terminology, deletion-policy, management-policies]
---

# Older ObserveOnly and deletionPolicy advice needs translation to managementPolicies

## Observation

Crossplane's vocabulary for ownership has changed. The design document began with three modes (FullControl, OrphanOnDelete, ObserveOnly), and the shipped feature became a list of verbs in `spec.managementPolicies`. Older blog advice, including the consultancy post the dossier read, still speaks of `ObserveOnly` and `deletionPolicy: Orphan`. The OnCallReady lesson adds that namespaced v2 managed resources have no `deletionPolicy` at all, and that the orphan idiom there is "everything except Delete". The dossier found no page that spells out the mapping from the old enum to the list. [[sources/research-managed-resource]]

## Why it matters

A reader who copies a v1-era recipe onto a v2 object may set a field that does not exist or that is overridden. The design document also lists a conflict risk between `deletionPolicy` and `managementPolicies`, and the wiki's [[entities/crossplane]] page records that enabled management policies take precedence over `deletionPolicy`.

## Mitigations

Translate when teaching: observe-only becomes `["Observe"]`, orphan-on-delete becomes every verb except Delete, and a pause becomes an empty list. State the Crossplane version of any recipe. The unresolved mapping is tracked as a gap in [[open-knowledge-gaps]]. See [[concepts/managed-resource]] and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].
