---
title: Pitfalls and case studies
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: [failure modes, postmortems, platform pitfalls]
tags: [pitfalls, postmortems, cascades, finalizers, deletion, drift, ssa, guard-rails]
---

# Pitfalls and case studies

## What the concept covers

This page maps how Kubernetes platforms fail in practice and which guard rails controller-based tools added in response. It is a hub: the detailed mechanics live in the pages it links, and the case studies show those mechanics causing real outages. The evidence comes from public postmortems and from tool documentation, as summarized in [[sources/research-pitfalls-and-case-studies]].

## Failures are usually cascades

The postmortems agree that most serious incidents are cascades in which a small change meets a controller loop, a default, or a shared dependency, and the loop amplifies it. Zalando's 2019 outage began with a timed-out downstream call and ended with every CoreDNS pod OOM-killed, see [[examples/zalando-s-2019-coredns-outage-turned-a-retry-storm-into-a-total-dns-failure]]. Grafana's outage came from a new cluster-wide default priority that a ReplicaSet kept re-applying to each pod it recreated, see [[examples/grafana-s-default-priorityclass-let-a-new-cluster-preempt-every-production-ingester]]. The loveholidays upgrade overran because several small problems stacked, see [[examples/loveholidays-gke-upgrade-from-1-10-to-1-12-overran-its-window-by-about-five-hours]]. The general lesson is to review cluster-scoped configuration with the rigor of code, to treat defaults and retries as part of the platform surface, and to alert from outside the cluster. https://k8s.af/ indexes many more such stories.

## Three mechanisms that recur

The first mechanism is the finalizer. A delete request only sets a deletion timestamp, and the object stays until the controller that owns each finalizer removes it, so a missing or failing controller leaves the object, often a namespace, in Terminating. See [[concepts/finalizers]], [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]], and [[examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource]]. Forcing a finalizer off skips the cleanup it guarded, see [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].

The second mechanism is field ownership. When two writers both believe they own a field, such as Flux and an HPA, they overwrite each other indefinitely. Server-side apply field managers are the arbitration mechanism, and each tool resolves the conflict differently, see [[concepts/server-side-apply-and-field-ownership]], [[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]], and [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]]. Ignoring a field has its own cost, see [[findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied]].

The third mechanism is deletion propagation. Deleting a parent, a claim, or a pruned manifest can delete child objects and, with infrastructure controllers, the real cloud resource behind them. The policy knobs that make this explicit are Crossplane's `deletionPolicy` and `managementPolicies`, Argo CD's `Prune` and `Delete` options, and Flux's `prune`. See [[findings/unintended-deletion-through-prune]], [[findings/destructive-deletion-of-external-resources]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], and [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]].

## Guard rails by tool

Crossplane keeps a finalizer until the external resource is gone, reverts console edits to `forProvider`, offers `initProvider` for create-only values, never deletes and recreates for immutable fields, and halts on possible leaked creates. A paused resource cannot be deleted, see [[findings/a-paused-crossplane-resource-cannot-be-deleted-until-it-is-unpaused]]. Argo CD offers prune and delete confirmation and propagation policy, and also ships destructive options, see [[findings/argo-cd-replace-and-force-sync-options-can-recreate-resources-and-cause-outages]]. Flux added field-level ignore rules in 2026 after the coarse choice of disabling drift correction. The tool pages are [[entities/crossplane]], [[entities/argo-cd]], and [[entities/flux]].

## Platform-team practices the sources recommend

The recurring practices are to keep test environments identical to production, to read release notes and stay close to current versions before upgrades, to prefer confirmation gates on irreversible actions, to uninstall controllers only after their custom resources are deleted, and to alert on saturation signals such as an HPA at its maximum. See [[findings/a-new-cluster-wide-default-must-wait-until-existing-workloads-carry-explicit-values]] and [[findings/monitoring-that-runs-inside-the-cluster-and-depends-on-cluster-dns-goes-blind-in-the-outage-it-should-report]].

## What is not yet known

No source read covers pitfalls specific to kro, Config Connector, ACK, or Cluster API, the evidence base is mostly 2017 to 2021, and several incident reports were not read. See [[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports]] and [[open-knowledge-gaps]].

## Related pages

[[findings/admission-webhook-outages-are-a-recurring-failure-class]], [[findings/retry-storms-and-unbounded-retries]], [[concepts/self-healing-and-drift-detection]], [[concepts/reconciliation-loop]], [[concepts/owner-references-and-garbage-collection]].
