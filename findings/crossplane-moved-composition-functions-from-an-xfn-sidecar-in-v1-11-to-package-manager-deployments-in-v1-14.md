---
title: "Crossplane moved composition functions from an xfn sidecar in v1.11 to package-manager Deployments in v1.14"
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o7-krm-functions
    hash: 35b3cd859ba9
    ingested: 2026-11-26
aliases: []
tags: [crossplane, composition-functions, xfn, history, architecture]
---

# Crossplane moved composition functions from an xfn sidecar in v1.11 to package-manager Deployments in v1.14

## Observation

In alpha (Crossplane v1.11.0, published 2023-01-31, "Composition Function support introduced in alpha by @negz") functions were run-to-completion OCI containers. The accepted design document says "A sidecar container in the Crossplane pod - `xfn` - runs each of them in a rootless container", and that "Since alpha, no alternative Function runners have appeared." The release notes show xfn still being fixed in v1.13.0 (2023-07-27, "Run xfn with unconfined AppArmor profile"). The beta design made a Function a long-running gRPC server: "When you install one, the package manager deploys it using a Kubernetes Deployment", reached through a headless Service ("The Service must be headless in order for Crossplane's gRPC client to load-balance connections") whose address is exposed as `status.endpoint` of the active FunctionRevision, with mTLS and scaling by Deployment replicas. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

v1.14.0 (2023-11-01) shipped that design as v1beta1, listing "Introduce Function CRDs", "Deploy Functions with package manager", and "Move xfn out-of-tree", and stating that v1beta1 "is incompatible with existing `v1alpha1` functions". On main, the `cmd` directory holds only `crossplane`, and a commit is titled "feat: remove xfn", though no removal date was read. v1.17.0 (2024-08-29) graduated functions to v1, and the current docs say "Installing a Function creates a function pod" and "Functions are packages, like Providers". [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

## Settled and open

Settled: the sidecar runner is the alpha model, the Deployment model is current, and the 2023 VSHN description of a sidecar and the design document describe different eras and not a live disagreement, see [sources/research-composition](../sources/research-composition.md). Not settled: the beta design proposed offering xfn as an optional wrapper that runs an OCI container per Deployment, and whether any such wrapper is maintained today is UNVERIFIED. The package manager's exact pod construction was not read from source. [sources/research-gap-o7-krm-functions](../sources/research-gap-o7-krm-functions.md)

URLs: https://github.com/crossplane/crossplane/blob/main/design/design-doc-composition-functions.md, https://github.com/crossplane/crossplane/releases/tag/v1.14.0, https://github.com/crossplane/crossplane/releases/tag/v1.11.0

## Related

[entities/crossplane](../entities/crossplane.md), [concepts/composition](../concepts/composition.md), [examples/crossplane-v1-14-0-shipped-beta-functions-on-2023-11-01-and-broke-compatibility-with-alpha-functions](../examples/crossplane-v1-14-0-shipped-beta-functions-on-2023-11-01-and-broke-compatibility-with-alpha-functions.md), [findings/composition-functions-add-moving-parts-that-must-be-healthy](composition-functions-add-moving-parts-that-must-be-healthy.md)
