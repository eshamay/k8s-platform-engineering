# Open knowledge gaps — k8s-platform-engineering

This file tracks unresolved questions about Kubernetes platform engineering.
- Agents may DRAFT new entries during ingest or query.
- Only humans may set status = `closed` and write the Resolution paragraph.
- Closed gaps STAY in this file. They are the project's reasoning trail.

## Index of open gaps

- [[#named-production-adopters-of-control-plane-tools]] — open, unassigned
- [[#independent-scale-benchmarks-for-etcd-vcluster-and-kcp]] — open, unassigned
- [[#control-plane-as-platform-outage-postmortems]] — open, unassigned
- [[#community-direction-for-the-kubernetes-as-a-kernel-distribution-model]] — open, unassigned
- [[#argo-cd-versus-flux-head-to-head-behavior]] — open, unassigned
- [[#current-crossplane-terminology-versus-the-early-claims-and-classes-model]] — open, unassigned
- [[#origin-of-level-driven-not-edge-driven-guidance]] — open, unassigned
- [[#incidents-caused-by-lost-events-or-edge-triggered-design]] — open, unassigned
- [[#reconcile-defaults-for-crossplane-ack-and-cluster-api]] — open, unassigned
- [[#named-end-user-case-study-of-convergence-trouble]] — open, unassigned
- [[#flux-helm-controller-override-manager-and-dry-run-failure-recovery]] — open, unassigned
- [[#production-incidents-from-drift-correction]] — open, unassigned
- [[#kro-drift-issue-history-and-comparability-of-ten-hour-resyncs]] — open, unassigned
- [[#argo-cd-multi-cluster-hub-and-spoke-and-applicationsets]] — open, unassigned
- [[#secret-management-in-gitops-agents]] — open, unassigned
- [[#named-gitops-adopters-and-gitops-caused-outages]] — open, unassigned
- [[#config-connector-and-ack-behavior-under-a-gitops-agent]] — open, unassigned
- [[#git-versus-oci-as-the-canonical-gitops-source]] — open, unassigned
- [[#how-argo-cd-config-connector-ack-and-cluster-api-key-resources-by-gvk]] — open, unassigned
- [[#informer-and-cache-behavior-keyed-by-gvr]] — open, unassigned
- [[#crd-scale-limits]] — open, unassigned
- [[#crd-handling-in-cluster-api-config-connector-ack-and-backstage]] — open, unassigned
- [[#contents-of-the-k8saf-admission-webhook-postmortems]] — open, unassigned
- [[#kro-status-schema-and-crossplane-v2-status-propagation]] — open, unassigned
- [[#config-connector-and-argo-cd-status-semantics-beyond-health-checks]] — open, unassigned
- [[#where-observedgeneration-should-live]] — open, unassigned
- [[#generic-readiness-when-cluster-api-moves-from-ready-to-available]] — open, unassigned
- [[#named-case-studies-and-postmortems-for-status-problems]] — open, unassigned
- [[#server-side-apply-behavior-in-kro-ack-config-connector-and-helm-4]] — open, unassigned
- [[#best-default-conflict-policy-for-teams-running-gitops-and-in-cluster-controllers]] — open, unassigned
- [[#crossplane-v2-server-side-apply-behavior-and-external-writers]] — open, unassigned
- [[#cluster-api-field-ownership-rules-and-argo-cd-server-side-diff-stability]] — open, unassigned
- [[#kyverno-webhook-failure-modes-and-availability]] — open, unassigned
- [[#named-operator-failure-postmortems]] — open, unassigned
- [[#criteria-for-choosing-an-operator-framework-or-language]] — open, unassigned
- [[#operator-sdk-capability-levels-for-composition-based-operators]] — open, unassigned
- [[#argo-cd-and-config-connector-as-operators]] — open, unassigned
- [[#backstage-and-the-operator-pattern]] — open, unassigned
- [[#named-postmortems-of-runaway-reconcile-loops]] — open, unassigned
- [[#kro-and-cluster-api-idempotency-for-external-and-infrastructure-creates]] — open, unassigned
- [[#production-outcomes-of-adopt-or-create-versus-explicit-import]] — open, unassigned
- [[#postmortems-of-leaked-or-duplicated-cloud-resources-from-ambiguous-creates]] — open, unassigned
- [[#cache-narrowing-options-in-controller-runtime]] — open, unassigned
- [[#flux-shared-caches-and-crossplane-performance-guidance]] — open, unassigned
- [[#resolution-of-crossplane-issue-7801-on-credential-protection]] — open, unassigned
- [[#how-ack-config-connector-and-kro-name-and-remove-their-finalizers]] — open, unassigned
- [[#what-happens-when-blockownerdeletion-is-set-without-finalizers-permission]] — open, unassigned
- [[#crossplane-v2-namespaced-composites-and-managementpolicies-versus-garbage-collection]] — open, unassigned
- [[#keps-on-cross-namespace-ownership-and-garbage-collector-performance]] — open, unassigned
- [[#how-a-platform-should-choose-condition-polarity]] — open, unassigned
- [[#adoption-and-orphaning-behavior-in-cluster-api-kro-and-controller-runtime-operators]] — open, unassigned
- [[#behavior-of-namespaced-v2-managed-resources-when-a-namespace-is-deleted-while-the-provider-is-down]] — open, unassigned
- [[#per-provider-external-name-defaults]] — open, unassigned
- [[#flux-handling-of-composite-resources-and-kro-instances]] — open, unassigned
- [[#scale-of-composite-resources-per-controller]] — open, unassigned
- [[#feature-parity-of-function-kro-with-standalone-kro]] — open, unassigned
- [[#config-connector-and-ack-behavior-when-wrapped-by-compositions]] — open, unassigned
- [[#upjet-runtime-execution-model-and-cost]] — open, unassigned
- [[#flux-and-argo-cd-handling-of-provider-managed-resources]] — open, unassigned
- [[#flux-source-controller-internals-and-artifact-serving-under-leader-election]] — open, unassigned
- [[#flux-sharding-in-production-and-the-helmchart-labeling-rule]] — open, unassigned
- [[#flux-image-automation-api-status-and-safe-promotion-policy]] — open, unassigned
- [[#crossplane-package-dependency-resolution-revision-activation-and-upgrade-policy]] — open, unassigned
- [[#neutral-comparisons-of-crossplane-with-terraform-and-single-cloud-operators]] — open, unassigned
- [[#kro-governance-status-and-the-future-of-the-graph-api]] — open, unassigned
- [[#scaling-limits-of-per-rgd-kro-controllers-and-named-production-kro-adopters]] — open, unassigned
- [[#independent-benchmarks-for-argo-cd-footprint-and-portal-claims]] — open, unassigned
- [[#direct-comparison-of-config-connector-and-crossplane]] — open, unassigned
- [[#cloud-api-rate-limits-and-crossplane-provider-reconcile-tuning]] — open, unassigned
- [[#scaling-behavior-of-kro-ack-cluster-api-and-config-connector-controllers]] — open, unassigned
- [[#current-crossplane-v2-scaling-guidance]] — open, unassigned
- [[#named-flux-sharding-adopters-and-api-priority-and-fairness-incidents]] — open, unassigned
- [[#first-party-pitfall-and-incident-evidence-for-kro-config-connector-ack-and-cluster-api]] — open, unassigned
- [[#force-conflicts-versus-strip-or-adopt-when-two-controllers-co-own-a-field]] — open, unassigned
- [[#how-often-forced-finalizer-removal-orphans-guarded-resources]] — open, unassigned
- [[#recent-2024-to-2026-platform-incident-evidence]] — open, unassigned
- [[#which-kro-version-and-feature-gates-the-amazon-eks-managed-capability-runs]] — open, unassigned
- [[#which-cve-the-kcp-speaker-said-the-kcp-side-discovered]] — open, unassigned
- [[#crossplane-backup-and-disaster-recovery-guidance-including-velero-and-external-name-after-a-restore]] — open, unassigned

---

## Named production adopters of control-plane tools — status: open

- **Question:** Which named organizations run Crossplane, ACK, Config Connector, Cluster API, or kcp in production, and with what object counts?
- **Why it matters:** The dossier's use cases rest on vendor documentation and announcements, so adoption evidence is missing.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect CNCF project pages, ADOPTERS files, and KubeCon talks.
  - [ ] Write `examples/` pages for each documented adopter.
- **Possible resolution from [[sources/research-gap-g1-named-adopters]]:** Partly settled, and the user decides whether to close it. The dossier names adopters from the project's own self-reported files: 87 rows in Crossplane's ADOPTERS file with about eight carrying figures (SAP, Consensys, Built Technologies, SpareBank 1 Utvikling, Akamai, DKB, Nike, Jellysmack), Adobe, BT, and Continuum Industries in ACK's file, and Upbound as the only kcp adopter marked "Production". Every entry is an unaudited self-listing. No adopters file exists for Config Connector, none was found for Cluster API (an unverified negative result from a code search), and no object counts were found for ACK or kcp. See [[examples/sap-reports-more-than-100-crossplane-based-control-planes-and-thousands-of-managed-resources-as-of-february-2024]], [[examples/adobe-lists-ack-for-global-kubernetes-cluster-provisioning-and-stateful-service-infrastructure]], and [[examples/upbound-is-the-only-kcp-adopter-marked-production-in-the-adopters-file]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, crossplane, ack, kcp
- **Possible resolution from [[sources/research-composite-resource]]:** Partly helpful. The same self-reported adopters list adds Renault, Wellhub, Wildlife Studios, Consensys, Grafana Labs, VSHN, Millennium bcp, Continental, and Syntasso (Kratix) as users of composite resources for self-service platforms. The entries are unaudited one-liners and add no counts for composites. No adopter of kro, ACK, Config Connector, or Cluster API is named beyond AWS offering kro on EKS. See [[examples/crossplane-adopters-build-self-service-platforms-and-service-catalogs-on-composite-resources]].
- **Possible resolution from [[sources/research-managed-resource]]:** Partly helpful. The Crossplane ADOPTERS list names Nike, Autodesk, SAP, Deutsche Kreditbank, IBM, Elastic, UiPath, VMware Tanzu, DB Systel, Nokia, and Akamai, with reported counts such as SAP's thousands of managed resources and Akamai's up to 200,000. The entries are self-reported one-liners and not verified case studies. See [[examples/crossplane-adopters-report-managed-resource-counts-from-thousands-to-two-hundred-thousand]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Marginally helpful. The Flux adopters page lists more than 200 organizations without use-case detail, and Morgan Stanley reports more than 500 clusters. No adopter of Crossplane, ACK, Config Connector, Cluster API, or kcp is added. See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].
- **Possible resolution from [[sources/research-crossplane-deep-dive]]:** Partly helpful. The CNCF graduation post names Nike, Nokia, Grafana, NASA Science Cloud, Elastic, Akamai, SAP, and IBM among 70 or more self-reported adopters, and InfoQ adds Autodesk. Only JFrog is described in any detail, as a Jenkins, Git, Argo CD, and Crossplane self-service pipeline with size classes and expiry tags, and the post gives no object counts. See [[examples/jfrog-delivers-self-service-cloud-environments-through-jenkins-git-argo-cd-and-crossplane]].
- **Possible resolution from [[sources/research-landscape]]:** Partly helpful. The adopters list names Nike, Consensys, SAP, Deutsche Bahn (DB Systel), Stone Payments, RTL Nederland, and Akamai with use cases, all self-reported, and Syntasso links NatWest, The Access Group, and Veeam as Kratix case studies without detail. See [[examples/rtl-nederland-provisions-whole-kubernetes-clusters-with-crossplane-which-overlaps-with-cluster-api]].
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Settles one negative result only. The Cluster API repository root listing has no adopters file (root only, subdirectories not searched). No new adopters were named. See [[entities/cluster-api]].
- **Possible resolution from [[sources/bex-co-kro-radar-post]]:** Not settled for kro, and the user decides whether to close it. A secondary bex.co post cites a CNCF and SlashData survey rating for kro but names no production user, and its author is evaluating kro and not running it. See [[examples/bex-co-weighs-a-kro-resourcegraphdefinition-against-a-hand-rolled-operator-for-a-cluster-api-paas-on-hetzner]].
- **Possible resolution from [[sources/kcp-kubecon-talk]]:** Not settled for kcp, and the user decides whether to close it. The speaker says he works for Accenture and gives no customer or production user, and his employer is not stated to run kcp. The adopters file read earlier remains the only adopter evidence, see [[entities/kcp]].

## Independent scale benchmarks for etcd, vcluster, and kcp — status: open

- **Question:** What do independent benchmarks show for the 30,000 to 40,000 object degradation point, roughly 100 vCluster tenants, 1000+ kcp tenants, and the million-workspace kcp goal?
- **Why it matters:** These figures come from vendors with a stake in the answer and depend on the workload.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find neutral benchmarks or large-operator write-ups.
  - [ ] Update [[findings/etcd-scale-limits-of-the-shared-store]] and [[comparisons/tenancy-models-namespaces-vcluster-kcp]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, etcd, vcluster, kcp
- **Possible resolution from [[sources/kcp-kubecon-talk]]:** Not settled, and the user decides whether to close it. The KubeCon transcript gives no benchmark or tenant count for kcp. Its only figures are the speaker's spoken estimates of about a second for a workspace and half an hour to an hour for a managed cluster, which are not independent measurements.

## Control-plane-as-platform outage postmortems — status: open

- **Question:** Are there public postmortems of outages caused by CRD deletion cascades, etcd quota alarms, or controller storms?
- **Why it matters:** The pitfalls pages lack real incident evidence.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search for public incident reports and conference talks.
  - [ ] Add `findings/` pages for each incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, etcd, deletion
- **Possible resolution from [[sources/research-pitfalls-and-case-studies]]:** Partly helpful. The dossier reads three first-party postmortems in full (Zalando's CoreDNS outage, Grafana's PriorityClass cascade, and loveholidays' GKE upgrade) and indexes others through k8s.af, but none is a CRD deletion cascade or an etcd quota alarm. It also could not read the Skyscanner namespace-deletion, Reddit, and Spotify reports. See [[concepts/pitfalls-and-case-studies]] and [[examples/zalando-s-2019-coredns-outage-turned-a-retry-storm-into-a-total-dns-failure]].
- **Possible resolution from [[sources/research-gap-g1-outage-postmortems]]:** Partly settled, and the user decides whether to close it. The dossier reads two primary postmortems of control-plane failures in full: OpenAI's 2024-12-11 telemetry rollout that overwhelmed the API servers and locked engineers out (a controller or agent storm, self-reported), and Jetstack's 2019 GKE master upgrade blocked by an OPA validating webhook. It also reads Neon's May 2025 postmortem, in which a slow control-plane database exhausted subnet IPs, which is a platform control plane on Kubernetes and not the Kubernetes control plane. It found no primary postmortem of a CRD deletion cascade or an etcd quota alarm, and that absence is weak evidence because the search tool returned many empty results. The CNCF etcd blog of 2026-03-12 is a tooling article with no incident, and its 2GiB quota default is SECONDARY-ONLY. See [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]], [[examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query]], and [[findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm]].
- **Possible resolution from [[sources/reddit-pi-day-outage-postmortem]]:** Reddit's 314-minute outage is a first-party postmortem of a control-plane upgrade failure (Kubernetes 1.24 label removal, Calico routing collapse, no supported downgrade, backup restore). See [[examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected]] and [[findings/kubernetes-has-no-supported-downgrade-so-a-failed-control-plane-upgrade-forces-a-backup-restore-and-an-untested-restore-procedure-is-the-risk]].
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Changes only the evidence grade of one figure and finds no postmortem. The 2 GiB etcd storage quota default, previously known from a CNCF blog alone, is verified against the etcd v3.6 docs. No primary postmortem of a CRD deletion cascade or an etcd quota alarm was found, and the dossier ran no new search for one. See [[findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm]].

## Community direction for the Kubernetes-as-a-kernel distribution model — status: open

- **Question:** Does the Ænix "distribution" model reflect community direction, for example in a SIG or KEP, or only one vendor's view?
- **Why it matters:** It determines how much weight the non-container use cases deserve.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find SIG discussions or KEPs and conference talks on API server aggregation, server-side apply, and streaming lists.
- **Drafted by:** agent on 2026-11-25
- **Tags:** distributions, aenix, kep
- **Possible resolution from [[sources/research-gap-o5-kro-ecosystem]]:** Not settled in favor of the model, and the user decides whether to close it. No SIG charter, KEP, or talk adopting a distribution model was found, and the only direct source is Aenix's own post, which calls its project lab-tested and small. Adjacent signals exist in kcp (CNCF Sandbox), its not-production-ready generic-controlplane, and API-machinery KEPs that do not mention the model, see [[findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post]].
- **Possible resolution from [[sources/kcp-kubecon-talk]]:** Not settled, and the user decides whether to close it. The kcp KubeCon talk was expected to be a primary source on this, but the transcript is a short kcp introduction that does not mention a distribution model, a SIG, or a KEP. It adds nothing for or against the model.

## Argo CD versus Flux head-to-head behavior — status: open

- **Question:** How do Argo CD and Flux compare in practice on drift correction, pruning, multi-tenancy, and failure behavior, according to neutral sources?
- **Why it matters:** The current comparison page merges separate documentation pages and is not a head-to-head analysis.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find practitioner comparisons and CNCF material.
  - [ ] Revise [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, argo-cd, comparison
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Marginally helpful. The only comparison read is a vendor blog (Devtron), whose claims on scale and the missing Flux UI are opinion, and the dossier says no neutral benchmark was found. See [[comparisons/flux-versus-argo-cd-isolation-ordering-and-interface-according-to-a-vendor-blog]].
- **Possible resolution from [[sources/research-gap-o1-argocd-flux-gitops]]:** Partly settled at the documentation level, not at the head-to-head level. Primary docs read on 2026-11-26 show that Flux `prune` is required with a per-object opt-out and drift is checked by a server-side apply dry-run each user-set interval, while Argo CD prune and self-heal are opt-in and a manual sync does not prune. A neutral benchmark or CNCF comparison was not found (one web search returned nothing, so this is an unverified negative), and Argo CD AppProject multi-tenancy, Flux notification-controller, UI and CLI documentation were not read. See [[findings/no-neutral-benchmark-or-cncf-comparison-of-argo-cd-and-flux-was-found-so-the-comparison-rests-on-each-project-s-own-documentation]] and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

## Current Crossplane terminology versus the early claims-and-classes model — status: open

- **Question:** Which parts of Crossplane's 2018-era claims and resource classes design survive in the current composite resource, composition, and function model?
- **Why it matters:** The original announcement is still widely quoted, and its terminology may mislead readers of current documentation.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read current Crossplane docs on claims and compare them with the early blog post.
  - [ ] Update [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, terminology, history
- **Possible resolution from [[sources/research-composite-resource]]:** Partly helpful. The v1.20 claims page and the v2 upgrade guide show that claims are a namespaced stand-in for a cluster-scoped XR in v1 and that v2 makes XRs namespaced and removes claims for new-style XRDs, and that native patch-and-transform is removed in favor of function pipelines. Claim support in v2 is not stated precisely in a primary page, and the 2018 claims-and-classes announcement itself was not read. See [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]].

## Origin of the Level driven, not edge driven guidance — status: open

- **Question:** Where is the Kubernetes Controller Writing Guide that the Ayson post quotes as "Level driven, not edge driven," and does it say more about expectations?
- **Why it matters:** The quote is cited second-hand, and the original guide URL was not located.
- **Owner:** unassigned
- **How to close:**
  - [ ] Locate the guide in the kubernetes/community repository or a successor.
  - [ ] Verify the quote and the Joe Beda attribution to the O'Reilly book Cloud Native Infrastructure.
- **Drafted by:** agent on 2026-11-25
- **Tags:** level-triggered, verification, provenance
- **Possible resolution from [[sources/research-gap-m5-informers-caches]]:** Mostly settled, and the user decides whether to close it. The quote is guideline 3 in the Controller Writing Guide at `contributors/devel/sig-api-machinery/controllers.md` in kubernetes/community, which also says a controller cannot count on having seen a transition and should record its last decision in status. The old path's history begins 2016-11-30 and the file moved on 2019-01-23, the archived principles say "Edge-triggered behavior must be just an optimization", and Tim Hockin's slides date to 2017-06-02. Not settled: the Joe Beda attribution to Cloud Native Infrastructure is still SECONDARY-ONLY through the 2018 Hacker Noon post because the book was not read, and the first use of the exact phrase in the guide was not established. See [[findings/the-level-driven-not-edge-driven-guideline-is-point-3-of-the-controller-writing-guide-and-the-beda-quote-remains-second-hand]].

## Incidents caused by lost events or edge-triggered design — status: open

- **Question:** Are there named-company postmortems or case studies where a lost event, stale cache, or edge-triggered design caused an outage?
- **Why it matters:** The pitfalls pages rely on explainers and framework docs. The Render informer blog post and the ondemandenv.dev Thermostat article could not be fetched, so they may hold evidence.
- **Owner:** unassigned
- **How to close:**
  - [ ] Retry the Render informer post and search for operator bugs tied to missed events.
  - [ ] Add `findings/` pages for each documented incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, informers, level-triggered
- **Possible resolution from [[sources/research-gap-g1-operator-loop-failures]]:** Partly settled, and the user decides whether to close it. No named-company outage postmortem caused by a lost event or edge-triggered design was found, so the gap's literal question (a named-company postmortem) is not answered. The dossier did find two primary issue-level cases with concrete mechanisms. Kubernetes issue 115658 shows a client-go relist dropping the DELETE event for a short-lived object, which leaked state in production controllers until pull requests 115620 and 116623 fixed it for 1.27. NVIDIA NVSentinel issue 1542 shows a delete that happened while the monitor was down and was never delivered, which left a node cordoned. Argo Rollouts and KubeFleet document periodic resync as a guard against missed events and bugs, the first as a user's statement (SECONDARY-ONLY). The Render informer post could not be retrieved, and its title suggests it concerns a DNS dependency, and the ondemandenv.dev Thermostat article was not retried. See [[examples/kubernetes-issue-115658-a-client-go-relist-could-drop-the-delete-event-for-a-short-lived-object]], [[examples/nvidia-nvsentinel-issue-1542-a-node-stayed-cordoned-after-an-object-was-deleted-while-the-monitor-was-down]], [[findings/an-informer-relist-that-races-a-queued-create-can-drop-the-delete-event-for-the-object]], and [[findings/a-delete-that-happens-while-a-controller-is-down-is-never-delivered-so-finalizers-or-resync-must-cover-it]].
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Settles a detail, not the gap. Argo Rollouts' `--rollout-resync` flag exists ("Time period in seconds for rollouts resync."), but that operators run it as a guard against missed events remains one user's statement in issue 4140 (SECONDARY-ONLY). No named-company postmortem was added. See [[findings/projects-add-periodic-resync-as-a-safety-net-against-missed-events-and-bugs]].

## Reconcile defaults for Crossplane, ACK, and Cluster API — status: open

- **Question:** What are the default poll or resync intervals and drift-recovery behaviors of Crossplane providers, ACK controllers, and Cluster API controllers?
- **Why it matters:** The cadence comparison has empty cells for these tools because the pages fetched did not state the values.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's documentation or source directly.
  - [ ] Fill the rows in [[comparisons/reconcile-cadence-and-off-switches-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, ack, cluster-api, intervals
- **Possible resolution from [[sources/research-informers-reflectors-and-workqueues]]:** Marginally helpful, for Crossplane only. Crossplane providers gained `--max-reconcile-rate` in 1.6 alongside `--poll-interval`, but no default value is stated and the current performance guide was not read. See [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]].
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Partly helpful. ACK defaults to about 10 hours after `ResourceSynced` with per-kind overrides. Crossplane's poll interval is configurable but its default is still not stated, and the Cluster API source is the v0.4 book. See [[comparisons/drift-detection-mechanisms-across-tools]].
- **Possible resolution from [[sources/research-gap-g3-reconcile-defaults]]:** Settled for Crossplane and ACK, and only partly for Cluster API, so the user should decide whether to close it. Crossplane's poll interval is 1 minute in crossplane-runtime and core (minimum per-resource value 1 second), and the provider-upjet-aws S3 provider overrides it to 10 minutes with a 1 hour sync period, `--max-reconcile-rate` 100, and 5 percent jitter. The per-resource `crossplane.io/poll-interval` annotation is implemented although its design one-pager is still marked Draft. ACK defaults to 10 hours after `ResourceSynced`, from both the docs page and the runtime constant, with Helm overrides per controller or per kind. Cluster API's `--sync-period` is 10 minutes but is a cache resync, and no per-resource drift period or MachineHealthCheck cadence was found. Not settled: the docs.crossplane.io poll page and Cluster API infrastructure drift handling. The cadence comparison rows are filled in [[comparisons/reconcile-cadence-and-off-switches-across-tools]]. See [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]] and [[findings/the-cluster-api-sync-period-flag-is-a-cache-resync-and-not-a-poll-of-the-cloud-infrastructure]].
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Re-checks one item the earlier note left unsettled. The docs.crossplane.io managed-resources page was read in full (42 KB) and does not state a poll interval default, so the figure cannot be cited from the docs. The source defaults were re-verified: 1 minute in crossplane-runtime and core, `--poll` 10m and `--sync` 1h in provider-upjet-aws. See [[findings/crossplane-poll-interval-defaults-differ-by-layer-with-one-minute-in-core-and-runtime-and-ten-minutes-in-upjet-providers]].



## Named end-user case study of convergence trouble — status: open

- **Question:** Is there a named-company case study or primary postmortem in which retry amplification, stale caches, or slow convergence in a Kubernetes controller caused an incident?
- **Why it matters:** The dossier found none, and its only retry-storm postmortem is a secondary vendor-blog account of a GitHub incident that did not involve Kubernetes. See [[findings/retry-storms-and-unbounded-retries]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Locate GitHub's primary postmortem and judge whether the secondary account matches it.
  - [ ] Search for Kubernetes controller incident reports and conference talks.
  - [ ] Add `findings/` or `examples/` pages for each documented incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, retries, case-study
- **Possible resolution from [[sources/research-gap-g1-gitops-drift-incidents]]:** Not settled. No named-company primary postmortem of controller retry amplification, stale caches, or slow convergence was found. The nearest evidence is the anonymous Argo CD self-heal incident of 2026-11-20 and two k8s.af index entries that were not read (Skyscanner 2021 and Airbnb KubeCon NA 2020), both SECONDARY-ONLY. The GitHub primary postmortem named in this gap was not searched for separately. See [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]] and [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]].

## Flux helm-controller override-manager and dry-run failure recovery — status: open

- **Question:** Does official Flux documentation confirm the `--override-manager` flag, its availability since helm-controller v1.5.0, and the recommended recovery when the server-side dry-run fails on a conflicting field manager?
- **Why it matters:** The only source is a community reply, and the dry-run failure stops all drift correction. See [[findings/field-ownership-blocks-drift-correction]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the helm-controller documentation and release notes.
  - [ ] Check the linked Argo CD issue 17717 and Kubernetes issue 130292.
  - [ ] Update [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, helm, server-side-apply, verification
- **Possible resolution from [[sources/research-gap-g3-flux-ssa-helm]]:** Marginally helpful, and not settled. The dossier verified the kustomize-controller `--override-manager` flag (documented as "Field manager disallowed to perform changes on managed resources.") and its new pre-dry-run sibling, but it did not read helm-controller documentation or release notes, so the helm-controller flag and its availability since v1.5.0 stay unverified. See [[findings/field-ownership-blocks-drift-correction]].
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Partly settled, and the user decides whether to close it. The helm-controller CHANGELOG lists `--override-manager` in its 1.5.0 section (release date 2026-02-20), and `main.go` registers it as a repeatable flag feeding `DisallowedFieldManagers`, so the flag and its "since v1.5.0" claim are confirmed. The changelog also says the drift correction is unrelated to Helm v4 server-side apply. Not settled: whether the helm-controller flag takes over before or after its dry-run (so whether it recovers an object stuck at dry-run validation), and Argo CD issue 17717 and Kubernetes issue 130292 were not read. See [[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]] and [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]].
- **Possible resolution from [[sources/research-gap-b1-recheck-flux-k8s]]:** Marginally helpful, and not settled. The helm-controller `--override-manager` flag is a string-array flag whose help text reads "List of field managers to override during drift detection", it was added in v1.5.0 (2026-02-20, pull request 1365), and the changelog repeats that the drift correction is unrelated to Helm v4 server-side apply. The kustomize-controller options page documents `--override-manager` as taking over only after a successful dry-run and `--override-manager-before-dry-run` as taking over before it. The dossier still does not say whether the helm-controller flag takes over before or after its own dry-run, so whether it can recover an object stuck at dry-run validation is open, and Argo CD issue 17717 and Kubernetes issue 130292 were not read. See [[findings/helm-controller-has-had-a-repeatable-override-manager-flag-since-v1-5-0-and-it-is-unrelated-to-helm-v4-server-side-apply]] and [[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]].
- **Possible resolution from [[sources/research-gap-m4-ssa-conflict-policy]]:** Mostly settled on the order of operations, and the user decides whether to close it. The `--override-manager` flag, its v1.5.0 release (2026-02-20), and its documentation in the helm-controller flags table are confirmed. Source shows that helm-controller patches `managedFields` to remove the disallowed managers before its server-side dry-run diff, the reverse of kustomize-controller, whose default flag acts only after a successful dry-run and whose `--override-manager-before-dry-run` flag (v1.10.0) is the documented recovery. No helm-controller counterpart to the recovery flag and no documented recovery for a stuck HelmRelease was found. Argo CD issue 17717 and Kubernetes issue 130292 were read. Not settled: the `PatchReplaceFieldsManagers` body was not read and how a dry-run error surfaces under `Graceful(true)` was not traced. See [[findings/helm-controller-takes-over-override-manager-fields-before-its-dry-run-diff-the-reverse-of-kustomize-controller]], [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]], and [[examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port]].

## Production incidents from drift correction — status: open

- **Question:** Which named companies run drift-correcting controllers in production, and has any published postmortem described a revert loop, a blocked correction, or a remediation storm?
- **Why it matters:** The dossier found no named adopters or incident accounts, so the pitfalls rest on documentation and issue threads. See [[findings/controllers-fighting-over-fields-cause-revert-loops]] and [[findings/remediation-can-amplify-an-outage]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search for conference talks and postmortems on GitOps revert loops and Cluster API remediation.
  - [ ] Add `examples/` or `findings/` pages for each documented incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, drift, case-study
- **Possible resolution from [[sources/research-gap-g1-gitops-drift-incidents]]:** Partly settled, and the user decides whether to close it. The dossier found one dated production-style incident, a CNCF blog post of 2026-11-20 in which Argo CD self-heal skipped a migration hook on two of five regional Applications for 36 to 44 minutes (customer unnamed, mechanism the author's claim). It also found Flux issue 2514 (an HPA-managed Deployment reset to 1 replica once, no outage), ACK issue 2911 (a prune that stranded a CR), and Argo CD issue 30398 (permanent OutOfSync). It found no named company's postmortem of a revert loop, a blocked correction, or a remediation storm, and the Cluster API side is covered by [[sources/research-gap-g3-argocd-capi]]. See [[examples/argo-cd-self-heal-after-a-deny-sync-window-closed-skipped-the-migration-hook-on-two-of-five-regional-applications]], [[findings/handing-replicas-between-git-and-an-hpa-can-reset-the-count-or-leave-an-application-permanently-out-of-sync]], and [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]].

## kro drift issue history and comparability of ten-hour resyncs — status: open

- **Question:** What is the true history of kro issue 753 (reported bug, duplicate of issue 323, closed 2025-11-04), and are ACK's 10-hour resync and kro's 10-hour resync comparable mechanisms (informer resync versus explicit requeue)?
- **Why it matters:** The digest of the issue was internally inconsistent, and the comparison table treats the two figures side by side. See [[comparisons/drift-detection-mechanisms-across-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read issue 753, issue 323, and the fixing commits directly.
  - [ ] Read the kro and ACK source for how the resync is scheduled.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, ack, resync, verification

## Argo CD multi-cluster hub-and-spoke and ApplicationSets — status: open

- **Question:** How does Argo CD handle hub-and-spoke multi-cluster delivery (pull versus push from a central instance), and how do ApplicationSets generate applications across a fleet?
- **Why it matters:** The dossier's AWS multi-cluster GitOps article returned only site navigation, so the fleet story for Argo CD is missing, and "pull" is less clear when one central Argo CD instance reaches into many clusters.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD ApplicationSet and cluster-management documentation.
  - [ ] Compare against Flux fleet layouts in [[examples/flux-d2-gitless-gitops-fleet-with-signed-oci-artifacts]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, multi-cluster, applicationset
- **Possible resolution from [[sources/research-gap-o1-argocd-flux-gitops]]:** Largely settled for the documented mechanics, open on scale and maturity. A central Argo CD instance reaches into registered clusters, the Cluster generator reads the Argo CD cluster list, and the documented limits are two matrix children, one level of nesting, 30-minute Pull Request polling and Beta RollingSync that forces autosync off. The argocd-agent Labs project is the documented pull alternative, but its maturity is UNVERIFIED, and no quantified scale limit or adopter write-up was found. See [[findings/argo-cd-reaches-into-registered-clusters-from-a-hub-and-the-argocd-agent-pull-model-is-a-labs-project-of-unverified-maturity]], [[findings/applicationset-generators-have-documented-limits-matrix-takes-two-children-nesting-is-once-and-pull-request-polling-defaults-to-30-minutes]], and [[decisions/reach-spoke-clusters-from-a-central-argo-cd-hub-or-with-argocd-agent-pulling-from-the-spokes]].

## Secret management in GitOps agents — status: open

- **Question:** How do Argo CD and Flux handle secrets (SOPS, KMS, external secret operators), and what are the failure modes?
- **Why it matters:** The dossier says Flux decrypts SOPS and KMS secrets in the controller but did not read Argo CD's secret-management page, so the comparison is one-sided.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read Argo CD's secret management documentation and the Flux SOPS guide.
  - [ ] Add a comparison page under `comparisons/`.
- **Drafted by:** agent on 2026-11-25
- **Tags:** secrets, sops, argo-cd, flux
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Marginally helpful. The Kustomization reference supports SOPS decryption with age, OpenPGP, and cloud KMS, but the dossier does not cover failure modes or Argo CD. See [[entities/flux]].
- **Possible resolution from [[sources/research-gap-o1-argocd-flux-gitops]]:** Largely settled for the documented positions, open on failure modes. Argo CD recommends destination-cluster operators and warns that generation plugins leave plaintext manifests in Redis, and its page does not mention SOPS or ksops (UNVERIFIED as a position). Flux decrypts only SOPS in kustomize-controller and requires `metadata`, `kind` and `apiVersion` in plaintext, and it publishes a Sealed Secrets guide. Failure modes for either approach were not collected. See [[findings/argo-cd-recommends-destination-cluster-secret-operators-and-warns-that-generation-plugins-cache-plaintext-manifests-in-redis]], [[findings/flux-kustomize-controller-decrypts-only-sops-and-requires-metadata-kind-and-apiversion-to-stay-in-plaintext]], and [[decisions/supply-gitops-secrets-from-a-destination-cluster-operator-a-generation-plugin-or-controller-side-sops]].

## Named GitOps adopters and GitOps-caused outages — status: open

- **Question:** Which named organizations run pull-based GitOps at scale, and what outages or near-misses has it caused (bad prune, runaway sync, credential compromise of the agent)?
- **Why it matters:** The dossier found no named production case studies, scale figures, or postmortems, so pitfalls on the GitOps pages rest on documentation warnings.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect CNCF end-user case studies, ADOPTERS files, and conference talks.
  - [ ] Write `examples/` pages for each documented adopter and add evidence to the pitfall findings.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, postmortems, gitops
- **Possible resolution from [[sources/research-finalizers]]:** Largely helpful on deletion. Config Connector and ACK delete the cloud resource by default, with `abandon` and `retain` as opt-outs applied before the delete, and Argo CD's Application finalizer and Flux's `deletionPolicy` decide whether GitOps deletes cascade. The dossier does not test a prune of a Config Connector or ACK object directly. See [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]] and [[comparisons/deletion-policies-across-gitops-and-provider-tools]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Partly helpful on adopters. Morgan Stanley gives a named, self-reported scale (more than 500 clusters) and the adopters page names more than 200 organizations. The dossier found no postmortem or outage report. See [[examples/morgan-stanley-runs-flux-across-more-than-500-clusters-with-self-service-onboarding]].
- **Possible resolution from [[sources/research-gap-g1-gitops-drift-incidents]]:** Partly settled, and the user decides whether to close it. Named adopters now exist as self-reported lists: Argo CD's USERS.md has 452 organizations (the dossier's count, file last changed 2026-11-23), and CNCF documents Subaru's Argo CD and Helmfile adoption with no outage. A press repost says nearly 60 percent of surveyed clusters use Argo CD (SECONDARY-ONLY). GitOps-caused outages appear only as anonymous issues: Argo CD 6046 (apps deleted after a namespace reinstall), 20440 (an ApplicationSet-generated Application deleted with its namespaces and Argo CD), and 15441 (a namespace recreated). The Skyscanner 2021 outage is SECONDARY-ONLY, indexed by k8s.af and unread. No named organization's postmortem and no scale figures were found. See [[examples/the-argo-cd-users-file-lists-452-self-reported-adopters]], [[examples/subaru-adopted-argo-cd-with-helmfile-to-replace-manual-deployment-procedures]], and [[findings/deleting-or-recreating-an-argo-cd-parent-can-cascade-to-everything-it-managed]].
- **Possible resolution from [[sources/skyscanner-namespace-deletion-postmortem]]:** Skyscanner is now a named organization with a first-party account of a GitOps-caused global outage (2021, Argo CD, 478 services deleted). See [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]]. This answers the outage half of the gap for one organization; adopter counts are covered elsewhere.
- **Possible resolution from [[sources/research-gap-o3-gitops-provider-managed]]:** Not settled, and the user decides whether to close it. This pass added no new named organization with a first-party GitOps outage write-up and found no Flux postmortem (an absence claim, UNVERIFIED). The ACK issue 3153 and 3152 reproductions are anonymous and ran on a kind cluster with moto, so they are not production incidents, and the one generic 2025 blog read names no organization. Skyscanner (2021, Argo CD) remains the only named first-party outage. See [[findings/the-o3-pass-found-no-flux-postmortem-and-no-new-named-gitops-outage-and-the-ack-3152-and-3153-reproductions-ran-on-kind-with-moto]].

## Config Connector and ACK behavior under a GitOps agent — status: open

- **Question:** What happens to cloud resources when a GitOps agent prunes a Config Connector or ACK object, and how do deletion and abandon policies interact with Argo CD prune and Flux garbage collection?
- **Why it matters:** The dossier covered neither ACK specifics nor Config Connector deletion and abandon behavior, yet pruning a custom resource can delete real infrastructure.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector deletion policy and ACK adoption and deletion documentation.
  - [ ] Update [[comparisons/deletion-policies-across-gitops-and-provider-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, ack, deletion, prune
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Partly helpful for Config Connector only. Deleting the object deletes the Google Cloud resource by default, and the `abandon` annotation keeps it. The ACK search failed, so ACK is not covered. See [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].
- **Possible resolution from [[sources/research-gap-o3-gitops-provider-managed]]:** Partly settled, and the user decides whether to close it. Both defaults are verified against current documentation: Config Connector deletes the Google Cloud resource unless `cnrm.cloud.google.com/deletion-policy: abandon` is set before the delete, and ACK deletes the AWS resource first, with the policy resolving from the resource annotation, then the namespace annotation, then the controller default. Flux prune and Argo CD prune are ordinary deletes, so the defaults apply, and each agent has opt-outs (Flux `prune: disabled` and `deletionPolicy`, Argo CD `Prune=false`, `Prune=confirm`, `Delete=false`, `Delete=confirm`, and `preserveResourcesOnDeletion`). ACK issue 3153 is a reporter's reproduction that Argo CD prune, Flux prune, and helm-controller all led to AWS deletion and that a controller-wide retain did not protect chart-stamped resources. Also covered: Config Connector `state-into-spec` Merge drift against Argo CD and Config Sync, and ACK issues 3152 and 2361. Not settled: no test prunes a Config Connector or ACK object end to end, no maintainer confirmed issues 3153, 3152, or 2361, and Argo CD `Prune=false` against ACK finalizers was not tested. See [[findings/ack-deletion-policy-resolves-from-the-resource-then-the-namespace-then-the-controller-default-and-one-reporter-says-chart-stamped-delete-defeats-a-controller-wide-retain]], [[findings/config-connector-state-into-spec-merge-populates-unspecified-fields-that-argo-cd-and-config-sync-treat-as-drift-and-absent-is-the-default-from-1-123-1]], [[findings/flux-server-side-apply-reverts-ack-reference-fields-that-the-controller-rewrote-according-to-issue-2361]], and [[decisions/protect-a-provider-managed-object-from-gitops-prune-with-a-provider-retain-policy-or-an-agent-side-prune-opt-out]].
- **Possible resolution from [[sources/medium-config-connector-pitfalls]]:** Partly informative for Config Connector, and the user decides whether to close it. A single practitioner reports that under Argo CD a Config Connector table needs sync waves to be created after its dataset and ends in DeleteFailed if the dataset is deleted first. The claim is secondary, cites two issues that were not read, and does not cover ACK or Flux.

## Git versus OCI as the canonical GitOps source — status: open

- **Question:** Do independent sources show measurable security or operational benefits from signed OCI artifacts over direct Git pulls, and when does Argo CD support equivalent flows?
- **Why it matters:** The only evidence in the dossier is a vendor reference architecture, and Flux and Argo CD documentation frame the choice differently. See [[decisions/git-versus-oci-as-the-canonical-source]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find independent write-ups or security reviews of OCI-based Flux delivery.
  - [ ] Check Argo CD's OCI source support in current documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** oci, git, supply-chain
- **Possible resolution from [[sources/research-gap-o1-argocd-flux-gitops]]:** Settled on the Argo CD side of the second question and not on the first. Argo CD supports `oci://` sources and an OCI ApplicationSet generator, but the pages read document no OCI signature verification (its source-integrity page covers Git GPG only), while Flux verifies Cosign and Notation signatures with keyless identity matching. No independent write-up or security review showing measurable benefits of signed OCI over Git was found, and no registry rate limits were documented. See [[findings/flux-verifies-cosign-and-notation-signatures-on-oci-artifacts-while-the-argo-cd-pages-read-document-no-oci-signature-verification]] and [[decisions/git-versus-oci-as-the-canonical-source]].

## How Argo CD, Config Connector, ACK, and Cluster API key resources by GVK — status: open

- **Question:** How do Argo CD's resource tracking, Config Connector, ACK, and Cluster API identify and prune resources by GVK, especially across API version changes?
- **Why it matters:** The dossier read no source on this, and the answer determines whether an upstream API version removal or a CRD version change orphans or mis-prunes resources under these tools. See [[concepts/gvk-and-gvr]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Argo CD documentation on resource tracking and pruning across API versions.
  - [ ] Find Config Connector, ACK, and Cluster API documentation on CRD version handling.
  - [ ] Update [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** gvk, argo-cd, config-connector, ack, cluster-api
- **Possible resolution from [[sources/research-gap-m5-informers-caches]]:** Partly settled, and the user decides whether to close it. Argo CD's tracking annotation and gitops-engine `ResourceKey` carry group, kind, namespace and name with no version, Config Connector registers one controller per CRD group and kind with the version taken from the CRD, ACK keys resource manager factories by `GroupKind`, and Cluster API resolves the version from CRD contract labels. Not settled: no documentation or test was read for what each tool does when a served CRD version is removed, so whether pruning or orphaning results is unknown. See [[findings/argo-cd-ack-config-connector-and-cluster-api-identify-resources-by-group-and-kind-and-resolve-the-version-separately]] and [[examples/argo-cd-tracks-resources-by-group-kind-namespace-and-name-so-an-api-version-change-keeps-the-same-key]].

## Informer and cache behavior keyed by GVR — status: open

- **Question:** How do informers and client caches key their watches and stores by GVR or GVK, and what happens to them when a CRD is added, removed, or changes served versions?
- **Why it matters:** The dossier's source on clients and caches returned empty content, so cache behavior is uncovered. See [[concepts/informers-reflectors-and-workqueues]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find controller-runtime and client-go documentation on informer keying and CRD lifecycle.
  - [ ] Write a finding or update [[concepts/informers-reflectors-and-workqueues]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** gvr, informers, cache
- **Possible resolution from [[sources/research-gap-m5-informers-caches]]:** Keying is settled and CRD lifecycle is not, so the user decides whether to close it. controller-runtime keys informers by GVK in structured, unstructured and metadata maps and maps to a GVR through the RESTMapper, client-go's typed factory keys by Go type, and its dynamic factory keys by GVR. Two closed controller-runtime issues (3303 and 2589) are user reports of stale CRD scope and of slow recovery when a CRD appears late. Not settled: what a running informer does when its CRD is deleted or its served versions change was not read from source or documentation. See [[findings/controller-runtime-tracks-informers-by-gvk-while-client-go-factories-key-by-go-type-or-gvr]], [[examples/controller-runtime-issue-3303-a-recreated-crd-with-a-different-scope-was-not-picked-up-by-the-client-or-restmapper]], and [[examples/controller-runtime-issue-2589-a-controller-started-before-its-crd-existed-did-not-recover-until-the-cache-sync-timeout]].

## CRD scale limits — status: open

- **Question:** What are the authoritative limits on the number of CRDs per cluster, custom resources per type, and apiserver memory per CRD, and is the roughly 1.5 MB object limit from a secondary source correct?
- **Why it matters:** No source read gives official numbers, and the object-size figure comes from one independent explainer. See [[findings/etcd-scale-limits-of-the-shared-store]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read official scalability documentation and SIG API Machinery material.
  - [ ] Confirm the etcd request-size default against etcd documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crd, scale, etcd
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Settles one number only. The etcd v3.6 docs state "The default storage size limit is 2 GiB, configurable with `--quota-backend-bytes` flag." The roughly 1.5 MB object limit, CRD-count limits, and per-CRD apiserver memory were not rechecked. See [[findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm]].
- **Possible resolution from [[sources/research-gap-m6-admission-crds]]:** Partly settled, and the user decides whether to close it. No official limit on CRDs per cluster, custom resources per type or apiserver memory per CRD exists in the SIG Scalability thresholds, which cover built-in types only; that negative was verified by full-text search. The roughly 1.5 MB object figure is consistent with etcd's documented 1.5 MiB default request limit, and etcd's default storage limit is 2 GiB with 8 GiB suggested as a maximum. The evidence for CRD count is issue reports: a CPU spike near 700 CRDs, about 8 GiB of apiserver RSS near 1,900 CRDs, and an open one-etcd-client-per-CRD issue. Not settled: an official CRD count limit and official memory per CRD. See [[findings/crd-scale-evidence-is-issue-reports-of-a-cpu-spike-near-700-crds-and-about-8-gib-of-apiserver-memory-near-1900-crds-with-no-official-limit]] and [[findings/etcd-limits-requests-to-1-5-mib-and-storage-to-2-gib-by-default-and-8-gib-is-a-suggested-maximum-not-the-default]].

## CRD handling in Cluster API, Config Connector, ACK, and Backstage — status: open

- **Question:** How do Cluster API, Config Connector, and ACK handle CRD versioning contracts, very large CRDs, and controller scoping, and how does Backstage consume CRDs?
- **Why it matters:** The CRD dossier did not cover them because its searches returned nothing, so no entity pages were extended and no Backstage page was created. See [[entities/cluster-api]], [[entities/config-connector]], and [[entities/ack]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's API versioning and CRD installation documentation.
  - [ ] Find Backstage Kubernetes plugin documentation on custom resources.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, config-connector, ack, backstage, crd
- **Possible resolution from [[sources/research-gap-m6-admission-crds]]:** Partly settled, and the user decides whether to close it. Cluster API labels CRDs with contract versions, forbids breaking changes within a contract version, and runs a CRD migrator for storage version migration. Config Connector ships 883 CRD files with the largest at 579,353 bytes. ACK ships one Helm chart per service with its CRDs in the chart. Backstage reads custom resources only from `kubernetes.customResources` and silently skips a missing CRD. Not settled: a written ACK API-version stability policy and Backstage CRD handling beyond that configuration. See [[findings/cluster-api-labels-crds-with-contract-versions-and-runs-a-crd-migrator-for-storage-version-migration]], [[findings/config-connector-ships-883-crd-files-and-the-largest-is-579-kb-because-it-has-one-crd-per-google-cloud-resource-kind]], [[findings/ack-ships-one-helm-chart-per-service-with-its-crds-in-the-chart-and-no-written-api-version-policy-was-found]] and [[findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd]].

## Contents of the k8s.af admission webhook postmortems — status: open

- **Question:** What do the linked postmortems on admission webhook outages, such as the 2019 Jetstack post and the Airbnb KubeCon NA 2020 talk, actually report?
- **Why it matters:** The dossier read only index entries. See [[findings/admission-webhook-outages-are-a-recurring-failure-class]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Open and summarize the linked posts.
- **Drafted by:** agent on 2026-11-25
- **Tags:** webhooks, postmortems
- **Possible resolution from [[sources/research-gap-g1-outage-postmortems]]:** Half settled, and the user decides whether to close it. The 2019 Jetstack post was read in full through a Wayback capture of the Venafi copy: an OPA validating webhook blocked the API server's `ca-registration` write to the `extension-apiserver-authentication` ConfigMap, the master crash-looped, and node auto-repair then recreated nodes in a loop. The fix was deleting the webhook, and the follow-ups were scoping it to Ingress and Service resources and adding a livenessProbe. The Airbnb KubeCon NA 2020 talk is a video with no transcript obtained, so its contents stay unread, and the k8s.af index (78 entries, newest 2023) has only these two webhook-tagged entries. See [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]] and [[findings/an-unresponsive-validating-webhook-can-block-the-api-server-s-own-startup-write-and-crash-loop-a-master-upgrade]].

## kro status schema and Crossplane v2 status propagation — status: open

- **Question:** How do kro ResourceGraphDefinitions define and populate instance status, and how does Crossplane v2 propagate readiness from a function pipeline into composite status?
- **Why it matters:** The dossier read only the kro overview (the RGD URL returned 404) and not the Crossplane composition-function documentation. See [[entities/kro]] and [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Fetch the kro ResourceGraphDefinition docs and the Crossplane composition-function docs.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, crossplane, status
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful for kro. The RGD reference documents `readyWhen`, `includeWhen`, and the RGD conditions (`Ready`, `GraphAccepted`, `KindReady`, `ControllerReady`), and the status-conditions page documents author-defined instance conditions through `runtime.newCondition()`. The Instances page returned no content and Crossplane v2 was not read. See [[examples/kro-rgd-authors-define-instance-conditions-with-cel-and-readywhen]].
- **Possible resolution from [[sources/research-gap-g3-kro]]:** Settled for kro, partly settled for Crossplane, so the user should decide whether to close it. kro: `spec.schema.status` maps field names to CEL expressions and the generated CRD types them, kro adds `conditions` and `state` to every instance status (and overrides `state`), authors use `runtime.newCondition`, and the RGD has five conditions (`Ready`, `GraphRevisionsResolved`, `GraphAccepted`, `KindReady`, `ControllerReady`) with its own `Active` or `Inactive` state. Crossplane: the docs say a composite has `Synced` and `Ready`, with `Ready` True when the function pipeline reports all composed resources ready, and the v2.5 guide shows `function-auto-ready`. A Draft design one-pager (SECONDARY-ONLY) says a fatal function result sets `Synced` False. Not settled: the mechanism by which a function's per-resource ready signal becomes the composite `Ready` condition, because the function SDK, the `RunFunctionResponse` readiness field, and the propagation code were not read. See [[concepts/spec-status-split]] and [[entities/kro]].
- **Possible resolution from [[sources/research-gap-b1-recheck-kro-crossplane]]:** Settled for the open Crossplane half, and the user decides whether to close it. In Crossplane v2.5.0 source a composed resource is ready only when its function returns `READY_TRUE` (both `READY_FALSE` and `READY_UNSPECIFIED` count as not ready). The XR `Ready` condition is then `Available` when no composed resource is unready and `Creating` with an "Unready resources: ..." message otherwise, an explicit XR-level ready from the function overrides the derived value, and `Synced` is `ReconcileSuccess` unless a composed resource is unsynced. `function-auto-ready` skips resources that already have explicit readiness and otherwise tries optional CEL queries and resource-specific health checks, with an observed `Ready=True` condition as the final fallback (corrected in the dossier's second verification pass). The kro half gained source confirmation of the four built-in instance conditions (`Ready` rooted over `InstanceManaged`, `GraphResolved`, and `ResourcesReady`) and of build-time validation of author conditions. Not settled: whether the TODO about deriving readiness from an unspecified value will change the behavior. See [[findings/a-crossplane-composed-resource-counts-as-ready-only-when-the-function-sets-ready-true-so-unspecified-readiness-leaves-the-xr-creating]] and [[findings/kro-validates-author-defined-conditions-at-build-time-so-a-bad-status-or-a-duplicate-type-is-rejected-before-an-instance-exists]].
- **Possible resolution from [[sources/research-gap-o8-crossplane-residuals]]:** Settled for the `function-kro` route and not settled for a standalone kro controller, and the user decides whether to close it. `function-kro` embeds kro's engine, approximates the kro built-in conditions from one run with `InstanceManaged` omitted, sets only declared status paths on the desired XR, returns author conditions as XR conditions, and treats not-ready resources as `allReady` false and real errors as fatal. Not settled: where it marks per-resource readiness was not located, and no documentation was found of a standalone kro controller feeding a Crossplane composite. See [[findings/function-kro-approximates-kro-built-in-conditions-from-one-run-and-writes-only-declared-status-paths-to-the-desired-xr]] and [[findings/no-documentation-was-found-of-a-standalone-kro-controller-feeding-a-crossplane-composite-and-function-kro-s-readiness-link-is-unlocated]].

## Config Connector and Argo CD status semantics beyond health checks — status: open

- **Question:** What conditions and generation tracking do Config Connector resources publish, and how does Argo CD interpret status beyond its health checks?
- **Why it matters:** No primary source on Config Connector was fetched and Argo CD was read only for health. See [[entities/config-connector]] and [[entities/argo-cd]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource status documentation and Argo CD's resource tracking documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, argo-cd, status
- **Possible resolution from [[sources/research-conditions]]:** Largely helpful for Config Connector. The reconcile-status design document describes a single `Ready` condition with reasons `Updating`, `UpToDate`, and `UpdateFailure` and `observedGeneration` set on status update, though it is a design document and may not match shipped behavior. Argo CD was read for health only. See [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]].
- **Possible resolution from [[sources/research-gap-m3-status-conditions]]:** Largely settled for Config Connector and partly for Argo CD, so the user decides whether to close it. Config Connector publishes one `Ready` condition, replaced as a whole list, with shipped reasons `Updating`, `UpToDate`, `UpdateFailed`, `DependencyNotReady`, `DependencyNotFound`, `DependencyInvalid`, `ManagementConflict`, and `Unmanaged`, a top-level `status.observedGeneration`, and matching Kubernetes events. Argo CD's Application has a sync status (Synced, OutOfSync, Unknown), typed error, warning, and info conditions with no status field, `reconciledAt` (with `observedAt` deprecated), and annotation-based resource tracking by default, and its Config Connector Lua script maps the shipped reasons to health. Not settled: Argo CD's operation-state docs, sync-phase docs, and the controller code that aggregates per-resource sync status were not read. See [[entities/config-connector]], [[entities/argo-cd]], and [[examples/argo-cd-s-config-connector-health-script-maps-uptodate-to-healthy-updatefailed-to-degraded-and-gates-on-observedgeneration]].


## Where observedGeneration should live — status: open

- **Question:** Should `observedGeneration` live at the top level of status, on each condition, or both, given that the conventions say per condition while Flux and Cluster API use a top-level field?
- **Why it matters:** Consumers need one rule to detect stale status. See [[comparisons/observedgeneration-top-level-versus-per-condition]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the final 15,000 characters of the API conventions and the Flux and Cluster API contract documents.
- **Drafted by:** agent on 2026-11-25
- **Tags:** observedgeneration, conditions
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful. KEP-1623 puts `observedGeneration` on each condition as a non-pointer integer, kro describes the per-condition value precisely, and kstatus checks the top-level field, but the dossier states that no source settles the choice. See [[comparisons/observedgeneration-top-level-versus-per-condition]].
- **Possible resolution from [[sources/research-gap-m3-status-conditions]]:** Not settled by any source, and the dossier did not try to settle it. The conventions describe both a status-level and a per-condition `observedGeneration` without ranking them, KEP-1623 is stable and makes the per-condition field a non-pointer integer, kstatus and Argo CD read only the top-level field, Flux writes both, Cluster API moved to `metav1.Condition`, and Config Connector writes only the top-level value. The dossier frames the choice as three options with trade-offs and gives no recommendation. The earlier open item about the final 15,000 characters of the conventions is resolved: they state no placement rule. See [[decisions/place-observedgeneration-at-the-top-level-on-each-condition-or-both]], [[comparisons/observedgeneration-top-level-versus-per-condition]], and [[findings/kstatus-reads-only-the-top-level-observedgeneration-because-its-condition-struct-has-no-per-condition-field]].


## Generic readiness when Cluster API moves from Ready to Available — status: open

- **Question:** How should generic tools such as Flux and kstatus judge Cluster API objects now that Cluster API is replacing `Ready` with `Available`?
- **Why it matters:** Flux added CEL health checks, but a general answer is unresolved. See [[findings/premature-readiness-in-kstatus-based-tools]] and [[entities/cluster-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API condition-transition proposal and Flux CEL health check documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, kstatus, flux
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful. The Cluster API proposal explains the move to `Available` and operation conditions and says Flux uses CEL health checks for Cluster API, but it offers no general rule for generic tools. See [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]].
- **Possible resolution from [[sources/research-gap-g3-argocd-capi]]:** Partly settled, and not answered in full. The change is narrower than the title implies: the proposal drops `Ready` from higher-level objects such as Cluster and control planes and adds `Available`, while Machine keeps `Ready` meaning "machine can host workloads", and v1beta2 shipped in v1.11.0. No Cluster API or Flux page gives a general rule for kstatus-style tools, and Flux's community CEL cheatsheet still keys a v1beta1 Cluster on `Ready` with no v1beta2 variant found. The evidence supports per-kind CEL expressions that check `Available` plus `spec.availabilityGates`. The claim that a naive kstatus tool sees a v1beta2 Cluster as reconciled is an UNVERIFIED inference. See [[findings/the-flux-cel-cheatsheet-keys-cluster-api-health-on-ready-and-shows-no-v1beta2-available-variant]], [[examples/cluster-api-adds-available-and-operation-conditions-beside-ready]], and [[findings/premature-readiness-in-kstatus-based-tools]].
- **Possible resolution from [[sources/research-gap-b1-recheck-capi-argocd]]:** Partly settled, and not closed. Verified: the v1beta2 Cluster type at v1.15.0-rc.0 defines an `Available` condition constant and no `Ready` constant, and the kstatus README says a resource without a `Ready` condition falls back to "assume they are always reconciled", after the `Reconciling` and `Stalled` checks. Not settled: whether a kstatus-style tool therefore reports a v1beta2 Cluster as Current regardless of `Available` is an inference. No source states it, nobody ran kstatus against a v1beta2 Cluster, and the generation check could change the result during a pending spec change. Cluster API does not appear to publish `Reconciling` or `Stalled` on the Cluster type (not checked exhaustively), and Flux CEL documentation was not re-read. See [[findings/kstatus-treats-an-unknown-kind-without-a-ready-condition-as-always-reconciled]] and [[entities/kstatus]].

## Named case studies and postmortems for status problems — status: open

- **Question:** Are there named end-user case studies or postmortems about reconcile loops, stale status, or false readiness caused by status handling?
- **Why it matters:** The dossier found only project docs and issues. See [[findings/misleading-readiness-and-stale-status]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search conference talks and public postmortems.
- **Drafted by:** agent on 2026-11-25
- **Tags:** case-studies, postmortems, status
- **Possible resolution from [[sources/research-conditions]]:** Marginally helpful. The dossier found no postmortems or talks, but it adds one more issue-level case, provider-aws issue 2287, where `Synced` stayed True through a 60-minute update. See [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]].
- **Possible resolution from [[sources/research-gap-g1-operator-loop-failures]]:** Partly settled, and the user decides whether to close it. No postmortem or conference talk on status handling was found. The dossier gives three named, reproducible, open 2026 issues in which Ready or Healthy is reported for a spec generation the controller has not yet seen: CloudNativePG 1.30.0 issue 11390, restate-operator 3.1.0 issue 216 (where Flux `wait: true` marked a release healthy about 37 seconds early), and Argo CD issue 30373 (the built-in ACK health check). All were filed as bugs with self-reported timings, and no fix is known. It also shows the opposite failure, status written too often, in the Cluster API provider RKE2, Crossplane 7221, and Longhorn 13831 loops. See [[findings/ready-can-be-reported-for-a-spec-generation-the-controller-has-not-yet-observed]], [[examples/cloudnativepg-issue-11390-kubectl-wait-for-ready-can-return-on-a-condition-produced-before-the-spec-change]], and [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]].

## Server-side apply behavior in kro, ACK, Config Connector, and Helm 4 — status: open

- **Question:** How do kro, ACK, Config Connector, and Helm 4 set field managers, force conflicts, and reconcile fields owned by other controllers, and does Helm 4.0.0 really enable server-side apply by default for new releases?
- **Why it matters:** The dossier could not read a primary source for any of them: the kro page returned empty content, no ACK or Config Connector page was found, and the Helm 4 default rests on one personal blog. See [[comparisons/ssa-conflict-policy-across-tools]] and [[entities/helm]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's documentation or source for field manager names and force behavior.
  - [ ] Find the Helm 4 release notes and the upgrade behavior for releases created with client-side apply.
  - [ ] Add rows to [[comparisons/ssa-conflict-policy-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** server-side-apply, kro, ack, config-connector, helm
- **Possible resolution from [[sources/research-gap-b1-recheck-flux-k8s]]:** Settles the Helm 4 part only, and the user decides about the rest. The helm.sh overview says Helm 4 defaults to server-side apply when installing a new release and follows the previous release's method on upgrade and rollback, so releases created by Helm 3 stay on client-side apply. The CLI has `--server-side` (true, false, auto) and `--force-conflicts`, and helm-controller defaults `.spec.install.serverSideApply` to true and the upgrade and rollback fields to `auto`, with `force` ignored under server-side apply. kro, ACK, and Config Connector were not read in this pass, and the field manager name Helm uses was not read. See [[findings/helm-4-defaults-to-server-side-apply-for-new-releases-and-helm-controller-keeps-the-previous-method-on-upgrade]] and [[entities/helm]].
- **Possible resolution from [[sources/research-gap-m4-ssa-conflict-policy]]:** Settled for kro, ACK, and Helm 4 from source, partly settled for Config Connector, and the user decides whether to close it. kro applies template resources with server-side apply and force, applies patch contributions without force, uses the managers `kro.run/applyset` and `kro-instance-status`, and has an opt-in mode that refuses to take a field from another Graph. The ACK runtime sends merge patches and sets no server-side apply manager, which rests on absence in the runtime repository, and the per-service controllers were not read. Config Connector writes with Update under `cnrm-controller-manager` and reads other managers' fields as user intent, but its public docs page was unreadable, so that row rests on source and issues. Helm 4 main defaults `helm install` to server-side apply, names its manager after the binary, does not force unless `--force-conflicts` is set, and upgrades the client-side manager on a method switch, while helm-controller always forces. Not settled: the Helm v4.0.0 tag itself was not read, and Helm issue 32706 was read by title only. See [[findings/kro-applies-template-resources-with-server-side-apply-and-force-and-applies-patch-contributions-without-force]], [[findings/the-ack-runtime-sends-merge-patches-and-sets-no-server-side-apply-field-manager]], [[findings/config-connector-writes-with-update-under-cnrm-controller-manager-and-reads-other-managers-fields-as-user-intent]], [[findings/helm-4-install-defaults-to-server-side-apply-names-its-manager-after-the-binary-and-forces-conflicts-only-when-asked]], and [[comparisons/ssa-conflict-policy-across-tools]].

## Best default conflict policy for teams running GitOps and in-cluster controllers — status: open

- **Question:** What default conflict policy should a platform team choose when a GitOps tool and in-cluster controllers write the same objects, given that the Kubernetes maintainers advise controllers to force and CD tools to surface conflicts while Argo CD and Flux both force?
- **Why it matters:** The dossier says its sources do not settle the question, and the answer decides whether revert loops or blocked automation are the more likely failure. See [[decisions/force-conflicts-or-surface-them-to-humans]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find practitioner write-ups or SIG API Machinery discussion of parsing `managedFields` to ignore conflicts.
  - [ ] Find a named adopter's policy for mixed GitOps and controller ownership.
- **Drafted by:** agent on 2026-11-25
- **Tags:** server-side-apply, gitops, conflict, decision
- **Possible resolution from [[sources/research-gap-m4-ssa-conflict-policy]]:** Not settled, and the dossier does not recommend a default. It groups the evidence by position. Force by default: the Kubernetes documentation for controllers, Argo CD, helm-controller, Cluster API's topology controller, and kro's template applies. Surface or yield: the Kubernetes resolution options, Flux Strip and Adopt, kro's patch nodes and conflict detection, Config Connector reading other managers' fields, and Argo CD's `managedFieldsManagers`. Forcing also has limits, since a forced apply failed in Kubernetes issue 130292. No named adopter policy for mixed ownership and no SIG API Machinery discussion of parsing `managedFields` to ignore conflicts was found, and the two practitioner write-ups are SECONDARY-ONLY. See [[decisions/force-conflicts-or-surface-them-to-humans]] and [[examples/the-kube-green-case-study-says-managedfieldsmanagers-works-today-but-is-not-a-documented-contract-between-the-projects]].

## Crossplane v2 server-side apply behavior and external writers — status: open

- **Question:** How does Crossplane v2 use server-side apply compared with the v1.20 alpha page, and is Crossplane issue 7453 (an external controller's forced field disappearing from a composite resource on v2.3.1) a real bug or a `managedFields` visibility mistake?
- **Why it matters:** The dossier read only the v1.20 concept page and an unresolved, stale issue whose claim a maintainer could not reproduce. See [[findings/managedfields-are-hidden-from-kubectl-output-by-default]] and [[entities/crossplane]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Crossplane documentation on server-side apply and composition functions.
  - [ ] Check whether issue 7453 was reproduced or closed.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, server-side-apply, verification
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Partly settled. The v2.5 docs have no SSA page for XRs, so behavior comes from source: the composite reconciler applies `resourceRefs` and status with force ownership under the field owner `apiextensions.crossplane.io/composite`, and composed resources use owners prefixed `apiextensions.crossplane.io/composed`. Issue 7453 is still open with labels `bug` and `stale`, a maintainer could not reproduce it on v2.3.1, and two community PRs (7783, 7787) that assume a real bug are open and unmerged. The wiki can say "reported, not reproduced by a maintainer, open", and cannot say whether it is a real bug. See [[examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource]].
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Not settled, and the state is re-confirmed. Issue 7453 is still open with labels `bug` and `stale` as of 2026-11-26, a stale-bot comment says it closes in 14 days without activity, and the maintainer who could not reproduce it on v2.3.1 suggested `kubectl get -o yaml` hides `managedFields`. Pull requests 7783 and 7787 remain open and unmerged. The reporter's claim that the XR controller clears `managedFields` stays SECONDARY-ONLY and disputed, so the wiki still cannot say whether it is a real bug. See [[examples/crossplane-issue-7453-reports-an-external-ssa-writer-losing-a-field-on-a-composite-resource]].
- **Possible resolution from [[sources/research-gap-b1-recheck-kro-crossplane]]:** Not settled, and the source reading is inconclusive. v2.5.0 applies resource references and status with `client.Apply` and force ownership under the owner `apiextensions.crossplane.io/composite`, composed resources use per-XR owners prefixed `apiextensions.crossplane.io/composed`, and a `TODO(adamwg)` to stop using `client.Apply` after v2.2 is still present on main. The status apply sends only status, conditions, and deletion policy through the status subresource, so it does not obviously prune a spec field owned by another manager, and no code path that clears `managedFields` was found, though the finalizer update and claim propagation paths were not traced. No cluster was run, so issue 7453 was not reproduced on v2.5.0. It is still open with the labels `bug` and `stale`, and pull requests 7783 and 7787 are open and unmerged. The wiki can still say only "reported, not reproduced by a maintainer, open". See [[examples/crossplane-pull-requests-7783-and-7787-say-fromstruct-drops-managedfields-on-the-composite-resource]].

## Cluster API field ownership rules and Argo CD Server-Side Diff stability — status: open

- **Question:** Which fields does the Cluster API topology controller own compared with infrastructure and control plane providers, and is Argo CD Server-Side Diff stable since 3.1.0 as one blog claims?
- **Why it matters:** The dossier read only the Cluster API pull request description and relied on a personal blog for the Argo CD stability claim. See [[examples/cluster-api-topology-controller-uses-ssa-for-co-authored-objects]] and [[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API book on ClusterClass topology and server-side apply.
  - [ ] Read the Argo CD diff-strategies documentation.
  - [ ] Check whether `kubectl` made server-side apply the default.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, argo-cd, server-side-diff, verification
- **Possible resolution from [[sources/research-gap-m4-ssa-conflict-policy]]:** Partly settled, and the user decides whether to close it. Cluster API's topology controller applies under the manager `capi-topology` with force ownership, the book says this lets other controllers co-author generated objects, and the troubleshooting page documents infinite reconcile for co-authored list slices and a failure to remove list items after atomic-to-map transitions. A per-field table of fields owned by the topology controller versus providers was searched for and not found, so that half stays open. Argo CD's diff-strategies page says Server-Side Diff is "Stable (Since v3.1.0)", which confirms the blog claim, but 20 or more Server-Side Diff issues remain open, and no maintainer statement reconciles the label with them. Whether `kubectl` made server-side apply the default was not answered. See [[findings/cluster-api-co-authored-list-slices-can-reconcile-forever-and-server-side-apply-can-fail-to-remove-list-items]], [[findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs]], and [[examples/argo-cd-issue-28861-stale-managedfields-leave-an-application-permanently-out-of-sync-under-server-side-diff]].

## Kyverno webhook failure modes and availability — status: open

- **Question:** How does Kyverno configure its own webhook failurePolicy, and how does it behave when its pods are unavailable?
- **Why it matters:** Kyverno was documented only for its CEL policy types, so the resilience benefit of generated native policies is unquantified. See [[comparisons/kyverno-versus-native-validating-admission-policy]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Kyverno documentation on webhook configuration and availability.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kyverno, webhooks, availability
- **Possible resolution from [[sources/research-gap-m6-admission-crds]]:** Partly settled, and the user decides whether to close it. Kyverno policies default to failure policy Fail with a 10 second timeout, the Kyverno and kube-system namespaces are excluded by default, three admission replicas are the HA minimum, and an all-pods-down outage is recovered by deleting the resource webhook configurations. Not settled: measured availability numbers, and any resilience comparison of Kyverno-generated native ValidatingAdmissionPolicy with webhook mode. See [[findings/kyverno-defaults-to-failure-policy-fail-with-a-10-second-timeout-and-needs-three-admission-replicas-for-high-availability]] and [[findings/kyverno-fail-closed-policies-time-out-api-requests-when-all-kyverno-pods-are-down-unless-the-kyverno-namespace-is-excluded]].

## Named operator failure postmortems — status: open

- **Question:** Which named organizations have published postmortems of operator failures such as stuck finalizers, reconcile storms, or CRD upgrade breakage, and what did they conclude?
- **Why it matters:** The operator-pattern dossier found no named-company case study, so its pitfall catalog rests on documentation. See [[concepts/operator-pattern]] and [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find published incident write-ups for operator outages and summarize them.
  - [ ] Link each to the matching finding page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** operators, postmortems, finalizers
- **Possible resolution from [[sources/research-finalizers]]:** Not helpful, although the Kubebuilder book gives the finalizer pattern. See [[entities/kubebuilder]].
- **Possible resolution from [[sources/research-gap-g1-operator-loop-failures]]:** Not settled, and the answer is mostly negative, so the user decides whether to close it. No formal, organization-authored postmortem of a Kubernetes operator failure was found. The k8s.af index of about 60 stories has no entry whose stated involvement is an operator or custom controller bug, and its nearest entries (Jetstack's webhook outage and Xing's "stuck controllers" talk) were not read in full. The nearest evidence is Longhorn issue 14121, a user bug report in which retries against a dead S3 backup target grew `longhorn-manager` memory about 25 times, caused OOM kills, and flapped nodes, with self-reported figures and the issue still open. See [[findings/no-formal-organization-authored-postmortem-of-an-operator-failure-was-found]] and [[examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold]].

## Criteria for choosing an operator framework or language — status: open

- **Question:** What criteria should a team use to choose among Kubebuilder, Operator SDK, Kopf, the Java Operator SDK, kube-rs, KubeOps, and Metacontroller, given that the CNCF white paper favors Go while the Kubernetes page lists many languages?
- **Why it matters:** No source in the dossier gives selection criteria. See [[entities/operator-sdk]] and [[entities/kube-rs]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find framework comparisons or maintainers' guidance.
  - [ ] Write a `comparisons/` page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** operators, frameworks, language
- **Possible resolution from [[sources/research-gap-m7-operators-idempotency]]:** Not settled, and the user decides whether anything changes. The dossier searched project READMEs and the Kubebuilder book introduction and found no selection criteria, only each project's self-description, so the question of how to choose is still unanswered. It did supply verified self-descriptions for Kubebuilder, the Operator SDK (Go, Ansible, or Helm), the Java Operator SDK, Kopf (maintainer says no major new functionality is in development), shell-operator, and Metacontroller (a JSON webhook in any language), which are laid out without a ranking in [[comparisons/operator-frameworks-by-self-description-kubebuilder-operator-sdk-java-operator-sdk-kopf-shell-operator-and-metacontroller]] and [[decisions/choose-an-operator-framework-or-language-from-kubebuilder-operator-sdk-josdk-kopf-shell-operator-metacontroller-or-composition]]. The claim that the CNCF white paper favors Go is UNVERIFIED, and kube-rs and KubeOps were not searched.

## Operator SDK capability levels for composition-based operators — status: open

- **Question:** How strictly do the five Operator SDK capability levels apply to non-Go or generic-composition operators such as kro and Crossplane?
- **Why it matters:** The dossier calls the level descriptions high level and unclear for these tools. See [[entities/operator-sdk]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Operator Framework documentation on scope of the levels.
  - [ ] Map each level to Crossplane and kro features if applicable.
- **Drafted by:** agent on 2026-11-25
- **Tags:** operators, maturity-model, crossplane, kro
- **Possible resolution from [[sources/research-finalizers]]:** Marginally helpful. The dossier shows how Argo CD's Application finalizer and Config Connector's deletion policy behave at deletion, but not how either handles failures more broadly. See [[entities/argo-cd]] and [[entities/config-connector]].
- **Possible resolution from [[sources/research-gap-m7-operators-idempotency]]:** Partly settled, and the user decides whether to close it. The levels page says an operator that does not manage a workload or delegates to off-cluster orchestration services "would remain at Level 1", and that capabilities "may be independent of each other". It never mentions Crossplane, kro, or composition, so a level-by-level mapping for those tools exists in no Operator Framework source and would be the wiki's own inference. See [[findings/operator-sdk-capability-levels-keep-delegating-operators-at-level-1-and-say-nothing-about-composition-tools]] and [[entities/operator-sdk]].

## Argo CD and Config Connector as operators — status: open

- **Question:** How do Argo CD and Config Connector handle failures as operators, and do they follow the one-controller-per-concern guidance?
- **Why it matters:** The operator-pattern dossier fetched no page on either tool. See [[entities/argo-cd]] and [[entities/config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD and Config Connector architecture documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, config-connector, operators
- **Possible resolution from [[sources/research-finalizers]]:** Not helpful. The dossier does not cover Backstage.
- **Possible resolution from [[sources/research-gap-m7-operators-idempotency]]:** Partly settled, and the user decides whether to close it. Failure handling is answered from primary documentation: Argo CD retries failed syncs with exponential backoff and retries self-heal after 5 seconds by default, and Config Connector retries with exponential backoff capped at 2 minutes and converges in any creation order. The one-controller-per-concern question is not answered, because the pages read describe the component split without citing that guidance and the Config Connector controller-types page was not read. See [[findings/argo-cd-and-config-connector-document-bounded-exponential-backoff-and-status-based-health-for-failure-handling]].

## Backstage and the operator pattern — status: open

- **Question:** How does Backstage relate to the operator pattern, for example as a portal over operator-managed custom resources?
- **Why it matters:** No source in the wiki covers Backstage, so the platform-engineering layer above operators is missing. See [[concepts/operator-pattern]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Backstage documentation on Kubernetes and custom resource integration.
- **Drafted by:** agent on 2026-11-25
- **Tags:** backstage, platform-engineering
- **Possible resolution from [[sources/research-composite-resource]]:** Not helpful. The dossier does not mention Backstage, although it notes that composite kinds are consumed as products by other teams and that Kratix uses Crossplane as a component.
- **Possible resolution from [[sources/research-gap-m7-operators-idempotency]]:** Partly settled, and the user decides whether to close it. The Kubernetes plugin is documented as entity-label driven and read-oriented, with configured custom resources, a proxy endpoint, and silent skipping of a missing CRD, so Backstage is a portal over operator-produced resources and not an operator. No Backstage document describes an operator pattern, Software Templates were not read, and the community Crossplane and Argo CD plugins are SECONDARY-ONLY. See [[findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern]] and [[examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift]].
- **Possible resolution from [[sources/research-gap-o6-platform-landscape]]:** Partly settled, and the user decides whether to close it. The Kubernetes configuration page shows a label-driven, read-oriented portal with custom resources defaulting to an empty list and a proxy option, and the Software Templates overview describes the Scaffolder as a run-once task runner, so no Backstage document read describes an operator pattern. The nearest operator-style integration is the third-party TeraSky Kubernetes Ingestor, which syncs Crossplane claims and kro instances into the catalog (SECONDARY-ONLY). Not settled: the Scaffolder builtin-actions and writing-templates pages were not read, so whether any action creates Kubernetes custom resources is unverified. See [[findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin]] and [[examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog]].

## Named postmortems of runaway reconcile loops — status: open

- **Question:** Which named organizations have published postmortems of a runaway or self-triggered reconcile loop, and what were the causes and fixes?
- **Why it matters:** The dossier found only guidance and no incident reports, so the self-triggered loop finding rests on secondary sources. See [[findings/self-triggered-reconcile-loops-generate-their-own-events]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search public postmortem collections and controller issue trackers for reconcile storms.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortems, hot-loop
- **Possible resolution from [[sources/research-gap-g1-operator-loop-failures]]:** Largely settled at the level of named projects with root-cause issues, and not settled for formal postmortems, so the user decides whether to close it. The dossier documents five named runaway-loop cases, all reporter accounts with self-reported rates: Cluster API provider RKE2 issue 905 (about 10 reconciles per second from an unconditional status patch), Longhorn issue 13831 (about 6 per second from volatile request IDs and timestamps in a condition message), Konflux kube-shard issue 121 (about 13 per second from two server-side applies of one ConfigMap with an unfiltered `Owns`), Crossplane issue 7221 (an unconditional `Status().Update()`), and Argo CD issue 18151 (a raised PATCH rate after the 2.11 upgrade, symptom only, no confirmed cause). Two causes recur: an unconditional status write per pass, and a write that is idempotent in meaning but not in bytes. Longhorn issue 14121 adds the cost of a retry with no backoff. No organization-authored postmortem was found. See [[findings/a-status-patch-or-update-on-every-pass-keeps-a-controller-in-a-self-sustaining-reconcile-loop]], [[findings/volatile-text-in-a-condition-message-defeats-the-equality-check-and-causes-a-reconcile-storm]], [[findings/applying-one-object-twice-in-a-reconcile-with-owns-and-no-predicate-loops-on-its-own-resource-version]], and [[findings/a-retry-loop-with-no-backoff-or-target-health-gate-grows-controller-memory-during-a-dependency-outage]].

## kro and Cluster API idempotency for external and infrastructure creates — status: open

- **Question:** How do kro (repeated reconciliation and partial failure of a resource graph) and Cluster API (provisioning infrastructure through providers) keep creates idempotent, and do they use markers, deterministic names, or adoption like Crossplane, ACK, and Config Connector?
- **Why it matters:** The idempotency dossier could not read kro's instance and reconciliation pages (empty scrape) and found no readable Cluster API source, so two of the tools in scope are missing from [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the kro instances and reconciliation documentation.
  - [ ] Read the current Cluster API book on infrastructure providers and machine creation.
  - [ ] Add rows to the comparison.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, cluster-api, idempotency
- **Possible resolution from [[sources/research-gap-m7-operators-idempotency]]:** Largely settled for kro and at contract level for Cluster API, and the user decides whether to close it. kro labels children, tracks them with ApplySet, records intended children in `status.managedResources` before applying, applies without force, and retries with bounded backoff, but only for Kubernetes children. Cluster API tells providers to use provider-owned tags and deterministic hashed names and states no lost-create algorithm. How specific Cluster API infrastructure providers recover after a lost create response was not read (UNVERIFIED). Rows were added to [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]]. See [[findings/kro-records-the-resources-it-is-about-to-create-in-status-before-applying-them-and-applies-without-force]] and [[findings/cluster-api-tells-providers-not-to-use-a-derived-name-as-the-only-lookup-key-and-states-no-lost-create-algorithm]].

## Production outcomes of adopt-or-create versus explicit import — status: open

- **Question:** What do production teams report when they use ACK `adopt-or-create`, Config Connector acquisition, or Crossplane Observe-then-manage, compared with SAP's explicit-intent design, and which default is safer?
- **Why it matters:** The dossier says the sources do not compare outcomes, so [[decisions/adopt-or-create-or-require-explicit-import]] cannot be settled.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find adopter write-ups, talks, or issue threads on accidental adoption or overwritten resources.
  - [ ] Update the decision page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, ack, config-connector, crossplane
- **Possible resolution from [[sources/research-gap-g1-leaked-resources-adoption]]:** Partly settled, and the user decides whether to close it. The dossier found no production comparison and no adopter write-up of `adopt-or-create`, Config Connector acquisition, or Crossplane Observe-then-manage, so "which default is safer" stays a judgment. It does give reproduced failure modes of adoption. ACK `adopt-or-create` adopts a found resource with no check on whether another custom resource manages it, so two custom resources overwrote one IAM role and deleting either deleted it (issue 3149, iam-controller v1.11.3 against moto, not real AWS). ACK handles Role and Policy differently (issue 3103), and adopted EKS Cluster and RDS DBCluster resources failed to converge (issues 3123 and 2728). Config Connector acquisition of an existing bucket removed settings the CRD does not model (issue 14236, a reporter claim, open). Explicit adopt or import fails closed and loud, `adopt-or-create` fails open and quiet, and strict create-only duplicates resources when a create result is lost. Most late-2026 ACK reports come from one reporter, and Crossplane's Observe-first flow produced no accidental-adoption reports in the searches. Open proposals, not shipped fixes, are ACK owner tags (issue 3143) and Config Connector's terminal-failure posture (issue 12740). See [[examples/ack-issue-3149-adopt-or-create-let-two-custom-resources-overwrite-one-iam-role-and-deleting-either-deleted-it]], [[examples/config-connector-issue-14236-acquiring-an-existing-storage-bucket-removed-its-encryption-enforcement-config]], [[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]], [[findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import]], and [[decisions/adopt-or-create-or-require-explicit-import]].

## Postmortems of leaked or duplicated cloud resources from ambiguous creates — status: open

- **Question:** Are there named postmortems or conference talks describing leaked or duplicated cloud resources after a controller crashed between a create call and recording its result?
- **Why it matters:** The dossier's evidence is GitHub issues only, such as Crossplane issue 3037, so [[findings/an-ambiguous-create-result-halts-reconciliation-until-a-human-intervenes]] lacks incident accounts with cost or scale.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search public incident reports and talks on Crossplane, ACK, and Config Connector.
  - [ ] Check whether the Crossplane maintainers' proposed opt-out for deterministic identifiers shipped.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, idempotency, external-resources
- **Possible resolution from [[sources/research-gap-g1-leaked-resources-adoption]]:** Partly settled, and the user decides whether to close it. The literal question, a named postmortem or conference talk, is not answered: none was found, and blogs and talks are under-sampled because one web search returned nothing and GitHub was the main channel. The second how-to-close item is answered: the Crossplane opt-out for deterministic identifiers shipped as `WithDeterministicExternalName` in crossplane-runtime main, but provider-upjet-aws issue 2251 (open) says upjet controllers do not set it. The dossier does supply issue-level incidents with dates and reporter-measured figures: a duplicate VPC endpoint and about 2 hours of blocked subnet deletion in an ACK CI run (issue 3122, with the overlapping-pod cause inferred), one duplicate Route 53 hosted zone per name after a two-cluster GitOps bootstrap (issue 3067), a reported $155 over 15 days from a 409 retry loop after a lost external name (issue 2199), and an ACK audit counting 48 resources in 22 controllers exposed to a lost create response (issue 3177, an author's audit and not an incident count). ACK runtime pull request 292 merged on 2026-11-20. See [[examples/ack-issue-3122-a-controller-restart-during-a-rollout-created-a-second-vpc-endpoint-and-blocked-subnet-deletion-for-about-two-hours]], [[examples/provider-upjet-aws-issue-2199-a-lost-external-name-after-a-provider-restart-became-a-409-retry-loop-reported-at-about-155-dollars-over-15-days]], [[findings/provider-upjet-aws-controllers-do-not-set-withdeterministicexternalname-so-deterministically-named-resources-stay-stuck-after-a-transient-error]], [[findings/an-ack-audit-found-48-resources-in-22-controllers-where-a-lost-create-response-duplicates-the-resource-or-wedges-the-custom-resource]], and [[findings/no-named-postmortem-or-production-comparison-was-found-for-leaked-resources-or-adopt-or-create-versus-explicit-import]].

## Cache narrowing options in controller-runtime — status: open

- **Question:** Which controller-runtime options (cache selectors, transforms, disabling the cache for specific types, metadata-only informers) reduce informer cache memory, and what do they cost?
- **Why it matters:** The cache blog says memory grows with watched objects and has no eviction, but only about 100,000 of about 150,000 characters were read, so the mitigations may be in the unread part.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the rest of the controller-runtime cache blog and the cache package documentation.
  - [ ] Update [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cache, memory, controller-runtime
- **Possible resolution from [[sources/research-gap-m5-informers-caches]]:** The options and their documented costs are settled, the memory savings are not, and the user decides whether to close it. `cache.Options` provides `ByObject`, namespace and selector defaults, transforms, `DropManagedFields` and metadata-only informers through the builder, and `client.Options.Cache.DisableFor` forces live reads. Not settled: no memory measurement was found for any option, and the blog named in the gap was not re-read. See [[findings/controller-runtime-narrows-its-cache-with-selectors-transforms-metadata-only-informers-and-disable-for-and-each-option-has-a-cost]] and [[decisions/narrow-the-controller-cache-with-selectors-transforms-or-metadata-only-informers-or-bypass-it-for-some-types]].

## Flux shared caches and Crossplane performance guidance — status: open

- **Question:** How do Flux controllers share or isolate informer caches, and what does Crossplane's current performance and sharding guidance say?
- **Why it matters:** The dossier found Flux tuning flags but no informer internals, and the guessed Crossplane performance guide URL returned 404, so the scale gap still has no Flux or Crossplane sharding data.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux controller source and the current Crossplane performance documentation.
  - [ ] Update [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, crossplane, sharding, scale
- **Possible resolution from [[sources/research-gap-m5-informers-caches]]:** Partly settled, and the user decides whether to close it. Each Flux controller builds its own manager with a watch label selector, so caches are not shared, but that is an inference from the source and no document says so. The Flux docs say extra replicas add no capacity and sharding is by label selector. Crossplane core strips CRD schemas from one cache and does not cache Secrets, and its docs give poll and sync intervals. Not settled: no current Crossplane performance or sharding guide was found, and the guessed URL scraped empty. See [[findings/flux-controllers-keep-separate-caches-narrowed-by-a-watch-label-selector-and-leave-secrets-and-configmaps-uncached-by-default]] and [[findings/crossplane-core-strips-crd-schemas-from-its-cache-and-no-crossplane-performance-or-sharding-guide-was-found]].

## Resolution of Crossplane issue 7801 on credential protection — status: open

- **Question:** Was Crossplane issue 7801 resolved, and did a fix such as Secret finalizers, credential caching, or ordered teardown ship?
- **Why it matters:** The issue is a proposal discussion and its outcome is unknown. See [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]] and [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the issue thread and any linked pull requests.
  - [ ] Update the finding and the decision page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, finalizers, credentials
- **Possible resolution from [[sources/research-gap-m1-finalizers]]:** Not settled, and nothing here supports closing it. Issue 7801 is still open on 2026-11-26 with the label `enhancement`, two comments neither from a maintainer, and no linked fix pull request. Its body lists three directions as "none of them decided". Related work did merge on 2026-09-08: crossplane-runtime pull request 1113 protects ProviderConfigs while managed resources terminate, one-pager pull request 7594 documents it and keeps the Secret out of scope, and issue 4661 was closed. A third-party commenter reported on 2026-10-14 that a Secret finalizer fixed their provider-gitlab runs and that caching failed after a restart, which is SECONDARY-ONLY. See [[findings/crossplane-protects-providerconfigs-while-managed-resources-terminate-but-the-credentials-secret-behind-them-is-still-unprotected]], [[examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply]], and [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]].

## How ACK, Config Connector, and kro name and remove their finalizers — status: open

- **Question:** What finalizer names do ACK, Config Connector, and kro put on objects, and how and when does each remove them?
- **Why it matters:** Their documentation pages do not explain it, so a comparison would need live objects or source code. See [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Inspect live objects or read each controller's source.
  - [ ] Add the names to the entity pages.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ack, config-connector, kro, finalizers
- **Possible resolution from [[sources/research-gap-m1-finalizers]]:** Mostly settled, and the user decides whether to close it. ACK names its finalizer from a code-generator template, `finalizers.<apiGroup>/<Kind>`, and removes it only after the AWS resource is cleaned up, with asynchronous deletes returning a requeue. Config Connector uses `cnrm.cloud.google.com/finalizer`, removed in the lifecycle handler's deleted path, and a second `cnrm.cloud.google.com/deletion-defender` finalizer, which a deletion-defender controller removes first, and on CRD uninstall it removes both and sets abandon. kro uses `kro.run/finalizer` on instances, ResourceGraphDefinitions, and GraphRevisions and `kro.run/graph-finalizer` on Graph objects, and removes it with a merge patch only when no deletion candidates remain. Not settled: the rendered ACK string for a specific service, where Config Connector adds the deletion-defender finalizer, and the Config Connector direct controllers. See [[findings/ack-config-connector-and-kro-each-name-their-finalizers-differently-and-remove-them-only-after-cleanup]] and [[findings/config-connector-has-a-second-deletion-defender-finalizer-and-removes-both-finalizers-with-an-abandon-setting-when-its-crd-is-uninstalled]].
- **Possible resolution from [[sources/kubernetes-finalizers-blog]]:** Not settled by this source, and the user decides whether to close it. The Kubernetes finalizers blog covers only built-in finalizers such as pv-protection and pvc-protection and a dead finalizer on a ConfigMap, and it names no platform controller, so it adds nothing on ACK, Config Connector, or kro.
- **Possible resolution from [[sources/medium-config-connector-pitfalls]]:** Not settled, and the user decides whether to close it. The post patches `/metadata/finalizers` off a Config Connector BigQueryTable but does not name the finalizer or say when the controller removes it.

## What happens when blockOwnerDeletion is set without finalizers permission — status: open

- **Question:** When a controller sets `blockOwnerDeletion: true` without `update` on the owner's `/finalizers` subresource, does the API server reject the write or silently drop the flag?
- **Why it matters:** An official page describes an admission check and a controller-author blog describes silent dropping, so the failure mode is disputed. See [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Test on a cluster or read the OwnerReferencesPermissionEnforcement admission plugin source.
  - [ ] Update the finding and [[concepts/owner-references-and-garbage-collection]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** rbac, blockownerdeletion, verification
- **Possible resolution from [[sources/research-gap-m2-ownership-gc]]:** Settled for the plugin, and the user decides whether to close it. With `OwnerReferencesPermissionEnforcement` enabled, adding `blockOwnerDeletion: true` without `update` on the owner's `finalizers` subresource is rejected with Forbidden, and no code drops the flag. The plugin is not default-on in upstream kube-apiserver, so where it is off the flag is stored with no check. Not settled: the blog's silent-drop claim could not be located and stays unverified, managed-distribution defaults were not read, and the no-strip-code search was negative. See [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]].

## Crossplane v2 namespaced composites and managementPolicies versus garbage collection — status: open

- **Question:** How do Crossplane v2 namespaced composite resources and `managementPolicies` interact with owner-reference cascades and the composite deletion policy?
- **Why it matters:** The dossier read the v2.4 Compositions page only through a summary that did not cover either topic. See [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane v2 documentation on composite resources, scope, and management policies.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, deletion, management-policies
- **Possible resolution from [[sources/research-composite-resource]]:** Partly helpful. The current composite resources page documents the alpha deletion policy and its bypass under Argo CD foreground deletion, and the upgrade guide describes namespaced XRs and managed resources under `.m.` groups. Neither source covers how `managementPolicies` interact with the cascade. See [[findings/argo-cd-foreground-deletion-makes-crossplane-ignore-the-composite-deletion-policy]].
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Partly settled, from source and not from a docs page. A namespaced XR composes only into its own namespace, composed resources carry a controller owner reference, and deletion defaults to Background. The managed reconciler deletes the external resource only when the policy allows `Delete`, so a cascade over a managed resource without `Delete` removes the Kubernetes object and leaves the cloud resource. No v2 docs page explains this interaction. Not covered: namespace deletion while the provider is down, and special handling of Observe-only managed resources inside compositions. See [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]].
- **Possible resolution from [[sources/research-gap-m2-ownership-gc]]:** Partly settled. The v2.5 docs say composition functions do not run on composite deletion, the alpha deletion policy (Background default, Foreground, Pipeline, behind `--enable-function-controlled-deletion`) is bypassed by `--cascade` flags and by Argo CD foreground propagation, and composed resources carry a controller owner reference with `blockOwnerDeletion: true`. `managementPolicies` is beta, default-on, and provider-dependent, and without `Delete` Crossplane does not delete the external resource. Not settled: the docs do not connect `managementPolicies` to the owner-reference cascade, namespaced composite scope rules and Observe-only handling in compositions were not found, and the managed reconciler source was not re-read. See [[findings/a-managed-resource-without-delete-in-its-management-policies-is-removed-from-kubernetes-but-its-cloud-resource-stays]].

## KEPs on cross-namespace ownership and garbage collector performance — status: open

- **Question:** Do any Kubernetes enhancement proposals or conference talks address cross-namespace ownership or garbage collector performance, and are the design archive's foreground and background labels outdated?
- **Why it matters:** The dossier fetched no KEPs, and its summaries of the finalizers blog and the design proposal conflicted with current documentation. See [[concepts/owner-references-and-garbage-collection]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search the kubernetes/enhancements repository and SIG API Machinery material.
  - [ ] Re-read the finalizers blog and design proposal in full.
- **Drafted by:** agent on 2026-11-25
- **Tags:** keps, garbage-collection, verification
- **Possible resolution from [[sources/research-gap-m2-ownership-gc]]:** Partly settled. No KEP dedicated to cross-namespace ownership or garbage collector performance was found in the kubernetes/enhancements master tree, which is a negative search. Adjacent are KEP-5080 (ordered namespace deletion, stable in v1.34) and KEP-2336 (a `resource` field on owner references, alpha, milestone 0.0, shipping unconfirmed). The documented v1.20 behavior followed closed issues 65200 and 94631, linked by timing only. The design archive's `OrphanDependents` default of true is outdated. Not settled: conference talks were not searchable, and the finalizers blog was not re-read. See [[findings/no-kep-covers-cross-namespace-ownership-or-garbage-collector-performance-and-the-nearest-proposals-are-5080-and-2336]] and [[examples/kubernetes-issues-65200-and-94631-asked-for-defined-cross-namespace-owner-reference-behavior-and-both-are-closed]].
- **Possible resolution from [[sources/kubernetes-finalizers-blog]]:** Partly settled for one item, and the user decides whether to close it. The finalizers blog was re-read in full: its mode labels agree with current documentation and the earlier conflict came from the summary, see [[findings/the-2021-kubernetes-finalizers-blog-says-kubectl-cannot-set-the-propagation-policy-while-its-own-example-uses-cascade-orphan]]. The design proposal was not re-read, and the blog says nothing on KEPs, cross-namespace ownership, or garbage collector performance.

## How a platform should choose condition polarity — status: open

- **Question:** Should new condition types be abnormal-true (as kstatus prefers) or positive (as the Cluster API proposal and the API conventions lean), and what evidence shows which choice produces fewer misreadings by generic tools?
- **Why it matters:** The sources read leave the choice to authors, so the wiki cannot recommend one. See [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the last part of the API conventions and the kstatus design discussion.
  - [ ] Find practitioner write-ups on polarity incidents.
- **Drafted by:** agent on 2026-11-25
- **Tags:** conditions, polarity, kstatus, decision
- **Possible resolution from [[sources/research-gap-m3-status-conditions]]:** Partly settled as history, not settled as a rule. The conventions recommended abnormal-true, reversed to positive on 2020-02-14, and removed that preference on 2020-06-26, so they now say neither polarity can be recommended as a general rule, and Cluster API's 2024 proposal adopts that text. Correction to this entry's question: it says the Cluster API proposal and the conventions lean positive, which is true only of the 2020 proposal's suffix guidance. No published incident write-up measures generic-tool misreadings per polarity (a searched negative result), and the only documented failure mode is the kstatus README's stopped-controller case. The wiki presents options and no recommendation. See [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]], [[findings/the-kubernetes-api-conventions-recommended-abnormal-true-then-positive-polarity-and-since-june-2020-recommend-neither]], and [[examples/cli-utils-issue-167-a-kstatus-maintainer-said-stalled-is-not-named-failed-because-slow-and-doomed-are-hard-to-tell-apart]].


## Adoption and orphaning behavior in Cluster API, kro, and controller-runtime operators — status: open

- **Question:** How do Cluster API, kro, and plain controller-runtime operators handle adopting an existing resource and orphaning one on delete?
- **Why it matters:** The managed resource dossier found no readable primary source for these tools, so [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]] covers only Crossplane, Config Connector, and ACK.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API and kro documentation on adoption and deletion.
  - [ ] Read the ACK introduction blog.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, orphan, cluster-api, kro
- **Possible resolution from [[sources/research-gap-m2-ownership-gc]]:** Partly settled. The Cluster API MachineSet controller adopts Machines with no controller reference, and no non-test source uses orphan propagation (a negative search). kro releases resources with the alpha `kro.run/deletion-policy: Orphaned` annotation and a later instance can adopt them, and v0.10.0 adopts existing children in place. controller-runtime's `SetControllerReference` refuses to re-parent a controlled object and rejects cross-namespace owners, so adoption is operator code. Not settled: no controller-runtime adoption helper and the in-tree `ControllerRefManager` was not read, and the ACK introduction blog was not read. See [[examples/cluster-api-machineset-adopts-machines-that-have-no-controller-reference]] and [[examples/kro-moves-a-resource-between-graphs-by-orphaning-it-and-letting-a-later-instance-adopt-it]].

## Behavior of namespaced v2 managed resources when a namespace is deleted while the provider is down — status: open

- **Question:** What happens to namespaced Crossplane v2 managed resources when their namespace is deleted while the provider is absent, beyond the finalizer note?
- **Why it matters:** The dossier says deletion hangs without the provider and that hand-removing the finalizer orphans the real resource, but the Crossplane docs do not state the namespace-deletion case clearly.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Crossplane documentation or an issue that describes the namespace-deletion case in v2.
  - [ ] Add the result to [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, finalizers, namespaces, deletion
- **Possible resolution from [[sources/research-gap-m2-ownership-gc]]:** Not settled. No Crossplane documentation or issue describes the provider-absent case, and a managed resource staying Terminating and holding its namespace is only an inference. The dossier found the neighboring failure with the provider running: issue 7801 (open) says the credentials Secret can go first and hand-removing finalizers orphans external resources, and crossplane-runtime issue 1150 (open) reports a rejected `ProviderConfigUsage` create in a terminating namespace blocking deletion. A comment's provider-gitlab counts (0 of 5 and 1 of 5 with a namespaced ProviderConfig) are SECONDARY-ONLY. See [[examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply]] and [[examples/crossplane-runtime-issue-1150-reports-a-rejected-providerconfigusage-create-in-a-terminating-namespace-blocking-managed-resource-deletion-for-hours]].

## Per-provider external-name defaults — status: open

- **Question:** What is the default `crossplane.io/external-name` for each major provider and resource kind?
- **Why it matters:** One source says the default is the object name for S3 and another says external resources are named like the Kubernetes object by default, and per-provider variation is not documented in one place.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the provider documentation for AWS, Azure, and GCP kinds.
  - [ ] Update [[decisions/external-name-annotation-or-spec-field]] if defaults differ.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, external-name, providers
- **Possible resolution from [[sources/research-gap-m7-operators-idempotency]]:** Settled at the mechanism level and not as a complete table, and the user decides whether to close it. The Crossplane default is the object name, an upjet name initializer implements it, and `IdentifierFromProvider` disables it for provider-assigned IDs. Sampled kinds: S3 buckets use a `bucket` parameter, IAM roles and EKS clusters use the name, and VPCs, subnets, security groups, instances, database instances, and KMS keys use provider IDs; Azure and GCP sample kinds use templated IDs from the name. Provider-aws and the native Azure repositories were not read, and no full per-kind table was built. See [[findings/crossplane-external-names-default-to-the-object-name-only-for-name-based-kinds-and-upjet-providers-switch-the-default-off-for-provider-assigned-ids]].

## Flux handling of composite resources and kro instances — status: open

- **Question:** How do Flux health checks, `dependsOn`, and CRD ordering behave with Crossplane XRs and kro instances, and does Flux need the same ownerReference or tracking recipes that Argo CD needs?
- **Why it matters:** The composite resources dossier read Argo CD interaction only and no Flux material, yet Flux is a primary tool of this wiki. See [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]] and [[entities/flux]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read Flux documentation on health checks and custom resource readiness for composites.
  - [ ] Write an `examples/` page on Flux hosting composites.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, crossplane, kro, health-checks
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Not helpful. The dossier does not research Flux with composites or kro instances.
- **Possible resolution from [[sources/research-gap-o2-flux-internals]]:** Partly settled, and the user decides whether to close it. Flux health checks accept kstatus-compatible custom resources, `healthCheckExprs` supplies CEL per kind, `dependsOn` waits on health checks, and `readyExpr` replaces built-in readiness, see [[findings/flux-tracks-composite-resources-through-its-inventory-and-kstatus-or-cel-health-checks-and-documents-no-owner-reference-recipe-or-kro-guidance]]. A named case is [[examples/flux2-issue-5855-kstatus-saw-crossplane-resources-without-a-ready-condition-as-ready-and-maintainers-recommended-an-observedgeneration-cel-expression]]. Not settled: whether Flux needs no ownerReference recipe (an inference from its inventory-based prune, with no Flux page stating it), and any Flux guidance for kro instances, since none was found in either project. The open kro issue is [[examples/kro-issue-1290-external-controllers-fight-kro-over-fields-and-kro-resets-their-changes]].

## Scale of composite resources per controller — status: open

- **Question:** How many composites and composed children can a Crossplane function pipeline or a kro dynamic controller reconcile, and what do the tuning pages report?
- **Why it matters:** The composite resources dossier found no numbers for either tool and did not read kro's tuning documentation, so platform sizing has no evidence. See [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read Crossplane performance guidance and kro tuning documentation.
  - [ ] Find adopter or benchmark reports for composites and function pipelines.
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, crossplane, kro, composites

## Feature parity of function-kro with standalone kro — status: open

- **Question:** Does `function-kro` really reach full feature parity with a standalone kro ResourceGraphDefinition, and how do readiness and revision behavior differ when the graph runs inside a Crossplane pipeline?
- **Why it matters:** The parity claim comes from the Crossplane project's own announcement, and the choice between running kro alone or inside Crossplane depends on it. See [[entities/function-kro]] and [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the function-kro repository documentation and compare it with the kro RGD reference.
  - [ ] Find independent reports of running it in production.
- **Drafted by:** agent on 2026-11-25
- **Tags:** function-kro, kro, crossplane, verification
- **Possible resolution from [[sources/research-gap-o5-kro-ecosystem]]:** Partly settled, and the user decides whether to close it. The README claims full parity, but the repository lists concrete behavioral differences from kro, and v0.4.0 (2026-11-26) runs kro v0.10.0's own graph engine, so parity reads as the same engine with documented gaps, see [[findings/function-kro-lists-documented-behavioral-differences-from-upstream-kro-so-its-full-parity-claim-reads-as-same-engine-with-gaps]]. Still unanswered: independent production reports, whether the SSA desired-state problem is fixed, and how GraphRevision maps to CompositionRevision.

## Config Connector and ACK behavior when wrapped by compositions — status: open

- **Question:** How do Config Connector and ACK readiness conditions and deletion policies interact when their resources are composed by a Crossplane Composition or a kro ResourceGraphDefinition?
- **Why it matters:** Both are the managed-resource layer that compositions typically wrap, but the dossier's pages say nothing about this interplay, and the ACK drift recovery and deletion policy topics were not opened. See [[sources/research-composition]], [[entities/config-connector]], and [[entities/ack]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the ACK deletion policy and drift recovery guides and the Config Connector deletion and readiness pages.
  - [ ] Find a worked example of a graph wrapping ACK or Config Connector resources and record how readiness propagates.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ack, config-connector, composition, readiness
- **Possible resolution from [[sources/research-gap-o3-gitops-provider-managed]]:** Partly settled, and the user decides whether to close it. The ACK documentation's kro guide shows a ResourceGraphDefinition wrapping ACK Bucket and Table objects: kro waits for ACK readiness before creating dependents, creates none if an ACK resource fails, and on deletion removes the Deployment first and then the AWS resources per ACK's deletion policy. Crossplane's `function-auto-ready` treats a non-built-in composed resource as ready only with `Ready=True`, which ACK defines and Config Connector reports. Not settled: no worked example or first-party test of Crossplane composing ACK or Config Connector objects was found, how composite deletion (foreground or background) honors their deletion ordering, how kro's `kro.run/deletion-policy` combines with ACK's annotation, and whether `ACK.ReferencesResolved` waits interact with kro ordering (issue 3131 is a reporter's claim of up to about 16 minutes 40 seconds of backoff). See [[examples/the-ack-docs-kro-guide-composes-an-s3-bucket-a-dynamodb-table-and-a-deployment-and-deletes-the-deployment-before-the-aws-resources]], [[findings/crossplane-function-auto-ready-and-kro-readywhen-gate-on-the-provider-ready-condition-and-no-worked-example-of-crossplane-composing-ack-or-config-connector-was-found]], and [[findings/ack-referencing-resources-wait-on-backoff-after-the-referenced-resource-syncs-according-to-issue-3131]].

## Upjet runtime execution model and cost — status: open

- **Question:** How do Upjet-generated Crossplane controllers run Terraform logic at runtime, as a CLI subprocess or in-process, and what do they cost in memory and performance?
- **Why it matters:** The Upjet repository summary says controllers reuse Terraform's resource logic, but the runtime shape was not confirmed, and the generated official AWS, Azure, and GCP providers depend on it. See [[sources/research-provider]], [[entities/upjet]], and [[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Upjet architecture and performance documentation.
  - [ ] Update [[entities/upjet]] with the runtime model and resource costs.
- **Drafted by:** agent on 2026-11-25
- **Tags:** upjet, crossplane, terraform, performance
- **Possible resolution from [[sources/research-gap-o8-crossplane-residuals]]:** Settled for the runtime model and not settled for cost, and the user decides whether to close it. Upjet supports a fork-based Terraform CLI mode, a no-fork Plugin SDK v2 mode, and a no-fork Plugin Framework mode, chosen per resource configuration. In CLI mode each resource has a workspace with a state file and one forked provider process is shared through gRPC reattach until an invocation TTL. Metrics exist for process counts and time-to-readiness, but no official memory or CPU figures were found, and which official providers use which mode was not established. See [[findings/upjet-supports-three-terraform-execution-modes-selected-per-resource-configuration]], [[findings/upjet-cli-mode-keeps-a-terraform-workspace-per-resource-and-shares-a-forked-provider-process-until-an-invocation-ttl]], and [[findings/no-official-upjet-memory-or-cpu-figures-exist-and-the-memory-footprint-issue-was-closed-as-outdated-by-provider-families]].

## Flux and Argo CD handling of provider-managed resources — status: open

- **Question:** How do Flux and Argo CD treat provider-managed resources in terms of health checks, pruning, ordering, and deletion, and does a provider's own condition model interact with their health assessment?
- **Why it matters:** Provider objects delete cloud resources when removed, and the Providers dossier only mentions GitOps through Config Connector's trusted-repository advice. Both agents are a layer that can prune a managed resource. See [[sources/research-provider]], [[concepts/provider]], and [[findings/unintended-deletion-through-prune]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux and Argo CD documentation on health checks, prune, and finalizers for custom resources.
  - [ ] Find a worked example of a managed resource under each agent.
- **Drafted by:** agent on 2026-11-25
- **Tags:** gitops, flux, argo-cd, provider
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Not helpful. The dossier does not read how Flux treats provider-managed resources, and its prune evidence is generic. See [[findings/without-prune-flux-leaves-removed-manifests-running-as-orphans]].
- **Possible resolution from [[sources/research-gap-o3-gitops-provider-managed]]:** Mostly settled for health and deletion, and the user decides whether to close it. Argo CD ships Lua health scripts for the Config Connector, ACK, Crossplane, and Upbound groups, kro ResourceGraphDefinitions, and five Cluster API kinds, with the exact condition-to-health mappings read from source, and it advances sync waves only when the current wave is healthy. Flux has no per-provider logic and relies on kstatus compatibility or CEL `healthCheckExprs`, and its CEL cheatsheet lists Crossplane and no Config Connector or ACK entry. Prune is an ordinary delete under both agents. Not settled: Flux kstatus handling of `ACK.Terminal`, Flux treatment of Cluster API objects, the unread tail of the Crossplane Lua script and the Cluster API scripts, and any worked example of a managed resource under each agent. See [[findings/argo-cd-ships-built-in-lua-health-checks-for-config-connector-ack-crossplane-upbound-kro-and-cluster-api-kinds-and-an-unhealthy-provider-object-blocks-later-sync-waves]], [[findings/flux-judges-provider-managed-resources-through-kstatus-or-cel-health-check-expressions-and-its-cel-cheatsheet-lists-crossplane-but-not-config-connector-or-ack]], and [[examples/argo-cd-issue-30164-config-connector-customize-kinds-stayed-progressing-because-the-health-script-did-not-handle-status-healthy]].

## Flux source-controller internals and artifact serving under leader election — status: open

- **Question:** How does the Flux source controller store and serve artifacts, how does leader election affect artifact serving when several replicas run, and how does OCI source verification work?
- **Why it matters:** The Flux deep dive read the source controller only at overview level, yet every downstream controller depends on its artifacts, and the Git-to-Ready lifecycle trace cannot be completed without it. See [[entities/flux]] and [[sources/research-flux-deep-dive]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the source controller API pages for GitRepository, OCIRepository, HelmChart, and Bucket directly.
  - [ ] Update [[entities/flux]] and write a worked example for the lifecycle trace.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, source-controller, leader-election, verification
- **Possible resolution from [[sources/research-gap-o2-flux-internals]]:** Partly settled, and the user decides whether to close it. The dossier read the source and documentation on `main`: artifacts live under `/data` and are served from an in-process file server on `:9090`, the server starts only after leader election, non-leaders fail readiness, and standby replicas add failover and no capacity, see [[findings/flux-source-controller-starts-its-artifact-server-only-after-winning-leader-election-and-standbys-fail-readiness]] and [[findings/the-stock-flux-source-controller-keeps-artifacts-in-an-emptydir-with-one-minute-retention-so-a-restart-rebuilds-them]]. Not settled: OCI source verification mechanics in source-controller (signature verification is covered in [[findings/flux-verifies-cosign-and-notation-signatures-on-oci-artifacts-while-the-argo-cd-pages-read-document-no-oci-signature-verification]]), the default lease durations, how dependents behave while source-controller restarts, whether any supported configuration persists artifacts, and the inference that `/data` maps to an emptyDir.

## Flux sharding in production and the HelmChart labeling rule — status: open

- **Question:** What do production deployments of Flux sharding look like, and what is the exact labeling rule for HelmChart objects that the sharding page cautions about?
- **Why it matters:** The only adopter in the dossier lists sharding as future work, and the labeling caveat could cause objects to land on the wrong shard. See [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]] and [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux sharding page directly and note the HelmChart caveat.
  - [ ] Find a named adopter that runs shards and record its numbers.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, sharding, scale, verification
- **Possible resolution from [[sources/research-gap-o2-flux-internals]]:** Half settled, and the user decides whether to close it. The labeling rule is verified: source kinds with a dependency on another kind need the same labels, and a generated HelmChart is labeled through the HelmRelease's `.spec.chart.metadata.labels`, see [[findings/a-flux-helmchart-generated-from-a-helmrelease-takes-its-shard-label-from-spec-chart-metadata-labels]]. The docs do not state the failure symptom of a mismatch. For production use, Cozystack ships a shard operator at about 100 HelmReleases per shard, but its README states design intent and no measured outcome, see [[examples/cozystack-s-flux-shard-operator-creates-helm-controller-shards-at-about-100-helmreleases-per-shard]], and Morgan Stanley lists sharding only as exploration. No adopter's production shard numbers were found.

## Flux image automation API status and safe promotion policy — status: open

- **Question:** What are the current API versions and maturity of the Flux image automation controllers, and what promotion policy do adopters use to keep automatic tag updates out of production?
- **Why it matters:** The dossier read the guide as a digest and says current versions and any beta status should be checked, and automatic tag commits are a documented rollout risk. See [[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the image automation API reference and release notes.
  - [ ] Find adopter write-ups on staging-only or reviewed promotion.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, image-automation, verification
- **Possible resolution from [[sources/research-gap-o2-flux-internals]]:** Half settled, and the user decides whether to close it. The current spec pages for ImageRepository, ImagePolicy, and ImageUpdateAutomation use `image.toolkit.fluxcd.io/v1`, with v1 served and stored for ImagePolicy and controllers at v1.3.1, see [[findings/flux-image-automation-kinds-are-image-toolkit-fluxcd-io-v1-with-older-versions-still-in-the-api-directory]]. The official guide offers semver for production, a separate push branch for pull-request approval, and revert by narrowing the range, see [[findings/the-flux-image-update-guide-offers-semver-for-production-a-separate-push-branch-for-review-and-revert-by-narrowing-the-range]] and [[decisions/gate-flux-image-automation-with-semver-ranges-a-separate-push-branch-or-staging-only-automation]]. Not settled: adopter write-ups on staging-only or reviewed promotion, the date v1 graduated, and the ImageUpdateAutomation CRD storage version.

## Crossplane package dependency resolution, revision activation, and upgrade policy — status: open

- **Question:** How does Crossplane resolve dependencies between Providers, Functions, and Configurations, which revision becomes active on an upgrade, and what upgrade policies apply to packages?
- **Why it matters:** The packages overview in the deep dive lists the four package types but gave no detail on dependency resolution, revisions, or upgrade policy, and staged rollouts depend on it. See [[entities/crossplane]] and [[concepts/provider]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane package documentation and the Configuration dependency pages directly.
  - [ ] Update [[entities/crossplane]] and [[findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, packages, upgrades, verification
- **Possible resolution from [[sources/research-gap-o8-crossplane-residuals]]:** Largely settled for Providers and Configurations, and the user decides whether to close it. Only one revision is Active, `revisionActivationPolicy` is `Automatic` by default or `Manual`, one Inactive revision is kept by default, and `skipDependencyResolution` ignores dependencies. The resolver is the Lock controller, which never modifies the Lock and creates one missing dependency at a time, and dependency upgrades and downgrades are alpha with downgrades needing both flags. Not settled: the Function package activation policy and history limit were not found. See [[findings/the-crossplane-lock-resolver-never-modifies-the-lock-and-creates-only-the-first-missing-dependency]], [[findings/crossplane-dependency-version-upgrades-and-downgrades-are-alpha-and-downgrades-need-both-feature-flags]], [[findings/crossplane-activation-policy-and-history-defaults-are-documented-for-providers-and-configurations-and-were-not-found-for-functions]], and [[decisions/let-crossplane-resolve-package-dependencies-or-pin-versions-and-skip-resolution]].

## Neutral comparisons of Crossplane with Terraform and single-cloud operators — status: open

- **Question:** What do neutral sources, such as practitioner benchmarks or independent write-ups, say about Crossplane versus Terraform, OpenTofu, Pulumi, CDK, Config Connector, ACK, and Azure Service Operator?
- **Why it matters:** The dossier's comparisons come from the Crossplane project and from Encore, a vendor of a competing product, and no primary documentation was read for Config Connector, ACK, or Azure Service Operator. See [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]] and [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find independent comparisons and adopter migration write-ups.
  - [ ] Revise [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, terraform, comparison, bias
- **Possible resolution from [[sources/research-gap-o6-platform-landscape]]:** Not settled, and the user decides whether to keep it open. The readable material is vendor, consultancy, or lab writing: a Spacelift article (vendor), a Crossplane-friendly VSHN post, a 2021 Crossplane project post, a lab migration walkthrough, and a 2022 SuperOrbital post that is the most independent and predates Crossplane v2. No independent benchmark, named adopter migration post-mortem, or primary-document comparison of Config Connector, ACK, and Azure Service Operator was found, and two Medium posts were unreadable. See [[findings/no-neutral-comparison-of-crossplane-with-terraform-or-single-cloud-operators-was-found-and-the-independent-material-is-dated]] and [[decisions/run-existing-terraform-in-the-cluster-with-tofu-controller-or-terraform-operator-or-model-resources-natively-in-crossplane]].
- **Possible resolution from [[sources/medium-config-connector-pitfalls]]:** Not settled, and the user decides whether to close it. The post is one Config Connector user's opinion contrasting Config Connector with Terraform on dependency handling, HCL and state, and mentions Crossplane only for multi-cloud support. It is not neutral, not a benchmark, and not a head-to-head comparison involving Crossplane.
- **Possible resolution from [[sources/medium-terraform-opentofu-crossplane]]:** Not settled, and the user decides whether to close it. The Medium post by Gavin Yap (2025-01-10) is an individual's opinion that favors his own OpenTofu framework, and its author says he has not used Crossplane extensively, so it is neither neutral nor a hands-on Crossplane evaluation. It does add practitioner objections on setup time, portal cost, disaster recovery, and plan review. See [[examples/a-practitioner-prefers-a-yaml-abstracted-opentofu-framework-with-gitlab-merge-requests-over-crossplane-and-a-portal]].

## kro governance status and the future of the Graph API — status: open

- **Question:** Is kro a CNCF project or only a Kubernetes SIG Cloud Provider subproject, and how will the alpha Graph API affect RGD stability and adoption?
- **Why it matters:** One blog says kro is not a CNCF project while kro.run says only that it is a SIG Cloud Provider subproject, and the Graph versus RGD relationship decides which API platform teams should build on.
- **Owner:** unassigned
- **How to close:**
  - [ ] Check kro.run, the Kubernetes SIG Cloud Provider listing, and the kro repository for governance wording.
  - [ ] Find design discussion on the Graph API roadmap.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, governance, graph, cncf
- **Possible resolution from [[sources/research-gap-g3-kro]]:** Governance is settled and the Graph future is only partly answered, so the user should decide whether to close it. kro is a subproject of Kubernetes SIG Cloud Provider according to its README, kro.run, and the SIG's own README, and no first-party page read calls it a CNCF project in its own right (the kro.run footer's CNCF sentence is about Kubernetes; absence from the CNCF landscape was not verified). The maintainer roster is active. On the Graph API, the design text says it is additive and does not replace or deprecate RGD, and that RGD is internally a graph. Not settled: no promotion timeline from alpha was found, the in-repo roadmap (last updated 2026-04-03) lags the release, and live roadmap pages and GitHub issue threads were not read. See [[findings/the-kro-in-repo-roadmap-predates-the-v0-10-0-release-and-gives-no-graph-promotion-timeline]] and [[comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog]].
- **Possible resolution from [[sources/research-gap-o5-kro-ecosystem]]:** Governance is confirmed and the Graph future is still open, and the user decides whether to close it. kro is a subproject of Kubernetes SIG Cloud Provider according to the README, the SIG README, kro.run, and the OWNERS files, and no first-party source calls it a CNCF project in its own right, though absence from the CNCF project list was not checked. Graph shipped in v0.10.0 (2026-11-10) as alpha and off by default, and the design document says RGD internally runs on the graph engine and is not replaced or deprecated. No promotion timeline was found, and the live kro.run roadmap still shows v0.10.0 as Next. See [[decisions/build-platform-apis-on-resourcegraphdefinitions-or-track-the-alpha-graph-api]].
- **Possible resolution from [[sources/resource-composition-with-kro]]:** Not settled for governance, and the user decides whether to close it. The AWS overview says nothing about kro's CNCF or SIG Cloud Provider status. On the Graph question it lists only the ResourceGraphDefinition as a primary resource type and names no kro version, so it neither confirms nor denies that the managed capability exposes the alpha Graph kind.
- **Possible resolution from [[sources/bex-co-kro-radar-post]]:** Not settled, and the user decides whether to close it. The secondary post calls kro a subproject of SIG Cloud Provider donated to Kubernetes SIGs, which matches the first-party wording already recorded, and its CNCF headline refers to a CNCF and SlashData survey and not to kro's project status. It says nothing about the Graph API.

## Scaling limits of per-RGD kro controllers and named production kro adopters — status: open

- **Question:** How does kro behave at scale when every ResourceGraphDefinition starts a dedicated controller, and which organizations run kro in production?
- **Why it matters:** The dossier found no named production postmortem and no benchmark, and AWS offering a managed EKS capability is the only adoption evidence.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search for kro production case studies and benchmarks.
  - [ ] Extend [[examples/kro-shared-queue-tunes-throughput]] with measured results.
- **Possible resolution from [[sources/research-gap-g1-named-adopters]]:** Partly settled, and the user decides whether to close it. The premise needs correcting: the released docs describe one shared dynamic controller with a single queue and not a dedicated controller per RGD, with per-RGD queues as a possible future change, see [[findings/kro-s-single-shared-queue-can-starve-resources-and-a-maintainer-proposed-weighted-queues]]. No measured scaling limit and no named production kro adopter were found, and kro has no ADOPTERS.md. The adoption evidence is secondary-only (a bex.co summary of the CNCF and SlashData radar placing kro in "Adopt", and an AWS EKS concepts page). The only scale-related failure report is [[findings/a-kro-hard-apply-failure-discarded-watches-and-hot-looped-while-large-collections-re-listed-against-the-apiserver]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, scale, adopters, production
- **Possible resolution from [[sources/research-gap-o5-kro-ecosystem]]:** Not settled, and the user decides whether to close it. The premise is corrected again: kro runs one shared queue and one worker by default, and only the docs FAQ still says a dedicated controller per RGD, see [[findings/the-kro-docs-faq-says-a-dedicated-controller-per-rgd-while-the-tuning-page-and-source-describe-one-shared-queue]]. No measured scaling limit, benchmark, ADOPTERS file, or named production adopter was found, and the only scale evidence is open issues 198 and 610 plus a closed unmerged pull request, see [[findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter]].
- **Possible resolution from [[sources/resource-composition-with-kro]]:** Not settled, and the user decides whether to close it. The AWS overview says the managed capability removes the need to install, maintain, and scale kro controllers, which shows AWS productizes kro, but it gives no scale limit, no benchmark, no controller sizing, and no named customer. It is vendor documentation and offers no adopter evidence beyond AWS itself. See [[findings/the-amazon-eks-kro-overview-lists-resourcegraphdefinition-as-the-only-primary-resource-type-and-names-no-kro-version]].
- **Possible resolution from [[sources/bex-co-kro-radar-post]]:** Not settled, and the user decides whether to close it. The post is now read in full: it reports a survey rating of kro and names no production adopter, no scale figure, and no benchmark. Its author is a Cluster API platform company that is evaluating kro and has not adopted it. The radar the post cites was not read. See [[findings/one-blog-reports-that-the-cncf-and-slashdata-q1-2026-radar-rated-kro-adopt-from-a-survey-of-more-than-400-developers]].

## Independent benchmarks for Argo CD footprint and portal claims — status: open

- **Question:** Do independent measurements support the vendor claims that Argo CD has a heavier footprint than Flux, that Port goes beyond Backstage, and that a portal alone leaves ticket queues?
- **Why it matters:** Every comparative claim in the landscape dossier comes from a vendor and none was independently checked.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search for neutral benchmarks or end-user studies.
  - [ ] Revise [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** benchmarks, vendor-bias, argo-cd, flux, portals

## Direct comparison of Config Connector and Crossplane — status: open

- **Question:** How do Config Connector and Crossplane compare on Google Cloud for composition, ordering, identity, and deletion behavior?
- **Why it matters:** The dossier's wiki search for a direct comparison returned nothing useful, and the existing add-on comparison is based on a Crossplane maintainer's post.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find a neutral Config Connector versus Crossplane comparison or test both on one scenario.
  - [ ] Extend [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, crossplane, comparison
- **Possible resolution from [[sources/research-gap-o4-config-connector-ack]]:** Not settled. No neutral comparison or cost-of-ownership study was found. The evidence is a Crossplane maintainer's 2021 blog post and issue comments (2020 to 2022) arguing for a purpose-built provider, an unanswered 2024 question, and a Google 2023 blog that compares Config Connector with Terraform and never names Crossplane. First-party differences were recorded: Config Connector is Google-only with namespaced resources and no composition layer found, its mean re-enqueue is 10 minutes against Crossplane's 1 minute runtime poll, and the GKE add-on can lag by 12 months or more. Whether Crossplane GCP providers match Config Connector's coverage and their poll flags were not read. See [[findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions]] and the evidence-only [[decisions/use-config-connector-directly-wrap-it-in-crossplane-through-the-kubernetes-provider-or-use-a-crossplane-gcp-provider]].
- **Possible resolution from [[sources/medium-config-connector-pitfalls]]:** Not settled, and the user decides whether to close it. The post offers two sentences of opinion, that Crossplane is multi-cloud and covers most Terraform-provider resources, and no direct comparison of behavior, scale, or deletion.

## Cloud API rate limits and Crossplane provider reconcile tuning — status: open

- **Question:** How do AWS, Azure, and GCP API rate limits constrain Crossplane providers, Config Connector, and ACK, and how are poll intervals and `max-reconcile-rate` tuned in practice?
- **Why it matters:** Cloud throttling is invisible to the Kubernetes machinery, so an operator can fix every Kubernetes-side limit and still be throttled by the cloud. The scale dossier found no source on it, and a search for Crossplane tuning docs failed with a 503.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read docs.crossplane.io tuning guidance and the provider repositories.
  - [ ] Find ACK and Config Connector guidance on cloud API quotas.
  - [ ] Extend [[examples/crossplane-max-reconcile-rate-turns-reconcile-rate-into-an-api-call-budget]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cloud-api, rate-limit, crossplane, config-connector, ack

## Scaling behavior of kro, ACK, Cluster API, and Config Connector controllers — status: open

- **Question:** How do the kro, ACK, Cluster API, and Config Connector controllers behave as managed object counts grow?
- **Why it matters:** The scale dossier covers Flux, Argo CD, and Crossplane only, and the Config Connector page fetch was redirected and not retried.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find scaling or tuning documentation for each controller.
  - [ ] Add scale sections to [[entities/ack]], [[entities/cluster-api]], [[entities/config-connector]], and [[entities/kro]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, kro, ack, cluster-api, config-connector

## Current Crossplane v2 scaling guidance — status: open

- **Question:** What does current Crossplane v2 documentation say about scaling, and does it change the provider-family guidance from 2023?
- **Why it matters:** The provider-family sources date from 2023, so the decision recorded in [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]] may have been refined since.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Crossplane v2 documentation on providers, activation policies, and resource limits.
  - [ ] Update [[entities/crossplane]] and the decision page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, v2, scale, provider-family
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Partly settled. There is no single v2 scaling page. Guidance is in the Pods guide (default polling one minute, hourly full re-check), the v2.1.0 notes (API Priority and Fairness, an XR circuit breaker, `--max-concurrent-reconciles`), and the Accepted MRD design doc, which says families "helped alleviate" the problem and does not retire them. The 2023 family-split decision still stands, now with an alpha alternative. Not settled: no numeric limits for XRs or composed resources per controller, and no independent benchmarks. See [[examples/crossplane-v2-4-and-v2-5-cut-memory-on-clusters-with-hundreds-to-two-thousand-crds]] and [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]].
- **Possible resolution from [[sources/research-gap-b1-recheck-kro-crossplane]]:** Partly settled, with the same negative remainder. v2.5.0 source gives the defaults: poll interval 1 minute, sync interval 1 hour, 100 concurrent reconciles (`--max-reconcile-rate` is an alias and the docs still describe it as a per-second rate), and an XR circuit breaker with burst 100, refill 1.0 per second, and cooldown 5 minutes, against 50 burst and one per 2 seconds in the v2.1.0 notes. The release notes add the per-resource `crossplane.io/poll-interval` annotation (v2.3.0) and zero-replica safe-start provider runtimes (v2.4.0). The new Scalable Composition guide covers the `scale` subresource and not capacity. Not settled: no numeric limit for XRs or composed resources per controller and no independent benchmark exists in what was read, and the release that changed the breaker default was not traced. See [[findings/the-crossplane-v2-5-docs-describe-max-reconcile-rate-as-a-rate-but-source-treats-it-as-a-worker-pool-size-alias]] and [[findings/the-crossplane-xr-circuit-breaker-default-is-burst-100-in-v2-5-0-source-while-the-v2-1-0-notes-say-burst-50]].
- **Possible resolution from [[sources/research-gap-o8-crossplane-residuals]]:** Partly settled with the same negative remainder, and the user decides whether to keep it open. The Pods guide gives a one-minute poll interval and one-hour sync interval and still describes `--max-reconcile-rate` as a per-second rate, which v2.1.0 renamed `--max-concurrent-reconciles` (a worker pool size), and v2.1.0 relies on API Priority and Fairness, the XR circuit breaker (50 burst, 1 every 2s), and worker pool size. v2.5.0 adds a maintainer-reported memory drop (heap 338 MiB to 190 MiB on 791 CRDs) and an alpha CompositionRevision garbage collector, and the MRD guide estimates about 3 MiB of API server memory per CRD. The 2023 provider-family decision is not retired. Not settled: no numeric limit for XRs or composed resources per controller, no CPU or memory sizing for the Crossplane pod, no independent benchmark, and the release that changed the breaker default was not traced. See [[findings/crossplane-core-strips-crd-schemas-from-its-cache-and-no-crossplane-performance-or-sharding-guide-was-found]], [[examples/crossplane-v2-5-0-released-2026-11-24-with-alpha-compositionrevision-garbage-collection-and-an-upgrade-ownership-fix]], and [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]].

## Named Flux sharding adopters and API Priority and Fairness incidents — status: open

- **Question:** Which organizations run sharded Flux, and are there published incidents or postmortems involving API Priority and Fairness throttling?
- **Why it matters:** The dossier found no named case studies for either, so sharding thresholds and APF failure modes rest on documentation alone.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search adopter lists, conference talks, and postmortem collections.
  - [ ] Extend [[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]] if a case is found.
- **Possible resolution from [[sources/research-gap-g1-named-adopters]]:** Mostly answered in the negative, and the user decides whether to close it. No organization was found that publicly says it runs sharded Flux at a stated scale. Morgan Stanley, with over 500 clusters, lists sharding under "Looking Ahead". Only anonymous issue reporters use sharding, and their reports are recorded in [[findings/a-flux-dependson-across-shards-failed-with-dependency-not-found-until-a-2024-fix]] and [[findings/objects-that-leave-a-flux-shard-keep-stale-artifacts-on-the-old-source-controller]]. No postmortem ties APF throttling to Flux. What exists is the 2022 change that made Flux controllers APF-aware and a 2026 fix for a remaining client-side path, see [[findings/flux-turns-off-client-side-throttling-when-apf-is-enabled-but-a-custom-kubeconfig-path-kept-it-until-2026]]. Talks by KLM, NatWest Group, and Orange at FluxCon Europe 2026 were not read.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, sharding, apf, incidents
- **Possible resolution from [[sources/research-gap-o2-flux-internals]]:** Cozystack is a named project that ships label-based Flux shards, with design targets of about 100 HelmReleases per shard and no measured outcome, see [[examples/cozystack-s-flux-shard-operator-creates-helm-controller-shards-at-about-100-helmreleases-per-shard]]. The dossier found no new APF incident. The gap stays open.

## First-party pitfall and incident evidence for kro, Config Connector, ACK, and Cluster API — status: open

- **Question:** What deletion cascades, adoption problems, and upgrade-ordering pitfalls are documented first-hand for kro, Config Connector, ACK, and Cluster API?
- **Why it matters:** The pitfalls dossier found no first-party material on these tools, so [[concepts/pitfalls-and-case-studies]] is strongest for Crossplane, Flux, and Argo CD only.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's deletion, adoption, and upgrade documentation and issue trackers.
  - [ ] Add `findings/` pages and extend [[concepts/pitfalls-and-case-studies]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** pitfalls, kro, config-connector, ack, cluster-api
- **Possible resolution from [[sources/research-gap-g1-other-tool-pitfalls]]:** Largely settled on first-party issue-level evidence, and the user decides whether to close it. It is not settled for named-organization postmortems, because none exists in the dossier. The dossier read the issue trackers and release notes and found deletion, adoption, and upgrade pitfalls for all four tools, all as open reporter claims with no maintainer root-cause confirmation. kro: the breaking-change gate error did not name the override annotation (1395), added validation markers were not patched into the live CRD (1391), one bad RGD blocked all others (886), and a fault-injection tool found a crash mid-deletion leaves the finalizer and children (1171). Config Connector: a stale deletion after leader failover removed live GCP resources (16444), `abandon` did not release stuck Direct-controller resources (15930), and a StorageBucket location edit showed UpToDate (12944). ACK: ownership is recorded only in CR status (3142), adoption under GitOps overwrites the AWS resource with the git spec (3152, 3136), pruning deletes the resource and the namespace retain annotation is ignored in single-namespace installs (3153, 3154), and a rollout duplicated a VPC endpoint (3122). The ACK batch is one reporter's audit, not independent corroboration. Cluster API: v1.14.0 lists four breaking changes and schedules v1beta1 and Docker removals, and cert-manager rotation made webhooks unreachable for up to 90 seconds (10522), but no deletion or data-loss incident was found. Not covered: ACK per-controller release notes, the official KCC and ACK documentation, and maintainer talks. See [[findings/no-named-organization-postmortem-was-found-for-kro-config-connector-ack-or-cluster-api]], [[findings/a-kro-breaking-change-error-did-not-name-the-override-annotation-and-an-added-enum-or-cel-marker-was-not-patched-into-the-live-crd]], [[findings/config-connector-leader-election-across-clusters-can-run-a-stale-deletion-against-live-google-cloud-resources]], [[findings/ack-records-ownership-only-in-custom-resource-status-so-overlapping-controllers-or-a-restored-copy-can-share-one-aws-resource]], and [[findings/cluster-api-webhooks-can-be-unreachable-for-up-to-90-seconds-during-cert-manager-certificate-rotation]].
- **Possible resolution from [[sources/research-gap-o4-config-connector-ack]]:** Partly settled on documentation and release-note evidence, and not settled for named-organization postmortems, which were not found. Added: a Config Connector design document and known-issues page, kro v0.10.0 fixes and an alpha orphan policy (pull request 1445), ACK contributor replies on issues 3122 and 3152 with the reminder that issues 3142, 3153, and 3154 are one reporter's audit with no maintainer root cause, and Cluster API v1.15.0-rc.0 notes and troubleshooting page. Whether any kro fix followed a production incident was not determined. See [[findings/no-named-organization-postmortem-was-found-for-kro-config-connector-ack-or-cluster-api]], [[findings/kro-v0-10-0-fixes-partial-apply-cleanup-and-duplicate-rgd-identities-and-pull-request-1445-adds-an-alpha-deletion-policy-behind-an-off-by-default-gate]], and [[examples/config-connector-issue-534-deleting-a-bigquerydataset-before-its-tables-left-both-in-failure-and-the-issue-has-been-open-since-2021]].
- **Possible resolution from [[sources/bex-co-kro-radar-post]]:** Not settled, and the user decides whether to close it. The post is a secondary opinion piece that lists five anticipated gaps for kro, namely the alpha API, no cluster provisioning, no TLS or custom-domain model, unneeded portability, and type checking limited to visible schemas. They are predictions by an evaluator and not first-party reports or incidents.
- **Possible resolution from [[sources/medium-config-connector-pitfalls]]:** Not settled, and the user decides whether to close it. The Medium post is a secondary practitioner account, not first-party, and it names no organization. It repeats the Config Connector ordering and deletion pitfall already held as reporter claims in issue 534 and a design document, and it adds a worked workaround, see [[examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first]].
- **Possible resolution from [[sources/medium-terraform-opentofu-crossplane]]:** Not settled, and the user decides whether to close it. The post concerns Terraform and Crossplane and covers none of kro, Config Connector, ACK, or Cluster API.

## Force-conflicts versus strip-or-adopt when two controllers co-own a field — status: open

- **Question:** Is Argo CD's default `--force-conflicts` server-side apply or Flux's strip-or-adopt ignore rule safer when two controllers legitimately co-own a field?
- **Why it matters:** Neither the Flux blog nor the Argo CD documentation compares the two, yet the choice decides which controller silently loses its writes. See [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find a source or experiment that compares both under a shared-field scenario.
  - [ ] Read the official server-side apply reference directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ssa, flux, argo-cd, conflicts
- **Possible resolution from [[sources/research-gap-m4-ssa-conflict-policy]]:** Partly settled, and the user decides about the rest. The official server-side apply reference was read directly. The Flux specification confirms that Strip leaves ownership with the other Apply-type manager and that Adopt preserves Update-type edits, and the Kubernetes documentation confirms that force removes the field from other managers' entries and that an Update write never fails on conflict. Argo CD's force policy overwrites the other controller on each sync unless the field is left out of Git or ignored. Not settled: no source or experiment compares the two policies under a shared-field scenario, and the claim that Strip covers only Apply-type managers, so Update-type controllers such as Config Connector need Adopt, is an inference and not a project statement. See [[decisions/force-conflicts-or-strip-or-adopt-when-two-controllers-co-own-a-field]] and [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]].

## How often forced finalizer removal orphans guarded resources — status: open

- **Question:** How often does force-removing a finalizer, such as through the namespace `/finalize` subresource, leave cloud or external resources orphaned?
- **Why it matters:** The Red Hat guide treats force removal as the fix while other sources imply it can orphan guarded resources, and no source quantified the risk. See [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find incident reports or surveys of orphaned resources after forced finalizer removal.
  - [ ] Read the official Kubernetes finalizers page directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** finalizers, orphans, deletion
- **Possible resolution from [[sources/research-gap-g1-gitops-drift-incidents]]:** Not settled. No source quantifies the rate. The Kubernetes finalizers page warns that forced removal "can lead to issues in your cluster" and gives no frequency, and searches of the kubernetes, cluster-api, crossplane, and ACK issues found no survey or incident count, though the search tool was weak. The dossier documents orphaning by other routes (a lost delete on restart in issue 53451, public IP and load balancer leaks in issue 43730, a finalizer added too late in Cluster API issue 8172), and the Service finalizer pull request 54569 was closed unmerged. The answer stays a missing measurement. See [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]] and [[findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late]].
- **Possible resolution from [[sources/kubernetes-finalizers-blog]]:** Not settled, and the user decides whether to close it. The official Kubernetes blog post of 2021 warns that forcing a namespace through the finalize subresource can leave orphan objects in a namespace that no longer exists, and says re-creating the namespace may bring them back, but it gives no frequency and no incident. See [[findings/forcing-namespace-finalization-can-leave-orphan-objects-in-a-namespace-that-no-longer-exists-and-recreating-the-namespace-may-bring-them-back]].

## Recent 2024 to 2026 platform incident evidence — status: open

- **Question:** What public postmortems from 2024 to 2026 involve GitOps tools, infrastructure controllers, or cluster upgrades?
- **Why it matters:** The k8s.af index is mostly 2017 to 2021 and its repository was archived in 2020, and the Flux ignore-rules blog is the only 2026 primary source read.
- **Owner:** unassigned
- **How to close:**
  - [ ] Search for recent postmortems and conference talks.
  - [ ] Add `examples/` pages for each incident.
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, recency, evidence
- **Possible resolution from [[sources/research-gap-g1-outage-postmortems]]:** Partly settled, and not answered for the question as asked. Two primary postmortems from the window were read: OpenAI (2024-12-11) and Neon (May 2025, read on neon.com), both self-reported. No 2024 to 2026 postmortem involving Argo CD, Flux, Crossplane, Karpenter, cert-manager, Kyverno, Gatekeeper, or a cluster upgrade was found, though several searches returned zero results. The k8s.af index lists 78 entries, and its newest dated entry is 2023, so it adds nothing for the window. See [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]] and [[examples/neon-s-may-2025-delayed-start-incidents-exhausted-subnet-ips-after-a-slow-control-plane-database-query]].

## Which kro version and feature gates the Amazon EKS managed capability runs — status: open

- **Question:** Which kro release does the Amazon EKS kro capability run, how quickly does it follow upstream, and does it expose the alpha Graph kind or any feature gate?
- **Why it matters:** The AWS overview page names no version and lists only the ResourceGraphDefinition, so a platform team cannot tell from it whether the managed capability matches the upstream behavior documented in this wiki.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the EKS capability reference or the kro capability API for a version field and upgrade policy.
  - [ ] Check whether a managed cluster accepts a `Graph` object.
- **Drafted by:** agent on 2026-11-26
- **Tags:** kro, eks, managed-service, version

## Which CVE the kcp speaker said the kcp side discovered — status: open

- **Question:** Which CVE does the kcp KubeCon talk transcript refer to when the speaker says another talk covers "the CVE which we discovered", and which components and versions did it affect?
- **Why it matters:** A vulnerability in a multi-tenant control plane bears on the isolation claims recorded in [[comparisons/tenancy-models-namespaces-vcluster-kcp]], and the transcript names no identifier.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find the kcp security advisories and the conference schedule entry for the talk the speaker mentions.
  - [ ] Record the identifier, affected versions, and fix in [[entities/kcp]].
- **Drafted by:** agent on 2026-11-26
- **Tags:** kcp, security, cve, multi-tenancy

## Crossplane backup and disaster recovery guidance, including Velero and external-name after a restore — status: open

- **Question:** Does Crossplane's documentation recommend Velero or another backup tool for restoring a control plane, and what must be done with `crossplane.io/external-name` and managed resources after a restore into a new cluster?
- **Why it matters:** A Terraform user asserts that Crossplane's default disaster recovery relies on Velero and that the external-name annotation must be patched during a recovery without it, which bears on deletion safety and duplicate creation. The wiki has not read Crossplane's own guidance, and related restore failures exist for ACK and Config Connector, see [[examples/ack-issue-3142-a-restored-cluster-copy-or-overlapping-controller-install-can-give-one-aws-resource-two-owners]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane documentation and issues on backup, restore, and external-name.
  - [ ] Record the recommended procedure and the failure modes in [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-26
- **Tags:** crossplane, disaster-recovery, velero, external-name

---

## Closed gaps

Closed gaps are archived in [[open-knowledge-gaps-archive]] (51 entries as of 2026-11-26). `sticki-gaps` places newly closed entries below this line; move them to the archive when this section grows.
