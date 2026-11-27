---
title: Flux issue 1722, a stale legacy manager wedges the dry-run until the v1.10.0 pre-dry-run flag
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
aliases: []
tags: [flux, kustomize-controller, server-side-apply, incident, issue-1722, pr-1747]
---

# Flux issue 1722, a stale legacy manager wedges the dry-run until the v1.10.0 pre-dry-run flag

## Scenario

An operator disabled Flux, patched a workload with a legacy controller, and re-enabled Flux. The legacy controller used a client-side PUT, so its field manager appears in `managedFields` with the operation `Update`. That manager co-owns a container's `name` key in the containers list but not the container's required `image` field. [sources/research-gap-g3-flux-ssa-helm](../sources/research-gap-g3-flux-ssa-helm.md)

## What went wrong

A later Git commit removed the container. Server-side apply dropped the fields Flux solely owned, but the stale manager still co-owned the name key, so the entry survived without its `image`. The dry-run then failed with `containers[N].image: Required value` on every reconcile, and the Kustomization could not converge. The existing `--override-manager` takeover could not help, because it runs only after a successful dry-run. See [findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation](../findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation.md).

## Timeline

- Issue 1722 in fluxcd/kustomize-controller was created on 2026-08-06 and proposed a separate opt-in flag, `--override-manager-before-dry-run`. URL: https://github.com/fluxcd/kustomize-controller/issues/1722.
- The fluxcd/pkg change "ssa: Add pre-dry-run field manager takeover" (PR 1276) merged on 2026-10-23. URL: https://github.com/fluxcd/pkg/pull/1276.
- kustomize-controller PR 1747, "Add pre-dry-run override manager takeover" by dipti-pai, merged on 2026-10-23 and closed the issue. URL: https://github.com/fluxcd/kustomize-controller/pull/1747.
- kustomize-controller v1.10.0 shipped the flag on 2026-10-24, and Flux v2.10.0 bundled it on 2026-10-26.

## Resolution

Running kustomize-controller with `--override-manager-before-dry-run=<manager>` makes it take over the named manager's fields before the dry-run, so the half-removed container is pruned and the dry-run passes. The documentation says to use the flag only to recover stuck objects and remove it afterwards, because the takeover transfers all of the named manager's fields, prunes fields missing from the source, and is not reverted if the apply fails. See [findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails](../findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails.md) and [decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager](../decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager.md).

## Lesson

A tool that dry-runs before it applies can be wedged by ownership records that only an apply could clear. The fix is an explicit, narrow, temporary recovery switch and not a standing policy. See [findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal](../findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal.md), [findings/field-ownership-blocks-drift-correction](../findings/field-ownership-blocks-drift-correction.md), and [entities/flux](../entities/flux.md).
