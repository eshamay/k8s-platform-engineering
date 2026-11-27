---
title: ACK service controllers scope their cache by namespace and label selector and trigger on generation changes
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: []
tags: [ack, cache, namespaces, label-selector, generation]
---

# ACK service controllers scope their cache by namespace and label selector and trigger on generation changes

## Scenario

Each ACK service controller is a separate binary. The S3 controller's `main.go`, read as a representative service controller, sets the cache `DefaultNamespaces` from `--watch-namespace` and `DefaultLabelSelector: watchSelectors` from `--watch-selectors`. A separate cache for the cross-account resource map runs only when more than one namespace is watched. https://github.com/aws-controllers-k8s/s3-controller/blob/main/cmd/controller/main.go [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

The runtime defaults to one concurrent reconcile per resource, with a per-kind override, described as "The default maximum number of concurrent reconciles for a resource reconciler." The event filter is `GenerationChangedPredicate`, and the reconciler comment says "By default only spec/generation changes trigger a reconcile", with annotation changes added when ignore-field-drift is on. https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/config/config.go and https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/reconciler.go

Because of the generation filter, the 10-hour "resync" is a `RequeueAfter` and not an informer replay, which is why it is the only path that notices an out-of-band AWS change ([findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack](../findings/the-word-resync-names-three-different-mechanisms-in-client-go-kro-and-ack.md)). Only one representative service controller was read, so the pattern for all ACK controllers is inferred. See [comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api](../comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api.md), [examples/ack-ships-one-controller-per-aws-service](ack-ships-one-controller-per-aws-service.md), and [entities/ack](../entities/ack.md).
