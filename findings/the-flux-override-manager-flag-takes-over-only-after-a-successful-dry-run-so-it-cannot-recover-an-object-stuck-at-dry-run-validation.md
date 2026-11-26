---
title: The Flux override-manager flag takes over only after a successful dry-run, so it cannot recover an object stuck at dry-run validation
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-b1-recheck-flux-k8s
    hash: c78dc9a9635e
    ingested: 2026-11-26
  - id: research-gap-g3-flux-ssa-helm
    hash: e825557fc5c4
    ingested: 2026-11-26
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [pitfall, flux, kustomize-controller, server-side-apply, dry-run, field-manager]
---

# The Flux override-manager flag takes over only after a successful dry-run, so it cannot recover an object stuck at dry-run validation

## Observation

kustomize-controller's `--override-manager` flag, which the options page describes as "Field manager disallowed to perform changes on managed resources.", reclaims the named managers' fields only after a server-side apply dry-run succeeds. The pull request that added the pre-dry-run flag states the limit directly: "The existing --override-manager takeover runs only after a successful dry-run, so it cannot recover an object wedged at dry-run validation". [[sources/research-gap-g3-flux-ssa-helm]] URL: https://github.com/fluxcd/kustomize-controller/pull/1747.

## Why it matters

When a stale co-owning manager makes the dry-run itself fail, the takeover step is never reached, so the flag that was meant to fix ownership cannot run. The object fails on every reconcile until someone edits `managedFields` by hand or uses the pre-dry-run flag, available from kustomize-controller v1.10.0. See [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]].

## Why the order is a deliberate choice

Taking over after the dry-run means a failed apply never reassigns ownership, which keeps the cleanup transactional. See [[decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager]].

## Related

[[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]], [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]], [[entities/flux]]

## Update from the Flux and Kubernetes recheck

Update 2026-11-26: the kustomize-controller options page was re-read and documents both flags. It says `--override-manager` takes over "only after a successful server-side apply dry-run" and that `--override-manager-before-dry-run` takes over before it, to be removed after a stuck object is recovered. The helm-controller flag of the same name is scoped to drift detection ([[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]]). [[sources/research-gap-b1-recheck-flux-k8s]]

## Scope note from the m4 dossier

Update 2026-11-26: this finding describes kustomize-controller. helm-controller's `--override-manager` runs the other way, taking over before its dry-run diff. [[sources/research-gap-m4-ssa-conflict-policy]] See [[findings/helm-controller-takes-over-override-manager-fields-before-its-dry-run-diff-the-reverse-of-kustomize-controller]].
