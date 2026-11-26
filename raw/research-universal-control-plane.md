# Research dossier: Universal Control Plane

Research date: 2026-11-25

Method note: pages were read through WebFetch (fetch plus a small summarizing model) because web_scrape returned oversized pages for several large docs. Four long pages were read only through character 100000 (controllers, custom resources, operator, API conventions, Flux Kustomization; the unread tails are small or reference material). Quotes are as returned by the fetch tool and should be re-checked against the live page before publication.

## Overview

The "universal control plane" idea separates two things that ship together in Kubernetes. One is the container scheduler. The other is a generic, extensible API machine: an API server with authentication, RBAC, admission, validation, and watch semantics, backed by etcd, plus a convention for controllers that reconcile `spec` (desired state) toward `status` (observed state). The second part has no inherent tie to Pods. Anything that can be described declaratively and reconciled by a loop can be modelled as a custom resource, whether that is a cloud database, a whole Kubernetes cluster, a firewall rule, or an application bundle.

The sources frame this at several layers. The Kubernetes docs define the primitives: controllers as control loops, CRDs stored in etcd by the API server, and the operator pattern as the way to encode domain knowledge. The API conventions document supplies the contract that makes every resource look alike (spec/status, conditions, resourceVersion, finalizers), which is why generic tooling such as GitOps engines, policy engines and UIs work across all resource kinds. Level-triggered semantics, meaning the system drives toward the latest spec and not toward a stream of events, is what makes the loop robust to missed events and restarts.

On top of the primitives sit platform layers. Provider controllers (AWS ACK, Google Config Connector, Azure Service Operator, Cluster API providers) project external APIs into Kubernetes. Composition layers (Crossplane, kro) let a platform team publish a small, opinionated API that expands into many underlying resources. Delivery layers (Flux, Argo CD) keep the API server's contents in sync with Git. At the far end, kcp and Ænix's "Kubernetes as the Linux kernel" argue that the API server can be separated from container orchestration entirely, either as a horizontally scalable multi-tenant API host (kcp) or as a base for purpose-built distributions that are not container platforms.

The recurring cautions are about scale and blast radius. etcd has a single write leader, a small default database size cap, and request-size limits, and the API server amplifies list and watch load. Each added CRD and controller adds load and failure surface. Deletion semantics are dangerous when a Kubernetes object maps to a real cloud resource, so every tool provides a retain/abandon or adoption mechanism. Ordering (CRDs before custom resources, dependencies before dependents) is handled differently by each stack.

## Sources

### 1. Controllers (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/architecture/controller/
- Title: Controllers
- Publisher: Kubernetes project (kubernetes.io)
- Kind: Official documentation
- Summary: Defines a controller as a non-terminating control loop that watches cluster state and nudges current state toward desired state, using a thermostat analogy. It separates two patterns: controllers that act through the API server (the Job controller creates Pods and kubelets run them) and controllers that act directly on external systems (the cluster autoscaler talks to a cloud provider). It stresses many small controllers over one monolith, so one failing controller does not stop the others, and the use of labels to track ownership. This is the base for the idea that any external system can be driven by the same loop. Note that the "direct control" pattern is exactly what ACK, Config Connector and Crossplane providers do.
- Quote: "Each controller tries to move the current cluster state closer to the desired state."

### 2. Custom Resources (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
- Title: Custom Resources
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Explains that a custom resource extends the Kubernetes API with new kinds, registered dynamically without restarting or modifying the cluster. It compares CRDs (the API server serves and stores them in etcd; simplest option) with aggregated APIs (a separate API server behind the aggregation layer, more control over storage and REST behaviour, more operational cost). This page is the mechanical heart of the universal control plane: the API server provides storage, authn/authz, versioning, and watch for any kind a user defines.
- Quote: "Custom resources can appear and disappear in a running cluster through dynamic registration"

### 3. Operator pattern (Kubernetes docs)
- URL: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/
- Title: Operator pattern
- Publisher: Kubernetes project
- Kind: Official documentation
- Summary: Describes operators as custom resources plus controllers that encode human operational knowledge (deploy, back up, upgrade, failover). It uses a SampleDB example that creates PVCs, StatefulSets, backup Jobs and handles upgrades, and lists frameworks (kubebuilder, Operator Framework, Kopf, Java Operator SDK, kube-rs, KubeOps). Useful for tutorials as the bridge between "I run Kubernetes" and "I write or consume controllers".
- Quote: "Operators are software extensions to Kubernetes that make use of custom resources to manage applications and their components."

