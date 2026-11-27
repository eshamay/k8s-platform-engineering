---
title: ACK issue 3149 adopt-or-create let two custom resources overwrite one IAM role and deleting either deleted it
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [ACK issue 3149]
tags: [ack, iam-controller, adopt-or-create, accidental-adoption, deletion]
---

# ACK issue 3149 adopt-or-create let two custom resources overwrite one IAM role and deleting either deleted it

## Scenario

On 2026-11-09 ACK community issue 3149 was opened with a reproduction of adoption gone wrong. The dossier cautions that most of its late-2026 ACK adoption evidence comes from a single prolific reporter, so it should not be read as independent corroboration. The reproduction used iam-controller v1.11.3 and runtime v0.67.0 against moto standing in for IAM, so it is not a run against real AWS. The author says no misconfiguration is needed: one cluster and default settings are enough. [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md) URL: https://github.com/aws-controllers-k8s/community/issues/3149

## What happened

A custom resource with the `adopt-or-create` annotation and the same role name as an existing custom resource's role was adopted with no ownership check. The controller rewrote the role with seven mutating calls, and each resync flipped the trust policy between the two custom resources. Both reported `ACK.ResourceSynced=True` and `Ready=True` with the same ARN, so nothing warned anyone. Deleting either custom resource deleted the role in 4 ms, and the surviving one created a new role with a new role ID on its next resync.

## The guard that was removed

The same custom resource without the annotation stops with a terminal "Resource already exists". In the author's words, "the annotation turns off the only guard there is."

## The intended use looks the same

A role created outside ACK and tagged `team=terraform` was adopted and the tag was removed with `UntagRole`. The author notes that this is the intended use of adoption, but it is indistinguishable to the runtime from the bad cases.

## Why it belongs here

It is the most detailed reproduction of accidental adoption in the dossier, and it supplies the evidence that [findings/adopt-or-create-can-take-over-a-look-alike-resource](../findings/adopt-or-create-can-take-over-a-look-alike-resource.md) lacked. The mechanism is in [findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource](../findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource.md).

## Related

[entities/ack](../entities/ack.md), [examples/ack-adopt-or-create-brings-existing-aws-resources-under-management](ack-adopt-or-create-brings-existing-aws-resources-under-management.md), [decisions/adopt-or-create-or-require-explicit-import](../decisions/adopt-or-create-or-require-explicit-import.md)
