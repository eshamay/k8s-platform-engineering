---
title: Diff is not apply, so server defaults look like drift
type: finding
status: draft
created: 2026-11-25
updated: 2026-11-26
sources:
  - id: research-server-side-apply-and-field-ownership
    hash: 1f12c486354e
    ingested: 2026-11-25
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: []
tags: [pitfall, argo-cd, server-side-apply, diff, drift]
---

# Diff is not apply, so server defaults look like drift

## Observation

Turning on server-side apply changes how a tool writes, not how it compares. Argo CD's default diff compares Git-rendered manifests with live state in its own process, so fields that the API server defaults, such as `volumeMode` and `status.phase` in StatefulSet `volumeClaimTemplates`, appear as differences and keep the Application OutOfSync after a successful sync. [[sources/research-server-side-apply-and-field-ownership]]

## Mitigation and caveats

Server-Side Diff runs a dry-run apply for each resource and compares the results, and `kubectl diff --server-side` verifies the cause. It excludes changes made by mutating webhooks unless `IncludeMutationWebhook=true`, and it cannot dry-run resources that are being created, which fall back to the normal diff. The source is a personal blog that discloses AI assistance and claims stability since Argo CD 3.1.0, which was not verified. URL: https://blog.danielepetrollo.com/en/argocd-outofsync-server-side-diff.

## Related guidance

`ignoreDifferences` also silences the false drift but hides real drift, so the article prefers Server-Side Diff and keeps `ignoreDifferences` for fields a controller rewrites on purpose. Argo CD's proposal adds that an SSA sync always exercises admission controllers, even when the client sees no diff. See [[examples/argo-cd-server-side-diff-ends-false-out-of-sync-from-server-defaults]], [[findings/defaulting-and-drift-reconcile-loops]], [[findings/late-initialized-fields-create-false-drift]], and [[entities/argo-cd]].

## Update from the m4 dossier

Update 2026-11-26: Server-Side Diff is documented as stable since Argo CD v3.1.0, but open issues show it can also miss changes or stay permanently OutOfSync. See [[findings/argo-cd-documents-server-side-diff-as-stable-since-v3-1-0-while-the-issue-tracker-holds-many-open-bugs]]. [[sources/research-gap-m4-ssa-conflict-policy]]
