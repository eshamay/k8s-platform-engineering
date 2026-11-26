# Open knowledge gaps — k8s-platform-engineering

This file tracks unresolved questions about Kubernetes platform engineering.
- Agents may DRAFT new entries during ingest or query.
- Only humans may set status = `closed` and write the Resolution paragraph.
- Closed gaps STAY in this file. They are the project's reasoning trail.

## Index of open gaps

- [[#named-production-adopters-of-control-plane-tools]] — open, unassigned
- [[#independent-scale-benchmarks-for-etcd-vcluster-and-kcp]] — open, unassigned
- [[#control-plane-as-platform-outage-postmortems]] — open, unassigned
- [[#direct-reads-of-argo-cd-flux-ack-and-config-connector-failure-modes]] — open, unassigned
- [[#community-direction-for-the-kubernetes-as-a-kernel-distribution-model]] — open, unassigned
- [[#adoption-observe-only-and-ignore-differences-controls]] — open, unassigned
- [[#argo-cd-versus-flux-head-to-head-behavior]] — open, unassigned
- [[#current-crossplane-terminology-versus-the-early-claims-and-classes-model]] — open, unassigned
- [[#informer-resync-semantics]] — open, unassigned
- [[#origin-of-level-driven-not-edge-driven-guidance]] — open, unassigned
- [[#incidents-caused-by-lost-events-or-edge-triggered-design]] — open, unassigned
- [[#reconcile-defaults-for-crossplane-ack-and-cluster-api]] — open, unassigned
- [[#kubernetes-v136-staleness-mitigation-mechanisms-and-metrics]] — open, unassigned
- [[#named-end-user-case-study-of-convergence-trouble]] — open, unassigned
- [[#flux-helm-controller-override-manager-and-dry-run-failure-recovery]] — open, unassigned
- [[#config-connector-reconcile-interval-and-drift-cadence]] — open, unassigned
- [[#production-incidents-from-drift-correction]] — open, unassigned
- [[#kro-drift-issue-history-and-comparability-of-ten-hour-resyncs]] — open, unassigned
- [[#argo-cd-multi-cluster-hub-and-spoke-and-applicationsets]] — open, unassigned
- [[#secret-management-in-gitops-agents]] — open, unassigned
- [[#named-gitops-adopters-and-gitops-caused-outages]] — open, unassigned
- [[#config-connector-and-ack-behavior-under-a-gitops-agent]] — open, unassigned
- [[#git-versus-oci-as-the-canonical-gitops-source]] — open, unassigned
- [[#how-argo-cd-config-connector-ack-and-cluster-api-key-resources-by-gvk]] — open, unassigned
- [[#informer-and-cache-behavior-keyed-by-gvr]] — open, unassigned
- [[#controller-runtime-v030-dynamic-mapper-claim-and-aggregated-discovery-rationale]] — open, unassigned
- [[#crd-scale-limits]] — open, unassigned
- [[#crd-handling-in-cluster-api-config-connector-ack-and-backstage]] — open, unassigned
- [[#status-of-the-conversion-webhook-and-garbage-collection-problem]] — open, unassigned
- [[#contents-of-the-k8saf-admission-webhook-postmortems]] — open, unassigned
- [[#kro-status-schema-and-crossplane-v2-status-propagation]] — open, unassigned
- [[#kstatus-rules-for-combining-observedgeneration-and-conditions]] — open, unassigned
- [[#config-connector-and-argo-cd-status-semantics-beyond-health-checks]] — open, unassigned
- [[#where-observedgeneration-should-live]] — open, unassigned
- [[#generic-readiness-when-cluster-api-moves-from-ready-to-available]] — open, unassigned
- [[#named-case-studies-and-postmortems-for-status-problems]] — open, unassigned
- [[#server-side-apply-behavior-in-kro-ack-config-connector-and-helm-4]] — open, unassigned
- [[#best-default-conflict-policy-for-teams-running-gitops-and-in-cluster-controllers]] — open, unassigned
- [[#crossplane-v2-server-side-apply-behavior-and-external-writers]] — open, unassigned
- [[#cluster-api-field-ownership-rules-and-argo-cd-server-side-diff-stability]] — open, unassigned
- [[#admission-behavior-of-crossplane-kro-argo-cd-config-connector-ack-cluster-api-and-gatekeeper]] — open, unassigned
- [[#kyverno-webhook-failure-modes-and-availability]] — open, unassigned
- [[#cel-cost-limits-and-per-request-budgets]] — open, unassigned
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
- [[#informer-and-cache-choices-of-kro-config-connector-ack-and-cluster-api]] — open, unassigned
- [[#argo-cd-finalizer-variants-and-non-cascading-deletes]] — open, unassigned
- [[#flux-kustomization-finalizer-name-and-behavior]] — open, unassigned
- [[#resolution-of-crossplane-issue-7801-on-credential-protection]] — open, unassigned
- [[#how-ack-config-connector-and-kro-name-and-remove-their-finalizers]] — open, unassigned
- [[#cluster-api-issue-1514-on-blocking-deletion-with-a-finalizer-or-annotation]] — open, unassigned
- [[#how-kro-sets-ownership-and-labels-on-child-resources]] — open, unassigned
- [[#argo-cd-prunepropagationpolicy-and-resource-tracking-methods]] — open, unassigned
- [[#what-happens-when-blockownerdeletion-is-set-without-finalizers-permission]] — open, unassigned
- [[#crossplane-v2-namespaced-composites-and-managementpolicies-versus-garbage-collection]] — open, unassigned
- [[#keps-on-cross-namespace-ownership-and-garbage-collector-performance]] — open, unassigned
- [[#how-a-platform-should-choose-condition-polarity]] — open, unassigned
- [[#which-parts-of-the-config-connector-reconcile-status-design-shipped]] — open, unassigned
- [[#adoption-and-orphaning-behavior-in-cluster-api-kro-and-controller-runtime-operators]] — open, unassigned
- [[#behavior-of-namespaced-v2-managed-resources-when-a-namespace-is-deleted-while-the-provider-is-down]] — open, unassigned
- [[#per-provider-external-name-defaults]] — open, unassigned
- [[#config-connector-conflict-handling-when-two-objects-target-one-cloud-resource]] — open, unassigned
- [[#flux-handling-of-composite-resources-and-kro-instances]] — open, unassigned
- [[#scale-of-composite-resources-per-controller]] — open, unassigned
- [[#feature-parity-of-function-kro-with-standalone-kro]] — open, unassigned
- [[#crossplane-function-runner-architecture-history]] — open, unassigned
- [[#config-connector-and-ack-behavior-when-wrapped-by-compositions]] — open, unassigned
- [[#upjet-runtime-execution-model-and-cost]] — open, unassigned
- [[#config-connector-controller-kind-per-resource]] — open, unassigned
- [[#flux-and-argo-cd-handling-of-provider-managed-resources]] — open, unassigned
- [[#flux-source-controller-internals-and-artifact-serving-under-leader-election]] — open, unassigned
- [[#flux-sharding-in-production-and-the-helmchart-labeling-rule]] — open, unassigned
- [[#flux-image-automation-api-status-and-safe-promotion-policy]] — open, unassigned
- [[#crossplane-package-dependency-resolution-revision-activation-and-upgrade-policy]] — open, unassigned
- [[#neutral-comparisons-of-crossplane-with-terraform-and-single-cloud-operators]] — open, unassigned
- [[#kro-governance-status-and-the-future-of-the-graph-api]] — open, unassigned
- [[#scaling-limits-of-per-rgd-kro-controllers-and-named-production-kro-adopters]] — open, unassigned
- [[#primary-source-status-of-radius-and-score]] — open, unassigned
- [[#krm-function-specification-and-runtime-requirements]] — open, unassigned
- [[#config-connector-namespaced-versus-cluster-mode-and-deletion-policies]] — open, unassigned
- [[#kratix-destination-and-gitstatestore-mechanics]] — open, unassigned
- [[#maintenance-status-of-tofu-controller-and-terraform-operator]] — open, unassigned
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

## Independent scale benchmarks for etcd, vcluster, and kcp — status: open

- **Question:** What do independent benchmarks show for the 30,000 to 40,000 object degradation point, roughly 100 vCluster tenants, 1000+ kcp tenants, and the million-workspace kcp goal?
- **Why it matters:** These figures come from vendors with a stake in the answer and depend on the workload.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find neutral benchmarks or large-operator write-ups.
  - [ ] Update [[findings/etcd-scale-limits-of-the-shared-store]] and [[comparisons/tenancy-models-namespaces-vcluster-kcp]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, etcd, vcluster, kcp

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

## Direct reads of Argo CD, Flux, ACK, and Config Connector failure modes — status: open

- **Question:** What failure-mode details, such as Argo CD drift and self-heal and Flux server-side apply conflicts, appear in the full documentation?
- **Why it matters:** The dossier read these pages through a summarizing fetch, so details may be missing or wrong. The ACK 10-hour resync default also needs verification.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the full pages directly and correct the entity and finding pages.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, flux, ack, verification
- **Possible resolution from [[sources/research-gap-g3-reconcile-defaults]]:** Marginally helpful, on the ACK default only. The 10 hour resync default is verified against the drift-recovery page and the runtime constant `defaultResyncPeriod = 10 * time.Hour`. The failure-mode details for Argo CD drift, Flux conflicts, and Config Connector were not read. See [[entities/ack]].


## Community direction for the Kubernetes-as-a-kernel distribution model — status: open

- **Question:** Does the Ænix "distribution" model reflect community direction, for example in a SIG or KEP, or only one vendor's view?
- **Why it matters:** It determines how much weight the non-container use cases deserve.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find SIG discussions or KEPs and conference talks on API server aggregation, server-side apply, and streaming lists.
- **Drafted by:** agent on 2026-11-25
- **Tags:** distributions, aenix, kep

## Adoption, observe-only, and ignore-differences controls — status: open

- **Question:** How do ACK resource adoption, Crossplane management policies (observe-only), Argo CD `ignoreDifferences`, and Flux server-side apply field managers let teams bring existing resources under declarative control or exempt fields from correction?
- **Why it matters:** These controls are the main mitigation for the multiple-writer and drift pitfalls, and none was read in the dossier.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each tool's documentation directly.
  - [ ] Update [[findings/multiple-writers-on-one-object]] and [[findings/defaulting-and-drift-reconcile-loops]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, ignore-differences, management-policies
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Largely helpful. The dossier covers Argo CD `ignoreDifferences` (JSON pointer, JQ path, `managedFieldsManagers`), Flux `driftDetection.ignore` and the `ssa` annotation, and Crossplane `managementPolicies` with Observe adoption and the pause annotation. ACK adoption was not read. See [[comparisons/exemption-and-ignore-controls-across-tools]].
- **Possible resolution from [[sources/research-idempotency]]:** Partly closes the ACK adoption part. The dossier reads the ACK adoption guide (`adopt-or-create`, strict `adopt`, `adoption-fields`, Beta status), Config Connector acquisition by name, Crossplane's Observe-then-manage import flow, and SAP's explicit-intent design. It does not read Argo CD `ignoreDifferences` or Flux field managers. See [[comparisons/ambiguous-create-and-adoption-strategies-across-crossplane-sap-ack-and-config-connector]] and [[examples/ack-adopt-or-create-brings-existing-aws-resources-under-management]].
- **Possible resolution from [[sources/research-managed-resource]]:** Largely helpful for Crossplane, ACK, and Config Connector. The dossier reads the Crossplane import guide and observe-only design document, ACK's read-only annotation, and Config Connector's acquire-by-name behavior and abandon annotation. It does not read Argo CD `ignoreDifferences` or Flux field managers. See [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]] and [[examples/crossplane-import-of-an-existing-gcp-database-observes-first-then-takes-control]].
- **Possible resolution from [[sources/research-pitfalls-and-case-studies]]:** Partly helpful for the ignore and exemption side. The dossier reads Flux's new Kustomization ignore rules (strip when another server-side apply manager owns the field, adopt when Flux is the sole owner), Argo CD's `ignoreDifferences` with `RespectIgnoreDifferences` and its `--force-conflicts` server-side apply mode, and Crossplane's `initProvider` for create-only values. It does not read ACK adoption or Config Connector. See [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]].

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

## Informer resync semantics — status: open

- **Question:** What does an informer resync period actually do in client-go and controller-runtime, and how does it differ from a relist against the API server?
- **Why it matters:** Tutorials say controllers re-list or resync periodically, but the dossier found no source that explains that resync replays cached state to handlers and does not refetch from the API server.
- **Owner:** unassigned
- **How to close:**
  - [ ] Walk through the client-go shared informer and reflector source.
  - [ ] Update [[concepts/informers-reflectors-and-workqueues]] and [[concepts/level-triggered-vs-edge-triggered]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** informers, resync, client-go
- **Possible resolution from [[sources/research-informers-reflectors-and-workqueues]]:** Marginally helpful. One source calls periodic resync a defense against reconciler bugs that is usually disabled, and the pitfalls blog lists misunderstanding it as a common error. No source explains what resync replays or whether it refetches from the API server. See [[decisions/keep-informer-resync-disabled-or-set-a-periodic-resync]].

## Origin of the Level driven, not edge driven guidance — status: open

- **Question:** Where is the Kubernetes Controller Writing Guide that the Ayson post quotes as "Level driven, not edge driven," and does it say more about expectations?
- **Why it matters:** The quote is cited second-hand, and the original guide URL was not located.
- **Owner:** unassigned
- **How to close:**
  - [ ] Locate the guide in the kubernetes/community repository or a successor.
  - [ ] Verify the quote and the Joe Beda attribution to the O'Reilly book Cloud Native Infrastructure.
- **Drafted by:** agent on 2026-11-25
- **Tags:** level-triggered, verification, provenance

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



## Kubernetes v1.36 staleness mitigation mechanisms and metrics — status: open

- **Question:** What are the actual feature names, mechanisms, and metric names in the Kubernetes v1.36 staleness mitigation work, and how do they change the guidance in [[findings/stale-cache-and-double-action]]?
- **Why it matters:** The dossier read only the first 100,000 characters of the blog post and its summary of the mitigations was generic, so the wiki cannot yet say how upstream makes cache lag observable.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the v1.36 blog post and the linked KEPs directly.
  - [ ] Update [[concepts/informers-reflectors-and-workqueues]] and [[findings/stale-cache-and-double-action]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** staleness, informers, v1-36, verification
- **Possible resolution from [[sources/research-gap-g3-k8s-and-controller-runtime]]:** Largely settled, and the user can close it. The mechanism is KEP 5647. The client-go gate `AtomicFIFO` (Beta, default true from 1.36) makes the FIFO process list batches atomically and lets a store report `LastStoreSyncResourceVersion()`. The DaemonSet, StatefulSet, ReplicaSet, and Job controllers record the resource version of their own writes and skip a sync until the cache catches up, each behind a `StaleControllerConsistency<API type>` gate (Beta, default true from 1.36), and v1.37 adds the HorizontalPodAutoscaler controller. The metrics are the alpha gauge `informer_store_resource_version` and per-controller counters such as `daemonset_controller_stale_sync_skips_total` and `job_controller_stale_sync_skips_total`, and the blog's shorter names `store_resource_version` and `stale_sync_skips_total` differ from the code. The guidance in [[findings/stale-cache-and-double-action]] now carries the fact that the built-in fix is resource-version gating and not a time-based wait. Not settled: the ReplicaSet and StatefulSet skip-metric names, the stage and default of `MonitorInformerStaleness` and `BookmarkFunc` (blog only), the text of KEP 5647 itself, and whether any controller-runtime release up to v0.25.3 ships read-your-writes (design PR 3473 merged 2026-10-05, issue 3320 open). See [[examples/kubernetes-v1-36-daemonset-statefulset-replicaset-and-job-controllers-skip-a-sync-until-the-cache-catches-up-with-their-own-write]], [[examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it]], and [[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]].
- **Possible resolution from [[sources/research-gap-b1-unverified-claims]]:** Two of the leftover items are now answered. Master source defines `stale_sync_skips_total` under the subsystems `replicaset_controller` and `statefulset_controller` (not pinned to a release), and controller-runtime v0.25.0 (2026-09-03) shipped an experimental, opt-in `ReadYourWritesConsistency` feature enabled with `Client.EnableReadYourWritesConsistency`, with v0.25.3 the latest release. Not settled: the release in which the ReplicaSet and StatefulSet counters first appeared, the stage and default of `MonitorInformerStaleness` and `BookmarkFunc`, and the text of KEP 5647. See [[findings/the-kubernetes-v1-36-staleness-blog-names-metrics-differently-from-the-changelog-and-source]] and [[findings/controller-runtime-v0-25-0-ships-an-experimental-opt-in-read-your-writes-client]]. The earlier page [[examples/controller-runtime-merged-a-read-your-own-write-client-design-in-october-2026-but-no-release-is-confirmed-to-ship-it]] is marked contradicted.

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

## Config Connector reconcile interval and drift cadence — status: open

- **Question:** What are Config Connector's default reconcile interval and drift-check cadence for direct, Terraform-based, and DCL-based controllers?
- **Why it matters:** The controller-types page says nothing about cadence, so the drift comparison has an unconfirmed row. See [[comparisons/drift-detection-mechanisms-across-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector reconcile-interval and state-into-spec documentation.
  - [ ] Fill the Config Connector row in [[comparisons/drift-detection-mechanisms-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, intervals, verification
- **Possible resolution from [[sources/research-gap-g3-reconcile-defaults]]:** Partly settled, and the user decides whether to close it. The docs describe a jittered average based on a per-resource default without stating a number. In source the global default mean is 10 minutes, jitter spreads requeues between 0.5 and 1.5 times the mean (5 to 15 minutes), the annotation `cnrm.cloud.google.com/reconcile-interval-in-seconds` overrides it per resource, setting it to 0 is documented as irreversible, and failure backoff is capped at 120 seconds. The resolution order runs Terraform service mapping, DCL metadata, IAM kind constants, then the default. Not settled: the per-kind Terraform and DCL values, so whether direct, Terraform-based, and DCL-based controllers differ by default stays open. The drift comparison row is filled in [[comparisons/drift-detection-mechanisms-across-tools]]. See [[findings/setting-a-config-connector-reconcile-interval-to-zero-switches-off-drift-correction-and-the-docs-call-it-irreversible]] and [[entities/config-connector]].


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

## Git versus OCI as the canonical GitOps source — status: open

- **Question:** Do independent sources show measurable security or operational benefits from signed OCI artifacts over direct Git pulls, and when does Argo CD support equivalent flows?
- **Why it matters:** The only evidence in the dossier is a vendor reference architecture, and Flux and Argo CD documentation frame the choice differently. See [[decisions/git-versus-oci-as-the-canonical-source]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find independent write-ups or security reviews of OCI-based Flux delivery.
  - [ ] Check Argo CD's OCI source support in current documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** oci, git, supply-chain

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

## Informer and cache behavior keyed by GVR — status: open

- **Question:** How do informers and client caches key their watches and stores by GVR or GVK, and what happens to them when a CRD is added, removed, or changes served versions?
- **Why it matters:** The dossier's source on clients and caches returned empty content, so cache behavior is uncovered. See [[concepts/informers-reflectors-and-workqueues]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find controller-runtime and client-go documentation on informer keying and CRD lifecycle.
  - [ ] Write a finding or update [[concepts/informers-reflectors-and-workqueues]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** gvr, informers, cache

## controller-runtime v0.3.0 dynamic mapper claim and aggregated discovery rationale — status: open

- **Question:** Do the controller-runtime release notes confirm that the dynamic, rate-limited RESTMapper became the default in v0.3.0, and what design rationale lies behind aggregated discovery?
- **Why it matters:** The v0.3.0 claim comes from a summarized issue thread, and no KEP for aggregated discovery was found, so the rationale rests on user-facing docs. See [[findings/stale-restmapper-hides-newly-installed-crds]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Check controller-runtime v0.3.0 release notes.
  - [ ] Locate the aggregated discovery KEP or design discussion.
- **Drafted by:** agent on 2026-11-25
- **Tags:** controller-runtime, restmapper, discovery

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

## CRD handling in Cluster API, Config Connector, ACK, and Backstage — status: open

- **Question:** How do Cluster API, Config Connector, and ACK handle CRD versioning contracts, very large CRDs, and controller scoping, and how does Backstage consume CRDs?
- **Why it matters:** The CRD dossier did not cover them because its searches returned nothing, so no entity pages were extended and no Backstage page was created. See [[entities/cluster-api]], [[entities/config-connector]], and [[entities/ack]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's API versioning and CRD installation documentation.
  - [ ] Find Backstage Kubernetes plugin documentation on custom resources.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, config-connector, ack, backstage, crd

## Status of the conversion webhook and garbage collection problem — status: open

- **Question:** Is the problem in which a down CRD conversion webhook stalls the garbage collector (issue 110720, a duplicate of 101078) fixed in current Kubernetes releases?
- **Why it matters:** The issue was closed as a duplicate and the dossier does not know the outcome. See [[findings/a-down-conversion-webhook-can-stall-garbage-collection]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read issue 101078 and the partial informer sync work.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crd, conversion, garbage-collection

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

## kstatus rules for combining observedGeneration and conditions — status: open

- **Question:** Exactly how does kstatus combine `observedGeneration`, `Ready`, `Reconciling`, and `Stalled` to produce InProgress, Current, or Failed?
- **Why it matters:** The dossier's summary of the package page was brief. The precise rules explain the premature-readiness race. See [[entities/kstatus]] and [[findings/premature-readiness-in-kstatus-based-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the cli-utils source or documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kstatus, conditions
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful. The kstatus README names the statuses, the `Reconciling` and `Stalled` conditions, the `Ready` fallback, and two corner cases, but it does not give the exact combination rules as a table. See [[findings/abnormal-true-polarity-makes-a-stopped-controller-look-healthy]].

## Config Connector and Argo CD status semantics beyond health checks — status: open

- **Question:** What conditions and generation tracking do Config Connector resources publish, and how does Argo CD interpret status beyond its health checks?
- **Why it matters:** No primary source on Config Connector was fetched and Argo CD was read only for health. See [[entities/config-connector]] and [[entities/argo-cd]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource status documentation and Argo CD's resource tracking documentation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, argo-cd, status
- **Possible resolution from [[sources/research-conditions]]:** Largely helpful for Config Connector. The reconcile-status design document describes a single `Ready` condition with reasons `Updating`, `UpToDate`, and `UpdateFailure` and `observedGeneration` set on status update, though it is a design document and may not match shipped behavior. Argo CD was read for health only. See [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]].

## Where observedGeneration should live — status: open

- **Question:** Should `observedGeneration` live at the top level of status, on each condition, or both, given that the conventions say per condition while Flux and Cluster API use a top-level field?
- **Why it matters:** Consumers need one rule to detect stale status. See [[comparisons/observedgeneration-top-level-versus-per-condition]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the final 15,000 characters of the API conventions and the Flux and Cluster API contract documents.
- **Drafted by:** agent on 2026-11-25
- **Tags:** observedgeneration, conditions
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful. KEP-1623 puts `observedGeneration` on each condition as a non-pointer integer, kro describes the per-condition value precisely, and kstatus checks the top-level field, but the dossier states that no source settles the choice. See [[comparisons/observedgeneration-top-level-versus-per-condition]].

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

## Best default conflict policy for teams running GitOps and in-cluster controllers — status: open

- **Question:** What default conflict policy should a platform team choose when a GitOps tool and in-cluster controllers write the same objects, given that the Kubernetes maintainers advise controllers to force and CD tools to surface conflicts while Argo CD and Flux both force?
- **Why it matters:** The dossier says its sources do not settle the question, and the answer decides whether revert loops or blocked automation are the more likely failure. See [[decisions/force-conflicts-or-surface-them-to-humans]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find practitioner write-ups or SIG API Machinery discussion of parsing `managedFields` to ignore conflicts.
  - [ ] Find a named adopter's policy for mixed GitOps and controller ownership.
- **Drafted by:** agent on 2026-11-25
- **Tags:** server-side-apply, gitops, conflict, decision

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

## Admission behavior of Crossplane, kro, Argo CD, Config Connector, ACK, Cluster API, and Gatekeeper — status: open

- **Question:** What webhooks and CEL validation do these tools ship or rely on, such as Crossplane's own conversion and validation webhooks, CRD-level CEL in composed APIs, kro's validation of generated CRDs, and Gatekeeper's policy model?
- **Why it matters:** The admission dossier found no primary source for any of them, so admission treatment of the platform tools is unknown. See [[concepts/admission-webhooks-and-cel]] and [[entities/crossplane]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's webhook and validation documentation.
  - [ ] Read a primary Gatekeeper source.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, kro, argo-cd, config-connector, ack, cluster-api, gatekeeper

## Kyverno webhook failure modes and availability — status: open

- **Question:** How does Kyverno configure its own webhook failurePolicy, and how does it behave when its pods are unavailable?
- **Why it matters:** Kyverno was documented only for its CEL policy types, so the resilience benefit of generated native policies is unquantified. See [[comparisons/kyverno-versus-native-validating-admission-policy]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Kyverno documentation on webhook configuration and availability.
- **Drafted by:** agent on 2026-11-25
- **Tags:** kyverno, webhooks, availability

## CEL cost limits and per-request budgets — status: open

- **Question:** What are the exact CEL cost limits for CRD validation rules and admission policies, and what per-request budgets apply?
- **Why it matters:** Schema authors need the numbers to decide how tightly to bound lists and strings. See [[findings/cel-policies-cannot-reach-external-data-and-have-bounded-cost]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Kubernetes CRD validation rules documentation on cost estimation.
- **Drafted by:** agent on 2026-11-25
- **Tags:** cel, limits, crd
- **Possible resolution from [[sources/research-finalizers]]:** Partly helpful on mechanism only. The dossier found no named-company postmortem for stuck finalizers and says so, but it collects the causes (missing controller, always-failing cleanup, child finalizers) and the dangers of forced removal. See [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]].

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

## Argo CD and Config Connector as operators — status: open

- **Question:** How do Argo CD and Config Connector handle failures as operators, and do they follow the one-controller-per-concern guidance?
- **Why it matters:** The operator-pattern dossier fetched no page on either tool. See [[entities/argo-cd]] and [[entities/config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD and Config Connector architecture documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, config-connector, operators
- **Possible resolution from [[sources/research-finalizers]]:** Not helpful. The dossier does not cover Backstage.

## Backstage and the operator pattern — status: open

- **Question:** How does Backstage relate to the operator pattern, for example as a portal over operator-managed custom resources?
- **Why it matters:** No source in the wiki covers Backstage, so the platform-engineering layer above operators is missing. See [[concepts/operator-pattern]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Backstage documentation on Kubernetes and custom resource integration.
- **Drafted by:** agent on 2026-11-25
- **Tags:** backstage, platform-engineering
- **Possible resolution from [[sources/research-composite-resource]]:** Not helpful. The dossier does not mention Backstage, although it notes that composite kinds are consumed as products by other teams and that Kratix uses Crossplane as a component.

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

## Flux shared caches and Crossplane performance guidance — status: open

- **Question:** How do Flux controllers share or isolate informer caches, and what does Crossplane's current performance and sharding guidance say?
- **Why it matters:** The dossier found Flux tuning flags but no informer internals, and the guessed Crossplane performance guide URL returned 404, so the scale gap still has no Flux or Crossplane sharding data.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux controller source and the current Crossplane performance documentation.
  - [ ] Update [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, crossplane, sharding, scale

## Informer and cache choices of kro, Config Connector, ACK, and Cluster API — status: open

- **Question:** What informer, cache, concurrency, and rate-limit choices do kro, Config Connector, ACK, and Cluster API make?
- **Why it matters:** No page in the informers dossier covered these tools, so the comparison tables have empty cells for them. Backstage was also not covered by any source.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read each project's controller configuration documentation or source.
  - [ ] Extend [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, config-connector, ack, cluster-api, informers

## Argo CD finalizer variants and non-cascading deletes — status: open

- **Question:** What do Argo CD's Foreground and Background finalizer variants do, and which options exist for deleting an Application without deleting its workloads beyond ApplicationSet `preserveResourcesOnDeletion`?
- **Why it matters:** The dossier read only the ApplicationSet deletion page, so Argo CD's deletion behavior is incomplete. See [[examples/argo-cd-resources-finalizer-cascades-an-application-delete-to-its-workloads]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD documentation on app deletion and finalizers.
  - [ ] Update [[entities/argo-cd]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, finalizers, deletion
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Partly helpful. The Argo CD App Deletion page says cascade needs the `resources-finalizer.argocd.argoproj.io` finalizer, that cascade uses foreground propagation by default, and that background and non-cascading deletes are selectable. The Foreground and Background finalizer variants and `PrunePropagationPolicy` were still not read. See [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].

## Flux Kustomization finalizer name and behavior — status: open

- **Question:** What is Flux's own finalizer on a Kustomization, and how does `WaitForTermination` interact with the finalizers of child objects?
- **Why it matters:** The dossier read about 100 KB of a page of about 121 KB and did not isolate the finalizer section or confirm `finalizers.fluxcd.io`. See [[examples/flux-kustomization-deletion-policy-chooses-between-mirror-prune-delete-wait-and-orphan]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the full Kustomization reference and the kustomize-controller source.
  - [ ] Update [[entities/flux]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, finalizers, verification
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Marginally helpful. The dossier read about 100,000 of 121,000 characters of the Kustomization page, found `deletionPolicy` and inventory-based pruning, and did not isolate the finalizer name or say whether Flux uses owner references. See [[entities/flux]].

## Resolution of Crossplane issue 7801 on credential protection — status: open

- **Question:** Was Crossplane issue 7801 resolved, and did a fix such as Secret finalizers, credential caching, or ordered teardown ship?
- **Why it matters:** The issue is a proposal discussion and its outcome is unknown. See [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]] and [[decisions/protect-shared-credentials-with-finalizers-caching-or-ordered-teardown]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the issue thread and any linked pull requests.
  - [ ] Update the finding and the decision page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, finalizers, credentials

## How ACK, Config Connector, and kro name and remove their finalizers — status: open

- **Question:** What finalizer names do ACK, Config Connector, and kro put on objects, and how and when does each remove them?
- **Why it matters:** Their documentation pages do not explain it, so a comparison would need live objects or source code. See [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Inspect live objects or read each controller's source.
  - [ ] Add the names to the entity pages.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ack, config-connector, kro, finalizers

## Cluster API issue 1514 on blocking deletion with a finalizer or annotation — status: open

- **Question:** What does Cluster API issue 1514 conclude about blocking deletion with a finalizer or an annotation, and how does that relate to the hook annotations in the current book?
- **Why it matters:** It was a search hit that the dossier did not read. See [[examples/cluster-api-machine-deletion-drains-detaches-and-runs-hooks-before-removing-the-node]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the issue and the current machine deletion hook documentation.
  - [ ] Update [[entities/cluster-api]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, finalizers, deletion

## How kro sets ownership and labels on child resources — status: open

- **Question:** Does kro set owner references or labels on the resources that an instance creates, and in what order does it delete them beyond the reverse-wave behavior already recorded?
- **Why it matters:** The owner-reference dossier could not read kro's instances or FAQ pages, so kro is the one platform tool in scope with no known ownership model. See [[entities/kro]] and [[sources/research-owner-references-and-garbage-collection]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read kro's instances and FAQ documentation or the controller source.
  - [ ] Add a kro row to [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, owner-references, deletion
- **Possible resolution from [[sources/research-composite-resource]]:** Marginally helpful. The kro FAQ tells Argo CD users to add an ownerReference and an `argocd.argoproj.io/tracking-id` annotation to every templated resource, which suggests kro does not set these in a way Argo CD tracks by default, and the RGD overview says deletion follows reverse topological order. It does not say whether kro sets its own owner references or labels. See [[examples/kro-resources-need-owner-references-and-tracking-ids-to-be-tracked-by-argo-cd]].

## Argo CD PrunePropagationPolicy and resource tracking methods — status: open

- **Question:** How do the `PrunePropagationPolicy` sync option and Argo CD's label, annotation, and tracking-id methods interact with Kubernetes propagation policies when Argo CD prunes or deletes resources?
- **Why it matters:** The dossier read only the App Deletion page, so the way Argo CD identifies the objects it owns, and how it deletes them, is incomplete. See [[entities/argo-cd]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Argo CD sync options and resource tracking documentation.
  - [ ] Update [[comparisons/how-tools-garbage-collect-owner-references-inventory-and-finalizers]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, prune, propagation-policy

## What happens when blockOwnerDeletion is set without finalizers permission — status: open

- **Question:** When a controller sets `blockOwnerDeletion: true` without `update` on the owner's `/finalizers` subresource, does the API server reject the write or silently drop the flag?
- **Why it matters:** An official page describes an admission check and a controller-author blog describes silent dropping, so the failure mode is disputed. See [[findings/blockownerdeletion-needs-permission-on-the-owner-and-the-failure-mode-is-disputed]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Test on a cluster or read the OwnerReferencesPermissionEnforcement admission plugin source.
  - [ ] Update the finding and [[concepts/owner-references-and-garbage-collection]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** rbac, blockownerdeletion, verification

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

## KEPs on cross-namespace ownership and garbage collector performance — status: open

- **Question:** Do any Kubernetes enhancement proposals or conference talks address cross-namespace ownership or garbage collector performance, and are the design archive's foreground and background labels outdated?
- **Why it matters:** The dossier fetched no KEPs, and its summaries of the finalizers blog and the design proposal conflicted with current documentation. See [[concepts/owner-references-and-garbage-collection]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Search the kubernetes/enhancements repository and SIG API Machinery material.
  - [ ] Re-read the finalizers blog and design proposal in full.
- **Drafted by:** agent on 2026-11-25
- **Tags:** keps, garbage-collection, verification

## How a platform should choose condition polarity — status: open

- **Question:** Should new condition types be abnormal-true (as kstatus prefers) or positive (as the Cluster API proposal and the API conventions lean), and what evidence shows which choice produces fewer misreadings by generic tools?
- **Why it matters:** The sources read leave the choice to authors, so the wiki cannot recommend one. See [[decisions/choose-abnormal-true-or-positive-polarity-for-new-condition-types]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the last part of the API conventions and the kstatus design discussion.
  - [ ] Find practitioner write-ups on polarity incidents.
- **Drafted by:** agent on 2026-11-25
- **Tags:** conditions, polarity, kstatus, decision

## Which parts of the Config Connector reconcile-status design shipped — status: open

- **Question:** Did Config Connector ship the single `Ready` condition reasons (`Updating`, `UpToDate`, `UpdateFailure`) and the proposal to carry long-running operation IDs in the reason, as the design document describes?
- **Why it matters:** The only source is a design document, so [[examples/config-connector-ready-condition-moves-through-updating-uptodate-and-updatefailure]] may describe intent and not behavior.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource status documentation or inspect a live resource.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, conditions, verification

## Adoption and orphaning behavior in Cluster API, kro, and controller-runtime operators — status: open

- **Question:** How do Cluster API, kro, and plain controller-runtime operators handle adopting an existing resource and orphaning one on delete?
- **Why it matters:** The managed resource dossier found no readable primary source for these tools, so [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]] covers only Crossplane, Config Connector, and ACK.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Cluster API and kro documentation on adoption and deletion.
  - [ ] Read the ACK introduction blog.
- **Drafted by:** agent on 2026-11-25
- **Tags:** adoption, orphan, cluster-api, kro

## Behavior of namespaced v2 managed resources when a namespace is deleted while the provider is down — status: open

- **Question:** What happens to namespaced Crossplane v2 managed resources when their namespace is deleted while the provider is absent, beyond the finalizer note?
- **Why it matters:** The dossier says deletion hangs without the provider and that hand-removing the finalizer orphans the real resource, but the Crossplane docs do not state the namespace-deletion case clearly.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find Crossplane documentation or an issue that describes the namespace-deletion case in v2.
  - [ ] Add the result to [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, finalizers, namespaces, deletion

## Per-provider external-name defaults — status: open

- **Question:** What is the default `crossplane.io/external-name` for each major provider and resource kind?
- **Why it matters:** One source says the default is the object name for S3 and another says external resources are named like the Kubernetes object by default, and per-provider variation is not documented in one place.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the provider documentation for AWS, Azure, and GCP kinds.
  - [ ] Update [[decisions/external-name-annotation-or-spec-field]] if defaults differ.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, external-name, providers

## Config Connector conflict handling when two objects target one cloud resource — status: open

- **Question:** What does Config Connector do when two Kubernetes objects acquire the same cloud resource?
- **Why it matters:** The acquire-by-name behavior was read through a summarized fetch and lacks conflict handling detail, which matters for [[findings/adopt-or-create-can-take-over-a-look-alike-resource]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector resource acquisition documentation directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, adoption, conflicts


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

## Crossplane function runner architecture history — status: open

- **Question:** Which parts of the earlier Crossplane function runner model (a gRPC runner as a sidecar to the Crossplane pod, and a container-runner path) still exist, given that the design doc describes functions as Deployments behind a headless Service?
- **Why it matters:** The VSHN post from 2023 and the design doc disagree on the runtime shape, and operators need the current model to size and secure functions. See [[sources/research-composition]] and [[entities/crossplane]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Crossplane Function package and runtime documentation.
  - [ ] Update [[entities/crossplane]] and [[findings/composition-functions-add-moving-parts-that-must-be-healthy]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, composition-functions, verification

## Config Connector and ACK behavior when wrapped by compositions — status: open

- **Question:** How do Config Connector and ACK readiness conditions and deletion policies interact when their resources are composed by a Crossplane Composition or a kro ResourceGraphDefinition?
- **Why it matters:** Both are the managed-resource layer that compositions typically wrap, but the dossier's pages say nothing about this interplay, and the ACK drift recovery and deletion policy topics were not opened. See [[sources/research-composition]], [[entities/config-connector]], and [[entities/ack]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the ACK deletion policy and drift recovery guides and the Config Connector deletion and readiness pages.
  - [ ] Find a worked example of a graph wrapping ACK or Config Connector resources and record how readiness propagates.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ack, config-connector, composition, readiness

## Upjet runtime execution model and cost — status: open

- **Question:** How do Upjet-generated Crossplane controllers run Terraform logic at runtime, as a CLI subprocess or in-process, and what do they cost in memory and performance?
- **Why it matters:** The Upjet repository summary says controllers reuse Terraform's resource logic, but the runtime shape was not confirmed, and the generated official AWS, Azure, and GCP providers depend on it. See [[sources/research-provider]], [[entities/upjet]], and [[findings/generated-provider-catalogs-inherit-the-behavior-and-bugs-of-their-generator]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Upjet architecture and performance documentation.
  - [ ] Update [[entities/upjet]] with the runtime model and resource costs.
- **Drafted by:** agent on 2026-11-25
- **Tags:** upjet, crossplane, terraform, performance

## Config Connector controller kind per resource — status: open

- **Question:** Which Config Connector resources use the direct, Terraform-based, or DCL-based controller, and what is the direction of travel between them?
- **Why it matters:** The controller kind decides backoff defaults (2 minutes maximum for Terraform and DCL, tunable for direct) and drift behavior, but the reconciliation page does not map resources to kinds. See [[sources/research-provider]] and [[entities/config-connector]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find a per-resource list or the Config Connector release notes on direct controllers.
  - [ ] Update [[entities/config-connector]] with the mapping.
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, reconciliation, verification

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

## Flux source-controller internals and artifact serving under leader election — status: open

- **Question:** How does the Flux source controller store and serve artifacts, how does leader election affect artifact serving when several replicas run, and how does OCI source verification work?
- **Why it matters:** The Flux deep dive read the source controller only at overview level, yet every downstream controller depends on its artifacts, and the Git-to-Ready lifecycle trace cannot be completed without it. See [[entities/flux]] and [[sources/research-flux-deep-dive]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the source controller API pages for GitRepository, OCIRepository, HelmChart, and Bucket directly.
  - [ ] Update [[entities/flux]] and write a worked example for the lifecycle trace.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, source-controller, leader-election, verification

## Flux sharding in production and the HelmChart labeling rule — status: open

- **Question:** What do production deployments of Flux sharding look like, and what is the exact labeling rule for HelmChart objects that the sharding page cautions about?
- **Why it matters:** The only adopter in the dossier lists sharding as future work, and the labeling caveat could cause objects to land on the wrong shard. See [[findings/sharded-flux-dependents-must-carry-the-same-shard-label-as-their-parents]] and [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux sharding page directly and note the HelmChart caveat.
  - [ ] Find a named adopter that runs shards and record its numbers.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, sharding, scale, verification

## Flux image automation API status and safe promotion policy — status: open

- **Question:** What are the current API versions and maturity of the Flux image automation controllers, and what promotion policy do adopters use to keep automatic tag updates out of production?
- **Why it matters:** The dossier read the guide as a digest and says current versions and any beta status should be checked, and automatic tag commits are a documented rollout risk. See [[findings/automatic-image-tag-updates-can-roll-unintended-versions-into-production]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the image automation API reference and release notes.
  - [ ] Find adopter write-ups on staging-only or reviewed promotion.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, image-automation, verification

## Crossplane package dependency resolution, revision activation, and upgrade policy — status: open

- **Question:** How does Crossplane resolve dependencies between Providers, Functions, and Configurations, which revision becomes active on an upgrade, and what upgrade policies apply to packages?
- **Why it matters:** The packages overview in the deep dive lists the four package types but gave no detail on dependency resolution, revisions, or upgrade policy, and staged rollouts depend on it. See [[entities/crossplane]] and [[concepts/provider]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane package documentation and the Configuration dependency pages directly.
  - [ ] Update [[entities/crossplane]] and [[findings/provider-upgrades-leave-old-revisions-and-block-automatic-downgrades]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, packages, upgrades, verification

## Neutral comparisons of Crossplane with Terraform and single-cloud operators — status: open

- **Question:** What do neutral sources, such as practitioner benchmarks or independent write-ups, say about Crossplane versus Terraform, OpenTofu, Pulumi, CDK, Config Connector, ACK, and Azure Service Operator?
- **Why it matters:** The dossier's comparisons come from the Crossplane project and from Encore, a vendor of a competing product, and no primary documentation was read for Config Connector, ACK, or Azure Service Operator. See [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]] and [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find independent comparisons and adopter migration write-ups.
  - [ ] Revise [[comparisons/crossplane-versus-terraform-reconciliation-versus-plan-and-apply]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, terraform, comparison, bias

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

## Primary-source status of Radius and Score — status: open

- **Question:** What do the primary Radius and Score documents and CNCF listings say about maturity, governance, and lineage?
- **Why it matters:** Radius claims come from one third-party blog because its docs could not be read, and Score's CNCF Sandbox status and Humanitec origin come only from its own site.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the primary Radius documentation and the CNCF project pages for both.
  - [ ] Revise [[entities/radius]], [[entities/score]], and [[comparisons/score-versus-radius-as-developer-facing-workload-abstractions]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** radius, score, cncf, verification

## KRM function specification and runtime requirements — status: open

- **Question:** What does the KRM function specification require of a function and its runtime, and which tools can run functions without containers?
- **Why it matters:** The dossier did not fetch the specification, and the Kustomize discussion shows that the container requirement blocks use on laptops, CI, and Argo CD.
- **Owner:** unassigned
- **How to close:**
  - [ ] Fetch the KRM function specification and the kpt function documentation.
  - [ ] Update [[entities/kpt]] and [[findings/moving-kustomize-helm-inflation-to-krm-functions-needs-a-container-runtime-that-laptops-ci-and-argo-cd-often-lack]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** krm-functions, kpt, kustomize, containers

## Config Connector namespaced versus cluster mode and deletion policies — status: open

- **Question:** How do Config Connector's namespaced and cluster modes differ in practice, and which deletion policies apply when a parent or child resource is removed?
- **Why it matters:** The landscape dossier's fetched text did not detail either, and a practitioner reports unordered deletion and DeleteFailed children under Argo CD.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Config Connector mode and deletion-policy documentation.
  - [ ] Revise [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]] and [[entities/config-connector]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** config-connector, deletion, modes

## Kratix Destination and GitStateStore mechanics — status: open

- **Question:** How do Kratix Destinations and GitStateStores decide where a Promise's output is written and scheduled?
- **Why it matters:** The fetched excerpt omitted both, and the PCI cluster example depends on them. The InfraCloud article redirected away and two other sites were unreachable.
- **Owner:** unassigned
- **How to close:**
  - [ ] Fetch the Kratix documentation on Destinations and GitStateStores.
  - [ ] Expand [[entities/kratix]] and [[examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kratix, destinations, gitops

## Maintenance status of tofu-controller and Terraform Operator — status: open

- **Question:** What is the current maintenance level of tofu-controller after Weaveworks' wind-down, and of the community Terraform Operator?
- **Why it matters:** Teams adopting either project need to know the last release and who maintains it, and the dossier did not check.
- **Owner:** unassigned
- **How to close:**
  - [ ] Check release history and maintainers for both repositories.
  - [ ] Update [[entities/tofu-controller]], [[entities/terraform-operator]], and [[comparisons/tofu-controller-versus-terraform-operator-as-terraform-in-cluster-controllers]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** terraform, tofu-controller, maintenance

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

## Force-conflicts versus strip-or-adopt when two controllers co-own a field — status: open

- **Question:** Is Argo CD's default `--force-conflicts` server-side apply or Flux's strip-or-adopt ignore rule safer when two controllers legitimately co-own a field?
- **Why it matters:** Neither the Flux blog nor the Argo CD documentation compares the two, yet the choice decides which controller silently loses its writes. See [[comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Find a source or experiment that compares both under a shared-field scenario.
  - [ ] Read the official server-side apply reference directly.
- **Drafted by:** agent on 2026-11-25
- **Tags:** ssa, flux, argo-cd, conflicts

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

---

## Closed gaps

## Full lifecycle trace from Git commit to Ready status — status: closed (2026-11-26)

- **Question:** What exactly happens, step by step, from a Git commit in a Flux-managed repository through source fetch, rendering, server-side apply, finalizer registration, controller reconciliation, and status condition updates until the object reports Ready?
- **Why it matters:** The lifecycle trace ties together nearly every concept in the vocabulary and is the best test of whether the wiki's concept pages compose into a coherent whole.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find sources that describe Flux's source-controller, kustomize-controller, and helm-controller flow in detail.
  - [ ] Trace SSA field ownership, finalizer, and condition behavior through the flow.
  - [ ] Write a worked example page under `examples/`.
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, lifecycle, ssa, finalizers, conditions
- **Resolution:** Settled at the level of an assembled trace, not a single-source trace. Part 5 sections 2 to 4 ([[outputs/part-5-platform-architecture-principles-and-operating-at-scale]]) now walk one merged commit end to end: the source controller fetches the repository on its interval (or immediately when a notification Receiver fires) and packages an artifact; the Kustomization builds and applies it with server-side apply under a Flux field manager, runs an apply dry run each interval to detect drift, and impersonates a tenant ServiceAccount; built-in controllers then carry the intent forward through owner references. For the Crossplane half, the trace continues through the composite, the composition-function pipeline, managed resources and the provider's Connect, Observe, Create, Update, Delete cycle, and returns upward through status conditions (Ready, Reconciling, Stalled, Synced) read together with observedGeneration. Supporting pages: [[entities/flux]], [[concepts/server-side-apply-and-field-ownership]], [[concepts/finalizers]], [[concepts/conditions]], [[examples/gitops-reverts-a-hand-edited-deployment]]. Not settled: no single source traces this flow, so the trace is the wiki's own composition of documented behaviors and says where documentation is silent; finalizer behavior is covered on the deletion path (Crossplane managed resources, Flux prune and deletion policy), not as a registration step on create; and the how-to-close item for a worked example under examples/ was met by Part 5 instead of a standalone page. Remaining questions are tracked in [[#flux-source-controller-internals-and-artifact-serving-under-leader-election]] and [[#flux-kustomization-finalizer-name-and-behavior]].
- **Closed by:** Eric Shamay on 2026-11-26

- **Possible resolution from [[sources/research-universal-control-plane]]:** The dossier covers Flux only at the component and Kustomization API level (`dependsOn`, `prune`, `healthChecks`, drift correction through server-side apply dry runs). It does not trace the source-controller to kustomize-controller handoff, so it only partly helps. See [[entities/flux]].
- **Possible resolution from [[sources/research-declarative-vs-imperative]]:** The dossier adds Flux Kustomization details that belong in the trace: sources produce artifacts that Kustomizations apply, drift is detected with a server-side apply dry run each interval, `prune` and the deletion policy govern removal, and `suspend` pauses reconciliation. It still does not trace finalizer registration or status condition updates, so it only partly helps. See [[examples/git-driven-cluster-reconciliation-with-flux-and-argo-cd]].
- **Possible resolution from [[sources/research-level-triggered-vs-edge-triggered]]:** Only marginally helpful. The dossier shows that Flux's Kustomization reconciles on its interval and immediately on source revision changes, runs a server-side apply dry run each cycle, and uses `retryInterval` on failure, which fits the trigger and retry steps of the trace. It does not trace source-controller handoff, finalizers, or condition updates. See [[entities/flux]] and [[examples/gitops-reverts-a-hand-edited-deployment]].
- **Possible resolution from [[sources/research-eventual-consistency-and-convergence]]:** Only marginally helpful. The dossier adds Flux Kustomization behavior that belongs in the trace: reconcile at `spec.interval`, immediate reconcile on a generation or source revision change, a server-side apply dry run for drift, `dependsOn` and `healthChecks` for readiness, and `retryInterval` for failures. It does not trace source-controller handoff, finalizers, or condition updates. See [[entities/flux]] and [[examples/flux-dependson-and-health-checks-gate-rollout]].
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Marginally helpful. The dossier shows part of the Flux flow for drift: kustomize-controller and helm-controller run a server-side apply dry-run each interval, and a failing dry-run (for example from field-manager conflicts) stops correction before apply. It does not trace source fetch, finalizers, or status conditions end to end. See [[examples/flux-helmrelease-drift-correction-blocked-by-edited-service-port]] and [[entities/flux]].
- **Possible resolution from [[sources/research-gitops-pull-based-delivery]]:** Only marginally helpful. The dossier names the Flux controllers (source, kustomize, helm, notification, image automation), says Kustomizations reconcile every 5 minutes and that bootstrap commits Flux's own manifests, and describes Argo CD's API server, repository server, and application controller. It does not trace the handoff between controllers, finalizers, or condition updates. See [[comparisons/flux-versus-argo-cd-architecture]] and [[entities/flux]].
- **Possible resolution from [[sources/research-gvk-and-gvr]]:** Only marginally helpful. The dossier shows one step of the trace that depends on API discovery: Flux Kustomization `dependsOn` and `healthChecks` reference resources by apiVersion and kind, so the kustomize-controller must resolve each GVK to a resource through discovery before it can apply or assess health. It does not trace source fetch, finalizers, or status conditions. See [[comparisons/missing-crd-handling-flux-versus-argo-cd]] and [[entities/flux]].
- **Possible resolution from [[sources/research-custom-resource-definition]]:** Only marginally helpful. The dossier adds one step to the trace for charts that ship CRDs: Helm will not upgrade or delete them, so Flux's HelmRelease `crds` policies (Skip, Create, CreateReplace) and `dependsOn` decide whether CRDs exist before dependent releases are applied. It does not trace the rest of the flow.
- **Possible resolution from [[sources/research-spec-status-split]]:** Only marginally helpful. The dossier explains the last stretch of the trace: the controller writes conditions and `observedGeneration` through the `/status` subresource, Flux reads `Ready`, `Reconciling`, and `Stalled`, and a lagging `observedGeneration` means the spec change is still pending. It does not trace source fetch or finalizers. See [[concepts/spec-status-split]] and [[examples/flux-helmrelease-status-records-attempts-and-health]].
- **Possible resolution from [[sources/research-server-side-apply-and-field-ownership]]:** Partly helpful for the apply step. The dossier shows that kustomize-controller applies with server-side apply and runs a dry-run each interval, that ownership is recorded in `managedFields` under the manager name, and that a failing dry-run (for example from a stale co-owner of a list entry) stops reconciliation. It does not trace source fetch, finalizers, or condition updates. See [[entities/flux]] and [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]].
- **Possible resolution from [[sources/research-admission-webhooks-and-cel]]:** Only marginally helpful. The dossier places admission (mutating webhooks, schema validation, validating webhooks, or in-process CEL policies) after authentication and authorization and before persistence, and notes that server-side dry-run passes through webhooks, so a missing `sideEffects` declaration can fail a Flux reconcile. It does not trace the full Git-to-Ready path. See [[examples/flux-dry-run-fails-against-webhooks-without-dry-run-support]].
- **Possible resolution from [[sources/research-operator-pattern]]:** Only marginally helpful. The dossier names Flux's five controllers (source, kustomize, helm, notification, image automation) and the controller-guideline rules that govern each hop, but it does not trace the handoff between them, finalizer registration, or condition updates. See [[examples/flux-splits-gitops-into-single-purpose-controllers]].
- **Possible resolution from [[sources/research-reconciliation-loop]]:** Marginally helpful. The dossier gives the Flux Kustomization loop timing (`interval`, `retryInterval`, `timeout`, `wait`, `healthChecks`, `dependsOn`, `prune`) and the controller-runtime requeue semantics that govern each hop, but it read only the first 100,000 characters of the Flux page and does not trace source-controller handoff, finalizer registration, or condition updates. See [[examples/flux-kustomization-interval-and-retry-interval-set-the-loop-timing]].
- **Possible resolution from [[sources/research-idempotency]]:** Only marginally helpful. The dossier confirms that kustomize-controller runs a server-side apply dry-run each interval and that conflicting field ownership signals another actor, which fits the apply step of the trace. It does not trace source fetch, finalizers, or condition updates. See [[entities/flux]] and [[concepts/idempotency]].
- **Possible resolution from [[sources/research-finalizers]]:** Only marginally helpful. The dossier shows finalizer registration and teardown: Crossplane managed resources hold a finalizer until the external resource is gone, and kro keeps the instance finalizer while deleting in reverse dependency waves, but it does not trace source fetch or status conditions. See [[concepts/finalizers]] and [[examples/crossplane-ack-and-config-connector-delete-the-cloud-resource-before-the-kubernetes-object]].
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Only marginally helpful. The dossier adds the garbage collector side of the trace: the controller sets an owner reference on each child, the garbage collector's dependency graph deletes dependents when the owner goes, and a lost reference breaks cascade. It does not trace Flux's source fetch, apply, or condition updates, and it says Flux prunes through an inventory and not through owner references. See [[concepts/owner-references-and-garbage-collection]] and [[examples/gitops-tools-garbage-collect-through-inventory-and-finalizers-not-owner-references]].
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful on the last step. The dossier shows that kustomize-controller waits for applied resources to become healthy (kstatus for compatible custom resources, CEL `healthCheckExprs` for others) before marking a Kustomization `Ready`, that Flux publishes `Ready`, `Reconciling`, and `Stalled` with `observedGeneration`, and that this gating unblocks `dependsOn` dependents. It does not trace source fetch or finalizers. See [[concepts/conditions]] and [[entities/flux]].
- **Possible resolution from [[sources/research-managed-resource]]:** Only marginally helpful. The dossier shows one downstream step, that a Flux prune of a managed resource object triggers the provider's delete of the cloud resource unless Delete is excluded from `managementPolicies`, and that Crossplane's reconciler phases are Connect, Observe, Create, Update, Delete. It does not trace source fetch, apply, or condition updates. See [[entities/flux]] and [[concepts/managed-resource]].
- **Possible resolution from [[sources/research-composite-resource]]:** Not helpful. The dossier read no Flux documentation and says nothing about Flux health checks, `dependsOn`, or CRD ordering with composites. It covers only the Argo CD interaction. A new gap, [[#flux-handling-of-composite-resources-and-kro-instances]], tracks this.
- **Possible resolution from [[sources/research-composition]]:** Only marginally helpful. The dossier adds Flux `dependsOn`, health checks, and pruning and Argo CD sync waves, hooks, and reversed prune order for the ordering and readiness steps of the trace. It does not trace source fetch, finalizers, or condition updates. See [[entities/flux]] and [[entities/argo-cd]].
- **Possible resolution from [[sources/research-provider]]:** Marginally helpful. The dossier describes the provider end of the trace for Crossplane: a `Provider` installs CRDs and a controller, a managed resource is reconciled by the observe, compare, act loop, and `Ready` and `Synced` conditions report the result. It says nothing about the Flux source fetch, finalizer registration for these objects, or the handoff from a GitOps agent. See [[concepts/provider]] and [[entities/crossplane]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Partly helpful. The dossier names the controller roles that the first half of the trace needs: the source controller fetches Git, OCI, Helm, and bucket content and serves it as tar.gz artifacts, the kustomize controller builds and applies it, the notification controller can trigger an immediate reconcile through a Receiver, and `dependsOn` and `healthChecks` gate readiness. It admits that source-controller internals were not covered and does not trace finalizer registration or condition updates. See [[entities/flux]] and [[examples/flux-notification-receivers-start-reconciliation-without-waiting-for-the-poll-interval]].
- **Possible resolution from [[sources/research-crossplane-deep-dive]]:** Not helpful. The dossier covers Crossplane's model and adoption and reads no Flux documentation. Its only GitOps pairing is Argo CD in the JFrog pipeline, where Argo CD syncs custom resources from Git and Crossplane provisions the cloud resources. See [[examples/jfrog-delivers-self-service-cloud-environments-through-jenkins-git-argo-cd-and-crossplane]].
- **Possible resolution from [[sources/research-kro-and-abstraction-models]]:** Not helpful. The dossier covers abstraction models and does not trace a Git commit through Flux to Ready status. Its only related point is that render-time tools such as Helm and Kustomize leave continuous correction to a GitOps tool, while kro and Crossplane run their own reconcile loops beneath it.
- **Possible resolution from [[sources/research-landscape]]:** Not helpful. The dossier lists the Flux controllers (source, kustomize, helm, notification, image automation) and says each owns a CRD and communicates through the API server and object status, but it does not trace the handoff, finalizers, or condition updates. See [[entities/flux]].

## Crossplane Compositions vs kro dynamic resource graphs — status: closed (2026-11-26)

- **Question:** How do Crossplane Compositions (including composition functions) and kro's ResourceGraphDefinition differ in how they model, order, and reconcile dynamic resource graphs, and what trade-offs follow?
- **Why it matters:** Both offer a simplified API over many underlying resources, but with different execution models; the choice affects portability, debuggability, and dependency handling.
- **Owner:** unassigned
- **How to close:**
  - [ ] Collect official docs and design documents for both tools.
  - [ ] Collect practitioner comparisons and real-world adoption stories.
  - [ ] Write a `comparisons/` page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, kro, composition, abstraction
- **Resolution:** Settled as a structured comparison with a named decision. [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]] sets the two side by side: Crossplane splits schema (XRD) from implementation (Composition) and runs a pipeline of gRPC functions in any language, leaving ordering to the functions and eventual reconciliation, with readiness from steps such as function-auto-ready and errors surfacing mostly at reconcile time; kro puts schema and implementation in one ResourceGraphDefinition, evaluates CEL expressions, infers a dependency graph from field references, creates in topological order and deletes in reverse, gates dependents with readyWhen, and validates at creation time. [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]] explains the underlying trade (Crossplane bounds the contract and frees the code; kro bounds the language and frees the runtime), [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]] covers how each generates its API, and [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]] records the choice, including the function-kro bridge ([[entities/function-kro]]) that lets the two combine. Part 4 ([[outputs/part-4-platform-abstractions]]) teaches it. Not settled: the comparison is the wiki's synthesis, because no source compares the two head to head; kro is pre-1.0 (v1alpha1, version 0.10.0 in the docs read) so its facts may change; and kro dependency and readiness mechanics, status schema, released-version facts and per-RGD scale remain open in [[#kro-dependency-graph-and-readiness-mechanics]], [[#kro-status-schema-and-crossplane-v2-status-propagation]], [[#kro-graph-api-status-and-released-version-facts]] and [[#scaling-limits-of-per-rgd-kro-controllers-and-named-production-kro-adopters]].
- **Closed by:** Eric Shamay on 2026-11-26

- **Possible resolution from [[sources/research-universal-control-plane]]:** The dossier supplies the execution models: Crossplane uses an XRD plus a Composition that runs a pipeline of gRPC functions with observed-state feedback on each reconcile, while kro uses a ResourceGraphDefinition with CEL references from which ordering is derived. kro was pre-1.0 (0.10.0) and its dependency mechanics were not read. A first draft is in [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]]. See [[entities/crossplane]] and [[entities/kro]].
- **Possible resolution from [[sources/research-declarative-vs-imperative]]:** The dossier adds that kro validates schemas, expressions, and references at apply time, infers dependency order from CEL expressions, waits on not-yet-existing status values, supports conditionals and forEach, and keeps CEL non-Turing-complete so definitions terminate and are auditable. Crossplane instead uses a gRPC function pipeline for flexible composition. Readiness mechanics are still not described. See [[examples/platform-team-self-service-apis-with-crossplane-and-kro]].
- **Possible resolution from [[sources/research-level-triggered-vs-edge-triggered]]:** Only marginally helpful. The dossier adds Crossplane's reconcile mechanics (`forProvider` compared to the external resource, `managementPolicies`, pause annotation) but does not mention kro or composition functions, and the default poll interval was not confirmed. See [[entities/crossplane]] and [[comparisons/reconcile-cadence-and-off-switches-across-tools]].
- **Possible resolution from [[sources/research-eventual-consistency-and-convergence]]:** Partly helpful. The dossier adds that a Crossplane composite resource is Ready only when its composition function pipeline reports every composed resource ready, and gives kro's controller numbers (single shared queue, backoff, token bucket, 20-retry cap) from unreleased docs. It could not read kro's instance semantics, so readiness comparison is still incomplete. See [[comparisons/retry-and-backoff-controls-across-tools]] and [[examples/kro-shared-queue-tunes-throughput]].
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Only marginally helpful. The dossier adds drift behavior on each side: Crossplane managed resources enforce `forProvider` with management policies and a pause annotation, while kro's dynamic controller resyncs instances every 10 hours through one shared rate-limited queue, and a drift bug in kro was closed in late 2025. It does not compare Composition functions with ResourceGraphDefinition graphs. See [[comparisons/drift-detection-mechanisms-across-tools]] and [[entities/kro]].
- **Possible resolution from [[sources/research-gitops-pull-based-delivery]]:** Only marginally helpful. The dossier shows that both Crossplane and kro sit beneath a GitOps agent and bring their own reconcile loops, that Crossplane needs custom health checks in Argo CD, and that kro validates CEL at creation time and composes with ACK and Config Connector. It does not compare Composition functions with ResourceGraphDefinition graphs. See [[findings/two-reconcile-loops-hide-status-and-drift-at-two-layers]] and [[examples/crossplane-resources-hosted-by-argo-cd]].
- **Possible resolution from [[sources/research-gvk-and-gvr]]:** Partly helpful on the API-definition side. The dossier shows that both tools are GVK factories: a Crossplane XRD declares group, kind, plural, versions, and scope and is named `<plural>.<group>` with immutable group and names, while a kro RGD `schema` declares apiVersion, kind, and an optional group (default `kro.run`), converts a SimpleSchema to OpenAPI v3, and generates the CRD. It does not compare Composition functions with RGD graphs or readiness. See [[examples/xrd-and-rgd-declare-platform-gvks]] and [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]].
- **Possible resolution from [[sources/research-custom-resource-definition]]:** Partly helpful for the API-definition step only. The dossier compares how an XRD (OpenAPI v3 schema, scope options, conversion webhooks for breaking changes, immutable group and names) and a kro ResourceGraphDefinition (simple schema, CEL-inferred dependencies, definition-time validation) each generate a CRD. It does not compare execution models. See [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]].
- **Possible resolution from [[sources/research-spec-status-split]]:** Partly helpful on the status side only. A Crossplane XR reports `Synced` and `Ready`, with `Ready` meaning the function pipeline reports all composed resources ready, while kro pulls status from composed resources through CEL. kro's status schema was not read because its documentation URL returned 404. See [[examples/crossplane-xr-spec-pins-composition-and-status-reports-synced-and-ready]] and [[entities/kro]].
- **Possible resolution from [[sources/research-server-side-apply-and-field-ownership]]:** Marginally helpful, and only for Crossplane. The dossier shows that Crossplane propagates claim to composite resource to composed resources with server-side apply, which depends on merge markers in provider CRDs, and that moving to composition functions needed a managed-fields migration. The kro documentation returned empty content, so nothing is known about how kro applies composed resources. See [[examples/crossplane-clears-managed-fields-when-migrating-to-composition-functions]].
- **Possible resolution from [[sources/research-operator-pattern]]:** Marginally helpful. The dossier frames both tools as replacements for a hand-written operator when a custom API is mostly composition: Crossplane through a function pipeline in a Composition, kro through CEL expressions that infer a dependency graph and generate a CRD and controller at runtime. It does not compare their execution models in depth, and the Crossplane composition concept page returned 404. See [[comparisons/hand-written-operator-versus-crossplane-composition-versus-kro]].
- **Possible resolution from [[sources/research-reconciliation-loop]]:** Marginally helpful. The dossier describes the Crossplane managed resource loop (Observe, Create, Update, Delete, `Synced` and `Ready`, create tracking) and kro's single shared rate-limited queue with its retry and resync defaults from unreleased documentation. It does not compare Composition functions with ResourceGraphDefinition graphs. See [[entities/crossplane]], [[entities/kro]], and [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]].
- **Possible resolution from [[sources/research-idempotency]]:** Marginally helpful, and only for Crossplane. The dossier covers Crossplane's managed resource idempotency (external names, `external-create-pending`, `managementPolicies`, `initProvider`) but could not read kro's instance and reconciliation pages, so kro's handling of repeated reconciliation and partial failure is unknown. See [[entities/crossplane]] and [[entities/kro]].
- **Possible resolution from [[sources/research-finalizers]]:** Partly helpful on the deletion side of the comparison only. The dossier shows that kro deletes composed resources in reverse dependency waves and that Crossplane has no equivalent ordering for namespace deletion (issue 7801), but it gives no resolution of which graph model suits which case. See [[examples/kro-deletes-instance-resources-in-reverse-dependency-waves]] and [[findings/a-credentials-secret-without-a-finalizer-can-vanish-before-managed-resources-finish-cleanup]].
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Partly helpful on the Crossplane side of deletion only. The dossier shows that composed resources are owned by their composite and that the composite deletion policy is Background, Foreground, or Pipeline, which gives Crossplane an explicit ordered-teardown knob. It could not read kro's instances page, so how kro owns and orders its children is still unknown. See [[examples/crossplane-foreground-and-pipeline-deletion-policies-order-composed-resource-teardown]] and [[decisions/choose-foreground-or-a-pipeline-policy-for-ordered-composite-teardown]].
- **Possible resolution from [[sources/research-conditions]]:** Partly helpful on the status side. Crossplane fixes the meaning of `Synced` and `Ready` in the framework, while kro lets the RGD author define `readyWhen` and custom instance conditions in CEL, which hides kro's built-in conditions. kro's instance-level built-in names were not read. See [[comparisons/provider-fixed-versus-author-defined-condition-semantics-crossplane-versus-kro]].
- **Possible resolution from [[sources/research-managed-resource]]:** Not helpful. The dossier covers the managed resource layer under compositions and says kro adoption and orphaning behavior was not read, so it cannot compare Compositions with kro.
- **Possible resolution from [[sources/research-composite-resource]]:** Largely helpful. The dossier reads the primary pages for both sides. Crossplane runs a pipeline of gRPC functions that receive observed state and return desired state, with CompositionRevisions that XRs can pin, while kro puts schema and implementation in one RGD, infers a DAG from CEL references, validates at creation, creates in topological order, deletes in reverse, gates dependents with `readyWhen`, and snapshots immutable GraphRevisions with no fallback. It also shows the two converging through `function-kro`. It gives no scale numbers and no incident evidence, and the v2 claim details and the kro Graph API remain unverified. See [[comparisons/crossplane-composition-functions-versus-kro-resource-graph-execution-models]], [[comparisons/composition-revisions-versus-graph-revisions-for-rolling-out-platform-api-changes]], and [[decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer]].
- **Possible resolution from [[sources/research-composition]]:** Partly helpful. The dossier traces Crossplane's three authoring models and kro's CEL-based RGD and states that no source compares them head to head, so the first-draft synthesis is in [[comparisons/where-the-expressiveness-bound-sits-in-crossplane-functions-and-kro-cel]]. kro's Readiness page and the Graph versus RGD readiness difference were not read.
- **Possible resolution from [[sources/research-provider]]:** Marginally helpful. A maintainer-authored Crossplane blog argues that Composition is what separates Crossplane from the cloud add-ons, and the Amazon EKS ACK guide points to kro for composing ACK resources. Neither is an independent head-to-head of Compositions and kro. See [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]] and [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Not helpful. The dossier says Flux comparisons with Crossplane and kro were not researched and that no source confirms Flux simply deploys their custom resources.
- **Possible resolution from [[sources/research-crossplane-deep-dive]]:** Marginally helpful, and only for Crossplane. The dossier restates that a Composition is a pipeline of gRPC functions applied with server-side apply, that functions must carry desired state forward, and that v2 compositions can hold any Kubernetes resource. It names no kro material and says primary comparisons against kro were not read. See [[concepts/composition]] and [[findings/oversized-compositions-and-cloud-shaped-apis-make-platform-apis-hard-to-use]].
- **Possible resolution from [[sources/research-kro-and-abstraction-models]]:** Largely helpful. The dossier compares the two on packaging (OCI Configuration packages versus Git, Helm, or Kustomize), logic (a function pipeline versus bounded CEL), children (managed resources versus Kubernetes objects only), maturity (versioned XRDs versus `v1alpha1`), and deletion (kro uses ApplySets and reverse-topological order and Go-template Compositions need hand-written guards). It also reports a tutorial that built one API both ways with equivalent outcomes. It gives no scale numbers or production incident, and the sources are blogs and a tutorial. See [[comparisons/crossplane-versus-kro-packaging-distribution-and-governance-according-to-an-engineers-blog]], [[examples/build-the-same-storageapp-api-with-kro-and-with-a-crossplane-go-templating-composition]], and [[findings/go-template-compositions-need-hand-written-ordering-and-deletion-guards]].
- **Possible resolution from [[sources/research-landscape]]:** Marginally helpful. The dossier describes Crossplane's side only, with providers, function pipelines in YAML, Python, Go, or KCL, XRDs, and Operations, and it did not cover kro. See [[entities/crossplane]] and [[concepts/tooling-landscape]].

## Scale: informers, rate-limited workqueues, and sharding — status: closed (2026-11-26)

- **Question:** How do informers, rate-limiting workqueues, and controller sharding prevent API server bottlenecks, and what scaling limits do Flux and Crossplane hit in practice?
- **Why it matters:** Platform tools that manage thousands of resources can overload the API server or their own controllers; scale behavior determines whether an architecture is viable.
- **Owner:** unassigned
- **How to close:**
  - [ ] Find controller-runtime and client-go documentation on caches and workqueues.
  - [ ] Find Flux and Crossplane sharding, concurrency, and provider-scaling guidance and case studies.
  - [ ] Write a `findings/` page on scaling limits and mitigations.
- **Drafted by:** agent on 2026-11-25
- **Tags:** scale, informers, workqueue, sharding
- **Resolution:** Settled on mechanics and mitigations, not on measured limits. Part 5 sections 7 to 9 ([[outputs/part-5-platform-architecture-principles-and-operating-at-scale]]) explain the four in-controller limits (the informer cache holds every watched object with no eviction; the workqueue never processes one key concurrently so throughput follows worker count and reconcile time; client-side QPS and burst throttle before requests leave the process; leader election means extra replicas add failover, not capacity), the default workqueue limiter (per-item exponential backoff plus a token bucket), the separation of client-side throttling from server-side API Priority and Fairness, and 410 Gone relist storms, with the etcd and CRD-count limits underneath ([[findings/etcd-scale-limits-of-the-shared-store]], [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]], [[findings/client-side-throttling-and-server-side-apf-are-separate-layers]]). Mitigations are documented per tool: Flux concurrency tuning and label sharding ([[examples/flux-sharding-splits-reconciliation-across-label-selected-controller-instances]], [[decisions/shard-flux-controllers-or-tune-intervals-and-concurrency-first]]), Argo CD cluster sharding ([[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]]), Crossplane provider families and activation policies, and kro's shared rate-limited queue. Not settled: most figures were read through model-generated digests and need rechecking ([[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]], [[#scale-numbers-from-model-digests-need-rechecking]]); there are no independent benchmarks ([[#independent-scale-benchmarks-for-etcd-vcluster-and-kcp]]), no production Flux sharding numbers ([[#named-flux-sharding-adopters-and-api-priority-and-fairness-incidents]]), and Crossplane v2 scaling guidance is unconfirmed ([[#current-crossplane-v2-scaling-guidance]]).
- **Closed by:** Eric Shamay on 2026-11-26

- **Possible resolution from [[sources/research-universal-control-plane]]:** The dossier covers the etcd and API server side of scale (single write leader, 8 GB cap, list and watch amplification, Kine, separate Events etcd, per-tenant control planes), not informer, workqueue, or sharding behavior of Flux and Crossplane. See [[findings/etcd-scale-limits-of-the-shared-store]].
- **Possible resolution from [[sources/research-declarative-vs-imperative]]:** Only marginally helpful. The dossier explains that controllers re-list and reconcile full state and that Kubebuilder controllers use the status subresource and owner references, but it has no sharding, concurrency, or rate-limit data. See [[entities/kubebuilder]].
- **Possible resolution from [[sources/research-level-triggered-vs-edge-triggered]]:** Partly helpful. The dossier explains why events are hints that enqueue keys, how cache lag causes double action, how errors requeue with exponential backoff, and how intervals and jitter limit API load. It has no sharding or concurrency data and does not explain informer resync semantics. See [[findings/stale-cache-and-double-action]], [[findings/cost-of-constant-reconciliation]], and [[concepts/informers-reflectors-and-workqueues]].
- **Possible resolution from [[sources/research-eventual-consistency-and-convergence]]:** Partly helpful. The dossier gives kro's workqueue and client rate limits (default one worker, token bucket 10 per second with burst 100, QPS 100 with burst 150), explains Kubernetes v1.36 staleness metrics, and describes leader election for multi-replica controllers. It has no Flux or Crossplane sharding data. See [[examples/kro-shared-queue-tunes-throughput]], [[findings/duplicate-work-from-replicas-without-leader-election]], and [[concepts/informers-reflectors-and-workqueues]].
- **Possible resolution from [[sources/research-self-healing-and-drift-detection]]:** Partly helpful on cost. The dossier explains that external-API controllers use long resyncs to limit API cost (ACK about 10 hours with per-kind overrides, kro 10 hours with a single rate-limited queue and one worker by default) and that Argo CD's refresh reads only the Kubernetes API and Git. It has no Flux or Crossplane sharding data. See [[decisions/choosing-a-drift-check-interval-for-external-resources]] and [[findings/cost-of-constant-reconciliation]].
- **Possible resolution from [[sources/research-gitops-pull-based-delivery]]:** Marginally helpful. The only scale datum is Crossplane's guidance to raise the Argo CD Kubernetes client QPS to 300 because of the many CRDs. It has no sharding or concurrency data for Flux or Crossplane controllers. See [[examples/crossplane-resources-hosted-by-argo-cd]].
- **Possible resolution from [[sources/research-gvk-and-gvr]]:** Marginally helpful. The dossier shows that aggregated discovery (stable in v1.30) collapses per-group-version discovery requests into one, which lowers client startup cost, and that mappers rebuild on lookup failure behind a rate limit. It does not cover informer caches keyed by GVR, workqueues, or sharding. See [[concepts/api-discovery-and-restmapper]] and [[comparisons/restmapper-strategies-static-deferred-and-dynamic]].
- **Possible resolution from [[sources/research-custom-resource-definition]]:** Partly helpful on the apiserver side. Custom resources share etcd and watch-cache paths with built-in objects, and Ant Group's 10,000-plus node write-up cut apiserver memory from roughly 400 GB to 100 GB by serving lists from the watch cache, with label indexing and etcd splitting. It has no controller sharding or workqueue data and no CRD-specific numbers. See [[examples/ant-group-large-cluster-tuning-of-apiserver-watch-cache-and-etcd]].
- **Possible resolution from [[sources/research-spec-status-split]]:** Marginally helpful. Writing status through the main resource bumps generation and triggers extra reconciles, which is avoidable load on the controller and API server. The dossier gives no scale numbers. See [[findings/status-writes-through-the-main-resource-retrigger-reconcile-loops]].
- **Possible resolution from [[sources/research-server-side-apply-and-field-ownership]]:** Marginally helpful. The dossier notes that GET-modify-PUT incurs an optimistic-concurrency retry cost when many actors update one object, which server-side apply avoids. It gives no sharding or workqueue data. See [[comparisons/client-side-apply-versus-server-side-apply]].
- **Possible resolution from [[sources/research-admission-webhooks-and-cel]]:** Marginally helpful. Every matching write blocks on webhook calls (default timeout 10 seconds), so a slow webhook adds latency to the whole write path, and in-process CEL has a comparatively small latency impact according to KEP-3488. The dossier gives no measurements. See [[findings/fail-closed-webhooks-can-block-the-writes-needed-to-repair-them]].
- **Possible resolution from [[sources/research-operator-pattern]]:** Marginally helpful. The dossier restates the controller guidelines (shared informers, rate-limited workqueues processing one key at a time, waiting for cache sync) and warns that blocking on errors inside the loop stalls other objects, but it has no sharding, concurrency, or scale numbers. See [[findings/blocking-on-errors-inside-the-sync-loop-stalls-every-other-object]] and [[findings/mutating-objects-from-a-shared-cache-or-reading-an-unsynced-cache-corrupts-reconcile-input]].
- **Possible resolution from [[sources/research-reconciliation-loop]]:** Partly helpful. The dossier gives kro's shared queue, default of 1 worker, token bucket of 10 events per second, 20-retry cap, and client QPS 100 with burst 150, and notes Flux jitter and Argo CD jitter, plus the controller-runtime rate-limited workqueue. It has no sharding data and no Crossplane concurrency data. See [[comparisons/load-and-fairness-controls-across-controller-runtime-flux-argo-cd-and-kro]].
- **Possible resolution from [[sources/research-idempotency]]:** Marginally helpful. The dossier notes that Flux jitter and `retryInterval` and Argo CD's `maxDuration` limit retry load, and that many objects sharing one interval can spike API load. It has no informer, sharding, or concurrency data. See [[findings/blind-retries-duplicate-side-effects-when-the-cloud-api-is-not-idempotent]].
- **Possible resolution from [[sources/research-informers-reflectors-and-workqueues]]:** Partly helpful. The dossier explains the reflector, DeltaFIFO, indexer, and workqueue pipeline, the default limiter, cache memory growth, and relist behavior, and gives tool knobs: Flux `--concurrent` and Helm cache flags, Argo CD cluster sharding with processor counts and `GOMEMLIMIT`, and Crossplane `--max-reconcile-rate`. It has no Flux sharding data and no Crossplane performance guide. See [[comparisons/concurrency-and-cache-memory-controls-across-flux-argo-cd-and-crossplane]] and [[findings/informer-caches-hold-every-watched-object-and-memory-grows-with-cluster-size]].
- **Possible resolution from [[sources/research-finalizers]]:** Not helpful. The dossier names no adopter beyond the projects themselves, and it cannot supply scale data.
- **Possible resolution from [[sources/research-owner-references-and-garbage-collection]]:** Marginally helpful. The dossier describes how the garbage collector keeps a graph built from watch events on all resources, with queues and an absent-owner cache, but it gives no scale numbers or sharding data. See [[examples/the-garbage-collector-builds-a-dependency-graph-from-watch-events-and-sorts-references-into-three-classes]].
- **Possible resolution from [[sources/research-conditions]]:** Marginally helpful. The dossier notes that bumping `lastTransitionTime` on every reconcile adds API traffic, but it gives no scale numbers or sharding data. See [[findings/updating-lasttransitiontime-on-every-reconcile-turns-a-condition-into-a-heartbeat]].
- **Possible resolution from [[sources/research-managed-resource]]:** Partly helpful on the CRD side. The dossier gives numbers for the cost of one CRD per external resource type (roughly 2,000 CRDs for three clouds, more than 4 MiB of API server memory per CRD, about 300 group-versions to discover, GKE control planes unresponsive at about 680 CRDs) and the Crossplane v2 remedy of activation policies, plus Argo CD's client QPS of 300. It has no informer, workqueue, or sharding data for Flux or Crossplane controllers. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]] and [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]].
- **Possible resolution from [[sources/research-composite-resource]]:** Not helpful. The dossier says no page gives numbers for how many composites or children a single controller handles, and kro's tuning pages were not read. A new gap, [[#scale-of-composite-resources-per-controller]], tracks this.
- **Possible resolution from [[sources/research-composition]]:** Marginally helpful. The dossier gives function-call arithmetic for Crossplane (60-second poll, so 100 XRs with one function step make 100 calls per minute) and the Argo CD client QPS advice (50 by default, 300 suggested for many CRDs), but no informer or sharding detail. See [[findings/function-calls-scale-with-composite-count-and-large-composites-can-exhaust-function-memory]].
- **Possible resolution from [[sources/research-provider]]:** Partly helpful for the API-server side of scale. The Crossplane blog reports that provider-aws installing more than 900 CRDs made the API server unresponsive for up to an hour during scale-up, and that provider families fix it by installing only the services in use. ACK avoids the problem with one controller per service. The dossier does not cover informer cache cost, workqueue rate limiting, or controller sharding. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]] and [[comparisons/provider-families-versus-per-service-controllers]].
- **Possible resolution from [[sources/research-flux-deep-dive]]:** Largely helpful for Flux. The dossier explains that extra replicas are failover standbys because of leader election, that label-based sharding with `sharding.fluxcd.io/key` and `--watch-label-selector` adds capacity, that the Flux Operator automates shard setup, and that Morgan Stanley raised intervals and `--concurrent` at more than 500 clusters. It has no production sharding numbers and no Crossplane data. See [[comparisons/flux-scaling-options-intervals-concurrency-sharding-and-source-choice]] and [[findings/extra-replicas-of-a-flux-controller-add-failover-not-capacity]].
- **Possible resolution from [[sources/research-crossplane-deep-dive]]:** Marginally helpful on the API-server side only. The Upbound post explains why thousands of CRDs hurt (hundreds of throttled discovery requests, increasingly expensive serialization on each CRD change, about 4 MiB of memory per CRD) and lists upstream mitigations, and the upgrade guide names managed resource activation policies as the Crossplane v2 remedy without explaining them. It has no informer, workqueue, or controller sharding data. See [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]] and [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]].
- **Possible resolution from [[sources/research-kro-and-abstraction-models]]:** Not helpful. The dossier says the scaling limits of per-RGD dedicated controllers are not covered in the sources read and found no large-scale kro benchmark. See [[open-knowledge-gaps]] for the follow-up on kro scale.
- **Possible resolution from [[sources/research-landscape]]:** Marginally helpful. The self-reported Crossplane adopters list gives SAP at 100 or more control planes and Akamai's provider-ceph at up to 200,000 managed resources, and Akuity claims Argo CD has a heavier footprint than Flux. All are unverified or vendor claims, so no tuning guidance follows. See [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]].
- **Possible resolution from [[sources/research-scale-and-sharding]]:** Largely helpful. The dossier gives the cluster envelope, client-go informer, workqueue, and rate-limiter limits, API Priority and Fairness, Flux label sharding with `sharding.fluxcd.io/key`, Argo CD cluster sharding, and Crossplane provider families with CRD counts, and it states that leader election makes extra replicas add availability and not throughput. It does not cover cloud API rate limits, kro, ACK, Cluster API, or Config Connector scale, or named adopters, and most numbers came from digests. See [[concepts/scale-and-sharding]], [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]], and [[decisions/split-a-large-provider-into-families-or-filter-or-lazy-load-its-crds]]. The gap stays open for human closure via `sticki-gaps`.

## Claim support and scope in Crossplane v2 XRDs — status: closed (2026-11-26)

- **Question:** What do the primary Crossplane v2 XRD and composite resource pages say about claims, the `LegacyCluster` scope, and how v1 claim-based XRDs coexist with namespaced XRs?
- **Why it matters:** The composite resources dossier read v1.20 pages for claims and XRDs and relied on a third-party blog for the `LegacyCluster` detail, so [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]] has an unverified v2 column.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Crossplane XRD and composite resource documentation.
  - [ ] Update [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]] and [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, claims, v2, verification
- **Resolution:** Settled: v2 XRDs have scope Namespaced or Cluster and reject claims; LegacyCluster exists only on the v1 XRD API and keeps claims ([[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]], [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]]). Not settled: no removal date for claims was found.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Largely settled, and the user can close it. Claims survive only for legacy XRDs. The v2 XRD API has `scope` of `Namespaced` (default) or `Cluster` and rejects `claimNames` with a CEL rule, and `LegacyCluster` is a scope of the v1 XRD API only, which still serves claims and is deprecated but still the storage version in the v2.5 manifest. The v2.5.0 release notes say claims remain supported, and no removal date exists. This replaces the third-party-blog basis for `LegacyCluster` and corrects the comparison page. See [[comparisons/crossplane-v1-claims-versus-v2-namespaced-composite-resources]] and [[findings/the-crossplane-xrd-docs-list-legacycluster-beside-v2-scopes-although-it-exists-only-on-the-v1-xrd-api]].

## Crossplane v2 claims and the concepts pages — status: closed (2026-11-26)

- **Question:** What do the Crossplane concepts pages say about claims and composition-function status in v2?
- **Why it matters:** The XRD page read in the dossier did not describe claims status, and the main Composition concept page returned empty content, so the legacy claim path is unverified.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read https://docs.crossplane.io/latest/concepts/compositions/ and the claims documentation.
  - [ ] Update [[concepts/composite-resource]] with the confirmed claim behavior.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, v2, claims, composition
- **Resolution:** Settled: the v2.5 docs have no claims page and the concepts section became composition and managed-resources, so older claims and patch-and-transform tutorials no longer match current Crossplane ([[findings/older-claims-and-patch-and-transform-material-no-longer-matches-current-crossplane]]). Not settled: whether the old concepts URLs redirect was not checked.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Largely settled, and the user can close it. The concepts section was reorganized into `composition/` and `managed-resources/`, the v2.5 docs have no claims page (v1.20 had one), and the Compositions page does not mention claims. Claims appear only in the XRD page, What's New, and the upgrade guide, as a backward-compatibility note. [[concepts/composite-resource]] now says so. Not settled: whether the old `/latest/concepts/compositions/` URL redirects, which was not checked.

## Crossplane v2 condition behavior and the fix for async Synced signaling — status: closed (2026-11-26)

- **Question:** Do Crossplane v2 and current upjet and crossplane-runtime releases still overwrite a pending state with `ReconcileSuccess` during long async operations, and is `AsyncOperation` now part of the recommended alert surface?
- **Why it matters:** The dossier read the v1.20 managed resources page and the issue thread only, so the fix status of provider-aws issue 2287 is unknown. See [[findings/a-summary-condition-can-stay-true-while-a-long-async-operation-is-running]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read current Crossplane v2 managed resource documentation and the upjet and crossplane-runtime changes linked to the issue.
  - [ ] Update [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, conditions, upjet, verification
- **Resolution:** Settled: there is no fix. provider-aws issue 2287 was closed as stale and the source on main still reports ReconcileSuccess while an async operation runs ([[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]]). Not settled: the body of open PR 8080 was not read, so a fix in flight is unconfirmed.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Answered, with a negative result. There is no fix. Provider-aws issue 2287 was closed by the stale bot on 2026-06-25 with no linked change, and upjet and crossplane-runtime source on `main` still returns up-to-date from Observe during an async operation and marks `ReconcileSuccess`. `AsyncOperation` is documented as provider detail, not as an alerting recommendation, and the docs and code disagree on its status value. v2.0.0 made XR and claim conditions persist `observedGeneration`. Not settled: the body of open PR 8080 ("stop stale XR condition replay") was not read. See [[findings/upjet-and-crossplane-runtime-source-still-reports-reconcilesuccess-while-an-async-operation-runs]].

## Current Crossplane v2 status of deletionPolicy and managementPolicies — status: closed (2026-11-26)

- **Question:** In the current Crossplane release (the dossier names v2.5), are `deletionPolicy` and `managementPolicies` still both supported, and how did issue 5283 end?
- **Why it matters:** The dossier read the v1.20 page, and issue 5283 was still open when read, so the deletion-safety guidance may be out of date.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current managed resources page and the final state of https://github.com/crossplane/crossplane/issues/5283.
  - [ ] Update [[entities/crossplane]] and [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, deletion-policy, management-policies, verification
- **Resolution:** Settled: deletionPolicy is removed from namespaced managed resources in v2.0.0 and survives on legacy managed resources, where issue 5283 to deprecate it is still open, so there is no formal deprecation ([[comparisons/deletion-policies-across-gitops-and-provider-tools]]). Not settled: whether issue 5283 will lead to formal deprecation.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Largely settled, and the user can close it. Both still exist on different kinds: namespaced managed resources (v2.0.0) have no `deletionPolicy`, legacy cluster-scoped ones keep it, and a deprecated runtime resolver combines the two fields. `managementPolicies` is still beta in the v2.5 docs. Issue 5283 is still open (opened 2024-01-25, last activity 2024-08-14), and `deletionPolicy` was never formally deprecated. See [[examples/crossplane-issue-5283-has-left-deletionpolicy-deprecation-open-since-2024]] and [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].

## managementPolicies feature status and the ObserveOnly-to-policy-list mapping — status: closed (2026-11-26)

- **Question:** Is `managementPolicies` still beta in Crossplane v2.x, and how do the older `ObserveOnly` and `deletionPolicy` terms map onto the policy list?
- **Why it matters:** The import guide calls management policies beta while the managed resources page presents them as standard, and no page the dossier read spells out the mapping, so [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]] rests on inference.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane feature-lifecycle page (https://docs.crossplane.io/latest/learn/feature-lifecycle/).
  - [ ] Find a page or release note that maps the old enum to the list.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, management-policies, verification
- **Resolution:** Settled: managementPolicies is beta in v2.5; the mapping from older advice is an Observe list for observe-only, an empty list that pauses reconciliation, and Orphan meaning no Delete ([[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]], [[decisions/choose-management-policies-for-an-imported-resource]]). Not settled: the mapping is assembled from three sources because no single official table exists.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Largely settled, and the user can close it. `managementPolicies` is beta in the v2.5 managed resources page and import guide (on by default, removal needs two releases of deprecation per the feature-lifecycle page). The mapping is `ObserveOnly` to `["Observe"]`, pause to an empty list, `deletionPolicy: Orphan` to a list without `Delete`, and default `["*"]`. No single official page tabulates it, so it is assembled from release notes, docs, and runtime code. See [[findings/older-observeonly-and-deletionpolicy-advice-needs-translation-to-managementpolicies]].

## Crossplane Operations maturity and API stability — status: closed (2026-11-26)

- **Question:** What are Crossplane Operations for day-two tasks, which API version and stability level do they have, and how do they differ from composition functions?
- **Why it matters:** Only a CNCF community blog describes Operations as scheduled day-two work, and that blog is forward-looking advocacy. See [[sources/research-crossplane-deep-dive]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the official Crossplane documentation on Operations and its release notes.
  - [ ] Add a concept page or update [[entities/crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, operations, v2, verification
- **Resolution:** Settled: Operations are alpha with v1alpha1 CRDs behind --enable-operations, and cannot delete resources or set owner references ([[findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references]]). Not settled: no beta graduation plan or tracking issue was found.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Largely settled, and the user can close it. Operations are alpha in v2.5 (`state: alpha`, `--enable-operations`, only `ops.crossplane.io/v1alpha1` CRDs), arrived in v2.0.0, and differ from composition functions by running once to completion, force-applying without owner references, and being unable to delete resources. Not settled: no beta graduation plan or tracking issue was found. See [[findings/crossplane-operations-are-alpha-and-cannot-delete-resources-or-set-owner-references]].

## Managed resource activation policy mechanism and defaults — status: closed (2026-11-26)

- **Question:** How do managed resource activation policies decide which CRDs a provider installs, and what are their defaults and failure modes?
- **Why it matters:** The upgrade guide and the Upbound scaling post connect activation policies to the CRD scale problem, but neither explains the mechanism. See [[examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs]] and [[findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Crossplane documentation page on activation policies.
  - [ ] Add measurements of CRD counts and API server memory with and without policies.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crossplane, crd-scale, activation-policies, verification
- **Resolution:** Settled: the ManagedResourceDefinition, ManagedResourceActivationPolicy and safe-start mechanism, and that the default Helm install activates every managed resource so the default must be turned off to use policies ([[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]]). Not settled: no with-versus-without-policy API server measurement exists, and the docs say alpha where the code says beta.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Mechanism and defaults settled, measurements not. An MRAP matches MRD names with prefix-only wildcards, activates one way only, and the Helm chart creates a default MRAP with `"*"`, so a stock install activates everything. MRDs start Inactive only for providers with `safe-start`, and MRDs and MRAPs are alpha in the docs. Failure modes are documented. Not settled: no measurement of CRD counts or API server memory with versus without policies, only the docs' ~3 MiB per CRD estimate and project-reported runtime-side figures. See [[findings/the-default-crossplane-helm-install-activates-every-managed-resource-so-activation-policies-need-the-default-turned-off]].

## Deprecated API scanners and Crossplane v2 GVKs — status: closed (2026-11-26)

- **Question:** How do deprecation scanners such as pluto and kubent detect removed GVKs, and how do Crossplane v2 namespaced composite resources change the GVKs that XRDs and claims create compared with v1 claims?
- **Why it matters:** Both were seen only as search results or passing mentions in the dossier. See [[findings/removed-beta-gvks-break-pinned-manifests-and-clients]] and [[decisions/conversion-webhook-versus-new-xrd-for-breaking-changes]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read pluto and kubent documentation.
  - [ ] Read Crossplane v2 documentation on namespaced composite resources.
- **Drafted by:** agent on 2026-11-25
- **Tags:** deprecation, crossplane, gvk
- **Resolution:** Settled: Pluto (86 Kubernetes, 24 cert-manager and 2 Istio entries) and kubent ship no Crossplane rules, so deprecated Crossplane GVKs pass unflagged unless custom entries are added ([[findings/pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged]]). Not settled: the API-server warning-header behavior for the deprecated XRD v1 is inference, not observed.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-crossplane-v2]]:** Largely settled, and the user can close it. Pluto detects deprecated and removed versions from a bundled `versions.yaml` (86 `k8s`, 24 `cert-manager`, 2 `istio` entries, none for Crossplane), and kubent evaluates Rego rule sets for 1.16 to 1.32. Both accept custom entries. Crossplane's own scanner is `crossplane beta upgrade check` and covers removed v1 features, not GVKs. The v2 GVK changes are listed: XRD v1 deprecated beside v2, namespaced managed resources under `.m.` groups beside legacy groups, and Usage moved to `protection.crossplane.io`. The warning-header behavior for a deprecated XRD is an inference. See [[findings/pluto-and-kubent-ship-no-crossplane-rules-so-deprecated-crossplane-gvks-pass-unflagged]].

## kro released-version tuning defaults and instance conditions — status: closed (2026-11-26)

- **Question:** Do the kro controller tuning defaults match the released versions, and what status conditions and per-instance reconcile semantics does kro expose?
- **Why it matters:** The numbers in [[examples/kro-shared-queue-tunes-throughput]] come from unreleased "next" docs, and the instances concept page returned empty content.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the released kro tuning and instances documentation.
  - [ ] Update [[entities/kro]] and [[comparisons/retry-and-backoff-controls-across-tools]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, verification, conditions
- **Resolution:** Settled: the v0.10.0 docs confirm the controller tuning defaults and four instance conditions; kro reserves the right to change sub-conditions so only Ready is a stable contract, and the docs disagree on whether a Failed instance state exists ([[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]], [[findings/the-kro-docs-disagree-on-whether-an-instance-state-of-failed-exists]]). Not settled: the v0.9.4 rate-limiter table was not fully read, and conditions come from docs, not Go source.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-composite-resource]]:** Marginally helpful. The dossier reads v0.10.0 pages and lists the RGD conditions, and says the kro controller tuning docs were not read. It adds a version discrepancy, since a September 2026 blog cites v0.9.x. See [[#kro-graph-api-status-and-released-version-facts]].
- **Possible resolution from [[sources/research-conditions]]:** Marginally helpful. The dossier read the v0.10.0 RGD reference and the custom status conditions page, but the Instances page returned empty content, so the built-in instance condition names are still inferred. See [[entities/kro]].
- **Possible resolution from [[sources/research-gap-g3-kro]]:** Largely settled, and the user can close it. The v0.10.0 controller tuning page (released 2026-11-10) confirms every default the wiki took from the unreleased docs: 1 worker, a 36000 s resync, 20 retries, backoff from 200 ms to 1000 s with a bucket of 10 per second and burst 100, and client QPS 100 with burst 150. It adds a 30 s `watchSyncTimeout`, a Graph controller concurrency of 1, `applyConcurrency` 20, a collection limit of 1000 items with 10 dimensions, and a CEL cost limit of 0, and the instance requeue interval is 3 s with exponential backoff capped at five minutes (a fixed delay at v0.9.4, which is an inference from two pages). The Instances page now documents the four built-in instance conditions (`InstanceManaged`, `GraphResolved`, `ResourcesReady`, `Ready`) and says only `Ready` is a stable contract. Not settled: the full v0.9.4 rate-limiter table, and the condition names against Go source. See [[examples/kro-shared-queue-tunes-throughput]], [[findings/kro-reserves-the-right-to-change-instance-sub-conditions-so-only-ready-is-a-stable-contract]], [[findings/the-kro-docs-disagree-on-whether-an-instance-state-of-failed-exists]], and [[entities/kro]].

## kro Graph API status and released-version facts — status: closed (2026-11-26)

- **Question:** What is the status of kro's alpha `Graph` API compared with the ResourceGraphDefinition, and which kro version is current, given that the docs show 0.10.0 and a third-party blog dated September 2026 says v0.9.x?
- **Why it matters:** The `readyWhen` gating behavior differs between the two APIs, so a tutorial could describe the wrong one. See [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the kro release notes and the Graph API documentation.
  - [ ] Update [[entities/kro]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, graph-api, versioning, verification
- **Resolution:** Settled: v0.10.0 (2026-11-10) is the latest release read, and the Graph API is alpha, off by default behind the GraphKind gate; enabling it needs a manual CRD apply because Helm does not update CRDs on upgrade ([[entities/kro]], [[findings/enabling-the-kro-graph-api-needs-a-manual-crd-apply-because-helm-does-not-update-crds-on-upgrade]]). Not settled: the promotion timeline belongs to the governance gap.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-kro]]:** Settled, and the user can close it. The current stable release is v0.10.0 (2026-11-10), preceded by v0.10.0-rc.0 (2026-09-22) and v0.9.4 (2026-09-04), so the September 2026 blog citing v0.9.x was accurate when written. The `Graph` API (`kro.run/v1alpha1`) is alpha, introduced in v0.10.0, off by default behind the `GraphKind` gate, and carries no compatibility guarantee. RGDs behave the same with the gate on or off, the RGD controller now runs on the graph engine and issues `GraphRevision` objects, and in a Graph `readyWhen` only feeds status. The kro.run default-version claim is SECONDARY-ONLY for the live page and was confirmed from the repository's site config. See [[findings/enabling-the-kro-graph-api-needs-a-manual-crd-apply-because-helm-does-not-update-crds-on-upgrade]], [[findings/a-kro-graph-has-no-revision-history-and-sets-no-owner-references-on-the-resources-it-creates]], and [[entities/kro]].

## kro dependency graph and readiness mechanics — status: closed (2026-11-26)

- **Question:** How does kro derive ordering and readiness from references in a ResourceGraphDefinition?
- **Why it matters:** The fetched kro page did not expose these details, which leaves the ordering comparison incomplete.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the RGD reference documentation.
  - [ ] Complete the kro row of [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** kro, ordering, cel
- **Resolution:** Settled at v0.10.0: ordering is inferred from CEL references into a topologically ordered graph, and readyWhen gates dependents in a ResourceGraphDefinition but only reports health in the alpha Graph API ([[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]], [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]]). Not settled: this is read from docs, not controller source.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-composite-resource]]:** Largely helpful. The RGD overview and readiness pages explain that kro infers dependencies from CEL references into a DAG, records the order in `status.topologicalOrder`, creates in topological order and deletes in reverse, creates independent resources in parallel, and rejects cycles at definition time. `readyWhen` defines per-resource readiness and gates dependents in an RGD, but only reports health in the alpha `Graph` API. The kro row of the ordering comparison can now be filled, though the instance-level conditions remain unread. See [[findings/kro-readywhen-gates-dependents-in-a-resource-graph-definition-but-only-reports-health-in-the-alpha-graph-api]] and [[entities/kro]].
- **Possible resolution from [[sources/research-finalizers]]:** Partly helpful on deletion behavior. The dossier reads the Argo CD ApplicationSet deletion page, the Flux Kustomization reference (first 100 KB), the ACK deletion policy guide, and the Config Connector deletion page, all through a summarizing fetch, and it confirms retain and abandon defaults. It does not verify Flux's finalizer name. See [[comparisons/finalizer-gated-teardown-across-argo-cd-flux-kro-and-cluster-api]].
- **Possible resolution from [[sources/research-composition]]:** Partly helpful. The Dependencies and Ordering page confirms that every CEL reference is a DAG edge (even with `?.`), creation is topological and deletion reversed, cycles fail validation, and kro waits for expressions to be resolvable. It says readiness gating differs between the RGD and the alpha Graph APIs but the Readiness page was not read. See [[entities/kro]].
- **Possible resolution from [[sources/research-kro-and-abstraction-models]]:** Marginally helpful. The dossier restates that kro infers the graph from CEL references, waits on status values that do not exist yet, validates before reconciling, and requires referenced `schema.spec` fields to have values. It adds no readiness detail beyond what [[sources/research-composite-resource]] gave.
- **Possible resolution from [[sources/research-gap-g3-kro]]:** Settled, and the user can close it. From the v0.10.0 docs: every CEL reference is a dependency edge, even with the optional operator, creation is topological and deletion reversed, cycles are rejected, and the order is in `status.topologicalOrder`. Resources that reference only `schema` are created in parallel. `readyWhen` may reference only the resource itself (or `each`), gates dependents in an RGD, and only feeds status in a Graph. `includeWhen` controls existence and skips dependents, and `forEach` builds a cartesian product capped at 1000 items by default. The kro row of [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]] is now filled. See [[findings/a-kro-includewhen-on-a-volatile-upstream-status-field-makes-resources-flip-flop]] and [[findings/a-kro-foreach-collection-above-the-1000-item-default-limit-gets-stuck-during-deletion]].

## Flux default reconcile interval and drift-detection wording — status: closed (2026-11-26)

- **Question:** What is the actual default Kustomization interval in Flux, and does the concepts page's five-minute figure conflict with the Kustomization API page's 60-second minimum?
- **Why it matters:** Drift-correction latency is a core operational property, and the two pages read as inconsistent.
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the Flux Kustomization reference directly and confirm that `interval` is user-set and what the minimum is.
  - [ ] Update [[entities/flux]] and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, drift, verification
- **Resolution:** Settled: the Flux Kustomization and HelmRelease references require the interval and set no controller default; 60 seconds is the recommended minimum and the CLI default is one minute, so the concepts page's five-minute wording is unsupported ([[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]], [[comparisons/reconcile-cadence-and-off-switches-across-tools]]). Not settled: the jitter value and the origin of the five-minute wording were not read.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-idempotency]]:** Only marginally helpful. The Kustomization reference quote ("every ten minutes, the Kustomization runs a server-side apply dry-run") uses ten minutes as an example interval, and the dossier does not state a default or the 60-second minimum. See [[entities/flux]].
- **Possible resolution from [[sources/research-gap-g3-reconcile-defaults]]:** Settled, and the user can close it. The concepts page's "every five minutes by default" matches no controller behavior. `.spec.interval` is required on the Kustomization and the HelmRelease, the CRD Go type has only a duration-format pattern with no default and no minimum, and the reference says "The minimum value should be 60 seconds", a recommendation and not an enforced floor. The only default found is the `flux create` global `--interval` flag at one minute. The ten-minute figure is an example of drift-check cadence, and a guide example uses `60m0s` for hourly drift correction. Drift is corrected on the interval, and source or spec changes are handled instantly outside it. Not settled: the origin of the five-minute wording and the controller jitter value. See [[findings/the-flux-concepts-page-says-five-minutes-by-default-but-the-kustomization-and-helmrelease-references-require-the-interval-and-set-no-default]], [[entities/flux]], and [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]].

## Argo CD default reconcile interval across versions — status: closed (2026-11-26)

- **Question:** What is the Argo CD default Git polling interval in each recent release, given that stable documentation says 120 seconds plus 60 seconds of jitter and older material says 3 minutes?
- **Why it matters:** Drift and change latency depend on the interval, and mixed numbers in the wiki can mislead. See [[comparisons/reconcile-cadence-and-off-switches-across-tools]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the `timeout.reconciliation` documentation for several releases.
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, intervals
- **Resolution:** Settled: Argo CD's default is 180 seconds through v2.14 and 120 seconds plus 60 seconds of jitter from v3.0, and some docs still say three minutes ([[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]], [[comparisons/flux-versus-argo-cd-drift-and-prune-defaults]]). Not settled: the reason for the change and the v2.1 to v2.4 values were not found.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-reconcile-defaults]]:** Settled for the versions sampled, and the user can close it. `timeout.reconciliation` is 180s from v2.5.0 through v2.14.0 (the jitter key appears from v2.10.0 with default 0) and 120s plus 60s of jitter from v3.0.0 through v3.6.0, in both the manifest and the controller constants. The v3.0.0 FAQ restates 3 minutes as a "default maximum polling interval", and the v3.2.0 high-availability page still says 3m. Not settled: why the default changed (the upgrade notes and pull request searches found nothing) and the values for v2.0.0 to v2.4.0, which were not sampled. See [[findings/argo-cd-changed-its-default-polling-from-a-flat-180-seconds-to-120-seconds-plus-60-seconds-of-jitter-in-v3-0-and-some-docs-still-say-three-minutes]] and [[entities/argo-cd]].

## Flux pre-dry-run manager takeover flag and current SSA documentation — status: closed (2026-11-26)

- **Question:** What are the shipped semantics of the kustomize-controller flag proposed in issue 1722 (`--override-manager-before-dry-run`), delivered through PR 1747, and how does current Flux documentation describe `--override-manager`?
- **Why it matters:** The dossier read only the issue thread, and the final flag name and semantics should be checked before anyone relies on them. See [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read kustomize-controller PR 1747 and the current Kustomization documentation.
  - [ ] Update [[entities/flux]] and [[findings/field-ownership-blocks-drift-correction]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** flux, server-side-apply, verification
- **Resolution:** Settled: the flag is --override-manager-before-dry-run, first shipped in kustomize-controller v1.10.0 and Flux v2.10.0; it transfers all fields of the named managers and is not reverted if the apply fails ([[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]], [[decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager]]). Not settled: helm-controller driftDetection and Helm 4 server-side apply were not researched in this pass.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-flux-ssa-helm]]:** Settled, and the user can close it. The shipped flag is `--override-manager-before-dry-run`, the name issue 1722 proposed, delivered by kustomize-controller PR 1747 (merged 2026-10-23) with fluxcd/pkg PR 1276. It first shipped in kustomize-controller v1.10.0 (2026-10-24) and is bundled in Flux v2.10.0 (2026-10-26). It is a separate opt-in list, and `--override-manager` still takes over the named managers only after a successful dry-run. The documentation says the pre-dry-run takeover transfers all fields of the named managers, prunes fields missing from the source, is not reverted if the apply fails, matches names exactly, and should be used only to recover stuck objects and then removed. The default managers stay on the post-dry-run path. The flags are documented on the controller options page and not on the Kustomization spec page. Not settled: the helm-controller `--override-manager` claim and the since-v1.5.0 version, which the dossier did not research. See [[entities/flux]], [[findings/a-stale-manager-owning-a-list-entry-key-breaks-the-dry-run-after-removal]], [[findings/the-flux-pre-dry-run-takeover-transfers-all-fields-of-the-named-managers-and-is-not-reverted-if-the-apply-fails]], [[decisions/keep-flux-pre-dry-run-takeover-in-a-separate-opt-in-list-instead-of-extending-override-manager]], and [[examples/flux-issue-1722-a-stale-legacy-manager-wedges-the-dry-run-until-the-v1-10-0-pre-dry-run-flag]].

## Argo CD sharding algorithm maturity in current releases — status: closed (2026-11-26)

- **Question:** Are the round-robin and consistent-hashing sharding algorithms still labelled experimental in current Argo CD releases?
- **Why it matters:** The dossier's digest called them experimental, and the label may be stale. See [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current high-availability page directly and record the version.
  - [ ] Revise the finding and [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** argo-cd, sharding, maturity
- **Resolution:** Settled: round-robin and consistent-hashing are still labelled experimental (Alpha) at v3.6.3, and legacy sharding can distribute clusters unevenly ([[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]]). Not settled: the v3.6.3 high-availability page no longer marks legacy as the default ([[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]]), so which method is the default is unconfirmed.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-argocd-capi]]:** Settled, and the user can close it. In the Argo CD v3.6.3 docs (released 2026-11-24), both `round-robin` and `consistent-hashing` are still "an experimental feature", and the feature-maturity page lists them as Alpha, introduced in v2.8.0 and v2.12.0. The warning text is the same at v2.14.0 and v3.0.0, so the wiki label is not stale and nothing read says either algorithm graduated. The `legacy` method is "uid based distribution (non-uniform)". Not settled: whether `legacy` is still the default, because the v3.6.3 page drops the "(default)" marker shown at v3.0.0, and the CNOE benchmark blog the docs cite (secondary only) was not read. See [[findings/argo-cd-legacy-sharding-can-be-uneven-and-the-other-algorithms-were-labelled-experimental]], [[findings/the-argo-cd-v3-6-3-high-availability-page-no-longer-marks-legacy-as-the-default-sharding-method]], and [[comparisons/flux-label-sharding-versus-argo-cd-cluster-sharding]].

## Mutating Admission Policy release status — status: closed (2026-11-26)

- **Question:** Is MutatingAdmissionPolicy stable and enabled by default as of Kubernetes v1.36, as one documentation digest reports, or is it still beta?
- **Why it matters:** The digest could not be cross-checked against release notes and earlier knowledge places the feature at beta, so a tutorial could state the wrong status. See [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Check the Kubernetes v1.36 release notes and the live Mutating Admission Policy page.
- **Drafted by:** agent on 2026-11-25
- **Tags:** mutating-admission-policy, verification
- **Resolution:** Settled: Mutating Admission Policy is GA and on by default since v1.36 per the CHANGELOG and feature-gate table ([[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]]). Not settled: the Kubernetes docs pages disagree with the code on the first-available version ([[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]]).
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-k8s-and-controller-runtime]]:** Settled, and the user can close it. MutatingAdmissionPolicy is GA (v1) and enabled by default since Kubernetes v1.36, so the "still beta" belief is out of date and the digest was right. Three primary readings agree: the live docs page ("Stable since Kubernetes v1.36; enabled by default"), CHANGELOG-1.36 (PR 136039), and the gate table at tag v1.36.0 (Alpha 1.32, Beta 1.34, GA 1.36, default true at GA). Not settled: the docs page also says the feature "was first available in the v1.30 release", which conflicts with the gate table, so cite the gate table for the earlier stages, and the dossier did not separately check that the `admissionregistration.k8s.io/v1` REST group is served by default beyond the gate default. See [[comparisons/admission-mechanisms-webhooks-vap-map-and-crd-rules]] and [[findings/kubernetes-docs-pages-disagree-with-the-code-on-mutating-admission-policy-and-storage-version-migration-stage]].

## StorageVersionMigration GA details in Kubernetes v1.37 — status: closed (2026-11-26)

- **Question:** What are the exact fields of the StorageVersionMigration API in v1.37, and does migration trigger automatically or only when a user creates the object?
- **Why it matters:** The GA claim rests on one truncated blog extract. See [[concepts/crd-versioning-and-storage-migration]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the KEP and v1.37 release notes.
- **Drafted by:** agent on 2026-11-25
- **Tags:** crd, versioning, storage-migration
- **Resolution:** Settled: storagemigration.k8s.io/v1 is GA in v1.37 and is user-triggered, so a retired CRD version needs a user-created migration object ([[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]], [[concepts/crd-versioning-and-storage-migration]]). Not settled: the exact progress-condition field layout was not read.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-k8s-and-controller-runtime]]:** Largely settled, and the user can close it. `storagemigration.k8s.io/v1` and the `StorageVersionMigrator` controller are GA and enabled by default in v1.37 (KEP 4192 stable v1.37, CHANGELOG-1.37 PR 138560, release and GA blogs, gate Beta default false at v1.36.0 and GA default true at v1.37.0). At v1.37.0 the type is cluster-scoped with an immutable `spec.resource` (a `GroupResource`), `status.conditions` with the types Running, Succeeded, and Failed, and `status.resourceVersion`. Migration is not triggered automatically: the user creates the object, and only the migrator moved in-tree, not the out-of-tree trigger controller. After a CRD migration, `.status.storedVersions` should hold only the preferred version, and the migration should be retried if not. Post-beta changes are progress reporting in conditions, merge patch in place of server-side apply, and a panic fix. Not settled: the exact field shape of the progress-reporting conditions. The kubernetes.io task page header still reads Beta and disabled while its body says enabled, so do not cite it for stage. See [[concepts/crd-versioning-and-storage-migration]], [[examples/a-user-created-storageversionmigration-object-rewrites-stored-objects-so-a-crd-can-retire-an-old-version]], and [[findings/storage-version-migration-is-not-triggered-automatically-so-a-retired-crd-version-needs-a-user-created-object]].

## Requeue true backoff behavior in current controller-runtime — status: closed (2026-11-26)

- **Question:** Does `Result{Requeue: true}` requeue with rate-limited backoff or immediately, in the current controller-runtime source?
- **Why it matters:** The package reference says rate-limited, while a summary of issue 808 says immediate without backoff, and the field is deprecated. A tutorial or review based on the wrong reading would teach a hot loop or a slow retry. See [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read `reconcile.go` and the controller's requeue handling in the current controller-runtime source.
  - [ ] Check whether the deprecation notice names a replacement.
- **Drafted by:** agent on 2026-11-25
- **Tags:** controller-runtime, requeue, backoff
- **Resolution:** Settled: at controller-runtime v0.25.3 returning Requeue true is a rate-limited requeue with per-item exponential backoff, and only RequeueAfter forgets the failure history ([[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]], [[decisions/choose-error-requeueafter-or-terminalerror-in-a-reconciler]]). Not settled: the origin of the older claim of an immediate requeue (issue 808) was not located.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-k8s-and-controller-runtime]]:** Settled, and the user can close it. At controller-runtime v0.25.3 (published 2026-11-16), `Result{Requeue: true}` with a nil error is a rate-limited requeue with per-item exponential backoff, so the package reference was right. The handler adds the request with `RateLimited: true` and does not reset the failure counter, while `RequeueAfter > 0` calls `Queue.Forget(req)` and then waits exactly that duration, and a non-nil error ignores both fields. The deprecation notice names the replacement: "Deprecated: Use `RequeueAfter` instead." With the default priority queue the limiter is per-item exponential (5 ms to 1000 s) with no overall bucket. Not settled: where the "immediate requeue" reading came from, because issue 808's body does not claim it and its comment thread was not read. See [[findings/a-requeue-true-result-backs-off-exponentially-because-only-requeueafter-forgets-the-failure-history]] and [[findings/the-requeue-true-result-is-deprecated-and-described-inconsistently]].

## Current Cluster API MachineHealthCheck behavior — status: closed (2026-11-26)

- **Question:** How does MachineHealthCheck behave in current Cluster API releases, including remediation templates, newer fields, and the semantics of `maxUnhealthy`?
- **Why it matters:** The dossier read the v0.4 book only. See [[examples/cluster-api-machine-health-check-replaces-failed-nodes]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Cluster API book.
  - [ ] Update [[entities/cluster-api]] and [[findings/remediation-can-amplify-an-outage]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, remediation, verification
- **Resolution:** Settled at Cluster API v1.15.0-rc.0: the v1beta2 names, a 100 percent default that leaves the short-circuit guard off so remediation is unbounded until a threshold is set, and an external remediation reference; v1beta1 maxUnhealthy and unhealthyRange are deprecated ([[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]], [[findings/cluster-api-v1beta1-maxunhealthy-and-unhealthyrange-are-deprecated-and-older-material-uses-the-old-names]]). Not settled: these were read from a release candidate and need a recheck at v1.15.0 final.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-argocd-capi]]:** Largely settled, and the user can close it. The v1beta2 API (v1.11.0, 2025-08-19) moves checks under `spec.checks` and replaces `maxUnhealthy` and `unhealthyRange` with `remediation.triggerIf.unhealthyLessThanOrEqualTo` and `unhealthyInRange` (which takes precedence, percentages round down). The default is 100 percent, so the short-circuit is off until set. External remediation uses `remediation.templateRef`, v1.15.0-rc.0 adds CEL `unhealthyExpressions` (OR-combined, at most 10), and KubeadmControlPlane remediation must preserve etcd quorum with its own `maxRetry`, `retryPeriodSeconds`, and `minHealthyPeriodSeconds` controls. Not settled: v1.15.0 final was not released on 2026-11-26, so the v1.15 items are pre-release, and no real-world remediation-storm incident was found. See [[examples/cluster-api-v1beta2-machine-health-check-short-circuits-remediation-and-hands-off-to-external-controllers]], [[findings/the-cluster-api-machine-health-check-short-circuit-is-off-by-default-so-remediation-is-unbounded-until-a-threshold-is-set]], and [[entities/cluster-api]].

## ClusterClass maturity and the managed topologies proposal — status: closed (2026-11-26)

- **Question:** What is the current maturity of Cluster API's ClusterClass and what does the CAEP "ClusterClass and Managed Topologies" specify?
- **Why it matters:** The dossier read only a short landing page that labels the feature alpha, which may be stale. See [[examples/cluster-api-clusterclass-expands-a-small-topology-into-many-machine-and-infrastructure-objects]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Read the current Cluster API book on ClusterClass and the CAEP.
  - [ ] Update [[entities/cluster-api]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** cluster-api, clusterclass, verification
- **Resolution:** Settled at Cluster API v1.15.0-rc.0: ClusterTopology is Beta and on by default, while maturity labels disagree across doc versions and the original proposal still says provisional ([[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]], [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]]). Not settled: only rc.0 existed, so the label needs a recheck at v1.15.0 final.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g3-argocd-capi]]:** Settled for the release candidate, and the user can close it. The `ClusterTopology` gate is Beta and enabled by default as of v1.15.0-rc.0 (2026-11-24), while the v1.14.4 docs still say alpha, so the wiki's alpha label reflects older docs. Beta is not GA, and v1.15.0 final was not released on 2026-11-26. The proposal describes ClusterClass as a collection of template references and the Cluster as a single control point with continuous reconciliation, and its frontmatter still says `provisional` despite later additions (MachineHealthChecks in 2022, upgrade plans in 2025). Recheck at the v1.15.0 release. See [[examples/cluster-api-v1-15-0-rc-0-promotes-clustertopology-to-beta-and-adds-cel-health-check-rules]] and [[findings/cluster-api-clusterclass-maturity-labels-disagree-across-doc-versions-and-the-original-proposal-still-says-provisional]].

## Scale numbers from model digests need rechecking — status: closed (2026-11-26)

- **Question:** Do the CRD memory, Gardener limit, Argo CD processor size, and SIG Scalability figures in the scale dossier match the raw pages?
- **Why it matters:** Most figures came from summarizing fetches, and the APF page and KEP-1040 were only partly read. See [[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]].
- **Owner:** unassigned
- **How to close:**
  - [ ] Reread each page in full and compare the figures.
  - [ ] Fully read the API Priority and Fairness page and KEP-1040.
- **Possible resolution from [[sources/research-gap-g3-scale-recheck]]:** Largely settled, and the user can close it, with one residual. The dossier reread the SIG Scalability thresholds, the Gardener guide, the Upbound post, the Argo CD high-availability page, the Crossplane design doc and provider-families blog, and the client-go and controller-runtime source from raw text and found every quoted figure correct. Three wordings were tightened: Upbound's figure is "a little over 4MiB" per CRD and not "several MiB", Argo CD sizes 50 status and 25 operation processors for 1,000 applications against defaults of 20 and 10, and the Crossplane memory figures are design-doc targets and not measurements. The APF page was read in full. The residual is KEP-1040: the README was fetched in full but only its Summary, Motivation, Goals, seat and shuffle-sharding sections and `kep.yaml` were read closely, so its fair-queuing math, test plan, and graduation criteria remain unread. Figures are tied to the dates read (2026-11-26) and, for Gardener, to an undated page. See [[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]], [[findings/the-sig-scalability-thresholds-cover-built-in-types-only-and-are-not-hard-limits]], and [[findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements]]. The gap stays open for human closure via `sticki-gaps`.
- **Drafted by:** agent on 2026-11-25
- **Tags:** source-quality, scale, verification
- **Resolution:** Settled: every quoted scale figure was rechecked against raw page text and matched, with three wording tightenings: about 4 MiB per CRD, the Argo CD processor defaults, and the Crossplane memory figures, which are design-doc targets, not measurements ([[findings/the-scale-dossier-relies-on-model-digests-for-most-numbers-so-limits-need-rechecking]], [[findings/crossplane-provider-memory-figures-are-design-doc-targets-not-measurements]]). Not settled: KEP-1040 was read only in part.
- **Closed by:** Eric Shamay on 2026-11-26

## Primary OpenAI Kubernetes outage postmortem — status: closed (2026-11-26)

- **Question:** What does the primary OpenAI postmortem say about the telemetry service, API server load, and DNS dependency, and does it involve list and watch clients?
- **Why it matters:** The dossier read only Ahmet Alp Balkan's commentary, so the quotations and the causal chain are second-hand, and [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]] rests on them.
- **Owner:** unassigned
- **How to close:**
  - [ ] Locate and read the primary postmortem.
  - [ ] Update [[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, api-server, outage
- **Resolution:** Settled: OpenAI's primary 2024-12-11 status-page postmortem was read in full; it does not mention list or watch calls, so that detail from earlier commentary stays unsupported ([[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]], [[findings/dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load]]). Not settled: details beyond the postmortem's own wording are not established.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g1-outage-postmortems]]:** Settled, and the user can close it. The primary post-mortem on OpenAI's status page was read in full. A telemetry service deployed at 3:12 PM PST made every node in each cluster run API operations whose cost scaled with cluster size, which overwhelmed the API servers in large clusters. DNS relies on the control plane, cached records hid the failure for about 20 minutes, and expiring caches then multiplied the load. Impact ran from 3:16 PM to 7:38 PM PST on 2024-12-11, and the fix was blocked because engineers could not reach the control plane. The write-up does not say the calls were list or watch calls, so that part of the question is answered as not supported by the primary text. Figures are self-reported. See [[examples/an-openai-outage-shows-many-api-clients-can-overload-the-control-plane]], [[findings/control-plane-overload-blocks-the-remediation-that-would-fix-it]], and [[findings/dns-caching-hid-the-control-plane-failure-for-about-twenty-minutes-before-expiring-records-added-load]].

## Primary incident reports for Skyscanner, Reddit, Jetstack, and Spotify — status: closed (2026-11-26)

- **Question:** What do the primary reports say about the Skyscanner namespace-deletion outage, the Reddit Pi-Day outage, the Jetstack admission webhook outage, and the Spotify cluster deletion?
- **Why it matters:** The dossier saw these only as k8s.af summaries because the scraper returned empty pages, so the deletion-cascade and webhook claims are second-hand.
- **Owner:** unassigned
- **How to close:**
  - [ ] Fetch the linked reports from https://k8s.af/ with another tool.
  - [ ] Add `examples/` pages for each incident and update [[findings/admission-webhook-outages-are-a-recurring-failure-class]].
- **Drafted by:** agent on 2026-11-25
- **Tags:** postmortem, skyscanner, reddit, jetstack, spotify
- **Resolution:** Settled: all four primary reports are now read. Jetstack (2019 GKE master upgrade stalled on an unresponsive OPA validating webhook) was read earlier from a Wayback copy of the Venafi-hosted post. Skyscanner (2021 global outage: a template change dropped the {{ }} markers and Argo CD reconciled the result into deleting 478 services in every region, with service restored from a single region by about 2030 GMT) was read from a Wayback capture of the Medium post. Reddit (the 314-minute Pi-Day outage: a Kubernetes 1.24 upgrade removed the master node label that Calico route reflectors selected, and the lack of a supported downgrade forced a backup restore) was read from a Wayback capture of the r/RedditEng post. Spotify (a 50-node production cluster deleted from the wrong browser tab in November 2018, then two more clusters deleted through Terraform about a month later, with no end-user impact) was read from a user-supplied transcript and the speaker's slide deck. Pages: [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]], [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]], [[examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected]], [[examples/spotify-deleted-one-production-gke-cluster-by-console-click-and-two-more-through-terraform-with-no-end-user-impact]]. Not settled: the Spotify second incident is dated only as a month after November 2018; Reddit's year comes from the k8s.af index and the post's age, not the post text; and the Skyscanner post does not say which Argo CD sync settings were in use.
- **Closed by:** Eric Shamay on 2026-11-26
- **Possible resolution from [[sources/research-gap-g1-named-incident-reports]]:** Partly settled, and it stays open. Jetstack is answered from the primary post, read through a Wayback capture of the original URL: the mechanism, recovery, scoping fixes, the rejected option of disabling node auto-repair, and the absence of any `failurePolicy` recommendation are all verified (see [[examples/jetstack-s-2019-gke-master-upgrade-stalled-on-an-unresponsive-opa-validating-webhook]]). Reddit is not answered from its primary; only a secondary Kubezilla retelling was read, and it is attributed and not trusted for its timeline (see [[examples/reddit-s-march-2023-pi-day-outage-is-known-only-from-the-k8s-af-index-and-a-secondary-retelling]]). Skyscanner and Spotify are not answered at all, because the Medium, YouTube, and sched pages returned nothing and some fetch routes were blocked. Reading those three needs a permission change or another access path chosen by the user.
- **Possible resolution from [[sources/skyscanner-namespace-deletion-postmortem]]:** The Skyscanner primary post was read in full on 2026-11-26 from a Wayback Machine capture, so Skyscanner is now answered (date, trigger, mechanism, recovery, lessons) in [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]]. Jetstack was answered earlier; Reddit and Spotify remain to be read.
- **Possible resolution from [[sources/reddit-pi-day-outage-postmortem]]:** The Reddit primary post was read in full on 2026-11-26 from a Wayback Machine capture. Reddit is now answered (trigger, mechanism, recovery, lessons) in [[examples/reddit-s-march-2023-pi-day-outage-a-kubernetes-1-24-upgrade-removed-the-master-node-label-that-calico-route-reflectors-selected]], and the secondary retelling's main mechanism and 314-minute figure are confirmed while its reconstructed timeline and user count are not. Spotify remains to be ingested.
- **Possible resolution from [[sources/spotify-kubecon-2019-gke-cluster-deletion-transcript]]:** The Spotify primary was read in full on 2026-11-26 from a user-supplied transcript (and slide deck, see [[sources/spotify-kubecon-2019-keynote-slides-with-notes]]). Spotify is now answered (two incidents, mechanism, guardrails, why users saw no impact) in [[examples/spotify-deleted-one-production-gke-cluster-by-console-click-and-two-more-through-terraform-with-no-end-user-impact]]. With Skyscanner, Reddit and Jetstack, all four primary reports are now read. Remaining sub-question: exact date of the second incident, which the talk gives only as about a month after November 2018.
