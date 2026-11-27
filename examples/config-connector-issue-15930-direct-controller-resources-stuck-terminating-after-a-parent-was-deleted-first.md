---
title: Config Connector issue 15930 Direct-controller resources stuck Terminating after a parent was deleted first
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [Config Connector issue 15930]
tags: [config-connector, deletion, finalizer, abandon, direct-controller]
---

# Config Connector issue 15930 Direct-controller resources stuck Terminating after a parent was deleted first

## Scenario

On 2026-11-17 a reporter opened issue 15930 on the Config Connector repository. They say they reproduced it on v1.161.0. Direct-controller resources whose referenced or parent object was deleted first never finish deleting. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md) URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/15930

## What the reporter says

The object stays Terminating, and `deletion-policy: abandon` "does not release the object either". The explanation offered is that reference resolution and the GCP read run before the deletion check, so a missing parent stops the controller before it reaches the abandon branch.

## Status and limits

Open when read and unconfirmed by maintainers. It is a reporter's reproduction and not a production outage. See [findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them](../findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them.md).

## Related

[entities/config-connector](../entities/config-connector.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md)
