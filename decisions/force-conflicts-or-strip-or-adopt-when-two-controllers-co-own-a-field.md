---
title: Force conflicts or strip-or-adopt when two controllers co-own a field
type: decision
status: active
created: 2026-11-26
updated: 2026-11-26
sources:
  - id: research-gap-m4-ssa-conflict-policy
    hash: 28e595eae3e0
    ingested: 2026-11-26
aliases: [force versus strip or adopt]
tags: [decision, server-side-apply, flux, argo-cd, conflict-policy, evidence-only]
---

# Force conflicts or strip-or-adopt when two controllers co-own a field

## Status

Open, and evidence-only. This page lists the options and the evidence for each. It makes no recommendation, because no source compares the policies and no experiment was run. [sources/research-gap-m4-ssa-conflict-policy](../sources/research-gap-m4-ssa-conflict-policy.md)

## Context

Two controllers sometimes legitimately write one field, for example a GitOps tool and an autoscaler that both touch `replicas`. The two policies differ in who loses writes. Argo CD's server-side apply mode forces, and Flux can strip or adopt per field. The Kubernetes documentation gives a third route.

## Options

**Option 1, force on every sync (Argo CD).** Argo CD runs `kubectl apply --server-side --force-conflicts` and ignores `Force=true` under server-side apply. The Kubernetes documentation says force "removes the field from all other managers' entries in `managedFields`", so the other controller's write is overwritten on the next sync unless the field is omitted from Git or the diff ignores it. A secondary blog adds that `ignoreDifferences` "only affects diff computation" and that `RespectIgnoreDifferences=true` is needed for the sync to honor it. That claim is SECONDARY-ONLY, because the body of the sync-options section was not read.

**Option 2, strip or adopt (Flux).** Strip removes the field from the apply payload when another Apply-type manager owns it, which "relinquishes the controller's ownership" and leaves the field with the other manager. Adopt copies the live value when Flux is the sole Apply-type owner and "preserves the current value without reverting changes made by Update-type operations". The Flux documentation also says "Changes to ignored fields alone do not trigger a reconciliation."

**Option 3, share ownership and hand over (Kubernetes documentation).** Both parties set the same value, and then one drops the field, as in the documented HPA handover. The documentation also says an Update-type write never fails on conflict.

## Evidence and limits

Strip applies only to Apply-type managers, so a controller that writes with Update, such as Config Connector's `cnrm-controller-manager`, would be covered by adopt and not strip. That is an inference from the Flux specification and Config Connector source and is not a statement by either project. The kube-green write-up reports that manager-scoped ignores depend on the other controller using server-side apply under a stable name. Forcing also has limits, since a forced apply failed in [examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port](../examples/kubernetes-issue-130292-a-forced-server-side-apply-could-not-revert-an-edited-service-port.md).

## Consequences

Choosing force keeps Git authoritative and risks silent loss of the other controller's writes. Choosing strip or adopt keeps the other controller's writes and means Git changes to the ignored field no longer apply, see [findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied](../findings/ignoring-a-field-in-flux-or-argo-cd-means-git-changes-to-it-are-no-longer-applied.md). The broader default-policy question is in [decisions/force-conflicts-or-surface-them-to-humans](force-conflicts-or-surface-them-to-humans.md), and the tools are compared in [comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights](../comparisons/flux-ignore-rules-versus-argo-cd-ignoredifferences-and-force-conflicts-for-drift-fights.md).
