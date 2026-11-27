---
title: Config Connector direct controllers write a top-level observedGeneration and leave the per-condition line commented out
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: [Config Connector observedGeneration]
tags: [config-connector, observedgeneration, conditions, direct-controllers]
---

# Config Connector direct controllers write a top-level observedGeneration and leave the per-condition line commented out

## Scenario

Config Connector's newer direct controllers share a base in `pkg/controller/direct/directbase/operations.go` (file last changed 2026-11-06). The base sets status after each reconcile and has to decide where to record the generation it acted on. [sources/research-gap-m3-status-conditions](../sources/research-gap-m3-status-conditions.md) URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/direct/directbase/operations.go

## How it works

On every status update the base writes `status["observedGeneration"] = o.object.GetGeneration()` and applies the `Ready` condition through `SetStatusCondition`. The line that would set the same value on the condition is commented out, with the note "TODO: Do we want ObservedGeneration in our conditions?". A golden test file for a direct Compute address shows the shipped failure shape: `Ready=False`, reason `UpdateFailed`, message "Update call failed: error updating: ...", and `observedGeneration: 1` at the top level. The generated CRD types document the field as "If this is equal to metadata.generation, then ... the current reported status reflects the most recent desired state".

In the same package, `isAPIServerUpdateRequired` is a stub that returns true, with TODOs for a condition and generation comparison. The public docs pages read do not describe `status.observedGeneration`, and the release-notes line "Updated `status.observedGeneration` in ConfigConnector object. (#5507)" sits in a file named `release-1.138.md` whose own heading says "Release 1.137.0", so its release is ambiguous.

## Lesson

Config Connector is a worked case of the "top-level only" option in [decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both](../decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both.md), which is the placement kstatus and Argo CD consume. See [findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code](../findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code.md), [entities/config-connector](../entities/config-connector.md), and [comparisons/observedgeneration-top-level-versus-per-condition](../comparisons/observedgeneration-top-level-versus-per-condition.md).
