---
title: ACK issue 3153 pruning a custom resource from git deletes the AWS resource irreversibly
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: [ACK issue 3153]
tags: [ack, prune, gitops, deletion, feature-request]
---

# ACK issue 3153 pruning a custom resource from git deletes the AWS resource irreversibly

## Scenario

On 2026-11-09 gecube opened ACK community issue 3153 as a feature request. A CR drops out of git, the GitOps agent prunes it, and the AWS resource goes with it. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/aws-controllers-k8s/community/issues/3153

## What the issue says

The deletion cannot be undone once the API server accepts the DELETE. The issue accepts that "Deleting an ACK custom resource deletes the AWS resource. That is the documented default" and asks for a safer path for pruned resources. A sibling issue, 3154, says the namespace-level retain annotation is ignored in single `--watch-namespace` installs.

## Status and limits

Open when read, no incident attached, and part of one reporter's batch. See [[findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs]]. The reported prune incident in [[examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone]] shows the same path from a real report.

## Related

[[entities/ack]], [[findings/unintended-deletion-through-prune]]

## Addition from the o3 dossier

The reporter says Argo CD prune, Flux Kustomization prune, and a Helm upgrade run by helm-controller all send the DELETE (iam-controller v1.11.3, repro scripts supplied), and that a controller-wide `retain` did not help because every chart-rendered custom resource carried `deletion-policy: delete`. The issue also cites related issues where a DBInstance with `deletionProtection` removed from Git stays in Terminating because AWS refuses the delete. The reproduction used a kind cluster with moto as the AWS stand-in, so it is not a production incident. No maintainer reply was present. See [[findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain]]. [[sources/research-gap-o3-gitops-provider-managed]]
