---
title: "Crossplane issue 7453 reports an external SSA writer losing a field on a composite resource"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-kro-crossplane
    hash: ccee0efa5bdd
    ingested: 2026-11-26
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
  - id: research-gap-b1-unverified-claims
    hash: d152f98abb04
    ingested: 2026-11-26
aliases: []
tags: [crossplane, server-side-apply, managedfields, issue, unresolved]
---

# Crossplane issue 7453 reports an external SSA writer losing a field on a composite resource

## Scenario

In May 2026 a user running Crossplane v2.3.1 with function-go-templating reported that a field applied to a composite resource (XR) by an external controller, using server-side apply with `--force-conflicts`, disappeared within one reconcile. The reporter also said the XR's `metadata.managedFields` was empty (`[]`) after the write, and that the apply response had shown the field set. This is the reporter's account (SECONDARY-ONLY), not a maintainer-confirmed behavior. https://github.com/crossplane/crossplane/issues/7453 [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md)

## What happened next

The issue was opened on 2026-05-31 and was still open on 2026-11-26, labeled `bug` and `stale`. The only maintainer comment, from jbw976 on 2026-08-27, says "I couldn't reproduce this just now on v2.3.1, with either a namespaced XR or a legacy v1 style claim", and suggests that `kubectl get -o yaml` hides `managedFields` unless `--show-managed-fields` is passed. The reporter did not reply in the thread.

Two community pull requests, 7783 and 7787 (opened 2026-08-27 and 2026-08-28, both still open), assert a root cause: `FromStruct()` replaces the whole XR object and drops `managedFields`, which breaks field ownership tracking. Neither is merged, and the dossier found no maintainer review of that claim. https://github.com/crossplane/crossplane/pull/7787 and https://github.com/crossplane/crossplane/pull/7783

## State on 2026-11-26

A recheck read the issue again: it is open, labelled `bug` and `stale`, and a stale-bot comment dated 2026-11-26 says it closes in 14 days without activity. Pull request 7783 ("fix(composite): preserve managed fields during composition") was updated on 2026-11-26, and 7787 ("preserve managedFields in composite resource SSA patches (#7453)") was last updated 2026-08-28. Both are open and unmerged. The maintainer's `--show-managed-fields` hypothesis is a statement in the thread and was not tested ([sources/research-gap-b1-unverified-claims](../sources/research-gap-b1-unverified-claims.md)).

## How the code applies to XRs

On `main`, the composite reconciler persists `spec.crossplane.resourceRefs` with an SSA apply using `ForceOwnership` under the field owner `apiextensions.crossplane.io/composite`, then applies the XR status the same way. Composed resources use field owners prefixed `apiextensions.crossplane.io/composed` plus a hash. Other status writes in the reconciler use `Status().Update`. A code comment says to stop using `client.Apply` "after the v2.2 release". A v2.5 docs page that describes SSA behavior for XRs does not exist.

## Lesson

Describe the case as reported, not reproduced by a maintainer, and open. It does not show that Crossplane drops external writers, and it does not show that it is safe for them either. Always check `--show-managed-fields` first, as in [findings/managedfields-are-hidden-from-kubectl-output-by-default](../findings/managedfields-are-hidden-from-kubectl-output-by-default.md). Compare [findings/multiple-writers-on-one-object](../findings/multiple-writers-on-one-object.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md), and [entities/crossplane](../entities/crossplane.md).

## Source reading at v2.5.0 (2026-11-26)

Issue 7453 is still open with the labels `bug` and `stale`. A read of the v2.5.0 composite reconciler found no code path that clears `managedFields` or prunes a spec field owned by another manager: the status apply goes through the status subresource and the references patch is spec-only for `resourceRefs`. The finalizer update and claim propagation paths were not traced, so the reading is inconclusive, not a refutation. No cluster was run, so reproduction on v2.5.0 is unverified. Pull requests 7783 and 7787 are open and unmerged, see [examples/crossplane-pull-requests-7783-and-7787-say-fromstruct-drops-managedfields-on-the-composite-resource](crossplane-pull-requests-7783-and-7787-say-fromstruct-drops-managedfields-on-the-composite-resource.md). The wiki may still say only "reported, not reproduced by a maintainer, open". [sources/research-gap-b1-recheck-kro-crossplane](../sources/research-gap-b1-recheck-kro-crossplane.md)
