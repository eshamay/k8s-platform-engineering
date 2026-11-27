---
title: Flux tracks composite resources through its inventory and kstatus or CEL health checks and documents no owner-reference recipe or kro guidance
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [flux, crossplane, kro, composite-resources, health-checks, kstatus, cel]
---

# Flux tracks composite resources through its inventory and kstatus or CEL health checks and documents no owner-reference recipe or kro guidance

## Observation

Flux treats a Crossplane composite or a kro instance as an arbitrary custom resource. Kustomization `healthChecks` accept built-in kinds, Flux kinds, and "Custom resources that are compatible with kstatus", and `wait: true` checks everything the Kustomization applied. `.spec.healthCheckExprs` supplies CEL `current` and `failed` expressions per apiVersion and kind, where the kind is optional, "only the group portion of `apiVersion` is used for matching", and the version is ignored. `dependsOn` makes a Kustomization wait for the dependency to be Ready and, when `wait` or `healthChecks` is set, for its health checks to pass, and `dependsOn[].readyExpr` can replace the built-in readiness check with CEL. The CEL cheatsheet carries Crossplane examples, such as `iam.aws.crossplane.io/v1beta1`. [sources/research-gap-o2-flux-internals](../sources/research-gap-o2-flux-internals.md)

URLs: https://github.com/fluxcd/kustomize-controller/blob/main/docs/spec/v1/kustomizations.md and https://github.com/fluxcd/website/blob/main/content/en/flux/cheatsheets/cel-healthchecks.md, read on `main` on 2026-11-26.

## Tracking and pruning

Prune garbage-collects "Kubernetes objects that were previously applied on the cluster but are missing from the current source revision", which Flux records in an inventory of what it applied. Resources that Crossplane or kro create from a composite are not applied by Flux, so they sit outside that inventory. The dossier infers that Flux therefore needs no ownerReference or tracking annotation on composites of the kind Argo CD needs, but no Flux page states this, so the inference is UNVERIFIED. Compare [examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd](../examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd.md).

## kro

For kro, instances carry built-in conditions such as `InstanceManaged`, `ResourcesReady`, and `Ready`, and custom conditions can be declared. kro "stamps `lastTransitionTime` and `observedGeneration`" on them (https://github.com/kubernetes-sigs/kro/blob/main/website/docs/docs/concepts/rgd/04-status-conditions.md). No Flux document or kro document about using the two together was found, so official guidance for Flux with kro instances is absent from what was read.

## Why it matters

Readiness is the main interface between Flux and a composite. The kstatus path depends on the composite's controller writing `observedGeneration`, see [examples/flux2-issue-5855-kstatus-saw-crossplane-resources-without-a-ready-condition-as-ready-and-maintainers-recommended-an-observedgeneration-cel-expression](../examples/flux2-issue-5855-kstatus-saw-crossplane-resources-without-a-ready-condition-as-ready-and-maintainers-recommended-an-observedgeneration-cel-expression.md).

## Related

[findings/premature-readiness-in-kstatus-based-tools](premature-readiness-in-kstatus-based-tools.md), [entities/kstatus](../entities/kstatus.md), [entities/flux](../entities/flux.md), [entities/kro](../entities/kro.md), [entities/crossplane](../entities/crossplane.md)
