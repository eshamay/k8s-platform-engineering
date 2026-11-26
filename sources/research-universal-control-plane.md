---
title: "Research dossier: Universal Control Plane"
type: source
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: []
tags: [universal-control-plane, research-dossier, etcd, crossplane, kro, cluster-api, kcp]
---

# Research dossier: Universal Control Plane

> [!NOTE]
> **Raw file:** `raw/research-universal-control-plane.md` (sha256 prefix 037575049a4c)<br>
> **Kind:** Research dossier summarizing 19 web pages, dated 2026-11-25<br>
> **Ingested:** 2026-11-25<br>
> **Caveat:** The dossier author read pages through a summarizing fetch tool, so quotes should be re-checked against the live pages before publication.

## Summary

The dossier explains the "universal control plane" idea: the Kubernetes API server, etcd, and the controller convention form a generic engine for declarative resources that has no inherent tie to Pods. It walks through the primitives (controllers, custom resources, operators, API conventions), the platform layers built on them (provider controllers, composition layers, GitOps delivery), and the far edge (kcp and Ænix's distribution model). It closes with pitfalls, which center on etcd scale, destructive deletion, ordering, drift, blast radius, and immature tools, and with a candid list of open questions. The main limit is that it names no end-user organizations running these systems at scale.

See [[concepts/universal-control-plane]] for the synthesized concept.

## Key claims

### Primitives (Kubernetes docs and conventions)

- A controller is a non-terminating control loop that moves current state toward desired state. The page distinguishes controllers that act through the API server (the Job controller) from controllers that act directly on external systems (the cluster autoscaler), and favors many small controllers over a monolith. URL: https://kubernetes.io/docs/concepts/architecture/controller/. Quote: "Each controller tries to move the current cluster state closer to the desired state." See [[concepts/reconciliation-loop]].
- Custom resources are registered dynamically and can be served either by a CRD, which the API server stores in etcd, or by an aggregated API server that offers more control at higher operational cost. URL: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/. See [[concepts/custom-resource-definition]] and [[decisions/crd-versus-aggregated-api]].
- Operators are custom resources plus controllers that encode human operational knowledge such as deploy, back up, upgrade, and failover. The page lists frameworks including kubebuilder, Operator Framework, Kopf, Java Operator SDK, kube-rs, and KubeOps. URL: https://kubernetes.io/docs/concepts/extend-kubernetes/operator/. See [[concepts/operator-pattern]].
- The API conventions define the shared contract: `spec` is desired state, `status` is observed state written by controllers, semantics are level-based, conditions carry type, status, reason, and message, `resourceVersion` gives optimistic concurrency with HTTP 409 on conflict, and finalizers allow cleanup before removal. URL: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md. Quote: "the system will work to bring the `status` into line with the `spec`". See [[concepts/spec-status-split]], [[concepts/conditions]], [[concepts/finalizers]], and [[concepts/level-triggered-vs-edge-triggered]].

### Provider and composition layers

- Cluster API uses a management cluster to create, upgrade, and delete workload clusters through custom resources (Cluster, Machine, MachineDeployment, MachineHealthCheck), with infrastructure, control plane, and bootstrap provider types. URL: https://cluster-api.sigs.k8s.io/user/concepts. See [[entities/cluster-api]] and [[examples/cluster-fleet-lifecycle-with-cluster-api]].
- A Crossplane CompositeResourceDefinition defines a platform-team-owned API, and a Composition maps each composite resource to a pipeline of function gRPC servers that receive observed and accumulated desired state and return new desired state. URL: https://docs.crossplane.io/latest/composition/compositions/. Quote: "A pipeline of functions accumulates desired state." See [[entities/crossplane]] and [[concepts/composition]].
- Crossplane describes itself as a framework for custom control planes that manage any resource anywhere behind policy and RBAC, but its home page names no adopters. URL: https://www.crossplane.io/. Quote: "Extend Kubernetes to manage any resource anywhere."
- Google announced kro on 2025-01-30 as a joint effort of Google, AWS, and Microsoft. A ResourceGraphDefinition expands one CRD into a graph of resources, including ACK, Config Connector, and Azure Service Operator resources, and the announcement said the project was not production-ready. URL: https://cloud.google.com/blog/products/containers-kubernetes/introducing-kube-resource-orchestrator. See [[entities/kro]] and [[examples/self-service-gke-cluster-with-kro]].
- The kro site describes a single in-cluster controller driven by the ResourceGraphDefinition CRD, with continuous reconciliation, drift detection, and CEL expressions that are typed and non-Turing-complete. The page showed version 0.10.0 and called it a SIG Cloud Provider subproject. URL: https://kro.run/. Dependency-graph detail was not visible in the fetched page.
- AWS Controllers for Kubernetes (ACK) runs one controller per AWS service so permissions and releases are scoped per service, resyncs periodically (default stated as 10 hours), supports adoption of existing resources by annotation, offers a deletion-policy annotation, and supports cross-account management through IAM roles. URL: https://aws-controllers-k8s.github.io/docs/concepts/. Quote: "Each controller only communicates with a single AWS API endpoint and receives only the IAM permissions it needs". See [[entities/ack]].
- Config Connector deletes the Google Cloud resource when the Kubernetes object is deleted unless a `deletion-policy: abandon` annotation is set, and it acquires an existing cloud resource whose name matches the manifest. URL: https://docs.cloud.google.com/config-connector/docs/how-to/managing-deleting-resources. See [[entities/config-connector]] and [[findings/destructive-deletion-of-external-resources]].

### Delivery layers

- Flux is a set of single-purpose controllers (source, kustomize, helm, notification, image automation) that communicate through CRDs that users or other automation can create and update. URL: https://fluxcd.io/flux/components/. See [[entities/flux]].
- The Flux Kustomization API provides `dependsOn`, `prune`, `healthChecks`, `wait`, and `force`, and corrects drift on an interval with server-side apply dry runs. CRDs and their controllers must be reconciled before custom resources that use them. URL: https://fluxcd.io/flux/components/kustomize/kustomizations/. Quote: "If previously applied objects are missing from the current revision, these objects are deleted from the cluster when `.spec.prune` is enabled."
- Argo CD orders work by phase (PreSync, Sync, PostSync), then wave, then kind and name, advancing only when the current wave is healthy. Hooks run on every sync, PreSync hooks can run before the ConfigMaps or Secrets they need, and long migrations can time out. URL: https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/. See [[entities/argo-cd]] and [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

### Beyond containers and multi-tenancy

- Ænix argues that Kubernetes should be a stable core with purpose-built distributions, and it lists non-container examples (router and firewall appliance, KVM hypervisor, AI platform, real-time industrial controller, IoT gateway, observability cluster, workstation) alongside candid risks. URL: https://aenix.io/blog/2026/10/kubernetes-as-the-linux-kernel/ (October 2026, vendor opinion). See [[examples/non-container-appliances-on-the-kubernetes-api]].
- kcp hosts many isolated Kubernetes-like API endpoints called workspaces without nodes, and uses APIExport and APIBinding to offer an API to many tenants. Its stated ambition of about a million workspaces across 10,000 shards is a goal, not a measured result. URL: https://www.kcp.io/. See [[entities/kcp]] and [[examples/multi-tenant-api-hosting-with-kcp]].
- Kubermatic compares tenancy models: namespaces are cheap but share CRDs, vcluster gives strong isolation at about 100 tenants, and kcp isolates only the API for 1000+ tenants without compute. These numbers are vendor claims. URL: https://www.kubermatic.com/learn/kcp/workspaces-vs-namespaces-vs-vcluster/. See [[comparisons/tenancy-models-namespaces-vcluster-kcp]].

### Scale

- etcd has a single Raft write leader, a single bbolt file with an 8 GB cap, MVCC revision growth that needs compaction and defragmentation, and API server amplification of list and watch load. Mitigations include a separate etcd for Events, Kine with SQL backends, watch-cache and streaming-list improvements, and cloud-provider custom backends. URL: https://learnkube.com/etcd-breaks-at-scale. Quote: "Every write takes at least one network round-trip to the followers, plus a disk fsync on each node." See [[findings/etcd-scale-limits-of-the-shared-store]].
- vCluster argues that one etcd cannot be sharded across replication groups for a logical keyspace, cites degradation around 30,000 to 40,000 objects, and recommends per-tenant virtual control planes. The object count is a vendor claim and is workload dependent. URL: https://www.vcluster.com/blog/kubernetes-etcd-sharding-vs-virtual-clusters.

### Cross-cutting pitfalls

- Ordering, immutable fields, drift, blast radius, and immature abstractions are each handled differently by each tool. See [[findings/ordering-and-dependency-failures]], [[findings/immutable-fields-and-drift-collisions]], [[findings/blast-radius-and-privilege-centralization]], and [[findings/immature-abstractions-in-the-control-plane-ecosystem]].

## Limits of this source

The dossier read many pages only through a summarizing fetch, four long pages only up to character 100000, and found no named production adopters, no independent scale benchmarks, and no postmortem of a control-plane outage. Its open questions are carried into [[open-knowledge-gaps]]. It does not mention Backstage, so no Backstage page was created.
