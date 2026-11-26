---
title: "Argo CD recommends destination-cluster secret operators and warns that generation plugins cache plaintext manifests in Redis"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, secrets, redis, external-secrets]
---

# Argo CD recommends destination-cluster secret operators and warns that generation plugins cache plaintext manifests in Redis

## Observation

Argo CD's secret-management page describes two families of approach and says "We strongly recommend the former, as it is more secure and provides a better user experience", meaning secrets populated on the destination cluster by an operator. It names Sealed Secrets, External Secrets Operator, the Secrets Store CSI Driver and Vault Secrets Operator as examples. URL: https://github.com/argoproj/argo-cd/blob/main/docs/operator-manual/secret-management.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [[sources/research-gap-o1-argocd-flux-gitops]]

## Cautions about manifest-generation plugins

The page cautions against plugins that inject secret values while Argo CD renders manifests, such as argocd-vault-plugin, for three stated reasons. "Argo CD stores generated manifests in plaintext in its Redis cache". Secret updates become coupled to syncs. The approach is "incompatible with the 'Rendered Manifests' pattern". The project says it will keep supporting generation-based secrets but "we will not prioritize new features or improvements that solely support this style of secret management."

## What was not found

The page does not mention SOPS or ksops at all (the dossier searched the file for both), so Argo CD's documented position on ksops or native SOPS is UNVERIFIED from this source. Flux takes the opposite stance for SOPS, see [[findings/flux-kustomize-controller-decrypts-only-sops-and-requires-metadata-kind-and-apiversion-to-stay-in-plaintext]]. The options are laid out in [[decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops]].

## Related

[[entities/argo-cd]], [[concepts/gitops-pull-based-delivery]]
