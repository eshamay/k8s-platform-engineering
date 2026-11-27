---
title: "Research dossier: status and condition gaps (m3-status-conditions)"
type: source
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: []
tags: [conditions, kstatus, observedgeneration, polarity, config-connector, argo-cd, flux, cluster-api, research-dossier, gap-closing, targeted-pass]
---

# Research dossier: status and condition gaps (m3-status-conditions)

> [!NOTE]
> **Raw file:** `raw/research-gap-m3-status-conditions.md` (sha256 prefix 07099fedb0c8)<br>
> **Kind:** Verified research dossier for gap cluster m3-status-conditions, dated 2026-11-26<br>
> **Ingested:** 2026-11-26 as a targeted pass over the condition, kstatus, and status-semantics pages<br>
> **Caveat:** kstatus claims are read from the default branch of cli-utils (latest release v0.37.2, 2024-07-08), and Config Connector claims from the default branch near release v1.162.0 (2026-11-23). Argo CD claims are read near release v3.6.3 (2026-11-24) and Cluster API claims near release v1.14.4. Flux, Cluster API, the maelvls blog, the gist, the kubernetes/community commit diffs, and cli-utils issue 167 were not re-checked in the second verification pass.

## Summary

The dossier settles the kstatus gap from source. `status.Compute` checks deletion, then a top-level generation comparison, then the `Reconciling` and `Stalled` conditions, then type-specific rules for built-in kinds, then a `Ready` fallback, and otherwise reports Current. kstatus never reads a condition's own `observedGeneration`, because its condition struct has no such field.

It also settles the history of condition polarity. The Kubernetes API conventions recommended abnormal-true, reversed to positive in February 2020, and in June 2020 removed the preference, so they now say neither polarity can be recommended as a general rule. No source states a rule for where `observedGeneration` should live, so that question is a design choice with three coexisting practices.

For Config Connector, the reconcile-status design document differs from shipped code. The code uses `UpdateFailed`, a single replaced `Ready` condition, and a top-level `status.observedGeneration`, and it contains no first-field-path message and no operation ID in the reason. Argo CD ships a Lua health check that keys on the shipped reasons. Argo CD's operation-state docs and controller aggregation code were not read.

## Key claims

### kstatus (cli-utils)

- `Compute` decides on generic properties first and skips type-specific rules when the generic check decides. VERIFIED. https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/status.go
- A deletion timestamp gives Terminating, checked before the generation check. VERIFIED. https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/generic.go
- A mismatch between `metadata.generation` and `status.observedGeneration` gives InProgress with reason `LatestGenerationNotObserved`. VERIFIED. Same file.
- If `status.observedGeneration` is absent, the generic check is skipped, with an open TODO about unset versus missing. VERIFIED. Same file.
- `Reconciling=True` gives InProgress and `Stalled=True` gives Failed, decided before any `Ready` condition is read, and the first match in array order wins (read from the loop, not stated in docs). VERIFIED.
- The `Ready` fallback gives Current for True, and InProgress for False or Unknown, so `Ready=False` never gives Failed. VERIFIED. Source comment: "There is no way to determine if a resource with the Ready condition set to False is making progress or is doomed."
- With no recognized conditions the result is Current. VERIFIED.
- kstatus's `BasicCondition` struct has no `observedGeneration` field. VERIFIED. https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/util.go
- For built-in types, a stricter helper returns InProgress with reason `NoObservedGeneration` when `status.observedGeneration` is missing, but the generic path does not. VERIFIED. https://github.com/kubernetes-sigs/cli-utils/blob/master/pkg/kstatus/status/core.go
- The README lists six statuses, while the Go `Statuses` slice lists five with no NotFound (a correction made in verification). VERIFIED.
- That a stale top-level generation overrides a `Ready=True` condition follows from the code order and is an inference, not a documented rule. VERIFIED as code order only.

### Conventions, KEP-1623, and polarity history

