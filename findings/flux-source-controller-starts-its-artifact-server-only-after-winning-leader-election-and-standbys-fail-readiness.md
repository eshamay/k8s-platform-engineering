---
title: Flux source-controller starts its artifact server only after winning leader election and standbys fail readiness
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o2-flux-internals
    hash: 866650ffd3aa
    ingested: 2026-11-26
aliases: []
tags: [flux, source-controller, leader-election, artifacts, scale, mechanism]
---

# Flux source-controller starts its artifact server only after winning leader election and standbys fail readiness

## Observation

Source-controller serves the artifacts it builds from an in-process HTTP file server, and `main.go` starts that server only after the manager is elected leader. The comment in the source reads "Start the artifact server if running as leader." A readiness check named `leader-election` returns "manager is not the leader" on every replica that has not won the lease, so a standby never becomes ready. The Flux sharding page states the consequence: "Standby source-controller replicas stay not ready by design, because only the leader serves artifacts." Extra replicas therefore provide failover and no added capacity. [[sources/research-gap-o2-flux-internals]]

URLs: https://github.com/fluxcd/source-controller/blob/main/main.go, https://github.com/fluxcd/pkg/blob/main/runtime/probes/probes.go, and https://github.com/fluxcd/website/blob/main/content/en/flux/installation/configuration/sharding.md, all read on `main` on 2026-11-26.

## Sharding interaction

When a watch label selector is set, the leader election ID is derived from it with `leaderelection.GenerateID(leaderElectionId, watchOpts.LabelSelector)`. Each shard instance therefore elects its leader independently, and a shard does not compete with the default instance for the same lease. The source also notes that the process is presumed to terminate when it loses leadership.

## What the dossier did not settle

During a restart the Service has no ready endpoint until the new pod is elected and the server starts, and dependents then fail fetches until artifacts exist again. That sequence follows from the code, but the dossier did not read how dependent controllers behave in that window. The default lease, renew, and retry durations were not captured. Treat both as open questions, tracked in [[open-knowledge-gaps]].

## Related

[[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]], [[findings/the-stock-flux-source-controller-keeps-artifacts-in-an-emptydir-with-one-minute-retention-so-a-restart-rebuilds-them]], [[decisions/single-replica-versus-leader-election]], [[findings/objects-that-leave-a-flux-shard-keep-stale-artifacts-on-the-old-source-controller]], [[entities/flux]]
