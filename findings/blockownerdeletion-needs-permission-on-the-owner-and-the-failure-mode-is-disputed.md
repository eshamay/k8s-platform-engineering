---
title: "blockOwnerDeletion needs permission on the owner and the failure mode is disputed"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-owner-references-and-garbage-collection
    hash: bd4cc1219f2d
    ingested: 2026-11-25
aliases: []
tags: [pitfall, rbac, blockownerdeletion, verification]
---

# blockOwnerDeletion needs permission on the owner and the failure mode is disputed

## Observation

The Owners and Dependents page says an admission controller restricts who can set `blockOwnerDeletion`, based on delete permission on the owner. A controller-author blog from OneUptime adds that controllers need `update` on the owner's `/finalizers` subresource, and that otherwise the flag is silently not honored. The dossier notes that the second claim conflicts in tone with the official description, which is an admission check that rejects the request and does not drop the flag silently. [[sources/research-owner-references-and-garbage-collection]]

## Unresolved tension

The official page and the blog agree that permission is required and disagree about how a missing permission shows up, either as a rejected write or as a flag that is quietly ignored. Neither was tested. The dossier says the question needs a test or a source-code check, and the wiki treats the silent-drop behavior as unverified.

## Consequence

If the flag is dropped, foreground deletion of the owner does not wait for that dependent, and the Pods can outlive the parent without any error. Operator authors should grant the extra RBAC verb and check the created reference. See [[findings/foreground-deletion-waits-only-for-dependents-with-blockownerdeletion-true]] and [[concepts/owner-references-and-garbage-collection]].

## Related

[[examples/controller-runtime-sets-a-controller-reference-so-deleting-the-custom-resource-tears-down-its-children]]
