---
title: Push versus pull delivery
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-gitops-pull-based-delivery
    hash: 335ba8f50b2b
    ingested: 2026-11-25
aliases: []
tags: [gitops, push, pull, security]
---

# Push versus pull delivery

| Dimension | Push pipeline | Pull agent |
|---|---|---|
| Where it runs | Outside the target, on a CI or build server | In or next to the target environment |
| Credentials | Holds credentials for every environment it deploys to | Needs only read access to the source and uses in-cluster identity to write |
| Compromise impact | A breached build server exposes all targets | A breached agent exposes its own target, though the agent is itself powerful |
| Reconciliation | Typically one-shot (`kubectl apply`, `helm upgrade`) | Continuous: observes actual state and re-applies desired state |
| Fit with OpenGitOps | Fails the "continuously reconciled" principle if it never re-checks | Meets all four principles |

[[sources/research-gitops-pull-based-delivery]]

## Reading the table

INNOQ makes the security case that a push CI server accumulates credentials for all targets, whereas a pull operator "executes the deployment process exclusively within the target environment." The comparison is not absolute. The dossier notes that Flux supports push-style triggers (webhooks) alongside pull, and that the pull agent becomes a powerful identity, which Flux counters with per-tenant service-account impersonation and which the Flux D2 design counters by removing cluster-to-Git connections. See [[findings/blast-radius-and-privilege-centralization]] and [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]].

## Related

[[concepts/gitops-pull-based-delivery]], [[examples/gitops-agent-on-non-kubernetes-targets]]
