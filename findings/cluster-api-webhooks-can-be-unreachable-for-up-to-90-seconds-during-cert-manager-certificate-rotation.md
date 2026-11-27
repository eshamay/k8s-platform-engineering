---
title: Cluster API webhooks can be unreachable for up to 90 seconds during cert-manager certificate rotation
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [cluster-api, webhooks, cert-manager, upgrade, clusterctl, pitfall]
---

# Cluster API webhooks can be unreachable for up to 90 seconds during cert-manager certificate rotation

## Observation

Cluster API issue 10522 (2024-04-26), written by maintainer chrischdi, reports that cert-manager certificate rotation can make Cluster API's conversion and validating webhooks unreachable for up to 90 seconds. The issue says a clusterctl upgrade test (v0.4 to v1.6) failed because "a validating webhook was not available due to x509 errors". The issue was open when the dossier read it on 2026-11-26. [sources/research-gap-g1-other-tool-pitfalls](../sources/research-gap-g1-other-tool-pitfalls.md) URL: https://github.com/kubernetes-sigs/cluster-api/issues/10522

## Why it matters

It is a concrete instance of the general webhook bootstrap and rotation window in [findings/webhook-tls-and-network-bootstrap-leaves-an-unready-window](webhook-tls-and-network-bootstrap-leaves-an-unready-window.md), seen in a project's own upgrade test. During the window, any write that needs a Cluster API webhook can fail, which includes the object updates a clusterctl upgrade makes.

## Evidence limits

This is a maintainer-authored test failure and not a production incident, and it is more than two years old. Whether later releases changed the rotation behavior was not checked. The issue gives no outage impact for any user.

## Related

[examples/cluster-api-issue-10522-cert-manager-rotation-made-webhooks-unreachable-and-failed-a-clusterctl-upgrade-test](../examples/cluster-api-issue-10522-cert-manager-rotation-made-webhooks-unreachable-and-failed-a-clusterctl-upgrade-test.md), [entities/cluster-api](../entities/cluster-api.md), [entities/cert-manager](../entities/cert-manager.md), [findings/admission-webhook-outages-are-a-recurring-failure-class](admission-webhook-outages-are-a-recurring-failure-class.md)
