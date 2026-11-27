---
title: Config Connector issue 648 an alert policy was created on every reconcile although the create returned HTTP 400
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [Config Connector issue 648]
tags: [config-connector, monitoringalertpolicy, duplicate-resource, gcp-api, failed-create]
---

# Config Connector issue 648 an alert policy was created on every reconcile although the create returned HTTP 400

## Scenario

Config Connector issue 648 was opened on 2022-04-05 against v1.76.0. A MonitoringAlertPolicy carried an invalid query, so the create call returned HTTP 400. [sources/research-gap-g1-leaked-resources-adoption](../sources/research-gap-g1-leaked-resources-adoption.md) URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/648

## What happened

Even though the create call failed, a new alert policy appeared on each reconcile. A Config Connector engineer replied on 2022-04-06 that "a policy resource will still be created nonetheless", and attributed the behavior to the GCP API, which creates the policy even when the create returns 400.

## Why it belongs here

A failed create is not always a create that did nothing, so a controller that retries on error can duplicate the resource. This is a case where the cloud API, and not a crash, produced the ambiguity. See [findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent](../findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent.md) and [concepts/idempotency](../concepts/idempotency.md).

## Related

[entities/config-connector](../entities/config-connector.md), [findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes](../findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes.md)
