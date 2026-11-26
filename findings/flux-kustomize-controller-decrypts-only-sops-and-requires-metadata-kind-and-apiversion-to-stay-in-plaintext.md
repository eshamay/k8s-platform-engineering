---
title: "Flux kustomize-controller decrypts only SOPS and requires metadata, kind, and apiVersion to stay in plaintext"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [flux, secrets, sops, kustomize-controller]
---

# Flux kustomize-controller decrypts only SOPS and requires metadata, kind, and apiVersion to stay in plaintext

## Observation

The Kustomization specification says "The only supported encryption provider is SOPS", and decryption runs inside kustomize-controller. Encrypted files must "leave `metadata`, `kind` or `apiVersion` in plain text". Supported key types in the dossier's reading are age, OpenPGP, cloud KMS and OpenBao or Vault, and a service-account-based mode is described as "used for secret-less authentication with KMS services from cloud providers". URL: https://github.com/fluxcd/kustomize-controller/blob/main/docs/spec/v1/kustomizations.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [[sources/research-gap-o1-argocd-flux-gitops]]

## The guides

The Flux SOPS guide says "SOPS encrypted secrets are designed to be consumed by kustomize-controller", and notes that the decryption key is needed even to verify the file because of the SOPS message authentication code. URL: https://github.com/fluxcd/website/blob/main/content/en/flux/guides/mozilla-sops.md. Flux also publishes a Sealed Secrets guide, which says "The sealed secrets can be decrypted only by the controller running in your cluster". URL: https://github.com/fluxcd/website/blob/main/content/en/flux/guides/sealed-secrets.md.

## Limits of the evidence

The dossier did not collect failure modes for Flux SOPS systematically, so no incident or pitfall beyond the documented plaintext-field requirement is claimed here.

## Related

[[entities/flux]], [[findings/argo-cd-recommends-destination-cluster-secret-operators-and-warns-that-generation-plugins-cache-plaintext-manifests-in-redis]], [[decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops]]
