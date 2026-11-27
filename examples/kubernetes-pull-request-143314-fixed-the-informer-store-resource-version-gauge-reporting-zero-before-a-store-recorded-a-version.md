---
title: "Kubernetes pull request 143314 fixed the informer store resource version gauge reporting zero before a store recorded a version"
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [Kubernetes PR 143314, informer_store_resource_version zero fix]
tags: [kubernetes, staleness, metrics, informers, v1-38, changelog]
---

# Kubernetes pull request 143314 fixed the informer store resource version gauge reporting zero before a store recorded a version

## What the source shows

The Kubernetes 1.38 changelog on master carries the entry "Fixed the `informer_store_resource_version` metric reporting 0 before an informer store records a resource version", attributed to pull request 143314. The gauge was introduced beside the v1.36 staleness work (ALPHA, subsystem `informer`, labels `name`, `group`, `version`, `resource`). [sources/research-gap-o9-cadence-and-staleness](../sources/research-gap-o9-cadence-and-staleness.md) https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.38.md

## What it means

On releases before the fix, a store that had not yet recorded a resource version could show a value of 0, which a dashboard or alert comparing cache progress could read as a store that is far behind. The dossier read the changelog line and not the pull request diff, so which releases carry the old behavior is not established, and the fix is listed under 1.38, whose latest read tag is v1.38.0-beta.0 (2026-11-06). The help text calls the value "The 15 least significant digits of the resource version of the store", so it is a coarse signal. See [findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source](../findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source.md).

## Related

[findings/stale-cache-and-double-action](../findings/stale-cache-and-double-action.md), [concepts/informers-reflectors-and-workqueues](../concepts/informers-reflectors-and-workqueues.md)
