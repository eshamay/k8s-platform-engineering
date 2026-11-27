---
title: Argo CD, ACK, Config Connector, and Cluster API identify resources by group and kind and resolve the version separately
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m5-informers-caches
    hash: 1a6a4969c0c2
    ingested: 2026-11-26
aliases: [GVK keying across tools]
tags: [gvk, argo-cd, config-connector, ack, cluster-api, mechanism]
---

# Argo CD, ACK, Config Connector, and Cluster API identify resources by group and kind and resolve the version separately

## Observation

None of the four tools uses the version as part of a resource's identity. [sources/research-gap-m5-informers-caches](../sources/research-gap-m5-informers-caches.md)

| Tool | Identity | Where the version comes from |
|---|---|---|
| Argo CD | Tracking annotation carries name, namespace, group and kind, for example `my-app:apps/Deployment:default/my-deployment`. The gitops-engine `ResourceKey` has Group, Kind, Namespace and Name. | The cluster cache watches the preferred version of each API resource, and live objects are converted to the target manifest's version before comparison |
| Config Connector | One controller per CRD group and kind, registered by a controller that watches CRDs | `Version: k8s.GetVersionFromCRD(crd)`, and re-registered kinds update the schema in place |
| ACK | Resource manager factories in a map keyed by `GroupKind().String()` | Each controller is built `For(rd.EmptyRuntimeObject())` of one version |
| Cluster API | v1beta2 references carry `apiGroup` and `kind` and no version | Looked up from the CRD's contract labels, choosing the latest compatible version, with an error if the labels are missing |

Sources: https://github.com/argoproj/argo-cd/blob/master/docs/user-guide/resource_tracking.md (latest release v3.6.3, 2026-11-24), https://github.com/argoproj/gitops-engine/blob/master/pkg/utils/kube/kube.go, https://github.com/argoproj/gitops-engine/blob/master/pkg/cache/cluster.go, https://github.com/GoogleCloudPlatform/k8s-config-connector/blob/master/pkg/controller/registration/registration_controller.go, https://github.com/aws-controllers-k8s/runtime/blob/main/pkg/runtime/service_controller.go, https://github.com/kubernetes-sigs/cluster-api/blob/main/api/core/v1beta2/common_types.go, and https://github.com/kubernetes-sigs/cluster-api/blob/main/internal/contract/version.go.

## Consequence in source

For Argo CD, a manifest that uses a different API version of the same group and kind maps to the same resource key, so an API version change does not by itself orphan or mis-prune a resource. A change of group or kind would. This is a reading of the source and not a documented guarantee.

## Not settled

How each tool behaves when a served CRD version is removed, and whether pruning or orphaning results, is UNVERIFIED. No behavioral documentation or tests were read for any of the five projects, and removal of a served version that the preferred-version listing depends on was not tested. See [findings/removed-beta-gvks-break-pinned-manifests-and-clients](removed-beta-gvks-break-pinned-manifests-and-clients.md), [concepts/gvk-and-gvr](../concepts/gvk-and-gvr.md), and [examples/argo-cd-tracks-resources-by-group-kind-namespace-and-name-so-an-api-version-change-keeps-the-same-key](../examples/argo-cd-tracks-resources-by-group-kind-namespace-and-name-so-an-api-version-change-keeps-the-same-key.md).
