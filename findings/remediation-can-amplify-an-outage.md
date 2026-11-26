---
title: Automatic remediation can amplify an outage
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-self-healing-and-drift-detection
    hash: 98edc2019c6b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, cluster-api, remediation, safety]
---

# Automatic remediation can amplify an outage

## Observation

If many machines look unhealthy at the same moment, the cause is often shared, such as a network partition or a bad control-plane component, and replacing them all would make things worse. Cluster API's `maxUnhealthy` setting on a MachineHealthCheck short-circuits remediation when too many machines look bad. The source is the v0.4 Cluster API book, so current details may differ. [[sources/research-self-healing-and-drift-detection]] See [[examples/cluster-api-machine-health-check-replaces-failed-nodes]].

## Interpretation

Self-healing needs a brake as well as an accelerator. The same idea appears elsewhere as `prune` being off by default in Argo CD, a `warn` mode in Flux before `enabled`, and `Observe` in Crossplane. See [[decisions/staged-adoption-of-automated-drift-correction]] and [[findings/retry-storms-and-unbounded-retries]].

## Caveat

The dossier found no postmortem of an outage made worse by remediation. See [[open-knowledge-gaps]].

## Related

[[entities/cluster-api]], [[concepts/self-healing-and-drift-detection]]
