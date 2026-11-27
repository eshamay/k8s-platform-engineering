---
title: ACK deletion policy resolves from the resource, then the namespace, then the controller default, and one reporter says chart-stamped delete defeats a controller-wide retain
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [ack, deletion-policy, retain, prune, gitops, helm]
---

# ACK deletion policy resolves from the resource, then the namespace, then the controller default, and one reporter says chart-stamped delete defeats a controller-wide retain

## Observation

The current ACK documentation says the controller deletes the underlying AWS resource first and then the Kubernetes custom resource. The policy values are `delete` (the default) and `retain`. The lookup order is the resource annotation `services.k8s.aws/deletion-policy`, then the namespace annotation `{service}.services.k8s.aws/deletion-policy`, then the controller default. Quote: "The first match wins, so resource annotations override namespace annotations, which override the controller default." URL: https://aws-controllers-k8s.github.io/docs/guides/deletion-policy/ (documentation copyright 2026). The older, deprecated documentation site lists the controller flag `--deletion-policy` and the Helm value `deletionPolicy` for the controller-wide default. [sources/research-gap-o3-gitops-provider-managed](../sources/research-gap-o3-gitops-provider-managed.md)

Flux prune and Argo CD prune issue an ordinary Kubernetes DELETE, so this default applies to a pruned ACK object. The connection is made by composing documented behaviors, with one exception: ACK issue 3153 (open, 2026-11-09, iam-controller v1.11.3) reports Argo CD prune, Flux Kustomization prune, and a helm-controller upgrade all led to AWS deletion, with reproduction scripts. The same issue says a controller-wide `deletionPolicy: retain` did not protect the resources because every chart-rendered custom resource carried `deletion-policy: delete`. Under the first-match rule that outcome is what the documentation predicts: a resource-level annotation set by a chart beats the controller default. The reporter's account is SECONDARY-ONLY, and no maintainer reply was present when the dossier read it.

## Practical reading

A controller-wide retain is the weakest layer in the lookup order. A team that wants protection under GitOps has to look at what the chart or manifest stamps on each resource, set `retain` at the resource level, or add an agent-side opt-out such as the Flux per-object `prune: disabled` annotation or Argo CD `Prune=false`. See [decisions/protect-a-provider-managed-object-from-gitops-prune-with-a-provider-retain-policy-or-an-agent-side-prune-opt-out](../decisions/protect-a-provider-managed-object-from-gitops-prune-with-a-provider-retain-policy-or-an-agent-side-prune-opt-out.md).

## Not settled

No maintainer confirmed issue 3153, and the separate claim in issue 3154 that the namespace annotation is ignored in single-namespace installs is covered in [findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs](pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs.md). No test of Argo CD `Prune=false` against ACK finalizers was found.

## Related

[entities/ack](../entities/ack.md), [examples/ack-issue-3153-pruning-a-custom-resource-from-git-deletes-the-aws-resource-irreversibly](../examples/ack-issue-3153-pruning-a-custom-resource-from-git-deletes-the-aws-resource-irreversibly.md), [comparisons/deletion-policies-across-gitops-and-provider-tools](../comparisons/deletion-policies-across-gitops-and-provider-tools.md), [findings/unintended-deletion-through-prune](unintended-deletion-through-prune.md)
