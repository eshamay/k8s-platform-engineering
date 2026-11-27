---
title: A kcp speaker says a workspace takes about a second to create where a managed cluster takes half an hour to an hour
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: kcp-kubecon-talk
    hash: d7a7a3fee0ab
    ingested: 2026-11-26
aliases: []
tags: [kcp, workspaces, multi-tenancy, speaker-account, crd-versioning]
---

# A kcp speaker says a workspace takes about a second to create where a managed cluster takes half an hour to an hour

> [!NOTE]
> **Evidence grade:** The speaker's own account from a short KubeCon talk by Yan Vegas of Accenture, transcript at https://www.youtube.com/watch?v=-GJgzn3pyvM. The figures are spoken estimates with no measurement behind them, and the transcript has recognition errors.

## Scenario

The speaker frames the tenancy problem as a choice between a namespace, which is quick but weakly isolated, and a full cluster, which he says takes half an hour to an hour even from a managed cloud provider. His answer is a kcp workspace, an isolated Kubernetes API endpoint with no nodes, pods, or deployments, where the user is cluster admin and the workspace appears in about a second. [[sources/kcp-kubecon-talk]]

## How the speaker says it works

Inside a workspace the user can register CRDs and control everything, not only namespaced objects, and can use kubectl, Helm, and other client-go tools. The speaker says a vanilla cluster carries about 80 built-in resources, which a CRD-focused use case does not need, so a lighter API server is enough. kcp ships as one Go binary that runs on a laptop or on Kubernetes, and it can also be run as a global multi-region control plane with caching layers and aggregated APIs. [[sources/kcp-kubecon-talk]]

For CRD upgrades with breaking changes, he says kcp allows `v1alpha1` and `v1alpha2` of an API to be served by different controllers and allows an exported API to have a different name from the API in the backing cluster. How that mapping works was not explained in the talk, and the wiki's record of Kubernetes conversion strategies is in [[concepts/crd-versioning-and-storage-migration]]. [[sources/kcp-kubecon-talk]]

## How it fits the wiki

The account agrees with the wiki's description of kcp in [[entities/kcp]] and [[examples/multi-tenant-api-hosting-with-kcp]]: node-less API workspaces for many tenants. It adds a timing claim for workspace creation and for cluster creation that the vendor numbers in [[comparisons/tenancy-models-namespaces-vcluster-kcp]] do not contain. It gives no tenant count, no benchmark, and no adopter, so the open scale and adopter gaps are not answered by it.
