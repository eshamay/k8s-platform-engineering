---
title: "A managed resource without Delete in its management policies is removed from Kubernetes but its cloud resource stays"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [pitfall, crossplane, management-policies, garbage-collection, deletion, orphan]
---

# A managed resource without Delete in its management policies is removed from Kubernetes but its cloud resource stays

## Observation

When a cascade deletes a managed resource (MR) object, whether the cloud resource goes too depends on `managementPolicies`, not on the owner reference. In crossplane-runtime `main`, the managed reconciler's delete path deletes the external resource only if `observation.ResourceExists && policy.ShouldDelete()`. Otherwise it unpublishes connection details and removes the finalizer. The v2.5 docs say the same for policy sets without Delete: "Crossplane doesn't delete the external resource when deleting the managed resource." The dossier read no v2 page that explains the interaction between `managementPolicies` and owner-reference cascade, so this behavior is derived from source, not from documentation. [[sources/research-gap-g3-crossplane-v2]] https://github.com/crossplane/crossplane-runtime/blob/main/pkg/reconciler/managed/reconciler.go

## The surrounding v2 rules

- A namespaced XR can compose only resources in its own namespace, and composed resources carry a controller owner reference with `blockOwnerDeletion: true`.
- XR deletion defaults to Background: Crossplane stops managing the XR and Kubernetes garbage-collects the composed resources. `kubectl delete --cascade=orphan` or `--cascade=foreground`, and Argo CD foreground propagation, make Crossplane ignore the deletion policy and emit a warning event.
- The composition `deletionPolicy` (Background, Foreground, Pipeline) is alpha, behind `--enable-function-controlled-deletion`, new in v2.5.0.
- v2.4.0 restricted the XR garbage collector so it "only deletes resources whose controller reference points back to the XR".
- v2.5.0 blocks a function from making a namespaced XR compose a cluster-scoped resource by setting `metadata.namespace`.

## Why it matters

A composition that sets `managementPolicies` without Delete on its composed MRs (for example Observe-only references to a database owned by another team) will lose the Kubernetes objects when the XR is deleted but leave the cloud resources running. That is the intended orphan behavior for a retained database and a leak for everything else. Not covered by the dossier: deletion of a namespace while the provider is down, and any special handling of Observe-only MRs inside compositions.

## Mitigations

Decide per composed resource whether it is meant to outlive the XR, and record that in the Composition. Check the policy list before deleting an XR. See [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]], [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]], [[concepts/owner-references-and-garbage-collection]], [[concepts/managed-resource]], and [[entities/crossplane]].

## Docs status as of the m2 pass

The v2.5 docs say `managementPolicies` is beta, on by default, and provider-dependent, that the default policy grants full control, and that without `Delete` Crossplane "doesn't delete the external resource when deleting the managed resource", with an empty list pausing the resource. They do not connect the policies to the owner-reference cascade, and the managed reconciler source was not re-read in this pass, so the claim above still rests on the earlier source read. Composition functions do not run on composite deletion, and the alpha deletion policy (Background by default, Foreground, Pipeline) needs `--enable-function-controlled-deletion`. Docs on namespaced composite scope rules and Observe-only handling in compositions were not found. [[sources/research-gap-m2-ownership-gc]]
