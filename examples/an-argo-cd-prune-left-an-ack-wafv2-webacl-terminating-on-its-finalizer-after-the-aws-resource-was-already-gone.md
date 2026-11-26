---
title: An Argo CD prune left an ACK WAFv2 WebACL terminating on its finalizer after the AWS resource was already gone
type: example
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: [ACK issue 2911]
tags: [ack, argo-cd, prune, finalizers, wafv2, incident]
---

# An Argo CD prune left an ACK WAFv2 WebACL terminating on its finalizer after the AWS resource was already gone

## Scenario

In ACK issue 2911, opened 2026-06-04, a reporter running the ACK wafv2 controller (v1.3.2 per the reporter) had Argo CD manage a WebACL custom resource. The reporter and the issue are anonymous. [[sources/research-gap-g1-gitops-drift-incidents]] URL: https://github.com/aws-controllers-k8s/community/issues/2911

## What happened

Argo CD pruned the WebACL CR. The controller deleted the AWS WAF resource, but it did not map the AWS "not found" error that came back on a later pass, so the CR never finished deleting. The reporter wrote that "The CR sits in `Terminating` indefinitely until the finalizer is patched off manually." A maintainer confirmed the cause and said the fix is an exception-code mapping in the generator configuration. The dossier read the source path at v1.4.0 and found it unchanged there.

## Why it belongs here

The case shows how a routine prune can turn into a manual finalizer patch. In this instance the manual patch is safe, because the AWS resource was already gone, so removing the finalizer skips no cleanup. The same patch would be unsafe if the cloud resource still existed, see [[findings/forcing-a-finalizer-off-skips-cleanup-and-can-leak-billing-resources-or-corrupt-data]]. The mechanism is described in [[findings/pruning-a-custom-resource-whose-controller-does-not-map-a-not-found-error-leaves-it-terminating-on-its-finalizer]].

## Related

[[entities/ack]], [[entities/argo-cd]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]], [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]]
