---
title: ACK issue 3152 adoption under Argo CD or Flux overwrites the adopted AWS resource with the git spec
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: [ACK issue 3152]
tags: [ack, adoption, gitops, argo-cd, flux, iam-controller]
---

# ACK issue 3152 adoption under Argo CD or Flux overwrites the adopted AWS resource with the git spec

## Scenario

On 2026-11-09 gecube opened ACK community issue 3152, reproduced per the reporter on iam-controller v1.11.3. A CR is adopted onto an existing AWS resource while Argo CD or Flux delivers the CR from git. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/aws-controllers-k8s/community/issues/3152

## What the reporter says

The adopted AWS resource is overwritten with the spec in git: "every spec field that is in git goes back to its value in git". Anything configured on the real resource that git does not state is lost to the git version. The companion issue 3136 says that if the adoption spec patch fails, the next reconcile writes the CR's stub spec to AWS.

## Status and limits

Open when read, one reporter, no maintainer confirmation. See [[findings/ack-adoption-under-a-gitops-agent-overwrites-the-aws-resource-with-the-spec-in-git-and-a-failed-adoption-patch-can-write-a-stub-spec]].

## Related

[[entities/ack]], [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]]
