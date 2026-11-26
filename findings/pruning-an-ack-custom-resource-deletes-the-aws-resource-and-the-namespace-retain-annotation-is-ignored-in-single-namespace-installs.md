---
title: Pruning an ACK custom resource deletes the AWS resource and the namespace retain annotation is ignored in single-namespace installs
type: finding
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
aliases: []
tags: [ack, prune, deletion-policy, retain, gitops, pitfall]
---

# Pruning an ACK custom resource deletes the AWS resource and the namespace retain annotation is ignored in single-namespace installs

## Observation

ACK issue 3153 (2026-11-09, open, a feature request) says that a CR that drops out of git and is pruned has its AWS resource deleted, and the delete cannot be undone once the API server accepts it. The issue quotes the documented default: "Deleting an ACK custom resource deletes the AWS resource. That is the documented default". [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/aws-controllers-k8s/community/issues/3153

Issue 3154 (2026-11-09, open) says the namespace-level deletion-policy annotation is ignored in single `--watch-namespace` installs, so "a namespace set to `retain` still has its AWS resources deleted". The reporter supplies source links, but the dossier verified the issue text and not the code. URL: https://github.com/aws-controllers-k8s/community/issues/3154

## What it adds

The wiki already says ACK deletes by default and offers a retain policy ([[comparisons/deletion-policies-across-gitops-and-provider-tools]]), and that an Argo CD prune of an ACK CR left a WAFv2 WebACL stuck ([[examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone]]). These two issues add that the namespace-level opt-out may not apply in one install mode, so a team that relies on a namespace annotation should confirm per-resource retain instead.

## Evidence limits

Both are single-reporter claims from the same batch as [[findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource]], so they are one audit and not independent. No fix is confirmed.

## Related

[[examples/ack-issue-3153-pruning-a-custom-resource-from-git-deletes-the-aws-resource-irreversibly]], [[findings/unintended-deletion-through-prune]], [[findings/destructive-deletion-of-external-resources]], [[entities/ack]]

## Addition from the o3 dossier

The o3 pass read issue 3153 again and records the reporter's further claims: Argo CD prune, Flux Kustomization prune, and a helm-controller upgrade all send the DELETE, and a controller-wide `deletionPolicy: retain` did not protect resources because every chart-rendered custom resource carried `deletion-policy: delete`. These are SECONDARY-ONLY reporter claims with repro scripts and no maintainer reply seen. The documented lookup order, resource then namespace then controller, is in [[findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain]]. [[sources/research-gap-o3-gitops-provider-managed]]
