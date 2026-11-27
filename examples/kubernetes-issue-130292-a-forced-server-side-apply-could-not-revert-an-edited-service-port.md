---
title: Kubernetes issue 130292, a forced server-side apply could not revert an edited Service port
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Kubernetes issue 130292, Argo CD issue 17717]
tags: [kubernetes, server-side-apply, service, list-map, force, argo-cd, flux]
---

# Kubernetes issue 130292, a forced server-side apply could not revert an edited Service port

## Scenario

A controller applies a Service with server-side apply and force, and someone has edited a port entry by hand. `Service.spec.ports` is a list keyed by port and protocol, so changing the port number makes the edited entry a different key. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)

## What the issues say

Kubernetes issue 130292, filed 2025-02-19 and still open, with a last comment on 2026-09-14 reading "Still an issue.", records that "the controller's attempt to correct the drift in the actual state was rejected by the API server". URL: https://github.com/kubernetes/kubernetes/issues/130292. Argo CD issue 17717, filed 2024-04-03 on v2.10.4 and still open, reports that a port number change "results in an error stating duplicate \"port name\"". URL: https://github.com/argoproj/argo-cd/issues/17717. Argo issue comments say 131147 was marked a duplicate of 130292, so 130292 is the shared upstream cause.

## Why it matters

This is the same failure class as the Flux community case in [examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port](flux-helmrelease-drift-correction-blocked-by-edited-service-port.md), and the Flux thread links both issues. It shows the limit of forcing: a forced apply fails here, so choosing force or yield does not settle the conflict. Cluster API's co-authored list slices are a second case, see [findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items](../findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items.md).

## Related

[findings/field-ownership-blocks-drift-correction](../findings/field-ownership-blocks-drift-correction.md), [decisions/force-conflicts-or-surface-them-to-humans](../decisions/force-conflicts-or-surface-them-to-humans.md), [findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership](../findings/atomic-lists-and-unmarked-crds-block-shared-field-ownership.md)
