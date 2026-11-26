---
title: "Supply GitOps secrets from a destination-cluster operator, a generation plugin, or controller-side SOPS"
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [gitops, secrets, sops, argo-cd, flux, decision]
---

# Supply GitOps secrets from a destination-cluster operator, a generation plugin, or controller-side SOPS

## Status

Open. This page sets out options with evidence from [[sources/research-gap-o1-argocd-flux-gitops]] and makes no recommendation, because the dossier found no independent comparison of failure modes.

## Context

A GitOps agent that renders manifests from Git has to get secret values into the cluster without committing them in plaintext. The two projects' documentation takes different positions, and each position changes where plaintext can exist.

## Options

**Destination-cluster operator.** Sealed Secrets, External Secrets Operator, the Secrets Store CSI Driver or Vault Secrets Operator populate the Secret in the target cluster. Argo CD's page says "We strongly recommend the former, as it is more secure and provides a better user experience". Flux publishes a Sealed Secrets guide in which "The sealed secrets can be decrypted only by the controller running in your cluster".

**Manifest-generation plugin.** A plugin such as argocd-vault-plugin injects values while the repository server renders. Argo CD documents that "Argo CD stores generated manifests in plaintext in its Redis cache", that updates couple to syncs, and that the approach is incompatible with Rendered Manifests. The project will keep supporting it but will "not prioritize new features or improvements that solely support this style of secret management."

**Controller-side SOPS.** Flux kustomize-controller decrypts SOPS-encrypted files with age, OpenPGP, cloud KMS or OpenBao or Vault keys, with secret-less KMS authentication available. "The only supported encryption provider is SOPS", and `metadata`, `kind` and `apiVersion` must stay in plaintext. Argo CD's page does not mention SOPS or ksops, so its position there is UNVERIFIED.

## Evidence gaps

No failure-mode collection for Flux SOPS and no independent security comparison was found. The Argo CD page was read at `main` on 2026-11-26.

## Related

[[findings/argo-cd-recommends-destination-cluster-secret-operators-and-warns-that-generation-plugins-cache-plaintext-manifests-in-redis]], [[findings/flux-kustomize-controller-decrypts-only-sops-and-requires-metadata-kind-and-apiversion-to-stay-in-plaintext]], [[entities/argo-cd]], [[entities/flux]]
