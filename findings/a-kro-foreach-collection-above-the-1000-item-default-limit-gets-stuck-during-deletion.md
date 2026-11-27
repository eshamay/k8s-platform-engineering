---
title: A kro forEach collection above the 1000 item default limit gets stuck during deletion
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g3-kro
    hash: e8d7c5923d98
    ingested: 2026-11-26
aliases: []
tags: [pitfall, kro, foreach, collections, deletion]
---

# A kro forEach collection above the 1000 item default limit gets stuck during deletion

## Observation

A kro `forEach` entry takes one or more single-entry iterators and produces a cartesian product, so two iterators of 40 items each yield 1,600 resources. An empty iterator yields zero resources, and iterators cannot depend on each other. The collections page limits a collection to 1000 resources by default and says "collections that exceed this limit will get stuck during deletion". The limit is the tuning setting `config.rgd.maxCollectionSize` (default 1000), and a second setting, `config.rgd.maxCollectionDimensionSize` (default 10), bounds the number of iterator dimensions. [sources/research-gap-g3-kro](../sources/research-gap-g3-kro.md) URL: https://github.com/kubernetes-sigs/kro/blob/v0.10.0/website/docs/docs/concepts/reconciliation/03-collections.md

## Why it matters

Deletion is where the limit bites, which makes it easy to miss in testing. A collection that grows past the limit because a list in `schema.spec` grew can be created or updated, yet the instance then cannot finish teardown, and the instance finalizer stays in place. That compounds the reverse-wave deletion described in [examples/kro-deletes-instance-resources-in-reverse-dependency-waves](../examples/kro-deletes-instance-resources-in-reverse-dependency-waves.md), since every wave must finish before the next one starts.

## Mitigations

Keep the product of the iterator sizes well under the limit, and cap list lengths in the schema. Raise `config.rgd.maxCollectionSize` only with a plan for the extra API load, using the knobs in [examples/kro-shared-queue-tunes-throughput](../examples/kro-shared-queue-tunes-throughput.md). If an instance is already stuck, look for the over-limit collection before hunting for finalizers on children. See [entities/kro](../entities/kro.md) and [concepts/finalizers](../concepts/finalizers.md).
