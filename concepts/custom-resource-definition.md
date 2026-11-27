---
title: Custom Resource Definition (CRD)
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gap-g3-k8s-and-controller-runtime
    hash: 2b4e3378c119
    ingested: 2026-11-26
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
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
aliases: [CRD]
tags: [api-machinery]
---

# Custom Resource Definition (CRD)

## Definition

A CRD is a Kubernetes API object that registers a new resource type with the API server at runtime. Once it exists, the built-in kube-apiserver serves a REST endpoint for the new kind with the same machinery as built-in types: list and watch, RBAC, audit logging, schema validation, and storage in etcd. No new server is needed. [sources/krm-platform-vocabulary](../sources/krm-platform-vocabulary.md) [sources/research-custom-resource-definition](../sources/research-custom-resource-definition.md)

The official documentation says that "Custom resources can appear and disappear in a running cluster through dynamic registration, and cluster admins can update custom resources independently of the cluster itself." It frames the CRD as the low-effort extension path, and the aggregated API server as the more flexible path that must be run and operated separately. See [decisions/crd-versus-aggregated-api](../decisions/crd-versus-aggregated-api.md).

## Why it matters

CRDs are the extension point that makes the [concepts/universal-control-plane](universal-control-plane.md) idea practical. Every [concepts/provider](provider.md), [concepts/composite-resource](composite-resource.md), and operator in this wiki ships one or more CRDs. A CRD alone only stores data, so the usual pattern is a custom resource plus a custom controller that reconciles the declared `spec` and reports progress in `status`. That pairing is the [concepts/operator-pattern](operator-pattern.md). See [examples/postgrescluster-custom-resource-reconciled-into-child-objects](../examples/postgrescluster-custom-resource-reconciled-into-child-objects.md).

## Conventions that well-built CRDs follow

The API conventions set the contract. `spec` is desired state and `status` is observation, written through the `/status` subresource, as covered in [concepts/spec-status-split](spec-status-split.md). Conditions follow a standard structure of type, status, reason, message, and observedGeneration, as covered in [concepts/conditions](conditions.md). `resourceVersion` provides optimistic concurrency, with conflicts returned as HTTP 409, and `generation` with `observedGeneration` shows whether a controller has seen the latest spec. The conventions also describe static, admission, and controller-assigned defaulting, and recommend ownerReferences for garbage collection and avoiding cross-namespace references. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md.

## Schema, pruning, and validation

The schema is a structural OpenAPI v3 schema, a constrained subset that enables validation, pruning, and defaulting. Plain OpenAPI says what must be present but not what is forbidden, so unknown fields used to leak into storage. Under a structural schema, undeclared fields are dropped unless `x-kubernetes-preserve-unknown-fields` is set, which surprises authors who forget to declare a field. See [findings/unknown-fields-are-silently-pruned-under-structural-schemas](../findings/unknown-fields-are-silently-pruned-under-structural-schemas.md).

CEL rules in `x-kubernetes-validations` express cross-field checks inside the schema, such as `self.minReplicas <= self.maxReplicas`, which removes many reasons to run a validating webhook. Validation ratcheting lets stricter validation arrive without invalidating existing objects. See [comparisons/cel-validation-rules-versus-validating-webhooks](../comparisons/cel-validation-rules-versus-validating-webhooks.md), [decisions/validate-with-cel-rules-or-a-validating-webhook](../decisions/validate-with-cel-rules-or-a-validating-webhook.md), and [examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks](../examples/cel-rule-replaces-a-validating-webhook-for-cross-field-checks.md). CRDs also support the `/status` and `/scale` subresources, finalizers, and additional printer columns, as shown in [examples/hpa-scales-any-workload-through-the-scale-subresource](../examples/hpa-scales-any-workload-through-the-scale-subresource.md).

## Versions and discovery

A CRD can list several versions, exactly one of which is the storage version while any number can be served, and conversion is either `None` or a webhook. A CRD adds new kinds and resources to the existing API server, and it gives each Kind exactly one resource, unlike subresources such as `Scale`. The generated GVK and GVR become known to clients through API discovery, so a CRD installed at runtime can be invisible to a client whose mapper was built earlier. [sources/research-gvk-and-gvr](../sources/research-gvk-and-gvr.md) See [concepts/crd-versioning-and-storage-migration](crd-versioning-and-storage-migration.md), [comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke](../comparisons/crd-conversion-strategies-none-webhook-and-hub-and-spoke.md), [concepts/api-discovery-and-restmapper](api-discovery-and-restmapper.md), [findings/stale-restmapper-hides-newly-installed-crds](../findings/stale-restmapper-hides-newly-installed-crds.md), and [findings/crd-version-removal-without-migration-strands-stored-objects](../findings/crd-version-removal-without-migration-strands-stored-objects.md).

