---
title: Status client, RBAC, and conflict mistakes in operators
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-spec-status-split
    hash: 598e6132ea4f
    ingested: 2026-11-25
aliases: []
tags: [pitfall, status-subresource, rbac, kubebuilder, conflicts]
---

# Status client, RBAC, and conflict mistakes in operators

## Observation

A Kubebuilder-oriented walkthrough names four recurring implementation mistakes. The first is using the normal client instead of `Status()`, so status writes are silently ignored or hit the wrong endpoint. The second is forgetting RBAC on the `/status` subresource, because the subresource has its own authorization scope. The third is not retrying on resourceVersion conflicts, and the fourth is not setting `ObservedGeneration`, which leaves consumers unable to tell stale status from fresh. Its guidance is "Always use the status client for status updates." A second tutorial adds that `Update()` needs a current resourceVersion and is conflict-prone, `Patch()` is safer, and spec and status should not be updated in the same call. [[sources/research-spec-status-split]] URLs: https://oneuptime.com/blog/post/2026-02-09-operator-status-subresource/view and https://www.farishuskovic.dev/blog/k8s-status-subresource/.

## Why it matters

These mistakes produce controllers that appear to work in a test cluster with broad permissions and fail under least-privilege RBAC. Both sources are tutorials, so the list reflects practitioner advice and not measured incident data.

## Mitigations

Grant the controller `update` and `patch` on `<resource>/status` explicitly, route all status writes through one helper, retry on conflict, and set `observedGeneration` in the same helper. See [[findings/missing-observedgeneration-hides-stale-status]], [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]], and [[entities/kubebuilder]].

## Related

[[concepts/spec-status-split]], [[concepts/operator-pattern]], [[entities/controller-runtime]]
