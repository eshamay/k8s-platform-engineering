---
title: Cluster API issue 10522 cert-manager rotation made webhooks unreachable and failed a clusterctl upgrade test
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [Cluster API issue 10522]
tags: [cluster-api, webhooks, cert-manager, clusterctl, upgrade]
---

# Cluster API issue 10522 cert-manager rotation made webhooks unreachable and failed a clusterctl upgrade test

## Scenario

On 2024-04-26 Cluster API maintainer chrischdi opened issue 10522 after a clusterctl upgrade test (v0.4 to v1.6) failed. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md) URL: https://github.com/kubernetes-sigs/cluster-api/issues/10522

## What happened

The test failed because "a validating webhook was not available due to x509 errors". The issue explains that cert-manager certificate rotation can make Cluster API's conversion and validating webhooks unreachable for up to 90 seconds.

## Status and limits

The issue was open when read on 2026-11-26. It is a test failure from a maintainer and not a user outage, and later releases were not checked. See [findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation](../findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation.md).

## Related

[entities/cluster-api](../entities/cluster-api.md), [entities/cert-manager](../entities/cert-manager.md)
