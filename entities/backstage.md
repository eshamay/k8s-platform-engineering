---
title: "Backstage"
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
aliases: []
tags: [tool, portal, catalog, cncf]
---

# Backstage

Backstage is a developer portal framework from Spotify and a CNCF incubating project. It provides a software catalog, software templates (the scaffolder), TechDocs, and a plugin ecosystem. [[sources/research-landscape]]

## What it does and does not do

Backstage is a user interface and metadata layer, not a provisioner. Real provisioning happens in whatever the templates call, such as a GitOps repository, a pipeline, or a Kubernetes API served by [[entities/crossplane]] or [[entities/kratix]]. The source quotes its mission as "Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly" (https://backstage.io/docs/overview/what-is-backstage).

## Pitfall

A portal alone leaves a gap between seeing and doing. Syntasso argues that developers still wait on tickets unless a provisioning layer sits behind the portal, which is a vendor claim, see [[findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor]].

## Open points

The Kubernetes plugin reads custom resources only from the `kubernetes.customResources` list, globally or per cluster, and silently skips a missing CRD ([[findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd]]). Backstage's catalog handling of CRDs beyond this configuration was not read. [[sources/research-gap-m6-admission-crds]]

## Related

[[concepts/tooling-landscape]], [[entities/port]], [[comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers]]

## Backstage and the operator pattern (m7 dossier)

The "Open points" section above is extended. The Kubernetes plugin matches entities to cluster objects by the `backstage.io/kubernetes-id` label, offers a proxy for custom resource access beyond the defaults, and supports watching. No Backstage document read describes an operator pattern, and Software Templates were not read. An operator that deploys Backstage exists as a Red Hat product, see [[examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift]]. See [[findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern]]. [[sources/research-gap-m7-operators-idempotency]]