### 4. Kubernetes API conventions
- URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md
- Title: API Conventions
- Publisher: Kubernetes SIG Architecture
- Kind: Design and conventions document
- Summary: The contract that all resources follow: spec is desired state, status is observed state written by controllers; semantics are level-based, not edge-based; conditions have type, status (True/False/Unknown), reason and message so generic tools can read health; resourceVersion gives optimistic concurrency with HTTP 409 on conflict; deletionTimestamp and finalizers allow cleanup before removal. This is the strongest primary source for why a uniform control plane works across unrelated resource kinds, and why custom controllers should follow the same conventions.
- Quote: "the system will work to bring the `status` into line with the `spec`"

### 5. Cluster API concepts
- URL: https://cluster-api.sigs.k8s.io/user/concepts
- Title: Concepts - The Cluster API Book
- Publisher: Kubernetes SIG Cluster Lifecycle
- Kind: Official project documentation
- Summary: Describes a management cluster that runs Cluster API and provider controllers to create, upgrade and delete workload clusters, all as custom resources (Cluster, Machine, MachineDeployment, MachineHealthCheck). Three provider types (infrastructure, control plane, bootstrap) show how one API hides many backends such as AWS and vSphere. It is the clearest example of Kubernetes managing Kubernetes and raw infrastructure.
- Quote: "Cluster API uses custom resources to manage control plane and worker Machines."

### 6. Crossplane compositions and functions
- URL: https://docs.crossplane.io/latest/composition/compositions/
- Title: Compositions (Crossplane docs, v2.x)
- Publisher: Crossplane / CNCF
- Kind: Official documentation
- Summary: A CompositeResourceDefinition (XRD) defines a platform-team-owned API schema; a Composition maps each composite resource to a pipeline of functions. Functions are gRPC servers that receive observed state and accumulated desired state plus input, and return new desired state; Crossplane applies it and re-observes on each reconcile. This moves composition logic out of YAML templating and into code, with state feedback each loop.
- Quote: "A pipeline of functions accumulates desired state."

### 7. Crossplane home page
- URL: https://www.crossplane.io/
- Title: Crossplane Is the Cloud-Native Framework for Platform Engineering
- Publisher: Crossplane (CNCF project)
- Kind: Project marketing/overview
- Summary: Frames Crossplane as a framework for building custom control planes that manage any resource anywhere, exposing declarative APIs behind policy and RBAC. The page names no specific adopters, so it is a framing source, not evidence of use. Pair it with adopter lists in the CNCF project pages (not read here).
- Quote: "Extend Kubernetes to manage any resource anywhere."

### 8. Introducing kro (Google Cloud blog)
- URL: https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator
- Title: Introducing Kube Resource Orchestrator, or kro
- Publisher: Google Cloud (Abdel Sghiouar, Nic Slattery), 2025-01-30
- Kind: Vendor engineering blog, announcement
- Summary: Announces kro as a joint effort of Google, AWS and Microsoft. A ResourceGraphDefinition expands one end-user CRD into a graph of Kubernetes resources, including cloud resources from ACK, KCC and ASO. Gives two use cases: a GKE-cluster self-service API (cluster, node pools, IAM, policies hidden behind a few parameters) and a WebApp API (deployment, service, monitoring, a storage bucket). At announcement the project was explicitly not production-ready.
- Quote: "kro is a Kubernetes-native framework that lets you create reusable APIs to deploy multiple resources as a single unit."

### 9. kro project site
- URL: https://kro.run/
- Title: Kube Resource Orchestrator | kro
- Publisher: kro project (Kubernetes SIGs)
- Kind: Official project documentation
- Summary: kro is an in-cluster controller driven by one CRD, ResourceGraphDefinition, reconciling continuously with drift detection. It uses CEL (typed, non-Turing-complete) to reference fields across resources. The page showed version 0.10.0 and described it as a SIG Cloud Provider subproject, so it is still pre-1.0. Fetch did not expose the dependency-graph detail.
- Quote: "Build declarative, secure, and verifiable Kubernetes abstractions."

