---
title: "Tooling landscape"
type: concept
status: active
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: [Kubernetes platform tooling landscape]
tags: [landscape, layers, gitops, provisioning, platform]
---

# Tooling landscape

The Kubernetes platform-tooling landscape is easiest to learn as three layers that solve different problems and are routinely combined. Confusing the layers is the most common source of bad comparisons, such as asking whether Argo CD or Crossplane is better when one moves manifests and the other reconciles cloud resources. [[sources/research-landscape]]

## The three layers

The delivery layer gets desired state from Git, OCI, or Helm into a cluster and keeps it there. [[entities/argo-cd]] and [[entities/flux]] are the two CNCF projects, and both run reconcile loops. Argo CD ships as an integrated application with an API server, repository server, controller, and UI. Flux ships as a toolkit of small controllers for sources, Kustomize, Helm, notifications, and image automation, each owning its own CRDs. See [[concepts/gitops-pull-based-delivery]].

The provisioning layer turns custom resources into calls against a cloud or infrastructure API. [[entities/config-connector]], [[entities/ack]], and [[entities/azure-service-operator]] are single-vendor controllers that expose roughly one CRD per cloud resource. [[entities/crossplane]] is multi-cloud and adds Compositions and XRDs so a platform team can publish its own API without writing a controller. [[entities/tofu-controller]] and [[entities/terraform-operator]] wrap existing Terraform code in a CRD and run plan and apply in pods. [[entities/cluster-api]] applies the same idea to Kubernetes clusters, where a management cluster reconciles Cluster and Machine objects into workload clusters through infrastructure, bootstrap, and control-plane providers. See [[concepts/managed-resource]] and [[concepts/provider]].

The platform and portal layer defines what application teams see. [[entities/backstage]] and [[entities/port]] are catalogs and portals with self-service actions. [[entities/kratix]] is an orchestration framework that sits behind a portal, where a Promise packages an API, workflows, and fleet scheduling. [[entities/cozystack]] is a different kind of thing, an opinionated packaged PaaS for building a cloud on bare metal. See [[concepts/composite-resource]] and [[concepts/composition]] for the abstraction mechanics that Crossplane and similar tools share.

## How the layers combine

Most production stacks pick one tool from each layer. A typical Google Cloud shop uses Argo CD or Flux to deliver Config Connector resources from Git, and a portal such as Backstage sits on top so developers can request things without writing YAML. The worked cases are in [[examples/google-cloud-shops-deliver-config-connector-resources-from-git-while-the-controller-s-own-identity-makes-the-cloud-calls]], [[examples/single-cloud-teams-pick-ack-per-service-or-azure-service-operator-v2-with-code-generated-crds]], and [[examples/kratix-promises-scatter-workloads-across-standard-pci-and-terraform-destinations]].

The boundaries are where the problems appear. Per-resource provisioning controllers do not build a dependency graph, so ordering falls to the delivery tool or to a composition layer, see [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]]. The provisioning controller holds the cloud identity, so whoever can create a custom resource inherits its rights, see [[findings/controllers-that-act-with-their-own-cloud-identity-give-whoever-can-create-a-resource-that-identity-s-rights]]. A portal supplies visibility and not provisioning, see [[findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor]].

## Reading comparisons critically

Several of the comparative claims about this landscape come from vendors. Akuity sells Argo CD, Port competes with Backstage, and Syntasso sells Kratix, so their framing favors their own tool. The wiki records these as attributed claims and notes the absence of independent benchmarks, see [[findings/landscape-comparisons-of-argo-cd-flux-port-and-kratix-come-from-vendors-with-no-independent-benchmarks]].

## Related

[[comparisons/delivery-versus-provisioning-versus-platform-layers-in-the-kubernetes-tooling-landscape]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]], [[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]], [[comparisons/flux-versus-argo-cd-architecture]], [[concepts/universal-control-plane]]
