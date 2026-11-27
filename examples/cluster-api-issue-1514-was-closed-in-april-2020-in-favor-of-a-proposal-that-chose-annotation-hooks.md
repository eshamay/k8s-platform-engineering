---
title: "Cluster API issue 1514 was closed in April 2020 in favor of a proposal that chose annotation hooks"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m1-finalizers
    hash: 014549e333b6
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, finalizers, hooks, issue, machine-deletion, caep]
---

# Cluster API issue 1514 was closed in April 2020 in favor of a proposal that chose annotation hooks

## Scenario

Issue [kubernetes-sigs/cluster-api#1514](https://github.com/kubernetes-sigs/cluster-api/issues/1514), "machine-controller: block deletion with finalizer/annotation", was opened on 2019-10-10. Operators wanted a way for an external controller to delay deletion of a Machine, for example to finish work before the node drains. The issue was closed on 2020-04-27 with state COMPLETED. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## How the thread developed

The original proposal was to support a new finalizer with a known name, possibly a comma-separated list such as `machines-delete-hooks: "myfinalizer1,myfinalizer2"`, probably running before drain. The author's view was that "just having the finalizer work before drain is going to cover most of what someone would want", with a second finalizer possible later. Alternatives followed. One maintainer suggested a `Dependencies` list of object references in the Machine spec "instead of adding more finalizers to the Machine". Another suggested a hook-registration CRD. From 2020-04-17 onward a commenter argued for annotations, in the form `predrain.hook.machine.cluster-api.x-k8s.io/<name>: <owner>`, because "my-controller-1 might not know anything about my-controller-2", and because status or CR-based hooks would need write permission on the Machine anyway. On 2020-04-27 a maintainer closed the issue and deferred to contributors to write a CAEP, the project's proposal process. [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Outcome

The issue does not record the final choice. The implemented Machine Deletion Phase Hooks proposal, created 2020-06-02, chose annotations and rejected finalizers, and the current API defines the `pre-drain.delete.hook.machine.cluster.x-k8s.io` and `pre-terminate.delete.hook.machine.cluster.x-k8s.io` prefixes. See [findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers](../findings/cluster-api-chose-annotation-hooks-over-finalizers-for-machine-deletion-because-a-misbehaving-controller-could-remove-finalizers.md) and [decisions/block-an-object-s-deletion-with-a-finalizer-a-spec-dependency-list-or-an-annotation-hook](../decisions/block-an-object-s-deletion-with-a-finalizer-a-spec-dependency-list-or-an-annotation-hook.md). [sources/research-gap-m1-finalizers](../sources/research-gap-m1-finalizers.md)

## Related

[entities/cluster-api](../entities/cluster-api.md), [examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node](cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node.md), [concepts/finalizers](../concepts/finalizers.md)
