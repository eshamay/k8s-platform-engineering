---
title: Resources are orphaned when a controller misses the delete or the finalizer is added too late
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, finalizers, orphans, service-controller, cluster-api, deletion]
---

# Resources are orphaned when a controller misses the delete or the finalizer is added too late

## Observation

Orphaning has causes other than forced finalizer removal, and the dossier's primary evidence is about those. Kubernetes issue 53451 (2017) says the service controller can leave orphaned load balancers if it restarts while a delete is pending, because the Service is already gone from etcd. Issue 43730 (2017, Azure, v1.5.3) reports public IP and load balancer frontend leaks after Service deletion filling a 10-entry pool. Cluster API issue 8172 (2023, v1.3.0) says that deleting objects before the controller adds its finalizer means "the resources created by these objects get orphaned". [[sources/research-gap-g1-gitops-drift-incidents]]

## Evidence quality

These are issue texts from the reporters. Issue 53451 proposed a finalizer on all Services, and pull request 54569 to add one was closed without merging on 2019-06-04, so the issue text cannot be cited as a shipped fix. None of the three concerns forced removal specifically, and none gives a rate.

## Related

[[examples/kubernetes-issues-53451-and-43730-service-deletions-leaked-cloud-load-balancers-and-public-ips]], [[examples/cluster-api-issue-8172-deleting-parents-before-the-controller-adds-its-finalizer-orphans-their-resources]], [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]], [[findings/a-finalizer-added-after-the-delete-request-is-too-late-and-new-ones-are-refused]], [[concepts/finalizers]]
