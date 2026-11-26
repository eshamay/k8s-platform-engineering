---
title: Blast radius and privilege centralization
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, security, rbac, blast-radius]
---

# Blast radius and privilege centralization

## Observation

A control plane that manages everything concentrates authority. [[entities/ack]] limits this by running one controller per AWS service with scoped IAM. [[entities/cluster-api]] and Ænix-style fleets centralize authority in a management cluster that becomes a single point of failure. [[entities/crossplane]] applies composed resources with its own service account, so RBAC on the composite resource API is the main guardrail. [[sources/research-universal-control-plane]]

## Interpretation

Splitting controllers by scope reduces blast radius, whereas a single management cluster or a shared provider credential enlarges it. Platform teams should treat RBAC on the platform API as the security boundary, since users act through a more privileged controller. See [[concepts/composite-resource]] and [[examples/cluster-fleet-lifecycle-with-cluster-api]].

## Related

[[examples/non-container-appliances-on-the-kubernetes-api]]

## GitOps agents as powerful identities

Push pipelines hold credentials for every target, and pull agents shift that exposure but become powerful themselves. Flux counters with service-account impersonation per tenant, Config Connector centralizes cloud access on one controller identity, and the Flux D2 design removes the cluster-to-Git connection with signed OCI artifacts. [[sources/research-gitops-pull-based-delivery]] See [[comparisons/push-versus-pull-delivery]] and [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]].
