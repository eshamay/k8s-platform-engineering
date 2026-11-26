---
title: Argo CD ships built-in Lua health checks for Config Connector, ACK, Crossplane, Upbound, kro, and Cluster API kinds, and an unhealthy provider object blocks later sync waves
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [argo-cd, health, lua, config-connector, ack, crossplane, sync-waves]
---

# Argo CD ships built-in Lua health checks for Config Connector, ACK, Crossplane, Upbound, kro, and Cluster API kinds, and an unhealthy provider object blocks later sync waves

## Observation

Argo CD's health documentation says that "Since CRDs do not follow a consistent or standardized status format", health for custom resources needs a script. The `resource_customizations` directory on master (Argo CD v3.6.3, read 2026-11-26) now ships such scripts for whole provider groups: wildcard directories for `cnrm.cloud.google.com`, `services.k8s.aws`, `crossplane.io`, and `upbound.io`, plus directories for `kro.run` and five `cluster.x-k8s.io` kinds (Cluster, Machine, MachineDeployment, MachineHealthCheck, and MachinePool). URL: https://github.com/argoproj/argo-cd/tree/master/resource_customizations

The scripts show exactly which condition maps to which health state. The ACK script maps `ACK.Terminal=True` to Degraded, `Ready=False` to Progressing, `Ready=True` to Healthy, and no conditions to Progressing with the message "Waiting for resource to be ready" (last commit on the path 2026-08-05). The Config Connector script returns Progressing while `observedGeneration` is stale, Healthy on reason `UpToDate`, Degraded on `UpdateFailed` or `DependencyNotFound`, and Suspended on `DependencyNotReady`. The Crossplane script marks `Synced=False` or `LastAsyncOperation=False` Degraded and treats a list of kinds that never carry conditions as Healthy, with the comment "Kinds that never get status.conditions, so would sit at Progressing forever." The dossier read the Crossplane script only through its first Healthy branch, and did not read the Cluster API scripts. [[sources/research-gap-o3-gitops-provider-managed]]

## Why it matters for ordering

Argo CD advances sync waves only when the current wave is synced and healthy, and it prunes in reverse wave order. Its documentation warns that an unhealthy resource in an early wave means "the app can never get to healthy." A provider object whose status the script mishandles therefore blocks every later wave, which is the cost of matching a whole group by wildcard. Argo CD issue 30164 is the dated case, see [[examples/argo-cd-issue-30164-config-connector-customize-kinds-stayed-progressing-because-the-health-script-did-not-handle-status-healthy]].

## What it changes

Older wiki text says Argo CD needs a custom Lua check for provider kinds, as the Crossplane integration guide prescribes. The current tree ships those checks for the four provider groups above, so a team on a recent Argo CD should check the shipped script before writing its own. The structural limit remains: ACK conditions have no `observedGeneration`, so the shipped ACK script can report Healthy before the controller sees a spec change, see [[examples/argo-cd-issue-30373-the-built-in-ack-health-check-reports-healthy-before-the-controller-observes-a-spec-change]].

## Related

[[findings/generic-gitops-agents-cannot-judge-custom-resource-health]], [[entities/argo-cd]], [[comparisons/health-and-readiness-models-across-tools]], [[examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration]], [[findings/flux-judges-provider-managed-resources-through-kstatus-or-cel-health-check-expressions-and-its-cel-cheatsheet-lists-crossplane-but-not-config-connector-or-ack]]
