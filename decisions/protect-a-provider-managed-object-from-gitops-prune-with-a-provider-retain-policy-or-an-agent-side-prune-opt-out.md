---
title: Protect a provider-managed object from GitOps prune with a provider retain policy or an agent-side prune opt-out
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [decision, prune, deletion-policy, gitops, ack, config-connector, evidence-only]
---

# Protect a provider-managed object from GitOps prune with a provider retain policy or an agent-side prune opt-out

## Status

Open. The evidence documents each control and one reporter's failure of a controller-wide setting. It does not show which layer is safer, so this page records the options with no recommendation. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

## Context

Argo CD prune and Flux prune issue ordinary Kubernetes deletes. Config Connector and ACK delete the cloud resource by default when the Kubernetes object is deleted, so a prune of a provider object can delete real infrastructure, and ACK issue 3153 says the deletion cannot be undone once the API server accepts it.

## Options

- **Provider retain on the object.** Config Connector `cnrm.cloud.google.com/deletion-policy: abandon`, which must be present before the delete, or ACK `services.k8s.aws/deletion-policy: retain` on the resource. Evidence for: the documented lookup order makes a resource annotation win. Evidence against: Config Connector issue 15930 reports abandon does not release some stuck resources, and a retained cloud resource keeps costing money.
- **Provider retain at namespace or controller level.** ACK's namespace annotation and controller flag or Helm value `deletionPolicy`. Evidence against: first match wins, so a resource annotation stamped by a chart overrides both, and issue 3153's reporter says every chart-rendered custom resource carried `deletion-policy: delete`. Issue 3154 separately says the namespace annotation is ignored in single-namespace installs. Both are single-reporter claims.
- **Agent-side opt-out on the object.** Flux `kustomize.toolkit.fluxcd.io/prune: disabled`, or Argo CD `Prune=false` or `Prune=confirm`. Evidence for: the controls are documented. Evidence against: they live in the manifest that GitOps manages, and no test of Argo CD `Prune=false` against ACK finalizers was found.
- **Agent-side protection on teardown of the whole group.** Flux Kustomization `.spec.deletionPolicy: Orphan` (the options are MirrorPrune, the default, Delete, WaitForTermination, and Orphan), Argo CD `Delete=false` or `Delete=confirm`, and `preserveResourcesOnDeletion` for ApplicationSet-created Applications. These address deleting the group, not pruning one object.

## Trade-offs

Provider-side retention survives any client that deletes the object, including `kubectl` and helm-controller upgrades, but it adds leak risk. Agent-side controls keep the cluster as the single source of truth, but they protect only against that agent. The layers can be combined, and the dossier tested none of the combinations end to end.

## Related

[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted](delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted.md), [findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain](../findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md), [findings/unintended-deletion-through-prune](../findings/unintended-deletion-through-prune.md), [examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan](../examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan.md)