The sources report that moving stored objects to a new storage version is now handled by the built-in StorageVersionMigration API, which is GA and on by default in Kubernetes v1.37 and is triggered by a user-created object and not automatically. [sources/research-gap-g3-k8s-and-controller-runtime](../sources/research-gap-g3-k8s-and-controller-runtime.md) See [concepts/crd-versioning-and-storage-migration](crd-versioning-and-storage-migration.md) and [findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object](../findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object.md).

## CRDs as a product surface

Crossplane XRDs and kro ResourceGraphDefinitions generate CRDs from a simpler schema, so platform teams publish their own APIs. See [comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators](../comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators.md) and [examples/xrd-and-rgd-declare-platform-gvks](../examples/xrd-and-rgd-declare-platform-gvks.md).

## Operational weight

The sources agree that CRDs are cheap to add but carry real cost. Each CRD adds API surface, etcd data, webhook dependencies, and upgrade-ordering concerns. The main pitfalls recorded in this wiki are listed below.

- A down conversion webhook can stall garbage collection: [findings/a-down-conversion-webhook-can-stall-garbage-collection](../findings/a-down-conversion-webhook-can-stall-garbage-collection.md).
- Admission webhook outages recur as a failure class: [findings/admission-webhook-outages-are-a-recurring-failure-class](../findings/admission-webhook-outages-are-a-recurring-failure-class.md).
- Helm does not upgrade or delete CRDs: [findings/helm-does-not-upgrade-or-delete-crds](../findings/helm-does-not-upgrade-or-delete-crds.md).
- Very large CRDs break client-side apply: [findings/large-crds-exceed-the-client-side-apply-annotation-limit](../findings/large-crds-exceed-the-client-side-apply-annotation-limit.md).
- Deleting a CRD removes its custom resources: [findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind](../findings/deleting-a-crd-deletes-every-custom-resource-of-that-kind.md).
- Custom resources applied before their CRD fail: [findings/custom-resources-applied-before-their-crd-exists](../findings/custom-resources-applied-before-their-crd-exists.md).
- Shared etcd and watch-cache load grows with object counts: [findings/etcd-scale-limits-of-the-shared-store](../findings/etcd-scale-limits-of-the-shared-store.md) and [examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd](../examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd.md).

No official limit on CRDs per cluster or custom resources per type exists in the SIG Scalability thresholds, which cover built-in types only, and the evidence is issue reports ([findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit](../findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit.md)). The roughly 1.5 MB object figure matches etcd's 1.5 MiB default request limit ([findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default](../findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default.md)). The open question is tracked in [open-knowledge-gaps](../open-knowledge-gaps.md). Third-party CRD code also adds failure points, and custom resource data needs the same etcd backup as everything else.

## Related

[concepts/gvk-and-gvr](gvk-and-gvr.md), [concepts/admission-webhooks-and-cel](admission-webhooks-and-cel.md), [concepts/operator-pattern](operator-pattern.md), [concepts/finalizers](finalizers.md)

## CRD count as an architectural cost of one type per external resource

The managed resource dossier shows the cost of generating one CRD per external resource type: multi-cloud provider sets imply roughly 2,000 CRDs, with more than 4 MiB of API server memory per CRD and discovery requests for about 300 group-versions, and Upbound and the Crossplane community reported slow or unresponsive API servers at several hundred CRDs. [sources/research-managed-resource](../sources/research-managed-resource.md) See [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](../findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md).

## Additions from the admission and CRD dossier

CEL rules in a CRD schema are bounded by a static estimate, so unbounded lists and strings need `maxItems` and `maxLength` ([findings/an-unbounded-list-or-string-makes-the-cel-cost-estimate-reject-a-crd-rule-until-maxitems-and-maxlength-are-set](../findings/an-unbounded-list-or-string-makes-the-cel-cost-estimate-reject-a-crd-rule-until-maxitems-and-maxlength-are-set.md)). Cluster API labels its CRDs with contract versions and migrates storage versions itself ([findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration](../findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration.md)), Config Connector ships 883 CRD files ([findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind](../findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind.md)), ACK ships CRDs per service chart ([findings/ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found](../findings/ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found.md)), and Backstage reads only the CRDs named in its configuration ([findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd](../findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd.md)). [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)