- The conventions describe a status-level `observedGeneration` and a per-condition one on `metav1.Condition`, and do not rank them. VERIFIED. https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md (default branch, last commit 2026-11-05)
- KEP-1623 is implemented and stable and makes the per-condition field a non-pointer integer because `.metadata.generation` is never zero. VERIFIED. https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/1623-standardize-conditions/README.md
- The current conventions say "neither positive nor negative polarity can be recommended as a general rule" and note that `Failed=False` can cause double-negative confusion. VERIFIED.
- The commit of 2020-02-14 recommended positive polarity as "an explicit reversal from earlier recommendations of abnormal-true", and the commit of 2020-06-26 removed the positive preference. VERIFIED from commit diffs. https://github.com/kubernetes/community/commit/3a2c17b49 and https://github.com/kubernetes/community/commit/5f972cff4
- The blog quote of the July 2017 abnormal-true text is SECONDARY-ONLY, and the 2017 text itself could not be fetched at its commit. https://maelvls.dev/kubernetes-conditions/
- A kstatus maintainer wrote in cli-utils issue 167 on 2020-05-12 that "It is hard in most cases to distinguish slow from doomed." VERIFIED. https://github.com/kubernetes-sigs/cli-utils/issues/167
- The kstatus README says abnormal-true conditions let a stopped controller look healthy and relies on top-level `observedGeneration` to cover it. VERIFIED.
- A gist by a Flux-ecosystem contributor describes how `Reconciling`, `Stalled`, and `observedGeneration` should interact. SECONDARY-ONLY, read in part. https://gist.github.com/darkowlzz/969c90b2f309908a6d71dd861ba69653
- No published incident write-up measuring generic-tool misreadings per polarity was found. UNVERIFIED, so it may appear only as an open question.

### Flux, Cluster API, Argo CD, and Config Connector status

- Flux's condition setter always stamps the object's current generation on each condition, and its Kustomization status also has a top-level `observedGeneration`. VERIFIED. https://github.com/fluxcd/pkg/blob/main/runtime/conditions/setter.go
- Flux makes `Stalled` and `Reconciling` abnormal-true ("MUST only be present on the resource if the Condition is True") and `Ready` positive. VERIFIED. https://github.com/fluxcd/pkg/blob/main/apis/meta/conditions.go
- Cluster API's 2020 conditions proposal had no `observedGeneration`, and its 2024 proposal drops its own `Condition` type for `metav1.Conditions`. VERIFIED.
- Argo CD's docs tell health-check authors to use `observedGeneration` to prevent flapping, and its Application conditions carry only type, message, and `lastTransitionTime`. VERIFIED. https://github.com/argoproj/argo-cd/blob/master/docs/operator-manual/health.md
- Argo CD's Config Connector health script maps `UpToDate` with True to Healthy, `UpdateFailed` and `DependencyNotFound` to Degraded, `DependencyNotReady` to Suspended, and everything else to Progressing "Update in progress". VERIFIED. https://github.com/argoproj/argo-cd/blob/master/resource_customizations/_.cnrm.cloud.google.com/_/health.lua
- Argo CD tracks resources by the `argocd.argoproj.io/tracking-id` annotation by default. VERIFIED.
- Argo CD's operation-state docs, sync-phase docs, and controller sync-status aggregation code were not read. UNVERIFIED, so open question only.
- Config Connector's lifecycle handler replaces the conditions list with a single `Ready` entry and preserves `lastTransitionTime` unless the status value changes. VERIFIED. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/lifecyclehandler/handler.go
- Shipped reasons are `Updating`, `UpToDate`, and `UpdateFailed`, with messages "Update in progress", "The resource is up to date", and "Update call failed: ...". VERIFIED. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/k8s/constants.go
- The design document `docs/designs/reconcile-status.md` (one commit, 2026-01-30) proposes `UpdateFailure`, a first-field-path message, and an operation ID in the reason as a future consideration. VERIFIED.
- Code searches found `UpdateFailure` and "first field path" only in the design document, and no per-condition `observedGeneration`. VERIFIED as a search result, and index freshness is not guaranteed.
- Config Connector direct controllers write a top-level `status.observedGeneration` on every status update and have the per-condition line commented out with a TODO. VERIFIED. https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/direct/directbase/operations.go
- The file `release-1.138.md` carries the heading "Release 1.137.0", so which release the ConfigConnector `observedGeneration` line belongs to is ambiguous. VERIFIED as an ambiguity.

## Not found or unread

- Whether any open Config Connector pull request implements the design was not checked.
- No Config Connector docs page describes `status.observedGeneration` beyond generated type comments.
- kro and Crossplane were outside this dossier's focus.

## Pages updated from this source

[entities/kstatus](../entities/kstatus.md), [concepts/conditions](../concepts/conditions.md), [entities/config-connector](../entities/config-connector.md), [entities/argo-cd](../entities/argo-cd.md), [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md), [decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types](../decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types.md), [decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both](../decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both.md), and the findings and examples that cite this page.
