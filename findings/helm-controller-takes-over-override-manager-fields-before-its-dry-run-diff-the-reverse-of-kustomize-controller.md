---
title: helm-controller takes over override-manager fields before its dry-run diff, the reverse of kustomize-controller
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [helm-controller override-manager order]
tags: [flux, helm-controller, kustomize-controller, override-manager, dry-run, server-side-apply, verified]
---

# helm-controller takes over override-manager fields before its dry-run diff, the reverse of kustomize-controller

## Observation

In helm-controller, `DetermineReleaseState` calls `action.Diff` with the disallowed field managers when drift detection is enabled. Inside `Diff`, if that list is non-empty, a non-dry-run client runs `replaceDisallowedFieldManagers` on each live object and patches `managedFields` before the dry-run client computes the diff. The error text on failure is "failed to clean-up disallowed field managers". So helm-controller's takeover happens before its server-side dry-run diff. [[sources/research-gap-m4-ssa-conflict-policy]] URL: https://github.com/fluxcd/helm-controller/blob/main/internal/action/diff.go (commit 072b907).

kustomize-controller is the reverse. Its documentation says `--override-manager` "takes over the named field managers only after a successful server-side apply dry-run", and it added `--override-manager-before-dry-run` for objects whose dry-run fails on every reconcile. See [[findings/the-flux-override-manager-flag-takes-over-only-after-a-successful-dry-run-so-it-cannot-recover-an-object-stuck-at-dry-run-validation]].

## What this settles

The question left open by [[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]] was whether the helm-controller flag acts before or after its dry-run. By source order it acts before, so it can clear a stale manager such as `kubectl-edit` that wedges the dry-run. That matches the community answer recorded in [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]], and it explains why helm-controller needed no separate recovery flag.

## What is not settled

The body of `ssa.PatchReplaceFieldsManagers` was not read. `Diff` runs `Graceful(true)`, and how a dry-run error then surfaces for a stuck HelmRelease was not traced. helm-controller's upgrade path always forces conflicts, so a dry-run failure caused by a merged-object validation error, and not by a conflict, is a separate failure that force does not fix. No helm-controller counterpart to `--override-manager-before-dry-run` and no documented recovery for a stuck HelmRelease was found in `main.go`, the docs, or the changelog.

## Related

[[entities/flux]], [[findings/field-ownership-blocks-drift-correction]], [[concepts/server-side-apply-and-field-ownership]]
