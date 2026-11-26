---
title: Crossplane versus kro, packaging, distribution, and governance according to an engineer's blog
type: comparison
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-kro-and-abstraction-models
    hash: d43d3775cbbd
    ingested: 2026-11-25
aliases: []
tags: [crossplane, kro, packaging, oci, governance, comparison]
---

# Crossplane versus kro, packaging, distribution, and governance according to an engineer's blog

> [!NOTE]
> The only source for the table is one individual engineer's blog dated July 2026 (https://kubernetesinmyhead.net/deployment/crossplane-vs-kro/). One of its governance labels disagrees with a stronger source, as noted below.

## Side by side

| Dimension | Crossplane | kro |
|---|---|---|
| API definition | XRD, with an optional namespaced Claim | A schema section inside one ResourceGraphDefinition file |
| Logic | Composition as a function pipeline: patch-and-transform, KCL, Go templating, Python | CEL expressions, with ordering inferred from references |
| Children | Managed resources from providers, reaching cloud APIs directly | Kubernetes objects only, so cloud resources come through ACK, ASO, or Config Connector |
| Distribution | OCI Configuration package that pins providers and functions | Git, Helm, or Kustomize |
| Provider generation | Upjet generates providers from Terraform providers | No equivalent |
| Runtime | Crossplane core plus providers and functions | Its own controller only |
| Governance | CNCF project | Kubernetes SIG Cloud Provider subproject, announced jointly by AWS, Google Cloud, and Microsoft Azure in January 2025 |

The post's summary is that "kro is markedly more compact and has no external runtime to install besides its own controller." Compactness is bought by narrower reach, since kro orchestrates only Kubernetes objects. [[sources/research-kro-and-abstraction-models]]

## Where the post disagrees with the wiki

The post labels Crossplane as CNCF Incubating, but the project's announcement and InfoQ, recorded in [[sources/research-crossplane-deep-dive]], say it graduated. A July 2026 date makes the blog label likely stale, and the wiki treats graduation as established. The post also says kro is not a CNCF project, while kro.run says only that it is a SIG Cloud Provider subproject. The two statements are compatible and the wiki tracks the question in [[open-knowledge-gaps]].

## Reading the comparison

Crossplane's packaging model is the more mature distribution story, because a Configuration package pins the provider and function versions an API needs. kro's distribution through Git, Helm, or Kustomize is simpler but gives no equivalent pinning. The API-lifecycle machinery follows the same pattern, with Crossplane exposing versioned XRDs and conversion webhooks and kro blocking breaking schema changes. See [[entities/crossplane]], [[entities/kro]], [[entities/upjet]], [[comparisons/crossplane-xrds-versus-kro-resourcegraphdefinitions-as-crd-generators]], and [[comparisons/render-time-versus-controller-driven-abstraction-helm-kustomize-kpt-score-crossplane-kro-and-radius]].
