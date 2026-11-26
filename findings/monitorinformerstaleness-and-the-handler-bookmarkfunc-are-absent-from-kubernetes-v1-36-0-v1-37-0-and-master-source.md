---
title: "MonitorInformerStaleness and the handler BookmarkFunc are absent from Kubernetes v1.36.0, v1.37.0 and master source"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o9-cadence-and-staleness
    hash: eb353fed45cd
    ingested: 2026-11-26
aliases: [MonitorInformerStaleness absent, BookmarkFunc absent]
tags: [kubernetes, kep-5647, staleness, feature-gates, client-go, documentation-conflict]
---

# MonitorInformerStaleness and the handler BookmarkFunc are absent from Kubernetes v1.36.0, v1.37.0 and master source

## Observation

Two items that KEP 5647 describes are not in released Kubernetes source. The gate `MonitorInformerStaleness` appears in the KEP README and `kep.yaml` but returned zero matches in `kube_features.go` at v1.36.0 and v1.37.0, and the master `kube_features.go` was fetched again and contains zero occurrences. Client-go `known_features.go` at v1.36.0, v1.37.0 and master lists only `AtomicFIFO` and `UnlockWhileProcessingFIFO` among these gates. A GitHub code search of kubernetes/kubernetes also returned zero hits, and it did find the KEP files in kubernetes/enhancements. [[sources/research-gap-o9-cadence-and-staleness]] https://github.com/kubernetes/kubernetes/blob/v1.37.0/pkg/features/kube_features.go

The KEP also proposes a `BookmarkFunc` on `ResourceEventHandlerFuncs`. At v1.36.0 and master that struct has only `AddFunc`, `UpdateFunc` and `DeleteFunc`. A different method, `Bookmark(rv string)`, exists on the client-go `Store` interface at v1.36.0 and v1.37.0 beside `LastStoreSyncResourceVersion() string`, and a `FakeCustomStore.BookmarkFunc` exists for tests, so "BookmarkFunc exists" is true only for the test fake and not for the handler API. https://github.com/kubernetes/kubernetes/blob/v1.36.0/staging/src/k8s.io/client-go/tools/cache/controller.go

## What the KEP says about the gate

The README says `MonitorInformerStaleness` has no dependent components, "but requires a direct get to the apiserver to determine staleness every 5 seconds". https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/5647-stale-controller-handling/README.md

## What this settles

This resolves the limited search described in [[findings/kep-5647-lists-a-different-gate-shape-from-the-shipped-code-and-monitorinformerstaleness-is-not-found-in-kubernetes-source]], where gh code search had returned 404 on retry. The absence is now a direct file read at two release tags and master. Whether either item lands in a later release is not established, because the KEP still lists the gate and its beta milestone is v1.37.

## What to do

Do not tell operators to set `MonitorInformerStaleness` or to register a `BookmarkFunc` on a handler on any release up to v1.37.0. Use the per-controller gates and the counters in [[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]].

## Related

[[findings/kep-5647-is-implementable-with-a-beta-v1-37-target-and-an-open-tracking-issue-labelled-lifecycle-stale]], [[findings/stale-cache-and-double-action]], [[entities/client-go]]
