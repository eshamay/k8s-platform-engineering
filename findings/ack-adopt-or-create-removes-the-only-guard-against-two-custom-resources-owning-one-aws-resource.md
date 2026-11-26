---
title: ACK adopt-or-create removes the only guard against two custom resources owning one AWS resource
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [ack, adopt-or-create, adoption, ownership, deletion, iam-controller]
---

# ACK adopt-or-create removes the only guard against two custom resources owning one AWS resource

## Observation

In ACK, a custom resource without the adoption annotation stops with a terminal "Resource already exists" when a resource with its name is found. With `adopt-or-create` the found resource is adopted without checking whether another custom resource already manages it. The author of ACK issue 3149 puts it this way: "So the annotation turns off the only guard there is." [[sources/research-gap-g1-leaked-resources-adoption]] URL: https://github.com/aws-controllers-k8s/community/issues/3149

## Consequences in the reproduction

The reproduction used iam-controller v1.11.3 and runtime v0.67.0 against moto, so it is not a real AWS run. Two custom resources then rewrote the same role on every resync and flipped its trust policy, both reported `Synced` and `Ready`, and deleting either one deleted the role in 4 ms. The surviving custom resource created a replacement role with a new role ID on its next resync. See [[examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it]].

## The intended use cannot be told apart

A role created outside ACK and tagged `team=terraform` was adopted and its tag removed. The author says this is the intended use of adoption, but the runtime cannot tell it from an accidental take-over.

## Mitigations under discussion

ACK issue 3143 (2026-11-09) is an open proposal to record the owner in AWS tags "on the resource itself, at the moment it is created", so the controller can refuse foreign resources and recover lost IDs. ACK maintainers pointed to an earlier work-in-progress tag-check adoption change in runtime pull request 261. Neither is shipped. Until then the strict `adopt` policy or an explicit import is the way to keep the guard. See [[decisions/adopt-or-create-or-require-explicit-import]].

## Evidence limits

No production frequency exists, and the dossier says most of the late-2026 ACK adoption reports come from one reporter, so they are not independent corroboration.

## Related

[[findings/adopt-or-create-can-take-over-a-look-alike-resource]], [[entities/ack]], [[findings/destructive-deletion-of-external-resources]], [[examples/ack-issue-3067-a-gitops-bootstrap-across-two-clusters-left-one-duplicate-route-53-hosted-zone-per-name]]

## Ownership is not recorded in AWS

ACK issue 3142 says the absence of an owner check is general and not only an adopt-or-create effect, because ownership lives only in CR status. See [[findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource]]. [[sources/research-gap-g1-other-tool-pitfalls]]
