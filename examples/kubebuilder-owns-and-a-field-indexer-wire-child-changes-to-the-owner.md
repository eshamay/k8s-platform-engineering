---
title: Kubebuilder Owns and a field indexer wire child changes to the owner
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-informers-reflectors-and-workqueues
    hash: f9de5ca73ab6
    ingested: 2026-11-25
aliases: []
tags: [kubebuilder, controller-runtime, informers, indexer, cronjob]
---

# Kubebuilder Owns and a field indexer wire child changes to the owner

## Scenario

The Kubebuilder CronJob tutorial builds a reconciler that creates Jobs on a schedule. It shows how the informer machinery appears at the framework level. [sources/research-informers-reflectors-and-workqueues](../sources/research-informers-reflectors-and-workqueues.md)

## How the pieces connect

The reconciler fetches the primary CronJob, lists the Jobs it owns, updates status, prunes old Jobs, and returns `RequeueAfter` for the next scheduled run. Calling `Owns(&Job{})` when the controller is set up registers an informer on Jobs and maps each Job event back to its owner's key, so a child change triggers a reconcile of the parent. A field indexer on the owner reference lets the reconciler list a CronJob's Jobs from the cache without scanning every Job. The tutorial notes that "if something else changes in between... we might reconcile again sooner," which shows that the requeue time is a hint and not a guarantee. URL: https://book.kubebuilder.io/cronjob-tutorial/controller-implementation.

## Lesson

Framework calls such as `Owns()` and `Watches()` create the informers, the event-to-key mapping, and the queue for the author. Indexers are the cache-side counterpart of label selectors on the API server. See [examples/kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator](kubebuilder-cronjob-tutorial-shows-the-end-to-end-shape-of-a-go-operator.md), [entities/kubebuilder](../entities/kubebuilder.md), [entities/controller-runtime](../entities/controller-runtime.md), and [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md).
