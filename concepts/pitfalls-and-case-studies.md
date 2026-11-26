---
title: Pitfalls and case studies
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
  - id: research-gap-g1-outage-postmortems
    hash: 0487bcf071d6
    ingested: 2026-11-26
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: [failure modes, postmortems, platform pitfalls]
tags: [pitfalls, postmortems, cascades, finalizers, deletion, drift, ssa, guard-rails]
---

# Pitfalls and case studies

## What the concept covers

This page maps how Kubernetes platforms fail in practice and which guard rails controller-based tools added in response. It is a hub: the detailed mechanics live in the pages it links, and the case studies show those mechanics causing real outages. The evidence comes from public postmortems and from tool documentation, as summarized in [[sources/research-pitfalls-and-case-studies]].

## Failures are usually cascades

The postmortems agree that most serious incidents are cascades in which a small change meets a controller loop, a default, or a shared dependency, and the loop amplifies it. Zalando's 2019 outage began with a timed-out downstream call and ended with every CoreDNS pod OOM-killed, see [[examples/zalando-s-2019-coredns-outage-turned-a-retry-storm-into-a-total-dns-failure]]. Grafana's outage came from a new cluster-wide default priority that a ReplicaSet kept re-applying to each pod it recreated, see [[examples/grafana-s-default-priorityclass-let-a-new-cluster-preempt-every-production-ingester]]. The loveholidays upgrade overran because several small problems stacked, see [[examples/loveholidays-gke-upgrade-from-1-10-to-1-12-overran-its-window-by-about-five-hours]]. The general lesson is to review cluster-scoped configuration with the rigor of code, to treat defaults and retries as part of the platform surface, and to alert from outside the cluster. https://k8s.af/ indexes many more such stories.

Three later primary write-ups add control-plane cases. OpenAI's 2024-12-11 post-mortem describes a telemetry rollout that overwhelmed the API servers and locked engineers out, see [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]]. Jetstack's 2019 post describes a webhook that blocked a master upgrade and sent node auto-repair into a loop, see [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]]. Neon's May 2025 post describes a slow control-plane database that exhausted subnet IPs, see [[examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query]]. No primary postmortem was found for a CRD deletion cascade or an etcd quota alarm, see [[findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm]]. [[sources/research-gap-g1-outage-postmortems]]

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

## Update from the GitOps incidents dossier

The 2026-11-26 GitOps dossier adds dated, anonymous reports for the GitOps pitfalls: a self-heal run that skipped a migration hook ([[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]]), cascading deletes from Argo CD parents ([[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]]), and an Argo CD prune that stranded an ACK resource on its finalizer ([[examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone]]). It still found no named organization's postmortem and no rate for orphaning after forced finalizer removal, see [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]] and [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].


## Update from the operator loop dossier

The 2026-11-26 operator dossier found no formal organization-authored postmortem of an operator failure, and the k8s.af index has no operator-bug entry. It adds twelve issue-level cases: five reconcile-loop reports, one retry loop that grew controller memory about 25 times, two lost-event cases, and three early-Ready status bugs, plus one resync-related report. All impact figures are self-reported by issue authors. See [[findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found]], [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object]], and [[findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed]]. Source: [[sources/research-gap-g1-operator-loop-failures]].

## Update from the leaked-resources dossier

A third gap on the evidence side is partly filled. The 2026-11-26 dossier found no named postmortem or conference talk about leaked or duplicated cloud resources, and it records issue-level cases: a duplicate VPC endpoint from an ACK controller restart, duplicate Route 53 hosted zones from a two-cluster GitOps bootstrap, a reported $155 retry-loop cost in an upjet provider, and two custom resources overwriting one IAM role under `adopt-or-create`. Figures are self-reported. See [[findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import]] and [[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]]. [[sources/research-gap-g1-leaked-resources-adoption]]

## Update from the other-tool pitfalls dossier

Correction, 2026-11-26: the statement above that no source covers pitfalls specific to kro, Config Connector, ACK, or Cluster API is out of date. The 2026-11-26 dossier read first-party issues and release notes for all four. It found open reporter claims, not named-organization postmortems: kro's breaking-change gate and crash-during-deletion report ([[findings/a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd]], [[findings/a-kro-controller-crash-during-instance-deletion-can-leave-the-finalizer-and-children-according-to-a-fault-injection-report]]), Config Connector's stale deletion after failover and stuck Terminating resources ([[findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources]], [[findings/config-connector-direct-controller-resources-stick-in-terminating-when-a-parent-is-deleted-first-and-abandon-does-not-release-them]]), ACK's ownership, adoption, and prune issues ([[findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource]], [[findings/pruning-an-ack-custom-resource-deletes-the-aws-resource-and-the-namespace-retain-annotation-is-ignored-in-single-namespace-installs]]), and Cluster API's webhook window and breaking changes ([[findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation]], [[findings/cluster-api-v1-14-0-lists-four-breaking-changes-and-schedules-v1beta1-and-docker-removals]]). The evidence caveat is in [[findings/no-named-organization-postmortem-was-found-for-kro-config-connector-ack-or-cluster-api]]. [[sources/research-gap-g1-other-tool-pitfalls]]

## Update from the Config Connector and ACK dossier

The 2026-11-26 o4 dossier adds first-party documentation and release-note evidence for the tools this page called thin: Config Connector's stuck-deletion design document and known-issues page, kro v0.10.0 fixes and the alpha orphan policy, ACK's two documentation sites, and Cluster API's troubleshooting page. No named-organization postmortem exists for any of the four. See [[findings/a-config-connector-design-document-says-a-child-whose-parent-was-deleted-first-sticks-on-dependencynotfound-and-no-read-documentation-describes-ordered-teardown]], [[findings/config-connector-known-issues-record-a-webhook-tls-race-before-1-134-1-and-direct-reconciler-regressions-in-1-132-0-and-1-134-0]], [[findings/kro-v0-10-0-fixes-partial-apply-cleanup-and-duplicate-rgd-identities-and-pull-request-1445-adds-an-alpha-deletion-policy-behind-an-off-by-default-gate]], [[findings/the-ack-old-and-new-documentation-sites-disagree-on-adoption-maturity-and-cross-namespace-references-default-to-blocked-from-2026-10-08-releases]], and [[findings/a-flux-waitfortermination-deletion-policy-gives-up-at-spec-timeout-and-lets-the-kustomization-be-deleted-while-a-provider-resource-may-still-be-finalizing]]. [[sources/research-gap-o4-config-connector-ack]]
