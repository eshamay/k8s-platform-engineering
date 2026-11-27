---
title: Universal Control Plane
type: concept
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: kcp-kubecon-talk
    hash: d7a7a3fee0ab
    ingested: 2026-11-26
  - id: krm-platform-vocabulary
    hash: 731a6941f9db
    ingested: 2026-11-25
  - id: research-universal-control-plane
    hash: 037575049a4c
    ingested: 2026-11-25
aliases: [Kubernetes as a control plane]
tags: [architecture, principle]
---

# Universal Control Plane

## Definition

The idea of using the Kubernetes API server and etcd as a centralized database and orchestration engine for any infrastructure, such as cloud databases, DNS records, and SaaS configuration, instead of treating Kubernetes only as a container scheduler. [[sources/krm-platform-vocabulary]]

The research dossier makes the separation explicit. Kubernetes ships two things together: a container scheduler, and a generic, extensible API machine made of an API server (authentication, RBAC, admission, validation, watch) backed by etcd, plus a convention for controllers that reconcile `spec` toward `status`. The second part has no inherent tie to Pods, so anything that can be described declaratively and reconciled by a loop can be modeled as a custom resource, including a cloud database, a whole cluster, a firewall rule, or an application bundle. [[sources/research-universal-control-plane]]

## Why it matters

Every platform tool in this wiki depends on this idea. Once an external thing is represented as a Kubernetes object, it inherits authentication, RBAC, audit, watch semantics, and a shared tooling ecosystem. See [[concepts/custom-resource-definition]] for how new resource types are registered and [[concepts/reconciliation-loop]] for how controllers keep the external world aligned.

The uniform contract is what makes this work. The API conventions fix `spec` and `status`, conditions, `resourceVersion`, and finalizers for every kind, so generic tooling such as GitOps engines, policy engines, and UIs works across all kinds. Level-triggered semantics make the loop robust to missed events and restarts. See [[concepts/spec-status-split]], [[concepts/conditions]], and [[concepts/level-triggered-vs-edge-triggered]].

## The layers

The dossier describes the stack in four layers.

1. **Primitives.** Controllers as control loops, CRDs stored in etcd (or an aggregated API, see [[decisions/crd-versus-aggregated-api]]), and the [[concepts/operator-pattern]].
2. **Provider controllers.** [[entities/ack]], [[entities/config-connector]], Azure Service Operator, and [[entities/cluster-api]] project external APIs into Kubernetes. They are the "direct control" pattern, where a controller acts on an external system.
3. **Composition layers.** [[entities/crossplane]] and [[entities/kro]] let a platform team publish a small API that expands into many resources.
4. **Delivery layers.** [[entities/flux]] and [[entities/argo-cd]] reconcile Git into the API server. Flux is itself an example of the control plane as an integration bus, since its controllers communicate through CRDs that users or other automation can also write.

At the far end, [[entities/kcp]] hosts many node-less API workspaces for multi-tenant SaaS, and Ænix argues for purpose-built distributions that are not container platforms. See [[examples/non-container-appliances-on-the-kubernetes-api]] and [[examples/multi-tenant-api-hosting-with-kcp]].

## Real-world use cases

[[examples/self-service-gke-cluster-with-kro]], [[examples/cluster-fleet-lifecycle-with-cluster-api]], [[examples/cloud-services-as-kubernetes-objects]], [[examples/non-container-appliances-on-the-kubernetes-api]], and [[examples/multi-tenant-api-hosting-with-kcp]]. The dossier found no source naming end-user organizations that run these at scale, so adoption evidence remains thin.

## Limits and critiques

The recurring cautions are about scale and blast radius. Each added CRD and controller adds load and failure surface.

- [[findings/etcd-scale-limits-of-the-shared-store]]
- [[findings/destructive-deletion-of-external-resources]]
- [[findings/ordering-and-dependency-failures]]
- [[findings/immutable-fields-and-drift-collisions]]
- [[findings/blast-radius-and-privilege-centralization]]
- [[findings/immature-abstractions-in-the-control-plane-ecosystem]]

See also [[comparisons/tenancy-models-namespaces-vcluster-kcp]] and [[comparisons/ordering-models-flux-argo-cd-kro-crossplane]].

## Related

[[concepts/declarative-vs-imperative]], [[concepts/provider]], [[concepts/composition]]

## To research

Named production adopters and object counts, independent scale benchmarks, and control-plane outage postmortems. These are tracked in [[open-knowledge-gaps]].

## kcp as a lightweight API server (speaker's account)

A KubeCon talk transcript describes kcp workspaces as the Kubernetes API with the workload and infrastructure resources removed, so the API server and CRDs can be used alone, which is the far end of this idea described above. The speaker's figures are unmeasured. See [[examples/a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour]]. [[sources/kcp-kubecon-talk]]
