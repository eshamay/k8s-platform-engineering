---
title: "Recreating an owner with the same name gives a new UID and strands its old dependents"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, owner-references, uid, controllers]
---

# Recreating an owner with the same name gives a new UID and strands its old dependents

## Observation

An owner reference names its owner by apiVersion, kind, name, and UID. The OneUptime controller tutorial lists recreating a custom resource under the same name as a pitfall: the new object has a new UID, so references that point at the old UID do not match, old dependents are not adopted, and they may be collected as orphans. This comes from one summarized blog, so verify it before publishing. [[sources/research-owner-references-and-garbage-collection]]

## Consequence

A delete-and-recreate workflow, such as a GitOps tool replacing an object, can remove the children that the new object was expected to inherit. Controllers should expect to recreate or re-adopt children after a new UID appears, and they must not assume that identity is preserved by name. See [[concepts/owner-references-and-garbage-collection]] and [[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children]].

## Related

[[findings/backup-and-restore-tools-can-strip-owner-references-so-controllers-must-re-reconcile-them]]
