---
title: The 2021 Kubernetes finalizers blog says kubectl cannot set the propagation policy while its own example uses cascade orphan
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: kubernetes-finalizers-blog
    hash: 31da0061e2fb
    ingested: 2026-11-26
aliases: []
tags: [propagation-policy, cascade, kubectl, kubernetes-blog, dated-claim, correction]
---

# The 2021 Kubernetes finalizers blog says kubectl cannot set the propagation policy while its own example uses cascade orphan

## Observation

The official Kubernetes blog post "Using Finalizers to Control Deletion" (Aaron Alpar, 2021-05-14) says the `--cascade` option "links to the propagation policy in the API", then says the propagation policy "cannot be specified on the command line using kubectl" and demonstrates a Background delete through `kubectl proxy` and `curl`. The same post runs `kubectl delete --cascade=orphan` and adds an update that from kubectl v1.20 the default cascade is background. [[sources/kubernetes-finalizers-blog]]

## How the wiki's record differs

The wiki records that the mode is chosen by `propagationPolicy` on the delete call or by `kubectl delete --cascade=background|foreground|orphan`, taken from the current Kubernetes documentation, see [[comparisons/background-foreground-and-orphan-propagation-modes]] and [[concepts/owner-references-and-garbage-collection]]. The post's sentence therefore disagrees with the wiki, and it also disagrees with the post's own `--cascade=orphan` example and its v1.20 note. The most likely reading is that the sentence was written before `--cascade` accepted the three string values, which the post's update note hints at, though the post does not say so.

## Resolution

The wiki keeps the current-documentation statement and treats the post's sentence as dated. This ingest did not test an old kubectl release. A reader who needs the version in which `--cascade` began to accept `background`, `foreground`, and `orphan` should check the kubectl release notes. The earlier dossier summaries of this post also misdescribed it, and those errors are corrected on [[sources/research-finalizers]] and [[sources/research-owner-references-and-garbage-collection]].
