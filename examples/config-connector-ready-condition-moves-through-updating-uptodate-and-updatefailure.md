---
title: Config Connector Ready condition moves through Updating, UpToDate, and UpdateFailure
type: example
status: contradicted
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
  - id: research-gap-m3-status-conditions
    hash: 07099fedb0c8
    ingested: 2026-11-26
aliases: []
tags: [config-connector, conditions, gcp, reconcile-status]
---

# Config Connector Ready condition moves through Updating, UpToDate, and UpdateFailure

## Scenario

A user edits a Config Connector resource that represents a Google Cloud object. The controller must call Google APIs, which takes time, and the user wants to know from the object alone whether the change is in flight, done, or failed. [[sources/research-conditions]]

## How it works

The reconcile-status design document describes a single `Ready` condition whose reason carries the phase. The shipped code, read at release v1.162.0 (2026-11-23), keeps that shape with different names. While the controller is calling Google APIs, `Ready` is `False` with reason `Updating` and the message "Update in progress". When the update completes, `Ready` is `True` with reason `UpToDate` and the message "The resource is up to date". If the call fails, `Ready` is `False` with reason `UpdateFailed` and a message beginning "Update call failed". Only one `Ready` entry exists at a time, because the handler replaces the whole conditions list, and a top-level `status.observedGeneration` is written on every status update. [[sources/research-gap-m3-status-conditions]] URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/lifecyclehandler/handler.go

Two proposals in the design did not ship. A message naming the first changed field path and a long-running operation ID in the reason (`Updating:operation-123456789`, listed by the design itself as a future consideration) were not found in code. The design covers direct controllers only, and the legacy Terraform and DCL controllers are out of its scope. See [[findings/config-connector-shipped-updatefailed-with-a-single-ready-condition-and-the-first-field-path-message-and-operation-id-reason-are-not-in-code]].

## Lesson

Config Connector keeps one condition and encodes progress in the reason, where Crossplane uses two conditions (`Synced` and `Ready`) and ACK uses several. The single-condition design is simple for consumers, but `Ready=False` means both "working on it" and "failed", so a reader must inspect the reason. See [[comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api]], [[entities/config-connector]], [[concepts/conditions]], and [[examples/cloud-console-changes-reverted-by-provider-controllers]].

## Contradictions

> [!WARNING]
> This page's title and earlier text gave the failure reason as `UpdateFailure` and the failure message as carrying the first changed field, as the design document proposed. The shipped code contradicts both.

- Earlier claim on this page: "If the call fails, `Ready` is `False` with reason `UpdateFailure` and the message carries the error", and "the message names the first changed field".
- Verified in [[sources/research-gap-m3-status-conditions]]: the shipped reason is `UpdateFailed` with the message "Update call failed: ...", and code searches found `UpdateFailure` and "first field path" only in the design document. Argo CD's health script also matches `UpdateFailed`.
- Suggested resolution: treat the title as describing the design. A successor page titled with `UpdateFailed` could replace this one when a later pass renames it.
