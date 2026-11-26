---
title: "Research dossier: Pitfalls and case studies"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
aliases: []
tags: [pitfalls, postmortems, finalizers, deletion, drift, ssa, crossplane, flux, argo-cd, research-dossier]
---

# Research dossier: Pitfalls and case studies

> [!NOTE]
> **Raw file:** `raw/research-pitfalls-and-case-studies.md` (sha256 prefix 9407913c2448)<br>
> **Kind:** Research dossier summarizing 11 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The author read the k8s.af index but not most of the reports it links to, could not read the Skyscanner, Reddit, Jetstack, and Spotify incident reports, and used an older Crossplane v1.20 page when the latest was v2.5. The Kubernetes finalizers and server-side apply pages were too large to read.

## Summary

The dossier describes how Kubernetes platforms fail in practice and how controller-based tools were designed or retrofitted to avoid those failures. It draws on public postmortems from Zalando, Grafana Labs, and loveholidays, on the k8s.af failure index, and on documentation from Crossplane, Argo CD, and Flux. Its main observation is that serious incidents are usually cascades, in which a small change meets a controller loop, a default, or a shared dependency such as DNS and the loop amplifies it.

Three mechanisms recur. Finalizers keep an object in Terminating until its owning controller removes them. Two writers that both believe they own a field overwrite each other indefinitely, and server-side apply field managers are the arbitration mechanism most tools now use. Deletion propagation can turn the deletion of a parent or claim into the deletion of a real cloud resource, which is why Crossplane, Argo CD, and Flux each added explicit policy knobs. The concept page [[concepts/pitfalls-and-case-studies]] consolidates the material.

## Key claims

URLs are given with each claim because no per-URL source pages were created. Every page was read through a fetch tool, and the dossier states plainly what it did and did not read.

