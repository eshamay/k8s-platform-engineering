---
title: GitOps agent on non-Kubernetes targets
type: example
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [gitops, pull-model, vms, custom-operators]
---

# GitOps agent on non-Kubernetes targets

## Scenario

INNOQ argues that GitOps is a pattern and does not require Kubernetes. The same agent-plus-Git model can manage virtual machines or cloud infrastructure if a custom operator runs inside the target environment, reads the desired state from Git, and reconciles it. [[sources/research-gitops-pull-based-delivery]]

## Why the pull model still applies

The article's security case does not depend on Kubernetes. A central build server that pushes needs credentials for every environment, so compromising it is a broad event. A pull operator runs inside the target and executes deployments only there, which keeps credentials local. INNOQ warns that the hard part is continuous reconciliation, not fetching YAML, and that operators in cloud environments must receive tightly scoped permissions.

## Caveat

The source is a consultancy article describing a design. The dossier did not find a named production deployment of this approach. Compare with Kubernetes-native versions in [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]].

## Related

[[comparisons/push-versus-pull-delivery]], [[concepts/gitops-pull-based-delivery]], [[concepts/universal-control-plane]]
