# Research dossier: Pitfalls and case studies

Research date: 2026-11-25

## Overview

This topic covers how Kubernetes platforms fail in practice, and how controller-based tooling is designed (or retrofitted) to avoid those failures. The sources fall into two groups. The first is public postmortems and failure-story collections: Zalando, Grafana Labs, loveholidays and the k8s.af index. These show that most serious incidents are cascades. A small change interacts with a controller loop, a default, or a shared dependency such as DNS, and the loop amplifies it. The second group is tool documentation: Crossplane, Argo CD and Flux. These describe the guard rails each project added after users hit the same classes of problem. Those problems are accidental deletion, controllers fighting over a field, and resources that can never finish deleting.

Three mechanical ideas run through nearly all of it. First, finalizers: a deletion request only sets a deletion timestamp, and the object stays until every finalizer is removed by the controller that owns it. If that controller is gone, broken, or waiting on an external system, the object (often a namespace) sits in Terminating. Second, field ownership and reconciliation: when two writers (Flux and an HPA, Flux and cert-manager, Crossplane and a cloud autoscaler) both believe they own a field, they overwrite each other forever. Server-side apply field managers are the mechanism most tools now use to arbitrate. Third, deletion propagation: deleting a parent or a claim can delete child objects and, with infrastructure controllers, the real cloud resource behind them. Policy knobs (deletionPolicy, managementPolicies, Prune=false, Delete=confirm) exist to make that explicit.

The postmortems add the human and process layer. Grafana's outage came from a cluster-wide default (a default PriorityClass) rolled out before the objects that needed an explicit value. Zalando's DNS outage was a retry storm amplified by ndots, a tiny memory limit and in-cluster-only alerting. loveholidays' GKE upgrade was slow and surprising because they were two minor versions behind and skipped release notes. The common lessons are to review cluster-global config as carefully as code, keep prod-like test environments, alert from outside the cluster, and make destructive operations require confirmation.

Coverage gaps are noted under Open questions. I could not read some primary incident reports (Skyscanner namespace deletion, Reddit Pi-Day, Jetstack webhook outage) because the scraper returned empty pages, and no search hit gave good first-party material on Config Connector, ACK, Cluster API or kro pitfalls. The stack comparisons below are therefore strongest for Crossplane, Flux and Argo CD.

## Sources

### 1. Kubernetes Failure Stories (k8s.af)
- URL: https://k8s.af/
- Title: Kubernetes Failure Stories
- Publisher/author: Henning Jacobs (domain contributed by Joe Beda); community-maintained list
- Kind: curated index of public postmortems and conference talks
- Summary: A dated list of dozens of public Kubernetes outage reports and talks from 2017 to 2023, each tagged with the components involved and the impact. Entries relevant to platform work include a GitOps/templating/namespace-deletion global outage at Skyscanner (2021), the Reddit Pi-Day outage (Calico, upgrades, labels; 2023), Spotify accidentally deleting all its clusters with no user impact (Terraform, global state file, KubeCon 2019), admission webhook outages (Jetstack 2019), Pod priority cascades (Grafana 2019) and GKE upgrade overruns (loveholidays 2019). The tags make it a good map for finding a postmortem by failure class. I read the index only, not most of the linked reports.
- Quote: "we don't hear enough real-world horror stories to learn from each other!"

### 2. Kubernetes Failure Stories (blog post)
- URL: https://srcco.de/posts/kubernetes-failure-stories.html
- Title: Kubernetes Failure Stories | SRCco.de
- Publisher/author: Henning Jacobs (Zalando), posted 2019-01-20
- Kind: engineering blog, motivation for the list
- Summary: Explains why the failure-story list exists and how few public postmortems there were. It argues that most outages at Zalando came from the nature of distributed systems and cascading failures, for example an API server outage that should not have affected running workloads but did. It points to talks such as Zalando's "A Million Ways to Crash Your Cluster", Nordstrom's "101 Ways to Crash Your Cluster", Monzo's public postmortem and Datadog's "Kubernetes the very hard way". Useful as framing for the "learn from postmortems" tutorial and as a reading list.
- Quote: "a Kubernetes API server outage should not affect running workloads, but it did"

