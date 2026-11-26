---
title: "Config Connector issue 479 a ContainerNodePool delete stuck after a quota error on KCC 1.46.0"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: [Config Connector issue 479]
tags: [config-connector, deletion, quota, backoff, issue, single-source]
---

# Config Connector issue 479 a ContainerNodePool delete stuck after a quota error on KCC 1.46.0

## Scenario

Issue 479 was opened on 2021-05-27 against KCC 1.46.0 in cluster mode. The reporter says a `ContainerNodePool` delete stuck after a quota error and was not retried to completion. A contributor asked for logs and said backoff retry "(which should be the designed behaviour)". URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/479 [[sources/research-gap-o4-config-connector-ack]]

## Evidence strength

SECONDARY-ONLY. The dossier did not confirm the reporter's outcome in the part of the thread it read. The issue is five years old and the version is far behind v1.162.0, so it is evidence of a failure shape and not of current behavior.

## Lesson

A failed delete against a cloud API keeps the finalizer in place, so the object lingers until the controller's backoff succeeds. See [[findings/argo-cd-and-config-connector-document-bounded-exponential-backoff-and-status-based-health-for-failure-handling]] and [[concepts/finalizers]].
