---
title: "Backstage"
type: entity
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: bex-co-kro-radar-post
    hash: 748c0bc7495e
    ingested: 2026-11-26
  - id: research-landscape
    hash: d28204a90545
    ingested: 2026-11-25
  - id: research-gap-m6-admission-crds
    hash: 7cac38f11490
    ingested: 2026-11-26
  - id: research-gap-m7-operators-idempotency
    hash: 6c986668a6dc
    ingested: 2026-11-26
  - id: research-gap-o6-platform-landscape
    hash: caa824f6fb9e
    ingested: 2026-11-26
aliases: []
tags: [tool, portal, catalog, cncf]
---

# Backstage

Backstage is a developer portal framework from Spotify and a CNCF incubating project. It provides a software catalog, software templates (the scaffolder), TechDocs, and a plugin ecosystem. [sources/research-landscape](../sources/research-landscape.md)

## What it does and does not do

Backstage is a user interface and metadata layer, not a provisioner. Real provisioning happens in whatever the templates call, such as a GitOps repository, a pipeline, or a Kubernetes API served by [entities/crossplane](crossplane.md) or [entities/kratix](kratix.md). The source quotes its mission as "Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly" (https://backstage.io/docs/overview/what-is-backstage).

## Pitfall

A portal alone leaves a gap between seeing and doing. Syntasso argues that developers still wait on tickets unless a provisioning layer sits behind the portal, which is a vendor claim, see [findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor](../findings/a-portal-alone-gives-visibility-but-not-provisioning-so-ticket-queues-can-persist-according-to-a-kratix-vendor.md).

## Open points

The Kubernetes plugin reads custom resources only from the `kubernetes.customResources` list, globally or per cluster, and silently skips a missing CRD ([findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd](../findings/backstage-reads-custom-resources-only-from-the-kubernetes-custom-resources-list-and-silently-skips-a-missing-crd.md)). Backstage's catalog handling of CRDs beyond this configuration was not read. [sources/research-gap-m6-admission-crds](../sources/research-gap-m6-admission-crds.md)

## Related

[concepts/tooling-landscape](../concepts/tooling-landscape.md), [entities/port](port.md), [comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers](../comparisons/backstage-versus-port-versus-kratix-as-portal-and-orchestration-layers.md)

## Backstage and the operator pattern (m7 dossier)

The "Open points" section above is extended. The Kubernetes plugin matches entities to cluster objects by the `backstage.io/kubernetes-id` label, offers a proxy for custom resource access beyond the defaults, and supports watching. No Backstage document read describes an operator pattern, and Software Templates were not read. An operator that deploys Backstage exists as a Red Hat product, see [examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift](../examples/red-hat-developer-hub-operator-deploys-backstage-on-kubernetes-and-openshift.md). See [findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern](../findings/the-backstage-kubernetes-plugin-matches-entities-to-cluster-objects-by-label-and-no-backstage-document-describes-an-operator-pattern.md). [sources/research-gap-m7-operators-idempotency](../sources/research-gap-m7-operators-idempotency.md)

## Scaffolder and the operator pattern (o6 dossier)

The Software Templates overview describes the Scaffolder as a skeleton-to-repository tool in which each run is a unique task, so it is a run-once task runner and not a reconcile loop. The Kubernetes configuration page confirms that custom resources default to an empty list and that the label selector annotation takes precedence over the `backstage.io/kubernetes-id` label. The nearest operator-style integration is the third-party TeraSky Kubernetes Ingestor, see [findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin](../findings/the-backstage-scaffolder-is-a-one-shot-task-runner-and-the-nearest-operator-style-integration-is-a-third-party-plugin.md) and [examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog](../examples/the-terasky-kubernetes-ingestor-ingests-crossplane-claims-and-kro-instances-into-the-backstage-catalog.md). Backstage is CNCF incubating per the landscape file. Whether a built-in Scaffolder action creates custom resources is unverified. [sources/research-gap-o6-platform-landscape](../sources/research-gap-o6-platform-landscape.md)

## Discrepancy on Backstage's CNCF level (secondary post)

Discrepancy note: a secondary blog (bex.co, 2026-07-29) says Backstage "has been CNCF-graduated since 2022". This page records Backstage as a CNCF incubating project, taken from the landscape dossier. The post gives no source for its wording and is not a CNCF record, so this page's statement stands, but the CNCF project page was not re-read in this pass and the current level is worth checking. The same post lists Backstage in the "Adopt" tier of a CNCF and SlashData radar, a claim also unverified. [sources/bex-co-kro-radar-post](../sources/bex-co-kro-radar-post.md)
