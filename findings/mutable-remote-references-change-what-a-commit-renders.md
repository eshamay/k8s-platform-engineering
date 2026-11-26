---
title: Mutable remote references change what a commit renders
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, gitops, helm, kustomize, immutability]
---

# Mutable remote references change what a commit renders

## Observation

Argo CD's best-practices page recommends pinning Helm and Kustomize remote references to tags or SHAs instead of `HEAD`. If a manifest points at a moving reference, the same Git commit can render differently over time, so a new sync can change the cluster even though nobody changed the repository. [[sources/research-gitops-pull-based-delivery]]

## Why it matters

The OpenGitOps principle that desired state is versioned and immutable assumes that a revision identifies exactly one desired state. A floating remote reference breaks that assumption silently: the audit trail in Git no longer explains what was deployed, and a re-sync can look like an unexplained drift or an unplanned upgrade.

## Mitigation

Pin remote bases and charts to immutable tags or commit SHAs, and update them through reviewed commits. Using signed OCI artifacts, as in [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]], pushes the same idea further.

## Related

[[concepts/gitops-pull-based-delivery]], [[entities/argo-cd]], [[decisions/git-versus-oci-as-the-canonical-source]]
