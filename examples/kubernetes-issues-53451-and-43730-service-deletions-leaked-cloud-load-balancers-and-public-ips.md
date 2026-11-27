---
title: Kubernetes issues 53451 and 43730 service deletions leaked cloud load balancers and public IPs
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [Service controller load balancer leak]
tags: [finalizers, orphans, load-balancer, service-controller, azure, cloud-leak]
---

# Kubernetes issues 53451 and 43730 service deletions leaked cloud load balancers and public IPs

## Scenario

Two 2017 issues in the Kubernetes repository show cloud resources outliving the Services that created them. Neither involves a forced finalizer removal, so they show the orphaning mechanism and not its frequency. [sources/research-gap-g1-gitops-drift-incidents](../sources/research-gap-g1-gitops-drift-incidents.md)

## What happened

Issue 53451, opened 2017-10-04, says the "service controller can leave orphaned load balancers after services are deleted". The cause given is a restart while a delete is pending, when the Service is already gone from etcd and nothing remains to say a load balancer needs deleting. The issue proposed a finalizer on all Services as the fix. Pull request 54569, "Add finalizer support to service controller to ensure cleanup on delete", was opened on 2017-10-25, but it was closed without merging on 2019-06-04, so it is not the shipped fix, and this wiki has not established what finalizer work shipped. https://github.com/kubernetes/kubernetes/issues/53451 and https://github.com/kubernetes/kubernetes/pull/54569

Issue 43730, opened 2017-03-28 against v1.5.3 on Azure, reports "resource leaks in the cloud with respect to PublicIp and LoadBalancer Frontend Ip Pool" after Services were deleted, filling a pool of 10 entries. This is the reporter's account. https://github.com/kubernetes/kubernetes/issues/43730

## Why it belongs here

A finalizer is the record that external work remains, which is why [findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data](../findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data.md) treats removing one as risky. These issues show the other side: with no finalizer, a missed delete also leaves the leak. See [findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late](../findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late.md).

## Related

[concepts/finalizers](../concepts/finalizers.md), [findings/destructive-deletion-of-external-resources](../findings/destructive-deletion-of-external-resources.md)
