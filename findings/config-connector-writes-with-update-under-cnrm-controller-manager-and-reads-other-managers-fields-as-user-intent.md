---
title: Config Connector writes with Update under cnrm-controller-manager and reads other managers' fields as user intent
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [Config Connector server-side apply behavior]
tags: [config-connector, server-side-apply, field-manager, managed-fields, verified]
---

# Config Connector writes with Update under cnrm-controller-manager and reads other managers' fields as user intent

## Observation

Config Connector's lifecycle handler writes with `Update` and `Status().Update` under the field owner `cnrm-controller-manager`, for example `r.Client.Status().Update(ctx, u, client.FieldOwner(r.fieldOwner))`. It does not apply with server-side apply. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md) URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/lifecyclehandler/handler.go (commit 793f18c).

## How it reads other managers

A helper in `pkg/k8s/managedfields.go` builds the set of spec fields owned by other managers and skips any entry whose manager is `cnrm-controller-manager` (`if managedFieldEntry.Manager == ControllerManagedFieldManager`). Fields set by a GitOps tool are therefore treated as user intent. A second helper in `pkg/k8s/meta.go` sends a tiny server-side apply patch under the manager `supports-ssa` only to make the API server create `managedFields` metadata. The latest release read was v1.162.0, published 2026-11-23.

## What is not known

The public Config Connector documentation page on installation returned empty content, and no other public page about field managers or behavior under Argo CD or Flux was found, so every statement here rests on source and on contributor issues. See [examples/config-connector-issue-11689-a-collaborator-proposal-says-argo-cd-needs-server-side-apply-for-config-connector-s-crds](../examples/config-connector-issue-11689-a-collaborator-proposal-says-argo-cd-needs-server-side-apply-for-config-connector-s-crds.md).

## Why it matters

Because Config Connector writes with Update, a GitOps tool's Flux Strip rule does not apply to it, and the Flux Adopt rule is the one that fits. This is an inference from the Flux specification and the source, not a statement by either project. See [decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field](../decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field.md).

## Related

[entities/config-connector](../entities/config-connector.md), [comparisons/ssa-conflict-policy-across-tools](../comparisons/ssa-conflict-policy-across-tools.md), [concepts/server-side-apply-and-field-ownership](../concepts/server-side-apply-and-field-ownership.md)
