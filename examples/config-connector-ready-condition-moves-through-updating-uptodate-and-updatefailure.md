---
title: Config Connector Ready condition moves through Updating, UpToDate, and UpdateFailure
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [config-connector, conditions, gcp, reconcile-status]
---

# Config Connector Ready condition moves through Updating, UpToDate, and UpdateFailure

## Scenario

A user edits a Config Connector resource that represents a Google Cloud object. The controller must call Google APIs, which takes time, and the user wants to know from the object alone whether the change is in flight, done, or failed. [[sources/research-conditions]]

## How it works

The reconcile-status design document describes a single `Ready` condition whose reason carries the phase. While the controller is calling Google APIs, `Ready` is `False` with reason `Updating`, and the message names the first changed field. When the update completes, `Ready` is `True` with reason `UpToDate` and the message "Resource is up to date". If the call fails, `Ready` is `False` with reason `UpdateFailure` and the message carries the error. Only one `Ready` entry exists at a time, and `observedGeneration` is set when status is updated. URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/docs/designs/reconcile-status.md.

The document also floats putting long-running operation IDs into the reason so the controller can resume after a restart. Because the source is a design document, the dossier does not say whether that proposal shipped.

## Lesson

Config Connector keeps one condition and encodes progress in the reason, where Crossplane uses two conditions (`Synced` and `Ready`) and ACK uses several. The single-condition design is simple for consumers, but `Ready=False` means both "working on it" and "failed", so a reader must inspect the reason. See [[comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api]], [[entities/config-connector]], [[concepts/conditions]], and [[examples/cloud-console-changes-reverted-by-provider-controllers]].
