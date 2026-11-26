---
title: Condition vocabularies across Crossplane, ACK, Config Connector, Flux, kro, and Cluster API
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: []
tags: [conditions, comparison, crossplane, ack, config-connector, flux, kro, cluster-api]
---

# Condition vocabularies across Crossplane, ACK, Config Connector, Flux, kro, and Cluster API

## What is compared

All six stacks write `.status.conditions`, but they choose different condition types, different splits between progress and failure, and different places to keep `observedGeneration`. This page lines up the vocabularies that [[sources/research-conditions]] read. The dossier read each tool through a single page, so treat the table as a map of documented intent and not as a test of live behavior.

## Side by side

| Tool | Conditions | What separates progress from failure | Notes |
|---|---|---|---|
| Crossplane managed resource | `Ready`, `Synced`, plus `AsyncOperation` for Upjet providers | Two conditions read together: `Synced=False` means credentials, configuration, or provider trouble, while `Ready=False` with `Synced=True` means the cloud side | Read as v1.20; `Synced` stayed True during a long async update |
| ACK | `Ready`, `ACK.ResourceSynced`, `ACK.Terminal`, `ACK.Recoverable`, `ACK.Adopted`, `ACK.ReferencesResolved` | Terminal versus recoverable errors | Terminal means the spec must change |
| Config Connector | One `Ready` | Reason: `Updating`, `UpToDate`, `UpdateFailed` | Only one `Ready` entry; read from shipped code (the design document said `UpdateFailure`) |
| Flux | `Ready`, `Reconciling`, `Stalled` | `Reconciling=True` is normal progress and `Stalled` means no progress without a change | Health checks use kstatus or CEL expressions |
| kro | Four built-in instance conditions (`InstanceManaged`, `GraphResolved`, `ResourcesReady`, `Ready`), or fully author-defined conditions through CEL | `readyWhen` per resource, default "exists" | Custom conditions hide the built-ins |
| Cluster API | `Available`, `Ready`, operation conditions such as `ScalingUp` and `Remediating` | Separate availability and operation signals | Moved to `metav1.Condition` |

## Reading the differences

Crossplane and ACK split signals across conditions, Config Connector packs them into reasons, Flux uses the kstatus pair, and kro and Cluster API move toward richer or author-owned sets. That variety is why Argo CD needs custom Lua health checks and Flux needs CEL checks for kinds that do not follow kstatus. KEP-1623 standardized the shape of a condition but not the vocabulary of types. See [[comparisons/health-and-readiness-models-across-tools]], [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]], [[comparisons/observedgeneration-top-level-versus-per-condition]], and [[concepts/conditions]].

## Examples behind each row

[[examples/crossplane-synced-stays-true-through-a-sixty-minute-async-msk-update]], [[examples/ack-splits-terminal-and-recoverable-errors-into-separate-conditions]], [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]], [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]], and [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]].

## Correction from the m3 dossier

The Config Connector row previously gave the failure reason as `UpdateFailure`, the design document's name. The shipped reason is `UpdateFailed`. Polarity also differs across the rows: Flux's `Reconciling` and `Stalled` are abnormal-true and its `Ready` is positive, Config Connector uses one positive `Ready`, and Argo CD's Application conditions carry only a type, message, and `lastTransitionTime`. [[sources/research-gap-m3-status-conditions]] See [[findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code]] and [[examples/flux-stamps-the-current-generation-on-every-condition-and-also-keeps-a-top-level-observedgeneration]].
