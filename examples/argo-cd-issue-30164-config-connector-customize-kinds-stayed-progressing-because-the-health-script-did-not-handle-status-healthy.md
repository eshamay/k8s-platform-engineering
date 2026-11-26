---
title: Argo CD issue 30164 Config Connector customize kinds stayed Progressing because the health script did not handle status.healthy
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: [Argo CD issue 30164]
tags: [argo-cd, config-connector, health-check, lua, wildcard]
---

# Argo CD issue 30164 Config Connector customize kinds stayed Progressing because the health script did not handle status.healthy

## Scenario

On 2026-10-13 a reporter running Config Connector 1.157.0 opened Argo CD issue 30164. Kinds in the `customize.core.cnrm.cloud.google.com` group "stay `Progressing` forever in Argo CD, even when the operator reports them healthy." The issue is closed. URL: https://github.com/argoproj/argo-cd/issues/30164. [[sources/research-gap-o3-gitops-provider-managed]]

## Mechanism

Argo CD matches Config Connector kinds with one wildcard script for the `cnrm.cloud.google.com` group. The `customize.core.cnrm.cloud.google.com` kinds report health through `status.healthy` and carry a default `observedGeneration` of 0, while the generic branch of the script waits on a `Ready` condition and a current `observedGeneration`. The current script has a branch for these kinds. Because Argo CD advances sync waves only when the current wave is healthy, a kind stuck in Progressing blocks later waves, and the sync-waves documentation warns "it may be that the app can never get to healthy."

## Lesson

A group-wide health script is a single point of mismatch for every kind in the group. See [[findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves]] and [[examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration]]. The issue is the reporter's account of an anonymous cluster, not an outage write-up.

## Related

[[entities/argo-cd]], [[entities/config-connector]], [[findings/generic-gitops-agents-cannot-judge-custom-resource-health]]
