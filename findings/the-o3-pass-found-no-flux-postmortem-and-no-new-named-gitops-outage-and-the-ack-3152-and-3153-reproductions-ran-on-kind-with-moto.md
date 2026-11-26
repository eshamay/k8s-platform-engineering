---
title: The o3 pass found no Flux postmortem and no new named GitOps outage, and the ACK 3152 and 3153 reproductions ran on kind with moto
type: finding
status: draft
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-o3-gitops-provider-managed
    hash: 55252dbb507a
    ingested: 2026-11-26
aliases: []
tags: [evidence-caveat, gitops, outages, adopters, ack, flux]
---

# The o3 pass found no Flux postmortem and no new named GitOps outage, and the ACK 3152 and 3153 reproductions ran on kind with moto

## Observation

This is an evidence caveat. The 2026-11-26 provider-managed pass searched for named GitOps outage write-ups and adopters and found no new first-party account. No Flux postmortem was found (UNVERIFIED as an absence claim, since several searches returned empty results). The one article read, an OnSiteReliability post dated 2025-03-15, lists Argo CD pruning and health-assessment failure modes and says "I have seen enough ArgoCD-related incidents to know that the failure modes are predictable", but it names no organization or incident, so it is SECONDARY-ONLY generic advice. URL: https://onsitereliability.com/How-to-avoid-ArgoCD-related-outages/. [[sources/research-gap-o3-gitops-provider-managed]]

The GitOps-triggered deletion and overwrite paths for provider objects in ACK issues 3153 and 3152 are anonymous reproductions on a local stack, not production incidents: issue 3152 says "Reproduced with iam-controller v1.11.3 (runtime v0.67.0), moto 5.1.22 as IAM". The Skyscanner 2021 outage and the Argo CD anonymous issues 6046, 20440, and 15441 are covered by earlier ingests and were not re-verified here.

## What this means for the gap

The only named, first-party GitOps outage in the wiki remains Skyscanner, see [[examples/skyscanner-s-2021-global-outage-an-incorrect-template-change-was-reconciled-by-argo-cd-into-deleting-478-services]]. Provider-object deletion under a GitOps agent is documented by project docs and reporter issues, and has no named production incident attached.

## Related

[[findings/no-named-organization-postmortem-was-found-for-a-gitops-revert-loop-a-gitops-outage-or-controller-retry-amplification]], [[examples/the-argo-cd-users-file-lists-452-self-reported-adopters]], [[examples/ack-issue-3153-pruning-a-custom-resource-from-git-deletes-the-aws-resource-irreversibly]], [[examples/ack-issue-3152-adoption-under-argo-cd-or-flux-overwrites-the-adopted-aws-resource-with-the-git-spec]]
