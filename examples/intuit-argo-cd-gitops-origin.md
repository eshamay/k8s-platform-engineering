---
title: Intuit and the origin of Argo CD
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-declarative-vs-imperative
    hash: 570767ba4094
    ingested: 2026-11-25
aliases: []
tags: [use-case, gitops, argo-cd, intuit]
---

# Intuit and the origin of Argo CD

## Scenario

Intuit needed a controlled and auditable way to get changes to production across many applications. In a Red Hat interview, Intuit's account is that it built [entities/argo-cd](../entities/argo-cd.md) to manage deployment complexity with a declarative, Git-driven workflow. [sources/research-declarative-vs-imperative](../sources/research-declarative-vs-imperative.md)

## How it works

The interview states the GitOps principle behind the tool: desired state is declarative, versioned, immutable, pulled automatically, and "continuously reconciled." Git history becomes the audit trail, and the cluster is pulled toward what Git says. Intuit later pursued progressive delivery with Argo Rollouts, which adds canary and blue-green strategies on top of the same declarative base. See [concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md) and [concepts/declarative-vs-imperative](../concepts/declarative-vs-imperative.md).

## Caveat

This is the only named organization with a use story in the dossier, and it comes from a podcast write-up, not an engineering postmortem or scale report. The dossier's quote is a short fragment from tool-condensed text. See [open-knowledge-gaps](../open-knowledge-gaps.md) on named production adopters.

## Related

[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd](git-driven-cluster-reconciliation-with-flux-and-argo-cd.md)
