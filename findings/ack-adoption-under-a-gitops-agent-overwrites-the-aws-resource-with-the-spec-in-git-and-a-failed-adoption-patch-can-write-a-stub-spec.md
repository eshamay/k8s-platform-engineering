---
title: ACK adoption under a GitOps agent overwrites the AWS resource with the spec in git and a failed adoption patch can write a stub spec
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [ack, adoption, gitops, argo-cd, flux, overwrite, pitfall]
---

# ACK adoption under a GitOps agent overwrites the AWS resource with the spec in git and a failed adoption patch can write a stub spec

## Observation

Two open ACK issues, both filed on 2026-11-09 by gecube, describe adoption writing to the adopted AWS resource. Issue 3152 says that when an ACK CR is adopted while Argo CD or Flux delivers it, the adopted resource is overwritten with whatever spec is in git: "every spec field that is in git goes back to its value in git". The reporter says they reproduced it on iam-controller v1.11.3. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/aws-controllers-k8s/community/issues/3152

Issue 3136 says that during adoption ACK first fills the CR spec from AWS, and if that spec patch fails, "the next reconcile updates the AWS resource with the CR's stub spec". The IAM consequences the reporter lists (detached policies, a replaced trust policy) come from their code reading and were "not reproduced end to end". URL: https://github.com/aws-controllers-k8s/community/issues/3136

## Why it matters

Adoption is presented as a safe way to bring existing resources under management ([[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]]). Under a GitOps agent the git spec is authoritative, so adoption becomes an update that rewrites the real resource to match git. The existing finding on look-alike takeover covers the accidental case ([[findings/adopt-or-create-can-take-over-a-look-alike-resource]]), and Config Connector acquisition has a related side effect in [[findings/acquiring-an-existing-cloud-resource-can-strip-settings-the-custom-resource-definition-does-not-model]].

## Evidence limits

Single-reporter claims from one batch, with the second reproduced only by code reading. All open and unconfirmed by maintainers on 2026-11-26. Use them as a checklist for staged adoption, not as measured failure rates. See [[decisions/adopt-or-create-or-require-explicit-import]].

## Related

[[examples/ack-issue-3152-adoption-under-argo-cd-or-flux-overwrites-the-adopted-aws-resource-with-the-git-spec]], [[entities/ack]], [[findings/ack-adoption-semantics-are-inconsistent-across-kinds-and-adopted-resources-can-fail-to-converge]]
