---
title: Flux judges provider-managed resources through kstatus or CEL health-check expressions, and its CEL cheatsheet lists Crossplane but not Config Connector or ACK
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [flux, health, kstatus, cel, config-connector, ack, crossplane]
---

# Flux judges provider-managed resources through kstatus or CEL health-check expressions, and its CEL cheatsheet lists Crossplane but not Config Connector or ACK

## Observation

Flux has no per-provider health logic. A Kustomization's `healthChecks` accept built-in kinds, Flux kinds, and "Custom resources that are compatible with [kstatus]". `wait: true` checks everything the Kustomization applied. For kinds that are not kstatus compatible, `healthCheckExprs` supply CEL expressions named `current`, `inProgress`, and `failed`, and `dependsOn[].readyExpr` gates a dependency on a custom expression. The Kustomization itself is kstatus compatible and reports reasons including `PruneFailed` and `HealthCheckFailed`. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/ (read 2026-11-26, Flux v2.10.1). [[sources/research-gap-o3-gitops-provider-managed]]

A provider's own `Ready` condition therefore reaches Flux through kstatus's generic condition handling and not through provider-specific code. The Flux CEL healthcheck cheatsheet lists a library that includes `Crossplane`, and searching the page text for `cnrm`, `ACK`, and `services.k8s.aws` found nothing. URL: https://fluxcd.io/flux/cheatsheets/cel-healthchecks/. The absence is a statement about the page as scraped.

## Not settled

The dossier did not read how kstatus treats ACK's `ACK.Terminal` condition, which has abnormal-true polarity, so whether a terminal ACK error reads as failed or as ready under Flux is open. Flux's treatment of Cluster API objects was also not read. The Flux issue 5855 example already shows the premature-ready race for kinds with no initial `Ready` condition, see [[examples/flux2-issue-5855-kstatus-saw-crossplane-resources-without-a-ready-condition-as-ready-and-maintainers-recommended-an-observedgeneration-cel-expression]]. No Flux documentation specific to Config Connector or ACK was found.

## Contrast with Argo CD

Argo CD ships per-group Lua scripts, which gives it provider-aware mappings and the matching risk of a wildcard script mishandling a kind, see [[findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves]]. Flux's approach has no such risk and no such help.

## Related

[[entities/flux]], [[entities/kstatus]], [[findings/flux-tracks-composite-resources-through-its-inventory-and-kstatus-or-cel-health-checks-and-documents-no-owner-reference-recipe-or-kro-guidance]], [[findings/premature-readiness-in-kstatus-based-tools]], [[comparisons/health-and-readiness-models-across-tools]]