- The k8s.af index lists dozens of public outage reports and talks from 2017 to 2023, tagged by component and impact, and it was read as an index only. Quote: "we don't hear enough real-world horror stories to learn from each other!" https://k8s.af/
- The index names a GitOps, templating, and namespace-deletion global outage at Skyscanner (2021), the Reddit Pi-Day outage (2023), Spotify deleting all its clusters through Terraform with no user impact (2019), a Jetstack admission webhook outage (2019), and a loveholidays GKE upgrade overrun (2019). These entries rest on index summaries. https://k8s.af/ See [[findings/admission-webhook-outages-are-a-recurring-failure-class]].
- The index author argues that most Zalando outages came from distributed-system cascades. Quote: "a Kubernetes API server outage should not affect running workloads, but it did". https://srcco.de/posts/kubernetes-failure-stories.html
- The source repository was archived on 2020-08-23 and moved to Codeberg, so recent incidents are underrepresented. https://github.com/hjacobs/kubernetes-failure-stories See [[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports]].
- On 2019-01-07 Zalando's product pages returned errors for over an hour after a timed-out downstream call triggered client retries that spiked DNS queries, and CoreDNS pods with a 100Mi memory limit were OOM-killed together. Contributing factors were the `ndots:5` default, Node.js not caching DNS, short connection lifetimes, no VPA on CoreDNS, and monitoring that depended on DNS inside the cluster. Quote: "It should not be possible for a single application to 'DoS' our DNS infrastructure". https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md See [[examples/zalando-s-2019-coredns-outage-turned-a-retry-storm-into-a-total-dns-failure]] and [[findings/a-retry-storm-amplified-by-ndots-and-small-coredns-memory-limits-can-take-down-cluster-dns]].
- Zalando's fixes were raising CoreDNS limits to 2000Mi, a node-local CoreDNS-plus-dnsmasq design, alerting from outside the cluster, and easier escalation. https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md See [[findings/monitoring-that-runs-inside-the-cluster-and-depends-on-cluster-dns-goes-blind-in-the-outage-it-should-report]].
- Grafana added four PriorityClasses with "medium" as the global default, and a new Cortex cluster deployed without priorities received medium and preempted production ingesters that had none. Each preempted pod was recreated by its ReplicaSet at medium priority and preempted another, which caused about 26 minutes of outage and no data loss. Quote: "we should not have made medium the default priority until we had added the high priority designation". https://grafana.com/blog/2019/07/24/how-a-production-outage-was-caused-using-kubernetes-pod-priorities/ See [[examples/grafana-s-default-priorityclass-let-a-new-cluster-preempt-every-production-ingester]] and [[findings/a-new-cluster-wide-default-must-wait-until-existing-workloads-carry-explicit-values]].
- A planned 2 to 2.5 hour loveholidays GKE upgrade from 1.10 to 1.12 ran about seven hours because of slow node drains (emptyDir, long grace periods, missing PodDisruptionBudgets), a confused managed instance group, a stuck node-pool upgrade, an Ingress bug for names of 44 to 47 characters, and an HPA that stopped reporting CPU and scaled to its maximum. Quote: "Always consult GKE release notes first before making upgrades to the cluster". https://deploy.live/blog/the-shipwreck-of-gke-cluster-upgrade/ See [[examples/loveholidays-gke-upgrade-from-1-10-to-1-12-overran-its-window-by-about-five-hours]].
- A namespace stuck in Terminating reports the condition NamespaceFinalizersRemaining, and in the Red Hat walk-through the culprit was a custom resource finalizer whose controller was not removing it. The force path edits spec.finalizers and PUTs to the namespace `/finalize` subresource through `kubectl proxy`. Quote: "A finalizer is a special metadata key that tells Kubernetes to wait until a specific condition is met". https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces See [[examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource]] and [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].
- Crossplane's `deletionPolicy` defaults to Delete and removes the cloud resource, Orphan leaves it, and `managementPolicies` (beta) give finer control and override `deletionPolicy` when set. Quote: "Crossplane never deletes a resource based on a forProvider change." https://docs.crossplane.io/v1.20/concepts/managed-resources/ See [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].
- `forProvider` is the source of truth so console edits are reverted, `initProvider` holds create-only values such as an autoscaled node group's `desiredSize`, and immutable-field edits are not applied and never trigger delete and recreate. https://docs.crossplane.io/v1.20/concepts/managed-resources/ See [[findings/crossplane-does-not-delete-and-recreate-to-change-immutable-fields]].
- The `crossplane.io/paused` annotation stops reconciliation but also blocks deletion, and the finalizer keeps the object until the external resource is gone. https://docs.crossplane.io/v1.20/concepts/managed-resources/ See [[findings/a-paused-crossplane-resource-cannot-be-deleted-until-it-is-unpaused]].
- Crossplane's external-create-pending, external-create-succeeded, and external-create-failed annotations detect "leaked resources", and the provider stops and waits for a human instead of risking duplicates. https://docs.crossplane.io/v1.20/concepts/managed-resources/ See [[findings/a-create-that-succeeds-while-the-status-write-fails-can-leak-an-external-resource]].
- Crossplane issue 5283 shows that `deletionPolicy` was announced as deprecated around v1.12 but only mentioned in a code comment and never formally deprecated, and the issue was still open and labelled a breaking API change when read. Quote: "We never actually deprecated it, just added a note that we plan to deprecate." https://github.com/crossplane/crossplane/issues/5283
- Flux's kustomize-controller corrects drift through periodic server-side apply dry runs, and an HPA changing replicas or cert-manager's cainjector writing a CRD `caBundle` is reverted every reconcile. The author recounts a SEV2 in which Flux, the HPA, and the cluster autoscaler looped. Quote: "the two controllers ping-pong indefinitely". https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/ See [[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]].
- The new `.spec.ignore` list takes JSON Pointer paths and an optional target selector. Flux strips the field from its apply payload when another SSA manager owns it, or adopts the live value when Flux is the sole owner. Changes to ignored fields do not trigger reconciliation, and `flux diff` honours the rules. The limitation is that Git changes to an ignored field are no longer applied. https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/ See [[findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied]] and [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]].
- Argo CD offers `Prune=false`, `Prune=confirm`, `Delete=false`, `Delete=confirm`, `PrunePropagationPolicy` (foreground by default), `PruneLast`, `FailOnSharedResource`, and `ApplyOutOfSyncOnly`. Quote: "Resources such as Namespaces are critical and should not be pruned without confirmation." https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/ See [[findings/unintended-deletion-through-prune]].
- Argo CD warns that `Replace=true` and `Force=true` use kubectl replace or delete and create and can cause outages. https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/ See [[findings/argo-cd-replace-and-force-sync-options-can-recreate-resources-and-cause-outages]].
- With `ServerSideApply=true`, Argo CD runs `kubectl apply --server-side --force-conflicts`, migrates client-side apply managers to the `argocd-controller` manager, offers `RespectIgnoreDifferences` so `ignoreDifferences` also applies at sync time, and warns that manually setting the tracking annotation on a shared Namespace can lead to unintended deletion. https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/
- The dossier states that nothing it read covers kro, Config Connector, ACK, or Cluster API pitfalls. See [[open-knowledge-gaps]].

## Use cases named by the dossier

The named organizations are Zalando, Grafana Labs, and loveholidays, covered in the example pages linked above, plus Skyscanner, Reddit, Spotify, Jetstack, Monzo, and Airbnb, which appear only as index summaries. The documentation-derived scenarios are Crossplane provisioning AWS RDS or EKS node groups, Flux or Argo CD running against HPA-scaled workloads and cert-manager-injected certificates, and CI that creates and deletes namespaces.

## Open questions raised by the dossier

The dossier flags that the official finalizer and server-side apply pages were not read, that several incident reports were unreadable, that Crossplane's v1.20 page may be out of date, that no source quantified how often forced finalizer removal orphans resources, that Argo CD's force-conflicts and Flux's strip-or-adopt were never compared directly, and that kro, Config Connector, ACK, and Cluster API pitfalls were absent. These are drafted as gaps in [[open-knowledge-gaps]].

## Related pages

[[concepts/pitfalls-and-case-studies]], [[concepts/finalizers]], [[concepts/server-side-apply-and-field-ownership]], [[entities/crossplane]], [[entities/flux]], [[entities/argo-cd]], [[concepts/self-healing-and-drift-detection]].
