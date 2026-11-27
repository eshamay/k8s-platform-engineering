---
title: Without lockdown flags a Flux Kustomization applies with the controller's own identity
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-flux-deep-dive
    hash: e640ec8046bc
    ingested: 2026-11-25
aliases: []
tags: [pitfall, flux, multi-tenancy, rbac, privilege]
---

# Without lockdown flags a Flux Kustomization applies with the controller's own identity

## Observation

The dossier states that without lockdown a Kustomization applies as the controller's cluster-admin identity, so any tenant who can commit a manifest to a repository that Flux watches can create anything the controller can. Flux addresses this with ServiceAccount impersonation through `spec.serviceAccountName`, plus the controller flags `--default-service-account`, `--no-cross-namespace-refs=true`, and `--no-remote-bases=true`. Objects without a named account use the `default` account in the tenant's namespace, and if that account has no RBAC, deployments fail. The reference repository adds that sharing a namespace between tenants breaks the isolation guarantees. [sources/research-flux-deep-dive](../sources/research-flux-deep-dive.md)

## Why it matters

Flux centralizes privilege in one controller, so the flags are the only thing standing between a tenant repository and cluster-wide write access. Argo CD addresses isolation with Projects, according to a vendor comparison. The dossier found no incident report of tenant escalation, so the risk rests on documentation.

## Mitigations

Start the controllers with all three lockdown flags, give every tenant a ServiceAccount with a namespace-scoped Role, and keep one tenant per namespace.

## Related

[examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation](../examples/flux-multi-tenancy-repository-isolates-tenants-with-service-account-impersonation.md), [findings/blast-radius-and-privilege-centralization](blast-radius-and-privilege-centralization.md), [findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions](anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions.md), [entities/flux](../entities/flux.md)
