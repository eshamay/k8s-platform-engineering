---
title: No formal organization-authored postmortem of an operator failure was found
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-operator-loop-failures
    hash: baca2cdf965d
    ingested: 2026-11-26
aliases: []
tags: [evidence-gap, postmortem, operators, k8s-af, issue-level-evidence]
---

# No formal organization-authored postmortem of an operator failure was found

## Observation

The 2026-11-26 dossier searched for a published postmortem about a Kubernetes operator failure, such as stuck finalizers, CRD upgrade breakage, or a reconcile storm, and found none. The k8s.af index of about 60 public stories has no entry whose stated involvement is an operator or custom controller bug. The nearest entries are Jetstack's admission webhook outage and Xing's talk listing "stuck controllers", and the dossier did not read either in full. The Render informer post was unreadable, and its title suggests it concerns a DNS dependency. [[sources/research-gap-g1-operator-loop-failures]]

## What exists instead

The public record is GitHub issues with root-cause analysis, filed by users or contributors. The wiki records them as examples, for instance [[examples/longhorn-issue-14121-a-backup-target-outage-grew-longhorn-manager-memory-about-25-fold]] and [[examples/cluster-api-provider-rke2-issue-905-an-unconditional-status-patch-held-the-controller-at-about-ten-reconciles-per-second]]. Every impact figure in them is self-reported, and none comes from a vendor's incident process.

## Caveats

The web search tool returned empty results for the postmortem queries, so this absence is weak evidence. Earlier related gaps are recorded in [[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]] and [[findings/no-primary-postmortem-was-found-for-a-crd-deletion-cascade-or-an-etcd-quota-alarm]].

## Related

[[concepts/operator-pattern]], [[concepts/pitfalls-and-case-studies]], [[findings/the-pitfalls-dossier-rests-on-index-summaries-an-older-crossplane-version-and-few-primary-incident-reports]]
