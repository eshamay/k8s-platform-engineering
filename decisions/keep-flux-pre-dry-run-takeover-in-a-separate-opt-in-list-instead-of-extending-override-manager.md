---
title: Keep Flux pre-dry-run takeover in a separate opt-in list instead of extending override-manager
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
aliases: []
tags: [decision, flux, kustomize-controller, server-side-apply, field-manager]
---

# Keep Flux pre-dry-run takeover in a separate opt-in list instead of extending override-manager

## Status

Accepted by the Flux maintainers. It shipped in kustomize-controller v1.10.0 (2026-10-24) through PR 1747. This page records the decision as the project documented it. [[sources/research-gap-g3-flux-ssa-helm]]

## Context

Flux runs a server-side apply dry-run before it applies. A legacy controller's stale `Update` manager can co-own a list entry's key, which leaves a half-removed object that fails dry-run validation on every reconcile (see [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]]). The existing `--override-manager` flag reclaims fields only after a successful dry-run, so it cannot help. Taking over before the dry-run fixes the stuck object, but it mutates ownership before validation.

## Options

1. Move all takeover before the dry-run by changing `--override-manager`. This recovers stuck objects, but an unrelated dry-run failure would leave ownership already reassigned for every named manager, and the transactional behavior of the default managers would be lost.
2. Keep takeover after the dry-run only. This is safe, but stuck objects need a manual `managedFields` edit.
3. Add a second, separate opt-in list, `--override-manager-before-dry-run`, and leave `--override-manager` and the default managers on the post-dry-run path.

## Decision

Option 3. The pull request states that "the always-on default managers stay on the post-dry-run cleanup path to preserve their transactional behavior". The issue records the reason for the separate list: "A pre-dry-run takeover mutates ownership first, so if the dry-run then fails for an unrelated reason" the ownership change has already happened. A maintainer had also said that doing operations before the dry-run is dangerous and can have unintended consequences.

## Consequences

Operators get a recovery path for wedged objects and must opt in by naming each manager exactly. The documentation says to remove the flag once the objects reconcile, because the takeover transfers all fields of the named managers, prunes fields missing from the source, and is not reverted if the apply fails. See [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]] and [[findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation]].

## Related

[[decisions/force-conflicts-or-surface-them-to-humans]], [[entities/flux]]
