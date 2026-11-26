---
title: Flux versus Argo CD isolation, ordering, and interface according to a vendor blog
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [gitops, flux, argo-cd, comparison, multi-tenancy]
---

# Flux versus Argo CD isolation, ordering, and interface according to a vendor blog

| Dimension | [[entities/flux]] | [[entities/argo-cd]] |
|---|---|---|
| Shape | Distributed controllers, each owning one job | Centralized model |
| Tenant isolation | Namespaces and RBAC, with ServiceAccount impersonation | Projects |
| Ordering | `dependsOn` with health checks or `wait` | Sync phases (pre-sync, sync, post-sync) and waves |
| User interface | No native UI, though third-party UIs and the Flux Operator exist | Built-in UI |

[[sources/research-flux-deep-dive]]

## Reading the table

The source is a blog by Devtron, a vendor that sells a platform around Argo CD, so its claims about scale and usability are opinion. The dossier marks the UI claim as dated. The other rows agree with the project documentation that the wiki already holds, namely that Argo CD splits work into API server, repository server, and application controller and orders with hooks and waves, while Flux orders with `dependsOn`. The dossier found no neutral benchmark, and its comparison articles conflict on UI and scale, so this page does not answer the open head-to-head gap.

## Related

[[comparisons/flux-versus-argo-cd-architecture]], [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]], [[examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation]], [[findings/without-lockdown-flags-a-flux-kustomization-applies-with-the-controllers-own-identity]]
