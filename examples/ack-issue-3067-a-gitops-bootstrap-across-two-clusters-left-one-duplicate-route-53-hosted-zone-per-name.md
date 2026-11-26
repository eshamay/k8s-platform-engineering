---
title: ACK issue 3067 a GitOps bootstrap across two clusters left one duplicate Route 53 hosted zone per name
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-leaked-resources-adoption
    hash: 472b18eb451a
    ingested: 2026-11-26
aliases: [ACK issue 3067]
tags: [ack, route53, duplicate-resource, gitops, bootstrap, adoption]
---

# ACK issue 3067 a GitOps bootstrap across two clusters left one duplicate Route 53 hosted zone per name

## Scenario

On 2026-10-01 shrinedogg opened ACK community issue 3067. The reporter ran the ACK controller on a throwaway cluster during a GitOps bootstrap and then on the durable management cluster. The second cluster started with empty status for the same manifests. [[sources/research-gap-g1-leaked-resources-adoption]] URL: https://github.com/aws-controllers-k8s/community/issues/3067

## What happened

Route 53 allows two public hosted zones with the same name. The second controller therefore created new zones instead of finding the first ones, "leaving one duplicate zone per name in the account." This is the reporter's account.

## Maintainer response

Maintainer knottnt asked whether ACK should enforce a constraint the service itself does not, saying "we do want to allow creation of ACK resources to match what the service itself allows." The maintainer pointed to a work-in-progress tag-based adoption change in ACK runtime pull request 261.

## Why it belongs here

Here the lost state is not a crashed reconcile but a second cluster with empty status. A create that is only guarded by the custom resource's own status cannot see what another controller already made, which links this case to the ownership-tag proposal in [[findings/ack-adopt-or-create-removes-the-only-guard-against-two-custom-resources-owning-one-aws-resource]].

## Related

[[entities/ack]], [[decisions/adopt-or-create-or-require-explicit-import]], [[concepts/gitops-pull-based-delivery]]
