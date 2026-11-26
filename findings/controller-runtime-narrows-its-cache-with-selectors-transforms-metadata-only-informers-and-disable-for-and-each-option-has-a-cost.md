---
title: controller-runtime narrows its cache with selectors, transforms, metadata-only informers, and DisableFor, and each option has a cost
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [Cache narrowing options]
tags: [cache, memory, controller-runtime, selectors, transform, mechanism]
---

# controller-runtime narrows its cache with selectors, transforms, metadata-only informers, and DisableFor, and each option has a cost

## Observation

The package source answers the question of how to cut informer memory directly. The options and the cost the source names for each are below. [[sources/research-gap-m5-informers-caches]] https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/cache/cache.go (main, read 2026-11-26)

| Option | What it does | Cost named in the source |
|---|---|---|
| `ByObject` | "restricts the cache's ListWatch to the desired fields per GVK" | The restriction must match what the reconciler reads |
| `DefaultNamespaces` and per-object `Namespaces` | Limits the ListWatch to chosen namespaces | Objects outside them are invisible to the cache |
| `DefaultLabelSelector`, `DefaultFieldSelector`, and per-object `Label` and `Field` | Limits the ListWatch by selector | Objects that do not match are invisible to the cache |
| `DefaultTransform` and per-object `Transform` | Rewrites each object as it is committed to the cache | Stripped fields are gone from every cached read |
| `TransformStripManagedFields` | The documented transform for memory, which "can lead to a significant reduction in memory usage" | A vendor statement, not a measurement |
| `DefaultDropManagedFields` and per-object `DropManagedFields` | Asks the server to omit managed fields | "Don't enable it if you read managedFields from cached objects" |
| `DefaultUnsafeDisableDeepCopy` | Skips the deep copy on cache reads | Callers can mutate shared cache objects |
| `ReaderFailOnMissingInformer` | Returns `ErrResourceNotCached` and does not lazily create an informer | A read of an unplanned type fails |
| Builder `OnlyMetadata` | Uses `PartialObjectMetadata` informers, kept in a separate `Metadata` map | Only metadata is available from the cache |
| `client.Options.Cache.DisableFor` | "Objects configured here always result in a live lookup" | Every read of the type is a live API call |

Precedence is "1. ByObject 2. DefaultNamespaces[namespace] 3. Default*". Unstructured reads bypass the cache unless `Cache.Unstructured` is true, so "unstructured objects will always result in a live lookup" by default. https://github.com/kubernetes-sigs/controller-runtime/blob/main/pkg/client/client.go

## What is not known

No memory measurements were found for any option, so the size of the savings is unquantified. The risk text for `DefaultUnsafeDisableDeepCopy` was not quoted in the dossier. See [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]] for the problem these options address, [[decisions/narrow-the-controller-cache-with-selectors-transforms-or-metadata-only-informers-or-bypass-it-for-some-types]] for the choice among them, and [[comparisons/informer-and-cache-choices-across-kro-config-connector-ack-and-cluster-api]] for how projects combine them.
