---
title: Git versus OCI as the canonical source
type: decision
status: active
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
tags: [gitops, oci, git, supply-chain]
---

# Git versus OCI as the canonical source

## Status

Open question framed by the sources, not an ADR authored by this wiki. The dossier reports that Flux's "gitless" approach and Argo CD's Git-centric documentation frame the choice differently, and it leaves the question unresolved. [[sources/research-gitops-pull-based-delivery]]

## Context

The OpenGitOps principles require a versioned, immutable store but do not mandate Git. Flux supports OCIRepository as a first-class source, and the Flux D2 reference architecture has CI build and sign artifacts and push them to a registry so clusters never connect to the Git host.

## Options

Using Git directly as the source gives the simplest mental model and a familiar review workflow, but each cluster needs network access and credentials to the Git host, and branches and remote references are mutable. Using signed OCI artifacts decouples source control from deployment control, enables keyless signing, registry RBAC, and admission policy, and removes the cluster-to-Git connection, at the cost of an extra CI build step and registry infrastructure.

## Consequences

Choosing OCI moves trust to the CI signing step and the registry, which the vendor source argues improves auditability, though that claim is not independently verified. See [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]] and [[findings/mutable-remote-references-change-what-a-commit-renders]].

## A third option from the Flux deep dive

Morgan Stanley moved the source of truth from a self-hosted Git provider to S3 buckets, which the write-up gives as an availability and compliance choice, and it lists OCI artifacts as a roadmap item. The source controller treats buckets as a first-class source kind, so the choice is among Git, OCI, and object storage, not only Git versus OCI. [[sources/research-flux-deep-dive]] See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].

## Related

[[comparisons/flux-versus-argo-cd-architecture]], [[concepts/gitops-pull-based-delivery]], [[entities/flux]]

## Evidence from primary documentation (o1 dossier)

Flux OCIRepository reconciles on digest change and verifies Cosign and Notation signatures, with keyless identity matching and a pinnable trust root. Argo CD documents `oci://` Application sources and an OCI ApplicationSet generator, and its source-integrity page covers Git GPG only, with no OCI signature verification found in the pages read. Flux's own cheatsheet frames OCI as useful when Git does not hold the final manifests. No independent security review or measured benefit of signed OCI over Git was found, and no registry rate limits were documented in the pages read. This page presents options and evidence and makes no recommendation. See [[findings/flux-verifies-cosign-and-notation-signatures-on-oci-artifacts-while-the-argo-cd-pages-read-document-no-oci-signature-verification]] and [[sources/research-gap-o1-argocd-flux-gitops]].
