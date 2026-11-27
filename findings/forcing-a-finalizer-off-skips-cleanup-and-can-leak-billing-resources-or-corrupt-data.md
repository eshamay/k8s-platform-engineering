---
title: "Forcing a finalizer off skips cleanup and can leak billing resources or corrupt data"
type: finding
status: active
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
  - id: research-gap-m2-ownership-gc
    hash: 62aafaded9c0
    ingested: 2026-11-26
  - id: research-finalizers
    hash: ca11dffc241b
    ingested: 2026-11-25
  - id: research-pitfalls-and-case-studies
    hash: 9407913c2448
    ingested: 2026-11-25
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, finalizers, deletion, safety]
---

# Forcing a finalizer off skips cleanup and can leak billing resources or corrupt data

## Observation

Patching `metadata.finalizers` to empty, or editing a namespace's `/finalize` subresource, makes the object disappear, but it does not perform the cleanup that the finalizer guarded. Martin Heinz lists the consequences: backing storage in the cloud or other infrastructure may not get deleted and keeps billing, StatefulSets on shared storage risk data corruption, pods can keep running after the API object is gone, and namespaces can hang. Red Hat's guide says the same about the namespace procedure, and the Kubernetes documentation advises against manual removal unless the purpose is understood and met another way. [[sources/research-finalizers]]

## Why it keeps happening

The Terminating state looks like a defect, and the quickest way to clear it is to remove the finalizer. The finalizer is usually the only record that something outside the object still needs releasing, so removing it erases the reminder. The pitfall is a consequence of the design in [[concepts/finalizers]].

## Mitigations

Find the blocking finalizer, read the owning controller's source or logs to learn its purpose, and repair the underlying condition. If a force removal is unavoidable, clean up the external resource by hand afterward. See [[decisions/remove-a-stuck-finalizer-by-force-or-repair-the-owning-controller]].

## Evidence quality

The sources are practitioner and vendor blogs plus the official documentation. No named-company postmortem was found. See [[open-knowledge-gaps]].

## Related

[[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]], [[findings/destructive-deletion-of-external-resources]], [[examples/stuck-terminating-namespace-fixed-through-the-finalize-subresource]]

## Addition from the pitfalls dossier

The Red Hat troubleshooting guide presents force removal through the namespace `/finalize` subresource as the fix, and it does not stress that this can orphan the resources the finalizer was guarding, which matters most for cloud-backed resources. Crossplane's documentation takes the opposite design stance by keeping the finalizer until the external resource is really gone. No source quantified how often forced removal orphans resources. See [[concepts/pitfalls-and-case-studies]] and [[sources/research-pitfalls-and-case-studies]]. URL: https://www.redhat.com/en/blog/troubleshooting-terminating-namespaces.

## Addition from the GitOps incidents dossier

Still no rate: the Kubernetes finalizers page was re-read on 2026-11-26 and it warns that "forcefully removing them can lead to issues in your cluster" without a frequency, see [[findings/no-source-quantifies-how-often-forced-finalizer-removal-orphans-guarded-resources]]. Primary issues document orphaning by other routes, see [[findings/resources-are-orphaned-when-a-controller-misses-the-delete-or-the-finalizer-is-added-too-late]]. ACK issue 2911 shows the case where a manual patch is safe because the AWS resource was already gone, see [[examples/an-argo-cd-prune-left-an-ack-wafv2-webacl-terminating-on-its-finalizer-after-the-aws-resource-was-already-gone]]. Source: [[sources/research-gap-g1-gitops-drift-incidents]].

## Namespace-deletion evidence from Crossplane v2

Crossplane issue 7801 states that when a namespace is deleted and the credentials Secret goes first, "The only way out today is to remove finalizers by hand, which orphans the external resources." That is a statement in the issue, not a release note. Whether the same happens with the provider absent is not documented. [[sources/research-gap-m2-ownership-gc]] See [[examples/crossplane-issue-7801-asks-how-to-protect-provider-credentials-during-namespace-deletion-and-is-open-with-no-maintainer-reply]].

## A second failure class from the Kubernetes finalizers blog

The 2021 Kubernetes blog post adds an in-cluster failure class to the external-resource leaks above: forcing a namespace through the `finalize` subresource can leave orphan objects inside a namespace that no longer exists. It gives no frequency, so the question of how often forced removal orphans guarded resources stays open. See [[findings/forcing-namespace-finalization-can-leave-orphan-objects-in-a-namespace-that-no-longer-exists-and-recreating-the-namespace-may-bring-them-back]]. [[sources/kubernetes-finalizers-blog]]
