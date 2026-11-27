---
title: ACK splits terminal and recoverable errors into separate conditions
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-conditions
    hash: 97b224c63502
    ingested: 2026-11-25
aliases: []
tags: [ack, conditions, aws, error-classification]
---

# ACK splits terminal and recoverable errors into separate conditions

## Scenario

An engineer creates an ACK resource, such as an S3 bucket or an RDS instance, and the AWS call fails. The engineer, or an alerting rule, has to decide whether to wait for the controller to retry or to edit the spec. [sources/research-conditions](../sources/research-conditions.md)

## How it works

ACK reports the answer in the conditions. `ACK.Recoverable` marks transient problems such as throttling or a service being unavailable, which may heal by themselves. `ACK.Terminal` marks an unrecoverable error, and the documentation says the spec must be updated before sync can continue. `ACK.ResourceSynced` says the AWS resource matches the spec, `ACK.Adopted` marks a resource that was adopted, `ACK.ReferencesResolved` marks that cross-resource references have been resolved, and `Ready` is the top-level indicator. URL: https://aws-controllers-k8s.github.io/docs/concepts/.

## Lesson

Separating the two error classes lets automation make a decision a single `Ready=False` cannot support: retry or page a human. Crossplane gets a similar signal less directly, through the message on `ReconcileError`. ACK conditions do not carry `observedGeneration` in the evidence the wiki holds, so a consumer reading `ResourceSynced=True` cannot always tell whether it describes the current spec. See [findings/missing-observedgeneration-hides-stale-status](../findings/missing-observedgeneration-hides-stale-status.md), [decisions/publish-synced-false-at-reconcile-start](../decisions/publish-synced-false-at-reconcile-start.md), [comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api](../comparisons/condition-vocabularies-across-crossplane-ack-config-connector-flux-kro-and-cluster-api.md), and [entities/ack](../entities/ack.md).
