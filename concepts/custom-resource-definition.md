---
title: Custom Resource Definition (CRD)
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-gvk-and-gvr
    hash: 5c56bb1e05a8
    ingested: 2026-11-25
  - id: research-custom-resource-definition
    hash: 6c26f7f89147
    ingested: 2026-11-25
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
aliases: [CRD]
tags: [api-machinery]
---

# Custom Resource Definition (CRD)

## Definition

A CRD is a Kubernetes API object that registers a new resource type with the API server at runtime. Once it exists, the built-in kube-apiserver serves a REST endpoint for the new kind with the same machinery as built-in types: list and watch, RBAC, audit logging, schema validation, and storage in etcd. No new server is needed. [[sources/krm-platform-vocabulary]] [[sources/research-custom-resource-definition]]

The official documentation says that "Custom resources can appear and disappear in a running cluster through dynamic registration, and cluster admins can update custom resources independently of the cluster itself." It frames the CRD as the low-effort extension path, and the aggregated API server as the more flexible path that must be run and operated separately. See [[decisions/crd-versus-aggregated-api]].

## Why it matters

CRDs are the extension point that makes the [[concepts/universal-control-plane]] idea practical. Every [[concepts/provider]], [[concepts/composite-resource]], and operator in this wiki ships one or more CRDs. A CRD alone only stores data, so the usual pattern is a custom resource plus a custom controller that reconciles the declared `spec` and reports progress in `status`. That pairing is the [[concepts/operator-pattern]]. See [[examples/postgrescluster-custom-resource-reconciled-into-child-objects]].

## Conventions that well-built CRDs follow

The API conventions set the contract. `spec` is desired state and `status` is observation, written through the `/status` subresource, as covered in [[concepts/spec-status-split]]. Conditions follow a standard structure of type, status, reason, message, and observedGeneration, as covered in [[concepts/conditions]]. `resourceVersion` provides optimistic concurrency, with conflicts returned as HTTP 409, and `generation` with `observedGeneration` shows whether a controller has seen the latest spec. The conventions also describe static, admission, and controller-assigned defaulting, and recommend ownerReferences for garbage collection and avoiding cross-namespace references. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md.

## Schema, pruning, and validation

The schema is a structural OpenAPI v3 schema, a constrained subset that enables validation, pruning, and defaulting. Plain OpenAPI says what must be present but not what is forbidden, so unknown fields used to leak into storage. Under a structural schema, undeclared fields are dropped unless `x-kubernetes-preserve-unknown-fields` is set, which surprises authors who forget to declare a field. See [[findings/unknown-fields-are-silently-pruned-under-structural-schemas]].

CEL rules in `x-kubernetes-validations` express cross-field checks inside the schema, such as `self.minReplicas <= self.maxReplicas`, which removes many reasons to run a validating webhook. Validation ratcheting lets stricter validation arrive without invalidating existing objects. See [[comparisons/cel-validation-rules-versus-validating-webhooks]], [[decisions/validate-with-cel-rules-or-a-validating-webhook]], and [[examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks]]. CRDs also support the `/status` and `/scale` subresources, finalizers, and additional printer columns, as shown in [[examples/hpa-scales-any-workload-through-the-scale-subresource]].

## Versions and discovery

A CRD can list several versions, exactly one of which is the storage version while any number can be served, and conversion is either `None` or a webhook. A CRD adds new kinds and resources to the existing API server, and it gives each Kind exactly one resource, unlike subresources such as `Scale`. The generated GVK and GVR become known to clients through API discovery, so a CRD installed at runtime can be invisible to a client whose mapper was built earlier. [[sources/research-gvk-and-gvr]] See [[concepts/crd-versioning-and-storage-migration]], [[comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke]], [[concepts/api-discovery-and-restmapper]], [[findings/stale-restmapper-hides-newly-installed-crds]], and [[findings/crd-version-removal-without-migration-strands-stored-objects]].

The sources report that moving stored objects to a new storage version is now handled by the built-in StorageVersionMigration API, described as GA in Kubernetes v1.37 by a single blog extract that this wiki has not yet cross-checked.

## CRDs as a product surface

Crossplane XRDs and kro ResourceGraphDefinitions generate CRDs from a simpler schema, so platform teams publish their own APIs. See [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]] and [[examples/xrd-and-rgd-declare-platform-gvks]].

## Operational weight

The sources agree that CRDs are cheap to add but carry real cost. Each CRD adds API surface, etcd data, webhook dependencies, and upgrade-ordering concerns. The main pitfalls recorded in this wiki are listed below.

- A down conversion webhook can stall garbage collection: [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].
- Admission webhook outages recur as a failure class: [[findings/admission-webhook-outages-are-a-recurring-failure-class]].
- Helm does not upgrade or delete CRDs: [[findings/helm-does-not-upgrade-or-delete-crds]].
- Very large CRDs break client-side apply: [[findings/large-crds-exceed-the-client-side-apply-annotation-limit]].
- Deleting a CRD removes its custom resources: [[findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind]].
- Custom resources applied before their CRD fail: [[findings/custom-resources-applied-before-their-crd-exists]].
- Shared etcd and watch-cache load grows with object counts: [[findings/etcd-scale-limits-of-the-shared-store]] and [[examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd]].

Authoritative numbers for the maximum CRDs per cluster or custom resources per type were not found, and a secondary source cites an object size limit near 1.5 MB. Those limits are tracked as a gap in [[open-knowledge-gaps]]. Third-party CRD code also adds failure points, and custom resource data needs the same etcd backup as everything else.

## Related

[[concepts/gvk-and-gvr]], [[concepts/admission-webhooks-and-cel]], [[concepts/operator-pattern]], [[concepts/finalizers]]

## CRD count as an architectural cost of one type per external resource

The managed resource dossier shows the cost of generating one CRD per external resource type: multi-cloud provider sets imply roughly 2,000 CRDs, with more than 4 MiB of API server memory per CRD and discovery requests for about 300 group-versions, and Upbound and the Crossplane community reported slow or unresponsive API servers at several hundred CRDs. [[sources/research-managed-resource]] See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]].
