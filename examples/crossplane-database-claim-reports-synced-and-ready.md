---
title: A Crossplane database claim reports Synced and Ready
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-eventual-consistency-and-convergence
    hash: bb35eafbd239
    ingested: 2026-11-25
aliases: []
tags: [crossplane, conditions, cloud, convergence]
---

# A Crossplane database claim reports Synced and Ready

## Scenario

A team asks for a database through a Crossplane claim. The request becomes managed resources that poll the cloud API while the provider provisions slowly. The dossier uses this to show how status conditions describe a convergence that takes minutes. [sources/research-eventual-consistency-and-convergence](../sources/research-eventual-consistency-and-convergence.md)

## How it works

Each managed resource mirrors an external cloud object and treats `forProvider` as the source of truth. Two conditions separate concerns: `Synced` says the provider can reconcile the resource, and `Ready` says the external resource is available. A composite resource reports `Ready` only when its composition function pipeline reports that every composed resource is ready. The external-name annotation ties the Kubernetes object to the cloud identifier so retries do not create duplicates. The poll interval can be set per resource to detect external drift, providers back off on errors, and the `crossplane.io/reconcile-requested-at` annotation forces a composite reconcile. URLs: https://docs.crossplane.io/latest/managed-resources/managed-resources/ and https://docs.crossplane.io/latest/composition/composite-resources/.

## Lesson

While the cloud provisions, a user sees `Synced` true and `Ready` false, which means the controller is working and the thing is not yet usable. Reading only one of the two conditions gives the wrong answer. See [entities/crossplane](../entities/crossplane.md), [concepts/managed-resource](../concepts/managed-resource.md), [concepts/composite-resource](../concepts/composite-resource.md), [findings/misleading-readiness-and-stale-status](../findings/misleading-readiness-and-stale-status.md), and [examples/cloud-console-changes-reverted-by-provider-controllers](cloud-console-changes-reverted-by-provider-controllers.md).
