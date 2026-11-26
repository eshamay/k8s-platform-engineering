---
title: "Crossplane versus cloud-vendor add-ons: ACK, Config Connector, and ASO"
type: comparison
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-provider
    hash: 7e43edcd71be
    ingested: 2026-11-25
  - id: research-gap-o4-config-connector-ack
    hash: c0d708f1d445
    ingested: 2026-11-26
aliases: []
tags: [comparison, crossplane, ack, config-connector, azure-service-operator, provider]
---

# Crossplane versus cloud-vendor add-ons: ACK, Config Connector, and ASO

The Crossplane blog groups Crossplane, ACK, Config Connector, and Azure Service Operator as tools that expose cloud APIs as custom resources. The author is a project maintainer, so the framing is positioning and not neutral analysis. [[sources/research-provider]]

| Aspect | [[entities/crossplane]] | [[entities/ack]] | [[entities/config-connector]] | [[entities/azure-service-operator]] |
|---|---|---|---|---|
| Clouds | Many, through installable providers | AWS | Google Cloud | Azure |
| Packaging | Provider as an OCI package with revisions | One controller image per AWS service | Add-on with namespaced or cluster mode | Operator with 150 or more resources |
| How the catalog is built | Upjet from Terraform, plus hand-written providers | Generated from AWS API models | Direct, Terraform-based, and DCL-based controllers | Generated from Azure Resource Manager schemas |
| Composition layer | Built in, through Compositions | None built in; the EKS guide points to kro | None built in | None described |
| Credential scoping | `ProviderConfig` per account | `IAMRoleSelector` per namespace | Service account per namespace | Not covered by the dossier |

## Reading the comparison

The Crossplane argument is that the typical application developer "shouldn't have to deal with low level infrastructure APIs," so platform teams bundle many managed resources behind a simpler composite API, see [[concepts/composition]]. The vendor add-ons expose resources close to one-to-one, which is a more direct view of the cloud and leaves abstraction to other tools such as [[entities/kro]], as in [[examples/the-eks-kro-capability-composes-ack-s3-buckets-with-deployments-and-config-maps]]. The ASO documentation gives no comparison with Crossplane, so none is inferred. [[sources/research-provider]]

Both camps follow the same controller pattern, see [[concepts/provider]], and share the same risks, see [[findings/anyone-who-can-create-a-provider-managed-object-gets-the-controllers-cloud-permissions]]. A related comparison of how they handle adoption is [[comparisons/observe-only-and-keep-controls-across-crossplane-config-connector-and-ack]].

## Update from the o4 dossier

The table above compares features from Crossplane's and the vendors' own pages. The o4 dossier searched for a neutral Config Connector versus Crossplane comparison and found none: the evidence is a Crossplane maintainer's 2021 post and 2020 to 2022 issue comments, an unanswered 2024 question, and a Google 2023 blog that compares Config Connector with Terraform, see [[findings/no-neutral-comparison-of-config-connector-and-crossplane-was-found-so-the-evidence-is-two-vendor-positions]]. Additional first-party contrasts: Config Connector's mean re-enqueue is 10 minutes against Crossplane's 1 minute runtime poll, the Config Connector add-on can lag releases by 12 months or more ([[findings/the-gke-config-connector-add-on-can-lag-the-latest-release-by-12-months-or-more-and-google-discourages-it-for-production]]), and Crossplane's cluster-scoped managed resources in the 2021 post are dated for v2. The option set is in [[decisions/use-config-connector-directly-wrap-it-in-crossplane-through-the-kubernetes-provider-or-use-a-crossplane-gcp-provider]]. [[sources/research-gap-o4-config-connector-ack]]
