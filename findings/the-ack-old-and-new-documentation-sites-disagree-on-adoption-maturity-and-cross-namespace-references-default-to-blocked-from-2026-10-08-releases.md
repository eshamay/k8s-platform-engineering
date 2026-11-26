---
title: "The ACK old and new documentation sites disagree on adoption maturity, and cross-namespace references default to blocked from 2026-10-08 releases"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [ack, documentation, adoption, deletion-policy, cross-namespace, drift]
---

# The ACK old and new documentation sites disagree on adoption maturity, and cross-namespace references default to blocked from 2026-10-08 releases

## Observation

ACK has two documentation sites. The old one, built from `aws-controllers-k8s/community`, marks the `AdoptedResource` custom resource as no longer recommended and describes the annotation-based adoption feature as alpha with feature gates disabled by default. The new site, built from `aws-controllers-k8s/docs`, describes annotation-based adoption as a Beta feature that "is enabled by default in the ACK runtime". An ACK contributor replying on issue 3152 on 2026-11-10 said the reporter was "linking to our deprecated docs website". [[sources/research-gap-o4-config-connector-ack]]

Both sites agree on the deletion policy: the order is resource annotation, namespace annotation, then controller flag, "The first match wins", with `delete` as the default and `retain` as the alternative. The old drift-recovery page says "By default, all ACK controllers attempt to detect drift once every **10 hours**", which the wiki had already confirmed in runtime source, see [[entities/ack]].

The new breaking-changes page records that for controller versions released on or after 2026-10-08, `--enable-cross-namespace` defaults to `false`, so cross-namespace references are blocked unless an operator turns them on.

## Why it matters

Anyone reading ACK adoption guidance should check which site it came from, because the maturity claim and the default differ by site age. The old pages are not wrong for the versions they describe, but a contributor has called the site deprecated. For tenant-isolation reasoning, the cross-namespace default is a reference-resolution setting and not a security boundary, see [[findings/disabling-ack-cross-namespace-references-is-not-tenant-isolation]].

## What is not settled

The old adoption page was not re-checked in the verification pass, and the runtime source for the feature gate defaults was not re-read.

## Related

[[findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain]], [[examples/ack-issue-3152-adoption-under-argo-cd-or-flux-overwrites-the-adopted-aws-resource-with-the-git-spec]], [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]]