### 10. Flux GitOps Toolkit components
- URL: https://fluxcd.io/flux/components/
- Title: GitOps Toolkit components
- Publisher: Flux (CNCF)
- Kind: Official documentation
- Summary: Flux is a set of single-purpose controllers (source, kustomize, helm, notification, image automation) that communicate through CRDs, so users and other automation can create or update the same objects. It is itself a demonstration that a control plane is the integration bus.
- Quote: "The APIs comprise Kubernetes custom resources, which can be created and updated by a cluster user, or by other automation tooling."

### 11. Flux Kustomization API
- URL: https://fluxcd.io/flux/components/kustomize/kustomizations/
- Title: Kustomization CRD documentation
- Publisher: Flux (CNCF)
- Kind: Official API reference
- Summary: Covers dependsOn (apply after dependencies are Ready), prune (garbage collection of objects removed from Git), healthChecks and wait (readiness gating), force (recreate on immutable-field change, risky for StatefulSets) and drift correction via server-side apply dry runs on an interval. Notes that CRDs and their controllers must be reconciled before custom resources that use them.
- Quote: "If previously applied objects are missing from the current revision, these objects are deleted from the cluster when `.spec.prune` is enabled."

### 12. Argo CD sync phases and waves
- URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/
- Title: Sync Phases and Waves
- Publisher: Argo Project (CNCF)
- Kind: Official documentation
- Summary: Argo CD orders work by phase (PreSync, Sync, PostSync), then wave number, then kind and name, and advances only when the current wave is healthy. Pitfalls: hooks run every sync so must be idempotent; PreSync hooks can run before ConfigMaps or Secrets they need; long migrations can time out while still running. It contrasts with Flux, which expresses ordering through dependsOn between objects.
- Quote: "If any of them fails the whole sync process will stop and will be marked as failed"

### 13. ACK concepts
- URL: https://aws-controllers-k8s.github.io/docs/concepts/
- Title: AWS Controllers for Kubernetes concepts
- Publisher: AWS (ACK project)
- Kind: Official documentation
- Summary: One controller per AWS service, so permissions and releases are scoped per service. Reconciliation runs on change and on a periodic resync (default stated as 10 hours). Existing AWS resources can be adopted via annotations; a deletion-policy annotation chooses delete or retain; cross-account management is supported via IAM roles separate from Kubernetes RBAC.
- Quote: "Each controller only communicates with a single AWS API endpoint and receives only the IAM permissions it needs"

### 14. Config Connector: managing and deleting resources
- URL: https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources
- Title: Managing and deleting resources
- Publisher: Google Cloud
- Kind: Official documentation
- Summary: Deleting the Kubernetes object deletes the Google Cloud resource by default; an annotation (deletion-policy: abandon) retains it. Config Connector acquires an existing cloud resource when the manifest name matches, which is both a migration aid and a hazard.
- Quote: "When deleting a Config Connector resource the associated Google Cloud resource is deleted by default."

### 15. Kubernetes as the Linux kernel (Ænix)
- URL: https://aenix.io/blog/2026/10/kubernetes-as-the-linux-kernel/
- Title: Kubernetes as the Linux kernel: building distributions
- Publisher: Ænix; author Timur Tukaev (COO)
- Kind: Vendor opinion / vision blog (October 2026)
- Summary: Argues Kubernetes should be a stable core with purpose-built distributions, and lists examples that do not run containers: router/firewall appliance, KVM hypervisor, AI platform, real-time industrial controller, IoT gateway (Modbus/MQTT), observability cluster, workstation. Candidly lists risks: a single small maintaining team, limited production testing, new patching processes, a fleet center as single point of failure, and no shell for 3 a.m. debugging. This is the most explicit "universal control plane" statement, but it is a vision with limited production evidence.
- Quote: "If the complexity that machine learning, network appliances or industrial controllers need does not fit into the budget of the project's core, it still has to live somewhere."

### 16. kcp
- URL: https://www.kcp.io/
- Title: Horizontally Scalable Control Plane for Kubernetes APIs
- Publisher: kcp project (CNCF Sandbox)
- Kind: Official project site
- Summary: kcp hosts many isolated Kubernetes-like API endpoints (workspaces) without nodes, and uses APIExport/APIBinding to let a provider offer an API to many tenants. Aims at SaaS-style platforms using Kubernetes API conventions beyond container orchestration. Stated ambition is very large scale (about a million workspaces across 10,000 shards), which is a goal, not a measured result.
- Quote: "kcp allows building platforms and SaaS-like services with technology already known to platform engineers"

