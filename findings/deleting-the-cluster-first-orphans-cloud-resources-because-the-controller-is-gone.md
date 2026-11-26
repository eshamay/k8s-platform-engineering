---
title: "Deleting the cluster first orphans cloud resources because the controller is gone"
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-25
sources:
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
aliases: []
tags: [pitfall, finalizers, config-connector, orphaned-resources]
---

# Deleting the cluster first orphans cloud resources because the controller is gone

## Observation

A finalizer only works while its controller runs. The perun.au consultancy article reports that when a GKE cluster hosting Config Connector is deleted, the controller stops running and the Google Cloud resources that it managed are left behind, still billing. The same article says that deleting a Config Connector object deletes the Google Cloud resource through a finalizer even if production is using it, which it calls a deletion protection gap. [[sources/research-finalizers]]

## Evidence quality

The source is a single consultancy blog, so the dossier says to treat the claims as practitioner opinion. It matches the general mechanism in the Kubernetes documentation, in which a missing controller is a standard cause of stuck deletion, but it was not corroborated by a second source. See [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]].

## Mitigations

Delete the managed resources, or set an abandon or retain policy, before deleting the cluster, and apply the policy before the delete. See [[decisions/delete-or-retain-the-external-resource-when-the-kubernetes-object-is-deleted]].

## Related

[[entities/config-connector]], [[findings/destructive-deletion-of-external-resources]], [[concepts/finalizers]]
