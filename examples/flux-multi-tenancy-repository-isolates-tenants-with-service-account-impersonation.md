---
title: The Flux multi-tenancy repository isolates tenants with service account impersonation
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [use-case, flux, multi-tenancy, rbac, fleet-repo]
---

# The Flux multi-tenancy repository isolates tenants with service account impersonation

## Scenario

A platform team runs shared clusters for several application teams. The team wants each tenant to deploy only through Git, without being able to create cluster-wide objects or touch another tenant's namespace. The `fluxcd/flux2-multi-tenancy` repository is the Flux project's reference design for this case. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## How it works

The fleet repository has three top-level directories. `clusters/` holds per-cluster entry points, `policies/` holds cluster-wide resources, and `tenants/` holds the tenant provisioning manifests that the cluster administrators own. Each tenant's own repository uses a `base/` directory plus `staging/` and `production/` overlays.

Isolation comes from the controllers. The administrators start them with `--no-cross-namespace-refs=true`, `--no-remote-bases=true`, and `--default-service-account=default`. A Kustomization or HelmRelease then reconciles as a ServiceAccount in the tenant's namespace, named in `spec.serviceAccountName` or falling back to that namespace's `default` account. Kubernetes RBAC on that account decides what the tenant's repository may create, so a manifest that tries to create a ClusterRole or write into another namespace is rejected by the API server. The repository states that sharing a namespace between tenants is not supported because it would break these guarantees.

## Caveats

If the default ServiceAccount has no RBAC, tenant deployments fail until a Role and RoleBinding are added. The example also limits image automation to staging, which is discussed in [examples/flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging](flux-image-automation-commits-new-tags-to-git-and-the-reference-repo-limits-it-to-staging.md).

## Related

[entities/flux](../entities/flux.md), [findings/without-lockdown-flags-a-flux-kustomization-applies-with-the-controllers-own-identity](../findings/without-lockdown-flags-a-flux-kustomization-applies-with-the-controllers-own-identity.md), [findings/blast-radius-and-privilege-centralization](../findings/blast-radius-and-privilege-centralization.md), [comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog](../comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog.md), [examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding](morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding.md)