### 17. kcp workspaces vs namespaces vs vcluster
- URL: https://www.kubermatic.com/learn/kcp/workspaces-vs-namespaces-vs-vcluster/
- Title: kcp Workspaces vs Namespaces vs vcluster
- Publisher: Kubermatic
- Kind: Vendor explainer
- Summary: Compares tenancy models: namespaces (cheap, shared CRDs, noisy neighbours), vcluster (strong isolation, per-tenant API server cost, about 100 tenants), kcp (API-only isolation, 1000+ tenants, but no compute and less mature tooling). Numbers are the vendor's claims.
- Quote: "Pick namespaces for simplicity when your teams trust each other and your tenant count is low."

### 18. Why etcd breaks at scale
- URL: https://learnkube.com/etcd-breaks-at-scale
- Title: Why and how etcd breaks at scale in Kubernetes
- Publisher: Learnk8s
- Kind: Engineering explainer
- Summary: Explains the limits: a single Raft write leader, a single bbolt file (8 GB cap), MVCC revision growth needing compaction and defrag, and API server amplification of list/watch. Symptoms include quota alarms that freeze writes, compaction lag, memory spikes, and write conflicts among controllers. Mitigations: move Events to a separate etcd, Kine with SQL backends, watch-cache and streaming-list improvements, and cloud-provider custom backends.
- Quote: "Every write takes at least one network round-trip to the followers, plus a disk fsync on each node."

### 19. etcd sharding vs virtual clusters
- URL: https://www.vcluster.com/blog/kubernetes-etcd-sharding-vs-virtual-clusters
- Title: Kubernetes etcd Sharding vs Virtual Clusters: What Scales?
- Publisher: vCluster (Loft Labs)
- Kind: Vendor blog
- Summary: Argues a single etcd cannot be sharded across replication groups for a logical keyspace, and recommends per-tenant virtual control planes instead. Cites degradation around 30,000-40,000 objects and an 8 GB cap. The object-count figure is a vendor claim and workload dependent, so treat as indicative.
- Quote: "vCluster has a built-in snapshot and restore feature that enables seamless cluster backup and migration."

## Real-world use cases

Self-service cloud infrastructure from a platform team. Google's kro announcement describes a GKE-cluster API where users supply name, node pool, max nodes and location while IAM, policies and service activation stay hidden, built on Config Connector (https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator). Crossplane positions the same pattern for any cloud (https://www.crossplane.io/), though the page names no customers.

