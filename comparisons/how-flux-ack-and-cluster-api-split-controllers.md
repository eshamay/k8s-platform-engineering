---
title: How Flux, ACK, and Cluster API split controllers
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-operator-pattern
    hash: eab72eca2e1b
    ingested: 2026-11-25
aliases: []
tags: [operators, flux, ack, cluster-api, design]
---

# How Flux, ACK, and Cluster API split controllers

| Dimension | Flux | ACK | Cluster API |
|---|---|---|---|
| Axis of the split | By concern: source, kustomize, helm, notification, image automation | By AWS service, one controller image each | Core controllers versus provider controllers |
| What each controller reconciles | Its own CRDs against Git or other sources | Custom resources into one service's AWS API calls | Cluster and machine resources, with backend work in providers |
| Benefit the dossier names | Composable APIs and one controller per concern | Scoped permissions and releases per service | Generic core with extensibility |

[sources/research-operator-pattern](../sources/research-operator-pattern.md)

## Reading the table

All three apply the single-responsibility guidance from Kubebuilder, Google Cloud, and the Kubernetes controller documentation, but they cut along different axes: function, external API, and portability. The dossier gives no performance or operability comparison. See [findings/multi-kind-controllers-break-encapsulation-and-scale-poorly](../findings/multi-kind-controllers-break-encapsulation-and-scale-poorly.md) and [decisions/one-controller-per-kind-or-one-multi-kind-controller](../decisions/one-controller-per-kind-or-one-multi-kind-controller.md). URL: https://fluxcd.io/flux/components/, https://aws-controllers-k8s.github.io/community/docs/community/overview/, and https://cluster-api.sigs.k8s.io/user/concepts.

## Related

[examples/flux-splits-gitops-into-single-purpose-controllers](../examples/flux-splits-gitops-into-single-purpose-controllers.md), [examples/ack-ships-one-controller-per-aws-service](../examples/ack-ships-one-controller-per-aws-service.md), [examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers](../examples/cluster-api-keeps-core-controllers-generic-with-provider-controllers.md)
