---
title: Handing replicas between Git and an HPA can reset the count or leave an application permanently out of sync
type: finding
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-g1-gitops-drift-incidents
    hash: 0a1a75f3cab5
    ingested: 2026-11-26
aliases: []
tags: [pitfall, hpa, replicas, flux, argo-cd, field-ownership, server-side-diff]
---

# Handing replicas between Git and an HPA can reset the count or leave an application permanently out of sync

## Observation

Two issues show the replica field misbehaving at the boundary between a GitOps tool and an HPA, in opposite directions. In Flux issue 2514 (2022), the first reconciliation over an HPA-managed Deployment dropped replicas to 1 and then restored them. A maintainer attributed it to a `replicas` field in Git fighting the HPA, and the reporter reproduced it without such a field and blamed the handoff of field ownership. In Argo CD issue 30398 (opened 2026-10-23, closed), an Application stayed OutOfSync forever under ServerSideDiff=true with IncludeMutationWebhook=true, because an `ignoreDifferences` entry covered a field whose live value differed from Git, and `metadata.generation` was the only diff. [[sources/research-gap-g1-gitops-drift-incidents]]

## What is and is not established

Both are reporter accounts. Issue 2514 is a transient scale-down and not an outage, and the dossier read the opening of issue 30398 and not its resolution. The permanent revert loop with an autoscaler is a separate, more severe case, see [[examples/flux-resetting-hpa-replicas-caused-a-sev2-scaling-loop-until-ignore-rules-existed]]. The dossier found no named-organization postmortem of a Flux or Argo CD revert loop with an autoscaler.

## Related

[[examples/flux-issue-2514-the-first-reconciliation-over-an-hpa-managed-deployment-reset-replicas-to-one]], [[findings/controllers-fighting-over-fields-cause-revert-loops]], [[examples/hpa-and-git-both-set-replicas-surface-an-ssa-conflict]], [[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]]
