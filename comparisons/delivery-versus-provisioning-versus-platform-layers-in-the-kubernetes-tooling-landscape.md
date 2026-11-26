---
title: "Delivery versus provisioning versus platform layers in the Kubernetes tooling landscape"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
aliases: []
tags: [comparison, landscape, layers]
---

# Delivery versus provisioning versus platform layers in the Kubernetes tooling landscape

The three layers answer different questions, and a production stack usually needs one tool from each. [[sources/research-landscape]]

| Aspect | Delivery | Provisioning | Platform and portal |
|---|---|---|---|
| Question answered | How do manifests get from Git, OCI, or Helm into the cluster and stay there | How do custom resources become calls to a cloud or infrastructure API | What do application teams see and request |
| Tools | [[entities/argo-cd]], [[entities/flux]] | [[entities/config-connector]], [[entities/ack]], [[entities/azure-service-operator]], [[entities/crossplane]], [[entities/tofu-controller]], [[entities/terraform-operator]], [[entities/cluster-api]] | [[entities/backstage]], [[entities/port]], [[entities/kratix]], [[entities/cozystack]] |
| Unit of work | A manifest or Helm release | An external resource such as a bucket, database, or cluster | A catalog entity, a Promise, or a self-service action |
| Ordering | Sync waves, `dependsOn` | Missing in per-resource controllers, centralized in compositions | Workflows in Kratix, none in a catalog alone |
| Identity | AppProjects, Kubernetes RBAC | Controller's own cloud identity | Portal permissions |

## Reading the table

The sources agree on this split and disagree on boundaries. Crossplane reaches into the platform layer through XRDs and Compositions, Kratix reaches into provisioning through pipelines, and Cozystack ships all three in one packaged distribution, so the layers are a learning aid and not a hard taxonomy. The detailed generalization is in [[concepts/tooling-landscape]].

## Related

[[comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso]], [[comparisons/flux-versus-argo-cd-architecture]]
