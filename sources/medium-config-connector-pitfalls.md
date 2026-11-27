---
title: "Medium post: Navigating Config Connector Challenges: A Guide to Overcoming Pitfalls (Michał Marszałek, 2023)"
type: source
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: medium-config-connector-pitfalls
    hash: c5b9825d753a
    ingested: 2026-11-26
aliases: []
tags: [config-connector, argo-cd, sync-waves, finalizers, deletion-ordering, terraform, secondary-source, practitioner-account, targeted-pass]
---

# Medium post: Navigating Config Connector Challenges: A Guide to Overcoming Pitfalls (Michał Marszałek, 2023)

> [!NOTE]
> **Raw file:** `raw/medium-config-connector-pitfalls` (sha256 prefix c5b9825d753a)<br>
> **URL:** https://medium.com/@michamarszaek/navigating-config-connector-challenges-a-guide-to-overcoming-pitfalls-a63777ae7ed1<br>
> **Author and date:** Michał Marszałek, 2023-12-20, listed as a six-minute read<br>
> **Kind:** Secondary source. An individual practitioner's account on Medium, with no vendor review and no reproduction details beyond the manifests shown.<br>
> **Ingested:** 2026-11-26 as a targeted pass over the Config Connector, Argo CD ordering, and Terraform comparison pages

## Summary

The author argues that Config Connector is a good way to create Google Cloud resources next to the application that needs them when Argo CD, Helm, or Kustomize already deliver the manifests, and then describes the main pain point he met, dependency order. He shows five manifests for a BigQuery dataset and table, a Cloud Storage bucket, and a Pub/Sub topic and subscription, contrasts Config Connector's reference handling with Terraform's implicit dependency graph and `depends_on`, and describes a workaround of Argo CD sync waves for creation and a CronJob that clears finalizers for deletion. He ends with a short note that Crossplane supports multiple clouds.

The wiki already cited this post second-hand in [findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering](../findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering.md), from a brief fetch extraction. This ingest reads the full text and keeps the claims attributed to the author.

## Key claims

All claims are the author's own account and are not reproduced here.
- Config Connector is described as a 100% Kubernetes-native tool that lets Kubernetes resources and Google Cloud infrastructure be created together by Argo CD, Helm, or Kustomize. The author finds this more straightforward than Terraform for buckets, BigQuery datasets and tables, and Pub/Sub resources deployed alongside an application.
- Against Terraform, he cites the HCL entry barrier for developers and the need to understand Terraform state, and notes that Terraform can also deploy Helm charts. He says Config Connector is developed by Google and supports only Google Cloud while Terraform supports many clouds.
- He says the main pain point is dependency order and cites Config Connector issue 384, saying that at the time of writing Config Connector could not create dependencies in the proper order. He calls Terraform's handling of dependencies its biggest advantage, through references and `depends_on`.
- He says Config Connector's handling depends on the resource. A BigQuery table refers to its dataset through `datasetRef`, which names the dataset's Kubernetes manifest, and if the dataset does not exist the table cannot be created.
- To order creation he adds Argo CD sync-wave annotations to the manifests, for example `-1` for the dataset and `0` for the table, and mentions Helm hooks as an alternative.
- For deletion he says Argo CD does not support deletion ordering and cites Argo CD issue 14505. If the parent is removed first, the child enters a `DeleteFailed` state, and the reason is visible with `kubectl describe`.
- His workaround is a CronJob every five minutes that finds BigQuery tables in `DeleteFailed`, checks whether the dataset named by `datasetRef` still exists, and patches the table to remove `/metadata/finalizers` if it does not. He reasons this is acceptable for a dataset because deleting a dataset in Google Cloud removes its tables, views, and routines.
- The example manifests set the annotations `cnrm.cloud.google.com/delete-contents-on-destroy` on a dataset and `cnrm.cloud.google.com/force-destroy` on a bucket to `"true"`.
- On alternatives, he says Crossplane has the advantage of multi-cloud support and that most resources served by Terraform providers are available in Crossplane.

## Entities and concepts

- Entities: [entities/config-connector](../entities/config-connector.md), [entities/argo-cd](../entities/argo-cd.md), [entities/terraform](../entities/terraform.md), [entities/crossplane](../entities/crossplane.md).
- Concepts: [concepts/finalizers](../concepts/finalizers.md).

## Limits

The post is one practitioner's account from December 2023. The status of Config Connector issue 384 and Argo CD issue 14505 was not read in this pass, and the author says only that they were open when he wrote. The manifests were not run. The CronJob script runs in the default namespace and matches `DeleteFailed` by text, details the post does not discuss. The claim that Argo CD has no deletion ordering conflicts in part with this wiki's record that wave order is reversed during pruning, see [entities/argo-cd](../entities/argo-cd.md), and the post does not say which kind of delete it means. The post compares Config Connector with Terraform and Crossplane in a few sentences of opinion and gives no measurement.

## Pages touched

[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering](../findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering.md), [entities/config-connector](../entities/config-connector.md), [entities/argo-cd](../entities/argo-cd.md), [entities/terraform](../entities/terraform.md), [comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso](../comparisons/crossplane-versus-cloud-vendor-add-ons-ack-config-connector-and-aso.md), [examples/argo-cd-sync-waves-order-crds-operators-and-workloads](../examples/argo-cd-sync-waves-order-crds-operators-and-workloads.md), [decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller](../decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller.md), and the new [examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first](../examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first.md).
