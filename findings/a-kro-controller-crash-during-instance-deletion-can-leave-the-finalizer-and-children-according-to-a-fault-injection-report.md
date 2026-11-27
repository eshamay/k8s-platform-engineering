---
title: A kro controller crash during instance deletion can leave the finalizer and children according to a fault-injection report
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [kro, deletion, finalizer, fault-injection, crd, pitfall]
---

# A kro controller crash during instance deletion can leave the finalizer and children according to a fault-injection report

## Observation

kro issue 1171 (2026-03-19, kro v0.8.4) was filed by a fault-injection tool called kamera and not from a production incident. It reports that a controller crash in the middle of an instance deletion can leave the instance with its finalizer and leave child resources alive. The reporter says the controller "doesn't checkpoint progress", and, per the reporter, the CRD was deleted despite `allowCRDDeletion=false`. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md) URL: https://github.com/kubernetes-sigs/kro/issues/1171

## Status when read

The issue was open on 2026-11-26. It had only triage-bot comments and two reporter comments, one of them a `/remove-lifecycle stale` and one on 2026-06-23. No maintainer confirmed the root cause. The CRD-deletion claim is the reporter's and stays unconfirmed.

## Possibly related release notes

kro v0.10.0 (2026-11-10) lists "Fix Graph cleanup after partial apply failures" and "Fix Graph cleanup when child UIDs are missing". The dossier did not tie them to issue 1171, so the wiki makes no claim that v0.10.0 closes it. v0.10.0 also adds a per-resource deletion policy and unifies the engine on Graph, both large changes to read before upgrading. See [findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates](a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates.md).

## How to read it

The mechanism is plausible because kro keeps the instance finalizer until its children are gone and deletes in reverse dependency waves ([examples/kro-deletes-instance-resources-in-reverse-dependency-waves](../examples/kro-deletes-instance-resources-in-reverse-dependency-waves.md)). A crash between waves would leave a partially deleted graph, which a restarted controller should resume from persisted inventory. Whether it does is the open question in the issue. See [examples/kro-issue-1171-a-fault-injection-tool-found-that-a-controller-crash-mid-deletion-leaves-the-instance-finalizer-and-children](../examples/kro-issue-1171-a-fault-injection-tool-found-that-a-controller-crash-mid-deletion-leaves-the-instance-finalizer-and-children.md).

## Related

[entities/kro](../entities/kro.md), [concepts/finalizers](../concepts/finalizers.md), [findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing](finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing.md)
