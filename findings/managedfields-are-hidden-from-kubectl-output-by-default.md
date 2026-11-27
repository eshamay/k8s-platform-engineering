---
title: managedFields are hidden from kubectl output by default
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kubectl, managedfields, debugging]
---

# managedFields are hidden from kubectl output by default

## Observation

`kubectl get -o yaml` omits `metadata.managedFields` unless the user passes `--show-managed-fields`. Anyone debugging field ownership from the default output sees no ownership data and may conclude it is empty. [sources/research-server-side-apply-and-field-ownership](../sources/research-server-side-apply-and-field-ownership.md)

## Evidence

Crossplane issue 7453, reported in May 2026 against v2.3.1, claimed that a field applied to a composite resource by an external controller with `ForceOwnership` disappears within one reconcile and that `managedFields` looks empty. A maintainer could not reproduce it and suggested the hidden output as the explanation. The issue was marked stale and unresolved, so the underlying claim is unconfirmed. URL: https://github.com/crossplane/crossplane/issues/7453.

## Interpretation

Two lessons follow. Always show managed fields before diagnosing an ownership problem. And multi-controller composition, where an external controller writes to a composite resource, remains an unsettled area. The Kubernetes API docs also discourage writing `managedFields` by hand, so editing it is a recovery tool and not a routine step. See [entities/kubectl](../entities/kubectl.md), [entities/crossplane](../entities/crossplane.md), and [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md).

## Related

[findings/multiple-writers-on-one-object](multiple-writers-on-one-object.md), [findings/field-ownership-blocks-drift-correction](field-ownership-blocks-drift-correction.md)

## Update from the v2.5 verification pass (2026-11-26)

Issue 7453 remained open on 2026-11-26 with labels `bug` and `stale`. The maintainer comment of 2026-08-27 could not reproduce it on v2.3.1 and pointed at the hidden `managedFields`, the reporter never replied, and two community pull requests (7783 and 7787) that assume a real bug in the composite SSA path are open and unmerged. So the claim is reported, not reproduced by a maintainer, and open. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) See [examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource](../examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource.md).

## Status of the Crossplane report (2026-11-26)

The maintainer's suggestion about hidden `managedFields` is confirmed as quoted in issue 7453 ("`kubectl get -o yaml` hides `managedFields` unless you pass `--show-managed-fields`"). The reporter says `managedFields` was `[]`, which a hidden field does not explain by itself, and no one has settled it. See [examples/crossplane-pull-requests-7783-and-7787-say-fromstruct-drops-managedfields-on-the-composite-resource](../examples/crossplane-pull-requests-7783-and-7787-say-fromstruct-drops-managedfields-on-the-composite-resource.md). [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md)
