---
title: Flux versus Argo CD architecture
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [gitops, flux, argo-cd, architecture]
---

# Flux versus Argo CD architecture

| Dimension | [entities/flux](../entities/flux.md) | [entities/argo-cd](../entities/argo-cd.md) |
|---|---|---|
| Shape | Set of composable controllers (source, kustomize, helm, notification, image automation), each watching its own custom resources | Three components: API server, repository server, application controller |
| Rendering | Source controllers fetch artifacts, and the Kustomize and Helm controllers render and apply | A separate repository server caches Git and renders manifests |
| Interface | Kubernetes API and custom resources | API server serving UI, CLI, and CI systems, with RBAC and webhooks |
| Default polling | Kustomizations reconcile every 5 minutes (concepts page) | About 120 seconds plus up to 60 seconds of jitter |
| Multi-tenancy | Service-account impersonation per Kustomization | Handled through the API server's RBAC and credentials |
| Sources | Git, OCI, Helm repositories, buckets | Git-centric in the documentation read |
| Hooks and ordering | `dependsOn` and health assessment | PreSync, Sync, PostSync hooks |

[sources/research-gitops-pull-based-delivery](../sources/research-gitops-pull-based-delivery.md)

## Reading the table

The dossier's framing is that Argo CD is more centralized and UI-driven with rendering split into its own service, while Flux is "controllers all the way down." Interval figures differ by tool and version and neither is guaranteed, so check current versions before quoting them. For behavior under drift and prune, see [comparisons/flux-versus-argo-cd-drift-and-prune-defaults](flux-versus-argo-cd-drift-and-prune-defaults.md). For ordering, see [comparisons/ordering-models-flux-argo-cd-kro-crossplane](ordering-models-flux-argo-cd-kro-crossplane.md).

## Additional evidence from the Flux deep dive

The Flux deep dive adds that Flux isolates tenants with ServiceAccount impersonation and namespaces, orders with `dependsOn`, and has no native UI, while a vendor blog says Argo CD uses Projects and sync phases. See [comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog](flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog.md). [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## Related

[concepts/gitops-pull-based-delivery](../concepts/gitops-pull-based-delivery.md), [decisions/git-versus-oci-as-the-canonical-source](../decisions/git-versus-oci-as-the-canonical-source.md)

## Update from the o1 dossier, 2026-11-26

Documentation-level differences now read from primary files: ApplicationSet generators and the hub model on the Argo CD side ([findings/applicationset-generators-have-documented-limits-matrix-takes-two-children-nesting-is-once-and-pull-request-polling-defaults-to-30-minutes](../findings/applicationset-generators-have-documented-limits-matrix-takes-two-children-nesting-is-once-and-pull-request-polling-defaults-to-30-minutes.md)), per-cluster controller sets, `--no-cross-namespace-refs` and ServiceAccount impersonation on the Flux side. No neutral head-to-head exists, see [findings/no-neutral-benchmark-or-cncf-comparison-of-argo-cd-and-flux-was-found-so-the-comparison-rests-on-each-project-s-own-documentation](../findings/no-neutral-benchmark-or-cncf-comparison-of-argo-cd-and-flux-was-found-so-the-comparison-rests-on-each-project-s-own-documentation.md). [sources/research-gap-o1-argocd-flux-gitops](../sources/research-gap-o1-argocd-flux-gitops.md)
