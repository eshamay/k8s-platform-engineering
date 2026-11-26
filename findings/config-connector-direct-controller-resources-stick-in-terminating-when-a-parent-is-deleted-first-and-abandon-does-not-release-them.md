---
title: Config Connector Direct-controller resources stick in Terminating when a parent is deleted first and abandon does not release them
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-other-tool-pitfalls
    hash: a942f0ae1b1b
    ingested: 2026-11-26
aliases: []
tags: [config-connector, deletion, finalizer, abandon, direct-controller, pitfall]
---

# Config Connector Direct-controller resources stick in Terminating when a parent is deleted first and abandon does not release them

## Observation

Config Connector issue 15930 (2026-11-17) says that resources managed by the Direct controller stick in Terminating when a referenced or parent object is deleted first. The reporter says `deletion-policy: abandon` "does not release the object either", because reference resolution and the GCP read run before the deletion check. The reporter reproduced it on v1.161.0, which is the reporter's statement. The issue was open on 2026-11-26. [[sources/research-gap-g1-other-tool-pitfalls]] URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/15930

## Why it matters for the abandon advice

The wiki's existing guidance is that the `abandon` annotation keeps the cloud resource and must be applied before the manifest is deleted ([[entities/config-connector]]). Issue 15930 describes a case where applying it does not help, so abandon is not a universal escape from a stuck delete. Delete children before parents, or check Direct-controller resources first when tearing down a stack. See [[findings/config-connector-has-no-terraform-style-dependency-graph-and-argo-cd-deletes-children-without-ordering]].

## A second abandon claim that is SECONDARY-ONLY

Issue 13335 (2026-09-20) says abandon leaves `managed-by-cnrm` and `cnrm-lease` labels on the Google Cloud resource. The reporter states that they did not reproduce it against a current release and took the description from older issue 146, which was closed as not planned. Treat it as second-hand. URL: https://github.com/GoogleCloudPlatform/k8s-config-connector/issues/13335

## Related

[[examples/config-connector-issue-15930-direct-controller-resources-stuck-terminating-after-a-parent-was-deleted-first]], [[findings/finalizers-strand-objects-in-terminating-when-the-controller-is-missing-or-failing]], [[comparisons/deletion-policies-across-gitops-and-provider-tools]]
