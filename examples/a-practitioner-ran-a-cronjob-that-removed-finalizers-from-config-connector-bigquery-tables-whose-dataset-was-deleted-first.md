---
title: A practitioner ran a CronJob that removed finalizers from Config Connector BigQuery tables whose dataset was deleted first
type: example
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: medium-config-connector-pitfalls
    hash: c5b9825d753a
    ingested: 2026-11-26
aliases: []
tags: [config-connector, argo-cd, bigquery, finalizers, deletion-ordering, cronjob, secondary-source]
---

# A practitioner ran a CronJob that removed finalizers from Config Connector BigQuery tables whose dataset was deleted first

> [!NOTE]
> **Evidence grade:** Secondary, a single practitioner's account. Michał Marszałek, Medium, 2023-12-20, https://medium.com/@michamarszaek/navigating-config-connector-challenges-a-guide-to-overcoming-pitfalls-a63777ae7ed1. No organization is named, and the manifests were not reproduced.

## Scenario

The author deploys a BigQuery dataset, a BigQuery table, a Cloud Storage bucket, and a Pub/Sub topic and subscription as Config Connector objects delivered by Argo CD. The table points at its dataset with `datasetRef`. [[sources/medium-config-connector-pitfalls]]

## What he reports

On creation, a table whose dataset does not exist yet cannot be created, so he adds Argo CD sync-wave annotations, the dataset at `-1` and the table at `0`, to order the two. On deletion he says Argo CD has no deletion ordering and cites Argo CD issue 14505, so when the dataset is removed first the table object enters `DeleteFailed`, and `kubectl describe` shows why. [[sources/medium-config-connector-pitfalls]]

His workaround is a Kubernetes CronJob that runs every five minutes with a service account that has all verbs on the `bigquery.cnrm.cloud.google.com` group. A script lists tables in `DeleteFailed`, reads each table's `datasetRef`, checks whether the dataset object still exists, and if not patches the table with a JSON patch that removes `/metadata/finalizers`. With the finalizers gone Kubernetes can delete the table object. He justifies this because deleting a dataset in Google Cloud also removes its tables, views, and routines, so no Google Cloud object is left behind. [[sources/medium-config-connector-pitfalls]]

## How it fits the wiki

This is an automated version of the force-removal option in [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]], with the author's own argument for why it is safe in this one parent and child pair. The wiki's cost warning in [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]] applies to any pair where the parent's deletion does not remove the child in the cloud. The same ordering problem appears as a reporter claim in [[examples/config-connector-issue-534-deleting-a-bigquerydataset-before-its-tables-left-both-in-failure-and-the-issue-has-been-open-since-2021]], and the general finding is [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]].
