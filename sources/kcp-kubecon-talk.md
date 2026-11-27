---
title: "KubeCon talk on kcp by Yan Vegas of Accenture (auto-generated transcript)"
type: source
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: kcp-kubecon-talk
    hash: d7a7a3fee0ab
    ingested: 2026-11-26
aliases: []
tags: [kcp, kubecon, multi-tenancy, workspaces, transcript, speaker-account, targeted-pass]
---

# KubeCon talk on kcp by Yan Vegas of Accenture (auto-generated transcript)

> [!NOTE]
> **Raw file:** `raw/kcp-kubecon-talk` (sha256 prefix d7a7a3fee0ab)<br>
> **URL:** https://www.youtube.com/watch?v=-GJgzn3pyvM<br>
> **Speaker and date:** Yan Vegas, who says he works for Accenture. The transcript gives no date or event name. An earlier wiki todo identifies the video as the KubeCon EU 2024 kcp talk linked from kcp.io, and that identification is not confirmed by the transcript.<br>
> **Kind:** The speaker's own account in a short talk of about five minutes. Auto-generated YouTube transcript with recognition errors.<br>
> **Ingested:** 2026-11-26 as a targeted pass over the kcp, tenancy, and CRD-versioning pages

## Summary

The speaker introduces kcp as a way to get an isolated Kubernetes API without the weight of a cluster. He contrasts a namespace, which is quick but gives little isolation, with a full cluster, which he says takes half an hour to an hour to get from a managed cloud provider. kcp offers a lightweight API server, with workspaces as the isolated endpoints, that he says can be created in about a second. He describes how kcp handles CRD version changes, mentions how it can be deployed, and points listeners to other talks at the conference, one of which covers a CVE his side discovered.

## Key claims

All claims are the speaker's, as heard in the transcript.
- A namespace is quick to provision, while a full cluster, including one from a managed provider, takes "half an hour to an hour", which the speaker calls too heavy for an account.
- The speaker says a vanilla Kubernetes cluster has "around 80 built-in resources" as of when he last checked, and that most are unneeded for a use case focused on CRDs.
- kcp is an open-source, horizontally scalable control plane for Kubernetes-like APIs that provides isolated endpoints called workspaces.
- A workspace is a full Kubernetes API without workload and infrastructure resources, so it has no nodes, pods, or deployments, and the user is cluster admin inside it.
- A workspace is created "literally a second" after the request.
- Because the API is Kubernetes-like, familiar tools work, such as kubectl, Helm, and anything built on client-go.
- kcp is written in Go and compiles to a single binary that can run on a laptop, as a managed service, or on Kubernetes.
- It can also be deployed as a global control plane with multi-region support, many caching layers, and aggregated APIs.
- For CRD version upgrades with a breaking change, the speaker says a different api version is not enough in Kubernetes, and kcp lets `v1alpha1` be served by a different controller than `v1alpha2`.
- kcp also lets an exported API carry a different name from the API in the backing cluster.
- The speaker says one talk at the conference goes into a CVE that the kcp side discovered, and others on Wednesday go deeper into the project.

## Entities and concepts

- Entities: [[entities/kcp]], [[entities/kubectl]], [[entities/helm]], [[entities/client-go]].
- Concepts: [[concepts/universal-control-plane]], [[concepts/crd-versioning-and-storage-migration]], [[concepts/custom-resource-definition]].

## Limits

The transcript is auto-generated and has recognition errors that change meaning in places. "Bane coming back to the roots" is probably "Baking" or "Going back to", "pots" is "pods", "cubectl" is `kubectl`, "v1 alpha 1" is `v1alpha1`, and "KCP" is the project written in lowercase elsewhere. The sentence about the CVE is partly garbled, so the wording "the CVE which we discovered" is uncertain, and the transcript names no CVE identifier. The timestamps in the raw file are run together with the text. The talk is a short promotion by one speaker. It gives no benchmark, no tenant count, no limits, and no named adopter, and it says nothing about the Kubernetes-as-a-kernel distribution model. His statement that he works for Accenture is not a statement that Accenture runs kcp.

## Pages touched

[[entities/kcp]], [[comparisons/tenancy-models-namespaces-vcluster-kcp]], [[concepts/crd-versioning-and-storage-migration]], [[concepts/universal-control-plane]], [[examples/multi-tenant-api-hosting-with-kcp]], [[findings/no-sig-charter-or-kep-adopts-a-kubernetes-distribution-model-and-the-only-direct-source-is-aenix-s-own-post]], and the new [[examples/a-kcp-speaker-says-a-workspace-takes-about-a-second-to-create-where-a-managed-cluster-takes-half-an-hour-to-an-hour]].