### 3. Kubernetes Failure Stories repository (archived)
- URL: https://github.com/hjacobs/kubernetes-failure-stories
- Title: GitHub - hjacobs/kubernetes-failure-stories
- Publisher/author: Henning Jacobs on GitHub
- Kind: archived repository page
- Summary: Notes that the repository was archived on 2020-08-23, has about 6.2k stars, and that the source moved to Codeberg. Only repository metadata was readable, so this adds little beyond the k8s.af index. It matters for provenance: the list is not actively extended in this repository, so newer incidents are underrepresented.

### 4. Total DNS outage in Kubernetes cluster
- URL: https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md
- Title: Total DNS outage in Kubernetes cluster
- Publisher/author: Zalando (kubernetes-on-aws postmortems)
- Kind: first-party postmortem
- Summary: On 2019-01-07 Zalando's product pages returned errors for over an hour. A timed-out downstream call triggered client retries, which spiked DNS queries; CoreDNS pods with a 100Mi memory limit were OOM-killed together and could not recover. Contributing factors were the ndots:5 default (about 10 DNS queries per external lookup), Node.js not caching DNS, short connection lifetimes, no VPA on CoreDNS, and monitoring that depended on DNS and ran inside the cluster. Fixes were raising limits to 2000Mi, a node-local CoreDNS-plus-dnsmasq design, alerting from outside the cluster, and easier escalation. A strong explainer of a blast-radius cascade and why a platform component's limits and monitoring matter.
- Quote: "It should not be possible for a single application to 'DoS' our DNS infrastructure"

### 5. How a Production Outage Was Caused Using Kubernetes Pod Priorities
- URL: https://grafana.com/blog/2019/07/24/how-a-production-outage-was-caused-using-kubernetes-pod-priorities/
- Title: How a Production Outage Was Caused Using Kubernetes Pod Priorities
- Publisher/author: Tom Wilkie, Grafana Labs (2019-07-25)
- Kind: first-party postmortem
- Summary: Grafana added four PriorityClasses to make room for big Cortex ingester pods during upgrades, with "medium" as the global default. A new Cortex cluster deployed without priorities got the default medium priority and preempted production ingesters, which had no priority set. Each preempted pod was recreated by its ReplicaSet at medium priority and preempted another, a cascade that evicted every production ingester and caused about 26 minutes of outage with no data lost. Lessons: do not make a new default the cluster default until existing workloads carry explicit values, roll out cluster-global config with design review, and size reverse proxies against retry stampedes. A clean example of a controller reconcile loop (ReplicaSet) amplifying a scheduling policy.
- Quote: "we should not have made medium the default priority until we had added the high priority designation"

### 6. The shipwreck of GKE Cluster Upgrade
- URL: https://deploy.live/blog/the-shipwreck-of-gke-cluster-upgrade/
- Title: The shipwreck of GKE Cluster Upgrade
- Publisher/author: Dmitri Lerko, loveholidays (2019-03-25)
- Kind: engineering blog / postmortem
- Summary: A planned 2 to 2.5 hour GKE upgrade from 1.10 to 1.12 ran to roughly seven hours. Problems: slow node drains (emptyDir, long terminationGracePeriodSeconds, missing PodDisruptionBudgets), a managed instance group left in a confused state, a stuck node-pool upgrade that had to be cancelled with gcloud, an Ingress that broke because of a bug for names of 44 to 47 characters, and an HPA that stopped reporting CPU and scaled to its maximum. The chosen GKE version had also been pulled for elevated error rates. Lessons are to read release notes, stay close to current versions, keep test environments identical to prod (including naming), and alert on HPA saturation and duplicate ReplicaSets.
- Quote: "Always consult GKE release notes first before making upgrades to the cluster"

