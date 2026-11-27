---
title: "bex.co blog post: kro Just Landed in CNCF's 'Adopt' Tier Next to Helm While Still Being Alpha Software"
type: source
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: bex-co-kro-radar-post
    hash: 748c0bc7495e
    ingested: 2026-11-26
aliases: []
tags: [kro, cncf, slashdata, technology-radar, secondary-source, cluster-api, bex, targeted-pass]
---

# bex.co blog post: kro Just Landed in CNCF's 'Adopt' Tier Next to Helm While Still Being Alpha Software

> [!NOTE]
> **Raw file:** `raw/bex-co-kro-radar-post` (sha256 prefix 748c0bc7495e)<br>
> **URL:** https://bex.co/blog/2026/07/29/kro-kube-resource-orchestrator-cncf-radar-adopt<br>
> **Author and date:** Dora Noda, bex.co, 2026-07-29, listed as a nine-minute read<br>
> **Kind:** Secondary source. A company blog post that reports a CNCF and SlashData survey it cites, and that argues for its own platform decision. The radar itself was not read.<br>
> **Ingested:** 2026-11-26 as a targeted pass over the kro adoption, comparison, and decision pages

## Summary

The post reports that the CNCF and SlashData Q1 2026 Platform Engineering Radar, published in March 2026 from a Q4 2025 survey, put kro in the "Adopt" tier of the application-delivery category alongside Helm and Backstage. It spends most of its length on what the rating can and cannot mean, shows a trimmed `WebApp` ResourceGraphDefinition, compares kro with Crossplane Compositions and a hand-rolled operator, and then weighs what kro would buy bex, a git-push platform as a service built on Cluster API and run on Hetzner capacity. Its conclusion is to try kro's pattern first on a non-critical abstraction and keep a hand-rolled controller as a fallback for TLS and custom-domain logic.

Every statement about the radar is the post's account, and the radar was not read for this ingest. The post names no company running kro in production. Its own platform is evaluating kro and has not adopted it.

## Key claims

Claims about the radar, as reported by the post and not checked against the radar:
- The radar covers three categories, workflow automation, application delivery, and security and compliance management, from a Q4 2025 survey of "more than 400" professional cloud-native developers, and scores each tool on maturity, usefulness, and likelihood to recommend.
- In application delivery, three tools reached "Adopt": Helm, Backstage, and kro.
- The post says the rating measures the pattern of Kubernetes-native composite resources written in YAML and CEL, and is not a claim that any kro release is battle-tested.

Claims about kro, as stated by the post:
- kro was introduced by Google, AWS, and Microsoft as a joint experiment in late 2024 and later donated to Kubernetes SIGs as `kubernetes-sigs/kro`, a subproject of SIG Cloud Provider.
- The README still opens with an alpha disclaimer, and the maintainers commit to migration paths and deprecation notices and not to API stability.
- kro parses each `${...}` CEL expression, finds cross-resource references, builds a directed acyclic graph, creates independent resources in parallel, and tears resources down in reverse order on delete.
- kro validates CEL expressions against Kubernetes OpenAPI schemas when the RGD is applied, which catches field typos before any instance exists.
- kro composes Kubernetes objects and has no built-in cross-cloud resource provisioning.
- The post cites a December 2025 CNCF blog walkthrough of building platforms with kro, an AWS EKS kro-concepts page, and a Crossplane function that consumes kro's authoring style, as signs the idea is spreading.

Claims about alternatives, as the author's opinion:
- A hand-rolled operator has the highest cost per new resource type. Crossplane Compositions need a heavier control plane to operate and are strongest for external cloud resources such as RDS and IAM. A kro RGD needs only YAML and CEL but carries an alpha API.
- The post says Backstage "has been CNCF-graduated since 2022", which differs from this wiki's record, see [entities/backstage](../entities/backstage.md).

Claims about the author's platform:
- kro starts one layer above Cluster API and does not decide where a cluster comes from. The author lists five gaps for bex: the alpha API, no cluster provisioning, no per-tenant TLS or custom-domain model, portability that a Hetzner-only fleet does not need, and type checking that cannot see a platform's own CRD fields unless the platform adds validation.

## Entities and concepts

- Entities: [entities/kro](../entities/kro.md), [entities/function-kro](../entities/function-kro.md), [entities/crossplane](../entities/crossplane.md), [entities/cluster-api](../entities/cluster-api.md), [entities/helm](../entities/helm.md), [entities/backstage](../entities/backstage.md).
- Concepts: [concepts/composition](../concepts/composition.md), [concepts/composite-resource](../concepts/composite-resource.md).

## Limits

The post is a company blog and the radar's own methodology, scores, and wording were not read, so the "Adopt" placement, the sample size, and the date are the author's report. The post is also a content marketing piece for a platform company and argues from the position of a team deciding what to build. It describes kro's pitch as portability across GKE, EKS, and AKS without a cited source. It makes no measurement of kro's behavior and reports no incident. A rating from developer sentiment is not a record of production use.

## Pages touched

[entities/kro](../entities/kro.md), [entities/backstage](../entities/backstage.md), [entities/cluster-api](../entities/cluster-api.md), [comparisons/hand-written-operator-versus-crossplane-composition-versus-kro](../comparisons/hand-written-operator-versus-crossplane-composition-versus-kro.md), [decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer](../decisions/choose-kro-crossplane-or-both-for-a-platform-abstraction-layer.md), [findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter](../findings/kro-scale-evidence-is-two-open-issues-and-a-closed-unmerged-pull-request-with-no-benchmark-and-no-named-production-adopter.md), and the new [findings/one-blog-reports-that-the-cncf-and-slashdata-q1-2026-radar-rated-kro-adopt-from-a-survey-of-more-than-400-developers](../findings/one-blog-reports-that-the-cncf-and-slashdata-q1-2026-radar-rated-kro-adopt-from-a-survey-of-more-than-400-developers.md) and [examples/bex-co-weighs-a-kro-resourcegraphdefinition-against-a-hand-rolled-operator-for-a-cluster-api-paas-on-hetzner](../examples/bex-co-weighs-a-kro-resourcegraphdefinition-against-a-hand-rolled-operator-for-a-cluster-api-paas-on-hetzner.md).
