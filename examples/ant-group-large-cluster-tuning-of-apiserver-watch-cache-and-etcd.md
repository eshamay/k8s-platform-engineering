---
title: Ant Group large-cluster tuning of the apiserver watch cache and etcd
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
aliases: []
tags: [scale, etcd, apiserver, case-study]
---

# Ant Group large-cluster tuning of the apiserver watch cache and etcd

## Scenario

Ant Group engineers ran a Kubernetes cluster of more than 10,000 nodes and wrote up the apiserver and etcd bottlenecks they hit. The write-up is not about CRDs, but custom resources share the same storage and watch paths as built-in objects, so the same bottlenecks apply as custom resource counts grow. [[sources/research-custom-resource-definition]]

## What they did

The techniques described are serving list requests from the apiserver watch cache, which cut memory use from roughly 400 GB to 100 GB, sizing the watch cache dynamically, indexing by label, tuning retries, and splitting etcd. URL: https://segmentfault.com/a/1190000040750768/en. The article opens its argument with the line "All problems in computer science can be solved by another level of indirection, except for too many layers of indirection and performance problems."

## Lesson

The dossier does not break out CRD counts from this case, so it is context for scale limits and not evidence about a specific CRD ceiling. The wiki's open question about authoritative CRD scale limits stays open. See [[findings/etcd-scale-limits-of-the-shared-store]], [[concepts/informers-reflectors-and-workqueues]], and [[concepts/custom-resource-definition]].
