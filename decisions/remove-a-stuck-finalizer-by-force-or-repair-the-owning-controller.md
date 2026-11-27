---
title: "Remove a stuck finalizer by force or repair the owning controller"
type: decision
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: medium-config-connector-pitfalls
    hash: c5b9825d753a
    ingested: 2026-11-26
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [decision, finalizers, troubleshooting, operations]
---

# Remove a stuck finalizer by force or repair the owning controller

## Status

Open as a judgment call. The sources agree on the order of preference but not on a threshold for forcing. [[sources/research-finalizers]]

## Context

An object is stuck Terminating because its controller is gone, its cleanup errors, or a child holds its own finalizer. An operator must choose between fixing the cause and stripping the finalizer.

## Options

- Diagnose and repair. Read `metadata.finalizers`, find the owning controller, and read its logs. Reinstall or fix the controller, or unblock the child.
- Force removal as a last resort. Patch the list empty or remove one entry, or use the namespace `/finalize` subresource, and then clean up the external resources by hand.

## Trade-offs

Repair preserves the guarantee that cleanup runs, but it can take time when the controller no longer exists. Force removal restores speed and loses the guarantee. The Kubernetes documentation says not to remove finalizers manually unless the purpose is understood and met another way, and Martin Heinz argues against doing it reflexively.

## Related

[[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]], [[examples/diagnosing-a-pod-stuck-terminating-from-finalizer-to-force-delete]], [[concepts/finalizers]]

## Evidence from the GitOps incidents dossier

ACK issue 2911 is a case where the maintainers' answer was to repair the controller (an exception-code mapping), and where the manual patch was safe only because the AWS resource was already gone, see [[examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone]]. No source gives a rate for orphaning after forced removal, see [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].

## Evidence from the Kubernetes finalizers blog

The 2021 official Kubernetes blog post shows the force option in its simplest form, a JSON patch that removes `/metadata/finalizers` so a waiting delete completes, and the namespace form, an update to the `finalize` subresource with `spec.finalizers` null. Its advice is to investigate before removing a finalizer because there is often a reason it was added, and it warns that forced namespace finalization can leave orphan objects in a namespace that no longer exists, with namespace re-creation as a possible recovery. See [[examples/a-configmap-with-a-finalizer-no-controller-handles-stays-in-deletion-until-kubectl-patch-removes-the-finalizer-list]] and [[findings/forcing-namespace-finalization-can-leave-orphan-objects-in-a-namespace-that-no-longer-exists-and-recreating-the-namespace-may-bring-them-back]]. [[sources/kubernetes-finalizers-blog]]

## A practitioner's automated force removal

A 2023 Medium post automates the force option with a CronJob that removes the finalizers of Config Connector BigQuery tables whose dataset object is gone, arguing this is safe because deleting a dataset in Google Cloud also deletes its tables. The argument is the author's and holds only where the parent's deletion removes the child in the cloud. See [[examples/a-practitioner-ran-a-cronjob-that-removed-finalizers-from-config-connector-bigquery-tables-whose-dataset-was-deleted-first]]. [[sources/medium-config-connector-pitfalls]]