### 7. How to fix Kubernetes namespaces stuck in the terminating state
- URL: https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces
- Title: How to fix Kubernetes namespaces stuck in the terminating state
- Publisher/author: Shveta Sachdeva, Red Hat (2022-02-09)
- Kind: tutorial / troubleshooting guide
- Summary: Walks through a namespace stuck in Terminating. The status condition NamespaceFinalizersRemaining names the culprit: a custom resource finalizer (tackles.tackle.io/finalizer) whose controller is not removing it. The article explains finalizers as metadata that makes Kubernetes wait before removing an object, and shows the force path: dump the namespace to JSON, remove the "kubernetes" entry from spec.finalizers, and PUT it to the namespace /finalize subresource through kubectl proxy. Useful for explaining the mechanics, but it treats force-removal as the fix. It does not stress that this can orphan the resources the finalizer was guarding, which matters for cloud-backed resources.
- Quote: "A finalizer is a special metadata key that tells Kubernetes to wait until a specific condition is met"

### 8. Crossplane Managed Resources (v1.20)
- URL: https://docs.crossplane.io/v1.20/concepts/managed-resources/
- Title: Managed Resources - Crossplane v1.20
- Publisher/author: Crossplane project (CNCF graduated)
- Kind: official documentation
- Summary: Defines how a managed resource maps to an external cloud resource. Key pitfall-related content: deletionPolicy Delete (default) removes the cloud resource when the Kubernetes object is deleted, while Orphan leaves it; managementPolicies (beta) give finer control (Observe, Create, Update, Delete, LateInitialize) and override deletionPolicy when set; forProvider is the source of truth, so console edits are reverted; initProvider holds create-only values (for example an autoscaled node group's desiredSize) so Crossplane does not fight an autoscaler; immutable-field edits are not applied and Crossplane never deletes and recreates, unlike Terraform; the crossplane.io/paused annotation stops reconciliation but also blocks deletion; Crossplane places a finalizer so the object stays until the external resource is gone. It also describes "leaked resources" (the external-create-pending, -succeeded and -failed annotations) and why a provider stops and waits for a human rather than risk duplicates. This v1.20 page is flagged as older than the latest release (v2.5), so details may have changed.
- Quote: "Crossplane never deletes a resource based on a forProvider change."

### 9. Deprecate DeletionPolicy (crossplane/crossplane issue 5283)
- URL: https://github.com/crossplane/crossplane/issues/5283
- Title: Deprecate DeletionPolicy #5283
- Publisher/author: Crossplane maintainers (lsviben, negz, jbw976), opened 2024-01-25
- Kind: design discussion / issue
- Summary: Shows the project's reasoning about replacing the two-valued deletionPolicy with granular managementPolicies. The policy was announced as deprecated around v1.12 but was only mentioned in a code comment and never formally deprecated, so the maintainers asked whether users even knew. The issue was still open and labelled as a breaking API change. Useful as a case study in how a deletion safety knob evolves and how the old and new knobs interact during migration.
- Quote: "We never actually deprecated it, just added a note that we plan to deprecate."

### 10. Selective drift correction with ignore rules
- URL: https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/
- Title: Selective drift correction with ignore rules
- Publisher/author: Dipti Pai, Flux project blog (2026-08-03)
- Kind: official project blog / feature announcement
- Summary: Describes the "drift fight". Flux's kustomize-controller runs periodic server-side apply dry-runs and corrects drift, but an HPA changing replicas or cert-manager's cainjector writing a CRD caBundle gets reverted every reconcile. The author recounts a SEV2 where Flux kept resetting replicas to a high value, the HPA kept lowering it, and the cluster autoscaler added and removed nodes in a loop. The fix is a new Kustomization .spec.ignore list (JSON Pointer paths plus an optional target selector). Flux either strips the field from its apply payload when another SSA manager owns it, or adopts the live value when Flux is the sole owner. Changes to ignored fields do not trigger reconciliation, and flux diff honours the rules. The limitation is that Git changes to an ignored field are no longer applied. The best source here for explaining SSA field managers in a practical setting.
- Quote: "the two controllers ping-pong indefinitely"

### 11. Argo CD Sync Options
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/
- Title: Sync Options - Argo CD
- Publisher/author: Argo CD project
- Kind: official documentation
- Summary: Catalogues the guard rails Argo CD offers against destructive syncs: Prune=false and Prune=confirm, Delete=false and Delete=confirm (confirmation recommended for critical resources like Namespaces), PrunePropagationPolicy (foreground by default; background or orphan selectable), PruneLast, FailOnSharedResource, and ApplyOutOfSyncOnly. It warns that Replace=true and Force=true use kubectl replace or delete/create and can cause outages. For SSA, ServerSideApply=true runs kubectl apply --server-side --force-conflicts, with client-side-apply migration moving managedFields ownership to the argocd-controller manager. RespectIgnoreDifferences makes ignoreDifferences (for example /spec/replicas) also apply at sync time, the Argo equivalent of Flux ignore rules. It also warns that manually setting the tracking annotation on a shared Namespace can lead to unintended deletion.
- Quote: "Resources such as Namespaces are critical and should not be pruned without confirmation."

## Real-world use cases

Zalando ran Kubernetes on AWS from 2016 and published postmortems, including the January 2019 CoreDNS total outage, where a retry storm and 100Mi memory limits took down cluster DNS and the storefront (https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md; background at https://srcco.de/posts/kubernetes-failure-stories.html). Grafana Labs operated Cortex-based hosted Prometheus and caused its own outage with Pod priorities, evidence that large multi-tenant platform teams hit controller-amplification problems too (https://grafana.com/blog/2019/07/24/how-a-production-outage-was-caused-using-kubernetes-pod-priorities/). loveholidays ran GKE with GitOps-managed manifests and documented a long-overdue upgrade that overran its window (https://deploy.live/blog/the-shipwreck-of-gke-cluster-upgrade/).

The k8s.af index lists further named cases that I only saw as summaries and did not read in full: Skyscanner (GitOps templating and namespace deletion), Reddit (Calico and upgrades), Spotify (accidentally deleted clusters through Terraform with no user impact), Jetstack (admission webhook outage), Monzo (etcd and Linkerd ledger outage) and Airbnb talks on webhooks and CPU limits (https://k8s.af/).

Typical scenarios from the docs: using Crossplane to provision AWS RDS or EKS node groups, where deletion policy and autoscaler interaction decide whether a Kubernetes delete destroys a database (https://docs.crossplane.io/v1.20/concepts/managed-resources/); running Flux or Argo CD against workloads scaled by HPA or certificates injected by cert-manager (https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/, https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/); and test automation that creates and deletes namespaces, as in the Red Hat author's CI, where operator finalizers left namespaces Terminating (https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces).

## Pitfalls and how tools address them

Stuck finalizers. A deleted object with remaining finalizers stays in Terminating until its owning controller removes them. For namespaces, the status condition NamespaceFinalizersRemaining names the culprit, and the usual cause is a controller or CRD that was uninstalled first or is failing. The Red Hat guide shows the force-removal path through the /finalize subresource (https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces). Crossplane deliberately uses a finalizer so the managed resource object remains until the external resource is really gone, and warns that a paused resource cannot be deleted (https://docs.crossplane.io/v1.20/concepts/managed-resources/). The trade-off is that forcing a finalizer off can orphan the cloud resource it protected. Teams should uninstall controllers only after their custom resources are deleted.

Deletion cascades and orphaning. Crossplane defaults to deleting the external resource when the Kubernetes object goes, and offers Orphan plus managementPolicies without Delete to prevent that (https://docs.crossplane.io/v1.20/concepts/managed-resources/); the deprecation discussion shows the two knobs coexist awkwardly (https://github.com/crossplane/crossplane/issues/5283). Argo CD offers Prune=false, Delete=false, confirm variants and a configurable propagation policy, and warns that giving Argo CD tracking ownership of a shared namespace can cause unintended deletion (https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/). Spotify's and Skyscanner's incidents, listed at https://k8s.af/, are the real-world versions; I did not read them.

Drift fights and SSA conflicts. Two writers on one field loop forever. Flux added field-level ignore rules built on SSA ownership (strip or adopt) after the coarse choice of disabling drift correction entirely (https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/). Argo CD uses ignoreDifferences plus RespectIgnoreDifferences, and its SSA mode uses --force-conflicts, meaning Argo wins ownership conflicts by default; it also migrates client-side apply managers to its own manager (https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/). Crossplane treats forProvider as the source of truth and reverts console changes, with initProvider for create-only values such as an autoscaled desiredSize (https://docs.crossplane.io/v1.20/concepts/managed-resources/).

Destructive apply modes. Argo's Replace=true and Force=true can recreate resources and cause outages (https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/). Crossplane avoids delete-and-recreate for immutable fields, unlike Terraform (https://docs.crossplane.io/v1.20/concepts/managed-resources/).

Leaked or duplicated external resources. Crossplane's creation annotations detect when a provider may have created a cloud resource without recording its name, and the provider halts for human review instead of creating duplicates (https://docs.crossplane.io/v1.20/concepts/managed-resources/).

Cluster-global defaults and cascades. Grafana's default PriorityClass change preempted production pods and the ReplicaSet kept recreating them at the same low priority (https://grafana.com/blog/2019/07/24/how-a-production-outage-was-caused-using-kubernetes-pod-priorities/). Zalando's DNS spiral shows how a shared platform service without isolation, limits or external monitoring becomes a single point of failure (https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md).

Upgrade breakage. loveholidays hit slow drains, a stuck node-pool operation, an Ingress naming bug and HPA misbehaviour. Mitigations were PDBs, safe-to-evict annotations, tuned grace periods, release-note review and prod-like staging (https://deploy.live/blog/the-shipwreck-of-gke-cluster-upgrade/).

Platform-team lessons that recur across the sources: review cluster-scoped changes with the rigor of code, prefer confirmation gates on irreversible actions, alert from outside the cluster, and treat retries and defaults (ndots, priority class, drain timeouts) as part of the platform surface.

Not covered by anything I read: kro, Config Connector (deletion-policy abandon), ACK (adopted resources, deletion-policy retain) and Cluster API specific pitfalls.

## Tutorial and explainer links

- https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces : step-by-step walk-through of finalizers and force-finalizing a namespace.
- https://fluxcd.io/blog/2026/08/ignore-rules-drift-detection/ : clearest explanation of the HPA ping-pong problem and SSA field ownership in practice.
- https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/ : reference for prune, delete, SSA and ignore-differences guard rails.
- https://docs.crossplane.io/v1.20/concepts/managed-resources/ : how deletion policy, management policies and finalizers protect or expose cloud resources (note it is an older version).
- https://k8s.af/ : index to find a postmortem by component or failure class.
- https://srcco.de/posts/kubernetes-failure-stories.html : short essay on why to study failures, with recommended talks.
- https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md : model postmortem structure (timeline, contributing factors, lessons, actions).
- https://grafana.com/blog/2019/07/24/how-a-production-outage-was-caused-using-kubernetes-pod-priorities/ : controller-loop amplification explained through a real outage.

## Open questions

- The Kubernetes finalizers concept page (https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/) and the server-side apply reference were fetched or discovered but were too large to read in this pass, so mechanics of finalizers and SSA conflicts are sourced second-hand from Red Hat, Flux and Argo CD. A writer should read the official pages directly.
- I could not read the Skyscanner, Reddit, Jetstack and Spotify incident reports (empty scrape results or not fetched), so the deletion-cascade and webhook-outage claims for them rest on k8s.af summaries only.
- Crossplane's page is v1.20, while the latest docs are v2.5; deletionPolicy and managementPolicies status may differ now (the issue was open when read, and its final outcome is unknown).
- Red Hat's guide presents force-removing finalizers as the fix. Other sources imply it can orphan guarded resources; no source quantified how often that happens.
- Argo CD SSA uses --force-conflicts by default while Flux's approach is to strip or adopt fields. Neither source compares them directly or states which is safer when two controllers legitimately co-own a field.
- No sources on kro, Config Connector, ACK or Cluster API pitfalls (deletion cascades, adoption, upgrade ordering) were read. Search was intermittently unavailable (503) during this run.
- The failure-story index is mostly 2017 to 2021; recent incidents (2024 to 2026) are underrepresented, and the Flux blog is the only 2026 primary source read.
