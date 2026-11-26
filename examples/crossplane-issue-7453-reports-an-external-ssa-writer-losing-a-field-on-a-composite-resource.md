---
title: "Crossplane issue 7453 reports an external SSA writer losing a field on a composite resource"
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [crossplane, server-side-apply, managedfields, issue, unresolved]
---

# Crossplane issue 7453 reports an external SSA writer losing a field on a composite resource

## Scenario

In May 2026 a user running Crossplane v2.3.1 with function-go-templating reported that a field applied to a composite resource (XR) by an external controller, using server-side apply with `--force-conflicts`, disappeared within one reconcile. The reporter also said the XR's `metadata.managedFields` was empty (`[]`) after the write, and that the apply response had shown the field set. This is the reporter's account (SECONDARY-ONLY), not a maintainer-confirmed behavior. https://github.com/crossplane/crossplane/issues/7453 [[sources/research-gap-g3-crossplane-v2]]

## What happened next

The issue was opened on 2026-05-31 and was still open on 2026-11-26, labeled `bug` and `stale`. The only maintainer comment, from jbw976 on 2026-08-27, says "I couldn't reproduce this just now on v2.3.1, with either a namespaced XR or a legacy v1 style claim", and suggests that `kubectl get -o yaml` hides `managedFields` unless `--show-managed-fields` is passed. The reporter did not reply in the thread.

Two community pull requests, 7783 and 7787 (opened 2026-08-27 and 2026-08-28, both still open), assert a root cause: `FromStruct()` replaces the whole XR object and drops `managedFields`, which breaks field ownership tracking. Neither is merged, and the dossier found no maintainer review of that claim. https://github.com/crossplane/crossplane/pull/7787 and https://github.com/crossplane/crossplane/pull/7783

## How the code applies to XRs

On `main`, the composite reconciler persists `spec.crossplane.resourceRefs` with an SSA apply using `ForceOwnership` under the field owner `apiextensions.crossplane.io/composite`, then applies the XR status the same way. Composed resources use field owners prefixed `apiextensions.crossplane.io/composed` plus a hash. Other status writes in the reconciler use `Status().Update`. A code comment says to stop using `client.Apply` "after the v2.2 release". A v2.5 docs page that describes SSA behavior for XRs does not exist.

## Lesson

Describe the case as reported, not reproduced by a maintainer, and open. It does not show that Crossplane drops external writers, and it does not show that it is safe for them either. Always check `--show-managed-fields` first, as in [[findings/managedfields-are-hidden-from-kubectl-output-by-default]]. Compare [[findings/multiple-writers-on-one-object]], [[concepts/server-side-apply-and-field-ownership]], and [[entities/crossplane]].