Cluster fleet lifecycle. Cluster API makes a management cluster create, upgrade and repair workload clusters on AWS, vSphere and others using Machine and MachineDeployment resources (https://cluster-api.sigs.k8s.io/user/concepts).

Cloud services as Kubernetes objects. ACK (AWS) and Config Connector (Google) expose S3, databases, IAM and more as CRDs, so the same RBAC and GitOps flow applies (https://aws-controllers-k8s.github.io/docs/concepts/, https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources).

Continuous delivery as controllers. Flux and Argo CD are themselves controllers that reconcile Git into the API server (https://fluxcd.io/flux/components/, https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/).

Non-container appliances. Ænix describes routers, hypervisors, IoT gateways and real-time controllers driven by the Kubernetes API, but presents them as its own distributions with limited production history (https://aenix.io/blog/2026/10/kubernetes-as-the-linux-kernel/).

Multi-tenant API hosting. kcp targets SaaS providers who serve APIs to many tenant workspaces without per-tenant clusters (https://www.kcp.io/, https://www.kubermatic.com/learn/kcp/workspaces-vs-namespaces-vs-vcluster/).

Gap: no source read here names specific end-user organizations running these at scale. Adopter lists (CNCF project pages, ADOPTERS files, KubeCon talks) still need to be collected.

## Pitfalls and how tools address them

Scale of the shared store. Every CR lives in etcd, which has one write leader, an 8 GB default cap and request-size limits, and the API server multiplies read cost (https://learnkube.com/etcd-breaks-at-scale). Mitigations: separate etcd for Events, Kine-backed SQL, watch-cache streaming, or per-tenant control planes through vCluster or kcp (https://www.vcluster.com/blog/kubernetes-etcd-sharding-vs-virtual-clusters, https://www.kcp.io/). Many controllers contending for the same objects also produce write conflicts; the API conventions handle this with resourceVersion and 409 retries (https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md).

Destructive deletion. Removing a Kubernetes object can delete real infrastructure. Config Connector deletes by default and offers a deletion-policy abandon annotation; ACK has a deletion-policy annotation and adoption of pre-existing resources (https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources, https://aws-controllers-k8s.github.io/docs/concepts/). Flux prune similarly deletes anything dropped from Git (https://fluxcd.io/flux/components/kustomize/kustomizations/). Finalizers ensure cleanup runs before an object disappears (API conventions).

Ordering and dependencies. CRDs and their controllers must exist before custom resources. Flux uses dependsOn plus health checks between Kustomizations; Argo CD uses phases, waves and health gating, with the caveat that hooks can run before required Secrets or ConfigMaps; kro derives ordering from references between resources in its graph; Crossplane functions see observed state each loop and can withhold dependent resources until ready (sources 6, 9, 11, 12).

Immutable fields and drift. Flux force recreates objects when immutable fields change, which is risky for StatefulSets, and it corrects drift on an interval with server-side apply dry runs. ACK resyncs periodically (default stated as 10 hours) and Config Connector adopts matching names, so out-of-band cloud changes can be reverted or can collide with existing resources (sources 11, 13, 14).

Blast radius and privilege. ACK splits one controller per AWS service with scoped IAM; Cluster API and Ænix-style fleets centralize authority in a management cluster that becomes a single point of failure (https://aws-controllers-k8s.github.io/docs/concepts/, https://aenix.io/blog/2026/10/kubernetes-as-the-linux-kernel/). Crossplane applies composed resources with its own service account, so RBAC on the XR API is the main guardrail (source 6).

Immature abstractions. kro was announced as not production-ready and was at 0.10.0 on its site; kcp is CNCF Sandbox (sources 8, 9, 16). The Ænix vision lists small team and limited production testing as risks (source 15).

Custom controller discipline. Plain operators are flexible but costly to build and maintain; the kro announcement cites this cost as its motivation (source 8). Controllers should follow the conventions: status conditions, level-triggered logic, idempotent reconcile (sources 1, 3, 4).

## Tutorial and explainer links

- https://kubernetes.io/docs/concepts/architecture/controller/ : best short introduction to the control loop idea.
- https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/ : CRD versus aggregated API decision, and where data is stored.
- https://kubernetes.io/docs/concepts/extend-kubernetes/operator/ : operator pattern and framework list for people ready to write controllers.
- https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md : the reference for spec, status, conditions and finalizers; long but authoritative.
- https://cluster-api.sigs.k8s.io/user/concepts : the clearest worked example of Kubernetes managing infrastructure.
- https://docs.crossplane.io/latest/composition/compositions/ : how composition and function pipelines work.
- https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator : approachable kro motivation with two concrete examples.
- https://learnkube.com/etcd-breaks-at-scale : readable account of the storage limits behind the control plane.
- https://www.kubermatic.com/learn/kcp/workspaces-vs-namespaces-vs-vcluster/ : quick tenancy-model comparison.

## Open questions

- Which named organizations run Crossplane, ACK, Config Connector, Cluster API or kcp in production, and with what object counts? None of the pages read give this.
- Several scale numbers (30,000-40,000 objects, 1000+ kcp tenants, 1 million workspaces, ~100 vCluster tenants) come from vendors with a stake in the answer; independent benchmarks are needed.
- The ACK resync default (10 hours) and kro maturity (0.10.0) may have changed; verify against current docs.
- kro's dependency-graph and readiness mechanics were not visible in the fetched page; read the RGD reference before writing about ordering.
- Config Connector, ACK, Flux and Argo CD pages were read through a summarizing fetch, not full text; failure-mode details (for example Argo CD drift and self-heal, Flux SSA conflicts) deserve a direct read.
- No postmortem of a control-plane-as-platform outage (CRD deletion cascades, etcd quota alarm, controller storm) was found; this is a gap for the pitfalls tutorial.
- How strongly the Ænix "distribution" model reflects community direction versus one vendor's view is unclear; no SIG or KEP source was read for it.
- No KEP or conference-talk source was collected (for example on API server aggregation, server-side apply, or streaming lists); add these if tutorials need design history.
