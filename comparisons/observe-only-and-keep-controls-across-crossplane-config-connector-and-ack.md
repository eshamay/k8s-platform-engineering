---
title: Observe-only and keep controls across Crossplane, Config Connector, and ACK
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-managed-resource
    hash: 09ca2f9dcdc6
    ingested: 2026-11-25
  - id: research-gap-g3-crossplane-v2
    hash: 073a1fe74dec
    ingested: 2026-11-26
aliases: []
tags: [comparison, adoption, observe-only, deletion, crossplane, config-connector, ack]
---

# Observe-only and keep controls across Crossplane, Config Connector, and ACK

The three controllers answer the same two questions: how to bring an existing cloud resource under a Kubernetes object, and how to keep the cloud resource when the object goes away. They differ in how explicit the answer is. [sources/research-managed-resource](../sources/research-managed-resource.md)

| Question | [entities/crossplane](../entities/crossplane.md) | [entities/config-connector](../entities/config-connector.md) | [entities/ack](../entities/ack.md) |
|---|---|---|---|
| Import an existing resource | Explicit: set the `crossplane.io/external-name` annotation and `managementPolicies: ["Observe"]`, then promote | Implicit: a manifest whose name or ID matches the Google Cloud resource acquires it | Separate adoption feature gives full management |
| Read-only mode | `["Observe"]` | Not described in the pages read | Annotation `services.k8s.aws/read-only: "true"`, which never creates, updates, or deletes and errors if the AWS resource is missing |
| Default on object delete | Deletes the cloud resource | Deletes the cloud resource | Deletes the cloud resource |
| Keep the cloud resource | Leave Delete out of `managementPolicies`; v2 namespaced objects have no `deletionPolicy` | Annotation `cnrm.cloud.google.com/deletion-policy: abandon`, set before deleting | Retain policy (see the deletion comparison) |
| Pause | Empty policy list or `crossplane.io/paused: "true"` | Not described | Not described |

## Reading the comparison

Crossplane makes ownership a list of permitted verbs on each object, so import, read-only reference, orphan-on-delete, and pause are all configuration of one field. Config Connector chooses convenience, since matching by name acquires a resource, but the abandon annotation must be set before deletion and the pages read do not explain conflicts when two objects target one cloud resource. ACK splits observation and adoption into two features, which mirrors Crossplane's observe-versus-promote split. The risk of implicit takeover is discussed in [findings/adopt-or-create-can-take-over-a-look-alike-resource](../findings/adopt-or-create-can-take-over-a-look-alike-resource.md), and the explicit-intent design in [decisions/adopt-or-create-or-require-explicit-import](../decisions/adopt-or-create-or-require-explicit-import.md).

Flux adds a fourth layer at GitOps level. With `prune: true` a Git removal deletes the object, and the provider then deletes the cloud resource unless Delete is excluded, so the guards at both layers need to agree. See [comparisons/deletion-policies-across-gitops-and-provider-tools](deletion-policies-across-gitops-and-provider-tools.md), [comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector](ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector.md), and [comparisons/exemption-and-ignore-controls-across-tools](exemption-and-ignore-controls-across-tools.md).

## Update from the v2.5 verification pass (2026-11-26)

For Crossplane, the v2.5 docs keep `managementPolicies` in beta. `["Observe"]` imports without changing or deleting, an empty list pauses, and a list without `Delete` keeps the cloud resource when the Kubernetes object is deleted, while `deletionPolicy` survives only on legacy cluster-scoped managed resources. [sources/research-gap-g3-crossplane-v2](../sources/research-gap-g3-crossplane-v2.md) See [findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies](../findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies.md).
