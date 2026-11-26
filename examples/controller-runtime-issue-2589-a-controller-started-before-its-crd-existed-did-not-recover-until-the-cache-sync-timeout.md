---
title: controller-runtime issue 2589, a controller started before its CRD existed did not recover until the cache sync timeout
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [controller-runtime, crd, cache, startup, issue, secondary-only]
---

# controller-runtime issue 2589, a controller started before its CRD existed did not recover until the cache sync timeout

## Scenario

Issue 2589 in kubernetes-sigs/controller-runtime reports that a controller started before its CRD existed did not recover on its own, quoted as "it won't recover by itself after applying the CRDs". The dossier summarizes that the controller recovered only when the cache sync timeout, about two minutes, restarted it. A maintainer is quoted as saying the case is "definitely something we do not test". The stale bot closed the issue on 2024-04-22 without a fix. https://github.com/kubernetes-sigs/controller-runtime/issues/2589 [[sources/research-gap-m5-informers-caches]]

## Reliability

The report is a user account and the behavior was not reproduced in the dossier, so the claim is SECONDARY-ONLY. It adds a startup-order failure to the CRD-ordering problems that GitOps tools solve with `dependsOn` and sync waves. See [[findings/custom-resources-applied-before-their-crd-exists]], [[findings/stale-restmapper-hides-newly-installed-crds]], and [[findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr]].
