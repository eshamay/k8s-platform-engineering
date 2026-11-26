---
title: Flux versus Argo CD architecture
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [gitops, flux, argo-cd, architecture]
---

# Flux versus Argo CD architecture

| Dimension | [[entities/flux]] | [[entities/argo-cd]] |
|---|---|---|
| Shape | Set of composable controllers (source, kustomize, helm, notification, image automation), each watching its own custom resources | Three components: API server, repository server, application controller |
| Rendering | Source controllers fetch artifacts, and the Kustomize and Helm controllers render and apply | A separate repository server caches Git and renders manifests |
| Interface | Kubernetes API and custom resources | API server serving UI, CLI, and CI systems, with RBAC and webhooks |
| Default polling | Kustomizations reconcile every 5 minutes (concepts page) | About 120 seconds plus up to 60 seconds of jitter |
| Multi-tenancy | Service-account impersonation per Kustomization | Handled through the API server's RBAC and credentials |
| Sources | Git, OCI, Helm repositories, buckets | Git-centric in the documentation read |
| Hooks and ordering | `dependsOn` and health assessment | PreSync, Sync, PostSync hooks |

[[sources/research-gitops-pull-based-delivery]]

## Reading the table

The dossier's framing is that Argo CD is more centralized and UI-driven with rendering split into its own service, while Flux is "controllers all the way down." Interval figures differ by tool and version and neither is guaranteed, so check current versions before quoting them. For behavior under drift and prune, see [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]]. For ordering, see [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Additional evidence from the Flux deep dive

The Flux deep dive adds that Flux isolates tenants with ServiceAccount impersonation and namespaces, orders with `dependsOn`, and has no native UI, while a vendor blog says Argo CD uses Projects and sync phases. See [[comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog]]. [[sources/research-flux-deep-dive]]

## Related

[[concepts/gitops-pull-based-delivery]], [[decisions/git-versus-oci-as-the-canonical-source]]
