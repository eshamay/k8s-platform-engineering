---
title: "Flux verifies Cosign and Notation signatures on OCI artifacts while the Argo CD pages read document no OCI signature verification"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o1-argocd-flux-gitops
    hash: 3a5f956bbd5a
    ingested: 2026-11-26
aliases: []
tags: [oci, flux, argo-cd, supply-chain, cosign]
---

# Flux verifies Cosign and Notation signatures on OCI artifacts while the Argo CD pages read document no OCI signature verification

## Observation on the Flux side

The OCIRepository specification says a new Artifact is archived "When the current OCIRepository digest differs from the latest fetched digest". `.spec.verify` can "enable the verification of Cosign or Notation signatures", keyless verification matches identities through `.matchOIDCIdentity` ("a list of OIDC identity matchers"), and a Sigstore trust root can be pinned with `.spec.verify.trustedRootSecretRef`. URL: https://github.com/fluxcd/source-controller/blob/main/docs/spec/v1/ocirepositories.md. The Flux OCI cheatsheet says "Using OCI instead of Git is particularly useful when the Git repository doesn't contain the final Kubernetes manifests." URL: https://github.com/fluxcd/website/blob/main/content/en/flux/cheatsheets/oci-artifacts.md. Dossier-verified from docs at `main` on 2026-11-26, not a pinned release tag. [sources/research-gap-o1-argocd-flux-gitops](../sources/research-gap-o1-argocd-flux-gitops.md)

## Observation on the Argo CD side

Argo CD "supports using OCI (Open Container Initiative) images as an application source", expects "an OCI image to contain a single layer", and can display standard OCI metadata annotations. URL: https://github.com/argoproj/argo-cd/blob/main/docs/user-guide/oci.md. It also has an OCI ApplicationSet generator that polls every 3 minutes by default. The source-integrity page covers Git commit signatures only: "Verify that commits in the source repository are correctly signed with one of the blessed GnuPG keys." URL: https://github.com/argoproj/argo-cd/blob/main/docs/user-guide/source-integrity-git-gpg.md.

## What the dossier did not find

The dossier searched the Argo CD OCI page for sign, cosign and verify and found nothing, and a filtered listing of `docs/user-guide` showed only `gpg-verification.md`, `oci.md` and `source-integrity-git-gpg.md`. That makes OCI signature verification in Argo CD UNVERIFIED as a documented feature, which is a statement about the pages read and not proof that it is absent from the code. No independent security review, measured benefit of signed OCI over Git, or registry rate-limit documentation was found for either tool.

## Related

[decisions/git-versus-oci-as-the-canonical-source](../decisions/git-versus-oci-as-the-canonical-source.md), [examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts](../examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts.md), [entities/flux](../entities/flux.md), [entities/argo-cd](../entities/argo-cd.md)
