---
title: "Provider families versus per-service controllers"
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
aliases: []
tags: [comparison, crossplane, ack, crd-scaling, provider]
---

# Provider families versus per-service controllers

Both Crossplane and ACK ended up splitting a large cloud API into pieces that can be installed independently, but they arrived there from opposite directions. [sources/research-provider](../sources/research-provider.md)

| Aspect | Crossplane provider families | ACK per-service controllers |
|---|---|---|
| Origin | A fix for the monolithic provider-aws, which installed more than 900 CRDs | The design from the start, one controller per AWS service |
| Packaging | Scoped providers grouped into a family, sharing a common configuration | Each controller in its own container image |
| Versioning | Provider revisions per package | Independent versions and deployment per service, with alpha to GA phases and a deprecation policy |
| Main benefit | Install only the services in use, so fewer CRDs by default | The same, by construction |
| Cost | Migration from monoliths and dependence on upstream Kubernetes and ecosystem changes | More controller deployments to run and upgrade |

## Reading the comparison

The CRD count is the scaling variable in both cases, see [findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation](../findings/one-crd-per-external-resource-type-overloads-api-server-discovery-and-openapi-computation.md). Crossplane also added resource-type activation in version 2, see [examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs](../examples/crossplane-managed-resource-activation-policies-install-only-the-resource-types-a-cluster-needs.md), and the family story is told in [examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use](../examples/crossplane-provider-families-let-operators-install-only-the-cloud-services-they-use.md). The ACK side is covered in [examples/ack-ships-one-controller-per-aws-service](../examples/ack-ships-one-controller-per-aws-service.md). See [entities/crossplane](../entities/crossplane.md) and [entities/ack](../entities/ack.md).
