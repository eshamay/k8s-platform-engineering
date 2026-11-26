---
title: A stale manager owning a list entry key breaks the dry-run after removal
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
aliases: []
tags: [pitfall, flux, server-side-apply, dry-run, lists]
---

# A stale manager owning a list entry key breaks the dry-run after removal

## Observation

Flux issue 1722 describes an operator who disables Flux, patches a workload with a legacy controller using Update operations, and re-enables Flux. The legacy manager now co-owns a container entry's key but not its required `image` field. When a later commit removes the container, server-side apply drops the field Flux solely owned and leaves an invalid half-removed container. The dry-run then fails on every reconcile. [[sources/research-server-side-apply-and-field-ownership]]

## Why the usual cleanup does not run

Flux reclaims known managers only after a successful dry-run, through `--override-manager`, so that a failed apply never reassigns ownership. Here the dry-run fails first, so the cleanup never runs. The proposed fix was an opt-in `--override-manager-before-dry-run=<manager>` flag. A maintainer agreed that "doing operations before dry-run is dangerous and can have unintended consequences", and the flag is meant only for targeted migrations from legacy controllers to Flux. URL: https://github.com/fluxcd/kustomize-controller/issues/1722. See [[findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation]].

## Status

Issue 1722 was created on 2026-08-06 and closed on 2026-10-23 through kustomize-controller PR 1747. The shipped flag is `--override-manager-before-dry-run`, the name the issue proposed. It first appeared in kustomize-controller v1.10.0 (2026-10-24) and is bundled in Flux v2.10.0 (2026-10-26). It is a separate opt-in list, and `--override-manager` is unchanged. The documentation says the takeover transfers all fields of the named managers, prunes fields missing from the source, is not reverted if the apply fails, matches names exactly, and should be removed once the stuck objects reconcile. [[sources/research-gap-g3-flux-ssa-helm]] See [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]], [[decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager]], and [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]].

Correction: an earlier version of this page said the final flag semantics had not been verified. The 2026-11-26 dossier verified them against PR 1747, the v1.10.0 source and documentation, and the Flux v2.10.0 release notes.

## Related

[[findings/field-ownership-blocks-drift-correction]], [[findings/client-side-to-server-side-migration-leaves-stale-co-owners]], [[concepts/server-side-apply-and-field-ownership]], [[entities/flux]]
